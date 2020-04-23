'use strict'
var path = require('path')

const {ipcMain} = require('electron')
const { spawn } = require('child_process');
//import {PythonShell} from 'python-shell';

import { app, protocol, BrowserWindow } from 'electron'
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ 
    width: 600, 
    height: 450,
    icon: path.join(__dirname, 'build/flash.png'),
    resizable: true,
    useContentSize: true,
    title: "ESP32 Flasher esptool.py GUI", 
    webPreferences: {
      nodeIntegration: true,
      devTools: false
  } })
  win.setMenu(null);
  win.on('page-title-updated', function(e) {
    e.preventDefault()   
  });


  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow()
})

// Event handler for asynchronous incoming messages
ipcMain.on('cmdLineArgs', (event, cmdLineArgs) => {
  console.log("Baudrate: " + cmdLineArgs.baudrate);
  console.log("ComPort: " + cmdLineArgs.comPort);
  const python = spawn('esptool.py', ['-b', cmdLineArgs.baudrate, '-p', cmdLineArgs.comPort, 'read_mac']);
  
  var stdoutChunks = [], stderrChunks = [];
  python.stdout.on('data', (data) => {
    stdoutChunks = stdoutChunks.concat(data);
  });
  python.stdout.on('end', () => {
      var stdoutContent = Buffer.concat(stdoutChunks).toString();
      console.log('stdout chars:', stdoutContent.length);
      console.log(stdoutContent);
      if(stdoutContent.length > 0) event.sender.send('esptool-output', stdoutContent);
  });
  
  python.stderr.on('data', (data) => {
    stderrChunks = stderrChunks.concat(data);
  });
  python.stderr.on('end', () => {
      var stderrContent = Buffer.concat(stderrChunks).toString();
      console.log('stderr chars:', stderrContent.length);
      console.log(stderrContent);
      event.sender.send('esptool-error', stderrContent);
  });

  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
  });

  python.on('exit', (code) => {
    console.log('Process exited with code', code)
    event.sender.send('esptool-error-code', code);
  });
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
