
document.addEventListener('DOMContentLoaded', function () {
  const elems = document.querySelectorAll('.carousel');
  M.Carousel.init(elems, {
    fullWidth: true,
    indicators: true
  });
});



  function toggleVideo() {
      const modal = document.getElementById('trailer-modal');
      const video = document.getElementById('trailer-video');
      if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        video.play();
      } else {
        modal.classList.add('hidden');
        video.pause();
        video.currentTime = 0;
      }
    }


// Background switch on card click
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const bg = card.getAttribute('data-bg');
    document.body.style.backgroundImage = `url(${bg})`;
     document.body.style.transition = 'background-image 0.5s ease-in-out';
  });
});


const cards = document.querySelectorAll('#carousel-track .card');
let activeIndex = 0;

function updateCarousel() {
  cards.forEach((card, i) => {
    card.classList.remove('active', 'left', 'right');
    if (i === activeIndex) {
      card.classList.add('active');
      document.body.style.backgroundImage = `url(${card.getAttribute('data-bg')})`;
      document.body.style.transition = 'background-image 0.8s ease-in-out';
    } else if (i === activeIndex + 1 || (activeIndex === cards.length -1 && i === 0)) {
      card.classList.add('left');
    } else {
      card.classList.add('right');
    }
  });
}

function nextCard() {
  activeIndex = (activeIndex + 1) % cards.length;
  updateCarousel();
}

function prevCard() {
  activeIndex = (activeIndex - 1 + cards.length) % cards.length;
  updateCarousel();
}

updateCarousel();


let currentIndex = 0;

function updateCarousel() {
  const track = document.getElementById("carousel-track");
  const cardWidth = track.children[0].offsetWidth + 32; // 240px card + 32px gap
  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

function nextCard() {
  const track = document.getElementById("carousel-track");
  if (currentIndex < track.children.length - 1) {
    currentIndex++;
    updateCarousel();
  }
}

function prevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
}

  const carousel = document.getElementById('feature-carousel');
  let index = 0;

  setInterval(() => {
    index = (index + 1) % 4; // 4 slides
    carousel.style.transform = `translateX(-${index * 100}%)`;
  }, 3000); // 3 seconds interval



