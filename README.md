# esptool-vue-electron-gui

![app screenshot](https://raw.githubusercontent.com/giobauermeister/esptool-vue-electron-gui/master/build/esptoolgui.png)

## System requirements
- Python installed
- [esptool.py](https://github.com/espressif/esptool)
- esptool.py configured in PATH

## Instructions for v0.1.0-beta
You should have two binaries in hand for flashing. This version demands both firmware and spiffs file to be in place as well as their memory address.

## ToDo
- add more fields for more than two binary files (partitions.bin, etc)
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
### run Python from nodejs
https://ourcodeworld.com/articles/read/286/how-to-execute-a-python-script-and-retrieve-output-data-and-errors-in-node-js
### test nodejs readline module for parsing stdout stream line by line
https://html.developreference.com/article/21696559/NodeJS+spawn+stdout+string+format
https://www.w3schools.com/nodejs/ref_readline.asp
