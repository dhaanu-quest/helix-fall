# 🎨 Assets Folder - Scape Characters

This folder contains your Scape character assets (Mooderlings) for the Helix Fall game.

## 📁 Folder Structure

```
assets/
├── models/          ← Place 3D models here (.glb or .gltf files)
│   └── mooderling.glb
│
├── sprites/         ← Place 2D images here (.png files)
│   └── mooderling.png
│
└── sounds/          ← Game sound effects (already included)
    ├── pop.mp3
    ├── spike.mp3
    └── break.mp3
```

---

## 🎮 How to Add Your Characters

### For 3D Models (GLTF/GLB):

1. **Export your Mooderling** from Blender, Unity, or your 3D software
2. **Save as `.glb`** (recommended) or `.gltf`
3. **Place in `models/` folder**
4. **Name it** (e.g., `fire-mooderling.glb`, `water-mooderling.glb`)

**Example:**
```
models/
├── fire-mooderling.glb
├── water-mooderling.glb
├── earth-mooderling.glb
└── air-mooderling.glb
```

### For 2D Sprites (PNG):

1. **Export your Mooderling** as PNG with transparent background
2. **Recommended size:** 512x512 or 1024x1024 pixels
3. **Place in `sprites/` folder**
4. **Name it** (e.g., `fire-mooderling.png`)

**Example:**
```
sprites/
├── fire-mooderling.png
├── water-mooderling.png
├── earth-mooderling.png
└── air-mooderling.png
```

---

## 🎯 Usage in Game

### Using a 3D Model:
```javascript
window.gameConfig = {
    useCharacter: true,
    characterType: 'gltf',
    characterModel: '/assets/models/fire-mooderling.glb'
};
```

### Using a 2D Sprite:
```javascript
window.gameConfig = {
    useCharacter: true,
    characterType: 'sprite',
    characterModel: '/assets/sprites/fire-mooderling.png'
};
```

---

## 📝 File Requirements

### 3D Models:
- **Format:** `.glb` (preferred) or `.gltf`
- **Size:** Under 5MB recommended
- **Polygons:** 1,000 - 10,000 triangles
- **Textures:** Embedded in GLB or in same folder
- **Animations (optional):** Name them `idle` and `bounce`

### 2D Sprites:
- **Format:** `.png` with transparency
- **Size:** 512x512 or 1024x1024 pixels
- **Background:** Transparent (alpha channel)
- **View:** Front-facing character

---

## 🎨 The Scape Brand Colors

Your characters should complement these colors:
- **Primary Green:** `#10F48B` (RGB: 16, 244, 139)
- **Dark Background:** `#090C0F` (RGB: 9, 12, 15)
- **Pink/Magenta:** `#EA088B` (RGB: 234, 8, 139)

---

## 🚀 Quick Test

1. Place your character file in the appropriate folder
2. Open `example-with-character.html` in browser
3. Select your character type
4. Enter the path (e.g., `/assets/models/mooderling.glb`)
5. Click "Load Game with Character"

---

## 📚 More Info

See `CHARACTER_INTEGRATION_GUIDE.md` in the root folder for detailed instructions.

