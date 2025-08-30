# BiniOrbit Fonts

This folder contains all the font files used in the BiniOrbit frontend.

## 🔤 Font Families

### **Outfit Font Family**
- `Outfit-Thin.ttf` (100)
- `Outfit-ExtraLight.ttf` (200)
- `Outfit-Light.ttf` (300)
- `Outfit-Regular.ttf` (400)
- `Outfit-Medium.ttf` (500)
- `Outfit-SemiBold.ttf` (600)
- `Outfit-Bold.ttf` (700)
- `Outfit-ExtraBold.ttf` (800)
- `Outfit-Black.ttf` (900)

### **Syne Font Family**
- `Syne-Regular.ttf` (400)
- `Syne-Medium.ttf` (500)
- `Syne-SemiBold.ttf` (600)
- `Syne-Bold.ttf` (700)
- `Syne-ExtraBold.ttf` (800)
- `Syne-VariableFont_wght.ttf` (Variable)

## 🎨 Usage in CSS

### **Font Face Declarations**
```css
@font-face {
  font-family: 'Outfit';
  src: url('../fonts/Outfit-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Syne';
  src: url('../fonts/Syne-ExtraBold.ttf') format('truetype');
  font-weight: 800;
  font-style: normal;
}
```

### **Font Stack**
```css
body {
  font-family: 'Inter', 'Outfit', 'Poppins', Arial, sans-serif;
}

.logo {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
}
```

## 📝 Font Roles

- **Outfit**: Primary UI font for body text and interface elements
- **Syne**: Display font for logos, headings, and branding
- **Inter**: Web font fallback (loaded from Google Fonts)

## 🌐 Web Font Optimization

For production use, consider:
1. Converting to WOFF2 format for better compression
2. Using font-display: swap for better loading performance
3. Preloading critical font files
4. Subsetting fonts to reduce file size

## 📄 License

Please ensure you have proper licensing for these fonts before using in production.