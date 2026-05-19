import logging
from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Payment
from .serializers import PaymentSerializer
from . import mpesa

logger = logging.getLogger(__name__)


class PaymentCreateView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        phone = mpesa.normalize_phone(serializer.validated_data["phone"])
        order = serializer.validated_data["order"]
        amount = int(serializer.validated_data["amount"])

        payment = serializer.save(user=self.request.user, status="PENDING")

        try:
            result = mpesa.initiate_stk_push(phone=phone, amount=amount, order_id=order.id)
            payment.mpesa_checkout_request_id = result["CheckoutRequestID"]
            payment.save(update_fields=["mpesa_checkout_request_id"])
        except Exception as exc:
            logger.error("STK push failed for payment %s: %s", payment.id, exc)
            payment.status = "FAILED"
            payment.save(update_fields=["status"])
            raise


class PaymentCallbackView(APIView):
    """Safaricom posts the STK result here — no auth headers sent by their servers."""
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            stk = request.data.get("Body", {}).get("stkCallback", {})
            checkout_request_id = stk.get("CheckoutRequestID")
            result_code = stk.get("ResultCode")

            payment = Payment.objects.select_related("order").get(
                mpesa_checkout_request_id=checkout_request_id
            )

            if result_code == 0:
                items = {
                    item["Name"]: item.get("Value")
                    for item in stk.get("CallbackMetadata", {}).get("Item", [])
                }
                with transaction.atomic():
                    payment.status = "SUCCESS"
                    payment.mpesa_receipt_number = items.get("MpesaReceiptNumber", "")
                    payment.save(update_fields=["status", "mpesa_receipt_number"])
                    payment.order.status = "paid"
                    payment.order.save(update_fields=["status"])
            else:
                payment.status = "FAILED"
                payment.save(update_fields=["status"])
                logger.info(
                    "Payment %s failed — M-Pesa ResultCode %s: %s",
                    payment.id, result_code, stk.get("ResultDesc"),
                )

        except Payment.DoesNotExist:
            logger.warning("Callback for unknown CheckoutRequestID: %s", checkout_request_id)
        except Exception as exc:
            logger.error("Callback processing error: %s", exc)

        # Safaricom requires this exact response shape
        return Response({"ResultCode": 0, "ResultDesc": "Accepted"})


class PaymentStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id, user=request.user)
        except Payment.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "status": payment.status,
            "receipt": payment.mpesa_receipt_number,
        })