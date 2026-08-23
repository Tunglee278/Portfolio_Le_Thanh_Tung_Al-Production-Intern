from flask import jsonify


def register_error_handlers(app, max_upload_mb: int) -> None:
    @app.errorhandler(413)
    def upload_too_large(_error):
        return jsonify(error=f"File exceeds the {max_upload_mb} MB upload limit."), 413
