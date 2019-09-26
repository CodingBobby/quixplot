const math = remote.getGlobal('math')

// Startup
let enterField = document.getElementById('function_enter')
let len = enterField.value.length
enterField.focus()
// jumping to end of pre-entered text
enterField.setSelectionRange(len, len)

let startScreen = document.getElementById('start_screen')
let mainContent = document.getElementById('main_content')

let greet = document.getElementById('greeting_msg')
let opts = [
   'sin(x) + log(x+a)',
   '1/a * gamma(x)',
   '1/a * cos(1/x)',
   '1/a * cos(1/x) - sin(x/b)',
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
let functionString
let functionLatex
let plotFunction
let symbols = {
   all: [],
   variable: [],
   constant: []
}
let scope = {}

function updateScope() {
   for(let c in symbols.constant) {
      let constant = symbols.constant[c]
      scope[constant.name] = constant.value
   }
}

function pickNext(syms) {
   let available = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
   for(let s in syms) {
      available =  available.filter(a => a !== syms[s])
   }
   return available[0] || '_'
}

function functionAnalyzer(string) {
   let node = math.parse(string)
   let code = node.compile()

   functionLatex = node.toTex()

   function findSymbols(node, expr) {
      if(expr.args) {
         for(let i in expr.args) {
            let arg = expr.args[i]
            if(!arg.hasOwnProperty('args') && arg.name !== undefined) { // SymbolNode
               if(!symbols.all.includes(arg.name)) {
                  let name = arg.name //|| pickNext(symbols.all)
                  symbols.all.push(name)
                  if(node.params.includes(name)) { // variable
                     symbols.variable.push({
                        name: name,
                        value: 0
                     })
                  } else { // constant value
                     symbols.constant.push({
                        name: name,
                        value: arg.value || 1
                     })

                  }
               }
            } else { // OperatorNode
               findSymbols(node, arg)
            }
         }
      }
   }

   findSymbols(node, node.expr)

   updateScope()

   return code.evaluate(scope) // can be executed later
}

function submitFunction() {
   let form = document.getElementById('function_overlay')
   functionString = form.elements['function'].value

   // hide the overlay and show plot
   startScreen.style.display = 'none'
   mainContent.style.display = 'grid'
   let constantarea = document.getElementById('constant_definition')


   constantarea.innerHTML = ''

   plotOnCanvas()

   for(let c in symbols.constant) {
      let cs = symbols.constant[c]
      let newslider = document.createElement(`ul`)
      newslider.className = 'changer'
      newslider.id = `${cs.name}_constant_changer`
      newslider.innerHTML = `<h5>${cs.name}:</h5><input type="text" value="${cs.value}">`
      constantarea.appendChild(newslider)
   }

   if(symbols.constant.length === 0) {
      let placeholder = document.createElement('div')
      placeholder.className = 'placeholder'
      placeholder.innerHTML = 'no constants in function'
      constantarea.appendChild(placeholder)
   } 

   $('.changer input').each(function() {
      let elem = $(this)
      // extracting constant name from id
      let elem_id = elem.parent()[0].id
      elem_id = elem_id.replace('_constant_changer', '')

      // saving current value and constant's name as property
      elem.data('oldVal', math.evaluate(elem.val()))
      elem.data('constName', elem_id)
   
      // looking for events inside the text field
      elem.bind("propertychange change click input paste", function(event) {
         // if value has changed
         if(elem.data('oldVal') != math.evaluate(elem.val())) {
            let newval = elem.val() !== '' ? math.evaluate(elem.val()).toString().replace(' ', '') : 1
            elem.data('oldVal', newval)
            symbols.constant.filter(s => s.name == elem.data('constName'))[0].value = newval

            plotOnCanvas()
         }
      })
   })

   // adding a new box with the function
   let fbox = document.getElementById('function_box')
   fbox.innerHTML = ''

   let fboxp = document.createElement('p')
   fboxp.innerHTML = '$$'+functionLatex+'$$'
   fbox.appendChild(fboxp)
   
   // reloading MathJax
   MathJax.Hub.Queue(["Typeset",MathJax.Hub])
}

function plotOnCanvas() {
   plotFunction = functionAnalyzer(functionString)

   // ORIGINAL FUNCTION
   let func = function(scope) {
      let x = scope.x
      return plotFunction(x)
   }

   // ORIGINAL DATA
   let data = []
   let range = [-20, 20]
   let t = 0.1

   for(let x=range[0]; x<range[1]; x+=t) {
      data.push([x, plotFunction(x)])
   }

   // DERIVATION DATA
   let deriData = []

   function derivate(p, q) {
      return (q[1]-p[1])/(q[0]-p[0])
   }

   for(let x=range[0]; x<range[1]; x+=t) {
      deriData.push([x, derivate([x, plotFunction(x)], [x+t, plotFunction(x+t)])])
   }

   // DERIVATION FUNCTION
   let interFunc = d3.scale.linear()
      .domain(deriData.map(d => d[0]))
      .range(deriData.map(d => d[1]))

   let deriFunc = function(scope) {
      let x = scope.x
      return interFunc(x)
   }


   functionPlot({
      target: target,
      width: target.clientWidth,
      height: target.clientHeight,
      grid: true,
      data: [{
      //    graphType: 'scatter',
      //    fnType: 'points',
      //    points: data
      // }, {
      //    graphType: 'scatter',
      //    fnType: 'points',
      //    points: deriData
      // }, {
         graphType: 'polyline',
         fnType: 'linear',
         fn: func
      }, {
         graphType: 'polyline',
         fnType: 'linear',
         fn: deriFunc
      }]
   })
}


function toOverlay() {
   startScreen.style.display = 'grid'
   mainContent.style.display = 'none'
}

function openDonate() {
   let shell = remote.getGlobal('shell')
   shell.openExternal('https://paypal.me/CodingBobby')
}
