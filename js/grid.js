import number from './number.js'

/**
 * constante grid 
 * contient les specs générales à chaque cellules du plateau
 */
const grid = {
    gridElement: document.getElementsByClassName("grid")[0], //On recupère les éléments de la classe grid à partir l'index 0
    cells: [], 
    playable: false, // variable permettant s'il est possible de jouer ou non 

    /*
     * ensemble des directions de jeu possible 
     */
    directionRoots: {

        //roots sont les premiers index de lignes ou de colonnes de la direction du balayage
        'UP': [1, 2, 3, 4],
        'RIGHT': [4, 8, 12, 16],
        'DOWN': [13, 14, 15, 16],
        'LEFT': [1, 5, 9, 13]
    }, 

    /**
     * fonction d'initialisation de la partie
     */
    init: function(){
        const cellElements = document.getElementsByClassName("cell"); //on récupère toutes les cellules du jeu
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
        this.playable = true; //jeu jouable lorsque le premier nombre est généré

    },

    /** 
     * génération des cellules qui n'auront pas de nombres au démarrage de la partie
     */
    randomEmptyCellIndex: function() {
        let emptyCells = [];

        for (let i = 1; i < this.cells.length; i++) { // pour chaque cellules du plateau
            if(this.cells[i].number === null) { // si le nombre 
                emptyCells.push(i); // on ajoute i éléments au tableau emptyCell et renvoie sa longueure
            }           
        }

        
        /* si la taille du tableau contenant l'ensemble des cellules vides = 0 */
        if (emptyCells.length === 0) {
            /* fonction return false */
            return false;
        }

        /**
         * le tableau emptyCell renvoie le plus grand entier inférieur ou égal 
         * à un nombre aléatoire * la taille du tableau emptyCell
         */
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

        //on index (mets à jour) en incrémentant ou décrémentant la direction -1 pour aller à droite et 1 pour aller en bas
        let increment = (direction === 'RIGHT' || direction === 'DOWN') ? -1 : 1;

        //indexe se déplace lorsque
        increment *= (direction === 'UP' || direction === 'DOWN') ? 4 : 1;  //increment = increment * direction

        //on  démarre une boucle avec l'indexe racine 
        for (let i = 0; i < roots.length; i++) {
            const root = roots[i];

            //on incrémente ou décremente la grille à partir de la racine (case de spawn)
            for (let j = 1; j < 4; j++) { // on démarre j à un car on a pas besoin de vérifier la cellule racine
                const cellIndex = root + (j * increment); //la cellule index = chemin parcourue + j * la valeur incrémentée
                const cell = this.cells[cellIndex];

                if (cell.number !== null) { //s'il n'y a pas de nombres dans une cellule
                    let moveToCell = null; //on ne peut pas faire bouger la cellule

                    /**
                     * on vérifie si les cellules en dessous de la route ont un numéro
                     * on décide de bouger ou non
                     *  k commence à partir de j-1 première cellule ci-dessous j
                     * k se termine par 0 qui est la cellule racine
                     */
                    for (let k = j-1; k >= 0; k--) {
                        const forecellIndex = root + (k * increment);
                        const foreCell = this.cells[forecellIndex]; //cellule antérieure

                        if (foreCell.number === null) {
                            //la cellule est vide déplacer et vérifier la cellule suivante
                            moveToCell = foreCell; //on se déplace vers la cellule antérieure
                        } else if(cell.number.dataset.value === foreCell.number.dataset.value) { //si deux cellules qui se rencontrent ont le même numéro
                            //on se déplace vers la cellule et la cellule antérieure devient la cellule index
                            moveToCell = foreCell;
                            break;
                        } else{
                            //la cellule suivante est vide et ne contient pas de numéros
                            // le nombre ne peut pas aller plus loin
                            break;
                        }
                    }

                    if (moveToCell !== null) {
                        number.moveTo(cell, moveToCell);

                    }     
                }   
            } 
        }

        /**
         * définition du temps de jeu 
         * le jeu est jouable tant qu'un vhiffre peut spawné
         * le jeu se termine lorsque qu'il n'y a plus de cases libres disponibles
         */
        setTimeout(function() {

             
            if (number.spawn()) { // si un nombre a bien spawné après un déplacement 
                grid.playable = true; // le jeu est jouable 
            
            } else {
                alert("GAME OVER!");// donne une alerte de fin de jeu (à changer) TODO ALEX
            }
        }, 500) //temps entre le mouvement et le spawn du nouveau chiffre en ms
    }
}

export default grid;
