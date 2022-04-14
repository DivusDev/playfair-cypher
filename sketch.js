

//constants
const  MATRIX_SIZE  = 5

//Global variables 



//create a 5x5 matrix
let playfairMatrix = new Array( MATRIX_SIZE ).fill(0).map( v => new Array( MATRIX_SIZE ).fill(''))
let takenLetters = {}
//initialize letters
for (let i = 0; i < 26; i++) {
  if (i == 9) continue      //special case we skip j
  let c = String.fromCharCode( i + 97)
  takenLetters[c] = false
}
//display variables
let plaintext = ''
let cyphertext = ''

//encoding variables
let positionMap = {}



//Executed only once
function setup() {
  //stops default canvas from spawning
  noCanvas();

  //create the input matrix and assign input handlers
  let table = createElement('table')
  table.id ('matrix-table' )
  table.parent('table-container')
  for (let i = 0; i <  MATRIX_SIZE ; i++) {
    let row = createElement('tr')
    row.id(`row${i}`)
    row.parent('matrix-table')
    for (let k = 0; k <  MATRIX_SIZE ; k++) {
      let cell = createElement('td')
      cell.id(`cell${i} ${k}`)
      cell.parent(`row${i}`)
      let textInput = createElement('input')
      textInput.parent(`cell${i} ${k}`)
      textInput.class('matrix-input')
      textInput.id(`r${i}-c${k}`)

      textInput.input(playfairMatrixInput)
      //detect backspace
      textInput.elt.addEventListener('keydown', (event) => {
        const {key} = event
        //hacky solution to wait for p5js update event - in retrospect I should have just done this in vanilla js
        setTimeout(() => {
          if (key === 'Backspace' || key === 'Delete') {
            focusPreviousInput(i, k)
          }
        }, 10)
    })
    }
  }

  
  let fillButton = select('#random-button')                   //assign fill button functionality
  fillButton.mousePressed(randomizePlayfairMatrix)
  let eraseButton = select('#erase-button')                   //assign erase button functionality
  eraseButton.mousePressed(erasePlayfairMatrix)
  let encodeButton = select('#encode-plaintext')                   //assign encode button functionality
  encodeButton.mousePressed(encodeButtonHandler)
  let decodeButton = select('#decode-cyphertext')                   //assign decode button functionality
  decodeButton.mousePressed(decodeButtonHandler)
  let randomPlaintextButton = select('#random-plaintext')                   //assign decode button functionality
  randomPlaintextButton.mousePressed(setRandomPlaintext)
  
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

// Called when a character is inputed or deleted from any of the playfair matrix cells
let playfairMatrixInput = (e) => {
  
    //reference input cell
    let textInput = e.target

    //**** EDGE CASES ****

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
      markLetter(oldLetter, false)
      modifyInput(textInput, '', row, column)
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

/**
 * Mark a letter as used
 */
let markLetter = (letter, toMark = true) => {
  if (!letter) return ""
  letter = letter.toUpperCase()
  //special case I and J  -  set J to I
  letter = letter == 'J' ? 'I' : letter
  takenLetters[letter] = toMark
  return letter
}

/**
 * return a boolean of whether the letter has been used or not
 */
let checkIfTaken = (letter) => {
  if(!letter) return false
  letter = letter.toUpperCase()
  //special case I and J -  set J to I
  letter = letter == 'J' ? 'I' : letter
  return !!takenLetters[letter] 
}

/**
 * update the backend playfair matrix > change the input value to reflect the change >
 * mark the new value as taken > focus user input to the next matrix cell
 */
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

  for (let row = 0; row <  MATRIX_SIZE ; row++) {
    for (let col = 0; col <  MATRIX_SIZE ; col++) {
      let input = document.querySelector(`#r${row}-c${col}`)
      modifyInput(input, '', row, col)
    }
  }
}


/**
 * Set the playfair matrix to completely random values
 */
let randomizePlayfairMatrix = () => {
  let lettersToUse = []

  
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
  for (let row = 0; row <  MATRIX_SIZE ; row++) {
    for (let col = 0; col <  MATRIX_SIZE ; col++) {
      if (playfairMatrix[row][col] != '') continue
      let input = document.querySelector(`#r${row}-c${col}`)
      modifyInput(input, lettersToUse[i], row, col)
      i++;
    }
  }
}

/**
 * set input focus to next box in the matrix
 */
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
  let nextInput = document.querySelector(`#r${row}-c${column}`)
  nextInput.focus()
}

/**
 * set input focus to previous box in the matrix
 */
const focusPreviousInput = (row, column) => {
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
      nextInput.focus()
}




// **************** TEXT INPUT/DISPLAY ****************

