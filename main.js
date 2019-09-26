/**
 * QuixPlot
 */

console.time('init')

const electron = require('electron')
const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')
const math = require('mathjs')

global.math = math

// the electron items we need
const {
   app,
   BrowserWindow,
   Menu,
   shell
} = electron

global.shell = shell

// boolean checks that we need frequently
let darwin = process.platform == 'darwin'
process.env.NODE_ENV = 'production'

// instances we define later on but need to be accessible globally
let window = null

// here we set some options we need later
const windowOptions = {
   width: 900,
   height: darwin ? 650 : 675,
   resizable: false,
   useContentSize: true,
   titleBarStyle: 'hidden',
   backgroundColor: '#1C1C1C',
   title: 'QuixPlot',
   icon: darwin ? path.join(__dirname, 'assets/icons/app.icns')
      : path.join(__dirname, 'assets/icons/app.ico'),
   show: true,
   center: true,
   webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
   }
}

// here we create a template for the main menu,
// to get the right shortcut, we check if we're running on darwin
let menuTemplate = [{
   label: 'QuixPlot',
   submenu: [{
      label: 'New Function',
      accelerator: 'CmdOrCtrl+N',
      role: 'reload'
   }, {
      label: 'Hide QuixPlot',
      accelerator: darwin ? 'Command+H'
         : 'Ctrl+H',
      click() {
         app.hide()
      }
   }, {
      label: 'Quit QuixPlot',
      accelerator: darwin ? 'Command+Q'
         : 'Ctrl+Q',
      click() {
         app.quit()
      }
   }, {
      type: "separator"
   }, {
      label: 'About',
      click() {
         shell.openExternal('https://github.com/CodingBobby/quixplot')
      }
   }, {
      label: 'Donate',
      click() {
         shell.openExternal('https://paypal.me/CodingBobby')
      }
   }]
}, {
   label: 'Edit',
   submenu: [
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
   ]
}]

// if the app is in development mode, these menu items will be pushed
// to the menu template
if(process.env.NODE_ENV !== 'production') {
   menuTemplate.push({
      label: 'Dev Tools',
      submenu: [{
         label: 'Toggle Dev Tools',
         accelerator: darwin ? 'Command+I'
            : 'Ctrl+I',
         click(item, focusedWindow) {
            focusedWindow.toggleDevTools()
         }
      }, {
         label: 'Reload App',
         accelerator: darwin ? 'Command+R'
            : 'Ctrl+R',
         role: 'reload'
      }]
   })
}

const mainMenu = Menu.buildFromTemplate(menuTemplate)

// this function builds the app window, shows the correct pages
// and handles window.on() events
async function build() {
   window = new BrowserWindow(windowOptions)

   Menu.setApplicationMenu(mainMenu)

   window.loadFile('./index.html')

   // we have initialized everything important and log how long
   // it took, remember to remove it in release version
   console.timeEnd('init')

   // if the window gets closed, the app will quit
   window.on('closed', function() {
      win = null
   })

   window.on('restore', () => {
      window.focus()
   })
}

// here we finally build the app
app.on('ready', build)

// this quits the whole app
app.on('window-all-closed', () => {
	app.quit()
})
