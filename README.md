# Kahramani Website - Safari Fix + Video Optimization

## 🚨 Root Cause

**The GIF file crashed iOS Safari** due to memory limits. GIFs decompress all frames into RAM (~500MB-2GB), exceeding iOS Safari's ~1.5GB limit.

## ✅ Solution: Optimized Video with Lazy Loading

The new `HeroBackground` component:
- Shows **poster image immediately** (fast first paint)
- Loads video **only on desktop with fast connections**
- Shows **static image on mobile/slow connections** (saves data, prevents crashes)
- Detects **data saver mode** and respects user preference

---

## 📁 Required Files

You need to create these files in your `/public` folder:

### 1. Poster Image (REQUIRED)
`/public/images/hero-poster.jpg` - ~50-100KB, shown immediately

```bash
# Extract first frame from your GIF/video
ffmpeg -i gen4.gif -vframes 1 -q:v 2 public/images/hero-poster.jpg

# Or compress an existing image
ffmpeg -i existing-image.jpg -q:v 3 public/images/hero-poster.jpg
```

### 2. Optimized MP4 Video
`/public/videos/hero.mp4` - Target: < 1.5MB (currently 2.7MB)

**Compress your 2.7MB video to ~1-1.5MB:**

```bash
mkdir -p public/videos

# Option A: Aggressive compression (recommended, ~800KB-1.2MB)
ffmpeg -i gen4.mp4 \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -vf "scale=1280:-2" \
  -an \
  -movflags +faststart \
  public/videos/hero.mp4

# Option B: Moderate compression (~1.5-2MB)
ffmpeg -i gen4.mp4 \
  -c:v libx264 \
  -crf 25 \
  -preset medium \
  -vf "scale=1920:-2" \
  -an \
  -movflags +faststart \
  public/videos/hero.mp4
```

**FFmpeg flags explained:**
- `-crf 28` = Quality (higher = smaller file, 23-30 is good for web)
- `-preset slow` = Better compression (takes longer to encode)
- `-vf "scale=1280:-2"` = Resize to 1280px width (no need for 4K)
- `-an` = Remove audio (not needed for background)
- `-movflags +faststart` = Enable streaming (video plays before fully loaded)

### 3. WebM Version (Optional, better compression)
`/public/videos/hero.webm` - Often 30-50% smaller than MP4

```bash
ffmpeg -i gen4.mp4 \
  -c:v libvpx-vp9 \
  -crf 35 \
  -b:v 0 \
  -vf "scale=1280:-2" \
  -an \
  public/videos/hero.webm
```

---

## 📊 Optimization Strategy

| User Scenario | What They See | Data Used |
|--------------|---------------|-----------|
| Mobile (any connection) | Static poster image | ~50-100KB |
| Desktop + Slow WiFi (2G/3G) | Static poster image | ~50-100KB |
| Desktop + Data Saver ON | Static poster image | ~50-100KB |
| Desktop + Fast WiFi (4G+) | Video (lazy loaded) | ~1-1.5MB |

### How it works:
1. **Immediate**: Poster image loads instantly (priority)
2. **Detection**: Component detects device type & connection speed
3. **Lazy load**: Video only loads on fast desktop connections
4. **Smooth transition**: Poster fades out when video is ready

---

## 🛠 File Structure After Setup

```
public/
├── images/
│   ├── hero-poster.jpg    ← NEW (50-100KB, shown first)
│   └── ... other images
└── videos/
    ├── hero.mp4           ← NEW (optimized, ~1-1.5MB)
    └── hero.webm          ← OPTIONAL (often smaller)
```

---

## 📦 Deployment Steps

1. **Create the poster image:**
   ```bash
   ffmpeg -i gen4.gif -vframes 1 -q:v 2 public/images/hero-poster.jpg
   ```

2. **Compress the video:**
   ```bash
   mkdir -p public/videos
   ffmpeg -i gen4.mp4 -c:v libx264 -crf 28 -preset slow -vf "scale=1280:-2" -an -movflags +faststart public/videos/hero.mp4
   ```

3. **Copy the fixed component files** from this package

4. **Build and deploy:**
   ```bash
   rm -rf .next
   npm run build
   # deploy to your platform
   ```

---

## 🧪 Testing Checklist

After deploying, test these scenarios:

- [ ] **iPhone Safari** - Should show static image, NO crash
- [ ] **Android Chrome** - Should show static image on mobile
- [ ] **Desktop Chrome (fast WiFi)** - Should show video after poster
- [ ] **Desktop (throttled to 3G in DevTools)** - Should show static image only
- [ ] **Desktop with Data Saver** - Should show static image only

### How to test slow connection:
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Select "Slow 3G" from throttling dropdown
4. Reload page - should only show poster image

---

## 📋 Files Included

```
components/
├── HeroBackground.tsx   ← Optimized video component
├── ProductGalleryCard.tsx
├── ProductCard.tsx
├── SiteHeader.tsx
└── Pagination.tsx

app/
├── page.tsx             ← Uses HeroBackground
├── globals.css          ← Removed blur effects
├── layout.tsx
├── error.tsx
├── global-error.tsx
├── not-found.tsx
├── catalog/page.tsx
├── contact/page.tsx
└── about/page.tsx

next.config.mjs
```

---

## 🔧 Troubleshooting

**Video not playing on desktop?**
- Check browser console for errors
- Ensure video file exists at `/public/videos/hero.mp4`
- Try clearing browser cache

**Poster image not showing?**
- Ensure `/public/images/hero-poster.jpg` exists
- Check file isn't corrupted (open it in an image viewer)

**Still seeing GIF?**
- Make sure you deployed the new `app/page.tsx`
- Clear `.next` folder and rebuild

**Video loads but is choppy?**
- Your video bitrate might be too high
- Re-encode with higher CRF value (e.g., `-crf 30`)
