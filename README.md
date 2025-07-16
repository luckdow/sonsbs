# 🚗 SBS Transfer Rezervasyon Platformu

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.19-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.14.1-orange)

**Premium Transfer Rezervasyon Platformu** - Modern, kullanıcı dostu ve tam responsive transfer rezervasyon sistemi.

## ✨ Özellikler

- 🎨 **Modern UI/UX**: Glassmorphism tasarım, gradient efektler ve smooth animasyonlar
- 📱 **Tam Responsive**: Mobil, tablet ve desktop için optimize edilmiş
- 🔐 **Güvenli**: Firebase Authentication ile güvenli oturum yönetimi
- 🗺️ **Harita Entegrasyonu**: Google Maps API ile rota planlama
- 💫 **Animasyonlar**: Framer Motion ile zengin animasyon deneyimi
- ⚡ **Hızlı**: Vite build tool ile optimize edilmiş performans

## 🛠️ Teknoloji Stack

### Frontend
- **React 18.3.1** - Modern React hooks ve context API
- **Vite 5.4.19** - Hızlı development server ve build tool
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 11.17.0** - Production-ready motion library
- **React Router DOM 6.28.0** - Client-side routing
- **Lucide React 0.462.0** - Beautiful & consistent icons

### Backend & Services
- **Firebase 10.14.1** - Authentication, Firestore, Storage
- **Google Maps API** - Harita ve konum servisleri

## 🎯 Kullanıcı Rolleri

### 👤 Müşteri Paneli
- Transfer rezervasyonu yapma
- Rezervasyon geçmişi görüntüleme
- Profil yönetimi
- Ödeme işlemleri

### 🚕 Şoför Paneli
- Günlük seferler listesi
- Navigasyon entegrasyonu
- Gelir raporu
- Müşteri iletişimi

### 👨‍💼 Admin Paneli
- Sistem yönetimi
- Kullanıcı yönetimi
- Araç filot yönetimi
- Finansal raporlar

## 🚀 Kurulum

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/luckdow/sonsbs.git
cd sonsbs
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment variables ayarlayın**
`.env` dosyası oluşturup Firebase config'inizi ekleyin:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

4. **Development server'ı başlatın**
```bash
npm run dev
```

## 📁 Proje Yapısı

```
src/
├── components/          # Reusable components
│   ├── Layout/         # Header, Footer, Layout
│   ├── Auth/           # Authentication components
│   └── UI/             # Common UI components
├── pages/              # Page components
│   ├── Public/         # Public pages
│   ├── Customer/       # Customer dashboard
│   ├── Driver/         # Driver dashboard
│   └── Admin/          # Admin dashboard
├── contexts/           # React contexts
├── services/           # API services
├── hooks/              # Custom hooks
├── utils/              # Utility functions
└── config/             # Configuration files
```

## 🎨 Design System

