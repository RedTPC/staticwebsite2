console.log("we started");

let canvas;
let context;

let fpsInterval = 1000 / 30; // the denominator is frames-per-second
let now;
let then = Date.now();

let request_id;

let player = {
    x: 500,
    y: 320,
    size: 30,
    speed: 5
};

let asteroids = [];
let steroids = [];
let bullets = [];

let freezes = [];
let isFrozen = false;
let freezeEnd = Date.now();
let freezeLength = 5000

let bursts = [];
let isBurst = false;
let burstEnd = Date.now();
let burstLength = 5000

let score = 0;
let level = 1
let steroidsCollected = 0;
let stage = 1
let hearts = 3

let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;

let lastDirection = 'right'; // default! 

let levelText = "Level One"

let freezeText = "Test Freeze text"
let burstText = "Test Burst text"

let statusText = ""

let levels = [];


// PLAYER STATE IMAGES

let playerImageUp = new Image();
playerImageUp.src = 'static/player_still.png';

let playerImageDown = new Image();
playerImageDown.src = 'static/player_still_down.png';

let playerImageLeft = new Image();
playerImageLeft.src = 'static/player_still_left.png';

let playerImageRight = new Image();
playerImageRight.src = 'static/player_still_right.png';

let playerMovingImageUp = new Image();
playerMovingImageUp.src = 'static/player_moving.png';

let playerMovingImageDown = new Image();
playerMovingImageDown.src = 'static/player_moving_down.png';

let playerMovingImageLeft = new Image();
playerMovingImageLeft.src = 'static/player_moving_left.png';

let playerMovingImageRight = new Image();
playerMovingImageRight.src = 'static/player_moving_right.png';

let currentImage =  playerImageRight

// GAME OBJECT IMAES

let steroidImage = new Image();
steroidImage.src = 'static/steroid4.png';

let asteroidImageRed = new Image();
asteroidImageRed.src = 'static/asteroid2.jpg';

let asteroidImagePurple = new Image();
asteroidImagePurple.src = 'static/asteroid1.png';


let asteroidImageOrange = new Image();
asteroidImageOrange.src = 'static/asteroid3.jpg';


let heartImage = new Image();
heartImage.src = 'static/heart.jpg';

let freezeImage = new Image();
freezeImage.src = 'static/snowflake.png';

let burstImage = new Image();
burstImage.src = 'static/burst.png';

// this is too hard to implement I think

// let asteroidImage = new Image();
// asteroidImage.src = 'asteroid.png';

let level_one={ 
    start: false,
    complete: false

};

let level_two={ 
    start: false,
    complete: false

};

let level_three={ 
    start: false,
    complete: false

};


let level_four={ 
    start: false,
    complete: false

};


let level_five={ 
    start: false,
    complete: false

};

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    // PREVENTS BROWSER SCROLLING!
    window.addEventListener("keydown", function(e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    // ALL CREDIT TO "Zeta" on stack overflow - https://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser

    console.log("init called wow");
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");
    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);

    draw();
}

