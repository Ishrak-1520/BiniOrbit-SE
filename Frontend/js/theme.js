// theme.js - Theme management system for BiniOrbit
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('biniOrbit-theme') || 'light';
    this.init();
  }

  init() {
    // Apply theme on page load
    this.applyTheme(this.theme);

    // Connect sidebar toggle switch
    this.connectSidebarThemeToggleSwitch();

    // Add CSS for smooth transitions
    this.addTransitionStyles();
  }

  applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--background', '#171E26');
      root.style.setProperty('--foreground', '#ffffff');
      root.style.setProperty('--primary', '#E53358');
      root.style.setProperty('--primary-foreground', '#ffffff');
      root.style.setProperty('--secondary', '#1E242C');
      root.style.setProperty('--secondary-foreground', '#ffffff');
      root.style.setProperty('--muted', '#192133');
      root.style.setProperty('--muted-foreground', '#a1a1aa');
      root.style.setProperty('--accent', '#192133');
      root.style.setProperty('--accent-foreground', '#ffffff');
      root.style.setProperty('--border', '#2d3748');
      root.style.setProperty('--input', '#1E242C');
      root.style.setProperty('--ring', '#E53358');
      root.style.setProperty('--radius', '0.5rem');
      root.style.setProperty('--shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--success', '#10b981');
      root.style.setProperty('--success-bg', '#064e3b');
      root.style.setProperty('--error', '#ef4444');
      root.style.setProperty('--error-bg', '#7f1d1d');
      root.style.setProperty('--warning', '#f59e0b');
      root.style.setProperty('--warning-bg', '#78350f');
    } else {
      root.classList.remove('dark');
      // Reset to light mode variables
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
      root.style.setProperty('--primary', '#171717');
      root.style.setProperty('--primary-foreground', '#ffffff');
      root.style.setProperty('--secondary', '#f5f5f5');
      root.style.setProperty('--secondary-foreground', '#171717');
      root.style.setProperty('--muted', '#f5f5f5');
      root.style.setProperty('--muted-foreground', '#737373');
      root.style.setProperty('--accent', '#f5f5f5');
      root.style.setProperty('--accent-foreground', '#171717');
      root.style.setProperty('--border', '#e5e5e5');
      root.style.setProperty('--input', '#ffffff');
      root.style.setProperty('--ring', '#171717');
      root.style.setProperty('--radius', '0.5rem');
      root.style.setProperty('--shadow', '0 1px 3px 0 rgb(0 0 0 / 0.1)');
      root.style.setProperty('--success', '#10b981');
      root.style.setProperty('--success-bg', '#d1fae5');
      root.style.setProperty('--error', '#ef4444');
      root.style.setProperty('--error-bg', '#fee2e2');
      root.style.setProperty('--warning', '#f59e0b');
      root.style.setProperty('--warning-bg', '#fef3c7');
    }
    
    this.theme = theme;
    localStorage.setItem('biniOrbit-theme', theme);
  }

  connectSidebarThemeToggleSwitch() {
    const toggleSwitch = document.getElementById('themeToggleSwitch');
    const themeIcon = document.getElementById('themeIcon');
    if (!toggleSwitch || !themeIcon) return;

    // Set initial state
    toggleSwitch.checked = (this.theme === 'dark');
    this.updateThemeIcon(themeIcon, this.theme);

    toggleSwitch.addEventListener('change', () => {
      if (toggleSwitch.checked) {
        this.applyTheme('dark');
        this.updateThemeIcon(themeIcon, 'dark');
      } else {
        this.applyTheme('light');
        this.updateThemeIcon(themeIcon, 'light');
      }
    });
  }

  updateThemeIcon(themeIcon, theme) {
    if (theme === 'dark') {
      themeIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>';
    } else {
      themeIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M4 12H2m17.07 7.07-1.42-1.42M6.34 6.34 4.93 4.93m12.14 0-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>';
    }
  }

  addTransitionStyles() {
    // Add smooth transitions for theme changes
    const style = document.createElement('style');
    style.textContent = `
      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      }
      
      .theme-toggle {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid var(--border);
        background: var(--background);
        color: var(--foreground);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        z-index: 1000;
      }
      
      .theme-toggle:hover {
        background: var(--muted);
        transform: scale(1.05);
      }
      
      .theme-toggle:focus {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
      }
      
      /* Dark mode specific adjustments */
      .dark .sidebar {
        background: var(--secondary);
        border-right: 1px solid var(--border);
      }
      
      .dark .nav-item:hover {
        background: var(--muted);
      }
      
      .dark .nav-item.active {
        background: var(--primary);
        color: var(--primary-foreground);
      }
      
      .dark .main-content {
        background: var(--background);
      }
      
      .dark .feed-post,
      .dark .investment-card,
      .dark .create-post-card {
        background: var(--secondary);
        border: 1px solid var(--border);
      }
      
      .dark .post-interactions {
        border-top: 1px solid var(--border);
      }
      
      .dark .interaction-button:hover {
        background: var(--muted);
      }
      
      .dark .comment-input,
      .dark .form-input,
      .dark .create-post-input {
        background: var(--input);
        border: 1px solid var(--border);
        color: var(--foreground);
      }
      
      .dark .comment-input:focus,
      .dark .form-input:focus,
      .dark .create-post-input:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(229, 51, 88, 0.1);
      }
      
      .dark .notifications-dropdown {
        background: var(--secondary);
        border: 1px solid var(--border);
      }
      
      .dark .notification-item:hover {
        background: var(--muted);
      }
      
      .dark .notification-item.unread {
        background: var(--muted);
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

// Export for use in other scripts
window.ThemeManager = ThemeManager;