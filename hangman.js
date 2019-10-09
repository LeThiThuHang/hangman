/* to change the button color in the front page */
$('.level').click(function () {
    $('.level').each(function () {
        $(this).css('background', 'orange');

        if ($(this).hasClass('clicked')) {
            $(this).removeClass('clicked');
        }

        $(this).addClass('not-clicked');

    })

    $(this).css('background', 'green');
    $(this).removeClass('not-clicked')
    $(this).addClass('clicked')
})

$("#play_game_button").click(function () {
    reset_game();
    $("#game_setting").hide();
    $("#game_container").show();
    choose_level();

    generate_word();
    display_word();
    play_game();
})

$("#restart_game_button").click(function () {
    reset_game();

    $("#game_setting").show();
    $("#game_container").hide();
})

$("#refresh_game_button").click(function () {
    reset_game();

    generate_word();
    display_word();
    play_game();
})


/* get a word when player starts game
https://www.wordsapi.com/#try
https://developer.wordnik.com/docs#!/words/getRandomWord */

/* how to read a txt file to Javascript ??? */

let easy_word_list = ["apple", "sky", "pen", "house", "shame", "lame", "dumb", "fish", "chip", "cheap", "rich", "poor", "man", "female", "table", "mouse"] // 1-5 words
let medium_word_list = ["orange", "bottle", "banana", "shame", "absence", "stupid", "absorb", "fridge", "grape", "country", "turtle", "lipstick", "cosmetic"] // 6 to 8
let hard_word_list = ["absolutely", "academic", "television", "international", "justification"] // 9 to 13
let chosen_word = ''
let hidden_word = ''
let new_hidden_word = ''
let count = 0
let word_length = 5;


function reset_game() {
    count = 0;
    $('#count').html(`<h1>Guess it right in 10 guesses to not get burned ...<strong>${10 - count}</strong></h1>`);
    chosen_word = '';
    hidden_word = '';
    word_length = 5;

    $(".alphabet").each(function () {

        if ($(this).hasClass('inactive') == true) {
            $(this).css("background-color", "orange");
            $(this).removeClass('inactive')
            $(this).addClass('active')
        }
    })

    reset_image_draw();
    clear_initial_character();
    clearcanvas();
    burning_movement_clearance();

}

/*when users click on the level, get the min length varied from 5 , 8 and 13 for the API call
        default is 5 length*/

function choose_level() {

    $('.level').each(function () {
        if ($(this).hasClass('clicked')) {
            let id = this.id

            if (id == 'hard') {
                word_length = 13
            } else if (id == 'medium') {
                word_length = 7
            } else {
                word_length = 5
            }
        }
    })
    return word_length
}

/*after user choose level as easy, and click on play, generate a random word from the list easy*/
function generate_word() {

    word_length = choose_level();

    if (word_length == 5) {
        let random = Math.floor(Math.random() * easy_word_list.length) /*random between 0 and length*/
        chosen_word = easy_word_list[random].toLowerCase();
    } else if (word_length == 7) {
        let random = Math.floor(Math.random() * medium_word_list.length)
        chosen_word = medium_word_list[random].toLowerCase();
    } else {
        let random = Math.floor(Math.random() * hard_word_list.length)
        chosen_word = hard_word_list[random].toLowerCase();
    }
}


/* display the chosen word in the guess box  */
function display_word() {
    hidden_word = chosen_word.replace(/\w/g, '_');
    $("#chosen_word_display").text(hidden_word)
}

/*check results*/
function check_result(array) {
    if (array.includes('_') == false) {
        return true
    } else {
        return false
    }
}



/*when the button play is clicked, hidden the settting game page and display another page, choose the word*/
function play_game() {
    //draw the first image
    initial_character_image();

    new_hidden_word = [...hidden_word]

    $(".alphabet").on('click', game_play);

}

