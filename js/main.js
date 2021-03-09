import grid from './grid.js';


/**
 * fonction permettant d'initialiser un plateau en début de partie
 */
grid.init();

/* fonction permettant de capter un évènement, içi celle de la touche de direction */
document.addEventListener('keyup', function(e) {
    let direction = null;

    if(e.keyCode === 38){ //Si on appuie la la flèche du haut 
        direction = "UP"; //On place direction vers le haut
    
    }else if(e.keyCode  === 39){ // si on appuie sur la fleche de droite 
        direction = "RIGHT"; //On place direction vers la droite

    }else if(e.keyCode === 37 ){
        direction = "LEFT";

    }else if(e.keyCode === 40 ){
        direction = "DOWN";
    }
      
    
    if(direction !== null){  //Si direction non null
        grid.slide(direction); // la case se déplace dans la position souhaitée
    }

    return false;
});

const rejouer = document.getElementById('restart'); // On récupère l'élément sur lequel on veut détecter le clic
rejouer.addEventListener('click', function() {      // On écoute l'événement click
    document.location.reload();                     // On recharge la page pour recommencer
});