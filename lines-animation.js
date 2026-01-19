/* =========================================
   HERO CANVAS - FLOWING LINES ANIMATION
   ========================================= */

const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let lines = [];
let animationId;

// CONFIG
const lineCount = 100;
const speedBase = 2;
let speedMultiplier = 1;
let isTransitioning = false;

// RESIZE HANDLER
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight; // Fill full hero section but we might need to clamp to parent if needed
}
window.addEventListener('resize', resize);
resize();


// LINE CLASS
class Line {
    constructor() {
        this.reset();
        // Give random starting X so they don't all start at 0
        this.x = Math.random() * width;
    }

    reset() {
        this.x = -Math.random() * 500; // Start off screen left
        this.y = Math.random() * height;
        this.length = Math.random() * 300 + 100;
        this.speed = (Math.random() * 2 + 1) * speedBase;
        this.color = this.getRandomColor();
        this.width = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
    }

    getRandomColor() {
        const rand = Math.random();
        if (rand > 0.9) return '#F2500D'; // Accent Orange
        if (rand > 0.6) return '#FFFFFF'; // White
        return '#333333'; // Grey
    }

    update() {
        this.x += this.speed * speedMultiplier;

        // Reset if off screen right
        if (this.x > width + this.length) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.globalAlpha = this.alpha;

        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length, this.y); // Draw lines trailing behind x

        ctx.stroke();
        ctx.globalAlpha = 1;
    }
}

// INIT LINES
for (let i = 0; i < lineCount; i++) {
    lines.push(new Line());
}

// ANIMATION LOOP
function animate() {
    ctx.clearRect(0, 0, width, height);

    lines.forEach(line => {
        line.update();
        line.draw();
    });

    animationId = requestAnimationFrame(animate);
}

animate();


// INTERACTION (CLICK RIGHT 30%)
canvas.addEventListener('click', (e) => {
    // Check if click is in the right 30% of the screen
    if (e.clientX > window.innerWidth * 0.7) {
        triggerTransition();
    }
});

// Also support touch
canvas.addEventListener('touchstart', (e) => {
    if (e.touches[0].clientX > window.innerWidth * 0.7) {
        triggerTransition();
    }
});


function triggerTransition() {
    if (isTransitioning) return;
    isTransitioning = true;

    // Visual Feedback: Speed up lines
    const tl = gsap.timeline();

    tl.to(window, {
        duration: 0.5,
        onUpdate: () => {
            speedMultiplier = 1 + (tl.progress() * 10); // Ramps up to 10x speed
        }
    })
        .to(window, { // Scroll to next section
            scrollTo: "#about",
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: () => {
                // Reset speed slowly
                gsap.to(window, {
                    duration: 1,
                    onUpdate: function () {
                        // Manually tween back local var? simpler to just tween object prop if we had one.
                        // approximate:
                        speedMultiplier = 10 - (this.progress() * 9);
                    },
                    onComplete: () => {
                        speedMultiplier = 1;
                        isTransitioning = false;
                    }
                });
            }
        });
}
