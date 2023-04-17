import { Loader } from "@googlemaps/js-api-loader";
import styledMapOption from "./styledMapOption";
import { createElement } from "../../../utils/helper";

export default class Map {
  #map;
  #loader;
  #position;
  #controller;
  #model;
  #infoWindow
  #infoWindowContent

  constructor() {
    this.#map;
    this.#position = { lat: 0, lng: 0 };
    this.#loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLEMAP_KEY,
      version: "weekly",
    });
  }

  setController(controller) {
    this.#controller = controller;
  }

  setModel(model) {
    this.#model = model;
    this.#model.addObserver(this); // add the object to the observer
  }

  /* Loads all the necessary libraries */
  async #initMapLibraries() {
    try {
      const google = await this.#loader.load(); // Init google loader

      /* Init other libraries */
      const { Map } = await google.maps.importLibrary("maps");
      const styledMapType = await new google.maps.StyledMapType(styledMapOption);
      this.#infoWindow = await new google.maps.InfoWindow();

      const circleShape = await google.maps.SymbolPath.CIRCLE;

      return { Map, styledMapType, circleShape };

    } catch (err) {
      console.error('something went wrong in #initMapLibrary()', err.message)
    }

  }

  async #initMap(mapDom, mapData) {
    const { Map, styledMapType, circleShape } = await this.#initMapLibraries();
    const mapOptions = {
      center: this.#position,
      zoom: 2,
      zoomControl: true,
      mapTypeControl: false,
      // scaleControl: boolean,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      restriction: {
        latLngBounds: { north: 85, south: -85, west: -180, east: 180 } // this prevent user to drag outside the map to the grey area
      }
    }

    this.#map = new Map(mapDom, mapOptions);
    this.#map.data.addGeoJson(mapData) // add data to google data layer
    this.#map.mapTypes.set("styled_map", styledMapType); // add custom json style to map style
    this.#map.setMapTypeId("styled_map"); // set custom style as default style

    this.#drawOnMap(circleShape); // draw circle shape on map
  }

  #drawOnMap(shape) {
    // Draw shape on map based on magnitude
    this.#map.data.setStyle((feature) => {
      const magnitude = feature.getProperty("mag");
      return {
        icon: {
          path: shape,
          fillColor: "red",
          fillOpacity: 0.2,
          scale: Math.pow(2, magnitude) / 2, // scale based on magnitude
          strokeColor: "white",
          strokeWeight: 0.5,
        },
      };
    });
  }

  // Update View when Model is update
  // update(newData) is called in controller when the observer is notified
  update(newData) {
    const { feature, position } = newData
    this.#createInfoWindow(feature);
    this.#map.setZoom(3);
    this.#map.panTo(position);

    this.#infoWindow.setContent(this.#infoWindowContent);
    this.#infoWindow.setPosition(position);
    this.#infoWindow.open({ map: this.#map });
  }

  #createInfoWindow(newData) {
    const { time, place } = newData;
    const date = new Date(time).toDateString();

    const content = createElement('div');
    content.id = 'content';
    content.classList.add('infoWindowContent')

    const siteNotice = createElement('div');
    siteNotice.id = 'siteNotice';

    const bodyContent = createElement('div');
    bodyContent.id = 'bodyContent';
    const dateContent = createElement('p');
    dateContent.innerHTML = `<span class="text-bold">Time:</span> \t ${date}`;

    const locationContent = createElement('p');
    locationContent.innerHTML = `<span class="text-bold">Location:</span> \t ${place}`;

    const callOutTrigger = createElement('p');
    callOutTrigger.classList.add('calloutTrigger');
    callOutTrigger.innerText = 'See more...'
    callOutTrigger.onclick = () => this.#controller.onOpenCallout() // attach onclick event to the controller once the dom is created

    bodyContent.append(dateContent, locationContent, callOutTrigger)
    content.append(siteNotice, bodyContent);

    this.#infoWindowContent = content;
  }

  async #bindMapEvents() {

    this.#map.data.addListener('click', (event) => {
      this.#controller.onCloseCallout();
      this.#controller.onMapClick({ feature: event.feature.j, position: event.latLng }) // Set selected data     
    });

    this.#map.addListener('click', () => {
      this.#infoWindow.close();
      this.#controller.onCloseCallout();
    })
  }

  async render(mapDom, mapData) {
    await this.#initMap(mapDom, mapData);
    await this.#bindMapEvents();
  }
}