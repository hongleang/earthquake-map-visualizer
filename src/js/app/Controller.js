export default class Controller {
  #view;
  #model;

  setView(view) {
    this.#view = view;
  }

  setModel(model) {
    this.#model = model;
  }

  onMapClick(selectedMapData) {
    // Handles click event when user click on map circle
    // and set selected data for the callout
    this.#model.setSelectedData(selectedMapData);
  }

  onOpenCallout() {
    // Open callout through View layer
    this.#view.openCallout();
  }

  onCloseCallout() {
    // Close callout through View layer
    this.#view.closeCallout();
  }
}