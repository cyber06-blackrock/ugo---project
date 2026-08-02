# How to Add Real Images to Your Jaipur Uber Clone

## Why External Images Don't Work

**CORS (Cross-Origin Resource Sharing) Error** - Your browser blocks loading images from external websites for security reasons. This is why URLs from Unsplash, Pixabay, Wikimedia, etc. won't display.

## THE SOLUTION: Download Images Locally

You MUST download images to your computer and place them in your project folder.

---

## Step-by-Step Instructions

### Step 1: Download Images

Visit these FREE image websites and DOWNLOAD (don't just copy URL):

1. **Pexels** - https://www.pexels.com/
2. **Pixabay** - https://pixabay.com/
3. **Unsplash** - https://unsplash.com/

### Step 2: Search and Download

Search for these and click "Free Download":

- "Amer Fort Jaipur" → Save as `amer-fort.jpg`
- "Hawa Mahal Jaipur" → Save as `hawa-mahal.jpg`
- "City Palace Jaipur" → Save as `city-palace.jpg`
- "Jal Mahal Jaipur" → Save as `jal-mahal.jpg`
- "Sedan car side view" → Save as `sedan-car.jpg`
- "Auto rickshaw India" → Save as `auto-rickshaw.jpg`
- "Motorcycle" → Save as `motorcycle.jpg`
- "SUV car" → Save as `suv-car.jpg`

### Step 3: Place Images in Project

Copy all downloaded images to:
```
C:\Users\Anvesha Dwivedi\OneDrive\Desktop\uber\frontend\public\images\
```

The folder structure should look like:
```
uber/
  frontend/
    public/
      images/
        amer-fort.jpg
        hawa-mahal.jpg
        city-palace.jpg
        jal-mahal.jpg
        sedan-car.jpg
        auto-rickshaw.jpg
        motorcycle.jpg
        suv-car.jpg
```

### Step 4: Refresh Browser

Once images are in the folder, refresh your browser (Ctrl+R or F5).

---

## Quick Example: Downloading from Pexels

1. Go to https://www.pexels.com/
2. Type "Amer Fort" in search
3. Click on a nice photo
4. Click the green "Free Download" button
5. Save the file
6. Rename it to `amer-fort.jpg`
7. Move it to: `C:\Users\Anvesha Dwivedi\OneDrive\Desktop\uber\frontend\public\images\`
8. Done!

---

## Why This Is the ONLY Solution

❌ **Won't Work:**
- Copying image URLs from Google
- Using Unsplash/Pixabay URLs directly
- Hotlinking to external sites

✅ **Will Work:**
- Downloading images to your computer
- Placing them in `public/images/` folder
- Using local paths like `/images/amer-fort.jpg`

---

## Current Status

Right now, your app uses:
- SVG illustrations (these work but aren't real photos)
- CSS animations for vehicles

Once you add real images to the `public/images/` folder, they will automatically replace the SVG placeholders!

---

## Need Help?

1. Make sure the `public/images/` folder exists
2. Make sure image names match exactly (case-sensitive!)
3. Supported formats: .jpg, .jpeg, .png, .webp
4. Refresh browser after adding images

The code is already set up to use these images - you just need to download and place them!
