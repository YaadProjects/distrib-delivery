'use strict';

angular.module('distribdeliveryApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('track', {
        url: '/tracking?id&email',
        template: '<track></track>'
      })
      .state('tracking', {
      	url: '/tracking/:id/:email',
      	template: '<tracking></tracking>'
      });
  });
