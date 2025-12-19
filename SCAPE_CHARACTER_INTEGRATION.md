# The Scape Character Integration Guide

This guide explains how to integrate Scape Mooderling characters into the Helix Fall game.

## Brand Colors Applied ✅

The following brand colors from The Scape have been integrated:

- **Primary Green**: `#10F48B` - Used for ball, gaps, UI text, and title
- **Dark Background**: `#090C0F` - Used for column and background
- **Pink/Magenta**: `#EA088B` - Used for spikes (danger elements)
- **Dark Platform**: `#1a1f26` - Darker variant for platforms

### Files Updated:
1. `src/gameOptions.ts` - All game object colors
2. `src/style.css` - Background, title, and UI colors with glow effects

## Character Integration Options

### Option 1: Replace Ball with 3D Model (Recommended)

To replace the simple sphere ball with a Scape Mooderling character:

#### Step 1: Obtain 3D Models
You'll need Mooderling 3D models in one of these formats:
- **GLTF/GLB** (recommended) - Best for web, supports animations
- **FBX** - Common format, needs conversion
- **OBJ** - Simple format, no animations

#### Step 2: Install GLTFLoader
```bash
npm install three
```

The GLTFLoader is included with Three.js.

#### Step 3: Update Ball Class

Modify `src/ball.ts` to load a 3D model instead of a sphere:

```typescript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GameOptions } from './gameOptions';

export class Ball extends THREE.Group {
    velocity: number;
    private mixer?: THREE.AnimationMixer;

    constructor() {
        super();
        
        this.velocity = 0;
        this.castShadow = true;
        this.position.set(0, 2, GameOptions.platformRadius - GameOptions.ballRadius);
        
        // Load Mooderling model
        const loader = new GLTFLoader();
        loader.load(
            '/models/mooderling.glb', // Place your model in public/models/
            (gltf) => {
                const model = gltf.scene;
                
                // Scale the model to fit the ball size
                const scale = GameOptions.ballRadius * 2;
                model.scale.set(scale, scale, scale);
                
                // Enable shadows
                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.castShadow = true;
                    }
                });
                
                this.add(model);
                
                // Setup animations if available
                if (gltf.animations && gltf.animations.length > 0) {
                    this.mixer = new THREE.AnimationMixer(model);
                    const action = this.mixer.clipAction(gltf.animations[0]);
                    action.play();
                }
            },
            undefined,
            (error) => {
                console.error('Error loading Mooderling model:', error);
                // Fallback to sphere
                this.addFallbackSphere();
            }
        );
    }
    
    private addFallbackSphere() {
        const geometry = new THREE.SphereGeometry(GameOptions.ballRadius);
        const material = new THREE.MeshStandardMaterial({
            color: GameOptions.ballColor
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.castShadow = true;
        this.add(sphere);
    }

    update(delta: number): void {
        // Apply gravity
        this.velocity -= GameOptions.gravity * delta;
        this.position.y += this.velocity * delta;
        
        // Update animations
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Rotate character for visual effect
        this.rotation.y += delta * 2;
    }

    bounce(): void {
        this.velocity = GameOptions.bounceImpulse;
    }
}
```

#### Step 4: Add Model Files
1. Create a `public/models/` directory
2. Place your Mooderling GLB/GLTF files there
3. Update the path in the loader to match your filename

### Option 2: Use Sprite/Image (Simpler Alternative)

If you don't have 3D models, you can use 2D sprites:

```typescript
import * as THREE from 'three';
import { GameOptions } from './gameOptions';

export class Ball extends THREE.Sprite {
    velocity: number;

    constructor() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('/images/mooderling.png');
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        super(material);
        
        this.scale.set(
            GameOptions.ballRadius * 2, 
            GameOptions.ballRadius * 2, 
            1
        );
        this.position.set(0, 2, GameOptions.platformRadius - GameOptions.ballRadius);
        this.velocity = 0;
    }
    
    // ... rest of the methods remain the same
}
```

## Next Steps

1. **Obtain Mooderling Assets**: Contact The Scape team for official character models
2. **Test Integration**: Start with Option 2 (sprites) for quick testing
3. **Implement 3D Models**: Use Option 1 for full 3D character integration
4. **Add Variety**: Load different Mooderling types randomly
5. **Animations**: Add idle, bounce, and defeat animations

## Resources Needed

- [ ] Mooderling 3D models (.glb or .gltf format)
- [ ] Mooderling sprite images (.png with transparency)
- [ ] Animation files (if separate from models)
- [ ] The Scape brand guidelines/assets

## Testing

Run the development server to see the changes:
```bash
npm run dev
```

The game will now feature The Scape's brand colors and be ready for character integration!

