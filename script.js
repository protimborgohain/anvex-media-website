// Sticky Navbar
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Intersection Observer for Fade-Up Animations
const observerOptions = { root: null, threshold: 0.1 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if(entry.target.id === 'about') runCounters();
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(section => {
    observer.observe(section);
});

// Number Counter Animation
let countersRan = false;
function runCounters() {
    if(countersRan) return;
    countersRan = true;
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 25);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

// === Modals Logic ===
const packageModal = document.getElementById("customPackageModal");
const consultationModal = document.getElementById("consultationModal");
const videoModal = document.getElementById("videoModal");
const popupVideoPlayer = document.getElementById("popupVideoPlayer");

const checkboxes = document.querySelectorAll('.service-checkbox');
const priceDisplay = document.getElementById('calculatedPrice');

// Open/Close Custom Package Modal
function openModal() { packageModal.style.display = "block"; }
function closeModal() { packageModal.style.display = "none"; }

// Open/Close Consultation Modal
function openConsultationModal() { consultationModal.style.display = "block"; }
function closeConsultationModal() { consultationModal.style.display = "none"; }

// NEW: Open/Close Video Player Modal
function openVideoModal(src) {
    videoModal.style.display = "flex"; 
    popupVideoPlayer.src = src;
    popupVideoPlayer.play();
}

function closeVideoModal() {
    videoModal.style.display = "none";
    popupVideoPlayer.pause();
    popupVideoPlayer.src = ""; 
}

// Close modals if user clicks outside of the content box
window.onclick = function(event) {
    if (event.target == packageModal) {
        packageModal.style.display = "none";
    }
    if (event.target == consultationModal) {
        consultationModal.style.display = "none";
    }
    if (event.target == videoModal) {
        closeVideoModal();
    }
}

// Calculate custom price dynamically
function calculateTotal() {
    let total = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            total += parseInt(checkbox.value);
        }
    });
    priceDisplay.innerText = total.toLocaleString('en-IN');
}

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', calculateTotal);
});


// === WhatsApp Form Submission Logic ===
function sendToWhatsApp(event) {
    event.preventDefault(); 

    const name = document.getElementById('c_name').value;
    const business = document.getElementById('c_business').value;
    const category = document.getElementById('c_category').value;
    const location = document.getElementById('c_location').value;
    const time = document.getElementById('c_time').value;

    const phoneNumber = "918011595012";
    const message = `*New Consultation Request*%0A%0A*Name:* ${name}%0A*Business Name:* ${business}%0A*Category:* ${category}%0A*Location:* ${location}%0A*Preferred Time:* ${time}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');

    closeConsultationModal();
    document.getElementById('consultationForm').reset();
}

// === Hamburger Menu Toggle Logic ===
function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

window.addEventListener('click', function(e) {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navMenu && menuToggle) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    }
});

// === JavaScript Auto-Scroll for Video Marquee ===
const marquee = document.getElementById('videoMarquee');

if (marquee) {
    let isPaused = false;
    let scrollSpeed = 1; 

    function autoScroll() {
        if (!isPaused) {
            marquee.scrollLeft += scrollSpeed;
            
            if (marquee.scrollLeft >= (marquee.scrollWidth / 2)) {
                marquee.scrollLeft = 0;
            }
        }
        requestAnimationFrame(autoScroll);
    }

    marquee.addEventListener('mouseenter', () => isPaused = true);
    marquee.addEventListener('mouseleave', () => isPaused = false);
    
    marquee.addEventListener('touchstart', () => isPaused = true);
    marquee.addEventListener('touchend', () => {
        setTimeout(() => { isPaused = false; }, 2000);
    });

    autoScroll();
}
