import os
from dataclasses import dataclass
from typing import Any, Optional

import certifi
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

from app.config.logging_config import logger


@dataclass
class MongoConnectionStatus:
    connected: bool
    database_name: str
    message: str
    uri_masked: str


class MongoStore:
    def __init__(self):
        self.uri = os.getenv("MONGODB_URI", "").strip()
        self.database_name = (
            os.getenv("DATABASE_NAME", "")
            or os.getenv("MONGODB_DB", "")
            or "agripilot"
        ).strip() or "agripilot"
        self.client: Optional[MongoClient] = None
        self.database: Optional[Database] = None
        self.connected = False
        self.message = "MongoDB not configured"
        self._connect()

    def _mask_uri(self, uri: str) -> str:
        if not uri:
            return "NONE"
        if "@" in uri:
            prefix, suffix = uri.split("@", 1)
            return f"{prefix[:18]}...@{suffix[:24]}"
        return f"{uri[:24]}..."

    def _build_client(self, allow_invalid_certs: bool = False) -> MongoClient:
        options: dict[str, Any] = {
            "serverSelectionTimeoutMS": 5000,
            "connectTimeoutMS": 5000,
            "socketTimeoutMS": 5000,
        }
        if allow_invalid_certs:
            options["tlsInsecure"] = True
        else:
            options["tlsCAFile"] = certifi.where()
        return MongoClient(self.uri, **options)

    def _validate_database_access(self) -> None:
        if self.database is None:
            raise RuntimeError("MongoDB database not initialized")
        self.database.list_collection_names()

    def _connect(self) -> None:
        if not self.uri:
            self.message = "MongoDB URI missing"
            logger.warning("[MongoStore] MongoDB URI not configured. Using in-memory fallback.")
            return

        masked = self._mask_uri(self.uri)
        logger.info(
            f"[MongoStore] Connecting to MongoDB database={self.database_name} uri={masked}"
        )

        try:
            self.client = self._build_client(False)
            self.client.admin.command("ping")
            self.database = self.client[self.database_name]
            self._validate_database_access()
            self.connected = True
            self.message = "CONNECTED_OK"
            logger.info("[MongoStore] MongoDB connectivity successful.")
            return
        except Exception as exc:
            logger.warning(
                f"[MongoStore] MongoDB certificate/connection check failed: {exc}. "
                "Retrying with local-dev TLS fallback."
            )

        try:
            self.client = self._build_client(True)
            self.client.admin.command("ping")
            self.database = self.client[self.database_name]
            self._validate_database_access()
            self.connected = True
            self.message = "CONNECTED_OK_TLS_FALLBACK"
            logger.info("[MongoStore] MongoDB connectivity successful via TLS fallback.")
        except Exception as exc:
            self.client = None
            self.database = None
            self.connected = False
            self.message = f"MongoDB connection failed: {exc}"
            logger.error(f"[MongoStore] Unable to connect to MongoDB: {exc}")

    def status(self) -> MongoConnectionStatus:
        return MongoConnectionStatus(
            connected=self.connected,
            database_name=self.database_name,
            message=self.message,
            uri_masked=self._mask_uri(self.uri),
        )

    def collection(self, name: str) -> Optional[Collection]:
        if self.database is None:
            return None
        return self.database[name]
