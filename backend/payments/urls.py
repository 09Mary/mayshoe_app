from django.urls import path
from .views import PaymentCreateView, PaymentCallbackView, PaymentStatusView

urlpatterns = [
    path('', PaymentCreateView.as_view()),
    path('callback/', PaymentCallbackView.as_view()),
    path('<int:payment_id>/status/', PaymentStatusView.as_view()),
]