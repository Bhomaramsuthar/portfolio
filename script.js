/* =========================================
   MAIN SCRIPT - ANIMATION & LOGIC
   ========================================= */

// 1. REGISTER GSAP PLUGINS
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);


// 2. INITIALIZE LENIS (Smooth Scroll)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


// 2. CUSTOM CURSOR
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows immediately
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with slight delay (handled by CSS or simple animate)
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// 3. ANIMATIONS

// A. HERO SECTION - ZOOM-THROUGH (OPTIMIZED)
// 1. Mouse Parallax Effect
const heroSection = document.getElementById('hero');
heroSection.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    // Move SVG Text
    gsap.to('.hero-svg-text', {
        x: x * 20,
        y: y * 20,
        duration: 1,
        ease: 'power2.out'
    });

    // Move Floating Images (Layered depth)
    gsap.to('.float-1', { x: -x * 30, y: -y * 30, duration: 1 });
    gsap.to('.float-2', { x: x * 40, y: -y * 40, duration: 1.2 });
    gsap.to('.float-3', { x: -x * 50, y: y * 50, duration: 1.4 });
    gsap.to('.float-4', { x: x * 30, y: y * 30, duration: 1 });
    gsap.to('.float-5', { x: -x * 60, y: -y * 60, duration: 1.6 });
});

// 2. Scroll Zoom Interaction
const heroTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "+=700", // MUCH FASTER (Short scroll distance)
        pin: true,
        scrub: 0.5, // Slight smoothing
        immediateRender: false // Prevent glitches on reload
    }
});

heroTl
    // Zoom IN Phase
    .to(".hero-zoom-container", {
        scale: 50,
        duration: 5,
        ease: "power2.inOut"
    })
    // Text Fade Out (Overlapped)
    .to(".hero-center-text", {
        autoAlpha: 0, // Handles opacity + visibility
        duration: 1.5,
        ease: "power1.in"
    }, "<3.5") // Start earlier to avoid black screen
    // Images Scatter/Fade
    .to(".floating-img", {
        autoAlpha: 0,
        x: (index) => (index % 2 === 0 ? -1500 : 1500),
        y: (index) => (index < 2 ? -1500 : 1500),
        duration: 3
    }, "<"); // Sync with text fade

// Reveal Main Content (Overlapped start)
gsap.from("#main-content", {
    autoAlpha: 0,
    y: 50,
    scrollTrigger: {
        trigger: "#main-content",
        start: "top 90%", // Start revealing much earlier
        end: "top 20%",
        scrub: true
    }
});
const cards = document.querySelectorAll('.work-card');

cards.forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 90%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: i * 0.1
    });
});


// C. SECTION TITLES
const sectionTitles = document.querySelectorAll('.section-title');
sectionTitles.forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// D. EMAILJS CONFIGURATION & HANDLER
// Initialize EmailJS with your Public Key
emailjs.init("DasIzmkmk6mlqb_dh");

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Visual Feedback
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'SENDING...';
        btn.disabled = true;

        // Send Form via EmailJS
        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual values
        emailjs.sendForm('service_4y78cbs', 'template_jkjg49r', '#contact-form')
            .then(function () {
                alert('Message Sent!');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, function (error) {
                alert('Failed to send message. Please try again.');
                console.error('EmailJS Error:', error);
                btn.innerText = originalText;
                btn.disabled = false;
            });
    });
}
