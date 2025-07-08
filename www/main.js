// tic-tac-toe.js
class TicTacToeScene extends Phaser.Scene {
  constructor() {
    super({ key: "TicTacToeScene" });
  }

  init() {
    // reset game state on start and restart
    this.board = Array(3)
      .fill(null)
      .map(() => Array(3).fill(null));
    this.currentPlayer = "X";
    this.cellSize = 0;
    this.gameOver = false;
  }

  preload() {}

  create() {
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;
    const size = Math.min(width, height - 60);
    this.cellSize = size / 3;

    // Draw grid lines
    this.grid = this.add.graphics();
    this.grid.lineStyle(4, 0xffffff);
    for (let i = 1; i < 3; i++) {
      this.grid.moveTo(i * this.cellSize, 0);
      this.grid.lineTo(i * this.cellSize, size);
      this.grid.moveTo(0, i * this.cellSize);
      this.grid.lineTo(size, i * this.cellSize);
    }
    this.grid.strokePath();

    // Input handler (tap to play or restart)
    this.input.off("pointerdown");
    this.input.on("pointerdown", (pointer) => {
      const x = pointer.worldX;
      const y = pointer.worldY;
      const col = Math.floor(x / this.cellSize);
      const row = Math.floor(y / this.cellSize);
      if (this.gameOver) {
        // restart game
        this.scene.restart();
        return;
      }
      if (row < 0 || row > 2 || col < 0 || col > 2) return;
      if (this.board[row][col]) return;
      this.placeMarker(row, col);
    });

    // Status text
    this.status = this.add
      .text(width / 2, size + 10, `Player ${this.currentPlayer}'s turn`, {
        font: "20px Arial",
        fill: "#fff",
      })
      .setOrigin(0.5, 0);
  }

  placeMarker(row, col) {
    this.board[row][col] = this.currentPlayer;
    const x = col * this.cellSize + this.cellSize / 2;
    const y = row * this.cellSize + this.cellSize / 2;
    this.add
      .text(x, y, this.currentPlayer, {
        font: `${this.cellSize * 0.8}px Arial`,
        fill: "#fff",
      })
      .setOrigin(0.5);

    const winLine = this.findWinningLine(this.currentPlayer);
    if (winLine) {
      // draw line over winning cells
      const line = this.add.graphics();
      line.lineStyle(6, 0xff0000);
      const [r1, c1, r2, c2] = winLine;
      const x1 = c1 * this.cellSize + this.cellSize / 2;
      const y1 = r1 * this.cellSize + this.cellSize / 2;
      const x2 = c2 * this.cellSize + this.cellSize / 2;
      const y2 = r2 * this.cellSize + this.cellSize / 2;
      line.moveTo(x1, y1);
      line.lineTo(x2, y2);
      line.strokePath();

      this.status.setText(`Player ${this.currentPlayer} wins! Tap to restart`);
      this.gameOver = true;
    } else if (this.board.flat().every((v) => v !== null)) {
      this.status.setText("It's a draw! Tap to restart");
      this.gameOver = true;
    } else {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
      this.status.setText(`Player ${this.currentPlayer}'s turn`);
    }
  }

  findWinningLine(p) {
    const B = this.board;
    for (let i = 0; i < 3; i++) {
      if (B[i].every((c) => c === p)) return [i, 0, i, 2];
    }
    for (let j = 0; j < 3; j++) {
      if ([B[0][j], B[1][j], B[2][j]].every((c) => c === p))
        return [0, j, 2, j];
    }
    if ([B[0][0], B[1][1], B[2][2]].every((c) => c === p)) return [0, 0, 2, 2];
    if ([B[0][2], B[1][1], B[2][0]].every((c) => c === p)) return [0, 2, 2, 0];
    return null;
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: document.getElementById("game-container").clientWidth,
  height: document.getElementById("game-container").clientHeight,
  backgroundColor: "#000000",
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [TicTacToeScene],
};

window.onload = () => {
  new Phaser.Game(config);
};
