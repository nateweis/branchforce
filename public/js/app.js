const app = angular.module('TripApp', []);

// =================== //
//   TRIP CONTROLLER   //
// =================== //
app.controller('TripController', ['$http', function($http){
  const tripCtrl = this;
  this.includePath = "partials/home.html"

  this.changeInclude = function (path) {
    tripCtrl.includePath = 'partials/'+path+'.html'
  }

  // ====================================== //
  //   USER SEARCHES FOR TRIP/FLIGHT DATA   //
  // ====================================== //
  this.populatePage = function () {
    $http({
      method:'GET',
      url:'/users/trips/' + this.location
    }).then(function (res) {
      tripCtrl.listOfDestinations = res.data
      console.log(res.data);
    },function (err) {
      console.log(err);
    })
  }

  // ========================= //
  //   USER STORES TRIP DATA   //
  // ========================= //
  this.bookmarkedTrip = []

  // only adds one flight and hotel
  this.storeData = function (trip) {
    let found = false
    for (let i = 0; i < tripCtrl.bookmarkedTrip.length; i++) {
      if(tripCtrl.bookmarkedTrip[i].type === trip.type){
        found = true
        tripCtrl.bookmarkedTrip[i] = trip;
      }
    }
    if(found === false){
      tripCtrl.bookmarkedTrip.push(trip)
    }
    // console.log(tripCtrl.bookmarkedTrip);
  }

  // adds events
  this.addEvent = function (event) {
    let found = false
    for (let i = 0; i < tripCtrl.bookmarkedTrip.length; i++) {
      if(tripCtrl.bookmarkedTrip[i].title === event.title){
        found = true
      }
    }
    if(found === false){
      tripCtrl.bookmarkedTrip.push(event)
    }
  }

  // adds the total trip cost
  this.total = function () {
    let sum = 0;
    for (let i = 0; i < tripCtrl.bookmarkedTrip.length; i++) {
      sum = tripCtrl.bookmarkedTrip[i].price + sum
    }
    return sum
  }

  // Add a trip to the user's Trips
  this.addTripToUser = function (id) {
    $http({
      method:'PUT',
      url:'/users/' + id,
      data: this.bookmarkedTrip
    }).then(function (res) {

      console.log(res);
      tripCtrl.bookmarkedTrip = []
      tripCtrl.location = 'a'
      tripCtrl.populatePage()

    },function (err) {
      console.log(err);
    })
  }

  // =============================== //
  //   ADD FUNDS AND CREATE BUDGET   //
  // =============================== //
  // this.budget = 0

  this.addFunds = (id) => {

    console.log(id);
    $http({
      method:'PUT',
      url: '/users/budget/' + id,
      data: {
        budget: tripCtrl.budget
      }
    }).then(function(response){
      console.log('Success');

    }, function(error){
      console.log(error);
    })
  }

  this.deleteTripCart = () => {
      this.bookmarkedTrip.splice(0)
  }

}])

// ============================ //
//   AUTHORIZATION CONTROLLER   //
// ============================ //
app.controller('AuthController', ['$http', function($http){

  const authCtrl = this;
  this.tripNumber = 0;

  // =============== //
  //   CREATE USER   //
  // =============== //
  this.createUser = function () {
    console.log("Create user click works");
    $http({
      method: 'POST',
      url: '/users',
      data: {
        username: this.username,
        password: this.password
      }
    }).then(function(response){
      console.log(response);
    }, function () {
      console.log('error');
    })
}
  // =============== //
  //   LOG IN USER   //
  // =============== //
  this.logIn = function () {
    $http({
      method: 'POST',
      url: '/sessions',
      data: {
        username: this.usernameLogIn,
        password: this.passwordLogIn
      }
    }).then(function(response){
      console.log(response);

      authCtrl.getUserInfo()

    }, function(error){
      console.log(error);
      alert('Username or Password Not Found!')
    });
  }

  // ====================== //
  //   RETRIEVE USER INFO   //
  // ====================== //

  this.getUserInfo = function () {
    $http({
      method:'GET',
      url:'/sessions'
    }).then(function (res) {
      authCtrl.userInfo = res.data
    },function (err) {
      console.log(err);
    })
  }

  // ================ //
  //   LOG OUT USER   //
  // ================ //
  this.logOut = function () {
    $http({
      method:'DELETE',
      url:'/sessions'
    }).then(function (res) {
      console.log(res);
      authCtrl.userInfo = false
    },function (err) {
      console.log(err);
    })
  }


}]); // this closes the controller
