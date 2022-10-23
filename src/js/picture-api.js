const axios = require('axios').default;
import Notiflix from 'notiflix';

export default class PictureService {
  constructor() {
    this.searchValue = '';
    this.pageNumber = 1;
    this.maxPage = '';
  }

  async getImage() {
    console.log(this.searchValue);
    const KEY = '30780991-15ded2d5552668bc218cc390e';
    const baseUrl = 'https://pixabay.com/api/';
    const params = {
      params: {
        key: KEY,
        q: this.searchValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 100,
        page: this.pageNumber,
      },
    };
    try {
      const response = await axios.get(`https://pixabay.com/api/`, params);
      this.maxPage = Math.ceil(
        response.data.totalHits / params.params.per_page
      );
      console.log(this.maxPage);

      if (!response.data.hits.length) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      if (this.maxPage <= this.pageNumber) {
        Notiflix.Notify.warning(
          `We're sorry, but you've reached the end of search results.`
        );
      }
      if (params.params.page === 1) {
        Notiflix.Notify.info(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      }
      this.pageNumber += 1;

      return response.data.hits;
    } catch (error) {
      error => console.log(error);
    }
  }
  resetPageNumber() {
    this.pageNumber = 1;
  }
}
