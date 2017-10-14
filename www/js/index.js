/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        var decryptElement = document.getElementById(id + "2");
        decryptElement.querySelector('.received').setAttribute('style', 'display:block;');

        var deleteFingerPrint = function() {
            FingerprintAuth.delete({
                clientId: "myAppName1",
                username: "currentUser"
            }, delSuccessCallback, delErrorCallback);
            function delSuccessCallback(result) {
                console.log("Successfully deleted cipher: " + JSON.stringify(result));
            }

            function delErrorCallback(error) {
                console.log(error);
            }
        };
        parentElement.onclick = function () {

            FingerprintAuth.isAvailable(isAvailableSuccess, isAvailableError);

            function isAvailableSuccess(result) {
                console.log("FingerprintAuth available: " + JSON.stringify(result));
                if (result.isAvailable) {

                    var encryptConfig = {
                        clientId: "myAppName1",
                        username: "currentUser",
                        password: "currentUserPassword",
                        disableBackup: true

                    };

                    var ss = new cordova.plugins.SecureStorage(
                        function () {
                            console.log("secure storage Success...");
                            deleteFingerPrint();
                            FingerprintAuth.encrypt(encryptConfig, function(result){
                                console.log("Fingerprint successCallback(): " + JSON.stringify(result));
                                ss.set(
                                    function (key) {
                                        console.log('Set ' + key);
                                    },
                                    function (error) {
                                        console.log('Error ' + error);
                                    },
                                    'mykey', result.token);
                            }, function(error) {
                                if (error === FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                                    console.log("FingerprintAuth Dialog Cancelled!");
                                } else {
                                    console.log("FingerprintAuth Error: " + error);
                                    // deleteFingerPrint();

                                }
                            });

                        },
                        function (error) {
                            console.log('Error secure' + error);
                        },
                        'my_app');

                }
            }

            function isAvailableError(message) {
                console.log("isAvailableError(): " + message);
            }
        }

        decryptElement.onclick = function () {
            FingerprintAuth.isAvailable(isAvailableSuccess, isAvailableError);


            function isAvailableSuccess(result) {
                console.log("FingerprintAuth available: " + JSON.stringify(result));
                if (result.isAvailable) {

                    var decryptFunc = function (token) {
                        var encryptConfig = {
                            clientId: "myAppName1",
                            username: "currentUser",
                            token: token,
                            disableBackup: true

                        };

                        FingerprintAuth.decrypt(encryptConfig, successCallback, errorCallback);

                        function successCallback(result) {
                            console.log("successCallback(): " + JSON.stringify(result));
                        }

                        function errorCallback(error) {
                            if (error === FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                                console.log("FingerprintAuth Dialog Cancelled!");
                            } else if ( error === FingerprintAuth.ERRORS.INIT_CIPHER_FAILED ) {
                                alert("Finger Change Detected");
                            } else {
                                console.log("FingerprintAuth Error: " + error);
                                // deleteFingerPrint();
                            }
                        }
                    };

                    var ss = new cordova.plugins.SecureStorage(
                        function () {
                            console.log("Success...");
                            ss.get(
                                function (value) {
                                    console.log('Success, got ' + value);
                                    decryptFunc(value);

                                },
                                function (error) {
                                    console.log('Error ' + error);
                                },
                                'mykey');
                        },
                        function (error) {
                            console.log('Error securestorage' + error);
                        },
                        'my_app');


                }
            }

            function isAvailableError(message) {
                console.log("isAvailableError(): " + message);
            }
        }

        console.log('Received Event: ' + id);
    }
};

app.initialize();