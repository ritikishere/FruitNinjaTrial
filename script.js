

const canvas = document.getElementById('gameCanvas');
const c = canvas.getContext('2d');

// Set canvas size to match CSS styling
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let missedFruits = 0;
let fallingDownCount = 0; // Counter for fruits that fall
let totalFruits = 0; // Total number of fruits spawned
let score = 0; // Game score

const gravity = 0.1;

// Load fruit images
const fruitImages = [
    'Apple.png',   // Replace with actual file paths
    'Banana.png',
    'Melon.png',
    'Orange.png',
    'Grape-Black.png',
    'Lychee.png',
    'Mango.png',
    'PineApple.png',
    'Cherimoya.png',
];

// Helper to load images
function loadImage(src) {
    const img = new Image();
    img.src = src;
    img.onload = () =>
        console.log(`${src} loaded`);
    img.onerror = () =>
        console.error(`${src} failed loading`);
    return img;
}

const loadedImages = fruitImages.map(loadImage);

class Fruit {
    constructor() {
        this.image = loadedImages[Math.floor(Math.random() * loadedImages.length)];
        this.position = {
            x: Math.random() * canvas.width,
            y: canvas.height,
        };
        this.velocity = {
            x: Math.random() + 2, // Random horizontal velocity
            y: Math.random() * 2 + 8, // Initial upward velocity
        };
        this.width = 100;
        this.height = 100;
        this.gravity = gravity;
        this.visible = true; // Fruit visibility flag
        this.isFalling = false; // Is fruit falling
        this.isCut = false; // Is fruit sliced
    }

    draw() {
        if (this.visible) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    update() {
        if (this.visible) {
            // If fruit is not falling yet (rising phase)
            if (!this.isFalling) {
                this.position.y -= this.velocity.y;
                this.position.x += this.velocity.x;
                this.velocity.y -= this.gravity; // Apply gravity

                // When fruit starts falling
                if (this.velocity.y <= 0) {
                    this.isFalling = true;
                }
            } else {
                // Fruit falls down
                this.position.y += this.velocity.y;
                this.velocity.y += this.gravity;
                this.position.x += this.velocity.x;
                // this.velocity.x = -4// Apply gravity while falling

                // Check if fruit hits the bottom
                if (this.position.y + this.height >= canvas.height) {
                    this.position.y = canvas.height - this.height;
                    this.visible = false; // Mark fruit as missed
                    fallingDownCount++;
                    
                }
            }

            // Check for horizontal collisions with canvas walls
            if ((this.position.x + this.width) > canvas.width) {
                this.velocity.x = -4; // Bounce off right wall
            }
            if (this.position.x < 0) {
                this.velocity.x = 4; // Bounce off left wall
            }

            this.draw();
        }
    }
}













// aao Bomb banate hai :)



let fruits = [];
const fruitScores = {
    'Apple.png': 5,
    'Banana.png': 3,
    'Melon.png': 4,
    'Orange.png': 6,
    'Grape-Black.png': 7,
    'Lychee.png': 8,
    'Mango.png': 3,
    'PineApple.png': 12,
    'Cherimoya.png': 15
};



function spawnFruits() {
    const numberOfFruits = Math.floor(Math.random() * 2) + 3; // Between 3 and 6 fruits
    fruits = []; // Clear previous fruits
    totalFruits = numberOfFruits; // Update total fruits
    for (let i = 0; i < numberOfFruits; i++) {
        fruits.push(new Fruit()); // Push fruits to array
    }
};

// Function to spawn random number of fruits (between 3 and 6)




let isDragging = false;
let lastMousePosition = null;
let currentMousePosition = { x: 0, y: 0 };

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Update fruits
    fruits.forEach((fruit) => fruit.update());