function draw() {
    // console.log("Drawing the canvas!!");

    request_id = window.requestAnimationFrame(draw);

    now = Date.now();
    let elapsed = now - then;

    if (elapsed <= fpsInterval) {
        return;
    }

    then = now - (elapsed % fpsInterval);

    // if (asteroids.length < 10) {
    //     generateAsteroidsAndSteroids();
    // }

    //FREEZE STUFF

    levelHandler(level_one, level_two, level_three);


    if (isFrozen && Date.now() > freezeEnd) {
        isFrozen = false;
        console.log("removed freeze effect")
    }

    // uses func to redraw objects instead of doing here anytime, purely organisational
    
    if (isFrozen != true) {
        updatePositions(asteroids);

    } else {
        console.log("freeze effect prevented movement!")

    }

    // BURST STUFF
    
    if (isBurst && Date.now() > burstEnd) {
        isBurst = false;
        console.log("removed burst effect")
    }

    // uses func to redraw objects instead of doing here anytime, purely organisational
    
    // if (isFrozen != true) {
    //     updatePositions(asteroids);

    // } else {
    //     console.log("freeze effect prevented movement!")
        
    // }


    

    updatePositions(steroids);
    updateBullets();

    context.clearRect(0, 0, canvas.width, canvas.height);

    freezeTextUpdater();
    burstTextUpdater();


    context.fillStyle = "yellow";
    // context.fillRect(player.x, player.y, player.size, player.size);
    // context.drawImage(playerImage, player.x, player.y, player.size, player.size);

    directionHandler();

    for (let a of asteroids) {
        // context.fillStyle = "red";
        // context.fillRect(a.x, a.y, a.size + 5, a.size + 5);
        // context.drawImage(asteroidImage, a.x, a.y, a.size, a.size);

        if (a.color === "red") {
            context.drawImage(asteroidImageRed, a.x, a.y, a.size, a.size);
        }

        if (a.color === "purple") {
            context.drawImage(asteroidImagePurple, a.x, a.y, a.size, a.size);
        }

        if (a.color === "orange") {
            context.drawImage(asteroidImageOrange, a.x, a.y, a.size, a.size);
        }


        // if (player.x + player.size === canvas.width) {
        //     stop("You win!");
        //     return;
        // }
        //for (let a of asteroids) {
            //if (player_collides(a)) {
                //stop("You lose!");
                //return;
            //}
        //}
    }

    //    console.log("Num strds:", steroids.length); // check for steroids test ing


    for (let s of steroids) {
        context.fillStyle = "cyan"; //fillstyle always before fillrect
        // context.fillRect(a.x, a.y, a.size, a.size);
        context.drawImage(steroidImage, s.x, s.y, s.size, s.size);
    }

    for (let b of bullets) {
        context.fillStyle = "white";
        context.fillRect(b.x, b.y, b.size, b.size);
    }

    for (let f of freezes) {
        // context.fillStyle = "blue"; //fillstyle always before fillrect
        // context.fillRect(a.x, a.y, a.size, a.size);
        context.drawImage(freezeImage, f.x, f.y, f.size, f.size);
    }

    for (let f of bursts) {
        // context.fillStyle = "blue"; //fillstyle always before fillrect
        // context.fillRect(a.x, a.y, a.size, a.size);
        context.drawImage(burstImage, f.x, f.y, f.size, f.size);
    }


    // DEALING WITH COLLISIONS
    //making funcs, I can maybe change the occurences later
    // jk I moved them out because this function is way too long already

    handleCollisions();

    // last directions are so I can do the bullet facing, thats where the homie is lookin

    drawHearts();

    if (moveRight) {
        player.x += player.speed;
        lastDirection = 'right';
    }
    if (moveLeft) {
        player.x -= player.speed;
        lastDirection = 'left';
    }
    if (moveUp) {
        player.y -= player.speed;
        lastDirection = 'up';
    }
    if (moveDown) {
        player.y += player.speed;
        lastDirection = 'down';
    }

    score = score + 1;

    context.font = "25px Courier New";
    context.fillStyle = "yellow";
    context.fillText(levelText,25,50);

    context.font = "25px Courier New";
    context.fillStyle = "cyan";
    context.fillText("Steroids: " + steroidsCollected + "/10",25,100);

        // commandeering the func to also draw game text

    context.font = "40px Courier New";
    context.fillStyle = "yellow";
    context.fillText(statusText,400,325);

//     console.log("Player Position: ", player);
//     console.log("Asteroids: ", asteroids);
//     console.log("Steroids: ", steroids);
//     console.log("Steroids:");

//     console.log("Bullets: ", bullets);
//     console.log("Steroids Collected: ", steroidsCollected);
//     console.log("Level: ", level_one);
// }

// This func isnt needed since I made two seperate funcs for ast and ste

// function generateAsteroidsAndSteroids() {
//     // this func just has the if statement from line 94 in the old script as of making
//     let randNumOne = randint(1, 2);
//     let randNumTwo = randint(1, 2);
//     // asteroids is the stack containing asteroids
//     let a;

//     // there has to be a better way to do this randomisation xD
//     if (randNumOne === 1) {
//         a = createAsteroid(randNumTwo, 10, "red");
//         asteroids.push(a);
//     } else {
//         a = createSteroid(randNumTwo, 10, "blue");
//         steroids.push(a);
//     }
}

