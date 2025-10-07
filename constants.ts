import { LogType } from './types';

export const SYSTEM_INSTRUCTIONS: Record<LogType, string> = {
    [LogType.None]: "You are a helpful AI assistant. Responde siempre en español.",
    [LogType.Payara]: `You are an expert AI assistant specialized in analyzing Payara Server logs. 
The logs come from an application called 'openSRI', which is a JavaEE application using JSF and PrimeFaces. 
It connects to a PostgreSQL database for accounting and administrative processes. 
When analyzing errors, consider issues related to JavaEE, JSF lifecycle, PrimeFaces components, database connections, and transaction management. 
Provide clear explanations, potential causes, and actionable solutions. Responde siempre en español.`,
    [LogType.PostgreSQL]: `You are an expert AI assistant specialized in analyzing PostgreSQL 15 logs. 
These logs are from a database that manages inventory and sales processes. 
Focus on identifying issues like slow queries, deadlocks, connection problems, constraint violations (especially unique constraints like 'clientecedula' or 'ok_backorder'), and performance bottlenecks.
Provide clear explanations of the SQL errors, potential causes, and suggestions for optimization or fixes. Responde siempre en español.`,
    [LogType.Sensors]: `You are an expert AI assistant specialized in analyzing logs from a Linux-based sensor process.
This process involves data transfer using threads ('HILO'). 
The logs show thread execution, parameters, and SQL processing updates.
When analyzing these logs, pay attention to thread management, potential race conditions, resource contention, and any signs of failed or stalled data transfers. Explain the process flow and identify potential bottlenecks or errors in the multithreaded environment. Responde siempre en español.`
};

