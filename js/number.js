import grid from './grid.js';

/**
 * classe number qui gère la génération du nombre 
 * l'addition de deux cases identique
 */
const number = {
    numbers: [],
    getElements: function() {
        const numberElements = document.getElementsByClassName("number"); //on récupère les éléments ayant la classe number

        for (let numberElement of numberElements) { //ensemble des nombres présents sur le plateau
            this.numbers.push(numberElement); //lorsqu'un nouveau nombre apparaît, on incrémente la taille du tableau  
        }

    }, 

    /**
     * fonction permettant de faire apparaître la première case avec le chiffre 2 à l'intérieur
     * Celle-ci apparaît dans une cellule aléatoire
     */
    spawn: function(){
        const emptyCellIndex = grid.randomEmptyCellIndex(); //la case de spawn est une case random parmi celles générées sans chiffre
        if (emptyCellIndex === false ) { 
            return  false;
        }

        const numberElement = document.createElement("div");//le nombre est  un nouvle élément de type grid
        const numberValue = 2; //valeur de départ

        numberElement.innerText = numberValue; //contenu textuel d'un élément 
        numberElement.dataset.value = numberValue; //fournit un accès en lecture écriture à l'attribut value (égale à la numbervalue)
        numberElement.classList.add("number"); //propriété en lecture seule qui retourne un DOMTokenlist de la classe number, permet ensuite de manipuler la classe number (voir doc Element.classList c'est mieux expliqué)
 

        /* 
         * position du point de départ de la première valeur
         * Comme pour une coordonnée classique, il suffit d'avoir une hauteur et une largeur random 
         * pour connaître la position de départ 
         */
        numberElement.style.top = `${grid.cells[emptyCellIndex].top}px`; //renvoie la position supérieur de la cellule index vide 
        numberElement.style.left = `${grid.cells[emptyCellIndex].left}px`;  //renvoie la position latérale gauche de la cellule index vide  

        grid.cells[emptyCellIndex].number = numberElement; 
        grid.gridElement.append(numberElement); //insère un numberElement après le dernier élement de gridElement 

        return  true;

    },

    /**
     *  Fonction qui définit le déplacement des nombres 
     * @param {*} fromCell cellule d'origine 
     * @param {*} toCell  cellule d'arrivé
     */
    moveTo: function(fromCell, toCell) {
        const number = fromCell.number;  // constante nombre correspond à la cellule d'origine contenant un nombre

        if (toCell.number === null) {
            //la cellule cible est vide, on remplit avec un nombre 
            number.style.top = `${toCell.top}px`; //renvoie la position supérieur de la cellule de destination
            number.style.left = `${toCell.left}px`; // renvoie la position gauche de la cellule de destination

            toCell.number = number;  //valeur du nombre cellule de destination 
            fromCell.number = null; //la valeur de la cellule de départ est à null
        } else if (number.dataset.value === toCell.number.dataset.value) {
            //la cellule cible et celle de départ ont le même nombre
            //on fusionne les deux cellules
            number.style.top = `${toCell.top}px`;//renvoie la position supérieur de la cellule de destination 
            number.style.left = `${toCell.left}px`;// renvoie la position gauche de la cellule de destination
            number.style.opcacity = '0';//le nombre qui c'est déplacé disparaît 

           
            setTimeout(() => {
                grid.gridElement.removeChild(number);  //supprime un noeud enfant et renvoie le noeud supprimé
            }, 500); //temps en ms evant la disparition du chiffre qui c'est déplacé

            //double target cell's number 
            const newNumberValue = toCell.number.dataset.value * 2; //lorsque deux cellules fusionnent le nombre double
            toCell.number.dataset.value = newNumberValue; //on lit/écrit le nouveau nombre dans la cellule de destination
            toCell.number.innerText = newNumberValue; //permet de définir le rendu visuel du nombre, le nouveau nombre apparaît

            fromCell.number = null; //on met le nombre de la cellule de destination à null

        }
    }
}

export default number;