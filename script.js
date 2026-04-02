document.addEventListener("DOMContentLoaded", () => {
    // 1. Preloader Text Scramble Decode
    const el = document.getElementById("preloader-text");
    const phrases = ["Initializing...", "Loading Assets...", "Rashmi Kumari"];
    
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update(); 
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    const fx = new TextScramble(el);
    let counter = 0;
    const next = () => {
        fx.setText(phrases[counter]).then(() => {
            if (counter < phrases.length - 1) {
                counter++;
                setTimeout(next, 700);
            } else {
                // Done loading
                setTimeout(() => {
                    const preloader = document.getElementById("preloader");
                    preloader.style.opacity = "0";
                    setTimeout(() => {
                        preloader.style.display = "none";
                    }, 1000);
                }, 800);
            }
        });
    };
    next();

    // 2. Custom Glow Cursor
    const cursor = document.getElementById("custom-cursor");
    const magneticElements = document.querySelectorAll('.magnetic');

    document.addEventListener("mousemove", (e) => {
        // Smooth follow logic using requestAnimationFrame for better perf
        cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    });

    // 3. Magnetic Hover Effects
    magneticElements.forEach((el) => {
        el.addEventListener("mousemove", function(e) {
            const pos = this.getBoundingClientRect();
            const x = e.clientX - pos.left - pos.width / 2;
            const y = e.clientY - pos.top - pos.height / 2;
            
            this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            
            // Cursor Expand
            cursor.classList.add("hover");
        });

        el.addEventListener("mouseleave", function() {
            this.style.transform = `translate(0px, 0px)`;
            cursor.classList.remove("hover");
        });
    });

    // Hover effect for non-magnetic interactive elements
    const interactiveTargs = document.querySelectorAll('a, button, input, textarea, .glass-card');
    interactiveTargs.forEach(el => {
        if(!el.classList.contains('magnetic')){
            el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
        }
    });

    // 4. Scroll Reveal Animations & Navbar Scrolled State
    const reveals = document.querySelectorAll(".reveal");
    const navbar = document.querySelector(".navbar");

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add("active");
            }
        });

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger on load

    // 5. 3D Tilt Effect (Vanilla JS)
    const tiltElements = document.querySelectorAll('.tilt-box');
    
    tiltElements.forEach(el => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = ((x - centerX) / centerX) * 10; // Max tilt 10deg
            const tiltY = ((centerY - y) / centerY) * 10;
            
            el.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        el.addEventListener("mouseleave", () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.transition = "transform 0.5s ease";
        });
        
        el.addEventListener("mouseenter", () => {
            el.style.transition = "none";
        });
    });
    
});