function drawHearts() {


    if (hearts === 3) {

        context.drawImage(heartImage, 900, 20, 40, 40);
        context.drawImage(heartImage, 800, 20, 40, 40);
        context.drawImage(heartImage, 850, 20, 40, 40);
        console.log("Heart drawn")

    }

    if (hearts === 2) {

        context.drawImage(heartImage, 900, 20, 40, 40);
        context.drawImage(heartImage, 850, 20, 40, 40);
        console.log("Heart drawn")

    }

    if (hearts === 1) {

        context.drawImage(heartImage, 900, 20, 40, 40);
        console.log("Heart drawn")

    }

    if (hearts === 0) {

        // end game
        statusText = "Game Over!"
        stop("Game Over!");


// end the game

    }

}

function directionHandler() {
    // if (lastDirection === "up") {
    // context.drawImage(playerImageUp, player.x, player.y, player.size, player.size);
    //     }

    // if (lastDirection === "down") {
    //     context.drawImage(playerImageDown, player.x, player.y, player.size, player.size);
    //     }
        
    // if (lastDirection === "left") {
    //         context.drawImage(playerImageLeft, player.x, player.y, player.size, player.size);
    //     }

    // if (lastDirection === "right") {
    //         context.drawImage(playerImageRight, player.x, player.y, player.size, player.size);
    //     }
    context.drawImage(currentImage, player.x, player.y, player.size, player.size);
    


}

function generateAsteroid() {
    let p = randint(1, 6);

    if (p === 1 || p === 2 || p === 3) {

    let a = createAsteroid(30, "red");
    asteroids.push(a);

    }

    if (p === 4 || p === 5) {

        let a = createAsteroid(60, "purple");
        asteroids.push(a);
    
        }

     if (p === 6) {

        let a = createAsteroid(60, "orange");
        asteroids.push(a);
        
        }
}

function generateSteroid() {


    let s = createSteroid(30, "cyan");
    steroids.push(s);

}

function generateFreeze() {


    let f = createFreeze(30, "blue");
    freezes.push(f);

}

function generateBurst() {


    let f = createBurst(30, "red");
    bursts.push(f);

}

function createAsteroid(size, color) {
    let randNumTwo = randint(1, 4);

    if (randNumTwo === 1) {
        return {
            x: randint(0, canvas.width),
            y: 0,  //spawns from above
            size: size,
            xChange: randint(-2, 2),
            yChange: randint(1, 2),  //  random down
            color: color
        };

    }  else if (randNumTwo === 2) {

        return {
            x: canvas.width,
            y: randint(0, canvas.height), // spawns from right
            size: size,
            xChange: randint(-2, 2),
            yChange: randint(1, 2),  //  random down
            color: color
        };

    }   else if (randNumTwo === 3) {
        return {
            x: 0,
            y: randint(0, canvas.height), // spawns from left
            size: size,
            xChange: randint(-2, 2),
            yChange: randint(1, 2),  //  random down
            color: color
        }

    }   else {
        return {
            x: randint(0, canvas.width),
            y: canvas.height, //spawns from below
            size: size,
            xChange: randint(-2, 2),
            yChange: randint(-2, -1),  // go up/down randomly
            color: color
        }
    };
};

function createSteroid(size, color) {
        return {
            x: randint(20, canvas.width - 30),
            y: randint(20, canvas.height - 30),
            size: size,
            xChange: 0,
            yChange: 0,
            color: color
        }
    }

