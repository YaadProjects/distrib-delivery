'use strict';

angular.module('distribdeliveryApp')
  .config(function($stateProvider) {
    $stateProvider.state('main', {
      url: '/',
      template: '<main></main>'
    });
  });
