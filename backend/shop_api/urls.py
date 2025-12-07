from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryList, ProductList, ProductDetail, RegisterView, UserProfileView
from .views_cart import CartView, CartItemViewSet
from . import views_admin

router = DefaultRouter()
router.register(r'cart/items', CartItemViewSet, basename='cart-items')

# Admin router
admin_router = DefaultRouter()
admin_router.register(r'products', views_admin.AdminProductViewSet, basename='admin-product')
admin_router.register(r'users', views_admin.AdminUserViewSet, basename='admin-user')

urlpatterns = [
    path('', include(router.urls)),
    path('cart/', CartView.as_view(), name='user-cart'),
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('products/', ProductList.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetail.as_view(), name='product-detail'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('users/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # Admin endpoints
    path('admin/', include(admin_router.urls)),
    path('admin/stats/', views_admin.admin_stats, name='admin-stats'),
    path('admin/activity/', views_admin.admin_recent_activity, name='admin-activity'),
    path('admin/categories/', views_admin.admin_categories, name='admin-categories'),
]
