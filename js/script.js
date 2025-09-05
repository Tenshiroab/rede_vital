
// Atualiza o ano automaticamente
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menu responsivo
const btnMenu = document.querySelector('.menu-toggle');
const nav = document.querySelector('header nav');
if (btnMenu && nav) {
  btnMenu.addEventListener('click', () => {
    nav.classList.toggle('active');
    btnMenu.classList.toggle('active');
  });

  // Fecha o menu ao clicar em um link
  const menuLinks = document.querySelectorAll('header nav a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      btnMenu.classList.remove('active');
    });
  });

  // Scroll suave para navegação
  document.querySelectorAll('nav.menu a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Slider de imagens (só se existir)
const track = document.querySelector('.slider-track');
if (track) {
  (function() {
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.slider-btn.next');
    const prevBtn = document.querySelector('.slider-btn.prev');

    // Clona primeiro e último
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length-1].cloneNode(true);
    firstClone.dataset.clone = 'first';
    lastClone.dataset.clone = 'last';
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const allSlides = Array.from(track.children);
    let index = 1;

    function updateTrack(immediate=false){
      if(immediate) track.style.transition = 'none';
      track.style.transform = `translateX(-${index*100}%)`;
      if(immediate){
        void track.offsetHeight;
        track.style.transition = 'transform 0.55s ease-in-out';
      }
    }

    updateTrack(true);

    function nextSlide(){
      index++;
      updateTrack();
    }

    function prevSlide(){
      index--;
      updateTrack();
    }

    track.addEventListener('transitionend', ()=>{
      if(allSlides[index].dataset.clone === 'first'){
        index = 1;
        updateTrack(true);
      } else if(allSlides[index].dataset.clone === 'last'){
        index = allSlides.length-2;
        updateTrack(true);
      }
    });

    nextBtn.addEventListener('click', ()=>{ nextSlide(); restartAuto(); });
    prevBtn.addEventListener('click', ()=>{ prevSlide(); restartAuto(); });

    let auto = setInterval(nextSlide, 5000);
    function restartAuto(){
      clearInterval(auto);
      auto = setInterval(nextSlide, 5000);
    }

    // Swipe touch
    let startX=0, isDragging=false;
    const container = document.querySelector('.slider-container');
    container.addEventListener('touchstart', e=>{ startX=e.touches[0].clientX; isDragging=true; clearInterval(auto); }, {passive:true});
    container.addEventListener('touchmove', e=>{
      if(!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      track.style.transition = 'none';
      track.style.transform = `translateX(calc(-${index*100}% + ${dx}px))`;
    }, {passive:true});
    container.addEventListener('touchend', e=>{
      isDragging=false;
      const dx = e.changedTouches[0].clientX - startX;
      track.style.transition = 'transform 0.55s ease-in-out';
      if(dx < -60) nextSlide();
      else if(dx > 60) prevSlide();
      else updateTrack();
      restartAuto();
    });
  })();
}

// FAQ toggle
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.faq-pergunta').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.closest('.faq-item');
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
      // Atualiza aria-expanded
      document.querySelectorAll('.faq-pergunta').forEach(b => b.setAttribute('aria-expanded', 'false'));
      if (!open) this.setAttribute('aria-expanded', 'true');
    });
  });
});



