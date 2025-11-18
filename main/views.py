import datetime
import requests
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core import serializers
from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils.html import strip_tags
import json

from main.forms import ProductForm
from main.models import Product

# Create your views here.
@login_required(login_url='/login')
def show_main(request):
  # filter_type = request.GET.get("filter", "all")  # default 'all'

  # if filter_type == "all":
  #   product_list = Product.objects.all()
  # else:
  #   product_list = Product.objects.filter(user=request.user)

  context = {
    'project_name': 'The Kickoff Zone',
    'npm' : '2406423055',
    'name': 'Muhammad Aldo Fahrezy',
    'class': 'PBP C',
    # 'product_list': product_list,
    'last_login': request.COOKIES.get('last_login', 'Never'),
    # 'active_filter': filter_type,
  }

  return render(request, "main.html", context)

@login_required(login_url='/login')
def create_product(request):
  form = ProductForm(request.POST or None)

  if form.is_valid() and request.method == "POST":
    product_entry = form.save(commit=False)
    product_entry.user = request.user
    product_entry.save()
    return redirect('main:show_main')

  context = {'form': form}
  return render(request, "create_product.html", context) 

@login_required(login_url='/login')
def show_product(request, id):
  product = get_object_or_404(Product, pk=id)
  product.increment_views()

  context = {
      'product': product
  }

  return render(request, "product_details.html", context)

def edit_product(request, id):
  product = get_object_or_404(Product, pk=id)
  form = ProductForm(request.POST or None, instance=product)
  if form.is_valid() and request.method == 'POST':
    form.save()
    return redirect('main:show_product', id=id)

  context = {
    'product': product,
    'form': form
  }

  return render(request, "edit_product.html", context)

def delete_product(request, id):
  product = get_object_or_404(Product, pk=id)
  product.delete()
  return HttpResponseRedirect(reverse('main:show_main'))

def show_xml(request):
  product_list = Product.objects.all()
  xml_data = serializers.serialize("xml", product_list)
  return HttpResponse(xml_data, content_type="application/xml")

def show_json(request):
  product_list = Product.objects.all()
  data = [
    {
      'id': str(product.id),
      'name': product.name,
      'description': product.description,
      'category': product.category,
      'price': product.price,
      'thumbnail': product.thumbnail,
      'product_views': product.product_views,
      'created_at': product.created_at.isoformat() if product.created_at else None,
      'is_featured': product.is_featured,
      'user_id': product.user_id,
    }
    for product in product_list
  ]

  return JsonResponse(data, safe=False)

def show_xml_by_id(request, product_id):
  try:
    product_item = Product.objects.filter(pk=product_id)
    xml_data = serializers.serialize("xml", product_item)
    return HttpResponse(xml_data, content_type="application/xml")
  except Product.DoesNotExist:
    return HttpResponse(status=404)

def show_json_by_id(request, product_id):
  try:
    product = Product.objects.select_related('user').get(pk=product_id)
    data = {
      'id': str(product.id),
      'name': product.name,
      'description': product.description,
      'category': product.category,
      'price': product.price,
      'thumbnail': product.thumbnail,
      'product_views': product.product_views,
      'created_at': product.created_at.isoformat() if product.created_at else None,
      'is_featured': product.is_featured,
      'user_id': product.user_id,
      'user_username': product.user.username if product.user_id else None,
    }
    return JsonResponse(data)
  except Product.DoesNotExist:
    return JsonResponse({'detail': 'Not found'}, status=404)
    
def register(request):
  form = UserCreationForm()

  if request.method == "POST":
    form = UserCreationForm(request.POST)
    if form.is_valid():
      form.save()
      messages.success(request, 'Your account has been successfully created!')
      return redirect('main:login')
  context = {'form':form}
  return render(request, 'register.html', context)

def login_user(request):

  if request.user.is_authenticated:
    return redirect('main:show_main')
  
  if request.method == 'POST':
    form = AuthenticationForm(data=request.POST)

    if form.is_valid():
      user = form.get_user()
      login(request, user)
      response = HttpResponseRedirect(reverse("main:show_main"))
      response.set_cookie('last_login', str(datetime.datetime.now()))
      return response

  else:
    form = AuthenticationForm(request)

  context = {'form': form}
  return render(request, 'login.html', context)

