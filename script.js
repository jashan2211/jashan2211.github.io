// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
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
    
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
});

// Form validation and handling
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Mortgage Calculator Functions
class MortgageCalculator {
    constructor() {
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        const form = document.getElementById('mortgage-form');
        if (form) {
            form.addEventListener('input', () => this.calculateMortgage());
            form.addEventListener('change', () => this.calculateMortgage());
        }
    }
    
    calculateMortgage() {
        // Get form values
        const homePrice = parseFloat(document.getElementById('homePrice')?.value) || 0;
        const downPayment = parseFloat(document.getElementById('downPayment')?.value) || 0;
        const interestRate = parseFloat(document.getElementById('interestRate')?.value) || 0;
        const amortization = parseFloat(document.getElementById('amortization')?.value) || 25;
        const propertyTax = parseFloat(document.getElementById('propertyTax')?.value) || 0;
        const insurance = parseFloat(document.getElementById('insurance')?.value) || 0;
        
        // Calculate down payment percentage
        const downPaymentPercent = (downPayment / homePrice) * 100;
        document.getElementById('downPaymentPercent').textContent = downPaymentPercent.toFixed(1) + '%';
        
        // Calculate loan amount
        const loanAmount = homePrice - downPayment;
        
        // Calculate monthly payment
        const monthlyRate = (interestRate / 100) / 12;
        const numberOfPayments = amortization * 12;
        
        let monthlyPayment = 0;
        if (monthlyRate > 0) {
            monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        } else {
            monthlyPayment = loanAmount / numberOfPayments;
        }
        
        // Calculate total monthly cost
        const monthlyTax = propertyTax / 12;
        const monthlyInsurance = insurance / 12;
        const totalMonthlyPayment = monthlyPayment + monthlyTax + monthlyInsurance;
        
        // Calculate totals
        const totalInterest = (monthlyPayment * numberOfPayments) - loanAmount;
        const totalCost = homePrice + totalInterest + (propertyTax * amortization) + (insurance * amortization);
        
        // Update results
        this.updateResults({
            loanAmount,
            monthlyPayment,
            totalMonthlyPayment,
            totalInterest,
            totalCost,
            downPaymentPercent
        });
    }
    
    updateResults(results) {
        const elements = {
            loanAmount: document.getElementById('loanAmount'),
            monthlyPayment: document.getElementById('monthlyPayment'),
            totalMonthlyPayment: document.getElementById('totalMonthlyPayment'),
            totalInterest: document.getElementById('totalInterest'),
            totalCost: document.getElementById('totalCost')
        };
        
        if (elements.loanAmount) elements.loanAmount.textContent = this.formatCurrency(results.loanAmount);
        if (elements.monthlyPayment) elements.monthlyPayment.textContent = this.formatCurrency(results.monthlyPayment);
        if (elements.totalMonthlyPayment) elements.totalMonthlyPayment.textContent = this.formatCurrency(results.totalMonthlyPayment);
        if (elements.totalInterest) elements.totalInterest.textContent = this.formatCurrency(results.totalInterest);
        if (elements.totalCost) elements.totalCost.textContent = this.formatCurrency(results.totalCost);
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.initializeForm();
    }
    
    initializeForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Validate form data
        if (this.validateForm(data)) {
            this.submitForm(data);
        }
    }
    
    validateForm(data) {
        let isValid = true;
        const errors = [];
        
        // Validate required fields
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
            isValid = false;
        }
        
        if (!data.email || !validateEmail(data.email)) {
            errors.push('Please enter a valid email address');
            isValid = false;
        }
        
        if (!data.phone || !validatePhone(data.phone)) {
            errors.push('Please enter a valid phone number');
            isValid = false;
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
            isValid = false;
        }
        
        // Display errors
        this.displayErrors(errors);
        
        return isValid;
    }
    
    displayErrors(errors) {
        const errorContainer = document.getElementById('form-errors');
        if (errorContainer) {
            if (errors.length > 0) {
                errorContainer.innerHTML = '<ul>' + errors.map(error => `<li>${error}</li>`).join('') + '</ul>';
                errorContainer.style.display = 'block';
            } else {
                errorContainer.style.display = 'none';
            }
        }
    }
    
    async submitForm(data) {
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handler)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            document.getElementById('contact-form').reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Failed to send message. Please try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showSuccessMessage() {
        const successMsg = document.createElement('div');
        successMsg.className = 'alert alert-success';
        successMsg.textContent = 'Thank you for your message! Mac will get back to you within 24 hours.';
        
        const form = document.getElementById('contact-form');
        form.parentNode.insertBefore(successMsg, form);
        
        setTimeout(() => successMsg.remove(), 5000);
    }
    
    showErrorMessage(message) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-error';
        errorMsg.textContent = message;
        
        const form = document.getElementById('contact-form');
        form.parentNode.insertBefore(errorMsg, form);
        
        setTimeout(() => errorMsg.remove(), 5000);
    }
}

