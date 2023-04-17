/*
   The app is structured with an MVC design pattern to elevate the "separation of concerns" and maintainability:
     + Model(M): Defines data and notify the app if state changes.
     + View(V): Defines how the app should be displayed. This layer is where dom manipulation happens
     + Controller(C): Mediates between Model and View

   ** To avoid method and prop drilling that passed down from controller to View layer, the model is sometimes passed down to the view directly.
 */

import Model from './Model'
import View from './View'
import Controller from './Controller'

const app = (function () {
  //  Initialized the mvc
  const model = new Model();
  const view = new View();
  const controller = new Controller();

  return {
    init: async function () {
      // Initialized the app
      await model.init(); // wait for data to be fully fetch
      view.setModel(model); // add model to view
      view.setController(controller); // add controller to view
      controller.setModel(model); // add model to controller
      controller.setView(view); // add view to controller
      await view.render(); // wait for view to be fully rendered
    }
  }
})();

export default app;