def logout_user(request):
  logout(request)
  response = HttpResponseRedirect(reverse('main:login'))
  response.delete_cookie('last_login')
  return redirect('main:login')

# === CRUD AJAX ====

# @csrf_exempt # tidak digunakan karena berbahaya, website jadi rentan serangan csrf. Sebaliknya, saya handle csrf token ini di main
# @require_POST
@login_required(login_url='/login') # Tetap gunakan ini untuk keamanan
def create_product_ajax(request):
  # Pengganti decorator @require_POST
  if request.method == 'POST':
    form = ProductForm(request.POST)
    if form.is_valid():
      product = form.save(commit=False)
      product.user = request.user
      product.save()

      new_product_data = {
        'id': str(product.id),
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'thumbnail': product.thumbnail,
        'user_id': product.user.id,
      }

      return JsonResponse({'status': 'success', 'product': new_product_data}, status=201)
    else:
      return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)

  return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@login_required(login_url='/login')
def edit_product_ajax(request, id):

  if request.method == 'POST':
    product = get_object_or_404(Product, pk=id)
    
    if product.user != request.user:
      return JsonResponse({'status': 'error', 'message': 'You are not authorized to edit this product.'}, status=403) # 403 Forbidden

    form = ProductForm(request.POST, instance=product)
    if form.is_valid():
      form.save()
      return JsonResponse({'status': 'success', 'message': 'Product updated successfully.'}, status=200)
    else:
      return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)

  return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@login_required(login_url='/login')
def delete_product_ajax(request, id):
  if request.method == 'POST':
    product = get_object_or_404(Product, pk=id)
    
    if product.user != request.user:
      return JsonResponse({'status': 'error', 'message': 'You are not authorized to delete this product.'}, status=403)

    try:
      product.delete()
      return JsonResponse({'status': 'success', 'message': 'Product deleted successfully.'}, status=200)
    except Exception as e:
      return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

  return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

def register_ajax(request):
  if request.method == 'POST':
    form = UserCreationForm(data=request.POST)
    if form.is_valid():
      form.save()
      return JsonResponse({'status': 'success', 'message': 'Registration successful! Please log in.'}, status=201)
    else:
      return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)
  return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

def login_ajax(request):
  if request.method == 'POST':
    form = AuthenticationForm(data=request.POST)
    if form.is_valid():
      user = form.get_user()
      login(request, user)
      return JsonResponse({'status': 'success', 'message': 'Login successful! Redirecting...'}, status=200)

def show_user_products_list(request, user_id):
    try:
        user = get_object_or_404(User, pk=user_id)
        products = Product.objects.filter(user=user)
        data = [
            {
                'id': str(product.id),
                'name': product.name,
                'description': product.description,
                'category': product.category,
                'price': product.price,
                'thumbnail': product.thumbnail,
                'product_views': product.product_views,
                'created_at': product.created_at.isoformat() if product.created_at else None,
                'is_featured': product.is_featured,
                'user_id': product.user_id,
            }
            for product in products
        ]
        return JsonResponse(data, safe=False)
    except User.DoesNotExist:
        return JsonResponse({'detail': 'User not found'}, status=404)

@csrf_exempt
def create_product_flutter(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        title = strip_tags(data.get("name", ""))  # Strip HTML tags
        content = strip_tags(data.get("description", ""))  # Strip HTML tags
        category = data.get("category", "")
        thumbnail = data.get("thumbnail", "")
        is_featured = data.get("is_featured", False)
        user = request.user

        new_product = Product(
            name=title,
            description=content,
            category=category,
            thumbnail=thumbnail,
            is_featured=is_featured,
            user=user
        )
        new_product.save()

        return JsonResponse({"status": "success"}, status=200)
    else:
        return JsonResponse({"status": "error"}, status=401)

def proxy_image(request):
    image_url = request.GET.get('url')
    if not image_url:
        return HttpResponse('No URL provided', status=400)

    try:
        # Fetch image from external source
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()

        # Return the image with proper content type
        return HttpResponse(
            response.content,
            content_type=response.headers.get('Content-Type', 'image/jpeg')
        )
    except requests.RequestException as e:
        return HttpResponse(f'Error fetching image: {str(e)}', status=500)