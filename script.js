const piles = document.querySelectorAll('.pile');
const rougeButton = document.getElementById('rouge');
const noirButton = document.getElementById('noir');
const plusButton = document.getElementById('plus');
const moinsButton = document.getElementById('moins');
const egalButton = document.getElementById('egal');
const gorgeesElement = document.getElementById('gorgees');
const poteauxElement = document.getElementById('poteaux');
const remainingCardsElement = document.getElementById('remaining-cards');
const cardHistoryElement = document.getElementById('card-history');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const closePopupButton = document.getElementById('close-popup');

let deck = [];
let currentPile = 0;
let gorgees = 0;
let errors = 0;
let poteaux = 0;
let cardHistory = [];

const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

const cardImages = {
    '♥': 'heart',
    '♦': 'diamond',
    '♣': 'club',
    '♠': 'spade'
};

// Créer et mélanger le jeu de cartes
function createDeck() {
    const suits = ['♥', '♦', '♣', '♠'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    shuffleDeck();
    updateCardCount();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Distribuer les cartes
function dealCards() {
    for (let pile of piles) {
        pile.dataset.card = '';
        pile.innerHTML = ''; // Masquer la carte initialement
        pile.classList.remove('revealed');
        pile.classList.remove('active');
    }
    updateCardCount();
    updateActivePile();
    updateButtonVisibility();
}

// Afficher la carte
function showCard(pile, card) {
    pile.dataset.card = JSON.stringify(card);
    const img = document.createElement('img');
    img.src = `images/cards/${card.value}_${cardImages[card.suit]}.png`;
    img.alt = `${card.value}${card.suit}`;
    pile.innerHTML = '';
    pile.appendChild(img);
    pile.classList.add('revealed');
    cardHistory.push(card);
    updateCardHistory();
}

// Vérifier la devinette
function checkGuess(guess) {
    const card = deck.pop();
    const currentPileCard = piles[currentPile].dataset.card ? JSON.parse(piles[currentPile].dataset.card) : null;

    if (!currentPileCard) {
        // Si la pile est vide, vérifier la couleur
        if ((guess === 'rouge' && (card.suit === '♥' || card.suit === '♦')) ||
            (guess === 'noir' && (card.suit === '♣' || card.suit === '♠'))) {
            showCard(piles[currentPile], card);
            currentPile++;
            if (currentPile === 5) {
                showWinPopup();
            }
        } else {
            showCard(piles[currentPile], card); // Afficher la carte lorsque le joueur se trompe
            gorgees += currentPile + 1;
            errors++;
            gorgeesElement.textContent = gorgees;
            currentPile = 0;
        }
    } else {
        // Si la pile contient une carte, vérifier la valeur
        const currentValue = cardValues[currentPileCard.value];
        const newValue = cardValues[card.value];
        if ((guess === 'plus' && newValue > currentValue) ||
            (guess === 'moins' && newValue < currentValue) ||
            (guess === 'egal' && newValue === currentValue)) {
            showCard(piles[currentPile], card);
            currentPile++;
            if (currentPile === 5) {
                showWinPopup();
            }
        } else {
            showCard(piles[currentPile], card); // Afficher la carte lorsque le joueur se trompe
            if (newValue === currentValue) {
                poteaux++;
                poteauxElement.textContent = poteaux;
                gorgees += 2 * (currentPile + 1);
            } else {
                gorgees += currentPile + 1;
            }
            errors++;
            gorgeesElement.textContent = gorgees;
            currentPile = 0;
        }
    }
    updateCardCount();
    updateActivePile();
    updateButtonVisibility();
}

// Réinitialiser le jeu
function resetGame() {
    currentPile = 0;
    gorgees = 0;
    errors = 0;
    poteaux = 0;
    gorgeesElement.textContent = gorgees;
    poteauxElement.textContent = poteaux;
    cardHistory = [];
    createDeck();
    dealCards();
    updateCardHistory();
    updateActivePile();
    updateButtonVisibility();
}

// Mettre à jour le compteur de cartes restantes
function updateCardCount() {
    remainingCardsElement.textContent = deck.length;
}

// Mettre à jour la pile active
function updateActivePile() {
    piles.forEach((pile, index) => {
        if (index === currentPile) {
            pile.classList.add('active');
        } else {
            pile.classList.remove('active');
        }
    });
}

// Mettre à jour l'historique des cartes
function updateCardHistory() {
    cardHistoryElement.innerHTML = '';
    cardHistory.forEach((card, index) => {
        const li = document.createElement('li');
        li.textContent = `Carte ${index + 1}: ${card.value}${card.suit}`;
        cardHistoryElement.appendChild(li);
    });
}

function saveResultsToCSV() {
    // Récupérer les valeurs des scores
    let gorgees = document.getElementById('gorgees').innerText;
    let poteaux = document.getElementById('poteaux').innerText;
    let remainingCards = document.getElementById('remaining-cards').innerText;

    // Définir les données au format CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Gorgées,Poteaux,Cartes restantes\n"; // En-tête du fichier
    csvContent += `${gorgees},${poteaux},${remainingCards}\n`; // Données du jeu

    // Créer un élément <a> pour le téléchargement
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "resultats_jeu_autobus.csv");
    document.body.appendChild(link);

    // Déclencher le téléchargement
    link.click();
    document.body.removeChild(link);
}

// Afficher la popup de victoire
function showWinPopup() {
    popupMessage.textContent = `Bravo ! Vous êtes sortie de l'autobus ! Gorgées à boire : ${gorgees}, Erreurs : ${errors}, Poteaux : ${poteaux}`;
    popup.style.display = 'flex';
	//saveResultsToCSV(); ME CONVIENT PAS !
}

// Fermer la popup et réinitialiser le jeu
closePopupButton.addEventListener('click', () => {
    popup.style.display = 'none';
    resetGame();
});

// Mettre à jour la visibilité des boutons
function updateButtonVisibility() {
    const currentPileCard = piles[currentPile].dataset.card ? JSON.parse(piles[currentPile].dataset.card) : null;
    if (currentPileCard) {
        rougeButton.style.display = 'none';
        noirButton.style.display = 'none';
        plusButton.style.display = 'inline';
        moinsButton.style.display = 'inline';
        egalButton.style.display = 'inline';
    } else {
        rougeButton.style.display = 'inline';
        noirButton.style.display = 'inline';
        plusButton.style.display = 'none';
        moinsButton.style.display = 'none';
        egalButton.style.display = 'none';
    }
}

// Événements
rougeButton.addEventListener('click', () => checkGuess('rouge'));
noirButton.addEventListener('click', () => checkGuess('noir'));
plusButton.addEventListener('click', () => checkGuess('plus'));
moinsButton.addEventListener('click', () => checkGuess('moins'));
egalButton.addEventListener('click', () => checkGuess('egal'));


// Initialisation
createDeck();
dealCards();


