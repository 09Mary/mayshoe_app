
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def pay(request):
    method = request.data.get("method")

    if method not in ["mpesa", "paypal", "airtel"]:
        return Response({"error": "Invalid payment method"})

    return Response({
        "status": "success",
        "message": f"{method} payment simulated"
    })