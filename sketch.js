
//create a 5x5 matrix
let playfairMatrix = new Array(5).fill(0).map( v => new Array(5).fill(''))
let takenLetters = {}
//initialize letters
for (let i = 0; i < 26; i++) {
  if (i == 9) continue      //special case we skip j
  let c = String.fromCharCode( i + 97)
  takenLetters[c] = false
}

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
      textInput.class('matrix-input')
      textInput.id(`r${i}-c${k}`)

      textInput.input(PlayfairMatrixInput)
    }
  }

  
  let fillButton = select('#random-button')                   //create fill button
  fillButton.mousePressed(randomizePlayfairMatrix)
  let eraseButton = select('#erase-button')                   //create erase button
  eraseButton.mousePressed(erasePlayfairMatrix)

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

    //**** EDGE CASES ****

    //handle delete button press
    if (e.data == null) return erasePlayfairMatrix();

    //handle spam input
    if (textInput.value.length > 2) return textInput.value = ''

    //get the row and column from generated id
    let row = textInput.id[1]
    let column = textInput.id[4]

    // retrieve old and new letters
    let oldLetter =  textInput.value[0]
    let newLetter =  textInput.value[1];
    console.log(newLetter, takenLetters[newLetter], oldLetter, takenLetters[oldLetter])
    
      
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
    // if old letter is marked unmark
    if (takenLetters[oldLetter]) markLetter(oldLetter)

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

let erasePlayfairMatrix = () => {
  // mark all letters as unused
  for (let i = 0; i < 26; i++) {
    if (i == 9) continue      //special case we skip j
    let c = String.fromCharCode( i + 97)
    takenLetters[c] = false
  }

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      let input = document.querySelector(`#r${row}-c${col}`)
      modifyInput(input, '', row, col)
    }
  }
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
}