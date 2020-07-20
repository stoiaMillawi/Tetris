document.addEventListener('DOMContentLoaded', () => {
    
    const board = document.querySelector('.grid');
    const miniGrid = document.querySelector('.mini-grid');
    //seleciona classe grid
    const grid = document.querySelector('.grid');

    const startBtn = document.querySelector('#start-button');
    const scoreDisplay = document.querySelector('#score');

    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    //fill board with squares
    for (let i = 0; i < 210; i++) {

        let div = document.createElement('div');
        board.appendChild(div);
        if (i > 199) {
            div.classList.add('taken');
        }
    }
});
