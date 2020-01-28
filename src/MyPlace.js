import { Map } from './UI/Map';

class LoadedPlace {
  constructor(coordinates, address) {
    new Map(coordinates);
    this.setShareNewPlaceLink();
    const headerTitleEl = document.querySelector('.header__title');
    headerTitleEl.textContent = address;
  }

  setShareNewPlaceLink() {
    const shareNewPlaceLink = document.getElementById('shareNewPlaceLink');

    const currentUrl = location.href;
    const newUrl = currentUrl
      .split('/')
      .slice(0, -2)
      .join('/');
    shareNewPlaceLink.href = newUrl;
  }
}

const url = new URL(location.href);
const queryParams = url.searchParams;
const coords = {
  lat: parseFloat(queryParams.get('lat')),
  lng: parseFloat(queryParams.get('lng'))
};

const address = queryParams.get('address');

new LoadedPlace(coords, address);
