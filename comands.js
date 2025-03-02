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
                database.ref(`comands`).set(comands)
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
                database.ref('output').on('value', function(snapshot) {
                    const outputHTML = snapshot.val();
                    if (outputHTML !== "") {
                        const commandLine = document.createElement("div");
                        commandLine.classList.add("line");
                        commandLine.innerHTML = outputHTML;
            
                        const container = document.getElementById('container');
                        container.appendChild(commandLine);
            
                        database.ref('output').set("");
                    }
                });
            }            

            syncOutput()
        });
        

        document.addEventListener('DOMContentLoaded', function() {
            const buttonReset = document.getElementById('reset');
            
            buttonReset.addEventListener('click', function() {
                    database.ref(`comands`).set("")
                    database.ref(`output`).set("")
                    const comands = document.getElementById('comand');
                    comands.value = ""
                    const container = document.getElementById('container');
                    container.innerHTML = "";
                });
        });