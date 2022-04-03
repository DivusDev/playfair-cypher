
//create a 5x5 matrix
let playfairMatrix = new Array(5).fill(0).map( v => new Array(5).fill(''))
let takenLetters = {}

console.log(playfairMatrix)

//Global variables 


//Executed only once
function setup() {
  //stops default canvas from spawning
  noCanvas();

  //create the input matrix
  let table = createElement('table')
  table.id ('matrix-table' )
  table.parent('table-container')
  for (let i = 0; i < 5; i++) {
    let row = createElement('tr')
    row.id(`row${i}`)
    row.parent('matrix-table')
    for (let k = 0; k < 5; k++) {
      let cell = createElement('td')
      cell.id(`cell${i} ${k}`)
      cell.parent(`row${i}`)
      let textInput = createElement('input')
      textInput.parent(`cell${i} ${k}`)
      textInput.id(`r${i}-c${k}`)

      textInput.input(PlayfairMatrixInput)
    }
  }

  //create fillButton
  let button = select('#random-button')
  button.mousePressed(randomizePlayfairMatrix)

  noLoop();
}


//executed every time
function draw() {
  

}













// Functions

// Forces Lowercase input and allows 
let PlayfairMatrixInput = (e) => {
    
    //reference input cell
    let textInput = e.target

    //get the row and column from generated id
    let row = textInput.id[1]
    let column = textInput.id[4]

    // retrieve old and new letters
    let oldLetter =  textInput.value[0]
    let newLetter =  textInput.value[1];
    
      
    if (!/^[A-Za-z]*$/g.test(textInput.value)) {                  //if an invalid character has been entered
      modifyInput(textInput, '', row, column)                     //set to nothing
      return
    }

    // if no new letter (aka there is only one letter) 
    if (!newLetter) {
      // if the proposed letter is taken
      console.log(oldLetter)
      if (checkIfTaken(oldLetter)) return  modifyInput(textInput, '', row, column)
      return modifyInput(textInput, oldLetter, row, column)
    }

    // if the new letter is taken dont allow change
    if (checkIfTaken(newLetter)) return modifyInput(textInput, oldLetter , row, column, false)


    // new letter not taken
    //standardize and mark letters
    markLetter(oldLetter)

    //set input
    modifyInput(textInput, newLetter, row, column)
}

let markLetter = (letter) => {
  if (!letter) return ""
  letter = letter.toLowerCase()
  //special case I and J  -  set J to I
  letter = letter == 'j' ? 'i' : letter
  takenLetters[letter] = !takenLetters[letter]
  return letter
}

let checkIfTaken = (letter) => {
  if(!letter) return false
  letter = letter.toLowerCase()
  //special case I and J -  set J to I
  letter = letter == 'j' ? 'i' : letter
  return !!takenLetters[letter] 
}

let modifyInput = (textInputReference, newValue, row, column, mark = true) =>{
  newValue = markLetter(newValue)
  textInputReference.value =  newValue
  playfairMatrix[row][column] = newValue;
}



let randomizePlayfairMatrix = () => {
  let lettersToUse = []
  console.log(playfairMatrix, takenLetters)  

  // check if every letter has been taken
  for (let i = 0; i < 26; i++) {
    if (i == 9) continue      //special case we skip j
    let c = String.fromCharCode( i + 97)
    if (!takenLetters[c]) {
      lettersToUse.push(c)
    }
  }

    //randomly sort letters to Use
    //do this by shuffling all indexes
  for (let i = 0; i < lettersToUse.length; i++) {
    // calculate random swap index and swap
    let swapIndex = floor(Math.random() * lettersToUse.length)
    let temp = lettersToUse[i] 
    lettersToUse[i] = lettersToUse[swapIndex]
    lettersToUse[swapIndex] = temp 
  }

  // go through playfair and use a letter if needed
  let i = 0
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (playfairMatrix[row][col] != '') continue
      let input = document.querySelector(`#r${row}-c${col}`)
      modifyInput(input, lettersToUse[i], row, col)
      i++;
    }
  }
  console.log(playfairMatrix, takenLetters)  
}