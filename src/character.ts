import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GameOptions } from './gameOptions';

/**
 * Character class - Replaces the ball with a Scape character (Mooderling)
 * Supports 3D models, 2D sprites, or procedural geometry
 */
export class Character extends THREE.Group {

    velocity: number;
    characterMesh: THREE.Mesh | THREE.Sprite | null = null;
    mixer: THREE.AnimationMixer | null = null;
    animationActions: { [key: string]: THREE.AnimationAction } = {};
    material: THREE.MeshStandardMaterial | null = null;  // Add material property for compatibility
    
    constructor() {
        super();
        
        // Set initial position
        this.position.set(0, 2, GameOptions.platformRadius - GameOptions.ballRadius);
        
        // Set velocity at zero
        this.velocity = 0;
        
        // Enable shadows
        this.castShadow = true;
        this.receiveShadow = false;
        
        console.log('🎮 Character initialized at position:', this.position);
    }
    
    /**
     * Load a 3D GLTF/GLB model
     */
    async loadGLTFModel(modelPath: string): Promise<void> {
        console.log('📦 Loading 3D model from:', modelPath);
        
        const loader = new GLTFLoader();
        
        return new Promise((resolve, reject) => {
            loader.load(
                modelPath,
                (gltf) => {
                    console.log('✅ 3D model loaded successfully');
                    
                    // Add the model to this group
                    this.add(gltf.scene);
                    
                    // Scale the model to fit the ball size
                    const box = new THREE.Box3().setFromObject(gltf.scene);
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = (GameOptions.ballRadius * 2) / maxDim;
                    gltf.scene.scale.setScalar(scale);
                    
                    // Center the model
                    box.setFromObject(gltf.scene);
                    const center = box.getCenter(new THREE.Vector3());
                    gltf.scene.position.sub(center);
                    
                    // Enable shadows on all meshes
                    gltf.scene.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            this.characterMesh = child;
                        }
                    });
                    
                    // Setup animations if available
                    if (gltf.animations && gltf.animations.length > 0) {
                        this.mixer = new THREE.AnimationMixer(gltf.scene);

                        gltf.animations.forEach((clip) => {
                            const action = this.mixer!.clipAction(clip);
                            this.animationActions[clip.name] = action;
                            console.log('🎬 Animation loaded:', clip.name);
                        });

                        // Play idle animation by default if it exists
                        if (this.animationActions['idle'] || this.animationActions['Idle']) {
                            const idleAnim = this.animationActions['idle'] || this.animationActions['Idle'];
                            idleAnim.play();
                        }
                    }
                    
                    console.log('✅ Character model setup complete');
                    resolve();
                },
                (progress) => {
                    const percent = (progress.loaded / progress.total) * 100;
                    console.log(`📥 Loading: ${percent.toFixed(0)}%`);
                },
                (error) => {
                    console.error('❌ Error loading model:', error);
                    reject(error);
                }
            );
        });
    }
    
    /**
     * Load a 2D sprite image
     */
    loadSprite(imagePath: string): void {
        console.log('🖼️  Loading sprite from:', imagePath);
        
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            imagePath,
            (texture) => {
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                
                // Scale sprite to match ball size
                const scale = GameOptions.ballRadius * 2;
                sprite.scale.set(scale, scale, 1);
                
                this.add(sprite);
                this.characterMesh = sprite as any;
                
                console.log('✅ Sprite loaded successfully');
            },
            undefined,
            (error) => {
                console.error('❌ Error loading sprite:', error);
                this.createFallbackCharacter();
            }
        );
    }
    
    /**
     * Create a simple procedural character (fallback or default)
     */
    createProceduralCharacter(): void {
        console.log('🕷️ Creating Spider-Man character');

        // Create Spider-Man using basic shapes
        const group = new THREE.Group();

        // HEAD - Red sphere with black web pattern
        const headGeometry = new THREE.SphereGeometry(GameOptions.ballRadius * 0.5, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xCC0000,  // Spider-Man red
            roughness: 0.6,
            metalness: 0.2
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, GameOptions.ballRadius * 0.4, 0);
        head.castShadow = true;
        group.add(head);

        // BODY - Red and blue torso
        const bodyGeometry = new THREE.SphereGeometry(GameOptions.ballRadius * 0.6, 32, 32);
        bodyGeometry.scale(1, 1.2, 0.8);  // Make it more torso-shaped

        // Create gradient material (red top, blue bottom)
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xCC0000,  // Spider-Man red
            roughness: 0.6,
            metalness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, -GameOptions.ballRadius * 0.2, 0);
        body.castShadow = true;
        group.add(body);

        // Blue section on lower body
        const lowerBodyGeometry = new THREE.SphereGeometry(GameOptions.ballRadius * 0.6, 32, 16);
        lowerBodyGeometry.scale(1, 0.6, 0.8);
        const lowerBodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x0033CC,  // Spider-Man blue
            roughness: 0.6,
            metalness: 0.2
        });
        const lowerBody = new THREE.Mesh(lowerBodyGeometry, lowerBodyMaterial);
        lowerBody.position.set(0, -GameOptions.ballRadius * 0.6, 0);
        lowerBody.castShadow = true;
        group.add(lowerBody);

        // EYES - Large white triangular/oval eyes
        const eyeGeometry = new THREE.SphereGeometry(GameOptions.ballRadius * 0.18, 16, 16);
        eyeGeometry.scale(1.5, 1, 0.5);  // Make them more oval/triangular
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            emissive: 0xFFFFFF,
            emissiveIntensity: 0.3
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, GameOptions.ballRadius * 0.45, GameOptions.ballRadius * 0.4);
        leftEye.rotation.z = -0.3;  // Angle them
        leftEye.castShadow = true;
        group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, GameOptions.ballRadius * 0.45, GameOptions.ballRadius * 0.4);
        rightEye.rotation.z = 0.3;  // Angle them
        rightEye.castShadow = true;
        group.add(rightEye);

        // ARMS - Simple cylinders
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, GameOptions.ballRadius * 0.8, 8);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0xCC0000,
            roughness: 0.6,
            metalness: 0.2
        });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-GameOptions.ballRadius * 0.6, -GameOptions.ballRadius * 0.1, 0);
        leftArm.rotation.z = 0.5;
        leftArm.castShadow = true;
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(GameOptions.ballRadius * 0.6, -GameOptions.ballRadius * 0.1, 0);
        rightArm.rotation.z = -0.5;
        rightArm.castShadow = true;
        group.add(rightArm);

        // LEGS - Simple cylinders
        const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, GameOptions.ballRadius * 0.9, 8);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x0033CC,  // Blue legs
            roughness: 0.6,
            metalness: 0.2
        });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.15, -GameOptions.ballRadius * 0.9, 0);
        leftLeg.rotation.z = 0.1;
        leftLeg.castShadow = true;
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.15, -GameOptions.ballRadius * 0.9, 0);
        rightLeg.rotation.z = -0.1;
        rightLeg.castShadow = true;
        group.add(rightLeg);

        // SPIDER LOGO - Black spider on chest
        const spiderBodyGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        spiderBodyGeometry.scale(1, 1.3, 0.3);
        const spiderMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.8
        });
        const spiderLogo = new THREE.Mesh(spiderBodyGeometry, spiderMaterial);
        spiderLogo.position.set(0, -GameOptions.ballRadius * 0.1, GameOptions.ballRadius * 0.5);
        group.add(spiderLogo);

        // Spider legs on logo (simplified)
        const spiderLegGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 4);
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2) - Math.PI / 4;
            const legLeft = new THREE.Mesh(spiderLegGeometry, spiderMaterial);
            legLeft.position.set(
                Math.cos(angle) * 0.15,
                -GameOptions.ballRadius * 0.1,
                GameOptions.ballRadius * 0.5
            );
            legLeft.rotation.z = angle;
            group.add(legLeft);
        }

        this.add(group);
        this.characterMesh = body;
        this.material = bodyMaterial;  // Set material for compatibility

        console.log('✅ Spider-Man character created! 🕷️');
    }

    /**
     * Fallback character if loading fails
     */
    createFallbackCharacter(): void {
        console.log('⚠️  Creating fallback character (simple sphere)');

        const geometry = new THREE.SphereGeometry(GameOptions.ballRadius);
        const material = new THREE.MeshStandardMaterial({
            color: GameOptions.ballColor
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;

        this.add(mesh);
        this.characterMesh = mesh;
        this.material = material;  // Set material for compatibility
    }

    /**
     * Update character (physics and animations)
     */
    update(delta: number): void {
        // Apply gravity
        this.velocity -= GameOptions.gravity * delta;

        // Update y position
        this.position.y += this.velocity * delta;

        // Update animations if mixer exists
        if (this.mixer) {
            this.mixer.update(delta);
        }

        // Add subtle rotation while falling for visual effect
        if (this.velocity < 0) {
            this.rotation.x += delta * 2;
        }
    }

    /**
     * Make character bounce
     */
    bounce(): void {
        this.velocity = GameOptions.bounceImpulse;

        // Play bounce animation if available
        if (this.animationActions['bounce'] || this.animationActions['Bounce']) {
            const bounceAnim = this.animationActions['bounce'] || this.animationActions['Bounce'];
            bounceAnim.reset().play();
        }

        console.log('🎾 Character bounced!');
    }

    /**
     * Play a specific animation
     */
    playAnimation(name: string): void {
        if (this.animationActions[name]) {
            // Stop all other animations
            Object.values(this.animationActions).forEach(action => action.stop());

            // Play the requested animation
            this.animationActions[name].reset().play();
            console.log('🎬 Playing animation:', name);
        }
    }
}

