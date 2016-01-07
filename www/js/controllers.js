angular.module('starter.controllers', [])
    .controller('AppCtrl', function($scope,$ionicPopup) {
    })

    .controller('LoginCtrl',function($scope,$ionicPopup,$location,LoginService){
        $scope.$on('$ionicView.enter',function(){
           $scope.usuario = {}; 
        });
    
        $scope.login = function(){
            //mostarAlert("Login Correcto",LoginService.logearse($scope.usuario));
            $location.path("/app/registrar-vehiculo");
        }
        
        function mostarAlert(titulo,contenido){
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: contenido
            });
            alertPopup.then(function (res) {
                $scope.conductor = {};
            });
        }
    })
    
    .controller('ConductorCtrl', function($scope,$location,$ionicPopup,ConductorService) {
        $scope.conductor = {};
    
        $scope.volver = function(){
            $location.path("/login");
        }
        
        $scope.registarConductor = function(){
            mostarAlert("Conductor Registrado",ConductorService.registrar($scope.conductor));
        }
        
        
        function mostarAlert(titulo,contenido){
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: contenido
            });
            alertPopup.then(function (res) {
                $scope.conductor = {};
            });
        }
    })
;
