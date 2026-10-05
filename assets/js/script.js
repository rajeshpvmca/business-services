
document.addEventListener('DOMContentLoaded', () => {
    // Load Header and Footer
    Promise.all([
        fetch('header.html').then(response => response.text()),
        fetch('footer.html').then(response => response.text())
    ]).then(([headerHtml, footerHtml]) => {
        document.getElementById('header-placeholder').innerHTML = headerHtml;
        document.getElementById('footer-placeholder').innerHTML = footerHtml;
        
        initApp();
    }).catch(err => {
        console.error('Error loading components. Please run via a local server.', err);
    });
});

function initApp() {
    highlightActiveLink();

    // AOS Init
    if(typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Sticky Navbar
    const navbarShrink = function () {
        const mainNav = document.body.querySelector('#mainNav');
        const topbar = document.body.querySelector('#topbar');
        
        if (!mainNav) return;
        if (window.scrollY === 0) {
            mainNav.classList.remove('navbar-shrink');
            if (topbar) topbar.classList.remove('hide');
        } else {
            mainNav.classList.add('navbar-shrink');
            if (topbar) topbar.classList.add('hide');
        }
    };
    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    // Perfect Mobile Menu Custom Toggle
    const mobileMenu = document.getElementById('navbarResponsive');
    const toggler = document.querySelector('.navbar-toggler');
    
    if (mobileMenu && toggler) {
        toggler.addEventListener('click', (e) => {
            e.preventDefault();
            const isShowing = mobileMenu.classList.contains('show');
            if (isShowing) {
                // Close
                mobileMenu.classList.remove('show');
                toggler.setAttribute('aria-expanded', 'false');
                
            } else {
                // Open
                mobileMenu.classList.add('show');
                toggler.setAttribute('aria-expanded', 'true');
                
            }
        });

        // Close when clicking a link
        const navLinks = mobileMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                    toggler.setAttribute('aria-expanded', 'false');
                    
                }
            });
        });

        // Ensure menu resets on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992 && mobileMenu.classList.contains('show')) {
                mobileMenu.classList.remove('show');
                toggler.setAttribute('aria-expanded', 'false');
                
            }
        });
    }

    // Scroll to Top
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollTopBtn.style.display = "block";
        } else {
            scrollTopBtn.style.display = "none";
        }
    };

    scrollTopBtn.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Three.js Background (if container exists)
    const threeContainer = document.getElementById('three-bg');
    if(threeContainer && typeof THREE !== 'undefined') {
        initThreeJS(threeContainer);
    }
    
    // Swiper Hero Slider
    if(typeof Swiper !== 'undefined') {
        const heroSwiper = new Swiper('.heroSwiper', {
            speed: 1000,
            
            loop: true,
            effect: 'fade',
            fadeEffect: { crossFade: true },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                init: function () {
                    // GSAP Animations for first slide on load
                    if(typeof gsap !== 'undefined') {
                        gsap.from(".swiper-slide-active .hero-title", {opacity: 0, y: 50, duration: 1, delay: 0.5});
                        gsap.from(".swiper-slide-active .hero-subtitle", {opacity: 0, y: 50, duration: 1, delay: 0.7});
                        gsap.from(".swiper-slide-active .hero-btn", {opacity: 0, scale: 0.8, duration: 0.5, delay: 1});
                    }
                },
                slideChangeTransitionStart: function () {
                    if(typeof gsap !== 'undefined') {
                        gsap.fromTo(".swiper-slide-active .hero-title", {opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1});
                        gsap.fromTo(".swiper-slide-active .hero-subtitle", {opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1, delay: 0.2});
                        gsap.fromTo(".swiper-slide-active .hero-btn", {opacity: 0, scale: 0.8}, {opacity: 1, scale: 1, duration: 0.5, delay: 0.4});
                    }
                }
            }
        });
    }
}

function initThreeJS(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xf05a28, wireframe: true, transparent: true, opacity: 0.2 });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    camera.position.z = 30;
    
    function animate() {
        requestAnimationFrame(animate);
        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

    // Testimonial Swiper
    if(typeof Swiper !== 'undefined' && document.querySelector('.testimonialSwiper')) {
        new Swiper('.testimonialSwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.testimonialSwiper .swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                }
            }
        });
    }



function highlightActiveLink() {
    const path = window.location.pathname;
    let page = path.split('/').pop();
    // Ignore query params or hashes
    page = page.split('?')[0].split('#')[0];
    if (!page || page === '') page = 'index.html';
    
    const navLinks = document.querySelectorAll('#mainNav .nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}


