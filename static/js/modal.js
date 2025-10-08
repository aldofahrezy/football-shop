// --- ELEMEN DOM ---
const modal = document.getElementById('crudModal');
const modalContent = document.getElementById('crudModalContent');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const submitButton = document.getElementById('submitButton');
const productIdInput = document.getElementById('productId');

// --- STATE MANAGEMENT ---
let currentMode = 'create'; // Mode default adalah 'create'
let currentProductId = null;

/**
 * Menampilkan dan mengkonfigurasi modal berdasarkan mode ('create' atau 'edit').
 * @param {string} mode - Mode operasi, 'create' atau 'edit'.
 * @param {object|null} productData - Data produk untuk diisi ke form saat mode 'edit'.
 */
function showProductModal(mode, productData = null) {
    currentMode = mode;
    productForm.reset(); // Selalu reset form untuk memulai dari awal

    if (mode === 'edit' && productData) {
        // --- Konfigurasi untuk mode EDIT ---
        modalTitle.textContent = 'Edit Product';
        modalSubtitle.textContent = 'Update the item details in the shop catalog.';
        submitButton.textContent = 'Update Product';
        
        // Simpan ID produk
        currentProductId = productData.id;
        productIdInput.value = productData.id;
        
        // Isi form dengan data yang ada
        document.getElementById('name').value = productData.name || '';
        document.getElementById('price').value = productData.price || '';
        document.getElementById('description').value = productData.description || '';
        document.getElementById('category').value = productData.category || '';
        document.getElementById('thumbnail').value = productData.thumbnail || '';
        document.getElementById('is_featured').checked = productData.is_featured || false; 

    } else {
        // --- Konfigurasi untuk mode CREATE ---
        modalTitle.textContent = 'Create New Product';
        modalSubtitle.textContent = 'Add a new item to the shop catalog.';
        submitButton.textContent = 'Create Product';
        currentProductId = null;
    }

    // Tampilkan modal
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('opacity-0', 'scale-95');
        modalContent.classList.add('opacity-100', 'scale-100');
    }, 10);
}

/**
 * Menyembunyikan modal dengan animasi.
 */
function hideProductModal() {
    if (!modal || !modalContent) return;
    modalContent.classList.remove('opacity-100', 'scale-100');
    modalContent.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 150);
}

/**
 * Menangani proses submit form (baik create maupun edit) secara dinamis.
 * @param {Event} event - Event dari form submission.
 */
async function handleFormSubmit(event) {
    event.preventDefault(); // Mencegah reload halaman

    const formData = new FormData(productForm);
    let url = '';
    let successMessage = '';
    
    // Tentukan URL dan pesan sukses berdasarkan mode
    if (currentMode === 'create') {
        url = "/create-product-ajax/"; // Pastikan URL ini sesuai dengan urls.py Anda
        successMessage = 'Product added successfully!';
    } else {
        // Pastikan Anda punya URL untuk edit di urls.py
        // Contoh: path('edit-product-ajax/<int:id>/', ...)
        url = `/edit-product-ajax/${currentProductId}/`;
        successMessage = 'Product updated successfully!';
    }

    // Terapkan loading state
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...`;

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
            headers: { "X-CSRFToken": getCookie('csrftoken') }
        });

        const result = await response.json(); // Ambil response JSON

        if (response.ok) {
            hideProductModal();
            // Asumsikan Anda punya fungsi showToast()
            showToast('Success!', successMessage, 'success');
            // Kirim event untuk memberitahu halaman agar me-refresh data produk
            document.dispatchEvent(new CustomEvent('productDataChanged', { detail: result.product }));
        } else {
            console.error('Form errors:', result.errors);
            showToast('Action Failed', 'Please check the form for errors.', 'error');
        }
    } catch (error) {
        console.error("Fetch error:", error);
        showToast('Error!', 'An unexpected network error occurred.', 'error');
    } finally {
        // Kembalikan tombol ke state semula
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}


// --- EVENT LISTENERS ---
// Menangani submit form
if (productForm) {
    productForm.addEventListener('submit', handleFormSubmit);
}
// Menutup modal jika klik di luar area konten
if (modal) {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideProductModal();
        }
    });
}


// --- FUNGSI HELPER ---
/**
 * Mendapatkan nilai cookie berdasarkan namanya.
 * @param {string} name - Nama cookie.
 * @returns {string|null} - Nilai cookie.
 */
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