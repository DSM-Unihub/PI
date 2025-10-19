# crypto_utils.py
import os
import tempfile
import secrets
import hmac
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# Carregar chaves do ambiente (ideal: vir de KMS/Vault)
FILE_ENC_KEY_HEX = os.getenv("FILE_ENC_KEY")
if not FILE_ENC_KEY_HEX:
    raise RuntimeError("Defina FILE_ENC_KEY no .env (32 bytes hex).")
FILE_ENC_KEY = bytes.fromhex(FILE_ENC_KEY_HEX)  # 32 bytes para AES-256-GCM


FILENAME_HMAC_SECRET = os.getenv("FILENAME_HMAC_SECRET", "fallback-secret")
FILENAME_HMAC_SECRET_BYTES = FILENAME_HMAC_SECRET.encode()

# Gera filename seguro (HMAC-SHA256) + short UUID para evitar overwrite
def filename_from_url(url: str, unique_len: int = 8) -> str:
    sig = hmac.new(FILENAME_HMAC_SECRET_BYTES, url.encode("utf-8"), hashlib.sha256).hexdigest()
    unique = secrets.token_hex(unique_len // 2) if unique_len else ""
    if unique:
        return f"{sig}-{unique}.enc"
    return f"{sig}.enc"

# Criptografa e escreve atomically (nonce + ciphertext)
def encrypt_and_atomic_write(path: str, content: bytes):
    aesgcm = AESGCM(FILE_ENC_KEY)
    nonce = secrets.token_bytes(12)  # 96-bit nonce para AES-GCM
    ciphertext = aesgcm.encrypt(nonce, content, associated_data=None)  # inclui tag
    payload = nonce + ciphertext

    dirpath = os.path.dirname(path) or "."
    os.makedirs(dirpath, exist_ok=True)

    fd, tmp = tempfile.mkstemp(dir=dirpath)
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(payload)
            f.flush()
            os.fsync(f.fileno())
        # replace é atômico na maioria dos sistemas
        os.replace(tmp, path)
        os.chmod(path, 0o600)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)

def decrypt_from_file(path: str) -> bytes:
    with open(path, "rb") as f:
        data = f.read()
    if len(data) < 13:
        raise ValueError("Arquivo inválido ou corrompido")
    nonce = data[:12]
    ciphertext = data[12:]
    aesgcm = AESGCM(FILE_ENC_KEY)
    return aesgcm.decrypt(nonce, ciphertext, associated_data=None)