export const DOMINO_GAME_HTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dominó Venezolano - 1 Jugador vs 3 Bots</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #2c5530, #3d7c47); color: white; min-height: 100vh; overflow-x: hidden; }
        .game-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .game-info { display: flex; justify-content: space-between; margin-bottom: 20px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 10px; }
        .player-info { text-align: center; padding: 5px 10px; border-radius: 5px; min-width: 120px; }
        .player-name { font-weight: bold; margin-bottom: 5px; font-size: 1.1em; }
        .player-tiles-count { font-size: 0.9em; opacity: 0.8; }
        .active-player { background: rgba(255,255,255,0.2); border: 2px solid #FFD700; }
        .board-container { background: rgba(0,0,0,0.2); border-radius: 15px; padding: 20px; margin-bottom: 20px; min-height: 300px; display: flex; align-items: center; justify-content: center; overflow-x: auto; position: relative; }
        .board { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; justify-content: center; }
        .domino { width: 60px; height: 120px; background: white; border: 2px solid #333; border-radius: 8px; display: flex; flex-direction: column; cursor: pointer; transition: all 0.3s ease; position: relative; }
        .domino:hover { transform: translateY(-10px); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .domino.horizontal { width: 120px; height: 60px; flex-direction: row; }
        .domino.vertical { width: 60px; height: 120px; flex-direction: column; }
        .domino.disabled { opacity: 0.5; cursor: not-allowed; }
        .domino.disabled:hover { transform: none; box-shadow: none; }
        .domino-half { flex: 1; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd; background: #f9f9f9; position: relative; }
        .domino-half:first-child { border-radius: 6px 6px 0 0; }
        .domino-half:last-child { border-radius: 0 0 6px 6px; }
        .domino.horizontal .domino-half:first-child { border-radius: 6px 0 0 6px; }
        .domino.horizontal .domino-half:last-child { border-radius: 0 6px 6px 0; }
        .dots { width: 100%; height: 100%; display: grid; padding: 3px; gap: 2px; }
        .dot { width: 6px; height: 6px; background: #333; border-radius: 50%; }
        .player-hand { background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; margin-bottom: 10px; }
        .hand-title { text-align: center; margin-bottom: 10px; font-weight: bold; font-size: 1.2em; }
        .tiles-container { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .controls { text-align: center; margin-top: 20px; }
        button { background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 5px; transition: background 0.3s; }
        button:hover { background: #45a049; }
        button:disabled { background: #cccccc; cursor: not-allowed; }
        .message { text-align: center; font-size: 18px; margin: 10px 0; min-height: 25px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 5px; }
        .winner { color: #FFD700; font-weight: bold; font-size: 1.2em; }
        .game-over { background: rgba(255,0,0,0.2); padding: 20px; border-radius: 10px; text-align: center; }
        .bot-hand { background: rgba(0,0,0,0.2); padding: 10px; border-radius: 5px; margin: 5px 0; }
        .bot-tiles { display: flex; gap: 5px; justify-content: center; }
        .bot-tile { width: 30px; height: 60px; background: #8B4513; border: 1px solid #654321; border-radius: 4px; }
        .side-ends { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px; font-size: 14px; }
        .score-board { background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; margin: 10px 0; }
        .score-title { text-align: center; margin-bottom: 10px; font-weight: bold; }
        .scores { display: flex; justify-content: space-around; }
        .score-item { text-align: center; }
        .score-value { font-size: 1.2em; font-weight: bold; color: #FFD700; }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="header"><h1>🎲 Dominó Venezolano - 1 vs 3 Bots</h1></div>
        <div class="side-ends" id="sideEnds">Extremos: <span id="leftEnd">-</span> | <span id="rightEnd">-</span></div>
        <div class="score-board"><div class="score-title">Puntuación</div><div class="scores"><div class="score-item"><div>Jugador</div><div class="score-value" id="score0">0</div></div><div class="score-item"><div>Bot 1</div><div class="score-value" id="score1">0</div></div><div class="score-item"><div>Bot 2</div><div class="score-value" id="score2">0</div></div><div class="score-item"><div>Bot 3</div><div class="score-value" id="score3">0</div></div></div></div>
        <div class="game-info"><div class="player-info" id="player0Info"><div class="player-name">Jugador</div><div class="player-tiles-count">Fichas: <span id="player0Count">7</span></div></div><div class="player-info" id="player1Info"><div class="player-name">Bot 1</div><div class="player-tiles-count">Fichas: <span id="player1Count">7</span></div></div><div class="player-info" id="player2Info"><div class="player-name">Bot 2</div><div class="player-tiles-count">Fichas: <span id="player2Count">7</span></div></div><div class="player-info" id="player3Info"><div class="player-name">Bot 3</div><div class="player-tiles-count">Fichas: <span id="player3Count">7</span></div></div></div>
        <div class="message" id="gameMessage">¡Nuevo juego iniciado! Tu turno.</div>
        <div class="board-container"><div class="board" id="gameBoard"></div></div>
        <div class="player-hand"><div class="hand-title">Tus Fichas</div><div class="tiles-container" id="playerTiles"></div></div>
        <div class="controls"><button onclick="passTurn()" id="passButton">Pasar Turno</button><button onclick="newGame()">Nuevo Juego</button></div>
        <div style="margin-top: 20px;"><h3>Reglas del Dominó Venezolano:</h3><ul style="margin: 10px 0 0 20px; line-height: 1.6;"><li>Cada jugador inicia con 7 fichas</li><li>Debes conectar fichas que coincidan en los extremos</li><li>En tu mano, todas las fichas se muestran verticalmente</li><li>Sobre la mesa, las fichas normales se colocan horizontalmente</li><li>Las fichas dobles se colocan verticalmente sobre la mesa</li><li>Si no puedes jugar, pasa tu turno</li><li>Gana quien se quede sin fichas o tenga menos puntos</li><li>Se suman puntos por múltiplos de 5 en los extremos</li><li>Tranca: Si nadie puede jugar, gana quien tenga menos puntos</li></ul></div>
    </div>
    <script>
        class DominoGame {
            constructor() {
                this.tiles = []; this.players = [[], [], [], []]; this.board = []; this.currentPlayer = 0;
                this.gameOver = false; this.passCount = 0; this.leftEnd = null; this.rightEnd = null;
                this.scores = [0, 0, 0, 0]; this.round = 1; this.initGame();
            }
            createTileSet() {
                this.tiles = [];
                for (let i = 0; i <= 6; i++) { for (let j = i; j <= 6; j++) { this.tiles.push([i, j]); } }
                this.shuffleTiles();
            }
            shuffleTiles() {
                for (let i = this.tiles.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]]; }
            }
            dealTiles() {
                for (let player = 0; player < 4; player++) { this.players[player] = []; for (let i = 0; i < 7; i++) { this.players[player].push(this.tiles.pop()); } }
            }
            findHighestDouble() {
                let highestDouble = -1, playerWithDouble = -1;
                for (let player = 0; player < 4; player++) { for (let tile of this.players[player]) { if (tile[0] === tile[1] && tile[0] > highestDouble) { highestDouble = tile[0]; playerWithDouble = player; } } }
                return { player: playerWithDouble, double: highestDouble };
            }
            initGame() {
                this.gameOver = false; this.passCount = 0; this.board = []; this.leftEnd = null; this.rightEnd = null;
                this.createTileSet(); this.dealTiles();
                const starter = this.findHighestDouble();
                if (starter.player !== -1) {
                    this.currentPlayer = starter.player;
                    const tileIndex = this.players[starter.player].findIndex(tile => tile[0] === starter.double && tile[1] === starter.double);
                    this.players[starter.player].splice(tileIndex, 1);
                    this.board.push([starter.double, starter.double]);
                    this.leftEnd = starter.double; this.rightEnd = starter.double;
                    this.nextTurn();
                } else { this.currentPlayer = 0; }
                this.updateDisplay();
            }
            canPlayTile(tile, side) {
                if (this.board.length === 0) return true;
                const targetEnd = side === 'left' ? this.leftEnd : this.rightEnd;
                return tile[0] === targetEnd || tile[1] === targetEnd;
            }
            playTile(playerIndex, tileIndex, side) {
                if (this.gameOver || this.currentPlayer !== playerIndex) return false;
                const tile = this.players[playerIndex][tileIndex];
                if (!this.canPlayTile(tile, side)) return false;
                this.players[playerIndex].splice(tileIndex, 1);
                let orientedTile = [...tile];
                const targetEnd = side === 'left' ? this.leftEnd : this.rightEnd;
                if (side === 'left') {
                    if (tile[1] !== targetEnd && tile[0] === targetEnd) { orientedTile = [tile[1], tile[0]]; }
                    this.board.unshift(orientedTile); this.leftEnd = orientedTile[0];
                } else {
                    if (tile[0] !== targetEnd && tile[1] === targetEnd) { orientedTile = [tile[1], tile[0]]; }
                    this.board.push(orientedTile); this.rightEnd = orientedTile[1];
                }
                this.passCount = 0;
                if (this.players[playerIndex].length === 0) { this.endGame(playerIndex); return true; }
                this.nextTurn(); return true;
            }
            getValidMoves(playerIndex) {
                const validMoves = [], hand = this.players[playerIndex];
                if (this.board.length === 0) { return hand.map((_, index) => ({ tileIndex: index, side: 'right' })); }
                for (let i = 0; i < hand.length; i++) {
                    if (this.canPlayTile(hand[i], 'left')) validMoves.push({ tileIndex: i, side: 'left' });
                    if (this.canPlayTile(hand[i], 'right')) validMoves.push({ tileIndex: i, side: 'right' });
                }
                return validMoves;
            }
            botPlay() {
                const validMoves = this.getValidMoves(this.currentPlayer);
                if (validMoves.length === 0) { this.passTurn(); return; }
                let bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                setTimeout(() => { this.playTile(this.currentPlayer, bestMove.tileIndex, bestMove.side); this.updateDisplay(); }, 1000);
            }
            passTurn() {
                this.passCount++;
                if (this.passCount >= 4) { this.endGameByBlock(); return; }
                this.nextTurn();
            }
            nextTurn() {
                this.currentPlayer = (this.currentPlayer + 1) % 4;
                this.updateDisplay();
                if (this.currentPlayer !== 0 && !this.gameOver) { this.botPlay(); }
            }
            endGame(winner) {
                this.gameOver = true;
                const playerNames = ['Jugador', 'Bot 1', 'Bot 2', 'Bot 3'];
                document.getElementById('gameMessage').innerHTML = \`<span class="winner">¡\${playerNames[winner]} ha ganado la ronda!</span>\`;
                this.scores[winner] += 25; this.updateScores();
            }
            endGameByBlock() {
                this.gameOver = true;
                const scores = this.players.map(hand => hand.reduce((sum, tile) => sum + tile[0] + tile[1], 0));
                const minScore = Math.min(...scores);
                const winner = scores.indexOf(minScore);
                const playerNames = ['Jugador', 'Bot 1', 'Bot 2', 'Bot 3'];
                document.getElementById('gameMessage').innerHTML = \`<span class="winner">Juego bloqueado. ¡\${playerNames[winner]} gana con \${minScore} puntos!</span>\`;
                this.scores[winner] += 10; this.updateScores();
            }
            updateScores() { for (let i = 0; i < 4; i++) { document.getElementById(\`score\${i}\`).textContent = this.scores[i]; } }
            updateDisplay() { this.updateBoard(); this.updatePlayerHand(); this.updateGameInfo(); this.updateMessage(); this.updateSideEnds(); this.updateScores(); }
            updateBoard() {
                const boardElement = document.getElementById('gameBoard');
                boardElement.innerHTML = '';
                this.board.forEach(tile => {
                    const tileElement = this.createTileElement(tile);
                    tileElement.classList.add(tile[0] === tile[1] ? 'vertical' : 'horizontal');
                    boardElement.appendChild(tileElement);
                });
            }
            updatePlayerHand() {
                const handElement = document.getElementById('playerTiles');
                handElement.innerHTML = '';
                this.players[0].forEach((tile, index) => {
                    const tileElement = this.createTileElement(tile);
                    tileElement.classList.add('vertical');
                    const canPlay = this.getValidMoves(0).some(move => move.tileIndex === index);
                    if (this.currentPlayer === 0 && !this.gameOver && canPlay) {
                        tileElement.onclick = () => this.handlePlayerTileClick(index);
                    } else { tileElement.classList.add('disabled'); }
                    handElement.appendChild(tileElement);
                });
            }
            handlePlayerTileClick(tileIndex) {
                const moves = this.getValidMoves(0).filter(m => m.tileIndex === tileIndex);
                if (moves.length === 1) { this.playTile(0, tileIndex, moves[0].side); }
                else if (moves.length === 2) {
                    const side = confirm('Place on the left side? (Cancel for right side)') ? 'left' : 'right';
                    this.playTile(0, tileIndex, side);
                }
                this.updateDisplay();
            }
            updateGameInfo() {
                for (let i = 0; i < 4; i++) {
                    const info = document.getElementById(\`player\${i}Info\`);
                    document.getElementById(\`player\${i}Count\`).textContent = this.players[i].length;
                    info.classList.toggle('active-player', this.currentPlayer === i && !this.gameOver);
                }
            }
            updateMessage() {
                if (this.gameOver) return;
                const playerNames = ['Tu turno', 'Turno de Bot 1', 'Turno de Bot 2', 'Turno de Bot 3'];
                document.getElementById('gameMessage').textContent = playerNames[this.currentPlayer];
            }
            updateSideEnds() {
                document.getElementById('leftEnd').textContent = this.leftEnd ?? '-';
                document.getElementById('rightEnd').textContent = this.rightEnd ?? '-';
            }
            createTileElement(tile) {
                const tileDiv = document.createElement('div');
                tileDiv.className = 'domino';
                tileDiv.innerHTML = \`<div class="domino-half">\${this.createDots(tile[0]).outerHTML}</div><div class="domino-half">\${this.createDots(tile[1]).outerHTML}</div>\`;
                return tileDiv;
            }
            createDots(num) {
                const dots = document.createElement('div');
                dots.className = 'dots';
                const patterns = { 0:[], 1:[4], 2:[0,8], 3:[0,4,8], 4:[0,2,6,8], 5:[0,2,4,6,8], 6:[0,2,3,5,6,8] };
                dots.style.gridTemplateColumns = 'repeat(3, 1fr)';
                dots.style.gridTemplateRows = 'repeat(3, 1fr)';
                for (let i = 0; i < 9; i++) {
                    const cell = document.createElement('div');
                    if (patterns[num].includes(i)) { cell.innerHTML = '<div class="dot"></div>'; }
                    dots.appendChild(cell);
                }
                return dots;
            }
        }
        let game;
        function newGame() { game = new DominoGame(); }
        function passTurn() { if (game && game.currentPlayer === 0 && !game.gameOver) { game.passTurn(); } }
        window.onload = newGame;
    </script>
</body>
</html>
`;