from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count
from .models import Product, ProductVariant, ProductImage, Category, Cart, CartItem
from .serializers import ProductSerializer, CategorySerializer
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class IsStaffUser(permissions.BasePermission):
    """
    Custom permission to only allow staff users to access admin endpoints.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


@api_view(['GET'])
@permission_classes([IsStaffUser])
def admin_stats(request):
    """
    Dashboard statistics for admin panel.
    """
    total_products = Product.objects.filter(is_active=True).count()
    total_users = User.objects.count()
    
    # Calculate total cart items as a proxy for "orders"
    total_cart_items = CartItem.objects.count()
    
    # Calculate approximate revenue from cart items
    # Note: ProductVariant uses price_adjustment, base price is from Product
    total_revenue = 0
    for item in CartItem.objects.select_related('product_variant__product'):
        base_price = float(item.product_variant.product.price)
        adjustment = float(item.product_variant.price_adjustment)
        final_price = base_price + adjustment
        total_revenue += final_price * item.quantity
    
    # Recent activity - last 7 days
    week_ago = timezone.now() - timedelta(days=7)
    new_users_this_week = User.objects.filter(date_joined__gte=week_ago).count()
    
    stats = {
        'total_products': total_products,
        'total_users': total_users,
        'total_orders': total_cart_items,  # Placeholder
        'total_revenue': total_revenue,
        'new_users_this_week': new_users_this_week,
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([IsStaffUser])
def admin_recent_activity(request):
    """
    Recent activity feed for admin dashboard.
    """
    # Get recent cart additions as activity
    recent_carts = CartItem.objects.select_related(
        'cart__user', 'product_variant__product'
    ).order_by('-id')[:10]
    
    activity = []
    for item in recent_carts:
        activity.append({
            'id': item.id,
            'type': 'cart_addition',
            'user': item.cart.user.username,
            'product': item.product_variant.product.name,
            'timestamp': item.cart.updated_at,
        })
    
    return Response(activity)


class AdminProductViewSet(viewsets.ModelViewSet):
    """
    Admin-only product management with full CRUD operations.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsStaffUser]
    
    def get_queryset(self):
        # Include inactive products for admin
        return Product.objects.all().order_by('-created_at')


class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Admin-only user management.
    """
    queryset = User.objects.all()
    permission_classes = [IsStaffUser]
    
    def get_serializer_class(self):
        from .auth_serializers import UserSerializer
        return UserSerializer
    
    def get_queryset(self):
        return User.objects.all().order_by('-date_joined')
    
    def partial_update(self, request, *args, **kwargs):
        """
        Allow admin to update user staff/superuser status.
        """
        user = self.get_object()
        
        if 'is_staff' in request.data:
            user.is_staff = request.data['is_staff']
        
        if 'is_active' in request.data:
            user.is_active = request.data['is_active']
        
        user.save()
        
        serializer = self.get_serializer(user)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsStaffUser])
def admin_categories(request):
    """
    Get all categories for admin management.
    """
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)
