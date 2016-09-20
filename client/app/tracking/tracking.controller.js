'use strict';

(function(){

class TrackingComponent {
	constructor($scope, $state, $http, $stateParams) {
		this.$http = $http;
		this.$scope = $scope;
		this.$state = $state;
		this.trackingNumber = $stateParams.id;
		$scope.order; 
		$scope.listStatus = ['purchased', 'packaged', 'out-for-delivery', 'in-transit', 'delivered'];
		$scope.actualStatus = ['Accepted', 'Processing', 'On the way', 'In Transit', 'Delivered']
		$scope.tooltip = 
		['Your order has been purchased and is waiting for processing.',
		'The store has processed and packaged your order and it is awaiting pickup by a Kuro Delivery driver.',
		'A driver has picked up your package and has left for their delivery route.',
		'Your driver is headed directly to your location with your order.',
		'Delivery successful, thank you!'
		]
		this.getOrder();
	}

	// get the order from api
	getOrder() {
		this.$http.get('https://server-distrib.rhcloud.com/api/orders/' + this.trackingNumber)
			.then(response => {
				this.$scope.order = response.data;
				console.log(this.$scope.order);
			}, err => {
				alert('Error fetching data for order #' + this.trackingNumber)
			});
	}

	// function to cancel delivery
	cancelDeliv() {
		this.$http.delete("https://server-distrib.rhcloud.com/api/orders/delivery/" +this.$scope.order.store + '/' +this.$scope.order.orderId)
		.then((data, status) => {
			this.getOrder();
		}, function(err) {
			alert("Couldn't cancel order, please refresh the page!"); // problem with fetching from server
			$window.location.reload();
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
