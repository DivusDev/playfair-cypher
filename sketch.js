

//Global variables 

//create a 5x5 matrix
let playfairMatrix = new Array(5).fill(0).map( v => new Array(5).fill(''))
let takenLetters = {}
//initialize letters
for (let i = 0; i < 26; i++) {
  if (i == 9) continue      //special case we skip j
  let c = String.fromCharCode( i + 97)
  takenLetters[c] = false
}

let plaintext = ''
let cyphertext = ''



// dom References



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

      textInput.input(playfairMatrixInput)
    }
  }

  
  let fillButton = select('#random-button')                   //create fill button
  fillButton.mousePressed(randomizePlayfairMatrix)
  let eraseButton = select('#erase-button')                   //create erase button
  eraseButton.mousePressed(erasePlayfairMatrix)

  
  var plaintextInput = select('#plaintext')                   // textInputs
  var cyphertextInput = select('#cyphertext')     
  plaintextInput.input(plaintextInputHandler)
  cyphertextInput.input(cyphertextInputHandler)
  noLoop();
}


//executed every time
function draw() {
  

}













// Functions

// **************** MATRIX INPUT ****************

// Forces Lowercase input and allows 
let playfairMatrixInput = (e) => {
  
    //reference input cell
    let textInput = e.target

    //**** EDGE CASES ****

    console.log(e)

    //handle spam input
    if (textInput.value.length > 2) return textInput.value = ''

    //get the row and column from generated id
    let row = parseInt(textInput.id[1])
    let column = parseInt(textInput.id[4])

    // retrieve old and new letters
    let oldLetter = playfairMatrix[row][column]
    let newLetter =  e.data

     //handle delete button press
     if (e.inputType == "deleteContentBackward") {
      // delete the current and focus one back
      //find one back
      if (column === 0) {
        if (row !== 0) {
          column = 4
          row--
        }
      } else {
        column--
      }

      let nextInput = document.querySelector(`#r${row}-c${column}`)
      markLetter(oldLetter, false)
      modifyInput(textInput, '', row, column)
      nextInput.focus()
      return
    } 
    

    
    
      
    if (!/^[A-Za-z]*$/g.test(textInput.value)) {                  //if an invalid character has been entered
      markLetter(oldLetter, false)
      modifyInput(textInput, '', row, column)                     //set to nothing
      // focus next input

      return
    }

    // if the new letter is taken dont allow change
    if (checkIfTaken(newLetter)) return modifyInput(textInput, oldLetter, row, column)                     //set to nothing


    // new letter not taken
    // if old letter is marked unmark
    markLetter(oldLetter, false)

    //set input
    modifyInput(textInput, newLetter, row, column)
}

let markLetter = (letter, toMark = true) => {
  if (!letter) return ""
  letter = letter.toUpperCase()
  //special case I and J  -  set J to I
  letter = letter == 'J' ? 'I' : letter
  takenLetters[letter] = toMark
  return letter
}

let checkIfTaken = (letter) => {
  if(!letter) return false
  letter = letter.toUpperCase()
  //special case I and J -  set J to I
  letter = letter == 'J' ? 'I' : letter
  return !!takenLetters[letter] 
}

let modifyInput = (textInputReference, newValue, row, column) =>{
  newValue = markLetter(newValue)
  textInputReference.value =  newValue
  playfairMatrix[row][column] = newValue
  if (newValue != '') focusNextInput(row, column)
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

const focusNextInput = (row, column) => {
  //find one forward
  if (column === 4) {
    if (row !== 4) {
      column = 0
      row++
    }
  } else {
    column++
  }
  console.log(`Focusing, nextinput ${`#r${row}-c${column}`}`)

  let nextInput = document.querySelector(`#r${row}-c${column}`)
  nextInput.focus()
}





// **************** TEXT INPUT ****************

const changeToBiGrams = (string) => {
    //remove all spaces and non alpha characters > replace all J or j with i > make uppercase > Replace repeating characters with X 
    string = string.replace(/\s+|[^a-zA-Z]+/g, '').replace(/[jJ]/g, 'i').toUpperCase().replace(/(.)(\1+)/g, (match, p1, p2) => {
      return p1 + 'X'.repeat(p2.length)
    })
    // remove all repeated characters and replace with X
    
    // add spaces
    bigrams = ''
    string.split('').forEach( (letter, index) => {
      bigrams += letter
      if (index % 2 == 1 && index != string.length - 1) {
        bigrams += ' '
      }
    })
    return bigrams
}

const plaintextInputHandler = e => {
    let inputValue = e.target.value
    if (e.data != null) {
      // a single character was entered
      // check the last character entered
      // if theyre the same then make the new character an X
      inputValue = inputValue.replace(/(.)[X\s]*(.)$/g, (match, p1, p2) => {
        if (p1 == p2.toUpperCase()) {
          //they are the same change to X
          return match.slice(0, -1) + 'X'
        }
        // do nothing theyre not the same
        return match
      })
    }
    let bigramValue = changeToBiGrams(inputValue)
    e.target.value = bigramValue
}

const cyphertextInputHandler = e => {
  let inputValue = e.target.value
    if (e.data != null) {
      // a single character was entered
      // check the last character entered
      // if theyre the same then make the new character an X
      inputValue = inputValue.replace(/(.)[X\s]*(.)$/g, (match, p1, p2) => {
        if (p1 == p2.toUpperCase()) {
          //they are the same change to X
          return match.slice(0, -1) + 'X'
        }
        // do nothing theyre not the same
        return match
      })
    }
    let bigramValue = changeToBiGrams(inputValue)
    e.target.value = bigramValue
}



