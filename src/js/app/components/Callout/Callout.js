import { createElement } from "../../../utils/helper";

export default class Callout {
  #model;
  #content;

  constructor() { }

  setModel(model) {
    this.#model = model;
    this.#model.addObserver(this);
  }

  update(newData) {
    const { title, time, place, mag, type, code } = newData.feature;
    const date = new Date(time).toDateString();

    const div = createElement('div');
    div.id = "callOutContent"
    const titleEl = createElement('h2');
    titleEl.innerText = title;

    const codeEl = createElement('p');
    codeEl.innerHTML = `<span>Code:</span> \t ${code}`;

    const magnitude = createElement('p');
    magnitude.innerHTML = `<span>Magnitude:</span> \t ${mag}`;

    const timeEl = createElement('p');
    timeEl.innerHTML = `<span>Time:</span> \t ${date}`;

    const typeEl = createElement('p');
    typeEl.innerHTML = `<span>Type:</span> \t ${type}`;

    const locationEl = createElement('p');
    locationEl.innerHTML = `<span>Location:</span> \t ${place}`;

    div.append(titleEl, codeEl, magnitude, timeEl, typeEl, locationEl);

    this.#content = div
  }

  openCallOut() {
    this.aside.innerHTML = '';
    this.aside.append(this.#content)
    this.aside.classList.add('active');
  }

  closeCallOut() {
    this.aside.classList.remove('active')
    this.aside.innerHTML = '';
  }

  render() {
    const el = createElement('aside');
    el.id = 'sidebar';
    this.aside = el;

    return el;
  }
}