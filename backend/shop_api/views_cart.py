from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, ProductVariant
from .serializers import CartSerializer, CartItemSerializer

class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return CartItem.objects.filter(cart=cart)

    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        variant = serializer.validated_data['product_variant']
        
        # Check if item already exists in cart, then update quantity
        existing_item = CartItem.objects.filter(cart=cart, product_variant=variant).first()
        if existing_item:
            existing_item.quantity += serializer.validated_data.get('quantity', 1)
            existing_item.save()
        else:
            serializer.save(cart=cart)
