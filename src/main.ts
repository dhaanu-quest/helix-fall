import * as THREE from 'three';                 // import all THREE.js components
import { gsap } from 'gsap';                    // import the GSAP library used for tween-based animations
import { Howl } from 'howler';                  // import howler.js library to manage sounds
import { GameOptions } from './gameOptions';    // import game options
import { Platform } from './platform';          // import Platform class
import { Ball } from './ball';                  // import Ball class
import { Character } from './character';        // import Character class
import { ScoreManager } from './scoreManager';  // import ScoreManager class
import './style.css';                           // import web page style sheet

// Initialize ScoreManager - can be configured via window object
declare global {
    interface Window {
        gameConfig?: {
            userId?: string;
            apiEndpoint?: string;
            onGameEnd?: (result: any) => void;
            // Character configuration
            useCharacter?: boolean;
            characterType?: 'gltf' | 'sprite' | 'procedural';
            characterModel?: string;  // Path to GLTF/GLB or sprite image
        };
    }
}

const scoreManager = new ScoreManager({
    gameId: 'helix-fall',
    userId: window.gameConfig?.userId,
    apiEndpoint: window.gameConfig?.apiEndpoint,
    onGameEnd: window.gameConfig?.onGameEnd,
    enableLocalStorage: true,
    enablePostMessage: true
});

console.log('🎮 Helix Fall - Score Manager Initialized');
console.log('⚙️  Configuration:', {
    gameId: 'helix-fall',
    userId: window.gameConfig?.userId || 'Not set',
    apiEndpoint: window.gameConfig?.apiEndpoint || 'Not set',
    hasCallback: !!window.gameConfig?.onGameEnd,
    localStorage: 'Enabled',
    postMessage: 'Enabled'
});
console.log('📝 Scores will be logged to console when game ends');

// load sounds used in the game
const popSound : Howl = new Howl({
    src : ['/assets/sounds/pop.mp3', '/assets/sounds/pop.ogg']    
});
const spikeSound : Howl = new Howl({
    src : ['/assets/sounds/spike.mp3', '/assets/sounds/spike.ogg']    
});
const breakSound : Howl = new Howl({
    src : ['/assets/sounds/break.mp3', '/assets/sounds/break.ogg']    
})

// create the 3D scene container
const scene : THREE.Scene = new THREE.Scene();

// set up a perspective camera, then manually position and orient it
const ratio : number = window.innerWidth / window.innerHeight;
const camera : THREE.PerspectiveCamera = new THREE.PerspectiveCamera(50, ratio, 0.1, 1000);
camera.position.set(0, 4, ratio > 0.5 ? 12 : 16);
camera.lookAt(0, -2, 0);

// create the WebGL renderer with antialiasing and transparency enabed
const renderer : THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias   : true,
    alpha       : true,
});

// set the renderer size to match the window
renderer.setSize(window.innerWidth, window.innerHeight);

// enable shadow rendering
renderer.shadowMap.enabled = true;

// use soft shadows for smoother lighting
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// add the renderer canvas to the DOM
document.body.appendChild(renderer.domElement);

// create an ambient light to softly illuminate the scene
const ambientLight : THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 0.7);

// add the ambient light to the scene
scene.add(ambientLight);

// create a directional light to simulate sunlight
const light : THREE.PointLight = new THREE.PointLight(0xffffff, 40);

// manually position the light source
light.position.set(5, 10, 7.5);

// enable shadow casting from this light
light.castShadow = true;

// add the directional light to the scene
scene.add(light);

// create the geometry for the central column
const columnGeometry : THREE.CylinderGeometry = new THREE.CylinderGeometry(GameOptions.columnRadius, GameOptions.columnRadius, 50);

// create a standard material for the column
const columnMaterial : THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color : GameOptions.columnColor
});

// create the column mesh using geometry and material
const column : THREE.Mesh = new THREE.Mesh(columnGeometry, columnMaterial);

// enable shadow reception on the column
column.receiveShadow = true;

// add the column to the scene
scene.add(column);

// create a group to hold all platforms
const platformGroup : THREE.Group = new THREE.Group();

// add the platform group to the scene
scene.add(platformGroup);

// create and add to the scene a group to be used as graveyard
const platformGraveyard: THREE.Group = new THREE.Group();
scene.add(platformGraveyard);

// build the platforms
for (let i : number = 0; i < GameOptions.totalPlaftforms; i ++) {

    // create a new platform
    const platform : Platform = new Platform(GameOptions.platformGap * -i, i > 0);
    
    // add platform to platformGroup
    platformGroup.add(platform);
}

// create and add the ball or character
let ball : Ball | Character;

