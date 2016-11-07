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
		$scope.listStatus = ['purchased', 'picked-up', 'out-for-delivery', 'in-transit', 'delivered'];
		$scope.actualStatus = ['Accepted', 'Picked up', 'On the way', 'In Transit', 'Delivered'];
		$scope.tooltip = 
		['Your order has been purchased and is waiting for processing.',
		'The store has processed and packaged your order and it is awaiting pickup by a Kuro Delivery driver.',
		'A driver has picked up your package and has left for their delivery route.',
		'Your driver is headed directly to your location with your order.',
		'Delivery successful, thank you!'
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

	// function to cancel delivery
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
