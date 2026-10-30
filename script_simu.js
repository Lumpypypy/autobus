document.addEventListener('DOMContentLoaded', () => {
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
        let deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        shuffleDeck(deck);
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    // Simuler une partie avec une stratégie basée sur les probabilités
    function simulateProbabilisticGame(deck) {
        let currentPile = 0;
        let gorgées = 0;
        let poteaux = 0;
        let moves = 0;
        let errors = 0;

        while (currentPile < 5 && deck.length > 0) {
            const card = deck.pop();
            const currentPileCard = currentPile > 0 ? deck[currentPile - 1] : null;
            moves++;

            if (!currentPileCard) {
                // Si la pile est vide, deviner la couleur basée sur les probabilités
                const redCards = deck.filter(c => c.suit === '♥' || c.suit === '♦').length;
                const blackCards = deck.filter(c => c.suit === '♣' || c.suit === '♠').length;
                const guessColor = blackCards >= redCards ? 'noir' : 'rouge';

                if ((guessColor === 'rouge' && (card.suit === '♥' || card.suit === '♦')) ||
                    (guessColor === 'noir' && (card.suit === '♣' || card.suit === '♠'))) {
                    currentPile++;
                } else {
                    gorgées += currentPile + 1;
                    errors++;
                    currentPile = 0;
                }
            } else {
                // Si la pile contient une carte, deviner la valeur basée sur les probabilités
                const currentValue = cardValues[currentPileCard.value];
                const newValue = cardValues[card.value];
                const higherCards = deck.filter(c => cardValues[c.value] > currentValue).length;
                const lowerCards = deck.filter(c => cardValues[c.value] < currentValue).length;
                let guessValue;

                if (higherCards >= lowerCards) {
                    guessValue = 'plus';
                } else {
                    guessValue = 'moins';
                }

                if ((guessValue === 'plus' && newValue > currentValue) ||
                    (guessValue === 'moins' && newValue < currentValue)) {
                    currentPile++;
                } else {
                    if (newValue === currentValue) {
                        poteaux++;
                        gorgées += 2 * (currentPile + 1);
                    } else {
                        gorgées += currentPile + 1;
                    }
                    errors++;
                    currentPile = 0;
                }
            }
        }

        return { gorgées, moves, errors, poteaux, remainingCards: deck.length };
    }

    // Simuler une partie avec des réponses aléatoires
    function simulateRandomGame(deck) {
        let currentPile = 0;
        let gorgées = 0;
        let poteaux = 0;
        let moves = 0;
        let errors = 0;

        while (currentPile < 5 && deck.length > 0) {
            const card = deck.pop();
            const currentPileCard = currentPile > 0 ? deck[currentPile - 1] : null;
            moves++;

            if (!currentPileCard) {
                // Si la pile est vide, deviner la couleur aléatoirement
                const guessColor = Math.random() < 0.5 ? 'rouge' : 'noir';
                if ((guessColor === 'rouge' && (card.suit === '♥' || card.suit === '♦')) ||
                    (guessColor === 'noir' && (card.suit === '♣' || card.suit === '♠'))) {
                    currentPile++;
                } else {
                    gorgées += currentPile + 1;
                    errors++;
                    currentPile = 0;
                }
            } else {
                // Si la pile contient une carte, deviner la valeur aléatoirement
                const currentValue = cardValues[currentPileCard.value];
                const newValue = cardValues[card.value];
                const guessValue = Math.random() < 0.5 ? 'plus' : 'moins';

                if ((guessValue === 'plus' && newValue > currentValue) ||
                    (guessValue === 'moins' && newValue < currentValue)) {
                    currentPile++;
                } else {
                    if (newValue === currentValue) {
                        poteaux++;
                        gorgées += 2 * (currentPile + 1);
                    } else {
                        gorgées += currentPile + 1;
                    }
                    errors++;
                    currentPile = 0;
                }
            }
        }

        return { gorgées, moves, errors, poteaux, remainingCards: deck.length };
    }

    // Simuler une partie avec une stratégie "joueur"
    function simulatePlayerGame(deck) {
        let currentPile = 0;
        let gorgées = 0;
        let poteaux = 0;
        let moves = 0;
        let errors = 0;

        while (currentPile < 5 && deck.length > 0) {
            const card = deck.pop();
            const currentPileCard = currentPile > 0 ? deck[currentPile - 1] : null;
            moves++;

            if (!currentPileCard) {
                // Si la pile est vide, deviner la couleur aléatoirement
                const guessColor = Math.random() < 0.5 ? 'rouge' : 'noir';
                if ((guessColor === 'rouge' && (card.suit === '♥' || card.suit === '♦')) ||
                    (guessColor === 'noir' && (card.suit === '♣' || card.suit === '♠'))) {
                    currentPile++;
                } else {
                    gorgées += currentPile + 1;
                    errors++;
                    currentPile = 0;
                }
            } else {
                // Si la pile contient une carte, deviner la valeur basée sur la valeur de la carte visible
                const currentValue = cardValues[currentPileCard.value];
                const newValue = cardValues[card.value];
                const guessValue = currentValue < 8 ? 'plus' : currentValue > 8 ? 'moins' : (Math.random() < 0.5 ? 'plus' : 'moins');


                if ((guessValue === 'plus' && newValue > currentValue) ||
                    (guessValue === 'moins' && newValue < currentValue)) {
                    currentPile++;
                } else {
                    if (newValue === currentValue) {
                        poteaux++;
                        gorgées += 2 * (currentPile + 1);
                    } else {
                        gorgées += currentPile + 1;
                    }
                    errors++;
                    currentPile = 0;
                }
            }
        }

        return { gorgées, moves, errors, poteaux, remainingCards: deck.length };
    }

    // Simuler plusieurs parties avec la stratégie choisie
    function simulateGames(numGames, simulationType) {
        const results = [];
        for (let i = 0; i < numGames; i++) {
            let deck = createDeck();
            let result;
            if (simulationType === 'probabilistic') {
                result = simulateProbabilisticGame(deck);
                result.type = 'Probabiliste';
            } else if (simulationType === 'player') {
                result = simulatePlayerGame(deck);
                result.type = 'Joueur';
            } else if (simulationType === 'comparative') {
                const probabilisticResult = simulateProbabilisticGame([...deck]);
                const randomResult = simulateRandomGame([...deck]);
                const playerResult = simulatePlayerGame([...deck]);
                probabilisticResult.type = 'Probabiliste';
                randomResult.type = 'Aléatoire';
                playerResult.type = 'Joueur';
                result = [probabilisticResult, randomResult, playerResult];
            } else {
                result = simulateRandomGame(deck);
                result.type = 'Aléatoire';
            }
            results.push(result);
        }
        return results;
    }

    // Afficher les résultats dans le tableau
    function displayResults(results) {
        const resultsTable = document.getElementById('resultsTable').querySelector('tbody');
        resultsTable.innerHTML = '';

        results.forEach((result, index) => {
            if (Array.isArray(result)) {
                result.forEach(res => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${res.type}</td>
                        <td>${res.gorgées}</td>
                        <td>${res.moves}</td>
                        <td>${res.errors}</td>
                        <td>${res.poteaux}</td>
                        <td>${res.remainingCards}</td>
                    `;
                    resultsTable.appendChild(row);
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${result.type}</td>
                    <td>${result.gorgées}</td>
                    <td>${result.moves}</td>
                    <td>${result.errors}</td>
                    <td>${result.poteaux}</td>
                    <td>${result.remainingCards}</td>
                `;
                resultsTable.appendChild(row);
            }
        });

        // Calculer les moyennes
        const totalGorgéesProbabilistic = results.reduce((sum, result) => {
            if (Array.isArray(result)) {
                return sum + result.find(res => res.type === 'Probabiliste').gorgées;
            }
            return sum + (result.type === 'Probabiliste' ? result.gorgées : 0);
        }, 0);
        const totalGorgéesRandom = results.reduce((sum, result) => {
            if (Array.isArray(result)) {
                return sum + result.find(res => res.type === 'Aléatoire').gorgées;
            }
            return sum + (result.type === 'Aléatoire' ? result.gorgées : 0);
        }, 0);
        const totalGorgéesPlayer = results.reduce((sum, result) => {
            if (Array.isArray(result)) {
                return sum + result.find(res => res.type === 'Joueur').gorgées;
            }
            return sum + (result.type === 'Joueur' ? result.gorgées : 0);
        }, 0);

        const totalMovesProbabilistic = results.reduce((sum, result) => {
            if (Array.isArray(result)) {
                return sum + result.find(res => res.type === 'Probabiliste').moves;
            }
            return sum + (result.type === 'Probabiliste' ? result.moves : 0);
        }, 0);
        const totalMovesRandom = results.reduce((sum, result) => {
            if (Array.isArray(result)) {
                return sum + result.find(res => res.type === 'Aléatoire').moves;
            }
            return sum + (result.type === 'Aléatoire' ? result.moves : 0);
        }, 0);
        const totalMovesPlayer = results.reduce((sum, result) => {
            if (Array.isArray(result)) {
                return sum + result.find(res => res.type === 'Joueur').moves;
            }
            return sum + (result.type === 'Joueur' ? result.moves : 0);
        }, 0);

        const totalErrorsProbabilistic = results.reduce((sum, result) => {
            if (Array.isArray(result)) {
                return sum + result.find(res => res.type === 'Probabiliste').errors;
            }
            return sum + (result.type === 'Probabiliste' ? result.errors : 0);
        }, 0);
        const totalErrorsRandom = results.reduce((sum, result) => {
            if (Array.isArray(result)) {
                return sum + result.find(res => res.type === 'Aléatoire').errors;
            }
            return sum + (result.type === 'Aléatoire' ? result.errors : 0);
        }, 0);
        const totalErrorsPlayer = results.reduce((sum, result) => {
            if (Array.isArray(result)) {
                return sum + result.find(res => res.type === 'Joueur').errors;
            }
            return sum + (result.type === 'Joueur' ? result.errors : 0);
        }, 0);

        const totalPoteauxProbabilistic = results.reduce((sum, result) => {
            if (Array.isArray(result)) {
                return sum + result.find(res => res.type === 'Probabiliste').poteaux;
            }
            return sum + (result.type === 'Probabiliste' ? result.poteaux : 0);
        }, 0);
        const totalPoteauxRandom = results.reduce((sum, result) => {
            if (Array.isArray(result)) {
                return sum + result.find(res => res.type === 'Aléatoire').poteaux;
            }
            return sum + (result.type === 'Aléatoire' ? result.poteaux : 0);
        }, 0);
        const totalPoteauxPlayer = results.reduce((sum, result) => {
            if (Array.isArray(result)) {
                return sum + result.find(res => res.type === 'Joueur').poteaux;
            }
            return sum + (result.type === 'Joueur' ? result.poteaux : 0);
        }, 0);

        const avgGorgéesProbabilistic = totalGorgéesProbabilistic / results.length;
        const avgGorgéesRandom = totalGorgéesRandom / results.length;
        const avgGorgéesPlayer = totalGorgéesPlayer / results.length;

        const avgMovesProbabilistic = totalMovesProbabilistic / results.length;
        const avgMovesRandom = totalMovesRandom / results.length;
        const avgMovesPlayer = totalMovesPlayer / results.length;

        const avgErrorsProbabilistic = totalErrorsProbabilistic / results.length;
        const avgErrorsRandom = totalErrorsRandom / results.length;
        const avgErrorsPlayer = totalErrorsPlayer / results.length;

        const avgPoteauxProbabilistic = totalPoteauxProbabilistic / results.length;
        const avgPoteauxRandom = totalPoteauxRandom / results.length;
        const avgPoteauxPlayer = totalPoteauxPlayer / results.length;

        document.getElementById('avgGorgeesProbabilistic').textContent = avgGorgéesProbabilistic.toFixed(2);
        document.getElementById('avgGorgeesRandom').textContent = avgGorgéesRandom.toFixed(2);
        document.getElementById('avgGorgeesPlayer').textContent = avgGorgéesPlayer.toFixed(2);

        document.getElementById('avgMovesProbabilistic').textContent = avgMovesProbabilistic.toFixed(2);
        document.getElementById('avgMovesRandom').textContent = avgMovesRandom.toFixed(2);
        document.getElementById('avgMovesPlayer').textContent = avgMovesPlayer.toFixed(2);

        document.getElementById('avgErrorsProbabilistic').textContent = avgErrorsProbabilistic.toFixed(2);
        document.getElementById('avgErrorsRandom').textContent = avgErrorsRandom.toFixed(2);
        document.getElementById('avgErrorsPlayer').textContent = avgErrorsPlayer.toFixed(2);

        document.getElementById('avgPoteauxProbabilistic').textContent = avgPoteauxProbabilistic.toFixed(2);
        document.getElementById('avgPoteauxRandom').textContent = avgPoteauxRandom.toFixed(2);
        document.getElementById('avgPoteauxPlayer').textContent = avgPoteauxPlayer.toFixed(2);
    }

    // Événement pour lancer la simulation
    document.getElementById('startSimulation').addEventListener('click', () => {
        const numGames = parseInt(document.getElementById('numGames').value, 10);
        const simulationType = document.getElementById('simulationType').value;
        if (isNaN(numGames) || numGames < 1) {
            alert('Veuillez entrer un nombre valide de parties à simuler.');
            return;
        }
        const results = simulateGames(numGames, simulationType);
        displayResults(results);
    });
});
