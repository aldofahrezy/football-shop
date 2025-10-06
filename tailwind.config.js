/** @type {import('tailwindcss').Config} */
module.exports = {
    // 1. Konfigurasi path ke semua file template Anda.
    // Berdasarkan screenshot, Anda memiliki template di 'main/templates' dan 'templates'.
    content: [
        './main/templates/**/*.html',
        './templates/**/*.html',
    ],

    theme: {
        // Di sini kita memperluas tema default Tailwind
        extend: {
        // 2. Menerjemahkan variabel warna CSS Anda ke tema Tailwind.
        colors: {
            'primary': '#000000',   // dari --color-primary
            'accent': '#f59e0b',    // dari --color-accent
            'muted': '#6b7280',     // dari --color-muted
            // Catatan: --color-fg (#111827) adalah 'gray-900' di Tailwind
            // Catatan: --color-bg (#f9fafb) adalah 'gray-50' di Tailwind
            // Catatan: --color-border (#e5e7eb) adalah 'gray-200' di Tailwind
        },

        // 3. Menetapkan border radius default Anda.
        borderRadius: {
            'lg': '0.5rem', // dari --radius. Gunakan kelas `rounded-lg`
        },

        // 4. Font family Anda sudah cocok dengan default 'sans' Tailwind.
        // Ditambahkan di sini hanya untuk kejelasan.
        fontFamily: {
            sans: [
            'ui-sans-serif',
            'system-ui',
            '-apple-system',
            'Segoe UI',
            'Roboto',
            'Helvetica',
            'Arial',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            ],
        },
        
        // 5. Menambahkan breakpoint kustom untuk layar 900px.
        screens: {
            'tablet': '900px',
            // sm, md, lg, xl akan tetap ada dari default
        },
        },

        // 6. Mengkonfigurasi kelas .container agar sesuai dengan CSS Anda.
        container: {
        center: true,
        padding: '1rem',
        screens: {
            sm: '640px',
            md: '768px',
            tablet: '900px', // Menggunakan breakpoint kustom
            lg: '1024px',
            xl: '1100px', // Menetapkan max-width container ke 1100px
        },
        },
    },
    
    plugins: [],
}