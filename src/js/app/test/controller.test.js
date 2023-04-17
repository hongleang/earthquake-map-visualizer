import Controller from "../Controller";
import Model from "../Model";

describe('Controller Class', () => {
  it('should able to handleClick event and notify model to update', () => {
    const newData = { mag: 0, position: 20 };
    const controller = new Controller();
    const model = new Model();

    controller.setModel(model)
    controller.onMapClick(newData);
    
    expect(model.getSelectedMapData()).toStrictEqual(newData);
  });

})