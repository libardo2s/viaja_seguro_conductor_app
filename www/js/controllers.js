angular.module('starter.controllers', [])
    .controller('HomeCtrl', function($scope,$ionicPopup,$location,$ionicHistory,$window,ConductorService,$rootScope) {
        
        $rootScope.placa;
        $rootScope.gremio;
        $scope.conductor;
        var conductorId = JSON.parse($window.localStorage['conductor']);
        ConductorService.getById(conductorId.usuario.nombre).then(
            function(respuesta){
                $scope.conductor = respuesta.data;
                $rootScope.gremio = $scope.conductor.empresa_id;
                $rootScope.placa = $scope.conductor.id;
            }
            ,function(error){
            });
        
        $scope.opcionMenu = function(opcion){
            if(opcion == "Pasajeros"){
                $location.path("/pasajeros");
            }
            if(opcion == "Encomiendas"){
                $location.path("/encomienda");
            }
            if(opcion == "Giros"){
                $location.path("/giro");
            }
        }

        $scope.logout = function(){
            $location.path("/login");
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

    .controller('LoginCtrl',function($scope,$ionicPopup,$location,LoginService,$window,jwtHelper){
        $scope.$on('$ionicView.enter',function(){
            $scope.usuario = {};
            $scope.matenerSesion = false 
        });
        $scope.iniciarSesion = function(){
            LoginService.login($scope.usuario).then(success, error);
            function success(p) {
                var conductor = jwtHelper.decodeToken(p.data.token);
                if(conductor.usuario.rol == "CONDUCTOR"){
                    $window.localStorage['conductor'] = JSON.stringify(conductor);
                    if($scope.matenerSesion){
                        $window.localStorage['usuario'] = $scope.usuario
                    }else{
                        $window.localStorage['token'] = p.data.token; 
                    }
                    $location.path("app/home");
                }
            }
            function error(error) {
                mostarAlert("Error login","Error al logear verifique que los datos ingresados sean correctos");
                //$scope.mensajeError = error.status == 401 ? error.data.mensajeError : 'A ocurrido un erro inesperado';
            }
        }

        function mostarAlert(titulo,contenido){
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: contenido
            });
            alertPopup.then(function (res) {
            });
        }
    })

    .controller('VehiculoCtrl',function($scope,VehiculoService,$rootScope){
        var informacionVehiculo = false;
        $scope.vehiculo = {};
        
        VehiculoService.getById($rootScope.placa).then(
            function(respuesta){ 
                console.log(respuesta.data);
                if(respuesta.data != "" || respuesta.data != null){
                    informacionVehiculo = true;
                    $scope.vehiculo = respuesta.data;
                }
            }
            ,function(error){
                console.log(error);
            });
    
        $scope.registarActualizar = function(){
            if(informacionVehiculo){
                VehiculoService.actualizar($scope.vehiculo).then(
                function(respuesta){
                    console.log(respuesta);        
                },function(error){
                    console.log(error);
                });
            }
        }
    })

    .controller('ConductorCtrl', function($scope,$location,$ionicPopup,ConductorService,EmpresaService) {
        $scope.$on('$ionicView.enter',function(){
            $scope.conductor = {};
            $scope.mostrarAdvertencia = false;
        });
        $scope.listaEmpesas = [];
    
        EmpresaService.getAll().then(
        function(respuesta){
            $scope.listaEmpesas = respuesta.data;
        },function(error){
            console.log(error);
        });

        $scope.volver = function(){
            $location.path("/login");
        }

        $scope.registarConductor = function(){
            $scope.conductor.rol = "CONDUCTOR";
            if($scope.conductor.contrasena == $scope.conductor.confirmarContrasena ){
                ConductorService.registrar($scope.conductor).then(
                function(respuesta){
                    if(respuesta.statusText == "OK"){
                        mostarAlert("Registro Exitoso", "El conductor se ha registrado satisfatoriamente");
                        $location.path("/login");
                    }
                }, function(error){
                    mostarAlert("Fallo en el Registro", "No se ha podido realizar el registro intente mas tarde");
                });
            }else{
                $scope.mostrarAdvertencia = true;
            }
        }

        function mostarAlert(titulo,contenido){
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: contenido
            });
            alertPopup.then(function (res) {
            });
        }
    })

    .controller('PasajerosCtrl',function($scope,$location){

        $scope.volver = function(){
            $location.path("app/home");
        }

    })

    .controller('EncomiendaCtrl',function($scope,$location){
        $scope.volver = function(){
            $location.path("app/home");
        }
    })

    .controller('GiroCtrl',function($scope,$location){
        $scope.volver = function(){
            $location.path("app/home");
        }
    })

    .controller('GremioCtrl',function($scope, $rootScope,ConductorService){
        $scope.listaConductores = [];
    
        ConductorService.getAll($rootScope.gremio).then(
            function(respuesta){
                $scope.listaConductores = respuesta.data;
            },function(error){
                console.log(error);
            }
        );
    })
;