function createFreeze(size, color) {
        return {
            x: randint(20, canvas.width - 30),
            y: randint(20, canvas.height - 30),
            size: size,
            xChange: 0,
            yChange: 0,
            color: color
        }
    }


function createBurst(size, color) {
        return {
            x: randint(20, canvas.width - 30),
            y: randint(20, canvas.height - 30),
            size: size,
            xChange: 0,
            yChange: 0,
            color: color
        }
    }




// for (let a of asteroids) {

//     a.x += a.xChange;
//     a.y += a.yChange;

//     if (a.x <= 0 || a.x >= canvas.width) {
//         a.xChange = -a.xChange;
//     }


//     if (a.y <= 0 || a.y >= canvas.height) {
//         a.yChange = -a.yChange;
//     }

// }

// //copy for steroids

// for (let a of steroids) {

//     a.x += a.xChange;
//     a.y += a.yChange;

//     if (a.x <= 0 || a.x >= canvas.width) {
//         a.xChange = -a.xChange;
//     }


//     if (a.y <= 0 || a.y >= canvas.height) {
//         a.yChange = -a.yChange;
//     }

// }


function updatePositions(objects) {
// now works for all objects 
// I want steroids to not move now so this was dumb
// now only works on asteroids

    // if (a.type === 'asteroid') {

    // if we are freezey, dont move anything
    if (isFrozen === true) {
        return;
    }
    

    for (let a of objects) {
        a.x += a.xChange;
        a.y += a.yChange;

        if (a.x <= 0 || a.x >= canvas.width) {
                a.xChange = -a.xChange;
        }
        if (a.y <= 0 || a.y >= canvas.height) {
                a.yChange = -a.yChange;
        }
    }
}


// for i in range len(bullets):
// remember i++ is just parsing increment of 1
//  bullets is an array

function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        let b = bullets[i];

        // makes sure that the direction is correct

        if (b.direction === 'up') {
            b.y -= b.speed;
        } 
        
        else if (b.direction === 'down') {
            b.y += b.speed;
        } 
        
        else if (b.direction === 'left') {
            b.x -= b.speed;
        } 
        
        else if (b.direction === 'right') {
            b.x += b.speed;
        } 
        
        // ADDING IN EXTRA FOR THE BURST

        else if (b.direction === 'NE') {
            b.y -= b.speed;
            b.x += b.speed;

        } 

        else if (b.direction === 'SE') {
            b.y += b.speed;
            b.x += b.speed;
        } 

        else if (b.direction === 'NW') {
            b.y -= b.speed;
            b.x -= b.speed;
        } 

        else if (b.direction === 'SW') {
            b.y += b.speed;
            b.x -= b.speed;
        } 


        if (b.y < 0) {
            bullets.splice(i, 1); 
            // splice takes the index and nukes it out for the second param :D
            i = i - 1;
        }
    }
}

function handleCollisions() {
    // PLAYER AND ASTEROID

    for (let i = 0; i < asteroids.length; i++) {
        let a = asteroids[i];
        if (a && player_collides(a)) {
            // player.size -= 5; // dec size
            hearts -= 1
            asteroids.splice(i, 1);
            // if (player.size <= 0) {
            //     stop("You lose!");
            // }
        }
    }

    // PLAYER AND STEROID (REDUNDANT)

    for (let i = 0; i < steroids.length; i++) {
        let a = steroids[i];
        if (a && player_collides(a)) {
            //player.size += 3; // inc size
            //steroids.splice(i, 1);
            // steroidsHit += 1;
            
            // if (steroidsHit >= asteroids.length) {
            //     nextLevel();
            // }
        }
    }

    // BULLET AND ASTEROID

    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < asteroids.length; j++) {
            if (bullet_collides(bullets[i], asteroids[j])) {
                bullets.splice(i, 1);
                asteroids.splice(j, 1);
                i = i - 1;
                break; // prevent duplicate interactions !
            }
        }
    }

    // BULLET AND STEROID

    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < steroids.length; j++) {
            if (bullet_collides(bullets[i], steroids[j])) {
                bullets.splice(i, 1);
                steroids.splice(j, 1);
                steroidsCollected += 1
                // player.size += 3; // increases player size when bullet hits asteroid :D
                i = i - 1;
                break; // prevent duplicate interactions !
            }
        }
    }

    // PLAYER AND FREEZE

    for (let i = 0; i < freezes.length; i++) {
        let f = freezes[i];
        if (f && player_collides(f)) {
            freezes.splice(i, 1);
            applyFreezeEffect();
            i = i - 1;
        }
    }

    // PLAYER AND BURST

        for (let i = 0; i < bursts.length; i++) {
            let f = bursts[i];
            if (f && player_collides(f)) {
                bursts.splice(i, 1);
                applyBurstEffect();
                i = i - 1;
            }
        }
}

