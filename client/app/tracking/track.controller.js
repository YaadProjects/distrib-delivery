'use strict';

(function(){

class TrackComponent {
  constructor($state, $http, $stateParams) {
    this.$state = $state;
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.apiUrl = 'https://server-distrib.rhcloud.com/api/';
    this.id = undefined;
    this.email = undefined;
    this.alerts = [
    ];
    if ($stateParams.id && $stateParams.email) {
      this.id = $stateParams.id;
      this.email = $stateParams.email;
    }
  }

	$onInit() {
  }

  addAlert(number, email) {
    this.alerts.push({type: 'warning', msg: 'Could not find order number ' + number + ' with email ' + email});
  }

  closeAlert(index) {
    this.alerts.splice(index, 1);
  }

  checkOrder() {
    this.$http.get(this.apiUrl + 'orders/' + this.id + '/' + this.email)
    .then(res => {
      if(res.data) {
        this.$state.go('tracking', {id: this.id, email: this.email});
      } else {
        this.addAlert(this.id, this.email);
        this.id = undefined;
        this.email = undefined;
      }
    }, err => {
      this.addAlert(this.id, this.email);
      this.id = undefined;
      this.email = undefined;
    });
  }
}

angular.module('distribdeliveryApp')
  .component('track', {
    templateUrl: 'app/tracking/track.html',
    controller: TrackComponent,
    controllerAs: 'ctr'
  });

})();
