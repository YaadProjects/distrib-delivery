'use strict';

angular.module('distribdeliveryApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('track', {
        url: '/tracking?id',
        template: '<track></track>'
      })
      .state('tracking', {
      	url: '/tracking/:id',
      	template: '<tracking></tracking>'
      });
  });