// function nextLevel() {
//     asteroids = [];
//     steroids = [];
//     level = level + 1;
//     steroidsHit = 0;
// }

function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}


function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        currentImage = playerMovingImageLeft
        moveLeft = true;
    } else if (key === "ArrowUp") {
        currentImage = playerMovingImageUp
        moveUp = true;
    } else if (key === "ArrowRight") {
        currentImage = playerMovingImageRight
        moveRight = true;
    } else if (key === "ArrowDown") {
        currentImage = playerMovingImageDown
        moveDown = true;
    } else if (key === " ") {
        shoot();
    }
}

function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        currentImage = playerImageLeft
        moveLeft = false;
    } else if (key === "ArrowUp") {
        currentImage = playerImageUp
        moveUp = false;
    } else if (key === "ArrowRight") {
        currentImage = playerImageRight
        moveRight = false;
    } else if (key === "ArrowDown") {
        currentImage = playerImageDown
        moveDown = false;
    }
}

// let player = {
//     x: 500,
//     y: 320,
//     size: 15
// };

function shoot() {
    // bullet .push pushes a new object onto the bullets array 
    bullets.push({
         // accessses the player object to find the start point for the bullets
        x: (player.x + (player.size / 2)) - 2.5,
        y: player.y,

        size: 5,
        speed: 5,
        direction: lastDirection
    });

    
    if (isBurst === true) {

        // this is a better way than below, just add to the list (array)

        let burstDirectionList = ["up", "down", "left", "right", "NE", "NW", "SE", "SW"]

        for (let i = 0; i < 8; i++) {

            bullets.push({
                // accessses the player object to find the start point for the bullets
               x: (player.x + (player.size / 2)) - 2.5,
               y: player.y,
       
               size: 5,
               speed: 5,
               direction: burstDirectionList[i]

           });

        }
    }

    // coping with the burst powerup

    // if (isBurst === true) {
    //         bullets.push({
    //             // accessses the player object to find the start point for the bullets
    //         x: (player.x + (player.size / 2)),
    //         y: player.y,
    
    //         size: 5,
    //         speed: 5,
    //         direction: "up"
    //     })

    //         bullets.push({
    //             // accessses the player object to find the start point for the bullets
    //         x: (player.x + (player.size / 2)),
    //         y: player.y,

    //         size: 5,
    //         speed: 5,
    //         direction: "down"
    //     })

    //         bullets.push({
    //             // accessses the player object to find the start point for the bullets
    //         x: (player.x + (player.size / 2)),
    //         y: player.y,

    //         size: 5,
    //         speed: 5,
    //         direction: "left"
    //     })

    //         bullets.push({
    //             // accessses the player object to find the start point for the bullets
    //         x: (player.x + (player.size / 2)),
    //         y: player.y,

    //         size: 5,
    //         speed: 5,
    //         direction: "right"
    //     })
    // }
}
        
    //     for (let i = 0; i < 7; i++) {


    //         bullets.push({
    //             // accessses the player object to find the start point for the bullets
    //         x: (player.x + (player.size / 2)) - 2.5,
    //         y: player.y,
    
    //         size: 5,
    //         speed: 5,
    //         direction: lastDirection

            
    //    });

 
