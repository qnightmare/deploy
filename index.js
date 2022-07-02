import CardsList from './cards-list.js';
import Pagination from './pagination.js';

const BACKEND_URL = 'https://online-store.bootcamp.place/api/'

export default class OnlineStorePage {


  constructor () {
    this.pageSize = 9;
    this.products = [];
    this.url = new URL ('products', BACKEND_URL);
    this.url.searchParams.set('_limit', this.pageSize)
    this.components = {};
    this.initComponents();
    this.render();
    this.renderComponents();

    this.initEventListeners();
    this.update (1);
  }

  async LoadData (pageNumber) {
    this.url.searchParams.set('_page', pageNumber)
    const responce = await fetch(this.url)
    const products = await responce.json ();

    return products;
  }

  getTeamplate () {
    return `
    <div class="container">
    <div class="row">
    <div class="col-12 col-s-0 col-m-4 col-l-4 col-xl-2">
          left side
        </div>
      <div class="col-12 col-s-12 col-m-8 col-l-8 col-xl-10">
        <div  data-element="cardsList">
        <!--CardComponent-->
        </div>
        <div data-element="pagination">
        <!-- Pagination Component -->
        </div>
      </div>
      </div>
      </div>
    `;
  }

  initComponents () {
    //TODO: remove hardcoded value
  const totalElements = 100;

  const totalPages = Math.ceil(totalElements / this.pageSize);

  const cardList = new CardsList(this.products);
  const pagination = new Pagination ({
    activePageIndex: 0,
    totalPages: totalPages
});
  this.components.cardList = cardList;
  this.components.pagination = pagination;
  }

  renderComponents () {
    const cardsContainer = this.element.querySelector('[data-element="cardsList"]');
    const paginationContainer = this.element.querySelector('[data-element="pagination"]');
    cardsContainer.append(this.components.cardList.element);
    paginationContainer.append(this.components.pagination.element);

  }
  render () {
    const wrapper = document.createElement ('div');
    wrapper.innerHTML = this.getTeamplate ();

    this.element = wrapper.firstElementChild;
  }

  initEventListeners () {
    this.components.pagination.element.addEventListener('page-changed', event => {
      const pageIndex = event.detail;
      this.update (pageIndex + 1);

    });
  }
  async  update (pageNumber) {
    const data = await this.LoadData(pageNumber);
    this.components.cardList.update(data);
  }
}
