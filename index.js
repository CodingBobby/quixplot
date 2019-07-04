// const fs = require('fs')

// PLOTTING
let canvas = document.getElementById('main_plot')
let ctx = canvas.getContext('2d')
let plotFunction


function functionEvaluator(inputArgument, functionString) {
   return new Function(`${inputArgument}`, `return ${functionString}`)
}


function functionAnalyzer(string) {
   let independent, dependent, fString

   // removing spaces and split at equality signs
   fString = string.split(' ').join('')
   fString = fString.split('=')

   // checking how many equals are in it
   if(fString.length === 1) { // indirect declaration
      // lets see if we have an x symbol
      if(fString[0].includes('x')) {
         independent = 'x'
         dependent = 'y'
         fString = fString[0]
      } else {
         independent = ''
      }
   } else if(fString.length === 2) { // direct declaration
      // find the dependent side
      if(fString[0] == 'y') {
         dependent = 'y'
         if(fString[1].includes('x')) {
            independent = 'x'
            fString = fString[1]
         }
      } else if(fString[1] == 'y') {
         dependent = 'y'
         if(fString[0].includes('x')) {
            independent = 'x'
            fString = fString[0]
         }
      }
   } else { // invalid as string includes more than 1 equal
      alert('error')
   }

   // alert(fString)

   return {
      independent: independent,
      dependent: dependent,
      function: functionEvaluator(independent, fString)
   }
}


function submitFunction() {
   let form = document.getElementById('function_overlay')
   let functionString = form.elements['function'].value

   let plotFunction = functionAnalyzer(functionString)
}
