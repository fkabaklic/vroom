// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navMenu && navMenu.classList.contains('active') && 
                !event.target.closest('.nav-menu') && 
                !event.target.closest('.mobile-menu-btn')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add active class to current navigation item
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-menu a[href]').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('.vehicle-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn') && !e.target.closest('.vehicle-actions') && !e.target.closest('form')) {
                const vehicleLink = this.querySelector('a[href*="/vehicle/"]');
                if (vehicleLink) {
                    vehicleLink.click();
                }
            }
        });

        // Add loading state to buttons
        const buttons = card.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                if (!this.classList.contains('loading')) {
                    this.classList.add('loading');
                    const originalText = this.innerHTML;
                    this.setAttribute('data-original-text', originalText);
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                    
                    // Remove loading state after a short delay (simulate loading)
                    setTimeout(() => {
                        this.classList.remove('loading');
                        this.innerHTML = originalText;
                    }, 2000);
                }
            });
        });

        // Handle form submissions with loading state
        const forms = card.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitButton = this.querySelector('button[type="submit"]');
                if (submitButton && !submitButton.classList.contains('loading')) {
                    submitButton.classList.add('loading');
                    const originalText = submitButton.innerHTML;
                    submitButton.setAttribute('data-original-text', originalText);
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
                }
            });
        });
    });

    // Enhanced search functionality
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-form input[name="searchcriteria"]');
    const searchSuggestions = document.getElementById('searchSuggestions');

    if (searchForm && searchInput) {
        // Add search input focus effects
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });

        // Add search form submission with loading state
        searchForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('.search-btn');
            if (submitBtn && !submitBtn.classList.contains('loading')) {
                submitBtn.classList.add('loading');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                // Remove loading state after form submission
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    submitBtn.innerHTML = '<i class="fas fa-search"></i>';
                }, 1000);
            }
        });

        // Add search input validation
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length < 2) {
                this.setCustomValidity('Please enter at least 2 characters');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});