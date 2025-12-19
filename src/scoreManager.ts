/**
 * ScoreManager - Handles score tracking and export for game integration
 * Supports multiple integration methods for embedding in apps
 */

export interface GameResult {
    score: number;
    timeLeft: number;
    timestamp: number;
    gameId: string;
    userId?: string;
}

export interface ScoreManagerConfig {
    gameId?: string;
    userId?: string;
    apiEndpoint?: string;
    onGameEnd?: (result: GameResult) => void;
    enableLocalStorage?: boolean;
    enablePostMessage?: boolean;
}

export class ScoreManager {
    private config: ScoreManagerConfig;
    private gameId: string;

    constructor(config: ScoreManagerConfig = {}) {
        this.config = {
            enableLocalStorage: true,
            enablePostMessage: true,
            ...config
        };
        this.gameId = config.gameId || 'helix-fall';
    }

    /**
     * Called when game ends - sends score to all configured destinations
     */
    async submitScore(score: number, timeLeft: number): Promise<void> {
        const result: GameResult = {
            score,
            timeLeft,
            timestamp: Date.now(),
            gameId: this.gameId,
            userId: this.config.userId
        };

        console.log('🎮 ===== GAME ENDED =====');
        console.log('📊 Final Score:', score);
        console.log('⏱️  Time Left:', timeLeft, 'seconds');
        console.log('👤 User ID:', this.config.userId || 'Not set');
        console.log('🎯 Game ID:', this.gameId);
        console.log('📅 Timestamp:', new Date(result.timestamp).toLocaleString());
        console.log('📦 Full Result Object:', result);
        console.log('========================');

        // Method 1: Call custom callback if provided
        if (this.config.onGameEnd) {
            console.log('✅ Calling custom callback function...');
            this.config.onGameEnd(result);
        }

        // Method 2: Send postMessage to parent window (for iframe embedding)
        if (this.config.enablePostMessage) {
            console.log('📤 Sending postMessage to parent window...');
            this.sendPostMessage(result);
        }

        // Method 3: Save to localStorage
        if (this.config.enableLocalStorage) {
            console.log('💾 Saving to localStorage...');
            this.saveToLocalStorage(result);
        }

        // Method 4: Send to API endpoint if configured
        if (this.config.apiEndpoint) {
            console.log('🌐 Sending to API endpoint:', this.config.apiEndpoint);
            await this.sendToAPI(result);
        }
    }

    /**
     * Send score to parent window via postMessage (for iframe integration)
     */
    private sendPostMessage(result: GameResult): void {
        if (window.parent !== window) {
            const message = {
                type: 'GAME_SCORE',
                data: result
            };
            window.parent.postMessage(message, '*'); // In production, specify exact origin instead of '*'

            console.log('✅ PostMessage sent successfully:', message);
        } else {
            console.log('ℹ️  Not in iframe - postMessage skipped');
        }
    }

    /**
     * Save score to localStorage
     */
    private saveToLocalStorage(result: GameResult): void {
        try {
            // Save latest score
            localStorage.setItem(`${this.gameId}_latest_score`, JSON.stringify(result));
            console.log('✅ Latest score saved to localStorage');

            // Save to history
            const history = this.getScoreHistory();
            history.push(result);

            // Keep only last 50 scores
            if (history.length > 50) {
                history.shift();
            }

            localStorage.setItem(`${this.gameId}_score_history`, JSON.stringify(history));
            console.log(`✅ Score history updated (${history.length} games total)`);

        } catch (error) {
            console.error('❌ Failed to save to localStorage:', error);
        }
    }

    /**
     * Send score to API endpoint
     */
    private async sendToAPI(result: GameResult): Promise<void> {
        try {
            console.log('🌐 Sending POST request to:', this.config.apiEndpoint);
            const response = await fetch(this.config.apiEndpoint!, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(result)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Score sent to API successfully:', data);
            } else {
                console.error('❌ Failed to send score to API:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('❌ Error sending score to API:', error);
        }
    }

    /**
     * Get score history from localStorage
     */
    getScoreHistory(): GameResult[] {
        try {
            const history = localStorage.getItem(`${this.gameId}_score_history`);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Failed to get score history:', error);
            return [];
        }
    }

    /**
     * Get latest score from localStorage
     */
    getLatestScore(): GameResult | null {
        try {
            const latest = localStorage.getItem(`${this.gameId}_latest_score`);
            return latest ? JSON.parse(latest) : null;
        } catch (error) {
            console.error('Failed to get latest score:', error);
            return null;
        }
    }

    /**
     * Get high score from history
     */
    getHighScore(): number {
        const history = this.getScoreHistory();
        return history.length > 0 
            ? Math.max(...history.map(r => r.score))
            : 0;
    }

    /**
     * Clear all stored scores
     */
    clearHistory(): void {
        localStorage.removeItem(`${this.gameId}_latest_score`);
        localStorage.removeItem(`${this.gameId}_score_history`);
        console.log('Score history cleared');
    }
}

