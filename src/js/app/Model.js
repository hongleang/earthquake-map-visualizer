export default class Model {
  // Encapsulate the field
  #eqData;
  #selectedMapData;
  constructor() {
    this.#eqData = {}; // All the earthquake data which will fetch from the url
    this.#selectedMapData = {}; // The data of each earthquake that user currently selected
    this.observers = []; // Implements the Observer pattern
  }

  getEqData() {
    return this.#eqData; // Abstract the data through method
  }

  getSelectedMapData(){
    return this.#selectedMapData;
  }

  setSelectedData(newMapData) {
    this.#selectedMapData = Object.assign(this.#selectedMapData, newMapData); // Update the existing selectedMapData
    this.notifyObservers(); // Notify all Observer that the model has changed
  }
 
  // Fetch all the data from the url
  async fetchingEqData() {
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
    const response = await fetch(url);
    return response.json();
  }

  async init() {
    this.#eqData = await this.fetchingEqData(); // wait until the data has fully loaded
  }

  // Implements the Observer pattern
  // add Object to the observer
  addObserver(observer) {
    this.observers.push(observer);
  }
  
  // when notify the object would have access to the #selectedMapData from its update() method
  notifyObservers() {
    this.observers.forEach(observer => observer.update(this.#selectedMapData));
  }
}
