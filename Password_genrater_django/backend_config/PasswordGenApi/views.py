from rest_framework import views, status
from rest_framework.response import Response
import random
import string
from .emails import send_password_to_email
from .serializers import EmailAndPasswordSerializer


class GeneratePasswordView(views.APIView):
    def post(self, request):
        try:
            length = request.data.get("length", 12)
            print(length)
            complexity = request.data.get(
                "complexity", ["uppercase", "lowercase", "numbers", "special"]
            )

            if not complexity:
                complexity = ["uppercase", "lowercase", "numbers", "special"]

            if not isinstance(length, int) or not isinstance(complexity, list):
                return Response(
                    {"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST
                )

            characters = ""
            if "uppercase" in complexity:
                characters += string.ascii_uppercase
            if "lowercase" in complexity:
                characters += string.ascii_lowercase
            if "numbers" in complexity:
                characters += string.digits 
            if "special" in complexity:
                characters += string.punctuation
            if "emojis" in complexity:
                characters += "😀😍🔒🌟🎉🚀🔑"
            if "math" in complexity:
                characters += "+-*/=^"

            password = "".join(random.choice(characters) for i in range(length))

            response = {
                "password": password,
                "message": "password created successfully",
                "status": "success",
            }

            return Response(response, status=status.HTTP_201_CREATED)

        except Exception as e:
            response = {
                "error": f"An error occurred: {str(e)}",
                "message": "Password generation failed",
                "status": "error",
            }
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SendPasswordView(views.APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = EmailAndPasswordSerializer(data=data)

            if serializer.is_valid():
                email = serializer.data["email"]
                password = serializer.data["password"]

                send_password_to_email(email=email, password=password)

                response = {
                    "message": "Password sent to email successfully",
                    "status": "success",
                }
                return Response(response, status=status.HTTP_200_OK)
            else:
                response = {
                    "data": serializer.errors,
                    "message": "Something went wrong. Please retry.",
                    "status": "fail",
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            response = {
                "message": f"An error occurred: {str(e)}",
                "status": "error",
            }
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
