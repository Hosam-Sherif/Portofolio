// 1. AOS Animation Init
AOS.init({
    once: true,
    offset: 50,
    duration: 800,
    easing: 'ease-out-cubic'
});

// 2. Scroll to Top Logic
const scrollTopBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});
scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 3. Toast Helper + Copy Email Logic
const toast = document.getElementById("toast");
function showToast(message, isError = false) {
    toast.innerHTML = isError
        ? `${message} <i class="fas fa-times-circle"></i>`
        : `${message} <i class="fas fa-check-circle"></i>`;
    toast.classList.toggle("toast-error", isError);
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function copyEmail() {
    navigator.clipboard.writeText("hosamsherif12@gmail.com").then(() => {
        showToast("Email Copied to Clipboard!");
    });
}

// 3b. Contact Form Submission (Web3Forms)
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(contactForm);
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Accept": "application/json" },
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            showToast("Message sent successfully!");
            contactForm.reset();
        } else {
            showToast("Something went wrong. Please try again.", true);
        }
    } catch (error) {
        showToast("Network error. Please try again later.", true);
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// 4. Glow Effect Logic for Cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 5. Dark/Light Mode Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggleBtn.querySelector('i');

// Sync icon with the theme already applied by the early inline script (prevents FOUC)
if (body.classList.contains('light-mode')) {
    icon.classList.replace('fa-sun', 'fa-moon');
} else {
    icon.classList.replace('fa-moon', 'fa-sun');
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        icon.classList.replace('fa-sun', 'fa-moon');
    } else {
        localStorage.setItem('theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    }
});

// 6. Mobile Menu (Hamburger) Fix
const menuBtn = document.getElementById('menu-btn');
const navbar = document.getElementById('navbar');
const menuIcon = menuBtn.querySelector('i');
const navOverlay = document.getElementById('navOverlay');

function closeMenu() {
    navbar.classList.remove('active');
    navOverlay.classList.remove('active');
    menuIcon.classList.replace('fa-times', 'fa-bars');
}

menuBtn.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('active');
    navOverlay.classList.toggle('active', isOpen);
    if (isOpen) {
        menuIcon.classList.replace('fa-bars', 'fa-times');
    } else {
        menuIcon.classList.replace('fa-times', 'fa-bars');
    }
});

navOverlay.addEventListener('click', closeMenu);

document.querySelectorAll('#navbar a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// 7. Scrollspy - Highlight active nav link based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#navbar a');

const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach(section => scrollSpyObserver.observe(section));
