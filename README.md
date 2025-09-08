1. Jelaskan bagaimana cara kamu mengimplementasikan checklist di atas secara step-by-step (bukan hanya sekadar mengikuti tutorial). 

Pertama-tama, saya membuat repository baru pada github saya dan melakukan cloning repository. Lalu, saya membuat python environment baru dan menginstall beberapa dependencies yang dibutuhkan dengan menuliskannya pada berkas requirements.txt terlebih dahulu. Isi dari berkas tersebut sementara diisikan kebutuhan dasar pengembangan sesuai dengan yang telah disediakan pada tutorial. Hal ini tidak menutup kemungkinan untuk menginstall dependencies lainnya apabila dibutuhkan. Jika itu terjadi, saya bisa menjalankan command pip/pip3 install pada terminal saya dan melakukan freeze ke berkas requirements.txt untuk mengupdate list dari dependencies yang dibutuhkan.

Setelah menginstall dependencies, sekarang saya sudah bisa menjalankan command Django. Saya kemudian mengisiasikan sebuah project Django baru pada direktori repository saya dengan nama the_kickoff_zone yang direncanakan menjadi nama dari football shop saya. Setelah itu, saya melanjutkan dengan preparasi deployment ke PWS. Hal ini dilakukan dengan menambahkan environment variables pada berkas .env dan .env.prod dan melakukan konfigurasi pada settings.py dengan fungsi load_dotevnt(). Saya pun tidak lupa untuk menambahkan berkas .gitignore agar repository saya tidak melacak berkas-berkas sensitif seperti environment variables. Saya melanjutkan dengan memasukkan environment variables ke dalam PWS, menambahkan repository PWS sebagai remote repository dan melakukan deployment pada PWS sembari mengecek apakah instalasi dan inisiasi project berhasil. Tidak lupa, saya menambahkan url local dan online dari project ke dalam ALLOWED_HOST untuk membuka restriksi akses terhadap project, melakukan konfigurasi variabel PRODUCTION dan DEBUG, serta melakukan konfigurasi Database.

Setelah melakukan makemigrations dan migrate, project berhasil dideploy ke internet. Sekarang, saya melanjutkan pengembangan dengan menginisiasikan aplikasi baru dengan nama main. Kemudian, saya membuat model data baru di berkas models.py di aplikasi main dengan nama Product yang memiliki 6 atribut wajib yang dibutuhkan. Tentu model hal ini masih bisa berubah kedepannya. Apabila di lain waktu saya ingin memodifikasi model Product atau menambahkan model lainnya, saya bisa dengan mudah melakukannya dengan memodifikasi berkas models.py dan melakukan makemigrations dan migrate. 

Saya melanjutkan pengembangan dengan membuat fungsi show_main() untuk menampilkan template aplikasi main tersebut di berkas views.py dan memasukkan beberapa context untuk kemudian ditampilkan oleh template. Dengan adanya fungsi show_main(), saya bisa melakukan routing. Saya melakukan routing dengan membuat berkas urls.py di direktori aplikasi main dan mengimport fungsi show_main() dari views.py. Selanjutnya saya pasangkan fungsi show_main() tersebut dengan url pattern dengan path '' (empty string) sehingga fungsi tersebut akan dapat ditampilkan sebagai landing page tanpa memerlukan endpoint tertentu. Agar dapat berfungsi dengan benar, saya mengimport semua url dari aplikasi main ke project Django saya dengan memanfaatkan fungsi include pada berkas urls.py milik project Django saya. 

Dengan adanya model, view, dan routing, saya hanya perlu membuat template agar dapat menampilkan view kepada pengguna. Saya melanjutkan dengan membuat folder templates di direktori aplikasi main dan membuat berkas main.html. Berkas template tersebut saya isi dengan tampilan sederhana menggunakan tag header dan paragraph untuk menampilkan data yang telah diproses oleh view. Dengan demikian, selesai sudah pengembangan yang perlu dilakukan untuk tugas individu 2 ini. 

