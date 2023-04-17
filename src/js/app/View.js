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
    this.#callout = new Callout();
  }

  setModel(model) {
    this.#model = model;
  }

  setController(controller) {
    this.#controller = controller;
  }

  closeCallout() {
    this.#callout.closeCallOut();
  }

  openCallout() {
    this.#callout.openCallOut();
  }

  async render() {
    const main = createElement('main');
    main.id = 'main';
    const mapDom = createElement('div');
    mapDom.id = 'map';
    const map = new Map();
    map.setController(this.#controller);
    map.setModel(this.#model);
    await map.render(mapDom, this.#model.getEqData());

    this.#callout.setModel(this.#model)
    this.#callout.render();

    main.append(mapDom);

    this.#app.append(this.#callout.aside, main);
  }

}