function game_play() {

    disabled = $(this).hasClass("active")

    if (count < 10) {

        $(this).css("background-color", "gray");
        $(this).removeClass("active");
        $(this).addClass("inactive");
        guess_letter = $(this).text().toLowerCase()


        if (disabled == true && chosen_word.includes(guess_letter) == false) {
            count++;

            $('#count').html(`<h1>Guess it right in 10 guesses to not get burned ...<strong>${10 - count}</strong></h1>`);

            //animation
            walking_movement();

        }

        for (i = 0; i < chosen_word.length; i++) {
            if (chosen_word[i] == guess_letter) {
                new_hidden_word[i] = guess_letter
            }
        }

        $("#chosen_word_display").text(new_hidden_word.join(''))

        if (check_result(new_hidden_word) == true) {
            $('#count').html(`<h1>.<strong>You have guessed it right! The right word is ${chosen_word}</strong></h1>`);
            new_hidden_word = '';
        }

    } else {

        if (check_result(new_hidden_word) == true) {
            $('#count').html(`<h1>.<strong>You have guessed it right bitch!. If you want, you still can burn yourself :)</strong></h1>`);
            new_hidden_word = '';
        } else {
            $('#count').html(`<h1>Sorry to see you die. The right word is ${chosen_word}</h1>`);
            //animation

            burning_movement();

        }


    }
}






//ANIMATION PART
//use this variable to clear the setInterval
let tID

/* position of canvas where we want to draw our sprite */
let canvasWidth = 1400;
let canvasHeight = 160;

//the position where the frame will be drawn
let x = 0;
let y = 0;

// to define from where in the canvas we will starting to draw the frame
let srcX;
let srcY;

//sprite image width and height
let spriteWidth = 1350;
let spriteHeight = 270;

//frame counts
let curFrame = 0;
let frameCount = 10;

let cols = 10;
let rows = 2;

//widht and height of each frame
let width = spriteWidth / cols;
let height = spriteHeight / rows;

//get the canvas element from HTML to draw an image
let canvas = document.getElementById('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
let ctx = canvas.getContext('2d'); //context to get the 2d drawing

//create an image
let character = new Image();
character.src = "photos/Megamanx running (5).png"

//create initial image on canvas
let initial_character = new Image();
initial_character.src = 'photos/standaloneman.png';

function reset_image_draw() {
    x = 0;
    y = 0;
    srcX = 0;
    srcY = 0;
    curFrame = 0;
}

function initial_character_image() {
    ctx.drawImage(initial_character, 0, 0, 270, 135);
}

function clear_initial_character() {
    ctx.clearRect(0, 0, 270, 135)
}

function clearcanvas() {
    ctx.clearRect(0, 0, 1350, 270)
}



//The 0th (first) row is for the walking movement
let burning = 0;
//1st (second) row for the falling movement (counting the index from 0)
let falling = 1;

let move_burning = false

/* function walking_movement() {
    clear_initial_character();
    move_burning = false;
    tID = setInterval(draw, 100);
    setTimeout(() => {
        clearInterval(tID)
    }, 1000);
} */

function walking_movement() {
   

    $(".alphabet").off('click', game_play);

    clear_initial_character();
    move_burning = false;
    tID = setInterval(draw, 100);
    setTimeout(() => {
        clearInterval(tID);
        $(".alphabet").on('click', game_play);
    }, 1500);
}


let time_setting;
let tID_burning;

function burning_movement() {

  

    move_burning = true;
    tID_burning = setInterval(draw, 100);
    time_setting = setTimeout(() => {
        clearInterval(tID_burning);
    }, 5000);
}

function burning_movement_clearance() {
  
    clearInterval(tID_burning)
}


function updateFrame() {

    curFrame = ++curFrame % cols; //update the frame count, currFrame %8 will rotate from 1 to 8
    //Calculating the x coordinate for spritesheet 
    srcX = curFrame * width;

    if (move_burning) {
        srcY = falling * height // for walking, scrY is 0, for falling, srcy is the hiehgt
    } else {
        x += 5;
        srcY = burning * height
    };
    ctx.clearRect(x, y, width, height);
}


function animate_stop() {
   
    tID = setInterval(draw, 100);
    setTimeout(() => {
        clearInterval(tID)
    }, 1000);
}


function draw() {
   
    updateFrame();
    ctx.drawImage(character, srcX, srcY, width, height, x, y, width, height);
}