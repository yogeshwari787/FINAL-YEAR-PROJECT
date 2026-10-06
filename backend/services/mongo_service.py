import os
import json
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional

logger = logging.getLogger("mongo_service")

class MongoService:
    def __init__(self, uri: Optional[str] = None):
        self.uri = uri or os.getenv("MONGO_URI", "mongodb://localhost:27017")
        self.db_name = os.getenv("MONGO_DB", "crime_investigation_db")
        self.use_mongo = False
        self.client = None
        self.db = None
        
        # Fallback persistent storage path
        self.storage_dir = Path(__file__).resolve().parent.parent / "uploads" / "db_store"
        self.storage_dir.mkdir(parents=True, exist_ok=True)

        try:
            from pymongo import MongoClient
            self.client = MongoClient(self.uri, serverSelectionTimeoutMS=2000)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[self.db_name]
            self.use_mongo = True
            logger.info("Connected successfully to local MongoDB instance!")
        except Exception as e:
            logger.warning(f"Local MongoDB not connected ({e}). Using local file JSON db fallback.")
            self.use_mongo = False

    def insert_or_update_case(self, case_id: str, case_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Stores or updates case details, suspect prediction, and reconstruction video metadata in MongoDB.
        """
        case_data["case_id"] = case_id
        
        if self.use_mongo:
            try:
                self.db.cases.update_one(
                    {"case_id": case_id},
                    {"$set": case_data},
                    upsert=True
                )
                logger.info(f"Updated case {case_id} in MongoDB collection 'cases'.")
                return case_data
            except Exception as e:
                logger.error(f"MongoDB write failed: {e}")

        # Local JSON Fallback
        file_path = self.storage_dir / f"case_{case_id}.json"
        with open(file_path, "w") as f:
            json.dump(case_data, f, indent=2)
        return case_data

    def get_case(self, case_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches case by ID from MongoDB (or local fallback).
        """
        if self.use_mongo:
            try:
                data = self.db.cases.find_one({"case_id": case_id}, {"_id": 0})
                if data:
                    return data
            except Exception as e:
                logger.error(f"MongoDB read failed: {e}")

        # Local JSON Fallback
        file_path = self.storage_dir / f"case_{case_id}.json"
        if file_path.exists():
            with open(file_path, "r") as f:
                return json.load(f)
        return None

    def list_cases(self) -> List[Dict[str, Any]]:
        """
        Lists all cases in the investigator dashboard.
        """
        if self.use_mongo:
            try:
                return list(self.db.cases.find({}, {"_id": 0}))
            except Exception as e:
                logger.error(f"MongoDB list failed: {e}")

        # Local JSON Fallback
        cases = []
        for file_path in self.storage_dir.glob("case_*.json"):
            try:
                with open(file_path, "r") as f:
                    cases.append(json.load(f))
            except Exception:
                pass
        return cases
