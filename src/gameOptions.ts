export const GameOptions = {
    columnRadius        : 1,                // column radius
    columnColor         : 0x090C0F,         // column color - The Scape dark background
    totalPlaftforms     : 10,               // total platorms in game
    platformGap         : 3,                // vertical gap between two platorms
    platformRadius      : 3,                // platform radius
    platformHeight      : 1,                // platform heignt
    minThetaLength      : Math.PI * 1.5,    // min theta length, minimum radians of the circular sector
    maxThetaLength      : Math.PI * 1.85,   // max theta length, maximum radians of the circular sector
    rotationSpeed       : 6,                // helix rotation speed
    gapColor            : 0x10F48B,         // gap color - The Scape primary green
    ballRadius          : 0.4,              // ball radius
    ballColor           : 0x10F48B,         // ball color - The Scape primary green
    spikeRadius         : 0.2,              // spike radius
    spikeHeight         : 0.6,              // spike height
    spikeColor          : 0xEA088B,         // spike color - The Scape pink/magenta
    gravity             : 10,               // ball gravity
    bounceImpulse       : 6,                // ball bounce impulse
    spikeProbability    : 0.25,             // probabilty of a spike to appear, 0..1
    timeLeft            : 30,               // time left at the start of the game, in seconds
    platformColor       : 0x1a1f26,         // platform color - darker variant of The Scape dark
    mouseSensitivity    : 0.01,             // mouse sensitivity
    touchSensitivity    : 0.01              // touch sensitivity
}