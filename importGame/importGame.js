function getJSONGame(){
  let fileReader = new FileReader();
  let file = document.querySelector('#inputImport').files[0];
  fileReader.readAsText(file);

  fileReader.onloadend = function () {
    try {
      let game = JSON.parse(fileReader.result));
      document.querySelector("#inputImport").style.display = "none";
      document.querySelector("#importName").style.display = "block";
      // document.querySelector("#importName").value = game.name;
      document.querySelector("#iDelete").style.display = "block";
      document.querySelector("#importGamePop button[name='Add']").gameData = game;
    }catch(e){}
  }
}

function deleteActualImportGame(){
  let file = document.querySelector('#inputImport');
  try{
    file.value = "";
    file.type = "";
    file.type = "file";
  }catch(e){
    console.log("Clear file no compatible");
  }
  document.querySelector("#inputImport").style.display = "block";
  document.querySelector("#importName").style.display = "none";
  document.querySelector("#iDelete").style.display = "none";
}

function addImportGame(){

}
