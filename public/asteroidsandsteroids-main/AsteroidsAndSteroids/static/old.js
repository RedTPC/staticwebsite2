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
    size: 15
};

let asteroids = [];
let steroids = [];
let score = 0;
let level = 1;

let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;

let steroidsHit = 0;

//new


document.addEventListener("DOMContentLoaded", init, false);

function init() {

    // PREVENTS SCROLLING OF BROWSER
    window.addEventListener("keydown", function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
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
    console.log("Drawing the canvas!!");

    //let level_element = document.querySelector("#level");
    //level.innerHTML = level + " Level: " + level;

    // if (level === 1) {

    //     let RoidSpeed = 1;
    //     let RoidSize = 10

    // }

    // if (level === 2) {

    //     let RoidSpeed = 2;
    //     let RoidSize = 9

    // }

    // if (level === 3) {

    //     let RoidSpeed = 3;
    //     let RoidSize = 8

    // }

    
    request_id = window.requestAnimationFrame(draw);

    let now = Date.now();
    let elapsed = now - then;

    if (elapsed <= fpsInterval) {
        return;
    }

    then = now - (elapsed % fpsInterval);

    if (steroids.length < 10) {
        let randNumOne = randint(1, 2); 
        let randNumTwo = randint(1, 2);
        let a; 

        if (randNumOne === 1) {

            if (randNumTwo === 1) {
                a = {
                    x: randint(0, canvas.width),

                    y: 0, // above spawn
                    size: 10,
                    xChange: randint(-2, -1),
                    yChange: randint(1, 2) //  random down
                };
            }

            if (randNumTwo === 2) {
                a = {
                    x: randint(0, canvas.width),
                    y: canvas.height,   //spawns from below
                    size: 10,
                    xChange: randint(-2, -1),
                    yChange: randint(-2, -1) // go up/down randomly
                };
            }

            asteroids.push(a);
        }

        // STEROIDS 

        if (randNumOne === 2) {

            if (randNumTwo === 1) {
                a = {
                    x: randint(0, canvas.width),

                    y: 0, // above spawn
                    size: 10,
                    xChange: randint(-2, -1),
                    yChange: randint(1, 2), //  random down
                    color: "blue" //not useful yet
                };
            }

            if (randNumTwo === 2) {
                a = {
                    x: randint(0, canvas.width),
                    y: canvas.height,   //spawns from below
                    size: 10,
                    xChange: randint(-2, -1),
                    yChange: randint(-2, -1), // go up/down randomly
                    color: "blue" //not useful yet
                };
            }

            steroids.push(a);
        }



    }

    // doing bouncing 

    for (let a of asteroids) {

        a.x += a.xChange;
        a.y += a.yChange;
    
        if (a.x <= 0 || a.x >= canvas.width) {
            a.xChange = -a.xChange;
        }


        if (a.y <= 0 || a.y >= canvas.height) {
            a.yChange = -a.yChange;
        }

    }

    //copy for steroids
    
    for (let a of steroids) {

        a.x += a.xChange;
        a.y += a.yChange;
    
        if (a.x <= 0 || a.x >= canvas.width) {
            a.xChange = -a.xChange;
        }


        if (a.y <= 0 || a.y >= canvas.height) {
            a.yChange = -a.yChange;
        }

    }



    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = "yellow";
    context.fillRect(player.x, player.y, player.size, player.size);

    //this doesnt make sense in the context of the game but Imkeeping it for the start, maybe delete later
    for (let a of asteroids) {
        context.fillStyle = "red";
        context.fillRect(a.x, a.y, a.size +5, a.size+5);
        if (player.x + player.size === canvas.width) {
            stop("You win!");
            return;
        }
        //for (let a of asteroids) {
            //if (player_collides(a)) {
                //stop("You lose!");
                //return;
            //}
        //}
    }

    console.log("Num strds:", steroids.length); // check for steroids test ing


    for (let a of steroids) {
        context.fillStyle = "cyan";  //fillstyle always before fillrect
        context.fillRect(a.x, a.y, a.size, a.size);

    }

    // DEALING WITH COLLISIONS
    //making funcs, I can maybe change the occurences later

    function AsteroidCollision() {
        player.size -= 5; // dec size
        if (player.size <= 0) {
            stop("You lose!");
        }
    }
    
    function SteroidCollision() {
        player.size += 3; // inc size
        steroidsHit += 1;
        if (steroidsHit >= asteroids.length) {

            asteroids = [];
            steroids = [];
            level += 1;

        }
        //context.clearRect(0, 0, canvas.width, canvas.height);
    }

    //calls collision, calls specific func

    for (let i = 0; i < asteroids.length; i++) { //have to do it with i cos I need to parse the array
        let a = asteroids[i];
        if (a && player_collides(a)) { //  if a and player colides true (not null)
            AsteroidCollision();
            asteroids.splice(i, 1); // set the asteroid to feckin fjadjgb 1, removing it with splice
            //stop("You lose!");
            return;
        }
    }
    
    for (let i = 0; i < steroids.length; i++) { //have to do it with i cos otherwise it is undefined
        let a = steroids[i];
        if (a && player_collides(a)) { //  if a and player colides true (not null)
            SteroidCollision();
            steroids.splice(i, 1); 
            //stop("You lose!");
            return;
        }
    }
    

    //asteroids moving

    for (let a of asteroids) {
        a.x = a.x + a.xChange;
        a.y = a.y + a.yChange;
        if (a.x <= -a.size) {
            a.x = canvas.width;
        }
    }
    
    // steroids

    for (let a of steroids) {
        a.x = a.x + a.xChange;
        a.y = a.y + a.yChange;
        if (a.x <= -a.size) {
            a.x = canvas.width;
        }
    }

    if (moveRight) {
        player.x += player.size;
    }
    if (moveLeft) {
        player.x -= player.size;
    }
    if (moveUp) {
        player.y -= player.size;
    }
    if (moveDown) {
        player.y += player.size;
    }
    

    score = score + 1;
}

function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = true;
    } else if (key === "ArrowUp") {
        moveUp = true;
    } else if (key === "ArrowRight") {
        moveRight = true;
    } else if (key === "ArrowDown") {
        moveDown = true;
    }
}

function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = false;
    } else if (key === "ArrowUp") {
        moveUp = false;
    } else if (key === "ArrowRight") {
        moveRight = false;
    } else if (key === "ArrowDown") {
        moveDown = false;
    }
}

function player_collides(a) {
    if (
        player.x + player.size < a.x ||
        a.x + a.size < player.x ||
        player.y > a.y + a.size ||
        a.y > player.y + player.size
    ) {
        return false;
    } else {
        return true;
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
    outcome_element.innerHTML = outcome + " Score: " + score;
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
