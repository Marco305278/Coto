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

        document.getElementById('play').onclick = function sendComand() {
            var comands = document.getElementById('comand').value;
            if (comands !== "") {
                database.ref(`comands2`).set(comands)
                const commandLine = document.createElement("div");
                commandLine.classList.add("line");
                const commandText = document.createElement("p");
                commandText.classList.add("comands");
                commandText.id = "comands";
                commandText.textContent = "> " + comands;

                const container = document.getElementById('container');
                container.appendChild(commandLine);
                commandLine.appendChild(commandText);
            }
        };

        document.addEventListener('DOMContentLoaded', function() {

            function syncOutput() {
                database.ref('output2').on('value', function(snapshot) {
                    const outputHTML = snapshot.val();
                    if (outputHTML !== "") {
                        const commandLine = document.createElement("div");
                        commandLine.classList.add("line");
                        commandLine.innerHTML = outputHTML;
            
                        const container = document.getElementById('container');
                        container.appendChild(commandLine);
            
                        database.ref('output2').set("");
                    }
                });
            }            

            syncOutput()
        });
        

        document.addEventListener('DOMContentLoaded', function() {
            const buttonReset = document.getElementById('reset');
            
            buttonReset.addEventListener('click', function() {
                    database.ref(`comands2`).set("")
                    database.ref(`output2`).set("")
                    const comands = document.getElementById('comand');
                    comands.value = ""
                    const container = document.getElementById('container');
                    container.innerHTML = "";
                });
        });


        document.addEventListener('DOMContentLoaded', function() {
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

            syncAdvice();
        });