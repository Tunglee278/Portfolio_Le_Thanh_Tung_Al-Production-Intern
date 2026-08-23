import json
import os
from datetime import datetime, timezone
from functools import lru_cache

from bson import ObjectId
from flask import Blueprint, current_app, jsonify, request
from pymongo import MongoClient
from pymongo.errors import PyMongoError


food_blueprint = Blueprint("food", __name__, url_prefix="/v1/food")


@lru_cache(maxsize=1)
def _database():
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise RuntimeError("MONGO_URI is not configured.")
    client = MongoClient(
        mongo_uri,
        serverSelectionTimeoutMS=int(os.getenv("MONGO_TIMEOUT_MS", "5000")),
        appname="le-thanh-tung-portfolio",
    )
    client.admin.command("ping")
    return client[os.getenv("FOOD_DB_NAME", "TungFoodDB")]


def _serialize(document: dict) -> dict:
    result = dict(document)
    if "_id" in result:
        result["id"] = str(result.pop("_id"))
    for key, value in list(result.items()):
        if isinstance(value, datetime):
            result[key] = value.astimezone(timezone.utc).isoformat()
        elif isinstance(value, ObjectId):
            result[key] = str(value)
    return result


def _database_unavailable(error: Exception):
    current_app.logger.warning("Food database unavailable: %s", error)
    return jsonify(error="Food database is not configured or is temporarily unavailable."), 503


@food_blueprint.get("/products")
def list_products():
    try:
        limit = min(max(request.args.get("limit", 50, type=int), 1), 100)
        category = request.args.get("category", "").strip()
        query = {"category": category} if category else {}
        products = [_serialize(item) for item in _database().products.find(query).limit(limit)]
        return jsonify(items=products, count=len(products))
    except (RuntimeError, PyMongoError) as error:
        return _database_unavailable(error)


@food_blueprint.post("/orders")
def create_order():
    payload = request.get_json(silent=True) or {}
    required_fields = ("customerName", "phone", "address", "cartItems", "totalPrice")
    missing = [field for field in required_fields if payload.get(field) in (None, "", [])]
    if missing:
        return jsonify(error="Missing required fields.", fields=missing), 400

    try:
        total_price = float(payload["totalPrice"])
    except (TypeError, ValueError):
        return jsonify(error="totalPrice must be a number."), 400
    if total_price < 0:
        return jsonify(error="totalPrice cannot be negative."), 400

    cart_items = payload["cartItems"]
    if isinstance(cart_items, (list, dict)):
        cart_items = json.dumps(cart_items, ensure_ascii=False)

    order = {
        "customerName": str(payload["customerName"]).strip()[:120],
        "phone": str(payload["phone"]).strip()[:30],
        "address": str(payload["address"]).strip()[:300],
        "cartItems": str(cart_items)[:10000],
        "totalPrice": total_price,
        "status": "Chờ xử lý",
        "createdAt": datetime.now(timezone.utc),
    }

    try:
        result = _database().orders.insert_one(order)
        return jsonify(message="Order created successfully.", orderId=str(result.inserted_id)), 201
    except (RuntimeError, PyMongoError) as error:
        return _database_unavailable(error)


@food_blueprint.get("/analytics/summary")
def analytics_summary():
    try:
        database = _database()
        totals = list(
            database.orders.aggregate(
                [{"$group": {"_id": None, "orders": {"$sum": 1}, "revenue": {"$sum": "$totalPrice"}}}]
            )
        )
        summary = totals[0] if totals else {"orders": 0, "revenue": 0}
        summary.pop("_id", None)

        categories = list(
            database.products.aggregate(
                [
                    {"$group": {"_id": "$category", "products": {"$sum": 1}}},
                    {"$sort": {"products": -1}},
                ]
            )
        )
        return jsonify(
            orders=int(summary.get("orders", 0)),
            revenue=float(summary.get("revenue", 0)),
            products=database.products.count_documents({}),
            categories=[
                {"category": item.get("_id") or "Khác", "products": item["products"]}
                for item in categories
            ],
        )
    except (RuntimeError, PyMongoError) as error:
        return _database_unavailable(error)
