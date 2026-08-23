from flask_cors import CORS


def configure_cors(app, allowed_origins: list[str]) -> None:
    CORS(
        app,
        resources={r"/v1/*": {"origins": allowed_origins}},
        supports_credentials=False,
    )
