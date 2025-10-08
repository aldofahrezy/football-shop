document.addEventListener('DOMContentLoaded', function() {
  // ===================================================================================
  // KONFIGURASI & ELEMEN DOM
  // ===================================================================================

  // Mengambil data dari atribut data-* di HTML
  const container = document.querySelector('[data-api-endpoint]');

  const PRODUCT_API_ENDPOINT = container.dataset.apiEndpoint;
  const PRODUCT_DETAIL_URL_TEMPLATE = container.dataset.productDetailUrlTemplate;
  const CURRENT_USER_ID = document.body.dataset.userId || '';

  const loadingSpinner = document.getElementById('loading');
  const errorMessage = document.getElementById('error');
  const emptyStateDisplay = document.getElementById('empty');
  const productGridContainer = document.getElementById('grid');
  const showAllProductsButton = document.getElementById('filter-all');
  const showMyProductsButton = document.getElementById('filter-my');
  const refreshProductsButton = document.getElementById('refresh-products'); // 🔁 tombol refresh

  // ===================================================================================
  // STATE MANAGEMENT
  // ===================================================================================
  let activeFilter = 'all';
  let allProductsData = [];

  // ===================================================================================
  // FUNGSI HELPER
  // ===================================================================================

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

  function updateFilterButtonsAppearance() {
    if (!showAllProductsButton) return;
    const baseClass = 'btn btn-chip';
    const activeClass = 'btn btn-chip active';
    if (activeFilter === 'all') {
      showAllProductsButton.className = activeClass;
      if (showMyProductsButton) showMyProductsButton.className = baseClass;
    } else {
      showAllProductsButton.className = baseClass;
      if (showMyProductsButton) showMyProductsButton.className = activeClass;
    }
  }

  function displayPageSection({ showLoading = false, showError = false, showEmpty = false, showGrid = false }) {
    loadingSpinner.classList.toggle('hidden', !showLoading);
    errorMessage.classList.toggle('hidden', !showError);
    emptyStateDisplay.classList.toggle('hidden', !showEmpty);
    productGridContainer.classList.toggle('hidden', !showGrid);
    if (showGrid) {
      productGridContainer.className = 'product-grid';
    }
  }

  // ===================================================================================
  // FUNGSI UTAMA UNTUK PRODUK
  // ===================================================================================

  function buildProductCardElement(product) {
    const articleElement = document.createElement('div');
    articleElement.className = 'product-card';
    const detailLink = PRODUCT_DETAIL_URL_TEMPLATE.replace('00000000-0000-0000-0000-000000000000', product.id);
    const productName = DOMPurify.sanitize(product.name);
    const formattedPrice = `Rp${new Intl.NumberFormat('id-ID').format(product.price)},00`;
    const thumbnailHtml = product.thumbnail
      ? `<img src="${DOMPurify.sanitize(product.thumbnail)}" alt="${productName} thumbnail" class="thumb">`
      : `<div class="thumb-placeholder">No Image</div>`;

    const actionsHtml = CURRENT_USER_ID && Number(CURRENT_USER_ID) === Number(product.user_id)
      ? `<button onclick="openEditModal(event, '${product.id}')" class="btn btn-outline" style="flex-grow: 1;">Edit</button>
        <button onclick="handleDelete(event, '${product.id}')" class="btn btn-danger" style="flex-grow: 1;">Delete</button>`
      : `<a href="#" class="btn btn-primary" style="background-color: #111827; flex-grow: 1;">Add to cart</a>
        <a href="${detailLink}" class="btn btn-secondary">View</a>`;

    articleElement.innerHTML = `
      <a href="${detailLink}" class="thumb-wrap">${thumbnailHtml}</a>
      <div class="product-info">
        <h3 class="product-title"><a href="${detailLink}">${productName}</a></h3>
        <p class="muted">${formattedPrice}</p>
      </div>
      <div class="card-actions">${actionsHtml}</div>
    `;
    return articleElement;
  }

  function renderAllProductCards(products) {
    productGridContainer.innerHTML = '';
    products.forEach(product => {
      const cardElement = buildProductCardElement(product);
      productGridContainer.appendChild(cardElement);
    });
  }

  function filterAndDisplayProducts() {
    updateFilterButtonsAppearance();
    const filteredProducts = activeFilter === 'all'
      ? allProductsData
      : allProductsData.filter(product => Number(product.user_id) === Number(CURRENT_USER_ID));

    if (filteredProducts.length === 0) {
      displayPageSection({ showEmpty: true });
    } else {
      renderAllProductCards(filteredProducts);
      displayPageSection({ showGrid: true });
    }
  }

  async function fetchProductsFromServer() {
    try {
      displayPageSection({ showLoading: true });
      const response = await fetch(PRODUCT_API_ENDPOINT);
      if (!response.ok) throw new Error('Failed to fetch data from server');
      const productData = await response.json();
      allProductsData = productData || [];
      filterAndDisplayProducts();
    } catch (error) {
      console.error('Error loading products:', error);
      displayPageSection({ showError: true });
    }
  }

  // ===================================================================================
  // FUNGSI UNTUK AKSI CUD (Create, Update, Delete)
  // ===================================================================================

  window.handleDelete = async function(event, productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    const deleteButton = event.target;
    const originalButtonText = deleteButton.innerHTML;
    deleteButton.disabled = true;
    deleteButton.innerHTML = 'Deleting...';
    try {
      const response = await fetch(`/delete-product-ajax/${productId}/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
      });
      const data = await response.json();
      if (response.ok) {
        showToast('Success!', data.message, 'success');
        fetchProductsFromServer();
      } else {
        showToast('Delete Failed', data.message || 'An error occurred.', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Error!', 'An unexpected network error occurred.', 'error');
    } finally {
      if (deleteButton) {
        deleteButton.disabled = false;
        deleteButton.innerHTML = originalButtonText;
      }
    }
  }

  window.openEditModal = async function(event, productId) {
    const editButton = event.target;
    const originalButtonText = editButton.innerHTML;
    editButton.disabled = true;
    editButton.innerHTML = 'Opening...';
    try {
      const response = await fetch(`/json/${productId}/`);
      if (!response.ok) throw new Error('Failed to fetch product data.');
      const productData = await response.json();
      showProductModal('edit', productData);
    } catch (error) {
      console.error('Error opening edit modal:', error);
      showToast('Error', 'Could not load product data for editing.', 'error');
    } finally {
      if (editButton) {
        editButton.disabled = false;
        editButton.innerHTML = originalButtonText;
      }
    }
  }

  // ===================================================================================
  // INISIALISASI HALAMAN
  // ===================================================================================

  function initializeProductsPage() {
    if (showAllProductsButton) {
      showAllProductsButton.addEventListener('click', () => {
        activeFilter = 'all';
        filterAndDisplayProducts();
      });
    }
    if (showMyProductsButton) {
      showMyProductsButton.addEventListener('click', () => {
        activeFilter = 'my';
        filterAndDisplayProducts();
      });
    }

    if (refreshProductsButton) {
      refreshProductsButton.addEventListener('click', async () => {
        const originalText = refreshProductsButton.innerHTML;
        refreshProductsButton.disabled = true;
        refreshProductsButton.innerHTML = `
          <span class="spinner" 
            style="
              display:inline-block;
              width:14px;
              height:14px;
              border:2px solid #fff;
              border-top:2px solid transparent;
              border-radius:50%;
              margin-right:6px;
              animation:spin 0.8s linear infinite;">
          </span>
          Refreshing...
        `;
        try {
          await fetchProductsFromServer();
        } catch (err) {
          console.error('Error refreshing products:', err);
        } finally {
          refreshProductsButton.disabled = false;
          refreshProductsButton.innerHTML = originalText;
        }
      });

      // Tambahkan CSS animasi spin
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    fetchProductsFromServer();
    document.addEventListener('productDataChanged', function(event) {
      console.log('Product data changed! Refreshing product list...', event.detail);
      fetchProductsFromServer();
    });
  }

  initializeProductsPage();
});
