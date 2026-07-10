/* ==========================================================
   TECHFEST PREMIUM JAVASCRIPT
   Part 1
   Utilities + Loading + Navigation + Smooth Scroll
========================================================== */

"use strict";

/* ==========================================================
   GLOBAL APP
========================================================== */

const APP = {
    loadingComplete: false,
    animationFrame: null
};

/* ==========================================================
   UTILITIES
========================================================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function debounce(callback, delay = 300) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

function throttle(callback, limit = 100) {
    let waiting = false;

    return (...args) => {

        if (waiting) return;

        callback(...args);

        waiting = true;

        setTimeout(() => {
            waiting = false;
        }, limit);
    };
}

/* ==========================================================
   LOADING SCREEN
========================================================== */

function initLoadingScreen() {

    const loader = $("#loadingScreen");

    if (!loader) return;

    window.addEventListener("load", () => {

        loader.classList.add("hide");

        APP.loadingComplete = true;

        setTimeout(() => {
            loader.remove();
        }, 700);

    });

}

/* ==========================================================
   MOBILE NAVIGATION
========================================================== */

function initNavigation() {

    const navbar = $("#navbar");
    const menuBtn = $("#menuToggle");
    const navMenu = $("#navMenu");

    if (!navbar) return;

    /* -------------------------
       Mobile Menu
    ------------------------- */

    if (menuBtn && navMenu) {

        menuBtn.addEventListener("click", () => {

            const expanded =
                menuBtn.getAttribute("aria-expanded") === "true";

            menuBtn.setAttribute(
                "aria-expanded",
                !expanded
            );

            navMenu.classList.toggle("active");

        });

    }

    /* -------------------------
       Close menu after click
    ------------------------- */

    $$(".nav-link").forEach(link => {

        link.addEventListener("click", () => {

            if (navMenu) {

                navMenu.classList.remove("active");

            }

            if (menuBtn) {

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

    });

    /* -------------------------
       Navbar Background
    ------------------------- */

    const navbarScroll = throttle(() => {

        if (window.scrollY > 60) {

            navbar.classList.add("scrolled");

        }

        else {

            navbar.classList.remove("scrolled");

        }

    }, 50);

    window.addEventListener("scroll", navbarScroll);

}

/* ==========================================================
   SMOOTH SCROLL
========================================================== */

function initSmoothScroll() {

    $$('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (e) {

            const targetID = this.getAttribute("href");

            if (targetID === "#") return;

            const target = document.querySelector(targetID);

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });

    });

}

/* ==========================================================
   ACTIVE NAV LINK
========================================================== */

function initActiveNavigation() {

    const sections = $$("section[id]");
    const links = $$(".nav-link");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const id = entry.target.id;

            links.forEach(link => {

                link.classList.remove("active");

                if (link.getAttribute("href") === "#" + id) {

                    link.classList.add("active");

                }

            });

        });

    }, {

        threshold: 0.55

    });

    sections.forEach(section => {

        observer.observe(section);

    });

}

/* ==========================================================
   BACK TO TOP BUTTON
========================================================== */

