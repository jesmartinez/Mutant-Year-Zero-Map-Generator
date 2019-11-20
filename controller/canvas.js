let squares = document.getElementById("squares");
let squaresCanvas = undefined;
let grid = document.getElementById("grid");
let gridLines = {rows:[], cols:[]};
let actualMousePosition = {row: 0, col: 0};


function initCanvas(){
  squares.addEventListener("mousemove", moveSquares);
  squares.addEventListener("click", editZone);

  squaresCanvas = squares.getContext('2d');
  gridLines.rows.unshift(0);
  gridLines.cols.unshift(0);
}

function setImgAndGrid(){
  let map = document.querySelector("#map");
  map.src = contents.map.src;
  map.onload = function(){
    let grid = document.querySelector("#grid");
    let squares = document.getElementById("squares");
    if (true/*map.src !== ""*/) {
      let context = grid.getContext('2d');
      let rows = contents.map.rows;
      let cols = contents.map.cols;
      context.clearRect(0, 0, grid.width, grid.height);
      visitedAreas.width = map.naturalWidth;
      visitedAreas.height = map.naturalHeight;
      squares.width = map.naturalWidth;
      squares.height = map.naturalHeight;
      grid.width = map.naturalWidth;
      grid.height = map.naturalHeight;
      //Set rows
      context.fillStyle = contents.map.color;
      context.fillRect(0, 0-1, map.naturalWidth, 3);
      for (var i = 1; i <= rows; i++) {
        let pos = (grid.height/rows)*i;
        context.fillRect(0, pos-1, map.naturalWidth, 3);
        gridLines.rows[i-1] = pos;
      }
      //Set columns
      context.fillRect(0-1, 0, 3, map.naturalHeight);
      for (var i = 1; i <= cols; i++) {
        let pos = (grid.width/cols)*i;
        context.fillRect(pos-1,0, 3, map.naturalHeight);
        gridLines.cols[i-1] = pos;
      }
      grid.style.opacity = contents.map.opacity/100;
      initCanvas();
    }
  }
}

function moveSquares(evt){
  // TESTS WHERE ARE YOU
  let gridPosition = {row: 0, col: 0};
  let mousePosition = getMousePosition(evt);

  for (var i = 0; i < gridLines.rows.length; i++) {
    // console.log(mousePosition);
    if (mousePosition.y < gridLines.rows[i]) {
      gridPosition.row = i;
      break;
    }
  }
  for (var i = 0; i < gridLines.cols.length; i++) {
    if (mousePosition.x < gridLines.cols[i]) {
      gridPosition.col = i;
      break;
    }
  }
  actualMousePosition = gridPosition;
  // console.log(gridPosition);
  // PAINT YOUR CURSOR POSITION
  squaresCanvas.clearRect(0, 0, squares.width, squares.height);
  squaresCanvas.fillStyle = "#FFF";
  squaresCanvas.fillRect(
    gridLines.cols[gridPosition.col-1],
    gridLines.rows[gridPosition.row-1],
    gridLines.cols[1],
    gridLines.rows[1]
  );
}

function getMousePosition(evt) {
  return {
    x: evt.offsetX * squares.width / squares.clientWidth | 0,
    y: evt.offsetY * squares.height / squares.clientHeight | 0
  };
}