    // Draw slicing line
    if (isDragging && lastMousePosition) {
        c.beginPath();
        c.moveTo(lastMousePosition.x, lastMousePosition.y);
        c.lineTo(currentMousePosition.x, currentMousePosition.y);
        c.strokeStyle = "white";
        c.lineWidth = 11;
        c.lineJoin = "round";
        c.lineCap = "round";
        c.shadowColor = "aqua";
        c.shadowBlur = 20;
        c.stroke();

        // Check for fruit slicing (collision detection)
        fruits.forEach((fruit) => {
            if (
                fruit.visible &&
                currentMousePosition.x > fruit.position.x &&
                currentMousePosition.x < fruit.position.x + fruit.width &&
                currentMousePosition.y > fruit.position.y &&
                currentMousePosition.y < fruit.position.y + fruit.height
            ) {
                fruit.isCut = true; // Mark fruit as cut
                fruit.visible = false; // Hide fruit
                score += fruitScores[fruit.image.src.split('/').pop()]; // Increase score
            }
        });
    }

    // Update lastMousePosition to currentMousePosition
    if (isDragging) {
        lastMousePosition = { ...currentMousePosition };
    }

    // Game Over Condition: 3 fruits have fallen
    if (fallingDownCount >= 3) {
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = "red";
        c.font = "40px Arial";
        c.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        c.fillStyle = "white";
        c.font = "25px Arial";
        c.fillText("Score: " + score, canvas.width / 2 - 55, canvas.height / 2 + 30);
        return; // Stop the animation loop once game over
    }

    // Check if all fruits are invisible or missed and respawn
    const allFruitsGone = fruits.every(fruit => !fruit.visible);
    if (allFruitsGone && fallingDownCount < 3) {
        setTimeout(() => {
            spawnFruits(); // Respawn new fruits
        }, 0); // Wait 1 second before respawning
    }

    // Display score
    c.fillStyle = "white";
    c.font = "20px Arial";
    c.fillText("Score: " + score, 20, 30);


    c.fillStyle = "white";
    c.font = "20px Arial";
    c.fillText("Chance: "  + (3 - fallingDownCount), canvas.width-110, 30);
}


canvas.addEventListener("mousedown", (event) => {
    isDragging = true;
    currentMousePosition = getMousePos(event);
    lastMousePosition = { ...currentMousePosition };
});

canvas.addEventListener("mousemove", (event) => {
    if (isDragging) {
        currentMousePosition = getMousePos(event);
    }
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
    lastMousePosition = null; // Reset last position
});

// Function to get mouse position relative to the canvas
function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}

// Touch support (for mobile devices)
canvas.addEventListener("touchstart", (event) => {
    isDragging = true;
    const touch = event.touches[0];
    currentMousePosition = getTouchPos(touch);
    lastMousePosition = { ...currentMousePosition };
});

canvas.addEventListener("touchmove", (event) => {
    if (isDragging) {
        const touch = event.touches[0];
        currentMousePosition = getTouchPos(touch);
    }
});

canvas.addEventListener("touchend", () => {
    isDragging = false;
    lastMousePosition = null; // Reset last position
});

// Function to get touch position relative to the canvas
function getTouchPos(touch) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
    };
}

animate();












// SidebarSetup:)

const sidebar = document.getElementById("sidebar");
const togglebtn = document.getElementById("togglebtn");

sidebar.style.left = "-15vw"
togglebtn.style.left = "0px"
navbar.style.left = "-15vw"



togglebtn.addEventListener("click", () => {
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-15vw"
    } else {
        sidebar.style.left = "0px"
    }
});

togglebtn.addEventListener("click", () => {
    if (togglebtn.style.left === "0px") {
        togglebtn.style.left = "12vw"
    } else {
        togglebtn.style.left = "0px"
    }
});

togglebtn.addEventListener("click", () => {
    if (navbar.style.left === "0px") {
        navbar.style.left = "-15vw"
    } else {
        navbar.style.left = "0px"
    }
});




const topbar = document.getElementById("topbar");
const fogglebtn = document.getElementById("fogglebtn");

topbar.style.top = "-11vmin"
fogglebtn.style.top = "0px"



fogglebtn.addEventListener("click", () => {
    if (topbar.style.top === "0px") {
        topbar.style.top = "-11vmin"
    } else {
        topbar.style.top = "0px"
    }
});

fogglebtn.addEventListener("click", () => {
    if (fogglebtn.style.top === "0px") {
        fogglebtn.style.top = "3.5vmin"
    } else {
        fogglebtn.style.top = "0px"
    }
});
