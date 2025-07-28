#!/bin/bash

# City transfer dosyalarındaki breadcrumb'ları düzelt
FILES=(
  "src/pages/City/SideTransfer.jsx"
  "src/pages/City/KalkanTransfer.jsx"
  "src/pages/City/KasTransfer.jsx"
  "src/pages/City/SerikTransfer.jsx"
  "src/pages/City/LaraTransfer.jsx"
  "src/pages/City/ManavgatTransfer.jsx"
  "src/pages/City/KemerTransfer.jsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Düzenleniyor: $file"
    
    # mb-6 -> mb-8 değiştir
    sed -i 's/mb-6" aria-label="Breadcrumb"/mb-8" aria-label="Breadcrumb"/g' "$file"
    
    # Ana Sayfa link'ine onClick ekle
    sed -i 's|to="/" |to="/" \n                  onClick={() => window.scrollTo(0, 0)}|g' "$file"
    
    # Hizmetlerimiz link'ine onClick ekle
    sed -i 's|to="/hizmetlerimiz" |to="/hizmetlerimiz" \n                    onClick={() => window.scrollTo(0, 0)}|g' "$file"
    
    echo "✅ $file düzenlendi"
  else
    echo "❌ $file bulunamadı"
  fi
done

echo "🎉 Tüm breadcrumb'lar düzeltildi!"
