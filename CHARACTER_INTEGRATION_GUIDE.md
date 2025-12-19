# 🎮 Scape Character Integration Guide

## Overview

You can now replace the default ball with your Scape characters (Mooderlings) in the Helix Fall game! The system supports **3 different methods**:

1. **3D Models (GLTF/GLB)** - Best quality, supports animations
2. **2D Sprites (PNG)** - Simple images, always face camera
3. **Procedural Characters** - Code-generated, no files needed

---

## 🚀 Quick Start

### Option 1: Test with Built-in Procedural Character

No files needed! Just add this to your HTML:

```html
<script>
    window.gameConfig = {
        useCharacter: true,
        characterType: 'procedural'
    };
</script>
<script src="main.js"></script>
```

Or use URL parameters:
```
http://localhost:8081/?useCharacter=true&characterType=procedural
```

### Option 2: Use a 3D Model (Mooderling GLB/GLTF)

1. **Export your Mooderling** as `.glb` or `.gltf` from Blender/Unity/etc.
2. **Place the file** in `/public/assets/models/mooderling.glb`
3. **Configure the game:**

```html
<script>
    window.gameConfig = {
        useCharacter: true,
        characterType: 'gltf',
        characterModel: '/assets/models/mooderling.glb'
    };
</script>
<script src="main.js"></script>
```

### Option 3: Use a 2D Sprite (PNG Image)

1. **Export your Mooderling** as PNG with transparent background
2. **Place the file** in `/public/assets/sprites/mooderling.png`
3. **Configure the game:**

```html
<script>
    window.gameConfig = {
        useCharacter: true,
        characterType: 'sprite',
        characterModel: '/assets/sprites/mooderling.png'
    };
</script>
<script src="main.js"></script>
```

---

## 📁 File Structure

```
public/
├── assets/
│   ├── models/          ← Place .glb/.gltf files here
│   │   └── mooderling.glb
│   └── sprites/         ← Place .png files here
│       └── mooderling.png
```

---

## 🎨 3D Model Requirements

### Recommended Specs:
- **Format:** `.glb` (preferred) or `.gltf`
- **Size:** Under 5MB for fast loading
- **Polygons:** 1,000 - 10,000 triangles (mobile-friendly)
- **Textures:** 512x512 or 1024x1024 PNG/JPG
- **Scale:** Any size (auto-scaled to fit ball size)

### Supported Animations (Optional):
If your model has animations, name them:
- `idle` or `Idle` - Plays while falling
- `bounce` or `Bounce` - Plays when hitting platform

The system will automatically detect and play these animations!

### Export from Blender:
1. File → Export → glTF 2.0 (.glb/.gltf)
2. Check: ✅ Include Animations
3. Check: ✅ Apply Modifiers
4. Format: **glTF Binary (.glb)** (recommended)

---

## 🖼️ 2D Sprite Requirements

### Recommended Specs:
- **Format:** PNG with transparency
- **Size:** 512x512 or 1024x1024 pixels
- **Background:** Transparent
- **Style:** Front-facing view of Mooderling

The sprite will always face the camera (billboard effect).

---

## 🎨 Procedural Character

The built-in procedural character creates a simple 3D character using:
- Sphere body (The Scape green color)
- Two eyes with pupils
- Automatically matches your brand colors

Perfect for testing or if you don't have 3D models yet!

---

## 🧪 Testing

### Interactive Example Page:
Open `example-with-character.html` in your browser to test different character types with a visual interface.

### Console Logs:
Open browser console (F12) to see:
```
🎮 Using Character mode: gltf
📦 Loading GLTF model: /assets/models/mooderling.glb
📥 Loading: 50%
✅ 3D model loaded successfully
🎬 Animation loaded: idle
✅ Character model setup complete
```

---

## 💻 Advanced Configuration

### Multiple Characters (Random Selection):

```javascript
const characters = [
    '/assets/models/mooderling1.glb',
    '/assets/models/mooderling2.glb',
    '/assets/models/mooderling3.glb'
];

window.gameConfig = {
    useCharacter: true,
    characterType: 'gltf',
    characterModel: characters[Math.floor(Math.random() * characters.length)]
};
```

### Character with Custom Colors:

Edit `src/character.ts` line 133 to change procedural character colors:
```typescript
const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x10F48B,  // The Scape green
    roughness: 0.7,
    metalness: 0.3
});
```

---

## 🎯 Integration with Your App

### Iframe Embedding:
```html
<iframe 
    src="https://your-game.com/?useCharacter=true&characterType=gltf&characterModel=/assets/models/mooderling.glb"
    width="100%" 
    height="600px">
</iframe>
```

### Dynamic Character Selection:
```javascript
function loadGameWithCharacter(characterId) {
    const iframe = document.getElementById('game-iframe');
    iframe.src = `./index.html?useCharacter=true&characterType=gltf&characterModel=/assets/models/${characterId}.glb`;
}

// Let user choose their Mooderling
loadGameWithCharacter('fire-mooderling');
```

---

## 🐛 Troubleshooting

### Model doesn't appear:
- Check console for errors (F12)
- Verify file path is correct
- Make sure file is in `/public/` folder
- Try procedural character first to test system

### Model is too big/small:
- The system auto-scales models to fit
- If issues persist, scale your model to ~1 unit in Blender before export

### Animations don't play:
- Check animation names (must be `idle` or `bounce`)
- Verify animations are included in export
- Check console for animation logs

### Model is black/no textures:
- Ensure textures are embedded in GLB file
- Or place textures in same folder as GLTF
- Check material settings in Blender

---

## 📚 Next Steps

1. **Test with procedural character** - No files needed!
2. **Create/export your Mooderling** as GLB
3. **Place in `/public/assets/models/`**
4. **Configure and test**
5. **Add animations** for extra polish!

---

## 🎨 The Scape Brand Colors (Already Applied)

The game already uses The Scape colors:
- **Primary Green:** `#10F48B` - UI, gaps, default character
- **Dark Background:** `#090C0F` - Background, platforms
- **Pink/Magenta:** `#EA088B` - Spikes (danger)

Your 3D models should complement these colors!

---

**Ready to add your Mooderlings!** 🎮✨

