from django.urls import path
from .views import GeneratePasswordView,SendPasswordView

urlpatterns = [
    path('generate-password/', GeneratePasswordView.as_view(), name='generate_password'),
    path('send-password-to-email/', SendPasswordView.as_view(), name='send_password'),

]
