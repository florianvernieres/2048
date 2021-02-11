import number from './number.js'

const grid = {
    gridElement: document.getElementsByClassName("grid")[0], //On recupère les éléments de la classe grid à l'index 0
    cells: [], 
    playable: false,
    directionRoots: {
        //roots sont les premiers index de lignes ou de colonnes de la direction du balayage
        'UP': [1, 2, 3, 4],
        'RIGHT': [4, 8, 12, 16],
        'DOWN': [13, 14, 15, 16],
        'LEFT': [1, 5, 9, 13]
    }, 

    init: function(){
        const cellElements = document.getElementsByClassName("cell");
        let cellIndex = 1;

        for(let cellElement of cellElements){
            grid.cells[cellIndex] = {
                element: cellElement, 
                top: cellElement.offsetTop,
                left: cellElement.offsetLeft,
                number: null
            }

            cellIndex++;    
        }

        //génération du premier nombre et du début du jeu
        number.spawn();
        this.playable = true;

    }, 
    randomEmptyCellIndex: function() {
        let emptyCells = [];

        for (let i = 1; i < this.cells.length; i++) {
            if(this.cells[i].number === null) {
                emptyCells.push(i);
            }           
        }

        if (emptyCells.length === 0) {
            /* Si il n'y a plus de cases libre, on a perdu */
            return false;
        }

        return emptyCells[Math.floor(Math.random()*emptyCells.length)];
    },

    /**
     * Fonction qui gère le slide de déplacement d'un nombre
     */
    slide: function(direction){
        if (!this.playable) {
            return false;
        }

        //jouable à false pour empêcher les conditions de glisser
        this.playable = false;

        //permet d'obtenir les directions des indices racines de grille
        const roots = this.directionRoots[direction];

        //indexes increments or decrements depend on direction
        let increment = (direction === 'RIGHT' || direction === 'DOWN') ? -1 : 1;

        //indexe se déplace lorsque
        increment *= (direction === 'UP' || direction === 'DOWN') ? 4 : 1; 

        //on  démarre une boucle avec l'indexe racine 
        for (let i = 0; i < roots.length; i++) {
            const root = roots[i];

            //increment or decrement through grid from root 
            // j starts from 1 bc  no need to check root cell
            for (let j = 1; j < 4; j++) {
                const cellIndex = root + (j * increment);
                const cell = this.cells[cellIndex];

                if (cell.number !== null) {
                    let moveToCell = null;

                    //check if cells below(to root)this cell empty or has name number
                    //to decide to move or stay
                    // k starts from j-1 first cell bellow j
                    // k ends by 0 which is root cell
                    for (let k = j-1; k >= 0; k--) {
                        const forecellIndex = root + (k * increment);
                        const foreCell = this.cells[forecellIndex];

                        if (foreCell.number === null) {
                            //the cell is empty move to and check next cell
                            moveToCell = foreCell;
                        } else if(cell.number.dataset.value === foreCell.number.dataset.value) {
                            //the cell has same number, move, merge and stop
                            moveToCell = foreCell;
                            break;
                        } else{
                            //next cell is nempty and not same with moving number
                            // number can't go further
                            break;
                        }
                    }

                    if (moveToCell !== null) {
                        number.moveTo(cell, moveToCell);

                    }     
                }   
            } 
        }

        //spawn a new number and make game playable
        setTimeout(function() {

            if (number.spawn()) {
                grid.playable = true;
            
            } else {
                alert("GAME OVER!");
            }
        }, 500)
    }
}

export default grid;
