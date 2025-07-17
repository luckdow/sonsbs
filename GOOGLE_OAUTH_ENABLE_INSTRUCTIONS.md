// Google OAuth butonlarını aktif hale getirmek için:

// LoginPage.jsx'de:
disabled={isGoogleLoading || isLoading} // Bu şekilde değiştirin
// Ve text'i:
"Google ile Devam Et" // Bu şekilde değiştirin

// RegisterPage.jsx'de:
disabled={isGoogleLoading || isLoading} // Bu şekilde değiştirin  
// Ve text'i:
"Google ile Kayıt Ol" // Bu şekilde değiştirin

// Firebase Console ayarı tamamlandıktan sonra bu değişiklikleri yapın.
