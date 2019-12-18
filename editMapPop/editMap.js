let emPop = document.getElementById("editMapPop");
emPop.addEventListener("openpop", initEditMap);

function initEditMap(){
  let mapContainer =  document.getElementById("editMapList");
  MutantDB.mapsStore().getAll().onsuccess = function(evt){
    let maps = evt.target.result;
    mapContainer.innerHTML = "";
    if (maps && maps.length) {
      maps.forEach(function(elem){
        // &#128065;
        let map = document.createElement("LI");
        let previewMap = document.createElement("BUTTON");

        //Map Element
        map.mapId = elem.id;
        map.onclick = selectMap;

        //Preview Button Element edition-24
        // previewMap.innerHTML = '<div class="icon icon-edition-24"></div>';
        previewMap.classList.add("icon");
        previewMap.classList.add("icon-edition-24");
        previewMap.mapImg = elem.src;
        previewMap.onclick = showEditPreview;

        let editMap = document.createElement("BUTTON");
        editMap.classList.add("icon");
        editMap.classList.add("icon-files-47");
        editMap.id = map.mapId;
        editMap.onclick = showEditOptions;
        previewMap.onclick = showEditOptions;

        map.appendChild(previewMap);
        map.appendChild(editMap);

        map.appendChild(document.createTextNode(elem.name));
        mapContainer.appendChild(map);
        // mapContainer.innerHTML += "<li data-id='"+elem.id+"'>"+elem.name+"</li>";
      });
    }
  };
}

function showEditPreview(evt){
  let mapContainer = document.createElement("DIV");
  mapContainer.id = "mapListPrev";
  mapContainer.style.backgroundImage = "url('"+evt.target.mapImg+"')";
  mapContainer.style.display = "block";

  let closeB = document.createElement("BUTTON");
  closeB.classList.add("icon");
  closeB.classList.add("icon-interface-23");
  closeB.onclick = closeEditPreview;
  // console.log(evt.target.mapImg);
  mapContainer.appendChild(closeB);
  evt.target.parentNode.parentNode.appendChild(mapContainer);
}

function closeEditPreview(){
  document.getElementById("editMapList").removeChild(document.querySelector("#mapListPrev"));
}

function cancelEditOption(){
  document.getElementById("editMapPop").classList.remove("editing");
}

function showEditOptions(evt){
  if(typeof evt.target.id !== "undefined"){
    let transaction = MutantDB.mapsStore().get(evt.target.id);
    transaction.onsuccess = function(){
      document.getElementById("editMapPop").classList.add("editing");
    }
  }
}
