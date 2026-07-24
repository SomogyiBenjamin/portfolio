
const seasonalStylesheetPath = {
    spring: 'styles/spring.css',
    summer: 'styles/summer.css',
    autumn: 'styles/autumn.css',
    winter: 'styles/winter.css'
};

function getCurrentSeason(date = new Date()) {
    const month = date.getMonth() + 1;

    if (month >= 3 && month <= 5) {
        return 'spring';
    }

    if (month >= 6 && month <= 8) {
        return 'summer';
    }

    if (month >= 9 && month <= 11) {
        return 'autumn';
    }

    return 'winter';
    
}

function loadSeasonalStylesheet(season = getCurrentSeason()) {
    const existingLink = document.querySelector('link[data-season-theme]');
    if (existingLink) {
        existingLink.remove();
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = seasonalStylesheetPath[season] || seasonalStylesheetPath.summer;
    link.setAttribute('data-season-theme', 'true');
    document.head.appendChild(link);
}

document.addEventListener('DOMContentLoaded', function() {
    loadSeasonalStylesheet(getCurrentSeason());
    
    setTimeout(() => {
      document.querySelectorAll('.contentRight').forEach((element) => {
              element.addEventListener('animationend', () => {
                  element.classList.remove('animate__animated');
                  element.style.animation = 'none';
                  element.style.transform = 'none';
              });
          });


    }, 1000);
    
    const carouselNames = new Set();
    document.querySelectorAll('.carousel__activator').forEach(input => {
        carouselNames.add(input.name);
    });

    const navLinks = Array.from(document.querySelectorAll('.header a'));
    const navSections = navLinks
        .map(link => {
            const href = link.getAttribute('href') || '';
            const targetId = href.replace(/^#/, '');
            const section = targetId ? document.getElementById(targetId) : null;
            return { link, section };
        })
        .filter(item => item.section);

    const setActiveNavItem = (activeLink) => {
        navLinks.forEach(link => {
            const parent = link.parentElement;
            if (parent) {
                parent.classList.toggle('selectedSection', link === activeLink);
            }
        });
    };

    const updateActiveNavItem = () => {
        const offset = window.scrollY + window.innerHeight * 0.35;
        let activeLink = navLinks[0] || null;

        navSections.forEach(({ link, section }) => {
            if (section && section.offsetTop <= offset) {
                activeLink = link;
            }
        });

        setActiveNavItem(activeLink);
    };

    let ticking = false;
    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNavItem();
                ticking = false;
            });
            ticking = true;
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            setActiveNavItem(link);
        });
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    updateActiveNavItem();

    carouselNames.forEach(carouselName => {
        const inputs = document.querySelectorAll(`input[name="${carouselName}"]`);
        let currentIndex = 0;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % inputs.length;
            inputs[currentIndex].checked = true;
        }, 10000);
    });
});



document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault(); 
  
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const endpoint = "https://formspree.io/f/meebeeae";

  document.querySelector("#sendBtn").classList.toggle("loader")
  document.querySelector("#btnText").classList.toggle("hideText")
  document.querySelector("#btnIcon").classList.toggle("hideText")

  setTimeout(async () => {
    
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, message: message })
    });

    if (response.ok) {
      document.getElementById('modalTitle').innerText = "Köszönöm!";
      document.getElementById('modalMessage').innerText = "Az üzeneted sikeresen elküldted. Hamarosan kapcsolatba lépek veled.";
      document.getElementById('contactForm').reset();
      document.getElementById('thankYouModal').style.display = 'block';
      document.body.style.overflow = 'hidden';
      document.querySelector("#sendBtn").classList.toggle("loader")
      document.querySelector("#btnText").classList.toggle("hideText")
      document.querySelector("#btnIcon").classList.toggle("hideText")
    } else {
      document.getElementById('modalTitle').innerText = "Hiba!";
      document.getElementById('modalMessage').innerText = "Hiba történt a küldés során. Kérlek, próbáld újra!";
      document.getElementById('thankYouModal').style.display = 'block';
      document.body.style.overflow = 'hidden';
      document.querySelector("#sendBtn").classList.toggle("loader")
      document.querySelector("#btnText").classList.toggle("hideText")
      document.querySelector("#btnIcon").classList.toggle("hideText")
    }
  } catch (error) {
    document.getElementById('modalTitle').innerText = "Hiba!";
    document.getElementById('modalMessage').innerText = "Hálózati hiba történt. Ellenőrizd a kapcsolatot.";
    document.getElementById('thankYouModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.querySelector("#sendBtn").classList.toggle("loader")
    document.querySelector("#btnText").classList.toggle("hideText")
    document.querySelector("#btnIcon").classList.toggle("hideText")
  }

  }, 2000);


});

const modal = document.getElementById('thankYouModal');
const closeBtn = document.querySelector('.close');

