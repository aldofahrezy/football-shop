document.addEventListener('DOMContentLoaded', function() {
  // --- ELEMEN DOM ---
const modal = document.getElementById('crudModal');
const modalContent = document.getElementById('crudModalContent');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');

const formContent = document.getElementById('formContent');
const formActions = document.getElementById('formActions');
const productForm = document.getElementById('productForm');
const submitButton = document.getElementById('submitButton');
const productIdInput = document.getElementById('productId');

const deleteConfirmationContent = document.getElementById('deleteConfirmationContent');
const deleteActions = document.getElementById('deleteActions');
const deleteProductName = document.getElementById('deleteProductName');
const deleteConfirmInput = document.getElementById('deleteConfirmInput');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');

// --- FUNGSI GLOBAL ---
window.showProductModal = function(mode, productData = null) {
productForm.reset();
deleteConfirmInput.value = '';
confirmDeleteButton.disabled = true;
confirmDeleteButton.classList.add('opacity-50', 'cursor-not-allowed');
confirmDeleteButton.classList.remove('hover:bg-red-700');

if (mode === 'create' || mode === 'edit') {
    formContent.classList.remove('hidden');
    formActions.classList.remove('hidden');
    deleteConfirmationContent.classList.add('hidden');
    deleteActions.classList.add('hidden');

    if (mode === 'edit' && productData) {
    modalTitle.textContent = 'Edit Product';
    modalSubtitle.textContent = 'Update the item details.';
    submitButton.textContent = 'Update Product';
    currentProductId = productData.id;
    productIdInput.value = productData.id;
    
    productForm.querySelector('[name="name"]').value = productData.name || '';
    productForm.querySelector('[name="price"]').value = productData.price || '';
    productForm.querySelector('[name="description"]').value = productData.description || '';
    productForm.querySelector('[name="category"]').value = productData.category || '';
    productForm.querySelector('[name="thumbnail"]').value = productData.thumbnail || '';
    productForm.querySelector('[name="is_featured"]').checked = productData.is_featured || false;
    } else { // mode 'create'
    modalTitle.textContent = 'Create New Product';
    modalSubtitle.textContent = 'Add a new item to the catalog.';
    submitButton.textContent = 'Create Product';
    currentProductId = null;
    }
} else if (mode === 'delete' && productData) {
    formContent.classList.add('hidden');
    formActions.classList.add('hidden');
    deleteConfirmationContent.classList.remove('hidden');
    deleteActions.classList.remove('hidden');
    
    modalTitle.textContent = 'Confirm Deletion';
    modalSubtitle.textContent = 'This action cannot be undone.';
    deleteProductName.textContent = `"${productData.name}"`;
    
    confirmDeleteButton.dataset.productId = productData.id;
    confirmDeleteButton.dataset.productName = productData.name;
}

modal.classList.remove('hidden');
setTimeout(() => modalContent.classList.add('opacity-100', 'scale-100'), 10);
}

window.hideProductModal = function() {
modalContent.classList.remove('opacity-100', 'scale-100');
setTimeout(() => {
    modal.classList.add('hidden');
    formContent.classList.remove('hidden');
    formActions.classList.remove('hidden');
    deleteConfirmationContent.classList.add('hidden');
    deleteActions.classList.add('hidden');
}, 150);
}

async function handleFormSubmit(event) {
event.preventDefault();
const formData = new FormData(productForm);
let url = '';
let successMessage = '';
let currentMode = productForm.querySelector('#productId').value ? 'edit' : 'create';
let currentProductId = productForm.querySelector('#productId').value;

if (currentMode === 'create') {
    url = "/create-product-ajax/";
    successMessage = 'Product added successfully!';
} else {
    url = `/edit-product-ajax/${currentProductId}/`;
    successMessage = 'Product updated successfully!';
}

const originalButtonText = submitButton.textContent;
submitButton.disabled = true;
submitButton.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...`;

try {
    const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: { "X-CSRFToken": getCookie('csrftoken') }
    });
    const result = await response.json();
    if (response.ok) {
        hideProductModal();
        showToast('Success!', successMessage, 'success');
        document.dispatchEvent(new CustomEvent('productDataChanged', { detail: result.product }));
    } else {
        console.error('Form errors:', result.errors);
        showToast('Action Failed', 'Please check the form for errors.', 'error');
    }
} catch (error) {
    console.error("Fetch error:", error);
    showToast('Error!', 'An unexpected network error occurred.', 'error');
} finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
}
}

async function performDelete() {
const productId = confirmDeleteButton.dataset.productId;
if (!productId) return;

const originalButtonText = confirmDeleteButton.innerHTML;
confirmDeleteButton.disabled = true;
confirmDeleteButton.innerHTML = 'Deleting...';

try {
    const response = await fetch(`/delete-product-ajax/${productId}/`, {
    method: 'POST',
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
    });
    const data = await response.json();
    
    if (response.ok) {
    hideProductModal();
    showToast('Success!', 'Product has been deleted.', 'success');
    document.dispatchEvent(new CustomEvent('productDataChanged'));
    } else {
    throw new Error(data.message || 'Failed to delete product.');
    }
} catch (error) {
    console.error('Delete error:', error);
    showToast('Error!', error.message, 'error');
} finally {
    confirmDeleteButton.disabled = false;
    confirmDeleteButton.innerHTML = originalButtonText;
}
}

// --- EVENT LISTENERS ---
if (productForm) productForm.addEventListener('submit', handleFormSubmit);
if (modal) modal.addEventListener('click', (e) => (e.target === modal) && hideProductModal());
document.addEventListener('keydown', (e) => (e.key === 'Escape' && !modal.classList.contains('hidden')) && hideProductModal());

if (deleteConfirmInput) {
deleteConfirmInput.addEventListener('input', (event) => {
    const typedName = event.target.value;
    const expectedName = confirmDeleteButton.dataset.productName;
    
    if (typedName === expectedName) {
    confirmDeleteButton.disabled = false;
    confirmDeleteButton.classList.remove('opacity-50', 'cursor-not-allowed');
    confirmDeleteButton.classList.add('hover:bg-red-700');
    } else {
    confirmDeleteButton.disabled = true;
    confirmDeleteButton.classList.add('opacity-50', 'cursor-not-allowed');
    confirmDeleteButton.classList.remove('hover:bg-red-700');
    }
});
}

if (confirmDeleteButton) confirmDeleteButton.addEventListener('click', performDelete);

});

function getCookie(name) {
let cookieValue = null;
if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
}
return cookieValue;
}