# testmongoLohya 👶

## 1. Ini Project Apa Sih?

Bayangin kamu punya **kotak mainan** (namanya MongoDB).
Terus kamu punya **robot pelayan** (namanya Hono.js) yang tugasnya:
- Ambilin mainan dari kotak kalau diminta
- Masukin mainan baru ke kotak
- Ganti mainan yang udah ada
- Buang mainan yang gak dipake lagi

Robot ini juga bisa nunjukin isi kotak mainan lewat **layar TV** (halaman web `/`).

Project ini cuma buat **latihan/percobaan** — ngecek apakah robot (Hono.js) bisa kerja bareng kotak mainan (MongoDB) dengan lancar. Belum buat dipakai serius.

---

## 2. Alurnya Kaya Gimana? (Cerita Sederhana)

```
1. Kamu nyalain robotnya (npm run dev)
        ↓
2. Robot jalan ke kotak mainan, buka pintunya (connectDB)
        ↓
3. Kalau pintu kebuka, robot siap terima perintah (serve)
        ↓
4. Kamu kasih perintah lewat internet (misal: "ambilin semua mainan!")
        ↓
5. Robot ambil dari kotak, kasih balik ke kamu dalam bentuk JSON
```

Robotnya **gak akan nyala** kalau pintu kotak mainan gak kebuka (koneksi MongoDB gagal). Ini sengaja, biar gak ada robot rusak yang jalan tanpa kotak mainan.

---

## 3. Cara Ambil Project Ini (Git Clone)

Kalau project ini ada di GitHub/GitLab dan kamu mau download ke komputer kamu:

1. Buka **Git Bash**
2. Pindah ke folder tempat kamu mau simpan project (misal folder `ujicoba`):
   ```bash
   cd /d/ujicoba
   ```
3. Copy alamat repo-nya (dari tombol hijau "Code" di GitHub, pilih HTTPS), lalu jalankan:
   ```bash
   git clone https://github.com/jojohyperbackend-hub/MongoDBtestYahLohYa.git
   ```
4. Masuk ke folder project yang baru ke-download:
   ```bash
   cd MongoDBtestYahLohYa
   ```
5. Lanjut ke langkah **"Cara Nyalain Robotnya"** di bawah ini.

