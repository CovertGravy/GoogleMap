angular.module("myApp").controller("TariffController", function($scope, $http) {
  const elems = document.querySelector("select");
  const options = {
    classes: "",
    dropdownOptions: {}
  };
  const instances = M.FormSelect.init(elems, options);
  $scope.newtariff = {
    cabType: "",
    normalRate: "",
    peakRate: "",
    peakHourStart: "",
    peakHourEnd: ""
  };

  $scope.tariffs = [];

  $scope.addwindow = false;

  $scope.showform = function() {
    $scope.addwindow = true;

    // disable and enable button

    let btnSave = document.querySelector("#saveform");
    btnSave.disabled = true;

    let inputs = document.querySelectorAll(
      "#normalRate, #peakrate, #peakHourStart, #peakHourEnd"
    );

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("input", () => {
        let values = [];
        inputs.forEach(elem => values.push(elem.value));
        btnSave.disabled = values.includes("");
      });
    }
  };

  $scope.closeform = function() {
    $scope.addwindow = false;
  };

  $scope.saveform = function() {
    console.log($scope.newtariff);
    let cabType = document.querySelector("#cabType").value;
    let normalRate = document.querySelector("#normalRate").value;
    let peakRate = document.querySelector("#peakRate").value;
    let peakHourEnd = document.querySelector("#peakHourEnd").value;
    let peakHourStart = document.querySelector("#peakHourStart").value;
    $scope.newtariff.cabType = cabType;
    $scope.newtariff.normalRate = normalRate;
    $scope.newtariff.peakRate = peakRate;
    $scope.newtariff.peakHourEnd = peakHourEnd;
    $scope.newtariff.peakHourStart = peakHourStart;

    for (const key in $scope.newtariff) {
      if ($scope.newtariff.hasOwnProperty(key)) {
        $scope.newtariff[key] = $scope.newtariff[key].toString();
      }
    }
    console.log($scope.newtariff);

    // post to database
    $http.post("/addtariff", $scope.newtariff).then(response => {
      alert("Tariff Added!");
    });
  };

  $scope.showtariff = () => {
    $http.get("/showtariff").then(res => {
      $scope.tariffs = res.data;
      console.log($scope.tariffs);
    });
  };

  $scope.showtariff();
});
