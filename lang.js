var clientLang = navigator.language ? navigator.language : "en-US";
if (clientLang) {
  switch (clientLang.slice(0, 2)){
    case "es":
    case "ca":
    case "eu":
    case "gl":
      clientLang = "es";
      break;
    case "en":
      clientLang = "en";
  }
}
window.lang = {
  es:{
    YourSavegames: "Tus partidas",
    NewGame: "Nueva partida",
    ImportGame: "Importar Partida",
    NoGame: "No Hay partidas",
    updateClient: "Tu navegador no está actualizado.",
    Map: "Mapa",
    NewMap: "Nuevo mapa",
    Save:"Guardar",
    Cancel: "Salir",
    Clean: "Limpiar",
    Add: "Añadir",
    AddRandom: "Añadir aleatorio",
    CreateNewGame: "Nueva Partida",
    RenameMap: "Renombrar partida",
    Rename: "Nuevo nombre",
    GExists: "Ya existe una partida con ese nombre",
    CreateNewMap: "Nuevo Mapa",
    Options: "Opciones",
    Name: "Nombre",
    Rows: "Filas",
    Columns: "Columnas",
    Grid: "Cuadrícula",
    Change: "Cambiar",
    ChangeImage: "Cambiar Imagen",
    ChangeFile: "Cambiar Archivo",
    SaveMap: "Guardar Mapa",
    Color: "Color",
    MExists: "Ya existe un mapa con ese nombre",
    MSaveSuccess: "Guardado con éxito",
    MFillFields: "Debe rellenar todos los campos",
    Opacity: "Transparencia",
    EditZone: "Editar Zona",
    Explored: "Explorado",
    ZoneName: "Nombre de la zona",
    Environment: "Entorno",
    MoodElements: "Elementos de tono",
    Ruin: "Ruina",
    RuinsType: "Tipo de Ruina",
    RotLevel: "Descomposición",
    AddThreat: "Añadir Amenaza",
    ThreatLevel: "Nivel de amenaza",
    Threats: "Amenaza",
    Artifacts: "Artefactos",
    Notes: "Notas",
    RollDice: "Lanzar los dados",
    maps: {
      deadapple: "La Manzana Muerta",
    },
    ruinType: {
      basic: "Normal",
      industry: "Industrial",
    },
    threatType: {
      phenomenon: "Fenómeno",
      monster: "Monstruo",
      humanoid: "Humanoide",
    },
    rotDesc: {
      0: "Oasis de Descomposición",
      1: "Descomposición débil 1PD/Dia",
      2: "Área de Descomposición 1PD/Hora",
      3: "Punto caliente de Descomposición",
    }
  },
  en:{
    YourSavegames: "Your Savegames",
    NewGame: "New Game",
    ImportGame: "Import Game",
    Save:"Save",
    Cancel: "Cancel",
    Clean: "Clean",
    Add: "Add",
    AddRandom: "Add Random",
    NoGame: "No Game",
    updateClient: "Your browser is not updated.",
    Map: "Map",
    NewMap: "New Map",
    CreateNewGame: "Create New Game",
    RenameMap: "Rename Game",
    Rename: "New Name",
    GExists: "A game exists with same name",
    CreateNewMap: "Create New Map",
    Options: "Options",
    Name: "Name",
    Rows: "Rows",
    Columns: "Columns",
    Grid: "Grid",
    Change: "Change",
    ChangeImage: "Change Image",
    ChangeFile: "Change File",
    SaveMap: "Save Map",
    Color: "Color",
    MExists: "A map exists with same name",
    MSaveSuccess: "Save success",
    MFillFields: "You must complete all fields",
    Opacity: "Opacity",
    EditZone: "Edit Zone",
    Explored: "Explored",
    ZoneName: "Zone Name",
    Environment: "Environment",
    MoodElements: "Mood Elements",
    Ruin: "Ruin",
    RuinsType: "Ruins Type",
    RotLevel: "Rot Level",
    AddThreat: "Add Threat",
    ThreatLevel: "Threat Level",
    Threats: "Threat",
    Artifacts: "Artifacts",
    Notes: "Notes",
    RollDice: "Roll the dice",
    maps: {
      deadapple: "Dead Apple",
    },
    ruinType: {
      basic: "Normal",
      industry: "Industry",
    },
    threatType: {
      phenomenon: "Phenomenon",
      monster: "Monster",
      humanoid: "Humanoid",
    },
    rotDesc: {
      0: "Rot Oasis",
      1: "Weak Rot 1RP/Day",
      2: "Rot-Heavy Area 1RP/Hour",
      3: "Rot Hotspot",
    }
  }
}

document.querySelectorAll("*[data-lang]").forEach(function(e){
  if (window.lang[clientLang][e.dataset.lang]) {
    e.innerHTML = window.lang[clientLang][e.dataset.lang];
  }
});
