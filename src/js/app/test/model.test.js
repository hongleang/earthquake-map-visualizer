import { jest } from '@jest/globals'
import Model from "../Model";


describe('Model class', () => {
  it('should loaded all eq data when init() is called', async () => {
    const mockData = { mag: .2, lat: 0, lng: 0 };
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockData)
    }))
    const mockModel = new Model();
    await mockModel.init();

    expect(mockModel.getEqData()).toBe(mockData);
  });

  describe('the setSelectedData() method', () => {
    it('should notify other view of the selectedData update', () => {
      // Each View object(observe) should have update function
      // All observe would be called when the model is changing
      const updateFunc = jest.fn((updateData) => 'Update view to ' + updateData);
      const view = {
        update: updateFunc
      }
      const view2 = Object.create(view);

      const model = new Model();
      model.addObserver(view);
      model.addObserver(view2);

      model.setSelectedData('some data');

      expect(updateFunc).toHaveBeenCalledTimes(2);
    });

  });

});
