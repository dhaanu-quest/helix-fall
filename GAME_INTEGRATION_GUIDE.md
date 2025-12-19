# Game Integration Guide - Helix Fall

This guide explains how to integrate the Helix Fall game into your app and capture user scores.

## Overview

The game now includes a **ScoreManager** that automatically sends scores through multiple channels when a game ends:

1. **PostMessage API** - For iframe embedding
2. **Callback Function** - For direct JavaScript integration
3. **LocalStorage** - For persistent score tracking
4. **REST API** - For server-side score submission

---

## Integration Methods

### Method 1: Iframe Embedding (Recommended for Apps)

This is the easiest way to embed the game in your app.

#### Step 1: Embed the Game

```html
<iframe 
    id="helix-game"
    src="https://your-domain.com/helix-fall/" 
    width="100%" 
    height="600px"
    frameborder="0"
    allow="accelerometer; gyroscope"
></iframe>
```

#### Step 2: Listen for Score Messages

```javascript
// In your parent app
window.addEventListener('message', (event) => {
    // Verify origin in production
    // if (event.origin !== 'https://your-domain.com') return;
    
    if (event.data.type === 'GAME_SCORE') {
        const result = event.data.data;
        
        console.log('User ID:', result.userId);
        console.log('Score:', result.score);
        console.log('Time Left:', result.timeLeft);
        console.log('Timestamp:', result.timestamp);
        console.log('Game ID:', result.gameId);
        
        // Send to your backend
        saveScoreToBackend(result);
    }
});

function saveScoreToBackend(result) {
    fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
    });
}
```

#### Step 3: Configure User ID (Optional)

Pass user information to the game before it loads:

```html
<script>
    // Set this BEFORE the game loads
    window.gameConfig = {
        userId: 'user123',  // Your user's ID
    };
</script>
<script src="helix-fall/main.js"></script>
```

---

### Method 2: Direct JavaScript Integration

If you're bundling the game directly into your app:

```javascript
// Configure before importing the game
window.gameConfig = {
    userId: 'user123',
    apiEndpoint: 'https://your-api.com/scores',
    onGameEnd: (result) => {
        console.log('Game ended!', result);
        // Handle score in your app
        updateUserScore(result.score);
        showLeaderboard();
    }
};

// Then import/load the game
import './helix-fall/main.js';
```

---

### Method 3: REST API Integration

Configure the game to automatically POST scores to your API:

```javascript
window.gameConfig = {
    userId: 'user123',
    apiEndpoint: 'https://your-api.com/api/game-scores'
};
```

The game will automatically POST this JSON when the game ends:

```json
{
    "score": 42,
    "timeLeft": 5,
    "timestamp": 1703001234567,
    "gameId": "helix-fall",
    "userId": "user123"
}
```

#### Example Backend (Node.js/Express)

```javascript
app.post('/api/game-scores', async (req, res) => {
    const { userId, score, timeLeft, timestamp, gameId } = req.body;
    
    // Validate and save to database
    await db.scores.create({
        userId,
        gameId,
        score,
        timeLeft,
        timestamp: new Date(timestamp)
    });
    
    res.json({ success: true });
});
```

---

### Method 4: LocalStorage (For Testing)

Scores are automatically saved to localStorage. You can retrieve them:

```javascript
// Get latest score
const latest = localStorage.getItem('helix-fall_latest_score');
const latestScore = JSON.parse(latest);

// Get score history (last 50 games)
const history = localStorage.getItem('helix-fall_score_history');
const allScores = JSON.parse(history);

console.log('Latest score:', latestScore.score);
console.log('All scores:', allScores);
```

---

## Score Data Structure

Every game result includes:

```typescript
{
    score: number;        // Number of platforms broken
    timeLeft: number;     // Seconds remaining when game ended
    timestamp: number;    // Unix timestamp (milliseconds)
    gameId: string;       // Always "helix-fall"
    userId?: string;      // User ID if configured
}
```

---

## Multiple Games Integration

For your 5-game app, you can use the same pattern for each game:

```javascript
// Game 1: Helix Fall
window.addEventListener('message', (event) => {
    if (event.data.type === 'GAME_SCORE') {
        const { gameId, score, userId } = event.data.data;
        
        switch(gameId) {
            case 'helix-fall':
                handleHelixScore(score, userId);
                break;
            case 'game-2':
                handleGame2Score(score, userId);
                break;
            // ... etc
        }
    }
});
```

---

## Testing the Integration

### Test 1: Console Logging
Open browser console and play the game. You'll see:
```
Game ended with result: {score: 10, timeLeft: 15, ...}
Score sent via postMessage to parent window
Score saved to localStorage
```

### Test 2: Check LocalStorage
```javascript
// In browser console
console.log(localStorage.getItem('helix-fall_latest_score'));
```

### Test 3: Listen for PostMessage
```javascript
window.addEventListener('message', (e) => console.log('Received:', e.data));
```

---

## Production Checklist

- [ ] Set specific origin in postMessage (not '*')
- [ ] Implement server-side score validation
- [ ] Add authentication to API endpoint
- [ ] Implement rate limiting
- [ ] Add anti-cheat measures (server-side validation)
- [ ] Test on mobile devices
- [ ] Configure CORS for API endpoint

---

## Next Steps

1. Choose your integration method
2. Set up score receiving endpoint
3. Test with the game
4. Implement leaderboard/rewards system
5. Repeat for your other 4 games!

