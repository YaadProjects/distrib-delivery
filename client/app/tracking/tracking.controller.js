'use strict';

(function(){

class TrackingComponent {
	constructor($scope, $state, $http, $stateParams) {
		this.$http = $http;
		this.$scope = $scope;
		this.$state = $state;
		this.apiUrl = 'https://server-distrib.rhcloud.com/api/';
		this.id = $stateParams.id;
		this.email = $stateParams.email;
		$scope.order; 
		$scope.listStatus = ['created', 'verified', 'assigned', 'in-transit', 'delivered'];
		$scope.actualStatus = ['Created', 'Verified', 'Assigned', 'In Transit', 'Delivered'];
		$scope.tooltip = 
		['Your order has been created and is pending verification by the store.',
		'Your order has been verified by the store and is waiting to be assigned to a driver.',
		'Your order has been assigned to a driver and is waiting to be picked up.',
		'Your order has been picked up and is en route.' ,
		'Your order has been successfully delivered, thank you!'
		];
		this.getOrder();
	}

	// get the order from api
	getOrder() {
		this.$http.get(this.apiUrl + 'orders/' + this.id + '/' + this.email)
		.then(response => {
			this.$scope.order = response.data;
		}, err => {
			window.alert('Error fetching data for order #' + this.id);
		});
	}

	// function to schedule delivery
	schedule() {
        this.$state.go('scheduling', {id: this.id, email: this.email});
	}

	// function to cancel delivery
	cancelDeliv() {
		this.$http.patch(this.apiUrl + 'orders/' + this.id + '/deliveryInfo/' + this.email, { deliveryTimeWindow: null })
		.then((data, status) => {
			this.getOrder();
		}, function(err) {
			alert("Couldn't cancel order, please refresh the page!"); // problem with fetching from server
			window.location.reload();
		});
	}
}

angular.module('distribdeliveryApp')
  .component('tracking', {
    templateUrl: 'app/tracking/tracking.html',
    controller: TrackingComponent,
    controllerAs: 'ctr'
  });

})();
