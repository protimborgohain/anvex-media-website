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
const checkboxes = document.querySelectorAll('.service-checkbox');
const priceDisplay = document.getElementById('calculatedPrice');

// Open/Close Custom Package Modal
function openModal() { packageModal.style.display = "block"; }
function closeModal() { packageModal.style.display = "none"; }

// Open/Close Consultation Modal
function openConsultationModal() { consultationModal.style.display = "block"; }
function closeConsultationModal() { consultationModal.style.display = "none"; }

// Close modals if user clicks outside of the content box
window.onclick = function(event) {
    if (event.target == packageModal) {
        packageModal.style.display = "none";
    }
    if (event.target == consultationModal) {
        consultationModal.style.display = "none";
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
    event.preventDefault(); // Prevent the page from reloading

    // Get input values
    const name = document.getElementById('c_name').value;
    const business = document.getElementById('c_business').value;
    const category = document.getElementById('c_category').value;
    const location = document.getElementById('c_location').value;
    const time = document.getElementById('c_time').value;

    const phoneNumber = "918011595012";

    // Format the message for WhatsApp
    const message = `*New Consultation Request*%0A%0A*Name:* ${name}%0A*Business Name:* ${business}%0A*Category:* ${category}%0A*Location:* ${location}%0A*Preferred Time:* ${time}`;

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Close the modal and reset the form
    closeConsultationModal();
    document.getElementById('consultationForm').reset();
}
