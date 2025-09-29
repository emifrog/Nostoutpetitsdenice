document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Vérifier si le navigateur supporte les fonctionnalités nécessaires
    if (!('querySelector' in document) || !('addEventListener' in window)) {
        return; // Ne rien faire si les fonctionnalités de base ne sont pas supportées
    }

    // Éléments du DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const backToTopBtn = document.querySelector('.back-to-top');
    const header = document.querySelector('.header');
    
    // Fonction utilitaire pour vérifier si un élément est visible
    const isElementInViewport = (el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // Gestion du menu mobile
    const initMobileMenu = () => {
        // Utiliser le bouton de menu existant
        const toggleBtn = document.querySelector('.mobile-menu-btn');
        
        if (toggleBtn && mainNav) {
            // Ajouter les attributs ARIA manquants
            toggleBtn.setAttribute('role', 'button');
            toggleBtn.setAttribute('aria-label', 'Menu');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('aria-controls', 'main-navigation');
            toggleBtn.setAttribute('aria-haspopup', 'true');
            
            // Mettre à jour le contenu du bouton
            toggleBtn.innerHTML = `
                <span class="menu-icon" aria-hidden="true">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </span>
                <span class="sr-only">Menu</span>
            `;
            
            // Fonction pour basculer le menu
            const toggleMenu = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                const newState = !isExpanded;
                
                toggleBtn.setAttribute('aria-expanded', newState);
                mainNav.classList.toggle('active', newState);
                document.body.classList.toggle('menu-open', newState);
                
                // Gérer le focus
                if (newState) {
                    // Au premier élément du menu
                    const firstFocusable = mainNav.querySelector('a, button, [tabindex="0"]');
                    if (firstFocusable) firstFocusable.focus();
                } else {
                    toggleBtn.focus();
                }
            };
            
            // Gérer le clic sur le bouton
            toggleBtn.addEventListener('click', toggleMenu);
            
            // Fermer le menu lors d'un clic en dehors
            document.addEventListener('click', (e) => {
                if (mainNav.classList.contains('active') && 
                    !mainNav.contains(e.target) && 
                    !toggleBtn.contains(e.target)) {
                    toggleMenu(e);
                }
            });
            
            // Fermer le menu avec la touche Échap
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                    toggleMenu(e);
                }
            });
            
            // Gérer la navigation au clavier dans le menu
            mainNav.addEventListener('keydown', (e) => {
                if (!e.target.matches('a, button, [tabindex="0"]')) return;
                
                const menuItems = Array.from(mainNav.querySelectorAll('a, button, [tabindex="0"]'));
                const currentIndex = menuItems.indexOf(e.target);
                
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextItem = menuItems[currentIndex + 1] || menuItems[0];
                    nextItem.focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevItem = menuItems[currentIndex - 1] || menuItems[menuItems.length - 1];
                    prevItem.focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    menuItems[0].focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    menuItems[menuItems.length - 1].focus();
                }
            });
        }
    };

    // Fonction pour fermer le menu mobile
    const closeMobileMenu = () => {
        if (mainNav) {
            mainNav.classList.remove('active');
        }
        
        const toggleBtn = document.querySelector('.mobile-menu-btn');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
            const icon = toggleBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
        
        document.body.classList.remove('menu-open');
        
        // Fermer tous les sous-menus
        document.querySelectorAll('.has-submenu').forEach(item => {
            item.classList.remove('active');
            const toggle = item.querySelector('.submenu-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    };

    // Gestion du bouton de retour en haut
    const initBackToTop = () => {
        if (!backToTopBtn) return;
        
        const toggleBackToTop = () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
                backToTopBtn.setAttribute('aria-hidden', 'false');
            } else {
                backToTopBtn.classList.remove('visible');
                backToTopBtn.setAttribute('aria-hidden', 'true');
            }
        };
        
        window.addEventListener('scroll', toggleBackToTop);
        
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Vérifier la position au chargement
        toggleBackToTop();
    };

    // Gestion des animations
    const initAnimations = () => {
        // Ajouter des animations aux éléments au défilement
        const animateOnScroll = () => {
            document.querySelectorAll('.animate-on-scroll').forEach(element => {
                if (isElementInViewport(element)) {
                    element.classList.add('animated');
                }
            });
        };
        
        window.addEventListener('scroll', animateOnScroll);
        window.addEventListener('resize', animateOnScroll);
        window.addEventListener('load', animateOnScroll);
    };

    // Gestion du formulaire de contact
    const initContactForm = () => {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.innerHTML : '';
            
            try {
                // Désactiver le bouton de soumission
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.innerHTML = 'Envoi en cours...';
                }
                
                // Ici, vous pouvez ajouter le code pour envoyer le formulaire
                // Par exemple, avec fetch() vers votre API
                
                // Simulation d'un envoi réussi
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Afficher un message de succès
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.textContent = 'Votre message a été envoyé avec succès !';
                successMessage.style.color = 'green';
                successMessage.style.marginTop = '10px';
                
                // Supprimer les messages précédents
                const existingMessages = contactForm.querySelectorAll('.form-error, .form-success');
                existingMessages.forEach(msg => msg.remove());
                
                contactForm.appendChild(successMessage);
                contactForm.reset();
                
            } catch (error) {
                console.error('Erreur lors de l\'envoi du formulaire:', error);
                
                // Afficher un message d'erreur
                const errorMessage = document.createElement('div');
                errorMessage.className = 'form-error';
                errorMessage.textContent = 'Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.';
                errorMessage.style.color = 'red';
                errorMessage.style.marginTop = '10px';
                
                // Supprimer les messages précédents
                const existingMessages = contactForm.querySelectorAll('.form-error, .form-success');
                existingMessages.forEach(msg => msg.remove());
                
                contactForm.appendChild(errorMessage);
                
            } finally {
                // Réactiver le bouton de soumission
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }
            }
        });
    };
    
    // Fonction pour initialiser le défilement automatique des partenaires
    const initPartnersScroll = () => {
        const container = document.getElementById('partenairesContainer');
        if (!container) return;

        // Dupliquer les logos pour un défilement infini fluide
        const slides = container.querySelectorAll('.partenaire-slide');
        if (slides.length === 0) return;

        // Dupliquer les slides pour créer un effet de boucle fluide
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            container.appendChild(clone);
        });

        // Ajuster la vitesse de défilement en fonction du nombre de slides
        const totalSlides = slides.length * 2; // Car on a doublé les slides
        const duration = totalSlides * 3; // 3 secondes par slide
        
        // Mettre à jour la durée de l'animation
        container.style.animationDuration = `${duration}s`;
        
        // Gérer la pause au survol
        container.addEventListener('mouseenter', () => {
            container.style.animationPlayState = 'paused';
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.animationPlayState = 'running';
        });
    };

    // Initialisation des fonctionnalités
    const init = () => {
        initMobileMenu();
        initBackToTop();
        initAnimations();
        initContactForm();
        
        // Ajouter une classe au body pour indiquer que JavaScript est activé
        document.body.classList.add('js-enabled');
        
        // Amélioration de l'accessibilité pour les liens externes
        document.querySelectorAll('a[href^="http"]:not([href*="'+window.location.hostname+'"])').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            link.setAttribute('aria-label', link.textContent + ' (nouvelle fenêtre)');
        });
    };

    // Démarrer l'initialisation
    init();
    
    // Démarrer le défilement automatique après un court délai pour laisser le temps au chargement
    setTimeout(initPartnersScroll, 500);
});
