var canvas = document.getElementById('snake-board');
var context = canvas.getContext('2d');
var messageElement = document.getElementById('message');
var startButton = document.getElementById('btn-start');
var restartButton = document.getElementById('btn-restart');

var NUMBER_OF_COLUMNS = 18;
var NUMBER_OF_ROWS = 18;
var CELL_SIZE = canvas.width / NUMBER_OF_COLUMNS;
var GAME_SPEED = 250; //How many milliseconds between each movement

var snakeSegments = [];        
var currentDirection = [1, 0];  
var nextDirection = [1, 0];   
var foodPosition = { x: 0, y: 0 };
var gameIsRunning = false;
var gameLoop;

//Get a random number between 0 and max
function getRandomNumber(max){
  return Math.floor(Math.random() * max);
}

//Place food in a random empty cell
function placeFood(){
  var position = { x: 0, y: 0 };
  var landedOnSnake = true;

  //Keep trying until the food lands on an empty cell
  while (landedOnSnake) {
    position.x = getRandomNumber(NUMBER_OF_COLUMNS);
    position.y = getRandomNumber(NUMBER_OF_ROWS);

    landedOnSnake = false;

    for (var i = 0; i < snakeSegments.length; i++) {
      if (snakeSegments[i].x === position.x && snakeSegments[i].y === position.y) {
        landedOnSnake = true;
      }
    }
  }

  foodPosition = position;
}

//Check if the snake's head has hit itself
function snakeHitItself(headX, headY){
  for (var i = 0; i < snakeSegments.length; i++) {
    if (snakeSegments[i].x === headX && snakeSegments[i].y === headY) {
      return true;
    }
  }
  return false;
}

//Draw everything on the canvas
function draw(){
  context.clearRect(0, 0, canvas.width, canvas.height);

  //Draw the food as a white circle
  context.fillStyle = '#ffffff';
  context.beginPath();
  context.arc(
    foodPosition.x * CELL_SIZE + CELL_SIZE / 2,
    foodPosition.y * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE / 2 - 3,
    0,
    Math.PI * 2
  );
  context.fill();

  //Draw each segment of the snake
  for (var i = 0; i < snakeSegments.length; i++) {
    var segment = snakeSegments[i];

    if (i === 0) {
      context.fillStyle = '#522608';
    } else {
      context.fillStyle = '#8d5314';
    }

    context.fillRect(
      segment.x * CELL_SIZE,
      segment.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
  }
}

//Set up a fresh game
function setupGame(){
  snakeSegments = [
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 }
  ];
  currentDirection = [1, 0];
  nextDirection    = [1, 0];
  placeFood();
  draw();
}

//To do a step of the snake
function moveSnake(){
  currentDirection = nextDirection;

  var newHeadX = snakeSegments[0].x + currentDirection[0];
  var newHeadY = snakeSegments[0].y + currentDirection[1];

  //Check if the snake hit a wall
  if (newHeadX < 0 || newHeadX >= NUMBER_OF_COLUMNS || newHeadY < 0 || newHeadY >= NUMBER_OF_ROWS) {
    endGame();
    return;
  }

  //Check if the snake hit itself
  if (snakeHitItself(newHeadX, newHeadY)) {
    endGame();
    return;
  }

  //Add new head to the front of the snake
  var newHead = { x: newHeadX, y: newHeadY };
  snakeSegments.unshift(newHead);

  //Eat the food if it hits the head
  if (newHeadX === foodPosition.x && newHeadY === foodPosition.y) {
    placeFood();
  } else {
    snakeSegments.pop();
  }

  draw();
}

//Start game
function startGame(){
  if (gameIsRunning) {
    return;
  }

  setupGame();
  gameIsRunning = true;
  messageElement.textContent = 'Use arrow keys to move';
  startButton.classList.add('hidden');
  restartButton.classList.remove('hidden');
  gameLoop = setInterval(moveSnake, GAME_SPEED);
}

//End game
function endGame(){
  clearInterval(gameLoop);
  gameIsRunning = false;
  messageElement.textContent = 'Game over!';
}

//Restart Game
function restartGame(){
  clearInterval(gameLoop);
  gameIsRunning = false;
  startGame();
}

//Match keyboard input
function changeDirection(directionName){
  var newX;
  var newY;

  if (directionName === 'UP') {
    newX = 0;
    newY = -1;
  } else if (directionName === 'DOWN') {
    newX = 0;
    newY = 1;
  } else if (directionName === 'LEFT') {
    newX = -1;
    newY = 0;
  } else if (directionName === 'RIGHT') {
    newX = 1;
    newY = 0;
  }

  //Do not allow the snake to reverse into itself
  if (newX === -currentDirection[0] && newY === -currentDirection[1]) {
    return;
  }

  nextDirection = [newX, newY];

  if (!gameIsRunning) {
    startGame();
  }
}

//Check for arrow key presses
document.addEventListener('keydown', function(event){
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    changeDirection('UP');
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    changeDirection('DOWN');
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    changeDirection('LEFT');
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    changeDirection('RIGHT');
  }
});

//Button listeners
startButton.addEventListener('click', function(){
  startGame();
});

restartButton.addEventListener('click', function(){
  restartGame();
});

//Start the page when it loads
setupGame();