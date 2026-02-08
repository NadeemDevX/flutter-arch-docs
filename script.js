// ========================================
// Flutter Architecture Documentation - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const langToggle = document.getElementById('langToggle');
    const langText = document.getElementById('langText');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const navItems = document.querySelectorAll('.nav-item');

    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // ========================================
    // Theme Toggle
    // ========================================

    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
    }

    // ========================================
    // Language Toggle
    // ========================================

    // Get saved language or default to English
    let currentLang = localStorage.getItem('lang') || 'en';
    updateLanguage(currentLang);

    langToggle.addEventListener('click', function() {
        currentLang = currentLang === 'en' ? 'ur' : 'en';
        localStorage.setItem('lang', currentLang);
        updateLanguage(currentLang);
    });

    function updateLanguage(lang) {
        // Update toggle button text
        langText.textContent = lang === 'en' ? 'English' : 'Roman Urdu';

        // Toggle visibility of language-specific content
        const enElements = document.querySelectorAll('.lang-en');
        const urElements = document.querySelectorAll('.lang-ur');

        enElements.forEach(el => {
            el.style.display = lang === 'en' ? '' : 'none';
        });

        urElements.forEach(el => {
            el.style.display = lang === 'ur' ? '' : 'none';
        });

        // Update nav items and section titles with data attributes
        const elementsWithData = document.querySelectorAll('[data-en][data-ur]');
        elementsWithData.forEach(el => {
            el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-ur');
        });

        // Update document language attribute
        html.setAttribute('lang', lang === 'en' ? 'en' : 'ur');
    }

    // ========================================
    // Mobile Menu Toggle
    // ========================================

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    // Close menu when nav item is clicked on mobile
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    });

    // ========================================
    // Tab-based Navigation (No Auto Scroll)
    // ========================================

    const sections = document.querySelectorAll('.content-section');

    // Hide all sections except the first one on load
    function initializeSections() {
        sections.forEach((section, index) => {
            if (index === 0) {
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });
    }

    // Show only the clicked section
    function showSection(targetId) {
        sections.forEach(section => {
            if ('#' + section.getAttribute('id') === targetId) {
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });

        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle nav item clicks
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            // Update active nav state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Show only the target section
            showSection(targetId);

            // Update URL hash
            history.pushState(null, null, targetId);

            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    });

    // Initialize on page load
    initializeSections();

    // ========================================
    // Handle Window Resize
    // ========================================

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        }, 250);
    });

    // ========================================
    // Handle Hash on Page Load
    // ========================================

    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            // Update active nav
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === window.location.hash) {
                    item.classList.add('active');
                }
            });

            // Show the target section
            showSection(window.location.hash);
        }
    }

    // ========================================
    // Keyboard Navigation
    // ========================================

    document.addEventListener('keydown', function(e) {
        // Close sidebar with Escape key
        if (e.key === 'Escape') {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }

        // Toggle theme with Ctrl/Cmd + D
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            themeToggle.click();
        }

        // Toggle language with Ctrl/Cmd + L
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            langToggle.click();
        }
    });

    // ========================================
    // Copy Code Functionality (Optional)
    // ========================================

    const codeBlocks = document.querySelectorAll('.code-block');

    codeBlocks.forEach(block => {
        const header = block.querySelector('.code-header');
        if (header) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<span class="material-icons" style="font-size: 16px;">content_copy</span>';
            copyBtn.style.cssText = `
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                color: var(--text-secondary);
                padding: 4px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s ease;
            `;

            header.style.position = 'relative';
            header.appendChild(copyBtn);

            copyBtn.addEventListener('click', function() {
                const code = block.querySelector('code').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    copyBtn.innerHTML = '<span class="material-icons" style="font-size: 16px;">check</span>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<span class="material-icons" style="font-size: 16px;">content_copy</span>';
                    }, 2000);
                });
            });

            copyBtn.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--bg-tertiary)';
            });

            copyBtn.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
        }
    });

    // ========================================
    // Initialize
    // ========================================

    console.log('Flutter Architecture Documentation loaded successfully!');
    console.log('Keyboard shortcuts:');
    console.log('  Ctrl/Cmd + D: Toggle dark/light theme');
    console.log('  Ctrl/Cmd + L: Toggle language');
    console.log('  Escape: Close mobile menu');
});
