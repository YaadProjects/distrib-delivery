'use strict';

(function(){

class SchedulingComponent {

  constructor($state, $scope, $http, $stateParams, $q) {
    this.$q = $q;
    this.$state = $state;
    this.$scope = $scope;
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.apiUrl = 'https://server-distrib.rhcloud.com/api/'
    // object for order if id is passed
    this.order = undefined;
    // Overlay page toggle, 0 = scheduling, 1 = confirmation
    this.overlayPage = 0;
    // Object to store scheduling data
    this.selectedTime = {
      date: undefined,
      period: undefined,
      time: {}
    };
    // Object to store delivery data
    this.delivData = {
      contact: {
        knock: false,
        doorbell: false,
        phone: false,
        other: false,
      },
      terms: false,
      safedrop: false,
      smsUpdates: false,
      phoneNum: undefined,
      smsNum: undefined,
      note: undefined
    };
    if ($stateParams.id && $stateParams.email) {
      this.getOrder();
    }
    if ($stateParams.store) {
      this.getStore();
    }
  }

  getOrder(id, email) {
    this.$q.all([this.$http.get(this.apiUrl+'orders/' + this.$stateParams.id + '/' + this.$stateParams.email), // get order
    this.$http.get(this.apiUrl+'deliveryTimeWindows/serverTime')]) // get server time
    .then(res => {
      if (res[0].data) {
        this.order = res[0].data;
        this.parseTimes(res[1].data.time); // parse store times with server time 
      } else { // if order doesnt exist then alert
        window.alert('No data for order #' + id);
      }
    }, err => {
      window.alert('Could not find order #' + id);
    });
  }

  getStore() {
    this.store = true;
    this.$q.all([this.$http.get(this.apiUrl+'stores/' + this.$stateParams.store), // get order
    this.$http.get(this.apiUrl+'deliveryTimeWindows/serverTime')]) // get server time
    .then(res => {
      if (res[0].data) {
        this.order = res[0].data;
        this.parseTimes(res[1].data.time); // parse store times with server time 
      } else { // if order doesnt exist then alert
        window.alert('Invalid tracking number, cannot schedule');
      }
    }, err => {
      window.alert('Error fetching data for store #' + this.$stateParams.store);
    });
  }

	parseTimes(serverTime) {
    var today = new Date(serverTime);
    var schedData = {};
    // object for all dates populate with objects for dates
    for (var n = 0; n < this.order.store.schedDaysNum; n++) {
      schedData[new Date(new Date().setDate(today.getDate() + n)).getDate()] = {};
    }
    // map all time strings to time objects
    this.order.store.deliveryTimeWindows = this.order.store.deliveryTimeWindows.map(function(time) {
      time.startTime = new Date (time.startTime);
      time.endTime = new Date (time.endTime);
      return time;
    });
    // iterate over times and save into days, periods in schedData
    for (var i = 0; i < this.order.store.deliveryTimeWindows.length; i++) {
      var date = this.order.store.deliveryTimeWindows[i];
      var hours = date.startTime.getHours(); // get hours from day to sort period
      var day = date.startTime.getDate(); // get day number from day to select array
      if (!schedData[day]) { continue; } // if day object was not created do not save
      if (hours >= 0 && hours < 12) { // from 12am to 11am save as morning
        if (!schedData[day].Morning) {
          schedData[day].Morning = [];
        } schedData[day].Morning.push(date);
      } else if (hours >= 12 && hours < 17) { // from 12pm to 4pm save as afternoon
        if (!schedData[day].Afternoon) {
          schedData[day].Afternoon = [];
        } schedData[day].Afternoon.push(date);
      } else if (hours >= 17 && hours <= 23) { // from 5pm to 11pm save as evening
        if (!schedData[day].Evening) {
          schedData[day].Evening = [];
        } schedData[day].Evening.push(date);
      }
    }
    this.schedData = schedData;  
  }

  // function to submit data once confirm button is hit
  confirm() {
    if (this.store === true) {
      return;
    }
    this.$http.patch(this.apiUrl+'orders/'+this.order._id+'/deliveryInfo/'+this.order.email, {deliveryTimeWindow : this.selectedTime.time, deliveryOptions: this.delivData})
    .then((data, status) => {
      this.$state.go('tracking', {'id': this.order._id, 'email': this.order.email});
    }, err => {
      window.alert("Couldn't schedule delivery, please refresh the page!"); // problem with fetching from server
    });
  }

  // function to determine what the scheduling alert bar shows
  scheduleAlert() {
    if (this.overlayPage === 0) { // for scheduling overlay
      if (this.selectedTime.period) {
        return 'Please select a window';
      } else if (this.selectedTime.date) {
        return 'Please select a period';
      } else {
        return 'Please select a day';
      }
    } else if (this.overlayPage === 1) { // for confirm overlay
      if (this.delivData.terms) {
        return 'I accept the Terms and Conditions for delivery';
      } else if (this.delivData.contact.knock || this.delivData.contact.doorbell || this.delivData.contact.phone || this.delivData.contact.other) {
        return 'Please read and accept the Terms and Conditions';
      } else {
        return 'Please select contact methods';
      }
    }
  }
}

angular.module('distribdeliveryApp')
  .component('scheduling', {
    templateUrl: 'app/scheduling/scheduling.html',
    controller: SchedulingComponent,
    controllerAs: 'ctr'
  });

})();
