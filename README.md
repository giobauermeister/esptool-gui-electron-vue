# OSRR Flash Utility

Update your OSRR with ease!

![app screenshot](https://raw.githubusercontent.com/FreeSK8/OSRR-Flash-Utility/master/src/assets/app-demo.gif)

A cross platform app built with [Electron](https://www.electronjs.org/)

## System requirements
- [Python](https://www.python.org/downloads/) with [pyserial](https://pyserial.readthedocs.io/en/latest/pyserial.html#installation)

## Instructions

* Plug in your OSRR
* Click the `Scan Ports` button and select a `COM port`
* (Optional) Click `Browse` to select a custom firmware file
* Click `Flash` and hold the power button on your OSRR until complete

## Electron Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Reference
### Electron inter process communication tutorial
https://www.tutorialspoint.com/electron/electron_inter_process_communication.htm
### run Python script from nodejs
https://ourcodeworld.com/articles/read/286/how-to-execute-a-python-script-and-retrieve-output-data-and-errors-in-node-js
### readline module for parsing stdout stream line by line
https://html.developreference.com/article/21696559/NodeJS+spawn+stdout+string+format
https://www.w3schools.com/nodejs/ref_readline.asp
