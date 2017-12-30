/*
 * Create a list that holds all of your cards
 * Initialize variables 
 */

var cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb", "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
var timer = new Timer();
var moveCounter = 0;
var $deck = jQuery('.deck');
var $moves = $('.moves');
var $stars = $('.stars');
var rating = 0;
var openedCards = [];
var matchedCards = [];
var delayInMilliseconds = 500;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function flipCard() {

    //start timer once user clicks on a card
    timer.start();

    //prevents user from double clicking the card
    this.removeEventListener('click', flipCard);

    //get the id of the card that was just flipped 
    cardId = this.getAttribute('id');

    //show the card that the user clicked on 
    this.classList.add('open', 'show');

    //number of moves increases by 1 and updated move count is displayed 
    moveCounter += 1;
    $moves.html(moveCounter);

    //set star rating based on the number of moves taken 
    setStars(moveCounter);

    //add the card to opened cards array 
    openedCards.push(cards[cardId]);

    //if there are 2 opened cards, check if they match 
    if (openedCards.length == 2) { 
        cardMatch();
    }
};

function cardMatch() {

    //compare the 2 opened cards
    if (openedCards[0] == openedCards[1]) { 

        //console.log("Congrats, its a match!"); 

        //the matched cards are stored into matchedCards array 
        matchedCards.push(openedCards[0]); 
        matchedCards.push(openedCards[1]); 

        //added animation for matched cards
        $deck.find('.open').addClass('match animated shake');

        //clear openedCards array 
        openedCards = [];

    //cards do not match
    } else { 

        //add event listeners back to the cards since they were not matched
        var opened = $deck.find('.open');

        for (var i = 0; i < opened.length; i++) {
            opened[i].addEventListener('click', flipCard);
        }
        //console.log("Sorry, try again!");

        //timeout function from https://stackoverflow.com/questions/17883692/how-to-set-time-delay-in-javascript
        setTimeout(function() {
            //delay 0.5 seconds, added shake animation for incorrect matches
            $deck.find('.open').removeClass('open show');
        }, delayInMilliseconds);

        //clear openedCards array 
        openedCards = [];

    }
    //check if all cards are matched 
    checkWin();
}

function setStars(numberOfMoves) { 

    //set star rating to 2, if user takes more than 10 and less or equal to 20 moves
    if (numberOfMoves > 10 && numberOfMoves <= 20) { 
        $stars.find('i').eq(2).removeClass('fa fa-star').addClass('fa fa-star-o');
        rating = 2;

    //set star rating to 1, if user takes more than 20 moves
    } else if (numberOfMoves > 20) { 
        $stars.find('i').eq(1).removeClass('fa fa-star').addClass('fa fa-star-o');
        rating = 1;
    }
    return rating; 
}

function checkWin() { 
    //the user can only win when all cards are matched 
    if (matchedCards.length == cards.length) { 

        //console.log("Congratulations, all the cards are matched!"); 

        //pause timer
        timer.pause();

        //store paused time to variable 
        var stoppedTime = timer.getTimeValues().toString();

        //display result modal to user 
        result(stoppedTime);
    } else { 
        //console.log("Error. Not all the cards are matched.");
    }
}

//clear board 
function reset() {

    //clear resetModal messages 
    $('#resetModal').empty();

    //set resetModal message 
    var resetMessage = '<div class="modal-dialog" role="document">';
    resetMessage += '<div class="modal-content">';
    resetMessage += '<div class="modal-body">';
    resetMessage += '<p>Your game has been reset!</p>';
    resetMessage += '</div>';
    resetMessage += '<div class="modal-footer">';
    resetMessage += '<button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>';
    resetMessage += '</div>';
    resetMessage += '</div>';
    resetMessage += '</div>';

    $('#resetModal').append(resetMessage);
    $('#resetModal').modal('show');

    timer.stop();
    //reset timer
    $('#timer').html("00:00:00");
    //reset move counter 
    moveCounter = 0;
    //reset openedCards array 
    openedCards = [];
    //reset matchedCards
    matchedCards = [];
    //reset move counter display 
    $moves.html(moveCounter);
    //reset star rating 
    $stars.find('i').removeClass('fa fa-star-o').addClass('fa fa-star');
    //reshuffle cards and create game 
    start(cards);
}

function result(time) { 

    //clear scoreModal 
    $('#scoreModal').empty();

    //display time to win the game, star rating, and button to ask if user wants to play again 
    //if user selects to play again, 
    var scoreBoard = '<div class="modal-dialog" role="document">'; 
    scoreBoard += '<div class="modal-content">';
    scoreBoard += '<div class="modal-header">';
    scoreBoard += '<h4 class="modal-title" id="myModalLabel">Congratulations!</h4>';
    scoreBoard += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    scoreBoard += '</div>';
    scoreBoard += '<div class="modal-body">';
    scoreBoard += '<p>You have finished matching all the cards!</p>';
    scoreBoard += '<p>Total time taken: ' + time + '</p>';
    scoreBoard += '<p>Star rating is: ' + rating + '</p>';
    scoreBoard += '</div>';
    scoreBoard += '<div class="modal-footer">';
    scoreBoard += '<button type="button" class="btn btn-primary restart" data-dismiss="modal">Play again?</button>';
    scoreBoard += '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
    scoreBoard += '</div>';
    scoreBoard += '</div>';
    scoreBoard += '</div>';

    $('#scoreModal').append(scoreBoard);
    $('#scoreModal').modal('show');
    $('.restart').click(reset);
}

function start(deck) {

    //shuffle the deck of cards 
    var deckOfCards = shuffle(deck);
    //move counter starts at 0
    $moves.html(moveCounter);

    $('.restart').click(reset);

    //build the game board for the cards
    $deck.empty(); 
    for (var i = 0; i < deckOfCards.length; i++) {

        var cardElement = document.createElement('li');
        var el = cardElement.innerHTML = '<i class="fa ' + deckOfCards[i] + '"></i>';

        cardElement.setAttribute('class', 'card');

        //add id number for reference 
        cardElement.setAttribute('id', i);

        //if card is selected, calls flipCard function 
        cardElement.addEventListener('click', flipCard, false);

        //append the cards to the board
        document.getElementById('deck').appendChild(cardElement);
    }
}

function play(deck) { 

    timer.addEventListener('secondsUpdated', function (e) {
        $('#timer').html(timer.getTimeValues().toString());
    });
    //create card game 
    start(deck);
}

//start the card game
play(cards);
