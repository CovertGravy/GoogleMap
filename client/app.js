const app = angular.module('myApp', ['ngRoute', 'ngCookies']);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider
    .when('/', {
      templateUrl: '/views/home.html',
      controller: 'HomeController'
    })
    .when('/book', {
      templateUrl: '/views/book.html',
      controller: 'BookController'
    })
    .when('/tariff', {
      templateUrl: '/views/tariff.html',
      controller: 'TariffController'
    })
    .when('/driver', {
      templateUrl: '/views/driver.html',
      controller: 'DriverController'
    })
    .when('/register', {
      templateUrl: '/views/register.html',
      controller: 'RegisterController'
    })
    .when('/login', {
      templateUrl: '/views/login.html',
      controller: 'LoginController'
    })
    .when('/profile', {
      templateUrl: '/views/profile.html',
      controller: 'ProfileController'
    })
    .when('/driverhome', {
      templateUrl: '/views/driverhome.html',
      controller: 'DriverhomeController'
    })
    .when('/driverrides', {
      templateUrl: '/views/driverrides.html',
      controller: 'DriverridesController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.run(($cookies, $location, $http, $rootScope, AuthenticationService) => {
  $rootScope.logout = () => {
    AuthenticationService.Logout();
    $rootScope.loggedIn = false;
    $rootScope.role = null;
    // const socket = io.connect('http://localhost:3000');
    // socket.disconnect();
    // socket.emit('disconnect', { stat: 'not active' });
    $location.path('/login');
  };

  const token = sessionStorage.getItem('token');
  if (token) {
    $http.defaults.headers.common.Authorization = token;
  }

  $rootScope.$on('$locationChangeStart', (event, next, current) => {
    const user = $cookies.getObject('authUser');
    const current_path = $location.path();
    console.log(current_path);

    const public_pages = ['/', '/register', '/login', ''];
    const user_pages = ['/book', '/profile'];
    const admin_pages = ['/tariff', '/driver'];
    const driver_pages = ['/driverhome', '/driverrides'];

    const access = pages => pages.includes(current_path);

    if (user == undefined) {
      $rootScope.role = null;
      access(public_pages) ? true : $location.path('/login');
    } else if (user.role == 'user') {
      access(user_pages) ? true : $location.path('/');
      $rootScope.role = 'user';
    } else if (user.role == 'admin') {
      $rootScope.role = 'admin';
      access(admin_pages) ? true : $location.path('/');
    } else if (user.role == 'driver') {
      $rootScope.role = 'driver';
      access(driver_pages) ? true : $location.path('/');
    }

    $rootScope.loggedIn = user || false;
  });
});