/**
 * Makes a string into space-seperated bigrams of all uppercase alpha characters, with repeated letters seperated by an X ex AAA -> AX AX A
 * 
 * @param {string} string 
 * @returns 
 */
const changeToBiGrams = (string) => {
    //remove all spaces and non alpha characters > replace all J or j with i > make uppercase > Replace repeating characters with X 
    string = string.replace(/\s+|[^a-zA-Z]+/g, '').replace(/[jJ]/g, 'i').toUpperCase().replace(/(.)(\1+)/g, (match, p1, p2) => {
      return p1 + `X${p1}`.repeat(p2.length)
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

//called when text is entered into the plaintext box
const plaintextInputHandler = e => {
    let inputValue = e.target.value
    if (e.data != null) {
      // a single character was entered
      // check the last character entered
      // if theyre the same then make the new character an X
      inputValue = inputValue.replace(/(.)[X\s]*(.)$/g, (match, p1, p2) => {
        if (p1 == p2.toUpperCase()) {
          //they are the same change to X
          return match.slice(0, -1) + 'X' + p1
        }
        // do nothing theyre not the same
        return match
      })
    }
    let bigramValue = changeToBiGrams(inputValue)
    e.target.value = bigramValue
    plaintext = bigramValue
}

//called when text is entered into the cypher text box
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
    cyphertext = bigramValue
}

const setRandomPlaintext = () => {
  const plaintextInput = select('#plaintext')
  let text = randomPlaintexts[Math.floor(Math.random() * randomPlaintexts.length ) ]
  let bigramsText = changeToBiGrams(text)
  plaintextInput.elt.value = bigramsText
  plaintext = bigramsText
}


// **************** ENCODING/DECODING ****************

/**
 * takes two characters and returns the encoded version
 * 
 * @param {string} string
 * @param {boolean} encoding
 * @returns {string}
 */
const codeBigram = (string, encoding) => {

  //edge cases
  if (string.length < 2) return string
  if (string.length > 2) throw 'Must pass a string with length < 2 to codeBigram'
  let a = string[0]
  let b = string[1]
  if (encoding === undefined) throw 'Must specifiy whether encoding or decoding in codeBigram'
  let [aRow, aCol] = positionMap[a]
  let [bRow, bCol] = positionMap[b]

  const offset = encoding ? 1 : -1;

  //check to see if same column or same row
  if (aRow === bRow) {
    //same row > shift letters to the right
    aCol = ( aCol + offset + MATRIX_SIZE ) %  MATRIX_SIZE 
    bCol = ( bCol + offset + MATRIX_SIZE ) %  MATRIX_SIZE 
  } else if ( aCol === bCol) {
    //same col > shift letters down
    aRow = ( aRow + offset + MATRIX_SIZE ) %  MATRIX_SIZE 
    bRow = ( bRow + offset + MATRIX_SIZE ) %  MATRIX_SIZE 
  } else {
    //swap columns for each other
    let temp = aCol
    aCol = bCol
    bCol = temp
  }
  let aCoded = playfairMatrix[aRow][aCol]
  let bCoded = playfairMatrix[bRow][bCol]
  return aCoded + bCoded

}

/**
 * Take a string as an arguement and return a either encoded or decoded version of that bigram string
 * Assumes playfairMatrix and positionMap is Set 
 * 
 * @param {string} string 
 * @param {boolean} encoding 
 * @returns {string}
 */
const codeMessage = (string, encoding) => {
  let bigrams = string.split(' ')
  let codedBigrams = bigrams.map(b => codeBigram(b, encoding))
  let codedString = codedBigrams.join(' ')

  return codedString
}

/**
 * Sets positionMap global variable to have maps to the row and column for each unique letter
 */
const setPositionMap = () => {
  //iterate through the playfair matrix and fill out the positionMap global variable
  for ( let r  = 0; r <  MATRIX_SIZE ; r++ ) {
    for ( let c = 0; c < MATRIX_SIZE; c++ ) {
      let cellValue = playfairMatrix[r][c]
      if (cellValue === '') throw `Matrix not full, cannot make position map, threw at position (${r}, ${c})`
      positionMap[cellValue] = [r,c]
    }
  }
}

//called when encode button is pressed
const encodeButtonHandler = e => {
  setPositionMap()
  cyphertext = codeMessage(plaintext, true)
  let cyphertextInput = select('#cyphertext')

  cyphertextInput.elt.value = cyphertext
}
 

//called when decode button is pressed
const decodeButtonHandler = e => {
  setPositionMap()
  plaintext = codeMessage(cyphertext, false)
  let plaintextInput = select('#plaintext')
  plaintextInput.elt.value = plaintext
}
 




