const SerialPort = require('serialport')

export default function scanSerialPorts (mainWindow) {
  SerialPort.list((err, ports) => {
    if (err) {
      //mainWindow.webContents.send('ports-scanned', null)
      return
    }
console.log(ports);
    let validPorts = ports.filter((port) => {
      return port.manufacturer === 'FTDI' || port.manufacturer === 'Silicon Labs'
    })
    console.log(validPorts)
    //mainWindow.webContents.send('ports-scanned', validPorts)
  })
}