Saya juga menambahkan beberapa test dasar pada aplikasi main saya sebagai bentuk kedisiplinan saya sebagai pengembang. Kelak di tugas-tugas selanjutnya, project Django saya bisa jadi akan sangat besar sehingga menjadikan pengetesan secara manual menjadi ineffective dan time-consuming. Namun demikian, untuk sementara, test yang saya masukkan masih sangat sederhana. Tentunya hal ini akan terus berubah seiring berjalannya waktu.

Terakhir, saya melakukan git add, commit, dan push ke kedua remote repository saya (origin dan PWS). PWS kemudian akan menge-build project saya dan, voila, project saya berhasil dideploy ke internet


2. Buatlah bagan yang berisi request client ke web aplikasi berbasis Django beserta responnya dan jelaskan pada bagan tersebut kaitan antara urls.py, views.py, models.py, dan berkas html.

![Image](/assets/Bagan_alur_HTTP_Request%20Django.png)

Referensi: Slides perkuliahan PBP Semester Gasal 2025/2026


3. Jelaskan peran settings.py dalam proyek Django!

Sesuai dengan namanya, berkas settings.py merupakan pusat konfigurasi utama untuk proyek Django yang kita miliki. Kita dapat menyeting project Django kita melalui berkas ini. Konfigurasi yang terdapat di berkas settings.py diantaranya adalah: INSTALLED_APPS, MIDDLEWARE, ALLOWED_HOSTS, Database, dan lain-lain. Berkas tersebut memastikan bahwa project Django kita berjalan dengan baik dan benar. 

Referensi: https://docs.djangoproject.com/en/5.2/topics/settings/


4. Bagaimana cara kerja migrasi database di Django?

Migrasi database di Django dilakukan dalam 2 tahap, yaitu: makemigrations dan migrate. 

Command makemigrations akan membandingkan kondisi model saat ini (setelah perubahan) dengan kondisi terakhir yang tercatat dalam file migrasi sebelumnya. Kemudian, Django akan secara otomatis membuat file python baru di dalam direktori migrations/ berdasarkan perbedaan tersebut. File yang dibuat sendiri berisikan isntruksi spesifik tentang cara menerapkan perubahan tersebut ke database. Hal ini meliputi, tetapi tidak terbatas pada: AddField, CreateTable, dan lain-lain. Secara singkat makemigrations berfungsi untuk mempersiapkan migrasi skema model ke dalam database Django lokal.

Selanjutnya command migrate akan menerjemahkan berkas-berkas migrasi yang telah dibuat sebelumnya (untuk migrasi-migrasi yang belum terimplementasi) menjadi syntax SQL atau bahasa lainnya sesuai dengan tipe database yang digunakan. Singkatnya, command ini dijalankan untuk menerapkan skema model yang telah dibuat ke dalam database Django lokal.


5. Menurut Anda, dari semua framework yang ada, mengapa framework Django dijadikan permulaan pembelajaran pengembangan perangkat lunak?

Sebelumnya, mahasiswa di Fasilkom UI sudah mengenal bahasa pemrograman Python pada masa mengambil mata kuliah Dasar-dasar Pemrograman 1. Hal ini menjadikan Django yang menggunakan bahasa pemrograman Python menjadi pilihan yang ideal untuk dijadikan permulaan pembelajaran pengembangan perangkat lunak. Selain dari itu, struktur dari aplikasi Django bersifat modular dan cenderung mudah dipahami (walaupun opini ini tentu relatif). Modularitas tersebut juga memungkinkan project-project Django bersifat lebih scalable sehingga nyaman untuk digunakan. Bahkan, aplikasi-aplikasi besar seperti Instagram, Spotify, dan Pinterest juga ternyata menggunakan Django. Hal ini membuktikan bahwa Django adalah framework yang cukup powerful. Bekal ini tentunya akan sangat berguna di dunia pekerjaan. Demikian pendapat saya.


6. Apakah ada feedback untuk asisten dosen tutorial 1 yang telah kamu kerjakan sebelumnya?

Sangat baik, Kak! Tutorial yang diberikan komprehensif dan mudah dipahami. Selain dari praktik, tutorial juga memberikan bacaan teori yang bisa kami (mahasiswa) manfaatkan untuk meningkatkan pemahaman terkait PBP. Terima kasih atas kerja kerasnya! Saya do'akan kakak-kakak senantiasa sehat dan bahagia.