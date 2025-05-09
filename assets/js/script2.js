document.addEventListener('DOMContentLoaded', function() {

    
    // Mobile menu toggle
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    
    if (navbarToggle) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            
            // Animation for hamburger to X
            const bars = this.querySelectorAll('.bar');
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                bars[0].style.transform = '';
                bars[1].style.opacity = '1';
                bars[2].style.transform = '';
            }
        });
    }

    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Active menu item on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function onScroll() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.navbar-menu a').forEach(a => {
                    a.classList.remove('active');
                });
                document.querySelector('.navbar-menu a[href="#' + sectionId + '"]')?.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', onScroll);
    
    // Animate on scroll
    const animateElements = document.querySelectorAll('.facility-card, .gallery-item, .section-title, .about-card');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animateElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            if ((elementBottomPosition >= windowTopPosition) && (elementTopPosition <= windowBottomPosition)) {
                element.classList.add('animate');
            }
        });
    }
    
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('resize', checkIfInView);
    window.addEventListener('load', checkIfInView);
    checkIfInView(); // Check on initial load
    
    // Facilities tabs
    const facilityButtons = document.querySelectorAll('.facility-btn');
    const facilityContents = document.querySelectorAll('.facility-content');
    
    facilityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const facilityId = this.getAttribute('data-facility');
            
            facilityButtons.forEach(btn => btn.classList.remove('active'));
            facilityContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(facilityId).classList.add('active');
        });
    });
    
    // Gallery filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Image modal
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.querySelector('.modal-caption');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    let currentImageIndex = 0;
    let visibleGalleryItems = [];
    
    function updateVisibleItems() {
        visibleGalleryItems = Array.from(galleryItems).filter(
            item => window.getComputedStyle(item).display !== 'none'
        );
    }
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            updateVisibleItems();
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-overlay p').textContent;
            
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalCaption.textContent = caption;
            
            currentImageIndex = visibleGalleryItems.indexOf(this);
        });
    });
    
    modalClose.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    modalPrev.addEventListener('click', function() {
        updateVisibleItems();
        if (visibleGalleryItems.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
            const img = visibleGalleryItems[currentImageIndex].querySelector('img');
            const caption = visibleGalleryItems[currentImageIndex].querySelector('.gallery-overlay p').textContent;
            
            modalImg.src = img.src;
            modalCaption.textContent = caption;
        }
    });
    
    modalNext.addEventListener('click', function() {
        updateVisibleItems();
        if (visibleGalleryItems.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % visibleGalleryItems.length;
            const img = visibleGalleryItems[currentImageIndex].querySelector('img');
            const caption = visibleGalleryItems[currentImageIndex].querySelector('.gallery-overlay p').textContent;
            
            modalImg.src = img.src;
            modalCaption.textContent = caption;
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                modalPrev.click();
            } else if (e.key === 'ArrowRight') {
                modalNext.click();
            } else if (e.key === 'Escape') {
                modal.style.display = 'none';
            }
        }
    });
});