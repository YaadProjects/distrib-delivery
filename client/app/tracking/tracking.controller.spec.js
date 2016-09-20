'use strict';

describe('Component: TrackingComponent', function () {

  // load the controller's module
  beforeEach(module('distribdeliveryApp'));

  var TrackingComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    TrackingComponent = $componentController('tracking', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