// Check URL parameters for character configuration
const urlParams = new URLSearchParams(window.location.search);
const useCharacterFromURL = urlParams.get('useCharacter') === 'true';
const characterTypeFromURL = urlParams.get('characterType') as 'gltf' | 'sprite' | 'procedural' | null;
const characterModelFromURL = urlParams.get('characterModel');

// Check if user wants to use a character instead of ball (URL params override window.gameConfig)
const useCharacter = useCharacterFromURL || window.gameConfig?.useCharacter || false;
const characterType = characterTypeFromURL || window.gameConfig?.characterType || 'procedural';
const characterModel = characterModelFromURL || window.gameConfig?.characterModel;

if (useCharacter) {
    console.log('🎮 Using Character mode:', characterType);
    const character = new Character();

    // Load character based on type
    if (characterType === 'gltf' && characterModel) {
        console.log('📦 Loading GLTF model:', characterModel);
        character.loadGLTFModel(characterModel).catch(() => {
            console.log('⚠️  Failed to load model, using procedural character');
            character.createProceduralCharacter();
        });
    } else if (characterType === 'sprite' && characterModel) {
        console.log('🖼️  Loading sprite:', characterModel);
        character.loadSprite(characterModel);
    } else {
        console.log('🎨 Creating procedural character');
        character.createProceduralCharacter();
    }

    ball = character;
} else {
    console.log('⚪ Using default ball');
    ball = new Ball();
}

scene.add(ball);
  
// store the key press timestamps or false when released
const keys : { [key : string] : number | false } = {};

// three clock to measure time between frames
const clock : THREE.Clock = new THREE.Clock();

// boolean variable to check if the game is over
let gameOver : boolean = false;

// boolean variable to check if the game has started
let gameStarted : boolean = false;

// boolean variable to check if the player is dragging
let isDragging : boolean = false;

// variable to store previous X position, useful to manage dragging
let previousX : number = 0;

// boolean variable to check if the player just broke a platform
let justBroke : boolean = false;

// HTML element with the score. The id must macth the id in index.html file
const scoreElement : HTMLElement = document.getElementById('score') as HTMLElement;

// HTML element with the timer. The id must macth the id in index.html file
const timerElement : HTMLElement = document.getElementById('timer') as HTMLElement;

// HTML element with the header. The id must macth the id in index.html file
const gameHeader : HTMLElement = document.getElementById('gameheader') as HTMLElement;

// HTML element with the moving hand. The id must macth the id in index.html file
const handElement : HTMLElement = document.getElementById('hand') as HTMLElement;

// variable to see how many time left we have
let timeLeft : number = GameOptions.timeLeft;

// variable to save the score
let score : number = 0;

// number to store the ID of the timer interval
let timerInterval : number;

// call update function and start the game
update();

///////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////

