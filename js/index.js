/*jshint esversion: 6 */
/*
 * Create a list that holds all of your cards
 */

let deckOfCards = ['bicycle', 'leaf', 'cube', 'anchor',
'paper-plane-o',  'bolt', 'bomb', 'diamond',
 ];

let doubleDeck = deckOfCards.concat(deckOfCards);

// declaring variables needed for use
let	open = [];
let	match = 0;
let	moves = 0;
let	$deck = $('.deck');
let	$scorePanel = $('#score-panel');
let	$numOfMoves = $('.moves');
let	$starRating = $('.fa-star');
let	$restart = $('.restart');
let	delay = 400;
let currentTimer;
let second = 0;
let $clock = $('.clock');

/*
	 * Display the cards on the page
	 *   - shuffle the list of cards using the provided "shuffle" method below
	 *   - loop through each card and create its HTML
	 *   - add each card's HTML to the page
*/

	 colorChange();
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Star of game
function startGame() {
  let cards = shuffle(doubleDeck);
  $deck.empty();
  match = 0;
  moves = 0;
  $numOfMoves.text('0');
  $starRating.removeClass('fa-star-o').addClass('fa-star');
  cards.forEach(function (moreCards) {
    $deck.append($('<li class="card"><i class="fa fa-' + moreCards + '"></i></li>'));
  });

  cardEvent();
  resetTimer(currentTimer);
  second = 0;
  $clock.text(`${second}`);
  initTime();
}

// Set Rating and final Score
function setRating(moves) {
	let rating = 3;
	if (moves > 10 && moves < 16) {
		$starRating.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (moves > 16 && moves < 20) {
		$starRating.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (moves > 20) {
		$starRating.eq(0).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	}
	return { score: rating };
}

// End Game
function endGame(NumofMoves, YourScore) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Nice job, you win!',
		text: `You ended with ${NumofMoves} moves and ${YourScore} stars in ${second} seconds, NICE!`,
		type: 'success',
		confirmButtonColor: '#4286f4',
		confirmButtonText: 'Another go?'
	}).then(function (isConfirm) {
		if (isConfirm) {
			startGame();
		}
	});
}


// Restart Game
$restart.bind('click', function () {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'You sure you want to restart?',
		text: "Performing this will restart the game!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#02ccba',
		cancelButtonColor: '#f44242',
		confirmButtonText: `Yes, I'm sure`,
	}).then(function (isConfirm) {
		if (isConfirm) {
			startGame();
		}
	});
});

let cardEvent = function () {

	// Turn card over functionality
	$deck.find('.card').bind('click', function () {
		let $this = $(this);

		if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

		let card = $this.context.innerHTML;
		$this.addClass('open show');
		open.push(card);

		// Compare both open cards
		if (open.length > 1) {
			if (card === open[0]) {
				$deck.find('.open').addClass('match animated infinite pulse');
				setTimeout(function () {
					$deck.find('.match').removeClass('open show animated infinite pulse');
				}, delay);
				match++;
			} else {
				$deck.find('.open').addClass('notmatch animated infinite jello');
				setTimeout(function () {
					$deck.find('.open').removeClass('animated infinite jello');
				}, delay);
				setTimeout(function () {
					$deck.find('.open').removeClass('open show notmatch animated infinite wobble');
				}, delay);
			}
			open = [];
			moves++;
			setRating(moves);
			$numOfMoves.html(moves);
		}

		// End Game if match all cards
		if (8 === match) {
			setRating(moves);
			let score = setRating(moves).score;
			setTimeout(function () {
				endGame(moves, score);
			}, 500);
		}
	});
};

function initTime() {
	currentTimer = setInterval(function () {
		$clock.text(`${second}`);
		second = second + 1;
	}, 1000);
}

function resetTimer(timer) {
	if (timer) {
		clearInterval(timer);
	}
}

// header color changing functionality
function colorChange(){
	let headerRandColor = document.querySelector('h1');
	let color = ["blue", "green", "yellow", "red"];
	setInterval(function() {
	   for(let y = 0; y < 4; y++){
	    headerRandColor.style.color = color[Math.floor(Math.random() * 3)];
	  }
	}, 300);
}
startGame();
