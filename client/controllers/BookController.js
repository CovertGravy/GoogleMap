angular.module('myApp').controller('BookController', function($scope) {
  $scope.proceed = false;
  $scope.driver_data = null;
  const elems = document.querySelectorAll('.modal');
  const book_modal = document.querySelector('#book-modal');
  const instances = M.Modal.init(elems);
  const book_modal_instance = M.Modal.getInstance(book_modal);
  const cab_options = document.querySelectorAll('option');

  $scope.initMap = function() {
    // ----------------- naviagtor GPS ----------------------
    let id = navigator.geolocation.watchPosition(pos, err);
    function pos(position) {
      console.log(position.coords.latitude);
      navigator.geolocation.clearWatch(id);
      let coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      let canvas = document.getElementById('map');
      let options = {
        zoom: 16,
        center: coords
      };

      let map = new google.maps.Map(canvas, options);
      let geocoder = new google.maps.Geocoder();
      let markerArray = [];

      // services
      let service = new google.maps.DistanceMatrixService();
      let directionsService = new google.maps.DirectionsService();
      let directionsDisplay = new google.maps.DirectionsRenderer();

      let search = document.getElementById('search');
      let autocomplete = new google.maps.places.Autocomplete(search);

      autocomplete.bindTo('bounds', map);

      let destination = new google.maps.Marker({
        // position: place.geometry.location,
        map: map
      });

      // ------ function that loops through marker array to fit bounds ---------
      let boundf = () => {
        let bounds = new google.maps.LatLngBounds();
        markerArray.forEach(element => {
          let bound = new google.maps.LatLng(
            element.position.lat(),
            element.position.lng()
          );
          bounds.extend(bound);
        });
        map.fitBounds(bounds);
        map.panToBounds(bounds);

        if (markerArray[1]) {
          let origin = new google.maps.LatLng(
            markerArray[0].position.lat(),
            markerArray[0].position.lng()
          );
          let dest = new google.maps.LatLng(
            markerArray[1].position.lat(),
            markerArray[1].position.lng()
          );

          // let service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix(
            {
              origins: [origin],
              destinations: [dest],
              travelMode: 'DRIVING'
            },
            callback
          );

          function callback(response, status) {
            if (status === 'OK') {
              let origins = response.originAddresses;
              let destinations = response.destinationAddresses;

              for (let i = 0; i < origins.length; i++) {
                let results = response.rows[i].elements;

                for (let j = 0; j < results.length; j++) {
                  let element = results[j];
                  let distance = element.distance.text;
                  let duration = element.duration.text;
                  let from = origins[i];
                  let to = destinations[i];

                  document.getElementById('distance').innerText = `${distance}`;
                  document.getElementById('duration').innerText = `${duration}`;
                }
              }
            }
          }

          directionsDisplay.setMap(map);

          function calcRoute() {
            let request = {
              origin: origin,
              destination: dest,
              travelMode: 'DRIVING'
            };

            directionsService.route(request, function(response, status) {
              if (status === 'OK') {
                directionsDisplay.setDirections(response);
                markerArray.forEach(element => {
                  element.setVisible(false);
                });
              }
            });
          }

          calcRoute();
        }
      };

      autocomplete.addListener('place_changed', function() {
        let place = autocomplete.getPlace();
        destination.setVisible(false);

        if (!place.geometry) {
          window.alert(`No details available for ${place.name}`);
        }

        if (place.geometry.viewport) {
          console.log(place);

          destination.setPosition(place.geometry.location);
          destination.setVisible(true);
          if (markerArray.length >= 2) {
            markerArray.length = 1;
          }
          markerArray.push(destination);
          console.log(markerArray);
          $scope.proceed = true;
          $scope.$apply();

          // let bound1 = new google.maps.LatLng(destination.position.lat(), destination.position.lng());
          boundf();
          // bounds.extend(bound1);
        }
      });

      let marker = new google.maps.Marker({
        position: coords,
        map: map,
        draggable: true
      });
      let driver_marker;
      let driver_marker_array = [];
      let icon = 'http://maps.google.com/mapfiles/ms/micons/cabs.png';
      const socket = io.connect('http://localhost:3000');
      socket.on('drivers location', function(data) {
        console.log(data);
        $scope.driver_data = data;
        $scope.$apply();
        if (driver_marker_array.includes(driver_marker)) {
          driver_marker.setMap(null);
          driver_marker = [];
        }
        driver_marker = new google.maps.Marker({
          position: {
            lat: $scope.driver_data.lat,
            lng: $scope.driver_data.lng
          },
          map: map,
          icon,
          draggable: true
        });
        driver_marker_array.push(driver_marker);
      });
      markerArray.push(marker);

      // let bound2 = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
      // bounds.extend(bound2);

      // reverse geocoder for current navigator position
      geocoder.geocode({ location: coords }, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            document.getElementById('pos-input').value =
              results[0].formatted_address;
            // materialize textarea resize on init
            M.textareaAutoResize(document.getElementById('pos-input'));
            console.log(results[0]);
          } else {
            window.alert('No results found!');
          }
        } else {
          window.alert(`Geocoder failed due to ${status}`);
        }
      });

      // dragend event with reverse geocoder
      google.maps.event.addListener(marker, 'dragend', function(e) {
        let newPos = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };
        geocoder.geocode({ location: newPos }, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              document.getElementById('pos-input').value =
                results[0].formatted_address;
              console.log(results[0]);
            } else {
              window.alert('No results found!');
            }
          } else {
            window.alert(`Geocoder failed due to ${status}`);
          }
        });
        console.log(newPos);
      });
    }

    function err() {
      window.alert('failed');
    }
  };

  $scope.check_cabs = function() {
    $scope.driver_data
      ? book_modal_instance.open()
      : M.toast({ html: 'No Cabs Available', displayLenth: 1000 });

    console.log(cab_options);
    cab_options.forEach(option => {
      option.disabled = option.value == $scope.driver_data.cab ? false : true;
    });
  };
});
