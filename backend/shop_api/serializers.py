from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant, Cart, CartItem, Order, OrderItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text']

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'color', 'stock', 'price_adjustment']

class ProductSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'stock', 
                  'category', 'category_slug', 'category_name', 'is_active',
                  'images', 'variants']

class CartItemSerializer(serializers.ModelSerializer):
    product_variant = ProductVariantSerializer(read_only=True)
    product_variant_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(), source='product_variant', write_only=True
    )
    product_name = serializers.CharField(source='product_variant.product.name', read_only=True)
    product_image = serializers.ImageField(source='product_variant.product.image', read_only=True)
    price = serializers.DecimalField(source='product_variant.product.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product_variant', 'product_variant_id', 'quantity', 'product_name', 'product_image', 'price']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price']

    def get_total_price(self, obj):
        total = sum(item.quantity * item.product_variant.product.price for item in obj.items.all())
        return total
