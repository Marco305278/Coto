// Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
      
        // Your web app's Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyD6yH5SK3cZ53zUKy9o8JDUA8E6M2ciS8w",
          authDomain: "python---app.firebaseapp.com",
          databaseURL: "https://python---app-default-rtdb.europe-west1.firebasedatabase.app",
          projectId: "python---app",
          storageBucket: "python---app.firebasestorage.app",
          messagingSenderId: "935345912292",
          appId: "1:935345912292:web:148df16e83db170c086ff1"
        };
      
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();

        document.getElementById('ipaddress').oninput = function saveipaddress() {
            var input = this.value;
            const [id2, ip2] = input.split('-');
            database.ref(`id2`).set(id2)
            database.ref(`ip2`).set(ip2)
        };

        document.addEventListener('DOMContentLoaded', function() {
            function syncIpAddress() {
                const input = document.getElementById('ipaddress');
                const id2Ref = database.ref('id2');
                const ip2Ref = database.ref('ip2');

                id2Ref.once('value')
                .then(function(id2Snapshot) {
                    const id2 = id2Snapshot.val();
                    if (id2 === null) {
                        throw new Error("Valore 'id2' non trovato nel database.");
                    }
                    return id2;
                })
                // Recupera il valore di 'ip2' e combina i valori
                .then(function(id2) {
                    return ip2Ref.once('value')
                        .then(function(ip2Snapshot) {
                            const ip2 = ip2Snapshot.val();
                            if (ip2 === null) {
                                throw new Error("Valore 'ip2' non trovato nel database.");
                            }
                            return id2 + '-' + ip2;
                        });
                })
                // Aggiorna l'elemento di input
                .then(function(combinedValue) {
                    input.value = combinedValue;
                })
                .catch(function(error) {
                    console.error("Errore durante la sincronizzazione dell'indirizzo IP:", error);
                });
            }

            function syncTexts() {
                database.ref(`texts2`).on('value', function(snapshot) {
                    const textsParagraph = document.getElementById('texts');
                    const texts = snapshot.val();
                    if (texts) {
                        textsParagraph.innerHTML = texts;
                    }
                });
            }

            function syncAdvice() {
                database.ref('advice2').on('value', function(snapshot) {
                    const adviceContainer = document.getElementById('advice');
                    const adviceTexts = document.getElementById('advicetext');
                    const advice = snapshot.val();
                    
                    if (advice === "") {
                        adviceContainer.style.opacity = "0";
                        adviceContainer.style.top = "-50px";
                    } else {
                        adviceContainer.style.opacity = "1";
                        adviceContainer.style.top = "20px";
                        adviceTexts.innerHTML = advice;
                        
                        setTimeout(function() {
                            adviceContainer.style.opacity = "0";
                            adviceContainer.style.top = "-50px";
                            adviceTexts.innerHTML = "";
                            setTimeout(5000)
                            database.ref("advice2").set("")
                        }, 2000);
                    }
                });
            }

            function syncDate() {
                const connectContainer = document.getElementById('connected');
                const dateText = document.getElementById('date');
                database.ref('date2').once('value').then(function(snapshot) {
                    const connect = snapshot.val();
                    
                    const connectDate = new Date(connect);
                    const now = new Date();
                    const diffMs = now - connectDate;
                    
                    dateText.innerHTML = connectDate.toLocaleTimeString('it-IT', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      });
                    
                    if(diffMs <= 5500) {
                        connectContainer.style.opacity = "1";
                        connectTexts.innerHTML = connect;
                    } else {
                        connectContainer.style.opacity = "0";
                    }
                }).catch(function(error) {
                    console.error("Errore nel recupero della data:", error);
                });
            }
            
            syncDate()
            setInterval(syncDate, 2000);

            syncIpAddress();
            syncTexts();
            syncAdvice();
        });

        document.addEventListener('DOMContentLoaded', function() {
            const buttonConnect = document.getElementById('connect');
                buttonConnect.addEventListener('click', function() {
                    database.ref(`enabled_script2`).set(true)
                });
        });

        document.addEventListener('DOMContentLoaded', function() {
            const buttonStop = document.getElementById('stop');
                buttonStop.addEventListener('click', function() {
                    database.ref(`enabled_close2`).set(true)
                });
        });

        document.addEventListener('DOMContentLoaded', function() {
            const buttonReset = document.getElementById('reset');
            const textsParagraph = document.getElementById('texts'); 
            buttonReset.addEventListener('click', function() {
                    database.ref(`enabled_script2`).set(false)
                    database.ref(`enabled_close2`).set(false)
                    database.ref(`texts2`).set("")
                    textsParagraph.innerHTML = "";
                });
        });