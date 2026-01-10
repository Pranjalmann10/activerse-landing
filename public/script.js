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
// Stripe Publishable Key - Replace with your actual key from Stripe Dashboard
// Note: Publishable keys are meant to be public (client-side), but secret key is kept server-side only
// Get your key from: https://dashboard.stripe.com/test/apikeys
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SnuPZCwLhFFgrTcWROG8BfsxxS6dOOJffjmSGB9akcsns3zsy8bNFcBgEtW8lfLlfTHr0MVAiA2JsNkqzuIZ5tu00Gli6IcC7';

// Initialize Stripe
let stripe = null;
let elements = null;
let cardElement = null;
let paymentIntentClientSecret = null;

// Calculate booking price: 1000 INR per person per 1-hour slot
function calculatePrice(numberOfGuests) {
    const PRICE_PER_PERSON = 1000; // 1000 INR per person
    return PRICE_PER_PERSON * numberOfGuests;
}

// Set minimum date to today
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Initialize Stripe (using test key - replace with your actual key)
    if (typeof Stripe !== 'undefined') {
        try {
            if (STRIPE_PUBLISHABLE_KEY && STRIPE_PUBLISHABLE_KEY.includes('pk_')) {
                stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
                console.log('Stripe initialized');
            } else {
                console.error('Invalid Stripe publishable key. Please configure your Stripe key in script.js');
            }
        } catch (error) {
            console.error('Error initializing Stripe:', error);
        }
    } else {
        console.error('Stripe.js library not loaded. Check browser console for errors.');
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

    // Update price when number of guests changes
    const bookingGuestsInput = document.getElementById('booking-guests');
    const priceDisplay = document.getElementById('total-amount');
    const paymentSection = document.getElementById('payment-section');
    
    function updatePrice() {
        const numberOfGuests = parseInt(bookingGuestsInput?.value) || 0;
        
        if (numberOfGuests > 0) {
            const price = calculatePrice(numberOfGuests);
            if (priceDisplay) {
                priceDisplay.textContent = price.toLocaleString('en-IN');
            }
            if (paymentSection) {
                paymentSection.style.display = 'block';
            }
        } else {
            if (paymentSection) {
                paymentSection.style.display = 'none';
            }
        }
    }
    
    if (bookingGuestsInput) {
        bookingGuestsInput.addEventListener('input', async () => {
            updatePrice();
            await initializePayment();
        });
    }
    
    // Initialize Stripe payment form
    let paymentInitializing = false;
    
    async function initializePayment() {
        const numberOfGuests = parseInt(bookingGuestsInput?.value) || 0;
        const cardErrors = document.getElementById('card-errors');
        const paymentSection = document.getElementById('payment-section');
        
        if (numberOfGuests === 0) {
            if (paymentSection) {
                paymentSection.style.display = 'none';
            }
            // Clean up existing elements
            if (cardElement) {
                cardElement.unmount();
                cardElement = null;
                elements = null;
            }
            paymentIntentClientSecret = null;
            return;
        }
        
        // Prevent multiple simultaneous initialization attempts
        if (paymentInitializing) {
            return;
        }
        
        // Check if Stripe is loaded
        if (!stripe) {
            if (paymentSection) {
                paymentSection.style.display = 'block';
            }
            if (cardErrors) {
                cardErrors.innerHTML = '<strong>Payment system error:</strong> Stripe is not initialized. Please configure your Stripe Publishable Key in script.js (line 73).<br><small>Get your keys from: https://dashboard.stripe.com/test/apikeys</small>';
                cardErrors.style.color = '#ff6b7a';
            }
            return;
        }
        
        paymentInitializing = true;
        
        // Show loading state
        if (cardErrors) {
            cardErrors.textContent = 'Loading payment form...';
            cardErrors.style.color = 'var(--primary-color)';
        }
        
        // Show payment section
        if (paymentSection) {
            paymentSection.style.display = 'block';
        }
        
        try {
            // Clean up previous card element if exists
            if (cardElement) {
                cardElement.unmount();
                cardElement = null;
                elements = null;
            }
            
            // Create payment intent
            const response = await fetch(`${API_URL}/payment/create-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number_of_guests: numberOfGuests })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create payment intent');
            }
            
            if (data.clientSecret) {
                paymentIntentClientSecret = data.clientSecret;
                
                // Clear loading message
                if (cardErrors) {
                    cardErrors.textContent = '';
                }
                
                // Create Stripe Elements
                elements = stripe.elements();
                cardElement = elements.create('card', {
                    style: {
                        base: {
                            color: '#ffffff',
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: '16px',
                            '::placeholder': {
                                color: '#a0aec0'
                            }
                        },
                        invalid: {
                            color: '#ff6b7a'
                        }
                    }
                });
                
                cardElement.mount('#card-element');
                
                // Handle real-time validation errors
                cardElement.on('change', ({error}) => {
                    if (cardErrors) {
                        if (error) {
                            cardErrors.textContent = error.message;
                            cardErrors.style.color = '#ff6b7a';
                        } else {
                            cardErrors.textContent = '';
                        }
                    }
                });
            } else {
                throw new Error('No payment intent received from server');
            }
        } catch (error) {
            console.error('Error initializing payment:', error);
            if (cardErrors) {
                const errorMsg = error.message || 'Unknown error';
                if (errorMsg.includes('API key') || errorMsg.includes('Stripe')) {
                    cardErrors.innerHTML = `<strong>Stripe Configuration Error:</strong> ${errorMsg}<br><small>Please configure your Stripe API keys:<br>1. Get keys from https://dashboard.stripe.com/test/apikeys<br>2. Update script.js line 73 (Publishable Key)<br>3. Update server.js line 9 (Secret Key)</small>`;
                } else {
                    cardErrors.textContent = `Payment Error: ${errorMsg}`;
                }
                cardErrors.style.color = '#ff6b7a';
            }
            paymentIntentClientSecret = null;
            
            // Unmount card element on error
            if (cardElement) {
                try {
                    cardElement.unmount();
                } catch (e) {}
                cardElement = null;
                elements = null;
            }
        } finally {
            paymentInitializing = false;
        }
    }

    // Handle booking form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const errorDiv = document.getElementById('booking-error');
            const successDiv = document.getElementById('booking-success');
            const submitBtn = document.getElementById('submit-booking-btn');
            const cardErrors = document.getElementById('card-errors');
            
            errorDiv.textContent = '';
            successDiv.textContent = '';
            cardErrors.textContent = '';
            
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

            if (!paymentIntentClientSecret) {
                errorDiv.textContent = 'Please wait for payment form to load.';
                await initializePayment();
                return;
            }

            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing Payment...';

            try {
                // Confirm payment with Stripe
                const {error: stripeError, paymentIntent} = await stripe.confirmCardPayment(
                    paymentIntentClientSecret,
                    {
                        payment_method: {
                            card: cardElement,
                            billing_details: {
                                name: formData.name,
                                email: formData.email,
                                phone: formData.phone
                            }
                        }
                    }
                );

                if (stripeError) {
                    errorDiv.textContent = stripeError.message;
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Proceed to Payment';
                    return;
                }

                if (paymentIntent.status === 'succeeded') {
                    // Payment successful, now create booking
                    submitBtn.textContent = 'Confirming Booking...';
                    
                    const bookingResponse = await fetch(`${API_URL}/bookings`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ...formData,
                            payment_intent_id: paymentIntent.id
                        })
                    });

                    const bookingData = await bookingResponse.json();

                    if (bookingResponse.ok) {
                        successDiv.textContent = `Booking confirmed! Your booking ID is #${bookingData.booking.id}. Payment of ₹${bookingData.booking.amount_paid.toLocaleString('en-IN')} received. We'll send a confirmation email shortly.`;
                        bookingForm.reset();
                        paymentSection.style.display = 'none';
                        if (cardElement) {
                            cardElement.unmount();
                            cardElement = null;
                            elements = null;
                        }
                        paymentIntentClientSecret = null;
                        
                        // Close modal after 5 seconds
                        setTimeout(() => {
                            closeBookingModal();
                        }, 5000);
                    } else {
                        errorDiv.textContent = bookingData.error || 'Payment succeeded but booking failed. Please contact support.';
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Proceed to Payment';
                    }
                }
            } catch (error) {
                console.error('Booking error:', error);
                errorDiv.textContent = 'Unable to process payment. Please make sure the server is running on http://localhost:3000';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Proceed to Payment';
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
