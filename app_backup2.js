document.addEventListener('DOMContentLoaded', () => {
//falta arrumar rotacao
    
    const miniGrid = document.querySelector('.mini-grid');
    //seleciona classe grid
    //const grid = document.querySelector('.grid');
    const board = document.querySelector('.grid');

    const startBtn = document.querySelector('#start-button');
    const scoreDisplay = document.querySelector('#score');
    console.log('10');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    let speed = 400; 

    const colors = [
        'purple',
        'orange',
        'yellow',
        'blue',
        'green',
        'darkred',
        'lightblue'
    ];

    //fill board with squares
    for(let i = 0; i < 210; i++){
        
            let div = document.createElement('DIV');
            board.appendChild(div);
            if(i >199){
                div.classList.add('taken');
            }
        }
    
    //fill mini-grid with squares
    for(let i = 0; i < 16; i++){
        let div = document.createElement("div");
        miniGrid.appendChild(div);
    }
    
    let squares = Array.from(document.querySelectorAll('.grid div'));
    
       
    //Tetrominoes
    const jTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];
    const lTetromino = [
        [1, 2, width+2, width*2+2],
        [width*2, width*2+1, width+2, width*2+2],
        [0, width, width*2, width*2+1],
        [width, width*2, width+1, width+2]
    ];
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width,width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ];
    
    const sTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ];
    const zTetromino = [
        [1, width, width+1, width*2],
        [width, width+1, width*2 + 1, width*2+ 2],
        [1, width, width+1, width*2],
        [width, width+1, width*2 + 1, width*2+ 2]
    ];
    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
        
    ];
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];
    
    const theTetrominoes = [jTetromino, lTetromino, tTetromino, sTetromino, zTetromino, oTetromino, iTetromino];
    
    let currentPosition = 4;
    let currentRotation = 0;
    
    //randomly select a Tetromino and its first rotaion
    let random = Math.floor(Math.random()*theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];
    
    //draw the Tetromino
    
    function draw(){
        current.forEach(index =>{
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        });
    }
    
    function undraw(){
        current.forEach(index =>{
           squares[currentPosition + index].classList.remove('tetromino');
           squares[currentPosition + index].style.backgroundColor = '';

        });
    }
    
    //make the tetromino move down every second
    //timerId = setInterval(moveDown, 800);
    
    //assign function to keyCodes
    
    function control(e){
        if(e.keyCode === 37){
            moveLeft();
        }else if (e.keyCode === 38){
            rotate();
        }else if (e.keyCode === 39){
            moveRight();
        }else if (e.keyCode === 40){
            moveDown();
        }
    }
    
    document.addEventListener('keyup', control);
    
    function moveDown(){
        undraw();
        currentPosition += width;
        draw();
        freeze();
        //console.log(currentPosition);
    }
    
    //freeze function
    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            //start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }
    //move the tetromino left, unless is at the edge or there is a blockage
    function moveLeft(){
        undraw();
        const  isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        //console.log(isAtLeftEdge);
        if(!isAtLeftEdge) {
            currentPosition -= 1;
        }
        
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1;
        }
        draw();
    }
    
    function moveRight(){
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition+width + index) % width === width - 1);
        
        if(!isAtRightEdge){
            currentPosition +=1;
        }
        
        if(current.some(index => squares[currentPosition+width + index].classList.contains('taken'))){
            currentPosition -= 1;
        }
        draw();
    }
    //rotate the tetromino
    
    function rotate(){
        function loop(condition, doThis){
            if(codition){
                doThis;
                loop(condition, doThis);
            }
        }
        //precisa detectar se vai atravessar o grid, ou outra peça
        undraw();
        //console.log(current);
        currentRotation++;
        if(currentRotation === current.length){
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        
         
        let overlapsTetromino = current.some(index => squares[currentPosition + index].classList.contains('taken'));
                
        if(current.some(index => (currentPosition + index) % width === width -1 ||  overlapsTetromino)){
            //adjust position if after rotating the tetramino would cross the right grid limit
            
                currentPosition -= 1;   
                        
        }else if(current.some(index => (currentPosition + index) % width === 0 || overlapsTetromino)){
            //adjust position if after rotating the tetramino would cross the Left grid limit
           
                currentPosition += 1;   
            
            
        }

        draw();
    }
    
    //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;
    
    
    // the Tetrominos without rotations
    const upNextTetrominoes =[
        [1, displayWidth+1, displayWidth*2+1, 2], //jTetromino
        [1, 2, displayWidth+2, displayWidth*2+2], //lTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2],//tTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1],//sTetromino
        [1, displayWidth, displayWidth+1, displayWidth*2], //zTetromino
        [0, 1, displayWidth, displayWidth+1],//oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]//iTetromino

    ];
    
    //display the shape in the mini-grid display
    function displayShape(){
        //remove any trace of
        displaySquares.forEach(square =>{
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        upNextTetrominoes[nextRandom].forEach(index =>{
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];

        });
    }
    
    startBtn.addEventListener('click', () => {
       if(timerId){
           clearInterval(timerId);
           timerId = null;
       }else{
           draw();
           timerId = setInterval(moveDown, speed);
           nextRandom = Math.floor(Math.random() * theTetrominoes.length);
           displayShape();
       } 
        
    });
    
    //add score
    function addScore(){
        for(let i = 0; i < 199; i +=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            
            if(row.every(index => squares[index].classList.contains('taken'))){
                score +=10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                    
                });
                const squaresRemoved = squares.splice(i, width);
               //console.log(squareRemoved);
               undraw();
               squares = squaresRemoved.concat(squares);
               squares.forEach(cell => board.appendChild(cell));
               draw();
            }
            
        }
    }
    
    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }
    
    
    
});
