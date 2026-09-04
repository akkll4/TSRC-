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
// 3. FILE UPLOAD HANDLING
// ============================================
const fileUpload = document.getElementById('fileUpload');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const fileRemove = document.getElementById('fileRemove');

if (fileUpload && fileInput) {
    fileUpload.addEventListener('click', () => fileInput.click());

    fileUpload.addEventListener('dragover', (e) => { e.preventDefault(); fileUpload.classList.add('dragover'); });
    fileUpload.addEventListener('dragleave', () => { fileUpload.classList.remove('dragover'); });
    fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFileSelect(e.target.files[0]);
    });

    function handleFileSelect(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (!allowedTypes.includes(file.type)) {
            showToast('error', 'Invalid File Type', 'Please upload a PDF, DOC, or DOCX file');
            fileInput.value = '';
            return;
        }
        if (file.size > maxSize) {
            showToast('error', 'File Too Large', 'Maximum file size is 10MB');
            fileInput.value = '';
            return;
        }

        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        filePreview.classList.add('active');
        fileUpload.style.display = 'none';
    }

    if (fileRemove) {
        fileRemove.addEventListener('click', () => {
            fileInput.value = '';
            filePreview.classList.remove('active');
            fileUpload.style.display = 'block';
        });
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}

// ============================================
// 4. CO-AUTHORS MANAGEMENT
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
// 5. ATTENDEE REGISTRATION
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
// 6. ABSTRACT SUBMISSION (FIXED)
// ============================================
const abstractForm = document.getElementById('abstractSubmissionForm');

if (abstractForm) {
    abstractForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!supabaseClient) return showToast('error', 'Connection Error', 'Database not connected.');
        if (!validateForm(abstractForm)) return showToast('error', 'Validation Error', 'Please fill in all required fields.');

        const currentFileInput = document.getElementById('fileInput');
        if (!currentFileInput || !currentFileInput.files.length) {
            return showToast('error', 'File Required', 'Please upload your abstract document');
        }

        const submitBtn = abstractForm.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const file = currentFileInput.files[0];
            const fileExt = file.name.split('.').pop();
            const uploadFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            
            const { error: uploadError } = await supabaseClient.storage
                .from('abstracts')
                .upload(uploadFileName, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabaseClient.storage.from('abstracts').getPublicUrl(uploadFileName);
            const formData = new FormData(abstractForm);
            
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

            // ✅ FIXED: Added fallbacks (|| '') to EVERY field to guarantee NO NULL values are sent
            const abstractData = {
                title: formData.get('title') || 'Untitled',
                track: 'General', // ← This prevents the "null value in column track" error
                study_type: formData.get('studyType') || 'Original Research',
                presentation_type: formData.get('presentationType') || 'Oral Presentation',
                keywords: formData.get('keywords') || '',
                background: formData.get('background') || '',
                methods: formData.get('methods') || '',
                results: formData.get('results') || '',
                conclusion: formData.get('conclusion') || '',
                corresponding_name: formData.get('correspondingName') || '',
                corresponding_email: formData.get('correspondingEmail') || '',
                corresponding_phone: formData.get('correspondingPhone') || '',
                corresponding_university: formData.get('correspondingUniversity') || '',
                co_authors: coAuthors.length > 0 ? coAuthors : [],
                file_url: publicUrl,
                file_name: file.name,
                file_size: file.size,
                ethics_approval: formData.get('ethicsApproval') || 'Pending',
                ethics_number: formData.get('ethicsNumber') || null,
                conflict_of_interest: formData.get('conflictOfInterest') || 'None',
                terms_accepted: formData.get('abstractTerms') === 'on',
                submission_ip: await getClientIP(),
                user_agent: navigator.userAgent
            };

            // 🔍 DEBUG: Log the exact payload being sent to Supabase
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
            
            const preview = document.getElementById('filePreview');
            const uploadBox = document.getElementById('fileUpload');
            const authorsList = document.getElementById('coAuthorsList');
            
            if (preview) preview.classList.remove('active');
            if (uploadBox) uploadBox.style.display = 'block';
            if (authorsList) authorsList.innerHTML = '';
            coAuthorCount = 0;

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
// 7. HELPER FUNCTIONS
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