> Kalau kamu **belum punya Git** di komputer, download dulu di [git-scm.com](https://git-scm.com), install, baru bisa pakai perintah `git clone`.

---

## 4. Cara Nyalain Robotnya (Menjalankan Project)

1. Buka folder project di Git Bash
2. Pasang semua alat yang robot butuhin:
   ```bash
   npm install
   ```
3. Kasih tau robot di mana kotak mainannya — buka file `.env`, isi bagian ini:
   ```
   MONGO_URI=mongodb://username:password@localhost:27017/?authSource=admin
   MONGO_DB_NAME=testmongoahhhmantap
   ```

   awas ke leak ya
   
4. Nyalain robotnya:
   ```bash
   npm run dev
   ```
5. Kalau muncul tulisan `Server running at http://localhost:3000`, artinya robot udah nyala dan siap kerja 🎉

---

## 5. Mau Ganti Nama Database / Collection? Ini yang Boleh Diubah

Ada 3 "nama" yang keliatannya mirip tapi beda fungsi. Ini penjelasan gampangnya:

| Nama | Ini Apa? | Boleh Diganti? | Ribet Gak Gantinya? |
|---|---|---|---|
| `wihuy` | Cuma **nama panggilan** koneksi di aplikasi MongoDB Compass **di komputer kamu sendiri**. Gak ada hubungannya sama kode project ini sama sekali. | ✅ Boleh, bebas, kapan aja | 😊 Gampang banget — tinggal klik kanan koneksinya di Compass, pilih rename |
| `testmongoahhhmantap` (`MONGO_DB_NAME`) | Nama **kotak besar** (database) tempat semua collection disimpen | ✅ Boleh diganti | 😊 Gampang — cuma ganti 1 baris di file `.env` |
| `yomantestmongo` | Nama **kotak kecil** (collection) di dalam database, tempat data mainan disimpen | ✅ Boleh diganti, tapi... | 😐 Agak ribet — nama ini dipake di **beberapa file kode**, semuanya harus diganti bareng-bareng biar konsisten |

### Cara Ganti `wihuy` (Gampang Banget)

Ini cuma nama di Compass buat kamu sendiri, **gak perlu diapa-apain di kode**. Kalau mau ganti:
1. Buka MongoDB Compass
2. Klik kanan nama koneksi `wihuy` di sidebar kiri
3. Pilih "Rename" atau "Edit connection", ganti namanya, save

Selesai. Ini gak akan bikin project error, karena `wihuy` cuma label buat kamu, bukan bagian dari `.env` atau kode.

### Cara Ganti `MONGO_DB_NAME` (Gampang)

1. Buka file `.env`
2. Cari baris:
   ```
   MONGO_DB_NAME=testmongoahhhmantap
   ```
3. Ganti jadi nama apa aja yang kamu mau, contoh:
   ```
   MONGO_DB_NAME=databasekesayangangw
   ```
4. Simpan file, restart server (`npm run dev` lagi)

Database baru itu bakal otomatis kebuat sendiri pas kamu jalanin migration (`npm run migrate:up`), gak perlu bikin manual di Compass.

### Cara Ganti `yomantestmongo` (Agak Ribet, Tapi Tetap Gampang Diikuti)

Nama collection `yomantestmongo` ini ditulis di **4 file**. Kalau mau ganti, harus diganti di semua tempat ini, pakai nama yang **sama persis** di keempatnya:

| No | File | Bagian yang Diganti |
|---|---|---|
| 1 | `migrations/xxxxx-init-yomantestmongo.js` | Tulisan `'yomantestmongo'` di dalam `createCollection` dan `collection()` |
| 2 | `src/app/yomantestmongo/route.ts` | Baris `const collectionName = 'yomantestmongo'` |
| 3 | `src/app/yomantestmongo/[id]/route.ts` | Baris `const collectionName = 'yomantestmongo'` |
| 4 | `src/app/page.tsx` | Tulisan `'yomantestmongo'` di dalam `db.collection<YomanTestMongo>('yomantestmongo')` |

> 💡 Tips paling gampang: pakai fitur **Find and Replace** (Ctrl+Shift+H di VS Code), cari `yomantestmongo`, ganti semua jadi nama baru kamu. Selesai dalam 10 detik.

Kalau ada yang kelewat gak diganti, nanti robotnya bingung — dia nyari kotak dengan nama lama padahal udah gak ada, jadinya data gak ketemu.

---

## 6. Cara Bikin Kotak Mainan Siap Dipake (Migrasi ke MongoDB)

"Migrasi" itu kaya **nyiapin kotak mainan** sebelum dipake — bikin sekat-sekatnya, kasih label, taruh beberapa mainan contoh.

### Langkah-langkahnya:

1. **Bikin resep cara nyiapin kotaknya** (kalau belum ada):
   ```bash
   npx migrate-mongo create init-yomantestmongo
   ```
   Ini bikin file baru di folder `migrations/`.

2. **Isi resepnya** — bilang ke robot:
   - "Bikin kotak kecil namanya `yomantestmongo` di dalam kotak besar"
   - "Kasih aturan: gak boleh ada 2 mainan dengan email yang sama" (unique index)
   - "Taruh 2 mainan contoh di dalamnya" (seed data)

3. **Suruh robot nyiapin kotaknya beneran**:
   ```bash
   npm run migrate:up
   ```

4. **Cek udah kepasang apa belum**:
   ```bash
   npm run migrate:status
   ```
   Kalau statusnya `UP`, artinya kotak udah siap dipake.

5. **Kalau mau balikin ke kosong lagi** (buang kotak kecilnya):
   ```bash
   npm run migrate:down
   ```

---

## 7. Daftar Perintah yang Bisa Dikasih ke Robot (REST API Endpoint)

| Method | Alamat (Endpoint) | Robot Ngapain? | Barang yang Dikirim |
|---|---|---|---|
| `GET` | `/health` | Cek robotnya masih hidup apa engga | - |
| `GET` | `/ping-db` | Cek pintu kotak mainan masih kebuka apa engga | - |
| `GET` | `/yomantestmongo` | Ambilin semua mainan dari kotak (bisa difilter/dicari) | - |
| `GET` | `/yomantestmongo/:id` | Ambilin 1 mainan spesifik pake nomor ID-nya | - |
| `POST` | `/yomantestmongo` | Masukin mainan baru ke kotak | `{ name, email, status, metadata, tags }` |
| `PUT` | `/yomantestmongo/:id` | Ganti SEMUA bagian mainan yang lama jadi baru | `{ name, email, status, metadata, tags }` |
| `PATCH` | `/yomantestmongo/:id` | Ganti SEBAGIAN aja dari mainan (misal cuma nama-nya) | `{ field_yang_mau_diganti }` |
| `DELETE` | `/yomantestmongo/:id` | Buang mainan dari kotak | - |

### Cara Nyari Mainan Tertentu (Query Parameter di GET list)

| Nama | Contoh Pemakaian | Ngapain? |
|---|---|---|
| `status` | `?status=active` | Cari mainan yang lagi "aktif" doang |
| `tags` | `?tags=mongo,test` | Cari mainan yang punya label ini |
| `limit` | `?limit=10` | Maksimal ambil berapa mainan sekali panggil |
| `page` | `?page=1` | Mau lihat halaman keberapa (kalau mainannya banyak) |
| `search` | `?search=budi` | Cari mainan yang namanya/emailnya mirip ini |

---

## 8. Kalau Robot Berhasil Ngasih Jawaban (Response Sukses)

```json
{
  "success": true,
  "data": { },
  "message": "OK"
}
```

## 9. Kalau Robot Gagal Ngasih Jawaban (Response Gagal)

```json
{
  "success": false,
  "error": "Not Found",
  "message": "Data dengan id tersebut tidak ditemukan"
}
```

## 10. Arti Angka Kode yang Dikasih Robot

| Angka | Artinya |
|---|---|
| `200` | Berhasil, ini jawabannya |
| `201` | Berhasil, mainan baru udah ditambahin |
| `400` | Kamu salah kasih perintah/data |
| `404` | Mainannya gak ketemu |
| `409` | Bentrok, ada mainan lain yang emailnya sama |
| `500` | Robotnya lagi error di dalam |

---

## 11. Kotak Mainan Dibagi Jadi Apa Aja? (Struktur Data)

Setiap mainan di dalam kotak `yomantestmongo` punya bentuk kaya gini:

```json
{
  "name": "Test Data 1",
  "email": "test1@example.com",
  "status": "active",
  "metadata": {
    "source": "seed",
    "notes": null
  },
  "tags": ["test", "mongo", "hono"],
  "createdAt": "2026-09-15T10:00:00Z",
  "updatedAt": "2026-09-15T10:00:00Z"
}
```

- `name` → nama mainannya
- `email` → kaya nomor unik, gak boleh sama ke mainan lain
- `status` → lagi dipake (`active`) atau lagi disimpen (`inactive`)
- `metadata` → catatan tambahan (dari mana mainan itu asalnya)
- `tags` → label-label kecil nempel di mainan
- `createdAt` / `updatedAt` → kapan mainan itu dibuat / terakhir diubah

---

## 12. Yang BELUM Dibahas di Project Ini (Belum Waktunya)

- Kunci pintu (autentikasi/otorisasi) — siapa aja masih boleh masuk
- Dipindahin ke rumah baru (deployment ke server production)
- Robot pengetes otomatis (automated testing)

Ini semua boleh ditambahin nanti kalau project-nya udah mau dipake beneran. 🍼