from django.core.mail import send_mail
from django.conf import settings

def send_password_to_email(email, password):
    subject = "Your newly generated password"
    message = f"Hi, This is your newly generated password from fortifykey: {password}."
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=True,
    )