### Renkler
- **Primary**: Blue 500 (#3B82F6) → Purple 600 (#9333EA)
- **Secondary**: Gray tones
- **Accent**: Gradient combinations

### Efektler
- **Glassmorphism**: backdrop-blur-xl with transparency
- **Gradients**: Multi-color gradients
- **Shadows**: Soft, layered shadows
- **Animations**: Smooth micro-interactions

## 📊 Dashboard Özellikleri

### Müşteri Dashboard
- ✅ Hızlı rezervasyon
- ✅ Rezervasyon geçmişi
- ✅ Favori lokasyonlar
- ✅ Ödeme yöntemleri

### Şoför Dashboard
- ✅ Günlük program
- ✅ Gelir takibi
- ✅ Müşteri bilgileri
- ✅ Araç durumu

### Admin Dashboard
- ✅ Kullanıcı yönetimi
- ✅ Rezervasyon yönetimi
- ✅ Araç filot yönetimi
- ✅ Finansal raporlar

## 🌟 Öne Çıkan Özellikler

- **Google Maps Integration**: Rota optimizasyonu ve gerçek zamanlı tracking
- **Dynamic Pricing**: Mesafe ve araç tipine göre dinamik fiyatlama
- **Real-time Updates**: Canlı rezervasyon durumu güncellemeleri
- **Mobile-first Design**: Önce mobil deneyim için tasarlandı
- **PWA Ready**: Progressive Web App özellikleri
- **SEO Optimized**: Arama motoru dostu yapı

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px - 1279px
- **Large Desktop**: ≥ 1280px

## 🔧 Build & Deploy

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Lint check
npm run lint
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

**Proje Sahibi**: luckdow  
**GitHub**: [https://github.com/luckdow](https://github.com/luckdow)  
**Repository**: [https://github.com/luckdow/sonsbs](https://github.com/luckdow/sonsbs)

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

**Proje Hedefi:** Bu talimatlara dayanarak, "Premium Transfer Rezervasyon Platformu" için kapsamlı bir sistem mimarisi, veritabanı şeması, kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) tasarımı oluşturulması beklenmektedir. Platform; müşteri, admin ve şoför olmak üzere üç temel kullanıcı rolü için web tabanlı paneller içerecektir.

**Temel Felsefe ve Tasarım Prensipleri:**

* **Kullanıcı Deneyimi (UX):** Rezervasyon akışı, kesintisiz ve zorunlu adımlarla ilerlemelidir. Paneller, rollerine göre optimize edilmeli; admin için fonksiyonel, şoför ve müşteri için ise mobil uygulama sadeliğinde olmalıdır.
* **Kullanıcı Arayüzü (UI):** Modern, minimalist ve "iOS tasarım estetiğine" benzer bir görünüm hedeflenmektedir. Temiz çizgiler, akıcı animasyonlar ve kart (card) tabanlı grid yapılar kullanılmalıdır. Özellikle şoför ve müşteri panellerinde, deneyimi zenginleştiren gösterişli ve anlaşılır ikonlar, anlık uyarılar ve bildirimler kullanılmalıdır.
* **Performans:** Sistem, tüm platformlarda (mobil, tablet, masaüstü) hızlı ve duyarlı (responsive) çalışmalıdır. API çağrıları ve veritabanı işlemleri optimize edilmelidir.

**Sistem Mimarisi ve Kod Kalitesi:**

* **Modüler Yapı:** Proje, birbirinden bağımsız ancak entegre çalışabilen modüller halinde geliştirilmelidir (Örn: Rezervasyon Modülü, Kullanıcı Modülü, Finans Modülü vb.).
* **Genişletilebilirlik:** Mimari, gelecekte yeni özelliklerin kolayca eklenebileceği şekilde esnek ve ölçeklenebilir olmalıdır.
* **Temiz Kod:** Kod tabanı, okunabilir, sürdürülebilir ve iyi belgelenmiş olmalıdır.


### **Detaylı Sistem Çalışma Akışı ve Fonksiyonel Gereksinimler**

Aşağıdaki adımlar, platformun uçtan uca işleyişini tanımlamaktadır. Lütfen her adımı belirtilen detaylarla geliştirin.

**Adım 1: Ana Sayfa - Rota ve Transfer Detaylarının Belirlenmesi**

* **Transfer Yönü Seçimi:** "Havalimanından Otele" ve "Otelden Havalimanına" şeklinde iki net seçenek sunulmalıdır.
* **Adres Girişi:**
    * Tek bir "Adres" giriş alanı olmalıdır.
    * Kullanıcı yazmaya başladığı anda **Google Places API (Autocomplete)** devreye girmeli ve adres önerilerini liste halinde sunmalıdır.
    * Kullanıcı listeden bir adres seçtiğinde, ilgili başlangıç veya varış noktası olarak ayarlanmalıdır.
* **Yolculuk Detayları:**
    * **Tarih Seçici:** Modern ve kolay kullanımlı bir takvim arayüzü.
    * **Saat Seçici:** Pratik bir saat belirleme arayüzü.
    * **Yolcu Sayısı:** Artırma/azaltma butonları olan sayısal bir giriş alanı.
    * **Bagaj Adedi:** Artırma/azaltma butonları olan sayısal bir giriş alanı.
* **İlerleme Butonu:** "Araçları Bul" veya "Fiyatları Gör" gibi bir buton ile Adım 2'ye geçiş sağlanır. Bu buton, tüm alanlar doldurulmadan aktif olmamalıdır.

**Adım 2: Araç Seçimi ve Dinamik Fiyatlandırma**

* **Harita Görselleştirmesi:**
    * Ekranın bir bölümünde, seçilen iki nokta arasındaki rota **Google Maps API (Directions Service)** kullanılarak çizilmelidir.
    * Toplam mesafe (km olarak) ve tahmini seyahat süresi bu harita üzerinde net bir şekilde gösterilmelidir.
* **Araç Listeleme:**
    * Adım 1'de girilen yolcu ve bagaj sayısına göre, sistemdeki araç havuzu otomatik olarak filtrelenmelidir. Sadece kapasitesi uygun olan araçlar listelenmelidir.
    * Uygun araçlar, modern bir "3'lü grid" yapısında, kartlar halinde sunulmalıdır. Her kartta aracın resmi, modeli ve kapasite bilgileri yer almalıdır.
* **Dinamik Fiyatlandırma Mekanizması:**
    * Kullanıcı bir araç kartına tıkladığında, o araca özel tanımlanmış "Ekstra Hizmetler" (örneğin bebek koltuğu, içecek ikramı vb.) listelenmelidir.
    * Toplam Fiyat, anlık olarak şu formüle göre hesaplanıp ekranda gösterilmelidir:
        * `Toplam Fiyat = (Google Maps Mesafesi * Aracın KM Başı Ücreti) + Toplam Ek Hizmet Ücreti`
    * Hem "Aracın KM Başı Ücreti" hem de "Ek Hizmetler ve Fiyatları" admin panelinden dinamik olarak yönetilebilmelidir.

**Adım 3: Kişisel ve Uçuş Bilgileri**

* **Kullanıcı Bilgi Formu:** Ad, Soyad, E-posta Adresi, Telefon Numarası alanlarını içeren basit bir form sunulmalıdır.
* **Uçuş Bilgisi (Opsiyonel):** "Uçuş Bilgisi Ekle" gibi bir seçenekle açılan, uçuş numarasının girilebileceği bir alan olmalıdır. Bu bilgi, şoför paneline iletilecektir.

**Adım 4: Ödeme Yöntemleri**

* **Seçenekler:** Admin panelinde aktif edilen ödeme yöntemleri (Nakit, Banka Havalesi, Kredi Kartı) butonlar veya seçim kutuları olarak sunulmalıdır.
* **Banka Havalesi Akışı:** Seçildiğinde, admin panelinde tanımlı olan banka hesap bilgileri bir modal (pop-up) pencerede gösterilmelidir.
* **Kredi Kartı Akışı:** Seçildiğinde, sistem **PayTR ödeme altyapısı** ile entegre olmaya hazır bir arayüze yönlendirmelidir.
* **Test Modu:** Geliştirme aşaması için bir "Test Modu" anahtarı bulunmalıdır. Bu mod aktifken, "Rezervasyonu Tamamla" butonuna tıklandığında ödeme adımı atlanır ve rezervasyon doğrudan "Onaylandı" statüsüyle veritabanına kaydedilir.

**Adım 5: Rezervasyon Onayı ve Otomatik Üyelik**

* **Otomatik Üyelik Oluşturma:** Rezervasyon tamamlandığında, Adım 3'teki bilgilerle müşteri için otomatik bir kullanıcı hesabı oluşturulmalıdır.
* **Onay Ekranı Tasarımı:** Ekranda şu bilgiler net bir şekilde gösterilmelidir:
    * Başarılı rezervasyon onayı mesajı.
    * Müşterinin giriş yapacağı e-posta adresi.
    * Sistem tarafından oluşturulan **geçici ve güvenli bir şifre**.
    * Rezervasyonun tüm detaylarını içeren bir özet (rota, tarih, araç, fiyat vb.).
    * Rezervasyona özel, benzersiz ve taranabilir bir **QR Kod** üretilip gösterilmelidir.
    * "Müşteri Panelime Git" ve "Ana Sayfaya Dön" butonları bulunmalıdır.
* **E-posta Bildirimi:** Müşteriye tüm bu bilgileri içeren bir onay e-postası otomatik olarak gönderilmelidir.

**Adım 6: Yönetim Panelleri (Admin, Şoför, Müşteri)**

**A. Admin Paneli Fonksiyonları:**

* Gelen tüm rezervasyonları "Yeni Rezervasyonlar" listesinde, `SBS-101`, `SBS-102` gibi benzersiz ID'ler ile görüntüleme.
* Rezervasyon detaylarını inceleyip, sistemde kayıtlı şoförlerden birine atama yapma.
* Tüm rezervasyonların durumunu (Şoför Atandı, Yolculuk Başladı, Tamamlandı, İptal Edildi) canlı olarak takip etme.
* Finansal kayıtların otomatik oluşturulması: Bir yolculuk "Tamamlandı" statüsüne geçtiğinde, toplam tutarın `%X`'i şoförün hesabına alacak, `%Y`'si ise şirket komisyonu olarak finans modülüne işlenmelidir.
* **Dinamik Ayarlar:** Şoför komisyonu (`%X`) ve şirket komisyonu (`%Y`) oranlarını değiştirebileceği bir "Ayarlar" sayfası.

**B. Şoför Paneli Fonksiyonları (Sade ve İşlevsel Tasarım):**

* Sadece kendisine atanmış işleri liste halinde görme.
* Bir işe tıkladığında müşteri adı, telefonu, rota, tarih, saat ve uçuş numarası gibi tüm detayları görme.
* **QR Kod Okutma İşlevi:**
    * İş detayları ekranında bir "QR Kodu Okut" butonu bulunmalıdır.
    * Bu butona basıldığında cihazın kamerası açılmalıdır.
    * Müşterinin QR kodunu okuttuğunda sistem anlık doğrulama yapmalıdır (doğruysa onay, yanlışsa hata mesajı).
* **Yolculuk Durum Yönetimi:**
    * QR kod başarıyla okutulduğunda, rezervasyon durumu otomatik olarak "Yolculuk Başladı" olur. Bu durum anında admin ve müşteri paneline yansır.
    * Bu anda, şoför panelinde "Yolculuğu Tamamla" butonu aktif hale gelir.
    * Transfer bittiğinde, şoför bu butona basarak rezervasyon durumunu "Yolculuk Tamamlandı" olarak günceller.

**C. Müşteri Paneli Fonksiyonları (Rezervasyon Sonrası):**

* Geçmiş ve güncel tüm rezervasyonlarını listeleme.
* Bir rezervasyonun detayında, atama yapıldıktan sonra şoförün adını, soyadını ve araç plakasını görme.
* Rezervasyonunun durumunu (Onaylandı, Şoför Atandı, Yolculuk Başladı, Tamamlandı) canlı olarak takip edebilme.

#### **Bölüm 2: Yönetim Panelleri (Admin, Şoför, Müşteri)**

**A. Admin Paneli Mimarisi:**

Admin paneli, işletmenin tüm operasyonunu yönetebileceği kapsamlı bir araç olmalıdır. Menü yapısı aşağıdaki gibi sekmelerle düzenlenmelidir:

* **Dashboard:** Günün rezervasyon sayısı, bekleyen atamalar, tamamlanan yolculuklar gibi önemli metriklere hızlı bakış ve finansal özetler.
* **Araç Yönetimi:** Yeni araç ekleme (model, plaka, kapasite, KM başı ücret vb.), düzenleme ve silme.
* **Şoför Yönetimi:** Yeni şoför ekleme (kişisel bilgiler, atanan araç, komisyon oranı vb.), düzenleme ve pasife alma.
* **Rezervasyon Yönetimi:** `SBS-101` gibi benzersiz ID'ler ile gelen tüm rezervasyonları görüntüleme, şoför atama ve durumlarını canlı takip etme.
* **Finansal Yönetim:**
    * **Şoför Cari Hesapları:** Her şoför için ayrı bir cari hesap sayfası (hak ediş, ödeme, bakiye).
    * **Şirket komisyon gelirlerinin takibi.**
* **Ayarlar (Sekmeli Arayüz):**
    * **Genel Ayarlar:** Site başlığı, logo vb.
    * **Ödeme Ayarları:** PayTR API anahtarlarının girileceği alanlar.
    * **Banka Hesapları:** Müşterilerin göreceği banka hesap bilgilerinin yönetimi.
    * **Şirket Bilgileri:** Resmi şirket bilgilerinin yönetimi.
    * **Komisyon Ayarları:** Şoför/Şirket komisyon oranlarının dinamik olarak değiştirilmesi.

**B. Şoför Paneli Mimarisi (Mobil Uygulama Hissiyatı):**

* **Tasarım ve Deneyim:** Hızlı, akıcı, sade ve odaklanmış bir arayüz. Büyük, dokunması kolay butonlar ve dikkat çekici ikonlar kullanılmalıdır.
* **Fonksiyonlar:** Görev listesi, görev detayı (müşteri bilgileri, rota), "QR Kodu Okut" ve "Yolculuğu Tamamla" butonları, geçmiş işler ve hak ediş özeti.

**C. Müşteri Paneli Mimarisi (Mobil Uygulama Hissiyatı):**

* **Tasarım ve Deneyim:** Hızlı, akıcı ve sade bir tasarım.
* **Fonksiyonlar:** Kişisel Bilgilerim (görüntüleme/düzenleme), Rezervasyonlarım (geçmiş/gelecek rezervasyonlar ve canlı durum takibi), Hızlı Rezervasyon Butonu.

---

### **Geliştirme Kısıtlamaları ve Başlangıç Durumu**

* **Veritabanı ve Veri Durumu:** Proje, **boş bir Firebase projesi** üzerine inşa edilecektir. Firebase test modunda kurulmuştur. Kodlama aşamasında sisteme **hiçbir şekilde sahte (mock) veri eklenmeyecektir.** Şoför, müşteri, araçlar, ekstra hizmetler veya rezervasyonlar gibi hiçbir varlık için başlangıç objeleri veya test kişileri oluşturulmayacaktır. Sistemin tüm içeriği, bizzat kullanıcı (admin) tarafından, tamamlanmış ve fonksiyonel admin paneli arayüzü kullanılarak girilecektir. Girilen her veri, otomatik olarak ve doğrudan Firebase veritabanına kaydedilmelidir.
* **Zorunlu ve Sıralı İş Akışı:** Tüm panellerde (admin, şoför, müşteri) ve rezervasyon akışında, hiçbir buton, kart (card) veya aksiyon tamamlanmadan bir sonraki adıma geçişe izin verilmeyecektir. Sistemdeki tüm fonksiyonlar **eksiksiz ve aktif çalışır** halde olmalıdır. Bir özelliğin veya adımın bitmeden diğerine geçişi engellenmelidir.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6903uKvs3vjCkfreIvzensUFa25wVB9c",
  authDomain: "sbs-travel-96d0b.firebaseapp.com",
  projectId: "sbs-travel-96d0b",
  storageBucket: "sbs-travel-96d0b.firebasestorage.app",
  messagingSenderId: "689333443277",
  appId: "1:689333443277:web:d26c455760eb28a41e6784",
  measurementId: "G-G4FRHCJEDP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

<<<<<<< HEAD
google apı AIzaSyDa66vbuMgm_L4wdOgPutliu_PLzI3xqEw
=======
google apı AIzaSyDa66vbuMgm_L4wdOgPutliu_PLzI3xqEw
>>>>>>> 25b78fc79400e5ddf1e6af98c95bc0bc51cf0d91
