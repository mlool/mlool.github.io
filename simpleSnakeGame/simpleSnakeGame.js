var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var restartButton = document.getElementById('restart');
var countSpeed = 60 / document.getElementById('speed').value;

var score = 0;
var high_score = 0;
var grid = 16;
var count = 0;
var gamePaused = true;
  
var snake = {
    x: 160,
    y: 160,

    // snake velocity. moves one grid length every frame in either the x or y direction
    dx: 0,
    dy: 0,

    // keep track of all grids the snake body occupies
    cells: [],

    // length of the snake. grows when eating an apple
    maxCells: 4
};

var apple = {
    x: 320,
    y: 320
};

// get random whole numbers in a specific range
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
    requestAnimationFrame(loop);

    // slow game loop to 15 fps instead of 60 (60/15 = 4)
    if (++count < countSpeed) {
        return;
    }

    count = 0;
    context.clearRect(0,0,canvas.width,canvas.height);

    // move snake by it's velocity
    if (!gamePaused) {
        snake.x += snake.dx;
        snake.y += snake.dy;
    }
    

    // wrap snake position horizontally on edge of screen
    if (snake.x < 0) {
        // snake.x = canvas.width - grid;
        gamePaused = true;
        return;
    }
    else if (snake.x >= canvas.width) {
        // snake.x = 0;
        gamePaused = true;
        return;
    }
    
    // wrap snake position vertically on edge of screen
    if (snake.y < 0) {
        // snake.y = canvas.height - grid;
        gamePaused = true;
        return;
    }
    else if (snake.y >= canvas.height) {
        // snake.y = 0;
        gamePaused = true;
        return;
    }

    // keep track of where snake has been. front of the array is always the head
    snake.cells.unshift({x: snake.x, y: snake.y});

    // remove cells as we move away from them
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // draw apple
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid-1, grid-1);

    // draw snake one cell at a time
    context.fillStyle = 'green';
    snake.cells.forEach(function(cell, index) {
        
        // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
        context.fillRect(cell.x, cell.y, grid-1, grid-1);  

        // snake ate apple
        if (cell.x === apple.x && cell.y === apple.y) {
            score++
            updateScoreBoard();
            snake.maxCells++;

            // canvas is 400x400 which is 25x25 grids 
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }

        // check collision with all cells after this one (modified bubble sort)
        for (var i = index + 1; i < snake.cells.length; i++) {
        
            // snake occupies same space as a body part. reset game
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = 0;
                snake.dy = 0;

                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
        }
    });
}

function updateScoreBoard() {
    document.getElementById("currentScore").textContent = score;
    high_score = Math.max(score, high_score);
    document.getElementById("maxScore").textContent = high_score;
}

// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
    // prevent snake from backtracking on itself by checking that it's 
    // not already moving on the same axis (pressing left while moving
    // left won't do anything, and pressing right while moving left
    // shouldn't let you collide with your own body)
    
    // left arrow key
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
        gamePaused = false;
    }
    // up arrow key
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
        gamePaused = false;
    }
    // right arrow key
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
        gamePaused = false;
    }
    // down arrow key
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
        gamePaused = false;
    }
});

restartButton.addEventListener("click", function() {
    score = 0;
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = 0;
    snake.dy = 0;

    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;

    countSpeed = 60 / document.getElementById('speed').value;
    updateScoreBoard();
});

requestAnimationFrame(loop);