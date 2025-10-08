// --- Definisi Ikon SVG ---
const ICONS = {
    success: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    error: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    normal: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
};

let toastTimeout;

function showToast(title, message, type = 'normal', duration = 3000) {
    const toastComponent = document.getElementById('toast-component');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    
    if (!toastComponent || !toastTitle || !toastMessage || !toastIcon) return;

    // Hapus semua kelas warna sebelumnya untuk memulai dari awal
    toastComponent.className = toastComponent.className.replace(/\bbg-\S+/g, '');
    toastComponent.className = toastComponent.className.replace(/\btext-\S+/g, '');
    toastComponent.className = toastComponent.className.replace(/\bborder-\S+/g, '');
    toastComponent.classList.remove('border');

    // Atur gaya dan ikon berdasarkan tipe notifikasi
    switch (type) {
        case 'success':
            toastComponent.classList.add('bg-gray-900', 'text-white');
            toastIcon.innerHTML = ICONS.success;
            break;
        case 'error':
            toastComponent.classList.add('bg-red-600', 'text-white');
            toastIcon.innerHTML = ICONS.error;
            break;
        default: // 'normal'
            toastComponent.classList.add('bg-white', 'text-gray-900', 'border', 'border-gray-200');
            toastIcon.innerHTML = ICONS.normal;
            break;
    }

    // Isi konten teks
    toastTitle.textContent = title;
    toastMessage.textContent = message;

    // Hapus timeout sebelumnya jika ada
    clearTimeout(toastTimeout);

    // Tampilkan toast dengan animasi
    toastComponent.classList.remove('opacity-0', 'translate-y-64');
    toastComponent.classList.add('opacity-100', 'translate-y-0');

    // Atur timeout untuk menyembunyikan toast
    toastTimeout = setTimeout(() => {
        toastComponent.classList.remove('opacity-100', 'translate-y-0');
        toastComponent.classList.add('opacity-0', 'translate-y-64');
    }, duration);
}