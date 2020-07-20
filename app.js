document.addEventListener('DOMContentLoaded', () => {
    //fix rotation when close to grid limit and 'taken' squares
    //arrow key down makes piece fall faster OK
    //when a line was cleared the falling tetromino would move down with the grid. fixed
    //add sound.
    //more tetrominoes  done
    //delay freeze, so player can adjust piece after it reaches the ground. added
    //start button also changes next tetromino. fixed
    //pressing arrow keys before pressing start makes tetromino appear without timer. fixed
    //you can move tetrominoes after game ends.. fixed
    
        const miniGrid = document.querySelector('.mini-grid');
        //seleciona classe grid
        //const grid = document.querySelector('.grid');
        const board = document.querySelector('.grid');
    
        const startBtn = document.querySelector('#start-button');
        const scoreDisplay = document.querySelector('#score');
        const levelDisplay = document.querySelector('#level');
        const width = 10;
        let nextRandom = 0;
        let timerId = null;
        let timerDelayFreeze = null;
        let score = 0;
        let level = 1;
        let speed = 800; 
        let previousRotation;
        let previousPosition;
        let counter = 0;
        const wait = 2; //time to wait before freezing // default: 2 * the interval
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
            [0, width, width+1, width+2],
            [1, width+1, width*2+1, 2],
            [width, width+1, width+2, width*2+2],
            [1, width+1, width*2, width*2+1]
        ];
        const lTetromino = [
            [width, width+1, 2, width+2],
            [1, width+1, width*2+1, width*2+2],
            [width, width*2, width+1, width+2],
            [0, 1, width+1, width*2+1]
        ];
        const tTetromino = [
            [1, width, width+1, width+2],
            [1, width+1, width+2, width*2+1],
            [width,width+1, width+2, width*2+1],
            [1, width, width+1, width*2+1]
        ];
        
        const sTetromino = [
            [width, 1, width+1,2],
            [1, width+1, width+2, width*2+2],
            [width*2, width+1, width*2+1, width+2],
            [0, width, width+1, width*2+1]
        ];
        const zTetromino = [
            [0, 1, width+1, width+2],
            [2, width+1, width+2, width*2+1],
            [width, width+1, width*2 + 1, width*2+ 2],
            [1, width, width+1, width*2]
        ];
        const oTetromino = [
            [0, 1, width, width+1],
            [0, 1, width, width+1],
            [0, 1, width, width+1],
            [0, 1, width, width+1]
            
        ];
        const iTetromino = [
            [width, width+1, width+2, width+3],
            [2, width+2, width*2+2, width*3+2],
            [width*2, width*2+1, width*2+2, width*2+3],
            [1, width+1, width*2+1, width*3+1]
            
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
            if(timerId !== null){
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
        }
        
        document.addEventListener('keydown', control);
       
        function slide(){
            undraw();
            draw();
            
        }
        function delay(){
            
        }
        function moveDown(){
            undraw();
            
            //when tetromino hits something don't move down and wait 2 times befores freezing
            if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
                counter++;
                if(counter < wait){
                  //  currentPosition -= width;
                }
                
            }else{
                currentPosition += width;
                counter = 0;
                //console.log(counter);

            }
            draw();
            freeze();
                
            
            
            //console.log(currentPosition);
        }
        
        //freeze function
        function freeze(){
            if(current.some(index => squares[currentPosition + index + width].classList.contains('taken')) && counter > (wait - 1)){
                current.forEach(index => squares[currentPosition + index].classList.add('taken'));
                //start a new tetromino falling
                random = nextRandom;
                nextRandom = Math.floor(Math.random() * theTetrominoes.length);
                current = theTetrominoes[random][currentRotation];
                currentPosition = 4;
                counter = 0;
                draw();
                displayShape();
                addScore();
                gameOver();
            }
        }
        //move the tetromino left, unless is at the edge or there is a blockage
        function moveLeft(){
            undraw();
            let  isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
            //console.log(isAtLeftEdge);
            if(!isAtLeftEdge) {
                currentPosition -= 1;
            }
            
            if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
                currentPosition += 1;
            }
            draw();
            freeze();
        }
        
        function moveRight(){
            undraw();
            let isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
            
            if(!isAtRightEdge){
                currentPosition +=1;
            }
            
            if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
                currentPosition -= 1;
            }
            draw();
            freeze();
        }
        //rotate the tetromino
        
        function rotate(){
            function incrementa(numero){
                return numero + 1;
            }
            function decrementa(numero){
                return numero - 1;
            }
            function isAtRightEdge(tetromino){
                let isAtRightEdge = tetromino.some(index => (currentPosition + index) % width === width -1);
                return isAtRightEdge;
    
            }
            function isAtLeftEdge(tetromino){
                let isAtLeftEdge = tetromino.some(index => (currentPosition + index) % width === 0);
                return isAtLeftEdge;
            }
            
            function overlapsTetromino(tetromino){
                let overlapsTetromino = tetromino.some(index => squares[currentPosition + index].classList.contains('taken'));
                return overlapsTetromino;
            }
            /*function isAboveTaken(){
                let isAboveTaken = current.some(index => squares[currentPosition + index + width].classList.contains('taken'));
                return isAboveTaken;
            }*/
            
            function teste(facaIsto){
                let contador = 0;
                while(isAtLeftEdge(current) && isAtRightEdge(current) && contador < 2){
                    currentPosition =  facaIsto(currentPosition);
                    contador++;
                }
                if(overlapsTetromino(current)){
                    //do nothing
                    currentPosition = previousPosition;
                    currentRotation = previousRotation;
                    current = previous;
                }
            }
           function teste2(){
            //when trying to rotate tries moving left then right then up,
            // if nothing works doesnt rotate
                   currentPosition--;
                   if(!overlapsTetromino(current) && !(isAtRightEdge(current) && isAtLeftEdge(current)) ){
                        return;
                   }else{
                    currentPosition--;
                   }
    
                   if(overlapsTetromino(current) || (isAtRightEdge(current) && isAtLeftEdge(current)) ){
                        currentPosition = previousPosition;  
                       currentPosition ++;
                       if(!overlapsTetromino(current) && !(isAtRightEdge(current) && isAtLeftEdge(current)) ){
                           return;
                       }else{
                          currentPosition++;
                       }
                   }
                   if(overlapsTetromino(current) || (isAtRightEdge(current) && isAtLeftEdge(current)) ){
                    currentPosition = previousPosition;  
                    currentPosition -= width;
                        if(!overlapsTetromino(current) && !(isAtRightEdge(current) && isAtLeftEdge(current)) ){
                            return;
                        }else{
                            currentPosition -= width;
                        }

                    }
                   if(overlapsTetromino(current) || (isAtRightEdge(current) && isAtLeftEdge(current)) ){
                       //do nothing
                       currentPosition = previousPosition;
                       currentRotation = previousRotation;
                       current = previous;
                   }
    
           }
            //remember previous state
            previousPosition = currentPosition;
            previousRotation = currentRotation;
            let previous = current;
            undraw();
            //console.log(current);
            currentRotation++;
            if(currentRotation === current.length){
                currentRotation = 0;
            }
            current = theTetrominoes[random][currentRotation];
           
            if(overlapsTetromino(current) || (isAtRightEdge(current) && isAtLeftEdge(current)) ){
                if(isAtLeftEdge(previous)){
                    teste(incrementa);
                }else if(isAtRightEdge(previous)){
                    teste(decrementa);
                }else{
                    teste2();
                }
            }
    
            draw();
            freeze();
        }
        
        //show up-next tetromino in mini-grid display
        const displaySquares = document.querySelectorAll('.mini-grid div');
        const displayWidth = 4;
        const displayIndex = 0;
        
        
        // the Tetrominos without rotations
        const upNextTetrominoes =[
            [0, displayWidth, displayWidth+1, displayWidth+2],//jTetromino
            [displayWidth, displayWidth+1, 2, displayWidth+2], //lTetromino
            [1, displayWidth, displayWidth+1, displayWidth+2],//tTetromino
            [displayWidth, 1, displayWidth+1,2],     //sTetromino
            [0, 1, displayWidth+1, displayWidth+2],      //zTetromino
            [0, 1, displayWidth, displayWidth+1],//oTetromino
            [displayWidth, displayWidth+1, displayWidth+2, displayWidth+3],      //iTetromino
    
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
               levelDisplay.innerHTML = level;
               if(nextRandom === 0){
                  nextRandom = Math.floor(Math.random() * theTetrominoes.length); 
               }
               
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
                    //increase speed
                    if(score % 100 === 0){
                        clearInterval(timerId);
                        speed -= 50;
                        timerId = setInterval(moveDown, speed);
                        levelDisplay.innerHTML = ++level;
                        //console.log(speed);
                    }

                    
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
                timerId = null;
            }
        }
        
        
        
    });
    