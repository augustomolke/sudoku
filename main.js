const possibleKeys = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
];

const fazFetch = async (url) => {
  return fetch(url, {
    body: getInputs(),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then((response) => response.json());
};

const deleteGrid = () => {
  document.querySelectorAll(`.table-grid`).forEach((e) => e.remove()); //e.remove());
};

const getInputs = () => {
  let rows = document.querySelectorAll(`tr`);
  let inputs = {};
  /*let i = 0;
  let j = 0;
  for (row of rows) {
    let cells = row.querySelectorAll("input");

    for (cell of cells) {
      if (cell.value != "") {
        inputs[`x${j}`] = { i: i, j: j, val: parseInt(cell.value) };
      }
      j++;
    }
    i++;
    j = 0;
  }*/

  for (cell of document.querySelectorAll("input")) {
    if (cell.value) {
      let [row, col] = cell.id.match(/\d{1,2}/g);
      row = parseInt(row);
      col = parseInt(col);

      inputs[`x${row}_${col}`] = {
        i: row - 1,
        j: col - 1,
        val: parseInt(cell.value),
      };
    }
  }
  console.log(inputs);
  inputs = JSON.stringify(inputs);

  return inputs;
};

const resetGrid = () => {
  let rows = document.querySelectorAll(`tr`);
  let i = 0;
  let j = 0;
  for (row of rows) {
    let cells = row.querySelectorAll("input");
    for (cell of cells) {
      cell.value = "";
      j++;
    }
    i++;
    j = 0;
  }

  let ordem = parseInt(document.querySelector("select").value);

  for (let i = 1; i <= ordem; i++) {
    let randomRow = Math.floor(Math.random() * (ordem - 1)) + 1;
    let randomCol = Math.floor(Math.random() * (ordem - 1)) + 1;

    document.querySelector(`#row${randomRow}col${randomCol}`).value = i;
  }

  // deleteGrid();
  // let ordem = parseInt(document.querySelector("select").value);
  // buildMatrix(ordem);
};

const buildMatrix = (ordem) => {
  let matrix = [];
  for (let i = 0; i < ordem; i++) {
    matrix.push([]);
    for (let j = 0; j < ordem; j++) {
      matrix[i].push([]);
    }
  }

  for (let i = 1; i <= ordem; i++) {
    let randomRow = Math.floor(Math.random() * (ordem - 1));
    let randomCol = Math.floor(Math.random() * (ordem - 1));

    matrix[randomRow][randomCol] = i;
  }

  return matrix;
};

const buildGrid = (sol) => {
  deleteGrid();
  let ordem = document.getElementById("input-ordem").value;
  let subOrder = Math.sqrt(ordem);
  let matrix = sol;

  if (!sol) {
    matrix = buildMatrix(ordem);
  }

  var table = document.createElement("table");
  table.setAttribute("class", "table-grid");
  for (row of matrix) {
    let elementRow = document.createElement("tr");
    let i = matrix.indexOf(row);
    let bottom = (i + 1) % subOrder == 0 ? "bottom" : "";
    let top = i == 0 || i % subOrder == 0 ? "top" : "";

    for (item of row) {
      let j = row.indexOf(item);
      let right = (j + 1) % subOrder == 0 ? "right" : "";
      let left = j == 0 || j % subOrder == 0 ? "left" : "";

      let value = document.createElement("td");
      let input = document.createElement("INPUT");
      input.setAttribute("type", "text");
      input.setAttribute("maxlength", ordem == 9 ? "1" : "2");
      input.setAttribute("value", item);
      input.setAttribute(
        "class",
        "cell " + bottom + " " + right + " " + left + " " + top
      );
      input.setAttribute("id", `row${i + 1}col${j + 1}`);
      input.addEventListener("keyup", checkKey);
      value.appendChild(input);
      elementRow.appendChild(value);
    }
    table.appendChild(elementRow);
    document.body.appendChild(table);
  }

  let center = document.querySelector("#row5col5");
  document.addEventListener("load", () => center.focus());
};

function checkKey(e) {
  if (!possibleKeys.includes(e.key)) {
    this.value = "";
  } else {
    let max = parseInt(document.querySelector("select").value);
    if (parseInt(this.value) > max) {
      this.value = "";
    } else {
      let [row, col] = this.id.match(/\d{1,2}/g);
      row = parseInt(row);
      col = parseInt(col);
      switch (e.key) {
        case "ArrowUp":
          document
            .querySelector(`#row${row - 1 < 1 ? max : row - 1}col${col}`)
            .focus();
          break;
        case "ArrowDown":
          document
            .querySelector(`#row${row + 1 > max ? 1 : row + 1}col${col}`)
            .focus();
          break;
        case "ArrowLeft":
          document
            .querySelector(`#row${row}col${col - 1 < 1 ? max : col - 1}`)
            .focus();
          break;
        case "ArrowRight":
          document
            .querySelector(`#row${row}col${col + 1 > max ? 1 : col + 1}`)
            .focus();
          break;
        default:
          for (let i = 1; i <= max; i++) {
            if (
              (document.querySelector(`#row${i}col${col}`).value ==
                this.value &&
                i != row) ||
              (document.querySelector(`#row${row}col${i}`).value ==
                this.value &&
                i != col)
            ) {
              this.setAttribute("style", "color: red; background-color: wheat");
            }
          }
          break;
      }
    }
  }
}

const solve = async () => {
  let ordem = document.getElementById("input-ordem").value;

  fazFetch(`https://sudoku-api-otto.herokuapp.com/?max=${ordem}`).then(
    (matrix) => {
      deleteGrid();
      buildGrid(matrix);
    }
  );
};

window.onload = () => {
  buildGrid();
};
document.getElementById("solve-grid").onclick = solve;
document.getElementById("reset-grid").onclick = resetGrid;

//document.addEventListener("keydown");
