# SBS Transfer - Admin Panel İş Akışı ve Sistem Gereksinimleri

## 🎯 Temel Felsefe ve Tasarım Prensipleri

### Kullanıcı Deneyimi (UX)
- **Rezervasyon akışı:** Kesintisiz ve zorunlu adımlarla ilerleme
- **Panel Optimizasyonu:** 
  - Admin: Fonksiyonel ve kapsamlı
  - Şoför/Müşteri: Mobil uygulama sadeliğinde

### Kullanıcı Arayüzü (UI)
- **Tasarım Estetiği:** iOS tasarım estetiğine benzer görünüm
- **Görsel Öğeler:** 
  - Modern, minimalist tasarım
  - Temiz çizgiler
  - Akıcı animasyonlar
  - Kart (card) tabanlı grid yapılar
- **Zenginleştirici Öğeler:**
  - Gösterişli ve anlaşılır ikonlar
  - Anlık uyarılar ve bildirimler
  - Özellikle şoför ve müşteri panellerinde deneyimi zenginleştiren öğeler

### Performans
- **Responsive:** Tüm platformlarda (mobil, tablet, masaüstü) hızlı ve duyarlı
- **Optimizasyon:** API çağrıları ve veritabanı işlemleri optimize edilmeli

## 🏗️ Sistem Mimarisi ve Kod Kalitesi

### Modüler Yapı
- Birbirinden bağımsız ancak entegre çalışabilen modüller
- **Örnekler:** Rezervasyon Modülü, Kullanıcı Modülü, Finans Modülü

### Genişletilebilirlik
- Esnek ve ölçeklenebilir mimari
- Gelecekte yeni özelliklerin kolayca eklenebilmesi

### Temiz Kod
- Okunabilir, sürdürülebilir ve iyi belgelenmiş kod tabanı

---

# 📋 Detaylı Sistem Çalışma Akışı

## Bölüm 1: Müşteri Rezervasyon Akışı (Adım 1-5)

### Adım 1: Ana Sayfa - Rota ve Transfer Detaylarının Belirlenmesi

#### Transfer Yönü Seçimi
- "Havalimanından Otele" ve "Otelden Havalimanına" şeklinde iki net seçenek

#### Adres Girişi
- **Tek Adres Alanı:** Kullanıcı yazmaya başladığında Google Places API (Autocomplete) devreye girer
- **Öneriler:** Adres önerileri liste halinde sunulur
- **Seçim:** Kullanıcı listeden seçince başlangıç/varış noktası olarak ayarlanır

#### Yolculuk Detayları
- **Tarih Seçici:** Modern ve kolay kullanımlı takvim arayüzü
- **Saat Seçici:** Pratik saat belirleme arayüzü
- **Yolcu Sayısı:** Artırma/azaltma butonları olan sayısal giriş
- **Bagaj Adedi:** Artırma/azaltma butonları olan sayısal giriş

#### İlerleme
- **Buton:** "Araçları Bul" veya "Fiyatları Gör"
- **Kısıt:** Tüm alanlar doldurulmadan aktif olmamalı

### Adım 2: Araç Seçimi ve Dinamik Fiyatlandırma

#### Harita Görselleştirmesi
- **Rota Çizimi:** Google Maps API (Directions Service) kullanılarak
- **Bilgiler:** Toplam mesafe (km) ve tahmini seyahat süresi net gösterim

#### Araç Listeleme
- **Filtreleme:** Yolcu ve bagaj sayısına göre otomatik filtreleme
- **Kapasiteli Araçlar:** Sadece uygun kapasiteli araçlar listelenir
- **Görünüm:** Modern "3'lü grid" yapısında kartlar
- **Kart İçeriği:** Araç resmi, model, kapasite bilgileri

#### Dinamik Fiyatlandırma Mekanizması
- **Ekstra Hizmetler:** Araç seçiminde özel hizmetler listelenir
- **Fiyat Formülü:** 
  ```
  Toplam Fiyat = (Google Maps Mesafesi * Aracın KM Başı Ücreti) + Toplam Ek Hizmet Ücreti
  ```
- **Admin Yönetimi:** KM başı ücret ve ek hizmetler admin panelinden yönetilir

### Adım 3: Kişisel ve Uçuş Bilgileri

#### Kullanıcı Bilgi Formu
- Ad, Soyad, E-posta Adresi, Telefon Numarası alanları

#### Uçuş Bilgisi (Opsiyonel)
- "Uçuş Bilgisi Ekle" seçeneği
- Uçuş numarası girişi (şoför paneline iletilir)

### Adım 4: Ödeme Yöntemleri

#### Seçenekler
- Admin panelinde aktif edilen ödeme yöntemleri
- Nakit, Banka Havalesi, Kredi Kartı butonları/seçim kutuları

#### Banka Havalesi Akışı
- Admin panelinde tanımlı banka hesap bilgileri modal'da gösterilir

#### Kredi Kartı Akışı
- PayTR ödeme altyapısı ile entegre arayüz

#### Test Modu
- Geliştirme için "Test Modu" anahtarı
- Aktif olduğunda ödeme adımı atlanır
- Rezervasyon doğrudan "Onaylandı" statüsüyle kaydedilir

### Adım 5: Rezervasyon Onayı ve Otomatik Üyelik

#### Otomatik Üyelik Oluşturma
- Adım 3'teki bilgilerle müşteri hesabı otomatik oluşturulur

