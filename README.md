# esptool.py GUI

Flash you ESP32 binaries in a flash!

A cross platform app built with [Electron](https://www.electronjs.org/)

![app screenshot](https://raw.githubusercontent.com/giobauermeister/esptool-vue-electron-gui/master/build/app-demonstration.gif)

## System requirements
- Python installed
- [esptool.py](https://github.com/espressif/esptool) installed
- esptool.py configured in PATH

## Instructions for v1.0.0
You can flash one firmware binary or up to 4 binary files.

## ToDo
- [DONE, needs more testing] add more fields for more than two binary files (partitions.bin, etc)
- clean log messages throughout application
- enable Advanced button for advanced configurations like flash mode, size, frequency and other options from [here](https://github.com/espressif/esptool/wiki/Advanced-Options). 


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
