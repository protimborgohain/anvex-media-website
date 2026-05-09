// ==========================================
// 1. FIREBASE INITIALIZATION
// ==========================================
const firebaseConfig = {
    apiKey: atob("QUl6YVN5QXh4MzBETFBzVV9DcU1xaWhTMUhFLTNrTWdSeFkzb2lv"),
    authDomain: "anvex-media.firebaseapp.com",
    projectId: "anvex-media",
    storageBucket: "anvex-media.firebasestorage.app",
    messagingSenderId: "941745194100",
    appId: "1:941745194100:web:8a6b718bb4bd54d9733d21"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth(); 


// ==========================================
// 1.5 DYNAMIC AUTHENTICATION STATE & LOGOUT
// ==========================================
auth.onAuthStateChanged(async (user) => {
    const authBtn = document.getElementById('authBtn');
    const dashBtn = document.getElementById('dashBtn');

    if (user) {
        if (authBtn) {
            authBtn.innerHTML = '<i class="fas fa-sign-out-alt" style="margin-right: 10px;"></i> Log Out';
            authBtn.style.color = '#ff4d4d'; 
            authBtn.href = "#";
            
            authBtn.onclick = (e) => {
                e.preventDefault();
                auth.signOut().then(() => {
                    window.location.reload(); 
                });
            };
        }

        if (dashBtn) {
            try {
                const userDoc = await db.collection('users').doc(user.email).get();
                if (userDoc.exists && userDoc.data().role === 'admin') {
                    dashBtn.href = "admin.html"; 
                } else {
                    dashBtn.href = "client.html"; 
                }
            } catch (err) {
                console.error("Error fetching role: ", err);
                dashBtn.href = "client.html"; 
            }
        }
    } 
});


// ==========================================
// 2. UI & SCROLL ANIMATIONS
// ==========================================

window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

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


// ==========================================
// 3. MODALS LOGIC
// ==========================================
const packageModal = document.getElementById("customPackageModal");
const consultationModal = document.getElementById("consultationModal");
const videoModal = document.getElementById("videoModal");
const popupVideoPlayer = document.getElementById("popupVideoPlayer");

const checkboxes = document.querySelectorAll('.service-checkbox');
const priceDisplay = document.getElementById('calculatedPrice');

function openModal() { packageModal.style.display = "block"; }
function closeModal() { packageModal.style.display = "none"; }

function openConsultationModal() { consultationModal.style.display = "block"; }
function closeConsultationModal() { consultationModal.style.display = "none"; }

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

window.onclick = function(event) {
    if (event.target == packageModal) packageModal.style.display = "none";
    if (event.target == consultationModal) consultationModal.style.display = "none";
    if (event.target == videoModal) closeVideoModal();
}

function calculateTotal() {
    let total = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            total += parseInt(checkbox.value);
        }
    });
    if(priceDisplay) priceDisplay.innerText = total.toLocaleString('en-IN');
}

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', calculateTotal);
});


// ==========================================
// 4. FIREBASE DATABASE SUBMISSION
// ==========================================
async function sendToWhatsApp(event) {
    event.preventDefault(); 

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    // Get input values
    const name = document.getElementById('c_name').value.trim();
    const business = document.getElementById('c_business').value.trim();
    const category = document.getElementById('c_category').value.trim();
    const location = document.getElementById('c_location').value.trim();
    const time = document.getElementById('c_time').value.trim();
    const phone = document.getElementById('c_phone').value.trim();

    // Validate Phone Number
    if (phone.length !== 10 || isNaN(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }

    try {
        // 1. SAVE TO FIREBASE "inquiries" COLLECTION WITH PHONE NUMBER
        await db.collection("inquiries").add({
            name: name,
            business: business,
            category: category,
            location: location,
            phone: "+91 " + phone,
            preferredTime: time,
            packageType: "Consultation Request", 
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status: "new"
        });

        console.log("Lead successfully saved to database!");

        // 2. OPEN WHATSAPP 
        const whatsappNumber = "918011595012";
        const message = `*New Consultation Request*%0A%0A*Name:* ${name}%0A*Business Name:* ${business}%0A*Phone:* +91 ${phone}%0A*Category:* ${category}%0A*Location:* ${location}%0A*Preferred Time:* ${time}`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');

        // 3. RESET FORM
        closeConsultationModal();
        document.getElementById('consultationForm').reset();

    } catch (error) {
        console.error("Error saving lead: ", error);
        alert("Oops! Something went wrong saving your request. Please try again.");
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}


// ==========================================
// 5. HAMBURGER MENU & VIDEO SCROLL
// ==========================================
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
