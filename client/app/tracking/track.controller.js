'use strict';

(function(){

class TrackComponent {
  constructor($state, $http, $stateParams) {
    this.$state = $state;
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.trackingNumber = undefined;
    this.alerts = [
    ];
    if ($stateParams.id) {
      this.trackingNumber = $stateParams.id;
    }
  }

	$onInit() {
  }

  addAlert(number) {
    this.alerts.push({type: 'warning', msg: 'Could not find order number ' + number + '.'});
  }

  closeAlert(index) {
    this.alerts.splice(index, 1);
  }

  checkOrder() {
    this.$http.get('https://server-distrib.rhcloud.com/api/orders/' + this.trackingNumber)
    .then(res => {
      if(res.data) {
        this.$state.go('tracking', {id: this.trackingNumber});
      } else {
        this.addAlert(this.trackingNumber);
        this.trackingNumber = undefined;
      }
    }, err => {
      this.addAlert(this.trackingNumber);
      this.trackingNumber = undefined;
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
