# Images Setup Instructions

## Adding Your Company Images

To add your company images to the receipt system:

### 1. Company Logo
1. **Prepare your logo file:**
   - Recommended formats: PNG, JPG, or SVG
   - Recommended size: 200x200 pixels or similar square/rectangular ratio
   - File name: `logo.png`

2. **Place the logo file:**
   - Copy your logo file to: `frontend/public/logo.png`

3. **Logo placement:**
   - The logo appears in the top-left of the header on screen
   - The logo also appears in the printed receipt header

### 2. Top Receipt Image
1. **Prepare your top image:**
   - File name: `top.jpg`
   - Recommended: Wide banner-style image
   - Max height: 150px (will auto-scale)

2. **Place the top image:**
   - Copy your image to: `frontend/public/top.jpg`

3. **Top image placement:**
   - Only appears in printed receipts (not on screen)
   - Positioned at the very top of the receipt
   - Full width of the receipt

### 3. Bottom Receipt Image  
1. **Prepare your bottom image:**
   - File name: `back.jpg`
   - Can be larger than top image
   - Max height: 200px (will auto-scale)

2. **Place the bottom image:**
   - Copy your image to: `frontend/public/back.jpg`

3. **Bottom image placement:**
   - Only appears in printed receipts (not on screen)
   - Positioned at the bottom of the receipt
   - Full width of the receipt

## Files Required:
- `frontend/public/logo.png` - Company logo (screen + print)
- `frontend/public/top.jpg` - Top receipt image (print only)
- `frontend/public/back.jpg` - Bottom receipt image (print only)

All images automatically hide if files are not found (no broken image icons).

4. **Customization:**
   - Logo size can be adjusted in `frontend/src/App.css`
   - Look for `.company-logo` and `.print-logo` classes
   - Current size: 60px height for screen, 50px for print

## Current Logo Settings

```css
.company-logo {
  height: 60px;        /* Screen display height */
  width: auto;         /* Maintains aspect ratio */
  max-width: 80px;     /* Maximum width */
}

.print-logo {
  height: 50px;        /* Print display height */
  max-width: 70px;     /* Maximum width for print */
}
```

## Mobile Responsive

The logo automatically adjusts for mobile devices:
- Stacks vertically with company name on small screens
- Reduces to 50px height on mobile
- Maintains proper spacing and alignment