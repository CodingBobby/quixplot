// const fs = require('fs')

// PLOTTING
let canvas = document.getElementById('main_plot')
let ctx = canvas.getContext('2d')
let plotFunction


function functionEvaluator(inputArgument, functionString) {
   return new Function(`${inputArgument}`, `return ${functionString}`)
}


function functionAnalyzer(string) {
   let independent, dependent, functionString

   

   return {
      independent: independent,
      dependent: dependent,
      function: functionEvaluator(independent, functionString)
   }
}


function submitFunction() {
   let form = document.getElementById('function_overlay')
   let functionString = form.elements['function'].value

   // remove spaces
   functionString = functionString.split(' ').join('')
   functionString = functionString.split('=')

   let independent, dependent

   if(functionString[0].length === 1) {
      dependent = functionString[0]
   }
   if(functionString[1].includes('x')) {
      independent = 'x'
   }

   plotFunction = functionEvaluator(independent, functionString[1])
   alert(dependent +' = '+ plotFunction(3))
}
