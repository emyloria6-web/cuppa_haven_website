const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const msgEl = document.getElementById('msg');
const btnStart = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');

const COLS = 18;
const ROWS = 18;
const CELL = canvas.width / COLS;
const SPEED = 130; // ms per tick

const DIRS = {
  UP:    [0, -1],
  DOWN:  [0,  1],
  LEFT:  [-1, 0],
  RIGHT: [1,  0]
};

let snake, dir, nextDir, food, score, best = 0, running = false, loop;

// ─── Utilities ────────────────────────────────────────────────────────────────

function rand(max) {
  return Math.floor(Math.random() * max);
}

function spawnFood() {
  let pos;
  do {
    pos = { x: rand(COLS), y: rand(ROWS) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  food = pos;
}

// ─── Game logic ───────────────────────────────────────────────────────────────

function init() {
  snake   = [{ x: 9, y: 9 }, { x: 8, y: 9 }, { x: 7, y: 9 }];
  dir     = [1, 0];
  nextDir = [1, 0];
  score   = 0;
  scoreEl.textContent = 0;
  spawnFood();
  draw();
}

function tick() {
  dir = nextDir;

  const head = {
    x: snake[0].x + dir[0],
    y: snake[0].y + dir[1]
  };

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    endGame(); return;
  }

  // Self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame(); return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    if (score > best) {
      best = score;
      bestEl.textContent = best;
    }
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function draw() {
  // Background
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 0.5;
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * CELL);
    ctx.lineTo(canvas.width, r * CELL);
    ctx.stroke();
  }
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * CELL, 0);
    ctx.lineTo(c * CELL, canvas.height);
    ctx.stroke();
  }

  // Snake
  snake.forEach((seg, i) => {
    const isHead = i === 0;
    const pad = isHead ? 1 : 2;
    ctx.fillStyle = isHead ? '#7f77dd' : '#534AB7';
    ctx.beginPath();
    ctx.roundRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 4);
    ctx.fill();
  });

  // Food
  ctx.fillStyle = '#ef9f27';
  ctx.beginPath();
  ctx.arc(
    food.x * CELL + CELL / 2,
    food.y * CELL + CELL / 2,
    CELL / 2 - 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// ─── State transitions ────────────────────────────────────────────────────────

function startGame() {
  if (running) return;
  running = true;
  init();
  msgEl.textContent = 'Use arrow keys or the d-pad';
  btnStart.classList.add('hidden');
  btnRestart.classList.remove('hidden');
  loop = setInterval(tick, SPEED);
}

function endGame() {
  clearInterval(loop);
  running = false;
  msgEl.innerHTML = `Game over! Score: <strong>${score}</strong>`;
}

function restartGame() {
  clearInterval(loop);
  running = false;
  startGame();
}

// ─── Input handling ───────────────────────────────────────────────────────────

function setDir(d) {
  const [dx, dy] = DIRS[d];
  // Prevent reversing
  if (dx === -dir[0] && dy === -dir[1]) return;
  nextDir = [dx, dy];
  if (!running) startGame();
}

document.addEventListener('keydown', e => {
  const map = {
    ArrowUp:    'UP',
    ArrowDown:  'DOWN',
    ArrowLeft:  'LEFT',
    ArrowRight: 'RIGHT'
  };
  if (map[e.key]) {
    e.preventDefault();
    setDir(map[e.key]);
  }
});

document.querySelectorAll('#d-pad [data-dir]').forEach(btn => {
  btn.addEventListener('click', () => setDir(btn.dataset.dir));
});

btnStart.addEventListener('click', startGame);
btnRestart.addEventListener('click', restartGame);

// ─── Boot ─────────────────────────────────────────────────────────────────────

init();
