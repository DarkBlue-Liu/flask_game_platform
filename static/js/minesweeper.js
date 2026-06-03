class Minesweeper {
    constructor() {
        this.rows = 9;
        this.cols = 9;
        this.mines = 10;
        this.difficulty = 'easy';
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameStarted = false;
        this.timer = 0;
        this.timerInterval = null;
        this.theme = 'classic';
        
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.bindEvents();
        this.newGame();
        this.loadLeaderboard('easy');
    }
    
    loadTheme() {
        fetch('/api/get_theme')
            .then(res => res.json())
            .then(data => {
                this.theme = data.theme;
                this.renderBoard();
            });
    }
    
    bindEvents() {
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.rows = parseInt(btn.dataset.rows);
                this.cols = parseInt(btn.dataset.cols);
                this.mines = parseInt(btn.dataset.mines);
                
                if (this.mines === 10) this.difficulty = 'easy';
                else if (this.mines === 40) this.difficulty = 'medium';
                else this.difficulty = 'hard';
                
                this.newGame();
            });
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.newGame();
        });
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadLeaderboard(btn.dataset.difficulty);
            });
        });
    }
    
    newGame() {
        this.gameOver = false;
        this.gameStarted = false;
        this.timer = 0;
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
        this.revealed = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
        this.flagged = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
        
        document.getElementById('timer').textContent = '0';
        document.getElementById('mine-count').textContent = this.mines;
        document.getElementById('game-status').textContent = '';
        document.getElementById('game-status').className = 'game-status';
        
        this.renderBoard();
    }
    
    placeMines(firstRow, firstCol) {
        let placed = 0;
        while (placed < this.mines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            
            if (Math.abs(r - firstRow) <= 1 && Math.abs(c - firstCol) <= 1) continue;
            if (this.board[r][c] === -1) continue;
            
            this.board[r][c] = -1;
            placed++;
        }
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c] === -1) continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.board[nr][nc] === -1) {
                            count++;
                        }
                    }
                }
                this.board[r][c] = count;
            }
        }
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            document.getElementById('timer').textContent = this.timer;
        }, 1000);
    }
    
    renderBoard() {
        const boardEl = document.getElementById('game-board');
        boardEl.className = 'game-board ' + this.theme;
        boardEl.style.gridTemplateColumns = `repeat(${this.cols}, 30px)`;
        boardEl.innerHTML = '';
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                
                if (this.revealed[r][c]) {
                    cell.classList.add('revealed');
                    if (this.board[r][c] === -1) {
                        cell.classList.add('mine');
                    } else if (this.board[r][c] > 0) {
                        cell.classList.add(`num-${this.board[r][c]}`);
                        cell.textContent = this.board[r][c];
                    }
                } else if (this.flagged[r][c]) {
                    cell.classList.add('flagged');
                }
                
                cell.addEventListener('click', () => this.handleClick(r, c));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleRightClick(r, c);
                });
                
                boardEl.appendChild(cell);
            }
        }
    }
    
    handleClick(r, c) {
        if (this.gameOver) return;
        if (this.flagged[r][c]) return;
        if (this.revealed[r][c]) return;
        
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.placeMines(r, c);
            this.startTimer();
        }
        
        if (this.board[r][c] === -1) {
            this.endGame(false);
            return;
        }
        
        this.reveal(r, c);
        this.renderBoard();
        this.checkWin();
    }
    
    reveal(r, c) {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return;
        if (this.revealed[r][c]) return;
        if (this.flagged[r][c]) return;
        
        this.revealed[r][c] = true;
        
        if (this.board[r][c] === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    this.reveal(r + dr, c + dc);
                }
            }
        }
    }
    
    handleRightClick(r, c) {
        if (this.gameOver) return;
        if (this.revealed[r][c]) return;
        
        this.flagged[r][c] = !this.flagged[r][c];
        
        const flagCount = this.flagged.flat().filter(f => f).length;
        document.getElementById('mine-count').textContent = this.mines - flagCount;
        
        this.renderBoard();
    }
    
    checkWin() {
        let unrevealedSafe = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (!this.revealed[r][c] && this.board[r][c] !== -1) {
                    unrevealedSafe++;
                }
            }
        }
        
        if (unrevealedSafe === 0) {
            this.endGame(true);
        }
    }
    
    endGame(won) {
        this.gameOver = true;
        clearInterval(this.timerInterval);
        
        const statusEl = document.getElementById('game-status');
        
        if (won) {
            statusEl.textContent = '🎉 恭喜你赢了！';
            statusEl.className = 'game-status win';
            
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (this.board[r][c] === -1) {
                        this.flagged[r][c] = true;
                    }
                }
            }
            
            fetch('/api/save_record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    difficulty: this.difficulty,
                    time_used: this.timer
                })
            }).then(() => {
                this.loadLeaderboard(this.difficulty);
            });
        } else {
            statusEl.textContent = '💥 游戏结束！';
            statusEl.className = 'game-status lose';
            
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (this.board[r][c] === -1) {
                        this.revealed[r][c] = true;
                    }
                }
            }
        }
        
        this.renderBoard();
    }
    
    loadLeaderboard(difficulty) {
        fetch(`/api/leaderboard/${difficulty}`)
            .then(res => res.json())
            .then(data => {
                const container = document.getElementById('leaderboard-content');
                
                if (data.length === 0) {
                    container.innerHTML = '<p style="text-align:center;color:#999;">暂无记录</p>';
                    return;
                }
                
                container.innerHTML = data.map((item, i) => `
                    <div class="leaderboard-item">
                        <span class="rank">#${i + 1}</span>
                        <span class="username">${item.username}</span>
                        <span class="time">${item.time_used}秒</span>
                    </div>
                `).join('');
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
});
