'use strict';

angular.module('distribdeliveryApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('scheduling', {
        url: '/scheduling/:id/:email',
        template: '<scheduling></scheduling>'
      });
  });