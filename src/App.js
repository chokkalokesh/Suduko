import React, { useState } from 'react';
import './App.css';

function App() {

  const [grid, setGrid] = useState(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '0'))
  );


  const check = (rowIndex, cellIndex, newValue) => {
    // Check if newValue is empty or a number
    if (newValue === '' || /^[0-9]$/.test(newValue)) {
      //Check if the number is already in the 3x3 box
      const startRow = 3 * Math.floor(rowIndex / 3);
      const startCol = 3 * Math.floor(cellIndex / 3);
      for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === parseInt(newValue)) {
                //console.log(startRow + i,startCol + j,newValue)
                  return {
                      msg:'ok',
                      status:false,
                      from:"3x3"
                    }
              }
          }
      }
      for (let i = 0; i < 9; i++) {
        // Check row
        if (grid[rowIndex][i] === parseInt(newValue) && i !== cellIndex) {
          return {
            msg:'ok',
            status:false,
            from:"row"
          }
        }
        // Check column
        if (grid[i][cellIndex] === parseInt(newValue) && i !== rowIndex) {
          return {
            msg:'ok',
            status:false,
            from:"col"
          }
        }

      }
      return {
        msg:'ok',
        status:true,
        from:"true"
      }
    } else {
      // return false; // Value is invalid (neither empty nor a number)
      return {
        msg:'no',
        status:false
      }
    }
  };


  const handleChange = (e, rowIndex, cellIndex) => {
    const newValue = e.target.value.slice(-1);
    const result = check(rowIndex, cellIndex, newValue)
    //console.log(result.from)
  
    if (result.msg==='ok') {
      const newGrid = [...grid];
      if (result.status) {
        document.getElementById(`${rowIndex}${cellIndex}`).style.color = 'black'
        document.getElementById(`${rowIndex}${cellIndex}`).style.fontSize = '20px'
        newGrid[rowIndex][cellIndex] = newValue !== '' ? parseInt(newValue) : 0;
        document.getElementById('btn').disabled = false
        setGrid(newGrid);
      }
      else{
        //const newGrid = [...grid];
        newGrid[rowIndex][cellIndex] = newValue !== '' ? parseInt(newValue) : 0;
        document.getElementById(`${rowIndex}${cellIndex}`).style.color = 'red'
        document.getElementById(`${rowIndex}${cellIndex}`).style.fontSize = '25px'
        document.getElementById('btn').disabled = true
        setGrid(newGrid);
      }
    }

  };




  
  const handleSolve = () => {
    const solved = solveSudoku(grid); // Call the backtracking function to solve the Sudoku puzzle
    console.log("handleSolve ",solved)
    if (solved) {
      //console.log("solved");
      setGrid(solved);
      //console.log("handleSolve ",solved)
      //solved =[...grid]
      for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
          document.getElementById(`${i}${j}`).style.color = 'black'
          document.getElementById(`${i}${j}`).style.backgroundColor = 'white'
          document.getElementById(`${i}${j}`).style.fontSize = '25px'
          document.getElementById(`${i}${j}`).innerText=''
          document.getElementById(`${i}${j}`).value=solved[i][j]
          //console.log(`${i}${j} - ${solved[i][j]}`)
        }
      }
    } else {
      alert("No solution found!");
      console.log('No solution exists!');
    }
  };

  function findEmptyCell(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (parseInt(grid[i][j]) === 0) {
              //console.log("empty cell",[i,j] ,parseInt(grid[i][j]))
                return [i, j];
            }
        }
    }
    return null;
  }

const solveSudoku = (grid) => {
  const newGrid = grid.map(row => [...row]);
  //console.log("new grid in solvesuduko(): ",newGrid)
  const emptyCell = findEmptyCell(newGrid);

  if (!emptyCell) {
    return newGrid;
  }
  
  const [row, col] = emptyCell;

  for (let num = 1; num <= 9; num++) {
    if(isValid(newGrid,row,col,num)){
      newGrid[row][col] = num;

      let result = solveSudoku(newGrid)

      if (result) {
        return result;
      }
    }
      newGrid[row][col] = 0; // Backtrack
    
  }
  return false; // No solution exists
};





















function isValid(grid, row, col, num) {
  // Check if the number is already in the row
  for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) {
          return false;
      }
  }
  
  // Check if the number is already in the column
  for (let i = 0; i < 9; i++) {
      if (grid[i][col] === num) {
          return false;
      }
  }
  
  // Check if the number is already in the 3x3 box
  const startRow = 3 * Math.floor(row / 3);
  const startCol = 3 * Math.floor(col / 3);
  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (grid[startRow + i][startCol + j] === num) {
              return false;
          }
      }
  }
  
  return true;
}



























  const suduko=()=>{
    return(
      <div>
        <div className='solver'>
          <h1>Sudoku Solver</h1>
        </div>
        <div className="sudoku-grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, cellIndex) => (
                <input
                  key={cellIndex}
                  placeholder='0'
                  type="text"
                  id={`${rowIndex}${cellIndex}`}
                  value={cell!== undefined? cell : ''}
                  onChange={(e) => handleChange(e, rowIndex, cellIndex)}
                  className="cell"
                  //maxLength={0}
                />
              ))}
            </div>
          ))}
        </div>
        
      </div>

    )

  }

  return (
    <div>
      {suduko()}
      <div className='btn-class'>
          <button className="btn" id="btn" onClick={handleSolve}>
            SOLVE
          </button>
        </div>
    </div>

  );

}

export default App;

