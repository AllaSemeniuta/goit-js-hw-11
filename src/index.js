import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import galleryCard from './templates/gallery-card.hbs';
import PictureService from './js/picture-api';

const axios = require('axios').default;
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

const options = {
  root: null,
  rootMargin: '50px',
  threshold: 1,
};

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryList: document.querySelector('.gallery'),
  guard: document.querySelector('.guard'),
};

refs.searchForm.addEventListener('submit', onSubmit);

const pictureApiService = new PictureService();
const observer = new IntersectionObserver(observerCallback, options);

function onSubmit(evt) {
  evt.preventDefault();
  console.log('hello');
  pictureApiService.searchValue = evt.srcElement.searchQuery.value
    .toLowerCase()
    .trim();
  clearMarkup();
  pictureApiService.resetPageNumber();
  observer.unobserve(refs.guard);
  pictureApiService
    .getImage()
    .then(data => {
      renderMarkup(data);
    })
    .catch(console.log);
}

function clearMarkup() {
  refs.galleryList.innerHTML = '';
}

function renderMarkup(array) {
  if (!array) {
    observer.unobserve(refs.guard);
    return;
  }
  // const resp = array.map(image => galleryCard(image)).join(' ');
  refs.galleryList.insertAdjacentHTML('beforeend', galleryCard(array));
  observer.observe(refs.guard);

  if (pictureApiService.maxPage < pictureApiService.pageNumber) {
    observer.unobserve(refs.guard);
  }
  lightbox.refresh();
}

function observerCallback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      pictureApiService
        .getImage()
        .then(data => {
          console.log(data);
          renderMarkup(data);
        })
        .catch(console.log);
    }
  });
}

const { height: cardHeight } = document.querySelector('.gallery');

console.log({ height: cardHeight });
// .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});

// 3. Плавний скрол

//Розмітка
// зробити стрілочку вгору
// подивитись на відловку помилок
