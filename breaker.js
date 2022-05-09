

/**
 * Compute Biletter frequencies from provided text
 * 
 * @param {String} text
 * @returns {Map} 
 * @returns {Number}  
 */
 const computeBiLetterFrequencies = (text) => {
    
    //initialize frequencies map to 0 for all possible letter pairs
    let frequencies_map = {}
    for (let i = 0; i < 26; i++) {
        //skip j
        if (i == 9) continue
        for (let k = 0; k < 26; k++) {
            //skip j
            if (k == 9) continue
            let letterPair = `${String.fromCharCode(65 + i)}${String.fromCharCode(65 + k)}`
            frequencies_map[letterPair] = 0
        }
    }
    // remove all non alpha from text
    text = text.replace(/[^A-Za-z]/g, '')
  
    // Count the number of characters processed
    let count = 0
  
    // Compute frequencies on all pairs of letters
    for (let i = 0; i < text.length - 1; i++ ){
        let letterPair = text[i] + text[i + 1]
        frequencies_map[letterPair]++
        count++
    }
    
    //return frequency mapping and count in array destructuring format
    return [frequencies_map, count]
  
  }
  
  
  /**
  * Transforms a frequency map into what would be expected by a playfair cypher
  * 
  * @param {Map} frequencies_map 
  * @param {Char[][]} playfairMatrix 
  */
  const encodeFrequencyMap = frequencies_map => {
  
    let encoded_frequencies_map = {}
    // Iterate through all keys
    for (let key of Object.keys(frequencies_map)) {
        // transform the key
        let encodedKey = codeBigram(key, true)
        encoded_frequencies_map[encodedKey] = frequencies_map[key]
    }
    // return encoded map 
    return encoded_frequencies_map
  }
  
  
  /**
  * Computes the critical value between a chisquared statistc and population statistic
  * 
  * @param {*} populationFrequency 
  * @param {*} populationSize 
  * @param {*} empiricalFrequency 
  * @param {*} empiricalSize 
  * @returns 
  */
  const frequencyChiSquaredTest = (populationFrequency, populationSize, empiricalFrequency, empiricalSize) => {
    // Accumulate all chisquared values
    let criticalValue = 0
    // calculate for each biletter
    for (let key of Object.keys(populationFrequency)) {
        // Calculate population probabilty of key
        let populationKeyProbability = populationFrequency[key] / populationSize
        // calculate expected count based on empirical size
        let expectedCount = populationKeyProbability * empiricalSize + 1
        // retrieve empirical value
        let empiricalCount = empiricalFrequency[key] ?? 0
        // sum chi-squared statistic for this key
        console.log(populationKeyProbability, expectedCount, empiricalCount)

        criticalValue +=  (( empiricalCount - expectedCount )**3 ) / expectedCount  

    }   
    // If we need to compute the p value refer to this website
    // degrees of freedom should be 624
    // chisquared asymptotically aproximates the normal distribution for larges degrees of freedom
  
    //for now return the Critical Value
    return criticalValue
  }