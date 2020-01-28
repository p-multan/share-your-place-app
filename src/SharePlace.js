import { Modal } from './UI/Modal';
import { Map } from './UI/Map';
import { Alert } from './UI/Alert';
import { getCoordsFromAddress, getAddressFromCoords } from './Utility/Location';

class PlaceFinder {
  constructor() {
    const addressForm = document.getElementById('address-form');
    const locateUserBtn = document.getElementById('locate-btn');
    this.shareBtn = document.getElementById('share-btn');
    this.sharedLinkInputElement = document.getElementById('share-link');

    addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
    locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
    this.shareBtn.addEventListener('click', this.sharePlaceHandler.bind(this));
  }

  sharePlaceHandler() {
    if (!navigator.clipboard) {
      this.sharedLinkInputElement.select();
      return;
    }

    navigator.clipboard
      .writeText(this.sharedLinkInputElement.value)
      .then(() => {
        const alert = new Alert(
          'Your share link has been successfully copied into your clipboard!',
          'success'
        );
        alert.createAlert();
      })
      .catch(err => {
        this.sharedLinkInputElement.select();
        console.log(err);
      });
  }

  selectPlace(coordinates, address) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }

    this.shareBtn.disabled = false;
    this.sharedLinkInputElement.value = `${
      location.href
    }my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${
      coordinates.lng
    }`;
  }

  locateUserHandler() {
    if (!navigator.geolocation) {
      const alert = new Alert(
        'Location feature is not supported by your browser - please use more modern browser or enter the address manually!',
        'danger'
      );
      alert.createAlert();
      return;
    }

    const modal = new Modal(
      'loading-modal-content',
      'Loading Location - please wait!'
    );
    modal.show();

    navigator.geolocation.getCurrentPosition(
      async successResult => {
        const coordinates = {
          lat: successResult.coords.latitude,
          lng: successResult.coords.longitude
        };

        const address = await getAddressFromCoords(coordinates);
        modal.hide();
        this.selectPlace(coordinates, address);
      },
      error => {
        modal.hide();
        const alert = new Alert(
          'Could not locate you unfortunately, please enter your address manually',
          'danger'
        );
        alert.createAlert();
      }
    );
  }

  async findAddressHandler(e) {
    e.preventDefault();

    const address = e.target.addressInput.value;
    if (!address || address.trim().length === 0) {
      const alert = new Alert(
        'Invalid address entered - please try again!',
        'danger'
      );
      alert.createAlert();
      return;
    }

    const modal = new Modal(
      'loading-modal-content',
      'Loading Location - please wait!'
    );
    modal.show();

    try {
      const coordinates = await getCoordsFromAddress(address);
      this.selectPlace(coordinates, address);
    } catch (err) {
      console.log(err.message);
    }
    modal.hide();
  }
}

new PlaceFinder();
