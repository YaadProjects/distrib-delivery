'use strict';

(function() {

  class MainController {

    constructor($http) {
      console.log('hello');
      this.$http = $http;
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