function initBackToTop() {

    const button = $("#backToTop");

    if (!button) return;

    window.addEventListener("scroll",

        throttle(() => {

            if (window.scrollY > 500) {

                button.classList.add("show");

            }

            else {

                button.classList.remove("show");

            }

        }, 100)

    );

    button.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/* ==========================================================
   SCROLL PROGRESS BAR
========================================================== */

function initScrollProgress() {

    const progress = $("#scrollProgress");

    if (!progress) return;

    window.addEventListener("scroll",

        throttle(() => {

            const scrollTop =
                document.documentElement.scrollTop;

            const height =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;

            const percent =
                (scrollTop / height) * 100;

            progress.style.width =
                percent + "%";

        }, 20)

    );

}
/* ==========================================================
   PART 2
   PARTICLES + PARALLAX
========================================================== */

/* ==========================================================
   PARTICLE CLASS
========================================================== */

class Particle {

    constructor(canvas) {

        this.canvas = canvas;

        this.reset();

    }

    reset() {

        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;

        this.radius = Math.random() * 2 + 1;

        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;

        this.opacity = Math.random() * 0.5 + 0.2;

    }

    update() {

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x <= 0 || this.x >= this.canvas.width)
            this.speedX *= -1;

        if (this.y <= 0 || this.y >= this.canvas.height)
            this.speedY *= -1;

    }

    draw(ctx) {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(0,212,255,${this.opacity})`;

        ctx.fill();

    }

}

/* ==========================================================
   PARTICLE SYSTEM
========================================================== */

const ParticleSystem = {

    canvas: null,

    ctx: null,

    particles: [],

    init() {

        this.canvas = $("#particleCanvas");

        if (!this.canvas) return;

        this.ctx = this.canvas.getContext("2d");

        this.resize();

        this.createParticles();

        this.animate();

        window.addEventListener(

            "resize",

            debounce(() => {

                this.resize();

                this.createParticles();

            }, 250)

        );

    },

    resize() {

        const hero = $(".hero");

        if (!hero) return;

        this.canvas.width = hero.offsetWidth;

        this.canvas.height = hero.offsetHeight;

    },

    createParticles() {

        this.particles = [];

        let total = 50;

        if (window.innerWidth < 768)
            total = 20;

        else if (window.innerWidth < 1200)
            total = 35;

        for (let i = 0; i < total; i++) {

            this.particles.push(

                new Particle(this.canvas)

            );

        }

    },

    connect() {

        for (let i = 0; i < this.particles.length; i++) {

            for (let j = i + 1; j < this.particles.length; j++) {

                const dx =
                    this.particles[i].x -
                    this.particles[j].x;

                const dy =
                    this.particles[i].y -
                    this.particles[j].y;

                const distance =
                    Math.sqrt(dx * dx + dy * dy);

                if (distance < 130) {

                    this.ctx.beginPath();

                    this.ctx.moveTo(
                        this.particles[i].x,
                        this.particles[i].y
                    );

                    this.ctx.lineTo(
                        this.particles[j].x,
                        this.particles[j].y
                    );

                    this.ctx.strokeStyle =
                        `rgba(0,212,255,${0.12 * (1 - distance / 130)})`;

                    this.ctx.lineWidth = 1;

                    this.ctx.stroke();

                }

            }

        }

    },

    animate() {

        this.ctx.clearRect(

            0,

            0,

            this.canvas.width,

            this.canvas.height

        );

        this.connect();

        this.particles.forEach(particle => {

            particle.update();

            particle.draw(this.ctx);

        });

        APP.animationFrame =

            requestAnimationFrame(

                () => this.animate()

            );

    }

};

/* ==========================================================
   INITIALIZE PARTICLES
========================================================== */

function initParticles() {

    ParticleSystem.init();

}

/* ==========================================================
   PAUSE ANIMATION WHEN TAB IS HIDDEN
========================================================== */

document.addEventListener(

    "visibilitychange",

    () => {

        if (document.hidden) {

            cancelAnimationFrame(

                APP.animationFrame

            );

        }

        else {

            ParticleSystem.animate();

        }

    }

);

/* ==========================================================
   PARALLAX EFFECT
========================================================== */

function initParallax() {

    const items =

        $$(".floating-element");
        const hero = $(".hero");

if (!hero) return;

    if (!items.length) return;

    const move = throttle((e) => {

        const hero = $(".hero");

        if (!hero) return;

        const rect =

            hero.getBoundingClientRect();

        const x =
            (e.clientX - rect.left) /
            rect.width;

        const y =
            (e.clientY - rect.top) /
            rect.height;

        items.forEach(item => {

            const translateX =
                (x - 0.5) * 25;

            const translateY =
                (y - 0.5) * 25;

            item.style.transform =

                `translate(${translateX}px, ${translateY}px)`;

        });

    }, 16);

    hero.addEventListener(

        "mousemove",

        move

    );

    hero.addEventListener(

        "mouseleave",

        () => {

            items.forEach(item => {

                item.style.transform =

                    "translate(0,0)";

            });

        }

    );

}
/* ==========================================================
   PART 3
   FAQ + RIPPLE + LAZY LOADING + GALLERY LIGHTBOX
========================================================== */

/* ==========================================================
   FAQ ACCORDION
========================================================== */

function initFAQ() {

    const items = document.querySelectorAll(".faq-item");

    if (!items.length) return;

    items.forEach(item => {

        const question = item.querySelector(".faq-question");

        if (!question) return;

        question.addEventListener("click", () => {

            items.forEach(other => {

                if (other !== item) {

                    other.classList.remove("active");

                }

            });

            item.classList.toggle("active");

        });

    });

}

/* ==========================================================
   BUTTON RIPPLE EFFECT
========================================================== */

function initRippleEffect() {

    document.querySelectorAll(".btn").forEach(button => {

        button.style.position = "relative";
        button.style.overflow = "hidden";

        button.addEventListener("pointerdown", function (e) {

            const ripple = document.createElement("span");

            const rect = this.getBoundingClientRect();

            const size = Math.max(rect.width, rect.height);

            ripple.className = "ripple";

            ripple.style.width = size + "px";
            ripple.style.height = size + "px";

            ripple.style.left =
                e.clientX - rect.left - size / 2 + "px";

            ripple.style.top =
                e.clientY - rect.top - size / 2 + "px";

            this.querySelector(".ripple")?.remove();

            this.appendChild(ripple);

            ripple.addEventListener("animationend", () => {

                ripple.remove();

            });

        });

    });

}

/* ==========================================================
   LAZY IMAGE LOADING
========================================================== */

function initLazyLoading() {

    const images = document.querySelectorAll("img[data-src]");

    if (!images.length) return;

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const img = entry.target;

            img.src = img.dataset.src;

            img.onload = () => {

                img.classList.add("loaded");

            };

            observer.unobserve(img);

        });

    }, {

        rootMargin: "100px"

    });

    images.forEach(img => observer.observe(img));

}

/* ==========================================================
   GALLERY LIGHTBOX
========================================================== */

function initGalleryLightbox() {

    const galleryImages = document.querySelectorAll(".gallery-item img");

    if (!galleryImages.length) return;

    galleryImages.forEach(image => {

        image.addEventListener("click", () => {

            const overlay = document.createElement("div");

            overlay.className = "lightbox";

            overlay.innerHTML = `
                <div class="lightbox-wrapper">
                    <button class="lightbox-close">&times;</button>
                    <img src="${image.src}" alt="${image.alt}">
                </div>
            `;

            document.body.appendChild(overlay);

            document.body.style.overflow = "hidden";

            const close = () => {

                overlay.remove();

                document.body.style.overflow = "";

                document.removeEventListener("keydown", escClose);

            };

            function escClose(e) {

                if (e.key === "Escape") {

                    close();

                }

            }

            document.addEventListener("keydown", escClose);

            overlay.addEventListener("click", e => {

                if (
                    e.target === overlay ||
                    e.target.classList.contains("lightbox-close")
                ) {

                    close();

                }

            });

        });

    });

}

/* ==========================================================
   IMAGE FADE-IN ANIMATION
========================================================== */

function initImageFade() {

    const images = document.querySelectorAll("img");

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("fade-in");

            observer.unobserve(entry.target);

        });

    }, {

        threshold: 0.15

    });

    images.forEach(img => observer.observe(img));

}
/* ==========================================================
   PART 4
   FINAL INITIALIZATION
========================================================== */

/* ==========================================================
   SIMPLE SCROLL ANIMATION
========================================================== */

function initScrollAnimations() {

    const elements = document.querySelectorAll("[data-aos]");

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("aos-animate");

            observer.unobserve(entry.target);

        });

    }, {
        threshold: 0.15
    });

    elements.forEach(el => observer.observe(el));

}

/* ==========================================================
   PERFORMANCE
========================================================== */

function optimizePerformance() {

    document.querySelectorAll("img").forEach(img => {

        img.loading = "lazy";

        img.decoding = "async";

    });

}

/* ==========================================================
   REDUCED MOTION
========================================================== */

function respectReducedMotion() {

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {

        document.documentElement.style.scrollBehavior = "auto";

        document.querySelectorAll("[data-aos]").forEach(el => {

            el.classList.add("aos-animate");

        });

    }

}

/* ==========================================================
   APP INITIALIZATION
========================================================== */

function initializeApp() {

    console.log("🚀 Initializing TechFest...");

    respectReducedMotion();

    initLoadingScreen();

    initNavigation();

    initSmoothScroll();

    initActiveNavigation();

    initBackToTop();

    initScrollProgress();

    initParticles();

    initParallax();

    initFAQ();

    initRippleEffect();

    initLazyLoading();

    initGalleryLightbox();

    initImageFade();

    initScrollAnimations();

    optimizePerformance();

    console.log("✅ TechFest Ready");

}

/* ==========================================================
   DOM READY
========================================================== */

if (document.readyState === "loading") {

    document.addEventListener(

        "DOMContentLoaded",

        initializeApp

    );

}

else {

    initializeApp();

}

/* ==========================================================
   CLEANUP
========================================================== */

window.addEventListener("beforeunload", () => {

    if (APP.animationFrame) {

        cancelAnimationFrame(APP.animationFrame);

    }

});