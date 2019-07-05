const math = remote.getGlobal('math')

document.getElementById('start_screen').style.display = 'none'

// PLOTTING
// let canvas = document.getElementById('main_plot')
// let ctx = canvas.getContext('2d')
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

   // hide the overlay
   document.getElementById('start_screen').style.display = 'none'

   plotOnCanvas()
}

function plotOnCanvas() {
   let data = [{
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      mode: 'lines',
      line: {
         dash: 'solid',
         width: 1
      }
   }]

   let layout = {
      xaxis: {
         range: [-1, 1],
         autorange: false
      },
      yaxis: {
         range: [-1, 1],
         autorange: false
      },
      margin: {
         l: 30,
         r: 30,
         t: 30,
         b: 30
      },
      paper_bgcolor: '#f2f2f2',
      plot_bgcolor: '#f2f2f2'
   }

   let options = {
      displayModeBar: true,
      showSendToCloud: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['autoScale']
   }

   Plotly.newPlot('main_plot', data, layout, options)
}

plotOnCanvas()
