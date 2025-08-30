// Global Search functionality for BiniOrbit
// Note: This requires backend endpoints for full functionality

class GlobalSearch {
    constructor() {
        this.searchInput = document.getElementById('globalSearchInput');
        this.clearBtn = document.getElementById('clearSearchBtn');
        this.resultsContainer = document.getElementById('searchResults');
        this.resultsContent = document.getElementById('searchResultsContent');
        this.debounceTimer = null;
        this.currentResults = [];
        this.selectedIndex = -1;
        
        if (this.searchInput && this.clearBtn && this.resultsContainer && this.resultsContent) {
            this.init();
        }
    }

    init() {
        this.searchInput.addEventListener('input', (e) => this.handleInput(e));
        this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.searchInput.addEventListener('focus', () => this.showResults());
        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => this.hideResults(), 150);
        });
        this.clearBtn.addEventListener('click', () => this.clearSearch());
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideResults();
            }
        });
        this.resultsContent.addEventListener('click', (e) => {
            const btn = e.target.closest('.search-result-item');
            if (btn) {
                const idx = parseInt(btn.getAttribute('data-index'), 10);
                this.selectResult(idx);
            }
        });
    }

    handleInput(e) {
        const query = e.target.value.trim();
        this.clearBtn.style.display = query ? 'block' : 'none';
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    async performSearch(query) {
        if (query.length < 2) {
            this.hideResults();
            return;
        }
        this.showLoading();
        try {
            // Note: This requires a backend search endpoint
            const response = await fetch(`global_search.php?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (response.ok) {
                this.displayResults(data.results || [], query);
            } else {
                this.showError('Search failed');
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Search failed - backend not available');
        }
    }

    displayResults(results, query) {
        this.currentResults = results;
        this.selectedIndex = -1;
        if (results.length === 0) {
            this.resultsContent.innerHTML = '<div class="no-results">No users found</div>';
        } else {
            this.resultsContent.innerHTML = results.map((result, index) =>
                this.createResultHTML(result, query, index)
            ).join('');
        }
        this.showResults();
    }

    createResultHTML(result, query, index) {
        const displayName = this.highlightText(result.display_name || result.name || 'Unknown', query);
        const subtitle = this.highlightText(result.subtitle || result.email || '', query);
        const initials = this.getInitials(result.display_name || result.name || 'U');
        const accountType = result.account_type || result.type || 'user';
        
        return `
            <button class="search-result-item" data-index="${index}">
                <div class="search-result-avatar">${initials}</div>
                <div class="search-result-info">
                    <div class="search-result-name">${displayName}</div>
                    <div class="search-result-subtitle">${subtitle}</div>
                </div>
                <div class="search-result-badge ${accountType}">
                    ${accountType === 'investor' ? 'Investor' : 'Business'}
                </div>
            </button>
        `;
    }

    highlightText(text, query) {
        if (!query || !text) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    getInitials(name) {
        return name.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    handleKeydown(e) {
        if (!this.currentResults.length) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.currentResults.length - 1);
                this.updateSelection();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection();
                break;
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectResult(this.selectedIndex);
                }
                break;
            case 'Escape':
                this.hideResults();
                this.searchInput.blur();
                break;
        }
    }

    updateSelection() {
        const items = this.resultsContent.querySelectorAll('.search-result-item');
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.style.background = 'var(--muted)';
                item.focus();
            } else {
                item.style.background = '';
            }
        });
    }

    selectResult(index) {
        if (index < 0 || index >= this.currentResults.length) return;
        const result = this.currentResults[index];
        
        // Navigate based on result type
        if (result.account_type === 'investor' || result.type === 'investor') {
            window.location.href = `ProfileVisit.php?investor_id=${encodeURIComponent(result.id)}`;
        } else {
            window.location.href = `ProfileVisit.php?business_id=${encodeURIComponent(result.id)}`;
        }
    }

    showLoading() {
        this.resultsContent.innerHTML = '<div class="search-loading">Searching...</div>';
        this.showResults();
    }

    showError(message) {
        this.resultsContent.innerHTML = `<div class="no-results">${message}</div>`;
        this.showResults();
    }

    showResults() {
        if (this.resultsContent.innerHTML.trim()) {
            this.resultsContainer.style.display = 'block';
        }
    }

    hideResults() {
        this.resultsContainer.style.display = 'none';
    }

    clearSearch() {
        this.searchInput.value = '';
        this.clearBtn.style.display = 'none';
        this.hideResults();
        this.searchInput.focus();
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.globalSearch = new GlobalSearch();
});