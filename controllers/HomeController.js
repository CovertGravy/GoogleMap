angular.module('myApp').controller('HomeController', function ($scope) {

  $scope.initMap = function () {

    // ------------ basic map render ---------------
    // let coords = { lat: 28.524579, lng: 77.206615 };
    // let canvas = document.getElementById('map');
    // let options = {
    //   zoom: 18,
    //   center: coords
    // };

    // let map = new google.maps.Map(canvas, options);

    // let marker = new google.maps.Marker({
    //   position: coords,
    //   map: map,
    //   draggable: true,
    //   animation: google.maps.Animation.DROP,
    //   title: 'Drag Me!'
    // });

    // ----------------- naviagtor GPS ----------------------
    navigator.geolocation.watchPosition(pos, err);

    function pos(position) {
      console.log(position.coords.latitude);
      let coords = { lat: position.coords.latitude, lng: position.coords.longitude };
      let canvas = document.getElementById('map');
      let options = {
        zoom: 17,
        center: coords
      };

      let map = new google.maps.Map(canvas, options);
      let geocoder = new google.maps.Geocoder;
      let markerArray = [];

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
          let bound =  new google.maps.LatLng(element.position.lat(), element.position.lng());
          bounds.extend(bound);
        });
        map.fitBounds(bounds);
        map.panToBounds(bounds);
        
      }

      
      autocomplete.addListener('place_changed', function(){
        let place = autocomplete.getPlace();
        destination.setVisible(false);
        
        
        if(!place.geometry) {
          window.alert(`No details available for ${place.name}`);
        }

        if(place.geometry.viewport) {
          // map.fitBounds(place.geometry.viewport);
          //map.setCenter(place.geometry.location);
          console.log(place);

          destination.setPosition(place.geometry.location);
          destination.setVisible(true);
          if(markerArray.length >= 2) {
            markerArray.length = 1;
          }
          markerArray.push(destination);
          console.log(markerArray);
          
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

      markerArray.push(marker);

      // let bound2 = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
      // bounds.extend(bound2);

      // reverse geocoder for current navigator position
      geocoder.geocode({'location': coords}, function(results, status){
        if(status === 'OK'){
          if(results[0]){
            document.getElementById('pos-input').value = results[0].formatted_address;
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
      google.maps.event.addListener(marker, 'dragend', function(e){
        let newPos = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };
        geocoder.geocode({'location': newPos}, function(results, status){
          if(status === 'OK'){
            if(results[0]){
              document.getElementById('pos-input').value = results[0].formatted_address;
              console.log(results[0]);
            }else {
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
  }

});