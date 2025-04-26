// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set initial state
    let currentContinent = 'asia';
    const savedContinent = localStorage.getItem('lastContinent');
    
    // Check for deep link or saved state
    const hash = window.location.hash.substring(1);
    if (hash) {
        currentContinent = hash;
    } else if (savedContinent) {
        currentContinent = savedContinent;
    }

    // Initialize modules
    initContinentSwitcher();
    initLazyLoading();
    initSearch();
    initFilters();
    initMapInteraction();
    showContinent(currentContinent);
});

// Continent Switching System
function initContinentSwitcher() {
    const buttons = document.querySelectorAll('.continent-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const continentId = e.target.getAttribute('onclick').match(/'(.*?)'/)[1];
            showContinent(continentId);
            updateUrlHash(continentId);
            storeLastContinent(continentId);
        });
    });
}

function showContinent(continentId) {
    // Hide all continents
    document.querySelectorAll('.continent-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Deactivate all buttons
    document.querySelectorAll('.continent-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected continent
    const activeSection = document.getElementById(continentId);
    const activeButton = document.querySelector(`[onclick*="${continentId}"]`);
    
    activeSection.classList.add('active');
    activeButton.classList.add('active');
    
    // Smooth scroll to section
    activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Image Lazy Loading
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
}

// Search Functionality
function initSearch() {
    const searchInput = document.createElement('input');
    searchInput.placeholder = 'Search attractions...';
    searchInput.classList.add('search-input');
    document.querySelector('.header').appendChild(searchInput);

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterAttractions(searchTerm);
    });
}

function filterAttractions(searchTerm) {
    document.querySelectorAll('.attraction-info').forEach(info => {
        const text = info.textContent.toLowerCase();
        const card = info.closest('.attraction-card');
        card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
}

// Advanced Filter System
function initFilters() {
    const filterTypes = ['nature', 'historical', 'beach', 'urban'];
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';

    filterTypes.forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        btn.dataset.filter = type;
        btn.classList.add('filter-btn');
        filterContainer.appendChild(btn);
    });

    document.querySelector('.header').appendChild(filterContainer);

    // Add filter functionality
    filterContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            const filter = e.target.dataset.filter;
            applyFilter(filter);
        }
    });
}

function applyFilter(filter) {
    document.querySelectorAll('.attraction-card').forEach(card => {
        const tags = card.dataset.tags.split(' ');
        card.style.display = tags.includes(filter) ? 'block' : 'none';
    });
}

// Map Interaction System
function initMapInteraction() {
    document.querySelectorAll('.route-map').forEach(map => {
        map.addEventListener('click', () => {
            const continent = map.closest('.continent-section').id;
            showMapModal(continent);
        });
    });
}

function showMapModal(continent) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'map-modal';
    
    // Add content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>${continent.replace('-', ' ').toUpperCase()} Detailed Map</h3>
            <div class="interactive-map" id="${continent}-detailed-map"></div>
        </div>
    `;

    document.body.appendChild(modal);

    // Initialize map (placeholder for actual map implementation)
    // You would integrate Google Maps/Leaflet here
    const mapContainer = document.getElementById(`${continent}-detailed-map`);
    mapContainer.innerHTML = `<p>Map integration placeholder (use Google Maps API key)</p>`;

    // Add close functionality
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });
}

// Utility Functions
function updateUrlHash(continent) {
    window.location.hash = continent;
}

function storeLastContinent(continent) {
    localStorage.setItem('lastContinent', continent);
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    const continents = ['asia', 'africa', 'europe', 'north-america', 'south-america', 'australia', 'antarctica'];
    const currentIndex = continents.indexOf(currentContinent);
    
    if (e.key === 'ArrowLeft') {
        const newIndex = (currentIndex - 1 + continents.length) % continents.length;
        showContinent(continents[newIndex]);
    } else if (e.key === 'ArrowRight') {
        const newIndex = (currentIndex + 1) % continents.length;
        showContinent(continents[newIndex]);
    }
});