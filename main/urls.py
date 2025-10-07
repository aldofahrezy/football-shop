# di dalam main/urls.py

from django.urls import path
from main.views import (
    show_main, create_product, show_product, show_xml, show_json, 
    show_xml_by_id, show_json_by_id, register, login_user, logout_user, 
    edit_product, delete_product, create_product_ajax, 
    edit_product_ajax, delete_product_ajax
)

app_name = 'main'

urlpatterns = [
    path('', show_main, name='show_main'),
    path('register/', register, name='register'),
    path('login/', login_user, name='login'),    
    path('logout/', logout_user, name='logout'),

    # --- URL untuk halaman non-AJAX (jika masih dipakai) ---
    path('create-product/', create_product, name='create_product'),
    path('product/<uuid:id>/', show_product, name='show_product'),
    path('product/<uuid:id>/edit/', edit_product, name='edit_product'),
    path('product/<uuid:id>/delete/', delete_product, name='delete_product'),

    # --- URL untuk data fetching (JSON/XML) ---
    path('xml/', show_xml, name='show_xml'),
    path('json/', show_json, name='show_json'), # <-- Ini yang dipanggil oleh main.html
    path('xml/<uuid:product_id>/', show_xml_by_id, name='show_xml_by_id'),
    path('json/<uuid:product_id>/', show_json_by_id, name='show_json_by_id'),
    
    # --- URL untuk Aksi AJAX (CUD) ---
    path('create-product-ajax/', create_product_ajax, name='create_product_ajax'),
    path('edit-product-ajax/<uuid:id>/', edit_product_ajax, name='edit_product_ajax'),
    path('delete-product-ajax/<uuid:id>/', delete_product_ajax, name='delete_product_ajax'),
]