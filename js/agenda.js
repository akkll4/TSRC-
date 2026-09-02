// ============================================
// AGENDA PAGE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    initializeDayTabs();
    initializeDownloadButtons();
    initializeScrollAnimations();
});

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            });
        });
    }
}

// Day Tabs Filtering
function initializeDayTabs() {
    const dayTabs = document.querySelectorAll('.day-tab');
    const agendaDays = document.querySelectorAll('.agenda-day');
    
    dayTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetDay = tab.getAttribute('data-day');
            
            // Update active tab
            dayTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show/hide days
            agendaDays.forEach(day => {
                if (targetDay === 'all') {
                    day.style.display = 'block';
                } else if (day.getAttribute('data-day') === targetDay) {
                    day.style.display = 'block';
                } else {
                    day.style.display = 'none';
                }
            });
            
            // Show/hide no results message
            const visibleDays = Array.from(agendaDays).filter(day => 
                day.style.display !== 'none'
            );
            const noResults = document.getElementById('noResults');
            
            if (noResults) {
                if (visibleDays.length === 0) {
                    noResults.style.display = 'block';
                } else {
                    noResults.style.display = 'none';
                }
            }
            
            // Smooth scroll to content
            document.querySelector('.agenda-content')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// Global function for "Show All Days" button
window.showAllDays = function() {
    const allTab = document.querySelector('.day-tab[data-day="all"]');
    if (allTab) {
        allTab.click();
    }
};

// Download Buttons
function initializeDownloadButtons() {
    // PDF Download
    const downloadBtn = document.getElementById('downloadAgendaBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            showToast('Preparing PDF...', 'info');
            
            // In production, this would generate/download actual PDF
            setTimeout(() => {
                showToast('PDF download started!', 'success');
                // window.open('assets/TSMRC2026_Agenda.pdf', '_blank');
            }, 1500);
        });
    }
    
    // Add to Calendar
    const calendarBtn = document.getElementById('addToCalendarBtn');
    if (calendarBtn) {
        calendarBtn.addEventListener('click', () => {
            showToast('Adding to calendar...', 'info');
            
            // Create calendar events (simplified)
            const events = [
                {
                    title: 'TSMRC 2026 - Research Workshop',
                    start: '20261028T090000',
                    end: '20261028T150000',
                    location: 'Tanta University, Faculty of Medicine'
                },
                {
                    title: 'TSMRC 2026 - Conference Day',
                    start: '20261029T090000',
                    end: '20261029T160000',
                    location: 'Tanta University, Faculty of Medicine'
                }
            ];
            
            // Generate Google Calendar URL
            const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('TSMRC 2026 Conference')}&dates=20261028/20261029&details=Research in the Era of Artificial Intelligence&location=Tanta University, Egypt`;
            
            setTimeout(() => {
                window.open(calUrl, '_blank');
                showToast('Opening Google Calendar...', 'success');
            }, 1000);
        });
    }
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe timeline items and cards
    document.querySelectorAll('.timeline-item, .session-card, .workshop-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Toast Notification
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existing = document.querySelector('.agenda-toast');
    if (existing) existing.remove();
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `agenda-toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style toast
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    // Auto-remove
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

console.log('📋 TSMRC 2026 Agenda Page Loaded Successfully!');