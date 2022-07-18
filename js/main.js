"use strict"; // Mode strict du JavaScript

/***********************************************************************************/
/* ********************************* DONNEES CARROUSEL *****************************/
/***********************************************************************************/

// Codes des touches du clavier.
const TOUCHE_ESPACE = 32;
const TOUCHE_GAUCHE = 37;
const TOUCHE_DROITE = 39;

// La liste des slides du carrousel.
let slides = [
  { image: "images/1.jpg", legend: "Frères pandas" },
  { image: "images/2.jpg", legend: "Yoga on the top" },
  { image: "images/3.jpg", legend: "Lever de soleil" },
  { image: "images/4.jpg", legend: "Ciel étoilé" },
  { image: "images/5.jpg", legend: "Tea time" },
  { image: "images/6.jpg", legend: "Ca va péter le bide" },
];

// Objet contenant l'état du carrousel.
let state;

/***********************************************************************************/
/* ******************************** FONCTIONS CARROUSEL ****************************/
/***********************************************************************************/

function onSliderGoToNext() {
  // Passage à la slide suivante.
  state.index++;

  // Est-ce qu'on est arrivé à la fin de la liste des slides ?
  if (state.index == slides.length) {
    // Oui, on revient au début (le carrousel est circulaire).
    state.index = 0;
  }

  // Mise à jour de l'affichage.
  refreshSlider();
}

function onSliderGoToPrevious() {
  // Passage à la slide précédente.
  state.index--;

  // Est-ce qu'on est revenu au début de la liste des slides ?
  if (state.index < 0) {
    // Oui, on revient à la fin (le carrousel est circulaire).
    state.index = slides.length - 1;
  }

  // Mise à jour de l'affichage.
  refreshSlider();
}

function onSliderGoToRandom() {
  let index;

  do {
    /*
     * Récupération d'un numéro de slide aléatoire différent
     * du numéro de slide actuel.
     */
    index = getRandomInteger(0, slides.length - 1);
  } while (index == state.index);

  // Passage à une slide aléatoire.
  state.index = index;

  // Mise à jour de l'affichage.
  refreshSlider();
}

/*
 * Quand on créé un gestionnaire d'évènements, le navigateur appelle la
 * fonction en fournissant un argument event représentant l'évènement lui-même.
 *
 * Si le gestionnaire d'évènements n'a pas besoin de cet argument,
 * inutile de le déclarer !
 *
 * Mais ici on va en avoir besoin...
 */
function onSliderKeyUp(event) {
  console.log(event);
  /*
   * Les gestionnaires d'évènements d'appui sur une touche (évènements
   * keydown, keyup, keypress) contiennent une propriété keyCode dans l'objet
   * event représentant le code de la touche du clavier.
   *
   * Il existe de très nombreux codes, plus ou moins standards, voir la page :
   * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
   */

  switch (event.keyCode) {
    case TOUCHE_DROITE:
      // On passe à la slide suivante.
      onSliderGoToNext();
      break;

    case TOUCHE_ESPACE:
      // On démarre ou on arrête le carrousel.
      onSliderToggle();
      break;

    case TOUCHE_GAUCHE:
      // On passe à la slide précédente.
      onSliderGoToPrevious();
      break;
  }
}

function onSliderToggle() {
  let icon;

  // Modification de l'icône du bouton pour démarrer ou arrêter le carrousel.
  icon = $("#slider-toggle i");

  icon.toggleClass("fa-play");
  icon.toggleClass("fa-pause");

  // Est-ce que le carousel est démarré ?
  if (state.timer == null) {
    // Non, démarrage du carousel, toutes les deux secondes.
    state.timer = window.setInterval(onSliderGoToNext, 2000);

    /*
     * Modification du libellé du bouton en mode "OFF".
     *
     * La variable spéciale this est automatiquement initialisée par le
     * navigateur avec l'objet DOM qui a déclenché l'évènement.
     *
     * C'est le bouton "Démarrer/Arrêter le carrousel" qui a déclenché
     * l'évènement, donc la variable spéciale this vaut la même chose
     * que l'objet renvoyé par $('#slider-toggle');
     */
    this.title = "Arrêter le carrousel";
  } else {
    // Oui, arrêt du carousel.
    window.clearInterval(state.timer);

    // Réinitialisation de la propriété pour le prochain clic sur le bouton.
    state.timer = null;

    /*
     * Modification du libellé du bouton en mode "ON".
     *
     * La variable spéciale this est automatiquement initialisée par le
     * navigateur avec l'objet DOM qui a déclenché l'évènement.
     *
     * C'est le bouton "Démarrer/Arrêter le carrousel" qui a déclenché
     * l'évènement, donc la variable spéciale this vaut la même chose
     * que l'objet renvoyé par $('#slider-toggle');
     */
    this.title = "Démarrer le carrousel";
  }
}

function onToolbarToggle() {
  let icon;

  // Modification de l'icône du lien pour afficher ou cacher la barre d'outils.
  icon = $("#toolbar-toggle i");

  icon.toggleClass("fa-arrow-down");
  icon.toggleClass("fa-arrow-right");

  // Affiche ou cache la barre d'outils.
  $(".toolbar ul").toggleClass("hide");
}

function refreshSlider() {
  let sliderImage;
  let sliderLegend;

  // Recherche des balises de contenu du carrousel.
  sliderImage = $("#slider img");
  sliderLegend = $("#slider figcaption");

  // Changement de la source de l'image et du texte de la légende du carrousel.
  sliderImage.attr("src", slides[state.index].image);
  sliderLegend.text(slides[state.index].legend);
}

/***********************************************************************************/
/* ******************************** CODE PRINCIPAL *********************************/
/***********************************************************************************/

/*
 * Installation d'un gestionnaire d'évènement déclenché quand l'arbre DOM sera
 * totalement construit par le navigateur.
 *
 * Le gestionnaire d'évènement est une fonction anonyme que l'on donne en deuxième
 * argument directement à document.ready().
 */
$(document).ready(function () {
  // Initialisation du carrousel.
  state = {};
  state.index = 0; // On commence à la première slide
  state.timer = null; // Le carrousel est arrêté au démarrage

  // Installation des gestionnaires d'évènement.
  $("#slider-random").on("click", onSliderGoToRandom);
  $("#slider-previous").on("click", onSliderGoToPrevious);
  $("#slider-next").on("click", onSliderGoToNext);
  $("#slider-toggle").on("click", onSliderToggle);
  $("#toolbar-toggle").on("click", onToolbarToggle);

  /*
   * L'évènement d'appui sur une touche doit être installé sur l'ensemble de la
   * page, on ne recherche pas une balise en particulier dans l'arbre DOM.
   *
   * L'ensemble de la page c'est la balise <html> et donc la variable document.
   */
  $(document).on("keyup", onSliderKeyUp);
  // Equivalent à installEventHandler('html', 'keyup', onSliderKeyUp);

  // Affichage initial.
  refreshSlider();
});