function draw_steroids() {

    for (let a of steroids) {
        context.fillStyle = a.color;
        context.fillRect(a.x, a.y, a.size, a.size);
    }
}

function player_collides(a) {
    // ! = NOT, simplifies the bs from old script
    return !(
        player.x + player.size < a.x ||
        a.x + a.size < player.x ||
        player.y > a.y + a.size ||
        a.y > player.y + player.size
    );
}

function bullet_collides(b, a) {
    // ! = NOT, simplifies the bs from old script
    // needs bullet and asteroid location
    // same as before but player is replaced with b
    return !(
        b.x + b.size < a.x ||
        a.x + a.size < b.x ||
        b.y > a.y + a.size ||
        a.y > b.y + b.size
    );
}

function applyFreezeEffect() {

    freezeLength = 5000; // 5 secs

    isFrozen = true;
    freezeEnd = Date.now() + freezeLength;

    // console.log(Date.now())

    
    // if (Date.now() > freezeEnd) {
    //     isFrozen = false;
    // }

}

function applyBurstEffect() {

    burstLength = 5000; // 5 secs

    isBurst = true;
    burstEnd = Date.now() + burstLength;

    // console.log(Date.now())

    
    // if (Date.now() > freezeEnd) {
    //     isFrozen = false;
    // }

}


function freezeTextUpdater() {
    if (isFrozen) {

        // time remaining (SECONDS)

        let timeRemaining = Math.max(0, Math.ceil((freezeEnd - Date.now()) / 1000));

        // set the text innit bruv

        if (timeRemaining > 4) {
            freezeText = "5";
        } else if (timeRemaining > 3) {
            freezeText = "4";
        } else if (timeRemaining > 2) {
            freezeText = "3";
        } else if (timeRemaining > 1) {
            freezeText = "2";
        } else if (timeRemaining > 0) {
            freezeText = "1";
        } else {
            freezeText = "0";
        }
    } else {
        freezeText = "";
    }

    if (isFrozen) {
        context.font = "25px Courier New";
        context.fillStyle = "blue";
        context.fillText("Frozen",350,50);
    }

    context.font = "25px Courier New";
    context.fillStyle = "blue";
    context.fillText(freezeText,385,100);
}


function burstTextUpdater() {
    if (isBurst) {

        // time remaining (SECONDS)

        let timeRemaining = Math.max(0, Math.ceil((burstEnd - Date.now()) / 1000));

        // set the text innit bruv

        if (timeRemaining > 4) {
            burstText = "5";
        } else if (timeRemaining > 3) {
            burstText = "4";
        } else if (timeRemaining > 2) {
            burstText = "3";
        } else if (timeRemaining > 1) {
            burstText = "2";
        } else if (timeRemaining > 0) {
            burstText = "1";
        } else {
            burstText = "0";
        }
    } else {
        burstText = "";
    }

    if (isBurst) {
        context.font = "25px Courier New";
        context.fillStyle = "red";
        context.fillText("Burst Fire",550,50);
    }

    context.font = "25px Courier New";
    context.fillStyle = "red";
    context.fillText(burstText,585,100);
}

// function freezeTextUpdater() {
//     if (isFrozen) {
//         let remainingTime = Math.max(0, Math.ceil((freezeEnd - Date.now()) / 1000)); // Calculate remaining time in seconds

//         if (remainingTime > 0) {
//             freezeText = remainingTime.toString();
//         } else {
//             freezeText = "0";
//         }
//     } else {
//         freezeText = "No Freeze";
//     }

//     context.font = "25px Arial";
//     context.fillStyle = "blue";
//     context.fillText(freezeText, 300, 50); // Update the position of the freezeText on the canvas
// }

