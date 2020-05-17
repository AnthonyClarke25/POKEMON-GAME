var gameState = {
    userPokemon: '',
    rivalpokemon: '',
    pokemonDB: [{
            name: 'charmander',
            type: 'fire',
            hp: 39,
            attack: 52,
            defense: 43,
            level: 1,
            img: 'http://www.smogon.com/dex/media/sprites/xy/charmander.gif'
        },
        {
            name: 'bulbasaur',
            type: 'grass',
            hp: 45,
            attack: 49,
            defense: 49,
            level: 1,
            img: 'http://www.smogon.com/dex/media/sprites/xy/bulbasaur.gif'
        },
        {
            name: 'squirtle',
            type: 'water',
            hp: 44,
            attack: 48,
            defense: 65,
            level: 1,
            img: 'http://www.smogon.com/dex/media/sprites/xy/squirtle.gif'
        }
    ],
    elements: {
        pokemonsEl: document.querySelector('.select-screen').querySelectorAll('.character'),
        battleScreenEl: document.getElementById('battle-screen'),
        attackBtnsEl: document.getElementById('battle-screen').querySelectorAll('.attack'),
        selectsSreenEl: document.querySelector('select-screen'),
        winnerModalEL: document.getElementById('winnerModal'),
        battleMessageEl: document.querySelector('battle-message')

    },
    init: function () {
        var i = 0;
        while (i < gameState.elements.pokemonsEl.length) {
            // add function to all characters on screen select
            gameState.elements.pokemonsEl[i].onclick = function () {
                //current select pokemon name
                var pokemonName = this.dataset.pokemon
                //elements for images on battle screen
                var player1Img = document.querySelector('.player1').getElementsByTagName('img')
                var player2Img = document.querySelector('.player2').getElementsByTagName('img')
                var player1Name = document.querySelector('.player1 .stats .name')
                var player2Name = document.querySelector('.player2 .stats .name')
                var userCurrentHP = document.querySelector('.player1 .stats .health .current-number')
                var cpuCurrentHP = document.querySelector('.player2 .stats .health .current-number')


                // we save the current pokemon
                gameState.userPokemon = pokemonName
                // CPU picks a pokemon
                gameState.cpuPick()

                //chnage screen to battle scene
                gameState.elements.battleScreenEl.classList.toggle('active')


                //select data from current user pokemon
                gameState.currentPokemon = gameState.pokemonDB.filter(function (pokemon) {

                    return pokemon.name == gameState.userPokemon
                })

                //select data from current cpu pokemon
                gameState.currentRivalPokemon = gameState.pokemonDB.filter(function (pokemon) {

                    return pokemon.name == gameState.rivalpokemon
                })

                //getting the corret images and names for each pokemon
                player1Img[0].src = gameState.currentPokemon[0].img
                player2Img[0].src = gameState.currentRivalPokemon[0].img
                player1Name.innerHTML = gameState.currentPokemon[0].name
                player2Name.innerHTML = gameState.currentRivalPokemon[0].name
                gameState.currentPokemon[0].health = gameState.calculateIntialHealth(gameState.currentPokemon)
                gameState.currentPokemon[0].originalhealth = gameState.calculateIntialHealth(gameState.currentPokemon)
                gameState.currentRivalPokemon[0].health = gameState.calculateIntialHealth(gameState.currentRivalPokemon)
                gameState.currentRivalPokemon[0].originalhealth = gameState.calculateIntialHealth(gameState.currentRivalPokemon)

                cpuCurrentHP.innerHTML = gameState.currentRivalPokemon[0].originalhealth.toFixed(0)
                userCurrentHP.innerHTML = gameState.currentPokemon[0].originalhealth.toFixed(0)

            }
            i++
        }

        var a = 0;
        while (a < gameState.elements.attackBtnsEl.length) {
            gameState.elements.attackBtnsEl[a].onclick = function () {
                var attackName = this.dataset.attack
                gameState.currentUserAttack = attackName
                gameState.currentRivalAttack = gameState.cpuAttack()
                gameState.play(gameState.currentUserAttack, gameState.currentRivalAttack)
            }
            a++
        }
    },
    cpuAttack: function () {
        var attacks = ['rock', 'paper', 'scissors']

        return attacks[gameState.randomNumber(0, 3)]
    },

    calculateIntialHealth: function (user) {

        return ((0.20 * Math.sqrt(user[0].level)) * user[0].defense) * user[0].hp
    },

    attackMove: function (attack, level, stack, critical, enemy, attacker) {
        console.log('Enemy ' + enemy.name + ' before: ' + enemy.health)
        var attackAmount = ((attack * level) * ((stack + critical))).toFixed(0)
        enemy.health = enemy.health - attackAmount

        var userHP = document.querySelector('.player1').querySelector('.stats').querySelector('.health').querySelector('.health-bar').querySelector('.inside');
        var cpuHP = document.querySelector('.player2').querySelector('.stats').querySelector('.health').querySelector('.health-bar').querySelector('.inside');
        var userCurrentHP = document.querySelector('.player1 .stats .health .current-number')
        var cpuCurrentHP = document.querySelector('.player2 .stats .health .current-number')
        var player1battlemessage = document.querySelector('.battle-message .player1')
        var player2battlemessage = document.querySelector('.battle-message .player2')
        var minusPercent

        if (enemy.owner == 'user') {
            minusPercent = ((enemy.health * 100) / enemy.originalhealth).toFixed(0);
            userHP.style.width = ((minusPercent < 0) ? 0 : minusPercent) + '%'
            userCurrentHP.innerHTML = ((enemy.health < 0) ? 0 : enemy.health.toFixed(0));
            player2battlemessage.innerHTML = "The CPU's " + attacker.name + " has done " + attackAmount + " damage with its " + gameState.currentRivalAttack + " attack";

        } else {
            minusPercent = ((enemy.health * 100) / enemy.originalhealth).toFixed(0);
            cpuHP.style.width = ((minusPercent < 0) ? 0 : minusPercent) + '%';
            cpuCurrentHP.innerHTML = ((enemy.health < 0) ? 0 : enemy.health.toFixed(0));
            player1battlemessage.innerHTML = "your " + attacker.name + " has done " + attackAmount + " damage with its " + gameState.currentUserAttack + " attack";

        }
        gameState.checkWinner(enemy, attacker)

    },

    checkWinner: function (enemy, attacker) {
        if (enemy.health <= 0) {


            var span = document.getElementsByClassName("close")[0];

            gameState.elements.winnerModalEL.style.display = "block";

            var winning
            if (attacker.owner == 'user') {
                winning = "Congratulations your " + attacker.name + " has won the battle!"
            } else {
                winning = "Better luck next time, the CPU's  " + attacker.name + " has won the battle!"
            }

            document.getElementById("winning-message").innerText = winning

            //   span.
            span.onclick = function () {
                gameState.elements.winnerModalEL.style.display = "none";
            }

        }
    },

    randomNumber: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    cpuPick: function () {

        do {
            gameState.rivalpokemon = gameState.elements.pokemonsEl[gameState.randomNumber(0, 3)].dataset.pokemon
        }
        while (gameState.userPokemon == gameState.rivalpokemon)
    },

    play: function (userattack, cpuAttack) {
        var currentPokemon = gameState.currentPokemon[0]
        var currentRivalPokemon = gameState.currentRivalPokemon[0]
        currentPokemon.owner = 'user'
        currentRivalPokemon.owner = 'cpu'
        switch (userattack) {

            case 'rock':

                if (cpuAttack == 'paper') {
                    if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {

                        gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, .5, currentRivalPokemon, currentPokemon)


                        if (currentRivalPokemon.health >= 1) {
                            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 2, currentPokemon, currentRivalPokemon)
                        }
                    }
                }
                if (cpuAttack == 'scissors') {
                    if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
                        //user
                        gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 2, currentRivalPokemon, currentPokemon)
                        //cpu

                        if (currentRivalPokemon.health >= 1) {
                            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, .5, currentPokemon, currentRivalPokemon)
                        }
                    }
                }
                if (cpuAttack == 'rock') {
                    if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
                        //user 
                        gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 1, currentRivalPokemon, currentPokemon)
                        //cpu

                        if (currentRivalPokemon.health >= 1) {
                            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 1, currentPokemon, currentRivalPokemon)
                        }
                    }
                }
                break;
            case 'paper':
                if (cpuAttack == 'paper') {
                    if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
                        //user 
                        gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 1, currentRivalPokemon, currentPokemon)
                        //cpu

                        if (currentRivalPokemon.health >= 1) {
                            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 1, currentPokemon, currentRivalPokemon)
                        }

                    }
                }
                if (cpuAttack == 'scissors') {
                    if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
                        //user
                        gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, .5, currentRivalPokemon, currentPokemon)
                        //cpu

                        if (currentRivalPokemon.health >= 1) {
                            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 2, currentPokemon, currentRivalPokemon)
                        }
                    }
                }
                if (cpuAttack == 'rock') {
                    if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
                        //user
                        gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 2, currentRivalPokemon, currentPokemon)
                        //cpu

                        if (currentRivalPokemon.health >= 1) {
                            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, .5, currentPokemon, currentRivalPokemon)
                        }
                    }
                }

                break;
            case 'scissors':
                if (cpuAttack == 'paper') {
                    if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
                        //user
                        gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 2, currentRivalPokemon, currentPokemon)
                        //cpu

                        if (currentRivalPokemon.health >= 1) {
                            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, .5, currentPokemon, currentRivalPokemon)
                        }
                    }
                }
                if (cpuAttack == 'scissors') {
                    if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
                        //user 
                        gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 1, currentRivalPokemon, currentPokemon)
                        //cpu

                        if (currentRivalPokemon.health >= 1) {
                            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 1, currentPokemon, currentRivalPokemon)
                        }
                    }
                }
                if (cpuAttack == 'rock') {
                    if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
                        //user
                        gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, .5, currentRivalPokemon, currentPokemon)
                        //cpu

                        if (currentRivalPokemon.health >= 1) {
                            gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 2, currentPokemon, currentRivalPokemon)
                        }
                    }
                }

                break;
        }

    }
};

gameState.init();