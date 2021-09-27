'use strict'
var path = require('path')
var readline = require('readline');

const {ipcMain} = require('electron')
const { spawn } = require('child_process');
//import {PythonShell} from 'python-shell';

const { dialog } = require('electron')

import scanSerialPorts from './components/scan_serial_ports'

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
    width: 800, 
    height: 420,
    icon: path.join(__dirname, 'build/flash.png'),
    resizable: false,
    useContentSize: true,
    title: "OSRR Flash Utility", 
    webPreferences: {
      nodeIntegration: true,
      devTools: false
  } })
  win.setMenu(null);
  win.on('page-title-updated', function(e) {
    scanSerialPorts(win)
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

ipcMain.on('scan-com-ports', (event) => {
  scanSerialPorts(win)
})

var firmwareFilePath, webpageFilePath;
ipcMain.on('selectBinaryPath_1', (event, args) => {
  console.log(args);
  console.log(dialog.showOpenDialog({ filters: [{ name: 'Binary file', extensions: ['bin'] }], properties: ['openFile'] }, function(files) {
    //firmwareFilePath = files[0];
    //console.log(files[0]);
    //event.sender.send('binaryPath_1', files[0]);
  }).then(
    function(result) {
     console.log(result);
     if (result['canceled'] == false) {
      event.sender.send('binaryPath_1', result['filePaths'][0]);
     }
  }
  ));
})
ipcMain.on('selectBinaryPath_2', (event, args) => {
  console.log(args);
  console.log(dialog.showOpenDialog({ filters: [{ name: 'Binary file', extensions: ['bin'] }], properties: ['openFile'] }, function(files) {
    webpageFilePath = files[0];
    console.log(files[0]);
    event.sender.send('binaryPath_2', files[0]);
  }));  
})
ipcMain.on('selectBinaryPath_3', (event, args) => {
  console.log(args);
  console.log(dialog.showOpenDialog({ filters: [{ name: 'Binary file', extensions: ['bin'] }], properties: ['openFile'] }, function(files) {}).then(
    function(result) {
     console.log(result);
     if (result['canceled'] == false) {
      event.sender.send('binaryPath_3', result['filePaths'][0]);
     }
  }
  ));
})
ipcMain.on('selectBinaryPath_4', (event, args) => {
  console.log(args);
  console.log(dialog.showOpenDialog({ filters: [{ name: 'Binary file', extensions: ['bin'] }], properties: ['openFile'] }, function(files) {
    webpageFilePath = files[0];
    console.log(files[0]);
    event.sender.send('binaryPath_4', files[0]);
  }));  
})
ipcMain.on('selectBinaryPath_5', (event, args) => {
  console.log(args);
  console.log(dialog.showOpenDialog({ filters: [{ name: 'Binary file', extensions: ['bin'] }], properties: ['openFile'] }, function(files) {
    webpageFilePath = files[0];
    console.log(files[0]);
    event.sender.send('binaryPath_5', files[0]);
  }));  
})

// Event handler for asynchronous incoming messages
ipcMain.on('test-esptool-connection', (event, cmdLineArgs) => {
  console.log("Baudrate: " + cmdLineArgs.baudrate);
  console.log("ComPort: " + cmdLineArgs.comPort);
  const python = spawn('esptool.py', ['-b', cmdLineArgs.baudrate, '-p', cmdLineArgs.comPort, 'read_mac']);

  readline.createInterface({
    input : python.stdout,
    terminal : false
    }).on('line', function(line) {
      console.log("LOG READLINE stdout: ");      
      console.log(line);
      event.sender.send('line-esptool-output', line + '\n');
    }).on('close', function() {
      console.log("LOG READLINE stdout CLOSE");
  });

  readline.createInterface({
    input : python.stderr,
    terminal : false
    }).on('line', function(line) {
      console.log("LOG READLINE stderr: ");
      console.log(line);
      event.sender.send('line-esptool-output', line + '\n');
    }).on('close', function() {
      console.log("LOG READLINE stderr CLOSE");
  });
  
  var stdoutChunks = [], stderrChunks = [];
  python.stdout.on('data', (data) => {
    stdoutChunks = stdoutChunks.concat(data);
  });
  python.stdout.on('end', () => {
      var stdoutContent = Buffer.concat(stdoutChunks).toString();
      //console.log('stdout chars:', stdoutContent.length);
      //console.log(stdoutContent);
      if(stdoutContent.length > 0) event.sender.send('esptool-output', stdoutContent);
  });
  
  python.stderr.on('data', (data) => {
    stderrChunks = stderrChunks.concat(data);
  });
  python.stderr.on('end', () => {
      var stderrContent = Buffer.concat(stderrChunks).toString();
      //console.log('stderr chars:', stderrContent.length);
      //console.log(stderrContent);
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

// Event handler for asynchronous incoming messages
ipcMain.on('start-esptool-flash', (event, cmdLineArgs) => {
  if (cmdLineArgs.binaryPath_3 == "/Included_firmware.bin") {
    cmdLineArgs.binaryPath_3 = path.join(process.resourcesPath, 'firmware/', 'osrr.bin');
  }
  console.log("start-esptool-flash::flashAll? " + cmdLineArgs.flashAll);
  if (cmdLineArgs.flashAll) {
    cmdLineArgs.binaryPath_1 = path.join(process.resourcesPath, 'firmware/', 'bootloader.bin');
    cmdLineArgs.binaryPath_2 = path.join(process.resourcesPath, 'firmware/', 'partition-table.bin');
    cmdLineArgs.binaryPath_4 = path.join(process.resourcesPath, 'firmware/', 'storage.bin');
  } else {

  }
  console.log('\n\n');
  console.log("Baudrate: " + cmdLineArgs.baudrate);
  console.log("ComPort: " + cmdLineArgs.comPort);
  console.log("File 1: " + cmdLineArgs.binaryPath_1 + " at: " + cmdLineArgs.binaryAddress_1);
  console.log("File 2: " + cmdLineArgs.binaryPath_2 + " at: " + cmdLineArgs.binaryAddress_2);
  console.log("File 3: " + cmdLineArgs.binaryPath_3 + " at: " + cmdLineArgs.binaryAddress_3);
  console.log("File 4: " + cmdLineArgs.binaryPath_4 + " at: " + cmdLineArgs.binaryAddress_4);
  console.log('\n\n');

  var esptoolOptions;
  var numberOfBinaries = 0;
  esptoolOptions = [
    path.join(process.resourcesPath, 'firmware', 'esptool.py'),
    '-b', cmdLineArgs.baudrate, '-p', cmdLineArgs.comPort, 'write_flash'];

  if(cmdLineArgs.flashAll == true) {
    esptoolOptions.push(cmdLineArgs.binaryAddress_1, cmdLineArgs.binaryPath_1);
    numberOfBinaries++;
  }
  if(cmdLineArgs.flashAll == true) {
    esptoolOptions.push(cmdLineArgs.binaryAddress_2, cmdLineArgs.binaryPath_2);
    numberOfBinaries++;
  }

  // Always include firmware file
  esptoolOptions.push(cmdLineArgs.binaryAddress_3, cmdLineArgs.binaryPath_3);
  numberOfBinaries++;

  if(cmdLineArgs.flashAll == true) {
    esptoolOptions.push(cmdLineArgs.binaryAddress_4, cmdLineArgs.binaryPath_4);
    numberOfBinaries++;
  }
  
  console.log(esptoolOptions);  

  console.log(process.resourcesPath);

  const python = spawn('python', esptoolOptions);
  
  var progressCounter = 0;
  readline.createInterface({
    input : python.stdout,
    terminal : false
    }).on('line', function(line) {
      console.log("LOG READLINE stdout: ");      
      console.log(line);
      event.sender.send('line-esptool-output', line + '\n');
      event.sender.send('progress-bar', progressCounter++/numberOfBinaries);
      console.log("number of lines: " + progressCounter);      
    }).on('close', function() {
      console.log("LOG READLINE stdout CLOSE");
  });

  readline.createInterface({
    input : python.stderr,
    terminal : false
    }).on('line', function(line) {
      console.log("LOG READLINE stderr: ");
      console.log(line);
      event.sender.send('line-esptool-error', line + '\n');
    }).on('close', function() {
      console.log("LOG READLINE stderr CLOSE");
  });  

  var stdoutChunks = [], stderrChunks = [];
  python.stdout.on('data', (data) => {
    stdoutChunks = stdoutChunks.concat(data);
  });
  python.stdout.on('end', () => {
      var stdoutContent = Buffer.concat(stdoutChunks).toString();
      //console.log('stdout chars:', stdoutContent.length);
      //console.log(stdoutContent);
      if(stdoutContent.length > 0) event.sender.send('esptool-output', stdoutContent);
  });
  
  python.stderr.on('data', (data) => {
    stderrChunks = stderrChunks.concat(data);
  });
  python.stderr.on('end', () => {
      var stderrContent = Buffer.concat(stderrChunks).toString();
      //console.log('stderr chars:', stderrContent.length);
      //console.log(stderrContent);
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
