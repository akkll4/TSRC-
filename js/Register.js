// ============================================
// 1. SUPABASE INIT
// ============================================
let supabaseClient = null;

function initSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase CDN not loaded!');
        return null;
    }
    try {
        const { createClient } = window.supabase;
        return createClient(
            'https://ijertpdemtmojjrwtpvg.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZXJ0cGRlbXRtb2pqcnd0cHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyODE2NzMsImV4cCI6MjA5Nzg1NzY3M30.xNDz_Hv7yxxjujZjUOo7Ocf2s9rmBtIDo3ewCzyL-VA',
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                }
            }
        );
    } catch (e) {
        console.error('❌ Supabase init error:', e);
        return null;
    }
}

supabaseClient = initSupabase();

// ============================================
// 2. UI INTERACTION (Mobile Menu & Tabs)
// ============================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars', !navLinks.classList.contains('active'));
        icon.classList.toggle('fa-times', navLinks.classList.contains('active'));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });
}

const tabBtns = document.querySelectorAll('.tab-btn');
const formCards = document.querySelectorAll('.form-card');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        formCards.forEach(card => card.classList.remove('active'));
        const targetForm = document.getElementById(targetTab + 'Form');
        if (targetForm) targetForm.classList.add('active');
        
        window.scrollTo({
            top: document.querySelector('.registration-container').offsetTop - 100,
            behavior: 'smooth'
        });
    });
});

// ============================================
// 3. CO-AUTHORS MANAGEMENT
// ============================================
let coAuthorCount = 0;
const addCoAuthorBtn = document.getElementById('addCoAuthorBtn');
const coAuthorsList = document.getElementById('coAuthorsList');

if (addCoAuthorBtn) {
    addCoAuthorBtn.addEventListener('click', () => {
        coAuthorCount++;
        const coAuthorHTML = `
            <div class="co-author-item" id="coAuthor${coAuthorCount}">
                <button type="button" class="co-author-remove" onclick="removeCoAuthor(${coAuthorCount})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-input" name="coAuthor${coAuthorCount}Name" placeholder="Full name">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" name="coAuthor${coAuthorCount}Email" placeholder="email@example.com">
                    </div>
                    <div class="form-group">
                        <label class="form-label">University</label>
                        <input type="text" class="form-input" name="coAuthor${coAuthorCount}University" placeholder="University name">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Country</label>
                        <input type="text" class="form-input" name="coAuthor${coAuthorCount}Country" placeholder="Country">
                    </div>
                </div>
            </div>
        `;
        coAuthorsList.insertAdjacentHTML('beforeend', coAuthorHTML);
    });
}

window.removeCoAuthor = function(id) {
    const coAuthor = document.getElementById(`coAuthor${id}`);
    if (coAuthor) coAuthor.remove();
};

// ============================================
// 4. PREVIOUS SUBMISSIONS - Conditional Fields
// ============================================
const previousSubmissionRadios = document.querySelectorAll('input[name="previousSubmission"]');
const previousSubmissionDetails = document.getElementById('previousSubmissionDetails');
const conditionalFields = document.querySelectorAll('.conditional-field');

if (previousSubmissionRadios.length > 0) {
    previousSubmissionRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'yes') {
                if (previousSubmissionDetails) previousSubmissionDetails.style.display = 'grid';
                conditionalFields.forEach(field => field.setAttribute('required', 'required'));
            } else {
                if (previousSubmissionDetails) previousSubmissionDetails.style.display = 'none';
                conditionalFields.forEach(field => {
                    field.removeAttribute('required');
                    field.value = '';
                });
            }
        });
    });
}

// ============================================
// PUBLICATION STATUS - Conditional Fields (Question 2)
// ============================================
const publicationStatusRadios = document.querySelectorAll('input[name="publicationStatus"]');
const publicationDetails = document.getElementById('publicationDetails');
const publicationFields = document.querySelectorAll('.publication-field');

if (publicationStatusRadios.length > 0) {
    publicationStatusRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'abstract_published' || e.target.value === 'full_paper_published') {
                if (publicationDetails) publicationDetails.style.display = 'grid';
                publicationFields.forEach(field => field.setAttribute('required', 'required'));
            } else {
                if (publicationDetails) publicationDetails.style.display = 'none';
                publicationFields.forEach(field => {
                    field.removeAttribute('required');
                    field.value = '';
                });
            }
        });
    });
}


// ============================================
// 5. WORD COUNTER - Combined 350 Words Limit
// ============================================
const MAX_TOTAL_WORDS = 350;
const MIN_TOTAL_WORDS = 50;
const abstractTextareas = document.querySelectorAll('.abstract-textarea');
const totalWordCountDisplay = document.getElementById('totalWordCount');




