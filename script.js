/* =====================================================
   ElderEase – Main JavaScript File
   Handles: Dark Mode, Voice Assistant (TTS),
            Mobile Menu, and shared utilities
   ===================================================== */

// ============================================================
// 1. DARK MODE TOGGLE
//    Saves preference in localStorage so it persists
// ============================================================
function toggleDark() {
  document.body.classList.toggle('dark');
  // Save the preference
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('elderease_darkmode', isDark ? '1' : '0');
  // Update button emoji
  const btns = document.querySelectorAll('.toggle-btn');
  btns.forEach(btn => {
    if (btn.textContent.includes('🌙') || btn.textContent.includes('☀️')) {
      btn.textContent = isDark ? '☀️' : '🌙';
    }
  });
}

// Apply saved dark mode on every page load
(function applyDarkMode() {
  if (localStorage.getItem('elderease_darkmode') === '1') {
    document.body.classList.add('dark');
    // Update button after DOM loads
    window.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.toggle-btn').forEach(btn => {
        if (btn.textContent.includes('🌙')) btn.textContent = '☀️';
      });
    });
  }
})();


// ============================================================
// 2. VOICE ASSISTANT (Text-to-Speech)
//    Uses browser's built-in SpeechSynthesis API
// ============================================================

// Main speak function – call speak("any text here")
function speak(text) {
  // Stop any currently playing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Settings for elderly users: slower, clear, medium pitch
  utterance.rate  = 0.85;  // Slightly slow (0.1 – 10)
  utterance.pitch = 1.0;   // Normal pitch
  utterance.volume = 1.0;  // Full volume

  // Try to use a good Hindi/English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
                 || voices.find(v => v.lang.startsWith('en'))
                 || voices[0];
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

// Welcome message on home page
function speakWelcome() {
  speak(
    'Welcome to ElderEase! ' +
    'This website is made specially for you. ' +
    'You can set medicine reminders, call for emergency help, ' +
    'learn how to use your mobile phone, and contact your family. ' +
    'Please tap any big button to get started!'
  );
}

// Load voices when they become available (some browsers load async)
if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = () => {};
}


// ============================================================
// 3. MOBILE NAVIGATION MENU (Hamburger Toggle)
// ============================================================
function toggleMenu() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
}

// Close menu when a link is clicked
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('open');
    });
  });
});


// ============================================================
// 4. PAGE LOAD ANIMATIONS
//    Smooth fade-in when page loads
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);
});


// ============================================================
// 5. UTILITY: Format number with leading zero (e.g., 5 → "05")
// ============================================================
function pad(n) {
  return String(n).padStart(2, '0');
}


// ============================================================
// 6. FONT SIZE CONTROLS (Accessibility)
//    Allow user to increase/decrease font size
// ============================================================
let currentFontSize = 20; // base in px

function increaseFontSize() {
  currentFontSize = Math.min(currentFontSize + 2, 32);
  document.body.style.fontSize = currentFontSize + 'px';
  localStorage.setItem('elderease_fontsize', currentFontSize);
}

function decreaseFontSize() {
  currentFontSize = Math.max(currentFontSize - 2, 18);
  document.body.style.fontSize = currentFontSize + 'px';
  localStorage.setItem('elderease_fontsize', currentFontSize);
}

// Apply saved font size
(function applySavedFontSize() {
  const saved = localStorage.getItem('elderease_fontsize');
  if (saved) {
    currentFontSize = parseInt(saved);
    document.addEventListener('DOMContentLoaded', () => {
      document.body.style.fontSize = currentFontSize + 'px';
    });
  }
})();


// ============================================================
// 7. KEYBOARD ACCESSIBILITY
//    Enter key triggers button click for keyboard users
// ============================================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close any open overlays or notifications
    const overlay = document.getElementById('callOverlay');
    const notif   = document.getElementById('notification');
    if (overlay && !overlay.classList.contains('hidden')) overlay.classList.add('hidden');
    if (notif   && !notif.classList.contains('hidden'))   notif.classList.add('hidden');

    // Close mobile menu
    const nav = document.getElementById('navLinks');
    if (nav) nav.classList.remove('open');
  }
});
