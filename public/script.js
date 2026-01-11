// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Form submissions
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const message = document.getElementById('contact-message').value.trim();
        
        const errorDiv = document.getElementById('contact-error');
        const successDiv = document.getElementById('contact-success');
        
        // Hide previous messages
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
        
        if (!name || !email || !message) {
            errorDiv.textContent = 'Please fill in all required fields.';
            errorDiv.style.display = 'block';
            return;
        }
        
        // Disable submit button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, phone, message })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                successDiv.textContent = 'Thank you for your message! We will get back to you soon.';
                successDiv.style.display = 'block';
                contactForm.reset();
            } else {
                errorDiv.textContent = data.error || 'Failed to send message. Please try again later.';
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            errorDiv.textContent = 'Failed to send message. Please check your connection and try again.';
            errorDiv.style.display = 'block';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thanks for subscribing to our newsletter!');
        newsletterForm.reset();
    });
}

// Booking Modal Functionality
const API_URL = (window.location.origin || 'http://localhost:3000') + '/api';

// Set minimum date to today
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// Open booking modal
function openBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Reset form
        const form = document.getElementById('booking-form');
        if (form) {
            form.reset();
            document.getElementById('booking-error').textContent = '';
            document.getElementById('booking-success').textContent = '';
        }
    }
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Event listeners for booking buttons
document.addEventListener('DOMContentLoaded', () => {
    const bookingBtnNav = document.getElementById('booking-btn-nav');
    const bookingBtnHero = document.getElementById('booking-btn-hero');
    const closeModal = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');

    if (bookingBtnNav) {
        bookingBtnNav.addEventListener('click', openBookingModal);
    }

    if (bookingBtnHero) {
        bookingBtnHero.addEventListener('click', openBookingModal);
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeBookingModal);
    }

    // Close modal when clicking outside
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBookingModal();
            }
        });
    }

    // Handle booking form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const errorDiv = document.getElementById('booking-error');
            const successDiv = document.getElementById('booking-success');
            const submitBtn = document.getElementById('submit-booking-btn');
            
            errorDiv.textContent = '';
            successDiv.textContent = '';
            
            // Get form data
            const formData = {
                name: document.getElementById('booking-name').value.trim(),
                email: document.getElementById('booking-email').value.trim(),
                phone: document.getElementById('booking-phone').value.trim(),
                booking_date: document.getElementById('booking-date').value,
                booking_time: document.getElementById('booking-time').value,
                number_of_guests: parseInt(document.getElementById('booking-guests').value),
                special_requests: document.getElementById('special-requests').value.trim()
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.phone || !formData.booking_date || 
                !formData.booking_time || !formData.number_of_guests || formData.number_of_guests < 1) {
                errorDiv.textContent = 'Please fill in all required fields.';
                return;
            }

            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                // Submit booking directly to server
                const bookingResponse = await fetch(`${API_URL}/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const bookingData = await bookingResponse.json();

                if (bookingResponse.ok) {
                    successDiv.textContent = `Booking request submitted successfully! We will contact you soon to confirm your booking. Booking ID: #${bookingData.booking.id}`;
                    bookingForm.reset();
                    
                    // Close modal after 5 seconds
                    setTimeout(() => {
                        closeBookingModal();
                    }, 5000);
                } else {
                    errorDiv.textContent = bookingData.error || 'Failed to submit booking. Please try again.';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Booking';
                }
            } catch (error) {
                console.error('Booking error:', error);
                errorDiv.textContent = 'Unable to submit booking. Please check your connection and try again.';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Booking';
            }
        });
    }
});

// CTA button handlers
document.querySelectorAll('.cta-button, .btn-primary').forEach(button => {
    if (button.textContent.includes('Book Now')) {
        button.addEventListener('click', openBookingModal);
    } else if (button.textContent.includes('Explore')) {
        button.addEventListener('click', () => {
            document.querySelector('#games')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

document.querySelectorAll('.btn-secondary').forEach(button => {
    if (button.textContent.includes('Trailer')) {
        button.addEventListener('click', () => {
            window.open('https://www.instagram.com/reel/DTDqfoRkzZ1/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', '_blank');
        });
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for animation
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .game-card, .event-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.style.color = '';
            });
            if (navLink) {
                navLink.style.color = 'var(--primary-color)';
            }
        }
    });
});

// Game card click animations
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// Event card button interactions
document.querySelectorAll('.event-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const eventCard = this.closest('.event-card');
        eventCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            eventCard.style.transform = '';
            alert('Event registration coming soon!');
        }, 200);
    });
});
