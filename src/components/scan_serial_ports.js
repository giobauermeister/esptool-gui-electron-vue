const SerialPort = require('serialport')

export default async function scanSerialPorts (mainWindow) {
  var portList = await SerialPort.list()
  //console.log(portList)

  let validPorts = portList.filter((port) => {
    return port.manufacturer === 'FTDI' || port.manufacturer === 'Silicon Labs'
  })
  //console.log(validPorts)

  let result = [];
  for (var i=0; i < validPorts.length; ++i) {
    result.push({port:validPorts[i].path});
  }
  //console.log(result)

  mainWindow.webContents.send('validComPorts', result);
}