function countWords(text) {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function updateWordCounters() {
    let totalWords = 0;
    
    abstractTextareas.forEach(textarea => {
        const words = countWords(textarea.value);
        totalWords += words;
        
        const target = textarea.getAttribute('name');
        const counter = document.querySelector(`.word-count-indicator[data-target="${target}"]`);
        if (counter) {
            counter.textContent = `${words} words`;
            counter.classList.remove('warning', 'error');
            if (words > 150) counter.classList.add('warning');
            if (words > 200) counter.classList.add('error');
        }
    });
    
    if (totalWordCountDisplay) {
        totalWordCountDisplay.textContent = totalWords;
        const displayBox = totalWordCountDisplay.parentElement;
        displayBox.classList.remove('warning', 'error');
        
        if (totalWords > MAX_TOTAL_WORDS) {
            displayBox.classList.add('error');
        } else if (totalWords > MAX_TOTAL_WORDS * 0.85) {
            displayBox.classList.add('warning');
        }
    }
    
    return totalWords;
}

// ============================================
// TITLE WORD COUNTER (Max 15 words)
// ============================================
const titleInput = document.getElementById('abstractTitle');
const titleWordCountDisplay = document.getElementById('titleWordCount');
const MAX_TITLE_WORDS = 20;
const WARNING_TITLE_WORDS = 15; // Soft warning threshold

if (titleInput && titleWordCountDisplay) {
    titleInput.addEventListener('input', () => {
        const words = countWords(titleInput.value);
        titleWordCountDisplay.textContent = `${words} / ${MAX_TITLE_WORDS} words`;
        
        titleWordCountDisplay.classList.remove('warning', 'error');
        
        // Red error if over 20
        if (words > MAX_TITLE_WORDS) {
            titleWordCountDisplay.classList.add('error');
        } 
        // Yellow warning if between 15 and 20
        else if (words >= WARNING_TITLE_WORDS) {
            titleWordCountDisplay.classList.add('warning');
        }
    });
}

abstractTextareas.forEach(textarea => {
    textarea.addEventListener('input', updateWordCounters);
    textarea.addEventListener('keyup', updateWordCounters);
});

// ============================================
// 6. ATTENDEE REGISTRATION
// ============================================
const attendeeForm = document.getElementById('attendeeRegistrationForm');

if (attendeeForm) {
    attendeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!supabaseClient) return showToast('error', 'Connection Error', 'Database not connected.');
        if (!validateForm(attendeeForm)) return showToast('error', 'Validation Error', 'Please fill in all required fields.');

        const submitBtn = attendeeForm.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const formData = new FormData(attendeeForm);
            const attendeeData = {
                first_name: formData.get('firstName') || '',
                last_name: formData.get('lastName') || '',
                email: formData.get('email') || '',
                phone: formData.get('phone') || '',
                whatsapp: formData.get('whatsapp') || null,
                nationality: formData.get('nationality') || '',
                university: formData.get('university') || '',
                faculty: formData.get('faculty') || '',
                academic_year: formData.get('academicYear') || '',
                student_id: formData.get('studentId') || null,
                hear_about: formData.get('hearAbout') || null,
                dietary_restrictions: formData.get('dietary') || null,
                newsletter: formData.get('newsletter') === 'on',
                terms_accepted: formData.get('terms') === 'on',
                registration_ip: await getClientIP(),
                user_agent: navigator.userAgent
            };

            const { error } = await supabaseClient.from('attendees').insert([attendeeData]);
            if (error) throw error;

            showToast('success', 'Registration Successful!', 'Check your email for confirmation details');
            attendeeForm.reset();
        } catch (error) {
            console.error('Registration error:', error);
            if (error.code === '23505') {
                showToast('error', 'Email Already Registered', 'This email is already registered.');
            } else {
                showToast('error', 'Registration Failed', error.message || 'Please try again.');
            }
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// 7. ABSTRACT SUBMISSION (UPDATED & CLEANED)
// ============================================
const abstractForm = document.getElementById('abstractSubmissionForm');

if (abstractForm) {
    abstractForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!supabaseClient) return showToast('error', 'Connection Error', 'Database not connected.');
        if (!validateForm(abstractForm)) return showToast('error', 'Validation Error', 'Please fill in all required fields.');

        // ✅ MOVED UP: Create formData FIRST so we can use it for validations
        const formData = new FormData(abstractForm);

        // ✅ Check total word count before submitting
        const totalWords = updateWordCounters();
        if (totalWords > MAX_TOTAL_WORDS) {
            showToast('error', 'Word Limit Exceeded', `Your abstract has ${totalWords} words. Maximum allowed is ${MAX_TOTAL_WORDS} words.`);
            return;
        }
        
        if (totalWords < MIN_TOTAL_WORDS) {
            showToast('error', 'Abstract Too Short', `Your abstract has only ${totalWords} words. Please provide more details (minimum ${MIN_TOTAL_WORDS} words).`);
            return;
        }

        // ✅ Now this works perfectly because formData is defined above
        const titleWords = countWords(formData.get('title') || '');
        if (titleWords > MAX_TITLE_WORDS) {
            showToast('error', 'Title Too Long', `The abstract title must be ${MAX_TITLE_WORDS} words or less. Current: ${titleWords} words.`);
            return;
        }

        const submitBtn = abstractForm.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // ❌ DELETED: const formData = new FormData(abstractForm); (It's already defined above!)
            
            const coAuthors = [];
            let currentCoAuthorCount = 1;
            while (document.querySelector(`[name="coAuthor${currentCoAuthorCount}Name"]`)) {
                coAuthors.push({
                    name: document.querySelector(`[name="coAuthor${currentCoAuthorCount}Name"]`).value || '',
                    email: document.querySelector(`[name="coAuthor${currentCoAuthorCount}Email"]`).value || '',
                    university: document.querySelector(`[name="coAuthor${currentCoAuthorCount}University"]`).value || '',
                    country: document.querySelector(`[name="coAuthor${currentCoAuthorCount}Country"]`).value || ''
                });
                currentCoAuthorCount++;
            }

            const abstractData = {
                title: formData.get('title') || 'Untitled',
                track: 'General',
                study_type: formData.get('studyType') || 'Original Research',
                presentation_type: formData.get('presentationType') || 'Oral Presentation',
                keywords: formData.get('keywords') || '',
                
                // New fields for previous submissions
                previous_submission: formData.get('previousSubmission') || 'no',
                previous_conference: formData.get('previousConference') || null,
                previous_date: formData.get('previousDate') || null,

                    publication_status: formData.get('publicationStatus') || 'no',
                    publication_link: formData.get('publicationLink') || null,
                
                // Abstract content
                background: formData.get('background') || '',
                methods: formData.get('methods') || '',
                results: formData.get('results') || '',
                conclusion: formData.get('conclusion') || '',
                
                // Authors
                corresponding_name: formData.get('correspondingName') || '',
                corresponding_email: formData.get('correspondingEmail') || '',
                corresponding_phone: formData.get('correspondingPhone') || '',
                corresponding_university: formData.get('correspondingUniversity') || '',
                co_authors: coAuthors.length > 0 ? coAuthors : [],
                
                // Ethics
                ethics_approval: formData.get('ethicsApproval') || 'Pending',
                ethics_number: formData.get('ethicsNumber') || null,
                conflict_of_interest: formData.get('conflictOfInterest') || 'None',
                terms_accepted: formData.get('abstractTerms') === 'on',
                submission_ip: await getClientIP(),
                user_agent: navigator.userAgent
            };

            console.log('🔍 Abstract Payload being sent:', abstractData);

            const { error } = await supabaseClient.from('abstracts').insert([abstractData]);

            if (error) {
                console.error('❌ Abstract submission error details:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
                throw error;
            }

            console.log('✅ Abstract submitted successfully!');
            showToast('success', 'Abstract Submitted!', 'You will receive a confirmation email shortly');
            abstractForm.reset();
            
            // Reset conditional fields and word counters after successful submission
            if (previousSubmissionDetails) {
                previousSubmissionDetails.style.display = 'none';
                conditionalFields.forEach(field => {
                    field.removeAttribute('required');
                    field.value = '';
                });
            }

            // Reset publication status conditional fields
if (publicationDetails) {
    publicationDetails.style.display = 'none';
    publicationFields.forEach(field => {
        field.removeAttribute('required');
        field.value = '';
    });
}
            
            abstractTextareas.forEach(textarea => {
                const target = textarea.getAttribute('name');
                const counter = document.querySelector(`.word-count-indicator[data-target="${target}"]`);
                if (counter) counter.textContent = '0 words';
            });
            if (totalWordCountDisplay) totalWordCountDisplay.textContent = '0';
            
            coAuthorCount = 0;
            if (coAuthorsList) coAuthorsList.innerHTML = '';

        } catch (error) {
            console.error('Abstract submission error:', error);
            showToast('error', 'Submission Failed', error.message || 'Please try again or contact support.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// 8. HELPER FUNCTIONS
// ============================================
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'unknown';
    }
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        const formGroup = field.closest('.form-group');
        if (field.type === 'checkbox' && !field.checked) {
            isValid = false;
            if (formGroup) formGroup.classList.add('error');
        } else if (field.type !== 'checkbox' && !field.value.trim()) {
            isValid = false;
            if (formGroup) formGroup.classList.add('error');
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            isValid = false;
            if (formGroup) formGroup.classList.add('error');
        } else {
            if (formGroup) formGroup.classList.remove('error');
        }
    });
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
    input.addEventListener('input', () => {
        const formGroup = input.closest('.form-group');
        if (formGroup) formGroup.classList.remove('error');
    });
});

function showToast(type, title, message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const toastIcon = toast.querySelector('.toast-icon i');
    const toastTitle = toast.querySelector('.toast-title');
    const toastMessage = toast.querySelector('.toast-message');

    toast.className = `toast ${type}`;
    toastIcon.className = type === 'success' ? 'fas fa-check' : 'fas fa-exclamation-triangle';
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => { toast.classList.remove('show'); }, 5000);
}

const toastClose = document.getElementById('toastClose');
if (toastClose) {
    toastClose.addEventListener('click', () => {
        const toast = document.getElementById('toast');
        if (toast) toast.classList.remove('show');
    });
}

console.log('📝 TSMRC 2026 - Registration System Connected to Supabase Successfully!');
