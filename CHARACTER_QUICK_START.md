# 🎮 Quick Start - Add Scape Characters to Helix Fall

## ✅ What's Ready

Your game now supports **3 ways** to add Scape characters (Mooderlings):

1. **🎨 Procedural** - Built-in, no files needed (ready to test NOW!)
2. **📦 3D Models** - GLTF/GLB files with animations
3. **🖼️ 2D Sprites** - PNG images with transparency

---

## 🚀 Test RIGHT NOW (No Files Needed!)

### Option 1: URL Parameters
Open in browser:
```
http://localhost:8081/?useCharacter=true&characterType=procedural
```

### Option 2: Interactive Example
Open in browser:
```
http://localhost:8081/example-with-character.html
```
Then select "Procedural Character" and click "Load Game"!

---

## 📦 Add Your Own 3D Mooderling

### Step 1: Prepare Your Model
- Export from Blender/Unity as `.glb` file
- Keep it under 5MB
- Optionally add animations named `idle` and `bounce`

### Step 2: Place the File
```
public/assets/models/mooderling.glb
```

### Step 3: Test It
Open:
```
http://localhost:8081/?useCharacter=true&characterType=gltf&characterModel=/assets/models/mooderling.glb
```

Or use the interactive example page!

---

## 🖼️ Add a 2D Sprite

### Step 1: Prepare Your Image
- PNG with transparent background
- 512x512 or 1024x1024 pixels
- Front-facing view of Mooderling

### Step 2: Place the File
```
public/assets/sprites/mooderling.png
```

### Step 3: Test It
Open:
```
http://localhost:8081/?useCharacter=true&characterType=sprite&characterModel=/assets/sprites/mooderling.png
```

---

## 💻 Code Integration

### In Your HTML:
```html
<script>
    window.gameConfig = {
        useCharacter: true,
        characterType: 'gltf',  // or 'sprite' or 'procedural'
        characterModel: '/assets/models/mooderling.glb'
    };
</script>
<script src="main.js"></script>
```

### In Iframe:
```html
<iframe 
    src="game.html?useCharacter=true&characterType=gltf&characterModel=/assets/models/mooderling.glb"
    width="100%" 
    height="600px">
</iframe>
```

---

## 🎨 What the Procedural Character Looks Like

The built-in procedural character is a simple 3D character made with code:
- **Body:** Green sphere (The Scape brand color `#10F48B`)
- **Eyes:** Two white spheres with black pupils
- **Animation:** Rotates while falling
- **Perfect for:** Testing or if you don't have 3D models yet!

---

## 📁 File Structure

```
public/
└── assets/
    ├── models/          ← Put .glb/.gltf files here
    │   └── mooderling.glb
    └── sprites/         ← Put .png files here
        └── mooderling.png
```

---

## 🧪 Console Logs

Open browser console (F12) to see:
```
🎮 Using Character mode: procedural
🎨 Creating procedural character
✅ Procedural character created
```

Or for 3D models:
```
🎮 Using Character mode: gltf
📦 Loading 3D model from: /assets/models/mooderling.glb
📥 Loading: 100%
✅ 3D model loaded successfully
🎬 Animation loaded: idle
✅ Character model setup complete
```

---

## 🎯 Next Steps

1. **Test procedural character** - Works immediately!
2. **Create/export your Mooderling** as GLB or PNG
3. **Place in the assets folder**
4. **Test with the example page**
5. **Integrate into your app**

---

## 📚 Full Documentation

- **`CHARACTER_INTEGRATION_GUIDE.md`** - Complete guide with all details
- **`example-with-character.html`** - Interactive testing page
- **`public/assets/README.md`** - Asset folder guide

---

## 🎨 The Scape Colors (Already Applied)

- **Primary Green:** `#10F48B` - Character, UI, gaps
- **Dark Background:** `#090C0F` - Background, platforms
- **Pink/Magenta:** `#EA088B` - Spikes (danger)

Your characters will fit perfectly with these colors! 🎮✨

---

**Ready to test!** Open the example page or use URL parameters to see your character in action! 🚀

