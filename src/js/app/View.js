import { createElement, getElement } from "../utils/helper";
import Callout from "./components/Callout/Callout";
import Map from "./components/Map/Map";

export default class View {
  #controller
  #model
  #app
  #callout
  constructor() {
    this.#model = null;
    this.#controller = null;
    this.#app = getElement('#app');

    this.#callout = new Callout(); // initialized CallOut view
  }

  setModel(model) {
    this.#model = model;
  }

  setController(controller) {
    this.#controller = controller;
  }

  closeCallout() {
    this.#callout.closeCallOut(); // manipulate Callout from View Layer
  }

  openCallout() {
    this.#callout.openCallOut(); // manipulate Callout from View Layer
  }

  async render() {
    const main = createElement('main');
    main.id = 'main';
    const mapDom = createElement('div');
    mapDom.id = 'map';

    const map = new Map(); // initialized Map view
    
    map.setController(this.#controller);
    await map.render(mapDom, this.#model.getEqData()); // trigger initial map render

    // add views to observers
    this.#model.addObserver(map)
    this.#model.addObserver(this.#callout)

    this.#callout.render(); // trigger initial callout

    main.append(mapDom);

    this.#app.append(main, this.#callout.aside); // append all doms
  }
}