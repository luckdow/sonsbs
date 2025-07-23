# 💰 Komisyon Sistemi Nasıl Çalışır?

## 🎯 Komisyon Oranları
- Her şoför için **bireysel komisyon oranı** belirlenir (Şöför Yönetimi'nde)
- Varsayılan komisyon: **%30** (şirkete)
- Şoför kazancı: **%70** (örnek: %30 komisyon için)

## 💳 Ödeme Akışları

### 1. 💰 Nakit Ödeme
```
Rezervasyon: 100€
Komisyon: 30€ (30%)
Şoför Kazancı: 70€

Akış:
1. Şoför müşteriden 100€ nakit alır
2. Şoför firmaya 30€ komisyon borçlu olur
3. Şoför cari hesabı: -30€ (firma alacaklı)
```

### 2. 💳 Kredi Kartı/Havale
```
Rezervasyon: 100€
Komisyon: 30€ (30%)
Şoför Kazancı: 70€

Akış:
1. Müşteri firmaya 100€ öder
2. Firma şofore 70€ ödeyecek
3. Şoför cari hesabı: +70€ (şoför alacaklı)
```

## 🔄 Canlı Güncelleme

### Şoför Panelinde:
1. Şoför "Yolculuğu Tamamla" butonuna basar
2. Sistem otomatik olarak:
   - Rezervasyon durumunu "tamamlandı" yapar
   - Şoförün komisyon oranını kullanarak hesaplar
   - Cari hesabını günceller
   - Finansal raporlara yansıtır

### Admin Panelinde:
- **Finansal Yönetim > Şoför Carileri**: Tüm şoförlerin bakiyelerini görüntüle
- **Komisyon Takibi**: Komisyonlu şoför işlemlerini izle
- **Manuel Ödemeler**: Dışarıdan alınan şoförler için

## 📊 Cari Hesap Mantığı

### Pozitif Bakiye (+)
- **Şoför alacaklı**: Firma şofore para ödeyecek
- **Genellikle**: Kredi kartı ödemeli rezervasyonlar

### Negatif Bakiye (-)
- **Şoför borçlu**: Şoför firmaya para ödeyecek  
- **Genellikle**: Nakit ödemeli rezervasyonlar

## 🚀 Özellikler

### ✅ Otomatik Hesaplama
- Şoför komisyon oranı dinamik
- Gerçek zamanlı cari hesap güncelleme
- Ödeme metoduna göre akış farklılaşır

### ✅ Manuel Kontrol
- Admin panelinden manuel ödeme girişi
- Şoför bazında komisyon düzenleme
- Detaylı finansal raporlar

### ✅ Şeffaf Sistem
- Şoför kendi kazancını görebilir
- Admin tüm finansal durumu izleyebilir
- Rezervasyon bazında detay takibi

## 📱 Kullanım Senaryosu

```
1. Müşteri rezervasyon yapar (100€)
2. Admin şofere atama yapar
3. Şoför müşteriyi alır ve teslim eder
4. Şoför "Tamamla" butonuna basar
5. Sistem otomatik:
   ✓ Şoför komisyon oranını kullanır (%30)
   ✓ Ödeme metoduna göre cari hesap günceller
   ✓ Finansal raporlara yansıtır
   ✓ Admin panelinde gösterir
```

## 🔧 Teknik Detaylar

- **Komisyon Field**: `driver.commission` (% olarak, 0-100 arası)
- **Hesaplama**: `driverEarning = totalPrice - (totalPrice * commission / 100)`
- **Cari Güncelleme**: `financialIntegration.js`
- **Real-time**: Şoför "Tamamla" dediği anda aktif

Bu sistem sayesinde komisyon hesaplamaları **canlı**, **dinamik** ve **şoför bazında özelleştirilebilir** hale geliyor! 🎉
