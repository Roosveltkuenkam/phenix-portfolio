document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');
    
    // Function to handle header style on scroll
    const handleScroll = () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const isNavLink = this.classList.contains('nav-link');
            const navbarCollapse = document.getElementById('navbarNav');
            
            if (isNavLink && navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }

            const targetSelector = this.getAttribute('href');
            const targetElement = targetSelector.length > 1 ? document.querySelector(targetSelector) : null;
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle Portfolio Modal
    const portfolioModal = document.getElementById('portfolioModal');
    if (portfolioModal) {
        let currentStep = null;
        portfolioModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const title = button.getAttribute('data-title');
            const category = button.getAttribute('data-category');
            const steps = JSON.parse(button.getAttribute('data-steps'));
            const description = button.getAttribute('data-description');
            const details = JSON.parse(button.getAttribute('data-details'));

            const modalTitle = portfolioModal.querySelector('.modal-title');
            const modalCategory = portfolioModal.querySelector('#modalProjectCategory');
            const modalDescription = portfolioModal.querySelector('#modalProjectDescription');
            const modalDetailsList = portfolioModal.querySelector('#modalProjectDetails');
            const carouselInner = portfolioModal.querySelector('.carousel-inner');
            const stepButtonsContainer = portfolioModal.querySelector('#modalStepButtons');

            modalTitle.textContent = title;
            modalCategory.textContent = category;
            modalDescription.textContent = description;

            // Génère les boutons d'étapes
            stepButtonsContainer.innerHTML = '';
            Object.keys(steps).forEach((stepName, idx) => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline-gold';
                btn.textContent = stepName;
                btn.dataset.step = stepName;
                if (idx === 0) btn.classList.add('active');
                btn.onclick = function() {
                    currentStep = stepName;
                    Array.from(stepButtonsContainer.children).forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderStepImages(stepName);
                };
                stepButtonsContainer.appendChild(btn);
            });

            // Fonction pour afficher les images de l'étape sélectionnée
            function renderStepImages(stepName) {
                carouselInner.innerHTML = '';
                steps[stepName].forEach((image, index) => {
                    const carouselItem = document.createElement('div');
                    carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : '');
                    const img = document.createElement('img');
                    img.src = image;
                    img.className = 'd-block w-100';
                    img.alt = `${title} - ${stepName} ${index + 1}`;
                    carouselItem.appendChild(img);
                    carouselInner.appendChild(carouselItem);
                });
            }
            // Affiche la première étape par défaut
            currentStep = Object.keys(steps)[0];
            renderStepImages(currentStep);

            // Clear and create new details list
            modalDetailsList.innerHTML = '';
            for (const key in details) {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${key}:</strong> <span>${details[key]}</span>`;
                modalDetailsList.appendChild(li);
            }
        });
    }

    // Initialize Leaflet Map
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Coordinates for Paris, France
        const lat = 3.8666700;
        const lon = 11.5166700;
        
        const map = L.map('map').setView([lat, lon], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([lat, lon]).addTo(map)
            .bindPopup('<b>PHENIX ART DESIGN</b><br>Olembe, Yaoundé.')
            .openPopup();
    }

    // Contact Form Submission
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        emailjs.sendForm('TON_SERVICE_ID', 'TON_TEMPLATE_ID', this)
            .then(function() {
                alert('Message envoyé avec succès !');
                document.getElementById('contactForm').reset();
            }, function(error) {
                alert('Erreur lors de l\'envoi : ' + error.text);
            });
    });
});