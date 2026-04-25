document.addEventListener('DOMContentLoaded', () => {
    // ---ELEMENT SELECTORS---
    const loginPage = document.getElementById('login-page');
    const signupPage = document.getElementById('signup-page');
    const mainApp = document.getElementById('main-app');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginMessage = document.getElementById('login-message');
    const signupMessage = document.getElementById('signup-message');

    const showSignupLink = document.getElementById('show-signup-link');
    const showLoginLink = document.getElementById('show-login-link');
    
    const dashboardView = document.getElementById('dashboard-view');
    const profileView = document.getElementById('profile-view');
    const dashboardBtn = document.getElementById('dashboard-btn');
    const profileBtn = document.getElementById('profile-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    const delayForm = document.getElementById('delay-form');
    const optimizeForm = document.getElementById('optimize-form');
    const transportForm = document.getElementById('transport-form');
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');
    const resultsTitle = document.getElementById('results-title');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelProfileBtn = document.getElementById('cancel-profile-btn');
    const profileEditActions = document.getElementById('profile-edit-actions');
    const personalInfoCard = document.getElementById('personal-info-card');
    const editVehicleBtns = document.querySelectorAll('.edit-vehicle-btn');

    // --- AUTO-LOCATION DETECTION ---
    let isUserEditing = false;
    let isUserEditingStart = false;
    let autoOriginLat = null;
    let autoOriginLon = null;
    
    // --- GLOBAL PREDICTION CONTEXT ---
    let lastContext = {
        distance_km: null,
        predicted_delay_minutes: null,
        traffic_level: null,
        weather_score: null
    };
    
    const originInput = document.getElementById('origin-input');
    const startLocationInput = document.getElementById('start-location');

    if (originInput || startLocationInput) {
        if (originInput) originInput.addEventListener('input', () => isUserEditing = true);
        if (startLocationInput) startLocationInput.addEventListener('input', () => isUserEditingStart = true);

        if ("geolocation" in navigator) {
            if (originInput && !originInput.value) originInput.placeholder = "Detecting your location...";
            if (startLocationInput && !startLocationInput.value) startLocationInput.placeholder = "Detecting your location...";

            navigator.geolocation.getCurrentPosition(async (position) => {
                autoOriginLat = position.coords.latitude;
                autoOriginLon = position.coords.longitude;
                
                try {
                    const response = await fetch(`/reverse-geocode/?lat=${autoOriginLat}&lon=${autoOriginLon}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.address) {
                            if (originInput && !isUserEditing) originInput.value = data.address;
                            if (startLocationInput && !isUserEditingStart) startLocationInput.value = data.address;
                        }
                    }
                } catch (err) {
                    // Fail silently
                } finally {
                    if (originInput && !isUserEditing && !originInput.value) originInput.placeholder = "Enter origin";
                    if (startLocationInput && !isUserEditingStart && !startLocationInput.value) startLocationInput.placeholder = "Enter start location";
                }
            }, () => {
                if (originInput && !isUserEditing) originInput.placeholder = "Enter origin";
                if (startLocationInput && !isUserEditingStart) startLocationInput.placeholder = "Enter start location";
            });
        }
    }

    // --- MAP INITIALIZATION (deferred until login) ---
    let map = null;
    let routeLayerGroup = null;

    function initMap() {
        if (map) return; // already initialized
        map = L.map('map').setView([22.5937, 78.9629], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
        routeLayerGroup = L.layerGroup().addTo(map);
        setTimeout(() => map.invalidateSize(), 100);
    }

    // --- DATA & STATE MANAGEMENT ---
    const profileElements = { name: document.getElementById('profile-name'), email: document.getElementById('profile-email'), age: document.getElementById('profile-age'), gender: document.getElementById('profile-gender'), nationality: document.getElementById('profile-nationality'), license: document.getElementById('profile-license'), address: document.getElementById('profile-address'), };
    const inlineEditInputs = { age: document.getElementById('edit-age'), gender: document.getElementById('edit-gender'), nationality: document.getElementById('edit-nationality'), license: document.getElementById('edit-license'), address: document.getElementById('edit-address'), };
    const vehicleElements = { car: { plate: document.getElementById('car-plate'), model: document.getElementById('car-model'), color: document.getElementById('car-color'), }, bike: { plate: document.getElementById('bike-plate'), model: document.getElementById('bike-model'), color: document.getElementById('bike-color'), } };
    const vehicleEditInputs = { car: { plate: document.getElementById('edit-car-plate'), model: document.getElementById('edit-car-model'), color: document.getElementById('edit-car-color'), }, bike: { plate: document.getElementById('edit-bike-plate'), model: document.getElementById('edit-bike-model'), color: document.getElementById('edit-bike-color'), } };

    // --- UI FUNCTIONS ---
    function showView(view) {
        dashboardView.classList.add('hidden');
        profileView.classList.add('hidden');
        view.classList.remove('hidden');
        [dashboardBtn, profileBtn].forEach(b => { b.classList.remove('text-white', 'border-purple-400', 'pb-1'); b.classList.add('text-gray-400'); });
        const btn = view === dashboardView ? dashboardBtn : profileBtn;
        btn.classList.add('text-white', 'border-purple-400', 'pb-1');
        btn.classList.remove('text-gray-400');
        if (view === dashboardView) { initMap(); setTimeout(() => { if (map) map.invalidateSize(); }, 1); }
    }

    function showResults(title, content, isLoading = false) {
        resultsSection.classList.remove('hidden');
        resultsTitle.textContent = title;
        resultsContent.innerHTML = isLoading ? `<div class="flex items-center justify-center space-x-3"><i class="fas fa-spinner fa-spin text-2xl text-purple-400"></i><span class="text-lg">Analyzing...</span></div>` : content;
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function drawRouteOnMap(stops, routePath) {
        if (!map || !routeLayerGroup) return;
        routeLayerGroup.clearLayers();
        if (!stops || stops.length === 0) return;
        if (routePath && routePath.length > 0) {
            const polyline = L.polyline(routePath, { color: '#805ad5', weight: 4, className: 'animated-route' }).addTo(routeLayerGroup);
            map.fitBounds(polyline.getBounds().pad(0.1));
        }
        stops.forEach((stop, index) => { L.marker([stop.lat, stop.lon]).addTo(routeLayerGroup).bindPopup(`<b>${index + 1}. ${stop.name}</b>`).openPopup(); });
    }
    
    // --- EVENT LISTENERS ---

    // Page toggling
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginPage.classList.add('hidden');
        signupPage.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupPage.classList.add('hidden');
        loginPage.classList.remove('hidden');
    });

    // Authentication Forms
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        try {
            const response = await fetch('/signup/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'Sign-up failed');
            }
            signupMessage.textContent = 'Sign-up successful! Please log in.';
            signupMessage.style.color = 'lightgreen';
        } catch (error) {
            signupMessage.textContent = error.message;
            signupMessage.style.color = 'salmon';
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
             if (!response.ok) {
                throw new Error(data.detail || 'Login failed');
            }
            // On successful login
            loginPage.classList.add('hidden');
            signupPage.classList.add('hidden');
            mainApp.classList.remove('hidden');
            initMap();
            showView(dashboardView);
            // Update profile details
            document.getElementById('profile-name').textContent = data.username;
            document.getElementById('profile-email').textContent = email;
            // Generate avatar initials from username
            const initials = data.username.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            const initialsEl = document.getElementById('profile-initials');
            if (initialsEl) initialsEl.textContent = initials;

        } catch (error) {
            loginMessage.textContent = error.message;
            loginMessage.style.color = 'salmon';
        }
    });

    logoutBtn.addEventListener('click', () => {
        mainApp.classList.add('hidden');
        loginPage.classList.remove('hidden');
        loginForm.reset();
        signupForm.reset();
        loginMessage.textContent = '';
        signupMessage.textContent = '';
    });
    
    dashboardBtn.addEventListener('click', () => showView(dashboardView));
    profileBtn.addEventListener('click', () => showView(profileView));
    
    // Feature Forms
    delayForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showResults('Delay Prediction Result', '', true);
        const origin = document.getElementById('origin-input').value;
        const destination = document.getElementById('destination-input').value;
        const departureTime = document.getElementById('departure-time-input').value;
        const formattedTimestamp = departureTime.replace('T', ' ');
        let payload = { origin, destination, timestamp: formattedTimestamp };
        if (!isUserEditing && autoOriginLat && autoOriginLon) {
            payload.origin_lat = autoOriginLat;
            payload.origin_lon = autoOriginLon;
        }

        try {
            const response = await fetch('/predict-delay/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.detail || 'Backend error'); }
            const data = await response.json();
            
            lastContext.distance_km = data.distance_km;
            lastContext.predicted_delay_minutes = data.predicted_delay_minutes;
            lastContext.traffic_level = data.traffic_level;
            lastContext.weather_score = data.weather_score;

            const resultHTML = `
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                <div><p class="text-sm text-gray-400">Distance</p><p class="text-xl font-bold text-blue-300">${data.distance_km.toFixed(1)} km</p></div>
                <div><p class="text-sm text-gray-400">Base Travel</p><p class="text-xl font-bold text-white">${Math.round(data.base_travel_minutes)} min</p></div>
                <div><p class="text-sm text-gray-400">Predicted Delay</p><p class="text-xl font-bold text-purple-300">+${data.predicted_delay_minutes.toFixed(1)} min</p></div>
                <div><p class="text-sm text-gray-400">Target Weather</p><p class="text-xl font-bold text-white capitalize">${data.weather}</p></div>
                <div><p class="text-sm text-gray-400">Model Confidence</p><p class="text-xl font-bold text-orange-300">${data.confidence_score}</p></div>
                <div><p class="text-sm text-gray-400">Est. Total Time</p><p class="text-xl font-bold text-green-400">${Math.round(data.total_estimated_time)} min</p></div>
            </div>`;
            showResults('Delay Prediction Result', resultHTML);

            drawRouteOnMap(data.stops, data.route_path);

        } catch (error) { showResults('Error', `<p class="text-red-400">Could not fetch prediction: ${error.message}</p>`); }
    });
    
    optimizeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showResults('Optimized Route', '', true);
        const startLocationValue = document.getElementById('start-location').value.trim();
        const destinations = document.getElementById('destinations-textarea').value.trim().split('\n').filter(d => d).map(address => ({ address }));
        
        if (!startLocationValue) { showResults('Error', `<p class="text-red-400">Please enter a start location.</p>`); return; }
        if (destinations.length < 1) { showResults('Error', `<p class="text-red-400">Please enter at least one destination.</p>`); return; }

        try {
            const payload = {
                start: { address: startLocationValue },
                stops: destinations
            };
            const response = await fetch('/optimize-route/', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.detail || 'Backend error'); }
            const data = await response.json();
            const resultHTML = `<ol class="list-decimal list-inside space-y-2">${data.optimized_stops.map(d => `<li class="text-lg p-2 bg-gray-800/40 rounded-md">${d.name}</li>`).join('')}</ol>`;
            showResults('Optimized Route', resultHTML);
            drawRouteOnMap(data.optimized_stops, data.route_path);
        } catch (error) { showResults('Error', `<p class="text-red-400">Could not optimize route: ${error.message}</p>`); }
    });

    transportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const origin = document.getElementById('transport-origin-input').value;
        const dest = document.getElementById('transport-destination-input').value;
        showResults(`Transport Options: ${origin} to ${dest}`, '', true);
        try {
            let transportPayload = { 
                origin, 
                destination: dest,
                distance: lastContext.distance_km,
                predicted_delay: lastContext.predicted_delay_minutes,
                traffic_level: lastContext.traffic_level,
                weather_score: lastContext.weather_score
            };
            const response = await fetch('/find-transport/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(transportPayload) });
            if (!response.ok) throw new Error('Could not fetch transport options from the server.');
            const transports = await response.json();
            if (transports.length === 0) { showResults(`Transport Options: ${origin} to ${dest}`, '<p class="text-center text-gray-400">No direct transport options found for this route.</p>'); return; }
            
            let resultHTML = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
            const iconMap = { flight: 'fa-plane-departure', train: 'fa-train', bus: 'fa-bus-simple', cab: 'fa-taxi' };
            
            transports.forEach((t) => {
                const iconClass = iconMap[t.type] || 'fa-ticket-alt';
                const isBest = t.recommendation === "Best Option";
                
                resultHTML += `
                    <div class="glassmorphism-card rounded-xl p-5 flex flex-col justify-between ${isBest ? 'border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'border border-gray-700'} relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        ${isBest ? '<div class="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-bl-lg z-10"><i class="fas fa-star mr-1"></i>Best Option</div>' : ''}
                        
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center gap-3">
                                <div class="bg-purple-900/40 p-3 rounded-lg"><i class="fas ${iconClass} text-xl text-purple-400"></i></div>
                                <div>
                                    <h3 class="font-bold text-lg text-white capitalize">${t.operator}</h3>
                                    <p class="text-xs text-gray-400 capitalize">${t.type}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-black text-2xl text-green-400">₹${t.price.toLocaleString()}</p>
                                <p class="text-xs text-gray-400">approx.</p>
                            </div>
                        </div>
                        
                        <div class="space-y-2 mb-6">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-400"><i class="fas fa-clock mr-2"></i>Time</span>
                                <span class="font-medium text-white">${t.time}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-400"><i class="fas fa-chart-line mr-2"></i>AI Score</span>
                                <span class="font-medium text-blue-300">${t.score} / 1.0</span>
                            </div>
                            ${t.warning ? `<div class="flex justify-between text-sm"><span class="text-red-400 font-bold"><i class="fas fa-exclamation-triangle mr-2"></i>Warning</span><span class="text-red-400">${t.warning}</span></div>` : ''}
                        </div>
                        
                        <div class="mt-auto pt-4 border-t border-gray-700/50 flex items-center justify-between">
                            <div class="flex flex-wrap gap-1">
                                ${t.tag ? t.tag.split(',').map(tag => `<span class="bg-purple-500/20 text-purple-300 text-[10px] uppercase font-bold px-2 py-1 rounded border border-purple-500/30">${tag.trim()}</span>`).join('') : ''}
                            </div>
                            ${t.booking_link ? `<a href="${t.booking_link}" target="_blank" class="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors whitespace-nowrap shadow-lg">Book Now</a>` : `<button class="bg-gray-700 text-gray-400 text-sm font-bold py-2 px-4 rounded-lg cursor-not-allowed border border-gray-600">Unavailable</button>`}
                        </div>
                    </div>`;
            });
            resultHTML += '</div>';
            showResults(`Transport Options: ${origin} to ${dest}`, resultHTML);
        } catch (error) { showResults('Error', `<p class="text-red-400">${error.message}</p>`); }
    });

    resultsContent.addEventListener('click', (e) => {
        const header = e.target.closest('.accordion-header');
        if (header) {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.fa-chevron-down');
            icon.classList.toggle('rotate-180');
            if (content.style.maxHeight) { content.style.maxHeight = null; } else { content.style.maxHeight = content.scrollHeight + "px"; }
        }

        // New event listener for the details toggle button
        if (e.target.classList.contains('toggle-details-btn')) {
            const detailsSection = e.target.previousElementSibling;
            detailsSection.classList.toggle('open');
            e.target.textContent = detailsSection.classList.contains('open') ? 'Hide Details' : 'View Details';
        }
    });

    // --- INLINE EDIT LOGIC ---
    let isProfileEditing = false;

    function enterProfileEditMode() {
        isProfileEditing = true;
        personalInfoCard.classList.add('profile-editing');
        profileEditActions.classList.remove('hidden');
        editProfileBtn.querySelector('span').textContent = 'Editing...';
        editProfileBtn.disabled = true;
        editProfileBtn.classList.add('opacity-50', 'cursor-not-allowed');
        // Populate inputs from display values and toggle visibility
        Object.keys(inlineEditInputs).forEach(key => {
            const display = profileElements[key];
            const input = inlineEditInputs[key];
            input.value = display.textContent;
            display.classList.add('hidden');
            input.classList.remove('hidden');
        });
    }

    function exitProfileEditMode(save) {
        isProfileEditing = false;
        personalInfoCard.classList.remove('profile-editing');
        profileEditActions.classList.add('hidden');
        editProfileBtn.querySelector('span').textContent = 'Edit Profile';
        editProfileBtn.disabled = false;
        editProfileBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        Object.keys(inlineEditInputs).forEach(key => {
            const display = profileElements[key];
            const input = inlineEditInputs[key];
            if (save) display.textContent = input.value;
            display.classList.remove('hidden');
            input.classList.add('hidden');
        });
    }

    editProfileBtn.addEventListener('click', () => enterProfileEditMode());
    saveProfileBtn.addEventListener('click', () => exitProfileEditMode(true));
    cancelProfileBtn.addEventListener('click', () => exitProfileEditMode(false));

    // --- INLINE VEHICLE EDIT LOGIC ---
    function enterVehicleEditMode(type) {
        const data = vehicleElements[type];
        const inputs = vehicleEditInputs[type];
        const actionsDiv = document.getElementById(`${type}-edit-actions`);
        const editBtn = document.querySelector(`.edit-vehicle-btn[data-vehicle="${type}"]`);
        actionsDiv.classList.remove('hidden');
        editBtn.classList.add('hidden');
        Object.keys(data).forEach(key => {
            inputs[key].value = data[key].textContent;
            data[key].classList.add('hidden');
            inputs[key].classList.remove('hidden');
        });
    }

    function exitVehicleEditMode(type, save) {
        const data = vehicleElements[type];
        const inputs = vehicleEditInputs[type];
        const actionsDiv = document.getElementById(`${type}-edit-actions`);
        const editBtn = document.querySelector(`.edit-vehicle-btn[data-vehicle="${type}"]`);
        actionsDiv.classList.add('hidden');
        editBtn.classList.remove('hidden');
        Object.keys(data).forEach(key => {
            if (save) data[key].textContent = inputs[key].value;
            data[key].classList.remove('hidden');
            inputs[key].classList.add('hidden');
        });
    }

    editVehicleBtns.forEach(btn => btn.addEventListener('click', () => enterVehicleEditMode(btn.dataset.vehicle)));
    document.querySelectorAll('.save-vehicle-btn').forEach(btn => btn.addEventListener('click', () => exitVehicleEditMode(btn.dataset.vehicle, true)));
    document.querySelectorAll('.cancel-vehicle-btn').forEach(btn => btn.addEventListener('click', () => exitVehicleEditMode(btn.dataset.vehicle, false)));

    // --- VEHICLE TAB LOGIC ---
    const vehicleTabBtns = document.querySelectorAll('.vehicle-tab-btn');
    const vehicleContents = document.querySelectorAll('.vehicle-content');
    vehicleTabBtns.forEach(btn => btn.addEventListener('click', () => { vehicleTabBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); vehicleContents.forEach(c => c.classList.toggle('hidden', c.id !== `${btn.id.split('-')[0]}-content`)); }));
});