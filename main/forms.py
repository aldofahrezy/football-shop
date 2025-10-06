from django.forms import ModelForm
from main.models import Product
from django.utils.html import strip_tags

class ProductForm(ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'price', 'description', 'thumbnail', 'category', 'is_featured']

    # Membersihkan field 'name' dari tag HTML
    def clean_name(self):
        name = self.cleaned_data.get("name")
        return strip_tags(name)

    # Membersihkan field 'description' dari tag HTML
    def clean_description(self):
        description = self.cleaned_data.get("description")
        return strip_tags(description)