#### Onay Ekranı Tasarımı
- **Gösterilecek Bilgiler:**
  - Başarılı rezervasyon onayı mesajı
  - Müşterinin giriş e-posta adresi
  - Sistem tarafından oluşturulan geçici güvenli şifre
  - Rezervasyon detayları özeti (rota, tarih, araç, fiyat)
  - Benzersiz ve taranabilir QR Kod
  - "Müşteri Panelime Git" ve "Ana Sayfaya Dön" butonları

#### E-posta Bildirimi
- Tüm bilgileri içeren onay e-postası otomatik gönderilir

---

## Bölüm 2: Yönetim Panelleri (Admin, Şoför, Müşteri)

### A. Admin Paneli Mimarisi

Admin paneli, işletmenin tüm operasyonunu yönetebileceği kapsamlı araç olmalıdır.

#### Menü Yapısı (Sekmeler)

##### Dashboard
- Günün rezervasyon sayısı
- Bekleyen atamalar
- Tamamlanan yolculuklar
- Önemli metriklere hızlı bakış
- Finansal özetler

##### Araç Yönetimi
- **Yeni Araç Ekleme:** Model, plaka, kapasite, KM başı ücret
- **Düzenleme ve Silme:** Mevcut araçları yönetme

##### Şoför Yönetimi
- **Yeni Şoför Ekleme:** Kişisel bilgiler, atanan araç, komisyon oranı
- **Düzenleme:** Mevcut şoförleri yönetme
- **Pasife Alma:** Şoför durumunu değiştirme

##### Rezervasyon Yönetimi
- **Benzersiz ID'ler:** `SBS-101` gibi ID'lerle rezervasyon görüntüleme
- **Şoför Atama:** Rezervasyonlara şoför atama
- **Canlı Takip:** Rezervasyon durumlarını takip etme

##### Finansal Yönetim
- **Şoför Cari Hesapları:** 
  - Her şoför için ayrı cari hesap sayfası
  - Hak ediş, ödeme, bakiye takibi
- **Şirket Komisyon Gelirleri:** Komisyon gelirlerinin takibi

##### Ayarlar (Sekmeli Arayüz)
- **Genel Ayarlar:** Site başlığı, logo
- **Ödeme Ayarları:** PayTR API anahtarları
- **Banka Hesapları:** Müşterilerin göreceği banka hesap bilgileri
- **Şirket Bilgileri:** Resmi şirket bilgileri
- **Komisyon Ayarları:** Şoför/Şirket komisyon oranlarının dinamik yönetimi

### B. Şoför Paneli Mimarisi (Mobil Uygulama Hissiyatı)

#### Tasarım ve Deneyim
- Hızlı, akıcı, sade ve odaklanmış arayüz
- Büyük, dokunması kolay butonlar
- Dikkat çekici ikonlar

#### Fonksiyonlar
- **Görev Listesi:** Atanan görevlerin listesi
- **Görev Detayı:** Müşteri bilgileri, rota bilgileri
- **QR Kodu Okut:** Müşteri doğrulama
- **Yolculuğu Tamamla:** Görev sonlandırma
- **Geçmiş İşler:** Tamamlanan görevler
- **Hak Ediş Özeti:** Finansal durum

### C. Müşteri Paneli Mimarisi (Mobil Uygulama Hissiyatı)

#### Tasarım ve Deneyim
- Hızlı, akıcı ve sade tasarım

#### Fonksiyonlar
- **Kişisel Bilgilerim:** Görüntüleme/düzenleme
- **Rezervasyonlarım:** 
  - Geçmiş/gelecek rezervasyonlar
  - Canlı durum takibi
- **Hızlı Rezervasyon Butonu:** Yeni rezervasyon oluşturma

---

## 🚫 Geliştirme Kısıtlamaları ve Başlangıç Durumu

### Veritabanı ve Veri Durumu
- **Boş Firebase Projesi:** Proje boş bir Firebase projesi üzerine inşa edilecek
- **Test Modu:** Firebase test modunda kurulmuş
- **Sahte Veri Yasağı:** Hiçbir şekilde mock veri eklenmeyecek
- **Başlangıç Objeleri Yasağı:** 
  - Şoför, müşteri, araçlar, ekstra hizmetler veya rezervasyonlar için
  - Hiçbir başlangıç objesi veya test kişisi oluşturulmayacak
- **Admin Girişi:** Tüm içerik admin paneli arayüzü kullanılarak girilecek
- **Otomatik Kayıt:** Girilen her veri otomatik olarak Firebase'e kaydedilecek

### Zorunlu ve Sıralı İş Akışı
- **Tamamlanma Zorunluluğu:** Hiçbir buton, kart veya aksiyon tamamlanmadan sonraki adıma geçişe izin verilmeyecek
- **Eksiksiz Fonksiyonlar:** Sistemdeki tüm fonksiyonlar eksiksiz ve aktif çalışır halde olmalı
- **Adım Engelleme:** Bir özellik/adım bitmeden diğerine geçiş engellenecek

---

## 📚 Referans Notları

Bu doküman, SBS Transfer projesi için temel iş akışı ve gereksinimleri içermektedir. Geliştirme sürecinde bu doküman sürekli referans alınmalı ve tüm özellikler bu spesifikasyonlara uygun şekilde geliştirilmelidir.

**Son Güncelleme:** 17 Temmuz 2025
**Durum:** Admin Panel modernizasyonu için referans doküman
