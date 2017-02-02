require('angular');
require('angular-aria');
require('angular-animate');
require('angular-material');



angular.module('TempApp', ['ngMaterial'])
.controller('AppCtrl', function($scope, $mdDialog, $http) {

  $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'app/views/dialog.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }

  $scope.data = {};
  $scope.result = {};

  $http({
      method: 'GET',
      url: 'data.json'
   }).then(function (success){
      $scope.data = success.data;
   },function (error){
      console.log(error);
   });


   $scope.chooseRow = function(row, tableId) {
    $scope.result[tableId] = row;
    
   }
  
  

});