// function to be executed at each frame
function update() : void {

    // ask the browser to call this function again on the next animation frame
    requestAnimationFrame(update);

    // if the game is over, just render the scene and exit the function
    if (gameOver) { 
        renderer.render(scene, camera);
        return;
    }

    // get the time elapsed since the last frame
    const delta : number = clock.getDelta();

    // get the topmost platform
    const topmostPlatform : Platform = platformGroup.children[0] as Platform;

    // get current camera y position
    const currentCameraY = camera.position.y;

    // y target is always a bit above top platform
    const targetY = topmostPlatform.position.y + 4;

    // lerp camera position and direction. Some hardcoded values here, will optimize a bit later
    camera.position.y = THREE.MathUtils.lerp(currentCameraY, targetY, 0.03);
    camera.lookAt(0, THREE.MathUtils.lerp(currentCameraY - 6, topmostPlatform.position.y - 2, 0.03), 0);
    
    // make light follow the camera
    light.position.y = camera.position.y + 6;
    
    // determine rotation direction according to pressed keys  
    let rotateDirection : number = 0;

    // do we need to rotate counter clockwise?
    if (keys['a'] && !keys['d']) {
        rotateDirection = 1;
    }
    else  {

        // do we need to rotate clockwise?
        if (keys['d'] && !keys['a']) {
            rotateDirection = -1;
        }
        else {

            // are we trying to rotate in both directions? Let's see which one was the latest
            if (keys['d'] && keys['a']) {
                rotateDirection = (keys['a'] > keys['d']) ? 1 : -1;
            }
        }
    }  
    
    // if player is rotating and the game hasn't already started, then start the game
    if (rotateDirection != 0 && !gameStarted) {
        startGame();  
    }

    // apply rotation to the platform group
    platformGroup.rotation.y += rotateDirection * GameOptions.rotationSpeed * delta;

    // apply rotation to the graveyard group
    platformGraveyard.rotation.y += rotateDirection * GameOptions.rotationSpeed * delta;

    // update ball position
    ball.update(delta);

    // loop through all spikes
    for (const spike of topmostPlatform.spikes) {

        // get spike tip position
        const spikeTip = new THREE.Vector3(0, GameOptions.spikeHeight / 2, 0); 

        // get spike tip local world coordinate
        spike.localToWorld(spikeTip);

        // determine the distance from spike tip to ball center
        const distanceToTip = spikeTip.distanceTo(ball.position);
            
        // is the spike lower than ball radius? So we have a collision
        // I reduced by 10% ball radius to make the game easier
        if (distanceToTip < GameOptions.ballRadius * 0.9 || timeLeft <= 0) {

            // play proper sound
            playSound(spikeSound);

            // now it's game over
            gameOver = true;

            // clear the interval
            clearInterval(timerInterval);

            // Submit score to all configured destinations
            console.log('🎮 Game Over! Submitting score...');
            scoreManager.submitScore(score, timeLeft);
           
            // tween camera position using GSAP
            gsap.to(camera.position, {
                z           : ball.position.z + 4,                                          // z position
                x           : spikeTip.x > 0 ? ball.position.x + 4 : ball.position.x - 4,   // x position
                y           : ball.position.y,                                              // y position
                duration    : 2,                                                            // duration, in seconds
                ease        : 'power2.out',                                                 // easing
                onUpdate : () => {                                                          // function to be executed at each update
                    camera.lookAt(ball.position.x, ball.position.y, ball.position.z);       // update camera to look at the ball
                }
            });

            // tween ball material color using GSAP
            gsap.to((ball.material as THREE.MeshStandardMaterial).color, {
                r: 1,           // red
                g: 0,           // green
                b: 0,           // blue
                duration: 2     // duration, in seconds
            });

            // executed ths function after a certain delay
            setTimeout(() => {

                // reset score and time
                score = 0;
                scoreElement.textContent = '';
                timerElement.textContent = '';

                // reset gameOver flag
                gameOver = false;

                // reset gameStarted flag
                gameStarted = false;

                // reset ball position and velocity
                ball.position.set(0, 2, GameOptions.platformRadius - 0.4);
                ball.velocity = 0;

                // reset camera
                const ratio : number = window.innerWidth / window.innerHeight;
                camera.position.set(0, 4, ratio > 0.5 ? 12 : 16);
                camera.lookAt(0, -2, 0);

                // reset column
                column.position.y = 0;

                // clear and recreate platforms
                platformGroup.clear();
                for (let i : number = 0; i < GameOptions.totalPlaftforms; i ++) {
                    const newPlatform = new Platform(GameOptions.platformGap * -i, i > 0);
                    platformGroup.add(newPlatform);
                }

                // reset platform group rotation
                platformGroup.rotation.y = 0;

                // reset ball color
                const mat = ball.material as THREE.MeshStandardMaterial;
                mat.color.set(GameOptions.ballColor);

                // show game header
                gameHeader.classList.remove('hidden');
                handElement.classList.remove('hidden');
            
            }, 3000); // wait 3 seconds

            // render the scene and exit the function
            renderer.render(scene, camera);
            return;
        }
    }

    // if the velocity is less than zero (the ball is falling)
    if (ball.velocity < 0) {

        // get the y coordinate of the first platform floor, according to ball rdius, platform y position and height
        const impactPoint : number = topmostPlatform.position.y + GameOptions.platformHeight / 2 + + GameOptions.ballRadius;
        
        // is ball y positon less than impact point (the ball is touching platform floor)
        if (ball.position.y < impactPoint) {

            // get platform start and end angle. Final + Math.PI * 2 and % (Math.PI * 2) are used to avoid negative values
            const startAngle = ((topmostPlatform.rotation.y + platformGroup.rotation.y) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); 
            const endAngle = ((startAngle + topmostPlatform.thetaLength) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
            
            // if start angle is less than end angle, it means the interval includes zero, ball's position. Which should now fall
            if (startAngle < endAngle) {
                
                // remove the platform from the group
                platformGroup.remove(topmostPlatform);

                // add the platform to platform graveyard
                platformGraveyard.add(topmostPlatform);

                // fade and remove the topmost platform
                topmostPlatform.fadeAndRemove(platformGraveyard);

                // move the column down to pretend it's endless
                column.position.y -= GameOptions.platformGap;

                // create a new platform below the last one ad add it to platform group
                const lastPlatform : Platform = platformGroup.children[platformGroup.children.length - 1] as Platform;
                const newY : number = lastPlatform.position.y - GameOptions.platformGap;
                const newPlatform : Platform = new Platform(newY, true);
                platformGroup.add(newPlatform); 
                
                // if the score is zero...
                if (score == 0) {

                    // execute this function every second
                    timerInterval = setInterval(() => {

                        // decrease time left
                        timeLeft --;

                        // update timerElement content
                        timerElement.textContent = timeLeft.toString();
                    }, 1000);  
                }

                // if player just broke a platform and score is greater than zero...
                if (justBroke && score > 0) {
                    
                    // bonus time
                    timeLeft ++;

                    // update timerElement content
                    timerElement.textContent = timeLeft.toString();
                }

                // player just broke a platform
                justBroke = true;

                // increase the score
                score ++;
                console.log('🎯 Platform broken! Current score:', score);

                // update scoreElement content
                scoreElement.textContent = score.toString();

                // play proper sound
                playSound(breakSound);
            }

            // if not, make the ball bounce
            else {

                // player didn't break the platform
                justBroke = false;

                // place the ball on the impact point, not to intersecate the platform
                ball.position.y = impactPoint;

                // method to make ball bounce
                ball.bounce();   
                
                // if the score is greater than zero...
                if (score > 0) {

                    // play proper sound
                    playSound(popSound);
                }
            }
        } 
    }

    // render the scene using the camera
    renderer.render(scene, camera);
   
}

// function to play a sound
// sound : the sound to be plated
function playSound(sound : Howl) : void {

    // get sound ID
    const soundID : number = sound.play();    

    // change a bit the rate to make same sounds sound different
    sound.rate(0.95 + Math.random() * 0.1, soundID);
}

// function to be called when the game starts
function startGame() : void {

    // game started
    gameStarted = true;

    // set timeLeft
    timeLeft = GameOptions.timeLeft;

    // hide title elements
    gameHeader.classList.add('hidden');
    handElement.classList.add('hidden');

    // show time and score
    timerElement.textContent = timeLeft.toString();
    scoreElement.textContent = '0';

}

///////////////////////////////////////////////////////////////////////
// LISTENERS
///////////////////////////////////////////////////////////////////////

// handle keydown events and store press time
window.addEventListener('keydown', (e : KeyboardEvent) => {
    const key : string = e.key.toLowerCase();
    if (!keys[key]) {
        keys[key] = Date.now();
    }
});

// handle keyup events and reset key state
window.addEventListener('keyup', (e : KeyboardEvent) => {
    const key : string = e.key.toLowerCase();
    keys[key] = false;
});

// handle mousedown events
window.addEventListener('mousedown', (event: MouseEvent) => {

    // player is dragging
    isDragging = true;

    // set previousX to current X coordinate
    previousX = event.clientX;
});

// handle mousemove event
window.addEventListener('mousemove', (event: MouseEvent) => {

    // if the player is not dragging or it's game over, exit the function
    if (!isDragging || gameOver) {
        return;
    }

    // if the game has not started already, start it
    if (!gameStarted) {
        startGame();
    }

    // get X movement
    const deltaX : number = event.clientX - previousX;

    // update previousX
    previousX = event.clientX;

    // set platform rotation according to deltaX and mouse sensitivity
    platformGroup.rotation.y += deltaX * GameOptions.mouseSensitivity;
});

// handle mouseup event
window.addEventListener('mouseup', () => {

    // not dragging anymore
    isDragging = false;
});

// handle touchstart event
window.addEventListener('touchstart', (event: TouchEvent) => {

    //  player is dragging
    isDragging = true;

    // set previousX to current X coordinate
    previousX = event.touches[0].clientX;
});

// handle touchmove event
window.addEventListener('touchmove', (event: TouchEvent) => {

    // if the player is not dragging or it's game over, exit the function
    if (!isDragging || gameOver) {
        return;
    }

    // if the game has not started already, start it
    if (!gameStarted) {
        startGame();
    }

    // get X movement
    const deltaX : number = event.touches[0].clientX - previousX;

    // update previousX
    previousX = event.touches[0].clientX;

    // set platform rotation according to deltaX and touch sensitivity
    platformGroup.rotation.y += deltaX * GameOptions.touchSensitivity;
});

// handle touchend event
window.addEventListener('touchend', () => {

    // not dragging anymore
    isDragging = false;
});

// handle load event
window.addEventListener('load', () => {

    // set body as visible
    document.body.style.visibility = 'visible';
});

// handle resize listener
window.addEventListener('resize', () : void => {

    // get window ratio
    const ratio : number = window.innerWidth / window.innerHeight;
    
    // set camera position according to window ratio to have the tower always completely visible
    camera.position.z = ratio > 0.5 ? 12 : 16;

    // update camera aspect and set new renderer size
    camera.aspect = ratio;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});