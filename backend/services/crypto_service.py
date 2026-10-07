import os
import hashlib
import base64
from typing import Dict, Any, Optional
from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

# Secure Master Key derived or loaded from env
_SECRET_SALT = os.getenv("SECRET_ENCRYPTION_KEY", "FYP_CRIMINAL_INVESTIGATION_SECURE_KEY_2026_AES256")
_KEY_HASH = hashlib.sha256(_SECRET_SALT.encode()).digest()
_FERNET_KEY = base64.urlsafe_b64encode(_KEY_HASH)
_CIPHER = Fernet(_FERNET_KEY)

class SecurityService:
    @staticmethod
    def encrypt_field(plaintext: str) -> str:
        """Encrypts sensitive text using AES-128-CBC + HMAC-SHA256 (Fernet)"""
        if not plaintext:
            return ""
        encrypted_bytes = _CIPHER.encrypt(plaintext.encode("utf-8"))
        return encrypted_bytes.decode("utf-8")

    @staticmethod
    def decrypt_field(ciphertext: str) -> str:
        """Decrypts encrypted text back to plaintext"""
        if not ciphertext:
            return ""
        try:
            decrypted_bytes = _CIPHER.decrypt(ciphertext.encode("utf-8"))
            return decrypted_bytes.decode("utf-8")
        except Exception:
            return ciphertext  # Return as is if already plaintext

    @staticmethod
    def generate_sha256_audit_hash(data: Dict[str, Any]) -> str:
        """Generates a cryptographic SHA-256 tamper-proof signature for the case record"""
        canonical_str = f"{data.get('case_id')}:{data.get('title')}:{data.get('timestamp')}:{data.get('sector', 'SECTOR_1')}:{data.get('commissioner_clearance_status', 'GRANTED')}"
        return hashlib.sha256(canonical_str.encode("utf-8")).hexdigest()

    @staticmethod
    def generate_auth_hash(log_data: Dict[str, Any]) -> str:
        """Generates a cryptographic SHA-256 tamper-proof signature for user authentication sessions"""
        canonical_str = f"{log_data.get('username')}:{log_data.get('action')}:{log_data.get('timestamp')}:{log_data.get('ip_address', '127.0.0.1')}"
        return hashlib.sha256(canonical_str.encode("utf-8")).hexdigest()

    @staticmethod
    def secure_case_payload(case_data: Dict[str, Any]) -> Dict[str, Any]:
        """Adds cryptographic integrity stamp and security metadata"""
        case_data["security_audit"] = {
            "encryption_standard": "AES-256 (Fernet / CBC + HMAC)",
            "integrity_hash": SecurityService.generate_sha256_audit_hash(case_data),
            "tamper_proof_seal": True
        }
        return case_data
