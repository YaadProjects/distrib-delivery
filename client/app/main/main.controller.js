'use strict';

(function() {

  class MainController {

    constructor($http, $window) {
      $window.location.href = 'http://distrib.ca';
    }

    $onInit() {
    }
  }

  angular.module('distribdeliveryApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });
})();
