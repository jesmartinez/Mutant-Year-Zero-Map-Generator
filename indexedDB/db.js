/*Initialization*/
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
/*-------------*/
window.MutantDB = {
  db: null,
  mapsStore: null,
  gamesStore: null,
  userStore: null,
  artifactsStore: null,
  moodElementsStore: null,
  threatsStore: null,
  environmentStore: null,
  ruinsStore: null,
}

if (!window.indexedDB) {
  window.alert(window.lang[clientLang].updateClient);
}

//Create or open Mutant data
var openRequest = window.indexedDB.open("MutantDB", 1);

openRequest.onsuccess = function(event) {
  window.MutantDB.db = event.target.result;

  window.MutantDB.mapsStore = function(){
    let transaction = MutantDB.db.transaction("Maps", "readwrite");
    return transaction.objectStore("Maps");
  }

  window.MutantDB.gamesStore = function(){
    let transaction = MutantDB.db.transaction("Games", "readwrite");
    return transaction.objectStore("Games");
  }

  window.MutantDB.userStore = function(){
    let transaction = MutantDB.db.transaction("User", "readwrite");
    return transaction.objectStore("User");
  }

  window.MutantDB.artifactsStore = function(){
    let transaction = MutantDB.db.transaction("Artifacts", "readwrite");
    return transaction.objectStore("Artifacts");
  }

  window.MutantDB.moodElementsStore = function(){
    let transaction = MutantDB.db.transaction("MoodElements", "readwrite");
    return transaction.objectStore("MoodElements");
  }

  window.MutantDB.threatsStore = function(){
    let transaction = MutantDB.db.transaction("Threats", "readwrite");
    return transaction.objectStore("Threats");
  }

  window.MutantDB.environmentStore = function(){
    let transaction = MutantDB.db.transaction("Environment", "readwrite");
    return transaction.objectStore("Environment");
  }

  window.MutantDB.ruinsStore = function(){
    let transaction = MutantDB.db.transaction("Ruins", "readwrite");
    return transaction.objectStore("Ruins");
  }

  setTimeout(function(){
    try{
      if(typeof setDefaultContents !== "undefined")
        setDefaultContents();
    }catch(e){
      console.log("Error setting default data", e);
    }
    dbReady();
  }, 300);
}

//On database need to update / Constructor
openRequest.onupgradeneeded = event => {
  let db = event.target.result;
  // console.log(`Upgrading to version ${db.version}`);

  // Create an objectStore for maps
  mapsStore = db.createObjectStore("Maps", {keyPath: 'id', autoIncrement: true});

  // Create map params
  mapsStore.createIndex('name', 'name', { unique: true });
  mapsStore.createIndex('rows', 'rows', { unique: false });
  mapsStore.createIndex('cols', 'cols', { unique: false });
  mapsStore.createIndex('color', 'color', { unique: false });
  mapsStore.createIndex('opacity', 'opacity', { unique: false });
  mapsStore.createIndex('src', 'src', { unique: false });

  // Create an objectStore for maps
  gamesStore = db.createObjectStore("Games", {keyPath: 'id', autoIncrement: true});

  // Create game params
  gamesStore.createIndex('name', 'name', { unique: true });
  gamesStore.createIndex('map', 'map', { unique: false });
  gamesStore.createIndex('slot', 'slot', { unique: false });
  gamesStore.createIndex('data', 'data', { unique: false });

  // Create an objectStore for user
  userStore = db.createObjectStore("User", {keyPath: 'id'});

  // Create user params
  userStore.createIndex('username', 'username', { unique: true });
  userStore.createIndex('map', 'map', { unique: false });
  userStore.createIndex('data', 'data', { unique: false });

  // Create an objectsStore for artifacts
  artifactsStore = db.createObjectStore("Artifacts", {keyPath: 'id'});

  // Create artifacts params
  artifactsStore.createIndex('name', 'name', { unique: false });
  artifactsStore.createIndex('min', 'min', { unique: false });
  artifactsStore.createIndex('max', 'max', { unique: false });
  artifactsStore.createIndex('game', 'game', { unique: false });

  // Create an objectsStore for tone elements
  moodElementsStore = db.createObjectStore("MoodElements", {keyPath: 'id'});

  // Create tone elements params
  moodElementsStore.createIndex('name', 'name', { unique: false });
  moodElementsStore.createIndex('min', 'min', { unique: false });
  moodElementsStore.createIndex('max', 'max', { unique: false });
  moodElementsStore.createIndex('game', 'game', { unique: false });

  // Create an objectsStore for Threats
  threatsStore = db.createObjectStore("Threats", {keyPath: 'id'});

  // Create Threats params
  threatsStore.createIndex('name', 'name', { unique: false });
  threatsStore.createIndex('type', 'type', { unique: false });
  threatsStore.createIndex('min', 'min', { unique: false });
  threatsStore.createIndex('max', 'max', { unique: false });
  threatsStore.createIndex('game', 'game', { unique: false });

  // Create an objectsStore for Ruins
  ruinsStore = db.createObjectStore("Ruins", {keyPath: 'id'});

  // Create Ruins params
  ruinsStore.createIndex('name', 'name', { unique: false });
  ruinsStore.createIndex('type', 'type', { unique: false });
  ruinsStore.createIndex('min', 'min', { unique: false });
  ruinsStore.createIndex('max', 'max', { unique: false });
  ruinsStore.createIndex('game', 'game', { unique: false });

  // Create an objectsStore for Environment
  environmentStore = db.createObjectStore("Environment", {keyPath: 'id'});

  // Create Environment params
  environmentStore.createIndex('name', 'name', { unique: false });
  environmentStore.createIndex('ruin', 'ruin', { unique: false });
  environmentStore.createIndex('threat', 'threat', { unique: false });
  environmentStore.createIndex('artifact', 'artifact', { unique: false });
  environmentStore.createIndex('min', 'min', { unique: false });
  environmentStore.createIndex('max', 'max', { unique: false });
  environmentStore.createIndex('game', 'game', { unique: false });
};

//Advanced transaction funcion (unused for the moment)
function dbTransactionFunction(tableName, type, func){
  var transaction = window.MutantDB.db.transaction(tableName, 'readwrite');
  var objectStore = transaction.objectStore(tableName);
  objectStore[type]().onsuccess = function(evt){
    return this.func(evt.target.result, this.transaction, objectStore);
  }.bind({func:func, transaction:transaction, objectStore:objectStore});
}

//Shortcode for update Database data (unused for the moment)
function updateDBData(tableName, obj){
  var transaction = window.MutantDB.db.transaction(tableName, 'readwrite');
  var objectStore = transaction.objectStore(tableName);
  objectStore.put(obj);
}

//Shortcode for remove Database data (unused for the moment)
function removeDBData(tableName, obj){
  var transaction = window.MutantDB.db.transaction(tableName, 'readwrite');
  var objectStore = transaction.objectStore(tableName);
  objectStore.delete(obj.id);
}

function newDBGame(name, map, slot=1, data){
  MutantDB.gamesStore().put({name: name, map: map, slot: slot, data: data});
}
function newDBMap(name, rows, cols, src){
  MutantDB.mapsStore().put({name: name, rows: rows, cols: cols, src: src});
}
function newDBUser(id, username, map, data){
  MutantDB.mapsStore().put({id: id, username: username, map: map, data: data});
}
