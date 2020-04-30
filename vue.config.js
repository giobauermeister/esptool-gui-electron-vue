  module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          // options placed here will be merged with default configuration and passed to electron-builder
            "productName": "ESP32 Flasher esptool.py GUI",
            "appId": "com.bauertronix.esp32flasher",
            "win": {
                "target": ["portable"],
                "icon": "build/flash.ico"
            },
            "portable": {
                "artifactName": "esp32_flasher_esptool_${version}.exe"
            },
            // "directories": {
            //     "output": "electron/output",
            //     "app": "electron/app",
            //     "buildResources": "electron/buildResources"
            // }
        }
      }
    }
}