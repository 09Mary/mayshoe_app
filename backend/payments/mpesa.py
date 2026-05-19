import base64
import logging
import requests
from datetime import datetime
from django.conf import settings

logger = logging.getLogger(__name__)


def get_access_token() -> str:
    url = f"{settings.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
    response = requests.get(
        url,
        auth=(settings.MPESA_CONSUMER_KEY, settings.MPESA_CONSUMER_SECRET),
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["access_token"]


def _build_password() -> tuple[str, str]:
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    raw = f"{settings.MPESA_SHORTCODE}{settings.MPESA_PASSKEY}{timestamp}"
    password = base64.b64encode(raw.encode()).decode()
    return password, timestamp


def normalize_phone(phone: str) -> str:
    """Normalise to Safaricom-required format 2547XXXXXXXX."""
    phone = phone.strip().replace(" ", "").replace("-", "")
    if phone.startswith("+"):
        phone = phone[1:]
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    if not phone.startswith("254"):
        phone = "254" + phone
    return phone


def initiate_stk_push(phone: str, amount: int, order_id: int) -> dict:
    access_token = get_access_token()
    password, timestamp = _build_password()

    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": phone,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": f"Order{order_id}",
        "TransactionDesc": f"Mayshoe Order #{order_id}",
    }

    response = requests.post(
        f"{settings.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest",
        json=payload,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()

    if data.get("ResponseCode") != "0":
        raise ValueError(f"STK push rejected: {data.get('ResponseDescription')}")

    return data