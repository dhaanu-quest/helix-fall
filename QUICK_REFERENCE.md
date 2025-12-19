# 🎮 Quick Reference - Score Integration

## 🚀 Fastest Way to Get Scores

### In Your App (HTML)
```html
<iframe src="https://your-game-url.com" width="100%" height="600px"></iframe>

<script>
window.addEventListener('message', (event) => {
    if (event.data.type === 'GAME_SCORE') {
        const { score, userId } = event.data.data;
        console.log(`Score: ${score}`);
        // Send to your backend here
    }
});
</script>
```

## 📊 Score Data You Receive

```javascript
{
    score: 42,              // Number of platforms broken
    timeLeft: 5,            // Seconds left when game ended
    timestamp: 1703001234,  // Unix timestamp
    gameId: "helix-fall",   // Game identifier
    userId: "user123"       // User ID (if you set it)
}
```

## ⚙️ Configuration (Optional)

Set BEFORE loading the game:

```javascript
window.gameConfig = {
    userId: 'user123',                          // Your user's ID
    apiEndpoint: 'https://api.com/scores',      // Auto-POST scores here
    onGameEnd: (result) => {                    // Callback function
        console.log('Game ended!', result);
    }
};
```

## 🧪 Test Locally

1. **View game**: http://localhost:8081/
2. **View example**: http://localhost:8081/example-integration.html
3. **Check console**: Press F12, play game, see scores logged
4. **Check storage**: `localStorage.getItem('helix-fall_latest_score')`

## 🎨 The Scape Colors Applied

- **Green** `#10F48B` - Ball, gaps, UI text
- **Dark** `#090C0F` - Background, column
- **Pink** `#EA088B` - Spikes (danger)

## 📁 Key Files

- `src/scoreManager.ts` - Score system
- `GAME_INTEGRATION_GUIDE.md` - Full docs
- `example-integration.html` - Working example

## 🔥 For Your 5-Game App

```javascript
// Listen for ALL games
window.addEventListener('message', (event) => {
    if (event.data.type === 'GAME_SCORE') {
        const { gameId, score, userId } = event.data.data;
        
        // Save to backend
        fetch('/api/scores', {
            method: 'POST',
            body: JSON.stringify({ userId, gameId, score })
        });
    }
});
```

## ✅ What Works Now

- ✅ Scores automatically sent via postMessage
- ✅ Scores saved to localStorage
- ✅ Can POST to your API endpoint
- ✅ Can use callback function
- ✅ The Scape brand colors applied
- ✅ Ready for iframe embedding

## 🎯 Next: Your Backend

```javascript
// Example: Node.js/Express
app.post('/api/scores', async (req, res) => {
    const { userId, gameId, score } = req.body;
    
    // Save to database
    await db.scores.create({ userId, gameId, score });
    
    res.json({ success: true });
});
```

---

**That's it!** The game is ready to integrate into your app. 🚀

