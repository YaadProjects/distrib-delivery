'use strict';

describe('Component: SchedulingComponent', function () {

  // load the controller's module
  beforeEach(module('distribdeliveryApp'));

  var SchedulingComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    SchedulingComponent = $componentController('scheduling', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
