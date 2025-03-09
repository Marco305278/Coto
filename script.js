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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const pc1Cont = document.getElementById('pc1')
const pc2Cont = document.getElementById('pc2')

var activeScreen = 0;
const home = document.getElementById('home');
const comands = document.getElementById('comands');
const password = document.getElementById('password');

var number_script = 1;

document.addEventListener('DOMContentLoaded', function() {

  // Funzioni di sincronizzazione

  function syncPcName() {
    database.ref(`pcname1`).on('value', function(snapshot) {
      const pcnametext = document.getElementById('pcname1');
      const pcname = snapshot.val();
      if (pcname) {
        pcnametext.innerHTML = pcname;
      }
    });
  }

  function syncPcName2() {
    database.ref(`pcname2`).on('value', function(snapshot) {
      const pcnametext2 = document.getElementById('pcname2');
      const pcname2 = snapshot.val();
      if (pcname2) {
        pcnametext2.innerHTML = pcname2;
      }
    });
  }
  
  function syncDate1() {
    database.ref(`date1`).on('value', function(snapshot) {
      const datetext = document.getElementById('date1');
      const date = snapshot.val();
      if (date) {
        datetext.innerHTML = new Date(date).toLocaleTimeString('it-IT', {
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
    });
  }

  function syncDate2() {
    database.ref(`date2`).on('value', function(snapshot) {
      const datetext2 = document.getElementById('date2');
      const date2 = snapshot.val();
      if (date2) {
        datetext2.innerHTML = new Date(date2).toLocaleTimeString('it-IT', {
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
    });
  }
  
  function syncIpAddress() {
    const input = document.getElementById('ipaddress');
    const id2Ref = database.ref('id' + number_script);
    const ip2Ref = database.ref('ip' + number_script);

    id2Ref.once('value')
      .then(function(id2Snapshot) {
        const id2 = id2Snapshot.val();
        if (id2 === null) {
          throw new Error("Valore 'id2' non trovato nel database.");
        }
        return id2;
      })
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
      .then(function(combinedValue) {
        input.value = combinedValue;
      })
      .catch(function(error) {
        console.error("Errore durante la sincronizzazione dell'indirizzo IP:", error);
      });
  }

  function syncTexts() {
    // Rimuovi eventuali listener precedenti per 'texts1' e 'texts2'
    database.ref('texts1').off();
    database.ref('texts2').off();
    
    // Imposta il nuovo listener in base al valore corrente di number_script
    database.ref(`texts${number_script}`).on('value', function(snapshot) {
      const textsParagraph = document.getElementById('texts');
      const texts = snapshot.val();
      textsParagraph.innerHTML = texts ? texts : "";
    });
  }  

  function syncAdvice() {
    database.ref('advice' + number_script).on('value', function(snapshot) {
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
          // Attende 5 secondi prima di resettare il valore in Firebase
          setTimeout(function() {
            database.ref("advice" + number_script).set("");
          }, 5000);
        }, 2000);
      }
    });
  }

  function connectDate1() {
    database.ref('date1').once('value').then(function(snapshot) {
      const connect1 = new Date(snapshot.val());
      const now = new Date();
      const diffMs = now - connect1;
      
      if (diffMs <= 5500) {
        pc1Cont.classList.add("conn");
      } else {
        if (pc1Cont.classList.contains("conn")) {
          pc1Cont.classList.remove("conn");
        }
      }
      
    })
  }

  function connectDate2() {
    database.ref('date2').once('value').then(function(snapshot) {
      const connect2 = new Date(snapshot.val());
      const now = new Date();
      const diffMs = now - connect2;
      
      if (diffMs <= 5500) {
        pc2Cont.classList.add("conn");
      } else {
        if (pc2Cont.classList.contains("conn")) {
          pc2Cont.classList.remove("conn");
        }
      }
      
    })
  }

    document.getElementById('play').onclick = function sendComand() {
      var comands = document.getElementById('comand').value;
      if (comands !== "") {
          database.ref(`comands` + number_script).set(comands)
          const commandLine = document.createElement("div");
          commandLine.classList.add("linemax");
          const commandText = document.createElement("p");
          commandText.classList.add("comands");
          commandText.id = "comands";
          commandText.textContent = "> " + comands;

          const container = document.getElementById('container');
          container.appendChild(commandLine);
          commandLine.appendChild(commandText);
      }
  };

    function syncOutput() {
          database.ref(`output1`).off();
          database.ref(`output2`).off();
          

          database.ref(`output${number_script}`).on('value', function(snapshot) {
              const outputHTML = snapshot.val();
              if (outputHTML !== "") {
                  const commandLine = document.createElement("div");
                  commandLine.classList.add("linemax");
                  commandLine.innerHTML = outputHTML;
      
                  const container = document.getElementById('container');
                  container.appendChild(commandLine);
      
                  database.ref(`output${number_script}`).set("");
              }
          });
      }

      function syncPassword() {
        const passwordValue = database.ref('consolepassword');
        passwordValue.once('value')
        .then((snapshot) => {
          const passwordValue = snapshot.val();
          if (passwordValue == "") {
            password.style.display = "none";
            comands.style.display = "none";
            home.style.display = "flex";
            activeScreen = 1;
          } else {
            
          }
        })
        .catch((error) => {
          console.error('Errore durante il recupero della password:', error);
        });
      }

      
  
  // Chiamate iniziali di sincronizzazione
  syncPcName();
  syncPcName2();
  syncDate1();
  syncDate2();
  syncIpAddress();
  syncTexts();
  syncAdvice();
  syncOutput();
  syncPassword();
  
    // Aggiorna la data ogni 3 secondi
    setInterval(connectDate1, 3000);
    setInterval(connectDate2, 3000);

  // Imposta i listener per i pulsanti Connect, Stop e Reset
  document.getElementById('connect').addEventListener('click', function() {
    database.ref(`enabled_script${number_script}`).set(true);
  });

  document.getElementById('stop').addEventListener('click', function() {
    database.ref(`enabled_close${number_script}`).set(true);
  });

  function restoreConsole() {
    const comands = document.getElementById('comand');
    comands.value = ""
    const container = document.getElementById('container');
    container.innerHTML = "";
  }

// Funzione per rieseguire le funzioni di sincronizzazione
  function reSyncFunctions() {
    connectDate1();
    connectDate2();
    syncIpAddress();
    syncTexts();
    syncAdvice();
    restoreConsole();
    syncOutput()
    // Se necessario, puoi aggiungere qui altre funzioni da richiamare
  }



  document.getElementById('reset').addEventListener('click', function() {
    const pcname = document.getElementById('pcname' + number_script);
    pcname.innerHTML = number_script;
    const datetext = document.getElementById('date' + number_script);
    datetext.innerHTML = "";
    database.ref(`enabled_script${number_script}`).set(false);
    database.ref(`enabled_close${number_script}`).set(false);
    database.ref(`texts${number_script}`).set("");
    database.ref(`date${number_script}`).set("");
    database.ref(`pcname${number_script}`).set("");
    document.getElementById('texts').innerHTML = "";

    reSyncFunctions()
  });
  
  document.getElementById('change-screen').addEventListener('click', function() {
    if (activeScreen !== 0) {
      if (activeScreen == 1) {
        comands.style.display = "flex";
        home.style.display = "none";
        password.style.display = "none";
        activeScreen = 2;
      } else {
        home.style.display = "flex";
        comands.style.display = "none";
        password.style.display = "none";
        activeScreen = 1;
      }
    }
  });

  document.getElementById('validatepassword').addEventListener('click', function() {
    const inputPassword = document.getElementById('inputpassword');
    const passwordValue = database.ref('consolepassword');
    passwordValue.once('value')
    .then((snapshot) => {
      const passwordValue = snapshot.val();
      if (inputPassword.value == passwordValue) {
        activeScreen = 1
        home.style.display = "flex";
        comands.style.display = "none";
        password.style.display = "none";
        inputPassword.classList.remove('error')
      } else {
        inputPassword.classList.add('error')
      }
    })
    .catch((error) => {
      console.error('Errore durante il recupero della password:', error);
    });
  })
  
  
  // Imposta i listener per cambiare number_script e chiamare reSyncFunctions()
  document.getElementById('pc1').addEventListener('click', function() {
    pc1Cont.classList.add("sel")
    pc2Cont.classList.remove("sel")
    number_script = 1;
    reSyncFunctions();
  });
  
  document.getElementById('pc2').addEventListener('click', function() {
    pc1Cont.classList.remove("sel")
    pc2Cont.classList.add("sel")
    number_script = 2;
    reSyncFunctions();
  });
  
  // Salvataggio dell'indirizzo IP inserito
  document.getElementById('ipaddress').oninput = function() {
    var input = this.value;
    const [id2, ip2] = input.split('-');
    database.ref(`id${number_script}`).set(id2);
    database.ref(`ip${number_script}`).set(ip2);
  };

});
