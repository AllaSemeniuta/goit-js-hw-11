import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import galleryCard from './templates/gallery-card.hbs';

const axios = require('axios').default;
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });
let searchValue;
let pageCounter = 1;

const refs = {
  searchForm: document.querySelector('.search-form'),
  requestField: document.querySelector('.search-form__input'),
  searchButton: document.querySelector('.search-form__button'),
  galleryList: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreButton.addEventListener('click', onLoadMore);

function onSubmit(evt) {
  evt.preventDefault();
  searchValue = evt.srcElement.searchQuery.value.toLowerCase().trim();
  console.log(searchValue);
  getImage(searchValue).then(data => {
    clearMarkup();
    renderMarkup(data);
  });
  pageCounter = 1;
}

function onLoadMore(evt, searchValue) {
  evt.preventDefault();
  pageCounter += 1;
  getImage(searchValue, pageCounter).then(data => {
    renderMarkup(data);
  });
}

async function getImage(query, page = 1) {
  const KEY = '30780991-15ded2d5552668bc218cc390e';
  const baseUrl = 'https://pixabay.com/api/';
  const params = {
    params: {
      key: KEY,
      q: searchValue,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 100,
      page: page,
    },
  };
  try {
    const response = await axios.get(`https://pixabay.com/api/`, params);
    const array = response.data.hits;
    if (array.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    //видалити цю
    return array;
    // if (array.length === response.data.totalHits) {
    //   Notiflix.Notify.failure(
    //     "We're sorry, but you've reached the end of search results."
    //   );
    //   return;
    // }

    renderMarkup(array);
  } catch (error) {
    console.error(error);
  }
}
function clearMarkup() {
  refs.galleryList.innerHTML = '';
}
function renderMarkup(array) {
  // const resp = array.map(image => galleryCard(image)).join(' ');
  refs.galleryList.insertAdjacentHTML('beforeend', galleryCard(array));
  lightbox.refresh();
}