// Property Filter and Search
class PropertyFilter {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.initializeFilters();
    }
    
    initializeFilters() {
        const priceFilter = document.getElementById('priceFilter');
        const typeFilter = document.getElementById('typeFilter');
        const bedroomFilter = document.getElementById('bedroomFilter');
        const searchInput = document.getElementById('searchInput');
        
        if (priceFilter) priceFilter.addEventListener('change', () => this.applyFilters());
        if (typeFilter) typeFilter.addEventListener('change', () => this.applyFilters());
        if (bedroomFilter) bedroomFilter.addEventListener('change', () => this.applyFilters());
        if (searchInput) searchInput.addEventListener('input', () => this.applyFilters());
    }
    
    applyFilters() {
        const priceRange = document.getElementById('priceFilter')?.value || 'all';
        const propertyType = document.getElementById('typeFilter')?.value || 'all';
        const bedrooms = document.getElementById('bedroomFilter')?.value || 'all';
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        
        this.filteredProperties = this.properties.filter(property => {
            // Price filter
            if (priceRange !== 'all') {
                const [min, max] = priceRange.split('-').map(Number);
                if (max && (property.price < min || property.price > max)) return false;
                if (!max && property.price < min) return false;
            }
            
            // Type filter
            if (propertyType !== 'all' && property.type !== propertyType) return false;
            
            // Bedroom filter
            if (bedrooms !== 'all' && property.bedrooms != bedrooms) return false;
            
            // Search filter
            if (searchTerm && !property.address.toLowerCase().includes(searchTerm) && 
                !property.neighborhood.toLowerCase().includes(searchTerm)) return false;
            
            return true;
        });
        
        this.renderProperties();
    }
    
    renderProperties() {
        const container = document.getElementById('properties-grid');
        if (!container) return;
        
        if (this.filteredProperties.length === 0) {
            container.innerHTML = '<p class="no-results">No properties found matching your criteria.</p>';
            return;
        }
        
        container.innerHTML = this.filteredProperties.map(property => this.renderPropertyCard(property)).join('');
    }
    
    renderPropertyCard(property) {
        return `
            <div class="property-card">
                <div class="property-image">
                    <img src="${property.image}" alt="${property.address}" loading="lazy">
                    <div class="property-price">$${property.price.toLocaleString()}</div>
                </div>
                <div class="property-details">
                    <h3>${property.address}</h3>
                    <p class="property-neighborhood">${property.neighborhood}</p>
                    <div class="property-features">
                        <span><i class="fas fa-bed"></i> ${property.bedrooms} bed</span>
                        <span><i class="fas fa-bath"></i> ${property.bathrooms} bath</span>
                        <span><i class="fas fa-ruler-combined"></i> ${property.sqft} sq ft</span>
                    </div>
                    <button class="btn btn-outline property-btn">View Details</button>
                </div>
            </div>
        `;
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mortgage calculator if on mortgage page
    if (document.getElementById('mortgage-form')) {
        new MortgageCalculator();
    }
    
    // Initialize contact form if on contact page
    if (document.getElementById('contact-form')) {
        new ContactForm();
    }
    
    // Initialize property filter if on listings page
    if (document.getElementById('properties-grid')) {
        const propertyFilter = new PropertyFilter();
        
        // Sample property data (replace with actual data source)
        propertyFilter.properties = [
            {
                address: "123 Maple Street",
                neighborhood: "Westmount",
                price: 450000,
                bedrooms: 3,
                bathrooms: 2,
                sqft: 1200,
                type: "house",
                image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
            },
            {
                address: "456 Oak Avenue",
                neighborhood: "Riverbend",
                price: 320000,
                bedrooms: 2,
                bathrooms: 2,
                sqft: 950,
                type: "condo",
                image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
            },
            {
                address: "789 Pine Road",
                neighborhood: "Glenora",
                price: 680000,
                bedrooms: 4,
                bathrooms: 3,
                sqft: 1800,
                type: "house",
                image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
            }
        ];
        
        propertyFilter.filteredProperties = propertyFilter.properties;
        propertyFilter.renderProperties();
    }
});