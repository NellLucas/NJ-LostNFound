import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js'
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "Your-Firebase-Config",
    authDomain: "Your-Firebase-Config",
    databaseURL: "Your-Firebase-Config",
    projectId: "Your-Firebase-Config",
    storageBucket: "Your-Firebase-Config",
    messagingSenderId: "Your-Firebase-Config",
    appId: "Your-Firebase-Config",
    measurementId: "Your-Firebase-Config"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let interval;
let itemNum;

const dbRef = ref(db, 'acquire');
onValue(dbRef, (snapshot)=>{
    const data = snapshot.val();
    itemNum = Object.entries(data)
        .filter(item => !isNaN(parseInt(item[0])))
        .map(item => parseInt(item[0]));
    clearInterval(interval);
    delAll();
    loadAll(itemNum);
    controlC();
})


function controlC() {
  const containers = document.querySelectorAll(".container");
  let currentIndex = 0;

  function showContainers() {
    containers.forEach(container => {
      container.style.display = "none";
    });

    for (let i = 0; i < 3; i++) {
      containers[currentIndex].style.display = "block";
      currentIndex = (currentIndex + 1) % containers.length;
    }
  }
  showContainers();
  interval = setInterval(showContainers, 4000);
}

function delAll(){
  var parentContainer = document.querySelector(".parent-container");
  while (parentContainer.firstChild) {
    parentContainer.removeChild(parentContainer.firstChild);
}
}

function loadAll(itemNum){
    for(const element of itemNum){
        loadData(element);
    }
}

function loadData(dbval){
    const dbRef = ref(db, 'acquire/'+dbval);
    onValue(dbRef, (snapshot)=>{
        const data = snapshot.val();
        if(data.done == '0'){
        var container = $('<div class="container">');
        container.append('<img id="image_'+dbval+'" src="'+data.url+'">');
        container.append('<div class="text"><h2 id="title_'+dbval+'">'+data.name+'</h2><p id="date_'+dbval+'">'+data.date+'</p><p id="special_'+dbval+'">'+data.special+'</p></div>');
        $('.parent-container').append(container);
        }
    })
}