if (closeBtn) {
  closeBtn.onclick = function() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

const imageModal = document.getElementById('imageModal');
const imageModalCloseBtn = imageModal.querySelector('.close');

if (imageModalCloseBtn) {
  imageModalCloseBtn.onclick = function() {
    imageModal.style.display = 'none';
    document.body.style.overflow = '';
    if (window.modalRotationInterval) {
      clearInterval(window.modalRotationInterval);
      window.modalRotationInterval = null;
    }
  }
}

window.addEventListener('click', function(event) {
  if (event.target == imageModal) {
    imageModal.style.display = 'none';
    document.body.style.overflow = '';
    if (window.modalRotationInterval) {
      clearInterval(window.modalRotationInterval);
      window.modalRotationInterval = null;
    }
  }
});

(function() {
  const imgs = Array.from(document.querySelectorAll('.carousel_image'));

  function createHandler(img) {
    return function() {
      const parentCarousel = img.closest('ul.carousel');
      const slides = parentCarousel.querySelectorAll('.carousel__slide');
      const inputs = parentCarousel.querySelectorAll('.carousel__activator');
      const slideCount = slides.length;

      let checkedIndex = 0;
      inputs.forEach((input, i) => {
        if (input.checked) {
          checkedIndex = i;
        }
      });

      const modalCarousel = document.getElementById('modalCarousel');

      const existingSlides = modalCarousel.querySelectorAll('.carousel__slide');
      existingSlides.forEach(slide => slide.remove());

      const existingInputs = modalCarousel.querySelectorAll('.carousel__activator');
      existingInputs.forEach(input => input.remove());

      const existingIndicators = modalCarousel.querySelector('.carousel__indicators');
      if (existingIndicators) existingIndicators.remove();

      slides.forEach((slide, index) => {
        const newInput = document.createElement('input');
        newInput.className = 'carousel__activator';
        newInput.type = 'radio';
        newInput.id = `modal_${index}`;
        newInput.name = 'carouselModal';
        if (index === checkedIndex) newInput.checked = true;
        modalCarousel.appendChild(newInput);
      });

      slides.forEach((slide, index) => {
        const newSlide = document.createElement('li');
        newSlide.className = 'carousel__slide';
        const srcImg = slide.querySelector('img');
        if (srcImg) {
          const imgClone = srcImg.cloneNode(true);
          newSlide.appendChild(imgClone);
        }
        modalCarousel.appendChild(newSlide);
      });

      const indicatorsDiv = document.createElement('div');
      indicatorsDiv.className = 'carousel__indicators';
      for (let i = 0; i < slideCount; i++) {
        const label = document.createElement('label');
        label.className = 'carousel__indicator';
        label.htmlFor = `modal_${i}`;
        indicatorsDiv.appendChild(label);
      }
      modalCarousel.appendChild(indicatorsDiv);

      imageModal.style.display = 'block';
      document.body.style.overflow = 'hidden';

      const newModalInputs = modalCarousel.querySelectorAll(`input[name="carouselModal"]`);
      let currentModalIndex = checkedIndex;

      if (window.modalRotationInterval) {
        clearInterval(window.modalRotationInterval);
      }

      window.modalRotationInterval = setInterval(() => {
        currentModalIndex = (currentModalIndex + 1) % newModalInputs.length;
        newModalInputs[currentModalIndex].checked = true;
      }, 10000);
    };
  }

  function setupCarouselImageHandlers() {
    const isMobile = window.matchMedia('(max-width:600px)').matches;
    imgs.forEach(img => {
      // remove existing handler if present
      if (img._carouselClickHandler) {
        img.removeEventListener('click', img._carouselClickHandler);
        img._carouselClickHandler = null;
      }

      img.style.cursor = isMobile ? 'default' : 'pointer';

      if (!isMobile) {
        img._carouselClickHandler = createHandler(img);
        img.addEventListener('click', img._carouselClickHandler);
      }
    });
  }

  const mq = window.matchMedia('(max-width:600px)');
  if (mq.addEventListener) {
    mq.addEventListener('change', setupCarouselImageHandlers);
  } else if (mq.addListener) {
    mq.addListener(setupCarouselImageHandlers);
  }

  window.addEventListener('resize', setupCarouselImageHandlers);

  setupCarouselImageHandlers();
})();


const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate__animated'); 
      entry.target.classList.add('animate__zoomIn'); 
      
      observer.unobserve(entry.target);
    }
  });
});

const hiddenElements = document.querySelectorAll('.contentRight');
hiddenElements.forEach((el) => observer.observe(el));

const hiddenElements2 = document.querySelectorAll('.contactContainer');
hiddenElements2.forEach((el) => observer.observe(el));




let isScrolling = false;

window.addEventListener('wheel', (e) => {
  // Prevent the browser's default scrolling behavior
  e.preventDefault();

  // If a scroll is already in progress, ignore further wheel events
  if (isScrolling) return;

  // Lock the scrolling
  isScrolling = true;

  // Determine direction (positive deltaY is scrolling down, negative is up)
  const direction = e.deltaY > 0 ? 1 : -1;

  // window.innerHeight is the JavaScript equivalent of 100vh in CSS
  const scrollDistance = window.innerHeight;

  // Perform the scroll
  window.scrollBy({
    top: direction * scrollDistance,
    left: 0,
    behavior: 'smooth' // Creates a smooth gliding animation
  });

  setTimeout(() => {
    isScrolling = false;
  }, 800); 

}, { passive: false });