function levelHandler(level_one, level_two, level_three) {

    // first we check to see if we need to initialise a level

    if (level_one.start === false && level_one.complete == false) {     

        steroidsCollected = 0
        
        for (let i = 0; i < 10; i++) {
      

            generateAsteroid();
            generateSteroid();
            // generateFreeze();
            // generateFreeze();
          
        }


        // generateBurst();
        // generateBurst();


        level_one.start = true;

    }

    if (level_one.complete === true && level_two.start === false && level_two.complete == false) {

        steroidsCollected = 0

        for (let i = 0; i < 10; i++) {
      
            generateSteroid();
          
        }


        for (let i = 0; i < 20; i++) {
      

            generateAsteroid();
          
        }

        generateFreeze();
        generateFreeze();
        // generateBurst();

        level_two.start = true;
        levelText = "Level Two";
    }

    if (level_two.complete === true && level_three.start === false && level_three.complete == false) {

        steroidsCollected = 0

        for (let i = 0; i < 10; i++) {
      

            generateSteroid();
          
        }

        for (let i = 0; i < 30; i++) {
      

            generateAsteroid();
          
        }

        generateFreeze();
        // generateFreeze();
        generateBurst();

        level_three.start = true;
        levelText = "Level Three";

    }

    if (level_three.complete === true && level_four.start === false && level_four.complete == false) {

        steroidsCollected = 0

        for (let i = 0; i < 10; i++) {
      

            generateSteroid();
          
        }

        for (let i = 0; i < 40; i++) {
      

            generateAsteroid();
          
        }

        generateFreeze();
        generateFreeze();
        generateBurst();


        level_four.start = true;
        levelText = "Level Four";

    }

    if (level_four.complete === true && level_five.start === false && level_five.complete == false) {

        steroidsCollected = 0

        for (let i = 0; i < 10; i++) {
      

            generateSteroid();
          
        }

        for (let i = 0; i < 50; i++) {
      

            generateAsteroid();
          
        }

        // generateFreeze();
        // generateFreeze();

        generateBurst()

        level_five.start = true;
        levelText = "Level Five";

    }

    // next we check to see if we meet the requirements to end a level

    if (level_one.start === true && steroidsCollected === 10 && level_two.start === false) {

        steroidsCollected = 0
        level_one.complete = true;
        stage = 2;

    }

    if (level_two.start === true && steroidsCollected === 10 && level_three.start === false) {

        steroidsCollected = 0
        level_two.complete = true;
        stage = 3;

    }

    if (level_three.start === true && steroidsCollected === 10) {

        level_three.complete = true;
        stage = 4;


    }

    if (level_four.start === true && steroidsCollected === 10) {

        level_four.complete = true;
        stage = 5;

    }

    if (level_five.start === true && steroidsCollected === 10) {

        level_five.complete = true;
        stage = 6;
        statusText = "You win!"
        stop("You Win!")


    }
}

function stop(outcome) {
    window.cancelAnimationFrame(request_id);
    window.removeEventListener("keydown", activate);
    window.removeEventListener("keyup", deactivate);
    // let finalSize = (player.size - 15) / 3
    // let outcome_element = document.querySelector("#outcome");
    // outcome_element.innerHTML = outcome + " Size: " + finalSize;

    let outcome_element = document.querySelector("#outcome");
    outcome_element.innerHTML = outcome + " Score: " + score + " Level - " + (stage-1);

    // idk how this works I got it here https://www.w3schools.com/js/js_window_location.asp

    // if (outcome === "win") {
    //     window.location.href = "../run.py";
    // }

    let data = new FormData();
    data.append("score", score);

    
    let xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response, false);
    xhttp.open("POST", "/store_score", true);
    xhttp.send(data);
}

function handle_response() {
    if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
            if (xhttp.responseText === "success") {
                console.log("Score successfully stored in database");
            } else {
                console.log("Failed to store score in database");
            }
        }
    }
}


