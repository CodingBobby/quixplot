const math = remote.getGlobal('math')

// document.getElementById('start_screen').style.display = 'none'

// Startup
let enterField = document.getElementById('function_enter')
let len = enterField.value.length
enterField.focus()
// jumping to end of pre-entered text
enterField.setSelectionRange(len, len)

let greet = document.getElementById('greeting_msg')
let opts = [
   'sin(x) + log(x+4)',
   'gamma(x)',
   '1/x * cos(1/x)',
   'nthRoot(x, 3)'
]

function pick(array) {
   return array[Math.floor(Math.random() * array.length)]
}

let thePick = pick(opts)

greet.append('Try f(x) = '+thePick)


function copyToForm() { // interting text to from when clicking on it
   enterField.value = 'f(x)='+thePick
   enterField.focus()
   len = enterField.value.length
   enterField.setSelectionRange(len, len)
}

// PLOTTING
let target = document.getElementById('main_plot')
let plotFunction

function functionAnalyzer(string) {
   let node = math.parse(string)
   let code = node.compile()

   let symbols = {
      all: [],
      variable: [],
      constant: []
   }

   function findSymbols(node, expr) {
      if(expr.args) {
         for(let i in expr.args) {
            let arg = expr.args[i]
            if(arg.hasOwnProperty('name')) { // SymbolNode
               symbols.all.push(arg.name)
               if(node.params.includes(arg.name)) { // variable
                  symbols.variable.push({
                     name: arg.name,
                     value: 0
                  })
               } else { // constant value
                  symbols.constant.push({
                     name: arg.name,
                     value: 1
                  })
               }
            } else { // OperatorNode
               findSymbols(node, arg)
            }
         }
      }
   }

   findSymbols(node, node.expr)

   let scope = {}
   for(let c in symbols.constant) {
      let constant = symbols.constant[c]
      scope[constant.name] = constant.value
   }

   return code.evaluate(scope) // can be executed later
}

function submitFunction() {
   let form = document.getElementById('function_overlay')
   let functionString = form.elements['function'].value

   plotFunction = functionAnalyzer(functionString)

   // hide the overlay and show plot
   document.getElementById('start_screen').style.display = 'none'
   target.style.display = 'block'

   plotOnCanvas()
}

function plotOnCanvas() {
   let func = function(scope) {
      let x = scope.x
      return plotFunction(x)
   }

   functionPlot({
      target: target,
      width: target.clientWidth,
      height: target.clientHeight,
      grid: true,
      data: [{
         graphType: 'polyline',
         fn: func
      }]
   })
}
