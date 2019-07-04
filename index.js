const fs = require('fs')

function newFile() {
   fs.writeFile('undefined.cvs', '', err => {
      if(err) return console.error(err)
      let pop = new Popup(template.newFile)
      pop.show()
   })
}

function testAlert(text) {
   alert(text)
}

const template = {
   newFile: {
      type: 'note',
      title: 'New file created.'
   }
}

class Popup {
   constructor(temp) {
      this.options = temp
   }

   show() {
      switch(this.options.type) {
         case 'small': {
            break
         }
         case 'full': {
            break
         }
         case 'note': {
            let pop = document.createElement('div')
            pop.innerHTML = `<h5>${this.options.title}</h5>`
            document.getElementById('content').appendChild(pop)
            break
         }
      }
   }
}
