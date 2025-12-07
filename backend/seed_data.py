import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bk_project.settings')
django.setup()

from shop_api.models import Category, Product, ProductImage, ProductVariant
from django.core.files.base import ContentFile

def seed():
    # Clear existing
    Product.objects.all().delete()
    Category.objects.all().delete()

    print("Creating Categories...")
    cat_dresses = Category.objects.create(name="Dresses", slug="dresses")
    cat_tops = Category.objects.create(name="Tops", slug="tops")
    cat_accessories = Category.objects.create(name="Accessories", slug="accessories")

    print("Creating Products...")
    
    # 1. Golden Evening Gown
    p1 = Product.objects.create(
        category=cat_dresses,
        name="Golden Evening Gown",
        description="A stunning floor-length gold gown perfect for galas. Features intricate beadwork and a flattering silhouette.",
        price=120.00,
        stock=10
    )
    # Variants for p1
    ProductVariant.objects.create(product=p1, size="S", color="Gold", stock=3)
    ProductVariant.objects.create(product=p1, size="M", color="Gold", stock=5)
    ProductVariant.objects.create(product=p1, size="L", color="Gold", stock=2)

    # 2. Black Velvet Mini
    p2 = Product.objects.create(
        category=cat_dresses,
        name="Black Velvet Mini",
        description="Chic black velvet mini dress. Ideal for cocktail parties.",
        price=85.00,
        stock=15
    )
    ProductVariant.objects.create(product=p2, size="S", color="Black", stock=5)
    ProductVariant.objects.create(product=p2, size="M", color="Black", stock=5)

    # 3. Silk Blouse
    p3 = Product.objects.create(
        category=cat_tops,
        name="Silk Blouse",
        description="Luxurious silk blouse in champagne gold.",
        price=55.00,
        stock=20
    )
    ProductVariant.objects.create(product=p3, size="One Size", color="Champagne", stock=20)

    # 4. Gold Clutch
    p4 = Product.objects.create(
        category=cat_accessories,
        name="Gold Clutch",
        description="Elegant gold clutch bag.",
        price=45.00,
        stock=5
    )

    print("Seeding Complete.")

if __name__ == "__main__":
    seed()
