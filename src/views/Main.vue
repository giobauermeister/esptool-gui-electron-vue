<template>
  <div class="home">
    <b-row>
      <b-col cols="7">
        <b-row no-gutters>
          <b-col>
            <div class="firmware-input">
              <b-input-group size="sm">
                <b-input-group-prepend>
                  <b-button v-on:click="selectFirmwareFilePath" variant="info">Browse</b-button>
                </b-input-group-prepend>
                <b-form-input
                  v-model="firmwareFile"
                  placeholder="Select firmware file"
                  :state="firmwareFileInputState"
                ></b-form-input>
              </b-input-group>
            </div>
          </b-col>
          <b-col cols="3">
            <div class="firmware-input-address">
              <b-form-input
                size="sm"
                placeholder="address"
                v-model="firmwareAddress"
                v-on:input="firmwareAddressInputState = null; firmwareFileInputState = null"
                :state="firmwareAddressInputState"
              ></b-form-input>
            </div>
          </b-col>
        </b-row>

        <b-row no-gutters>
          <b-col>
            <div class="webpage-input">
              <b-input-group size="sm">
                <b-input-group-prepend>
                  <b-button v-on:click="selectWebpageFilePath" variant="info">Browse</b-button>
                </b-input-group-prepend>
                <b-form-input
                  v-model="webpageFile"
                  placeholder="Select spiffs file"
                  :state="webpageFileInputState"
                ></b-form-input>
              </b-input-group>
            </div>
          </b-col>
          <b-col cols="3">
            <div class="webpage-input-address">
              <b-form-input
                size="sm"
                placeholder="address"
                v-model="webpageAddress"
                v-on:input="webpageAddressInputState = null; webpageFileInputState = null"
                :state="webpageAddressInputState"
              ></b-form-input>
            </div>
          </b-col>
        </b-row>

        <b-row no-gutters>
          <b-col cols="7">
            <div class="com-input">
              <b-input-group size="sm">
                <b-form-input v-model="comPort" :state="comPortInputState" placeholder></b-form-input>
                <template v-slot:prepend>
                  <b-dropdown size="sm" text="Select COM port" variant="info">
                    <b-dropdown-item
                      v-on:click="setComPort(item.port)"
                      v-bind:key="item.port"
                      v-for="item in comPortsList"
                    >{{ item.port }}</b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-input-group>
            </div>

            <div class="baud-input">
              <b-input-group size="sm">
                <b-form-input v-model="baudrateSpeed" :state="baudrateInputState" placeholder></b-form-input>
                <template v-slot:prepend>
                  <b-dropdown size="sm" text="Select baudrate" variant="info">
                    <b-dropdown-item
                      v-on:click="setBaudrate(baudrate.value)"
                      v-bind:key="baudrate.value"
                      v-for="baudrate in baudrateList"
                    >{{ baudrate.value }}</b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-input-group>
            </div>
          </b-col>
        </b-row>
      </b-col>

      <b-col>
        <div class="btn-test-connection">
          <b-button
            v-on:click="testConnection"
            style="width: 120px;"
            size="sm"
            variant="dark"
          >Test connection</b-button>
        </div>

        <div class="btn-flash">
          <b-button v-on:click="flash" style="width: 120px;" size="sm" variant="dark">Flash</b-button>
        </div>

        <div class="btn-advanced">
          <b-button
            v-on:click="showAdvanced"
            style="width: 120px;"
            size="sm"
            variant="dark"
          >Advanced</b-button>
        </div>
      </b-col>
    </b-row>

    <div class="flash-progress">
      <b-progress
        :value="flashProgressValue"
        variant="info"
        striped
        :animated="animate"
        class="mt-2"
      ></b-progress>
    </div>

    <div class="terminal-container">
      <div class="overlay">
        <div class="spinner-container">
          <div class="check-icon-container">
            <svg
              v-if="showCheckMark"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="check-circle"
              class="check-icon svg-inline--fa fa-check-circle fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
              />
            </svg>

            <svg
              v-if="showErrorMark"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="times-circle"
              class="error-icon svg-inline--fa fa-times-circle fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
              />
            </svg>

            <b-spinner
              v-if="showSpinner"
              style="width: 3rem; height: 3rem; "
              variant="info"
              type="grow"
            ></b-spinner>
          </div>
        </div>
      </div>

      <textarea readonly id="textarea" class="terminal terminal-data" v-model="terminalData"></textarea>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
const { ipcRenderer } = require("electron");
//const { dialog } = require('electron').remote

export default {
  name: "Main",
  components: {
    //HelloWorld
  },
  computed: {},
  data() {
    return {
      firmwareFile: "",
      webpageFile: "",
      comPort: "",
      baudrateSpeed: "",
      firmwareAddress: "",
      webpageAddress: "",
      comPortInputState: null,
      baudrateInputState: null,
      firmwareFileInputState: null,
      webpageFileInputState: null,
      firmwareAddressInputState: null,
      webpageAddressInputState: null,
      flashProgressValue: 0,
      selected: null,
      showSpinner: false,
      showCheckMark: false,
      showErrorMark: false,
      animate: true,
      comPortsList: [
        { port: "COM1" },
        { port: "COM2" },
        { port: "COM3" },
        { port: "COM4" },
        { port: "COM5" },
        { port: "COM6" },
        { port: "COM7" },
        { port: "/dev/ttyUSB0" },
        { port: "/dev/ttyUSB1" }
      ],
      baudrateList: [{ value: 115200 }, { value: 921600 }],
      terminalData: "",
      cmdLineArgs: {
        baudrate: this.baudrate,
        comPort: this.comPort,
        firmwareFilePath: this.firmwareFile,
        firmwareAddress: this.firmwareAddress,
        webpageFilePath: this.webpageFile,
        webpageAddress: this.webpageAddress
      }
    };
  },
  mounted() {
    // Async message handler
    //var esptoolError = "";
    //var esptoolOutput = "";
    function mapValue(x, in_min, in_max, out_min, out_max) {
      return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    }
    ipcRenderer.on("firmwareFilePath", (event, arg) => {
      console.log("firmwareFilePath");
      console.log(arg);
      this.firmwareFile = arg;
    });
    ipcRenderer.on("webpageFilePath", (event, arg) => {
      console.log("webpageFilePath");
      console.log(arg);
      this.webpageFile = arg;
    });
    ipcRenderer.on("esptool-error", (event, arg) => {
      console.log("esptool-error");
      console.log(arg);
      //esptoolError = arg;
      //this.terminalData = "";
      //this.terminalData = arg;
    });
    ipcRenderer.on("esptool-output", (event, arg) => {
      console.log("esptool-output");
      console.log(arg);
      //esptoolOutput = arg;
      //this.terminalData = "";
      //this.terminalData = arg;
    });
    ipcRenderer.on("line-esptool-output", (event, arg) => {
      console.log("line-esptool-output");
      console.log(arg);
      //esptoolOutput = arg;
      //this.terminalData = "";
      this.terminalData = this.terminalData + arg;
      var divContainer = this.$el.querySelector("#textarea");
      divContainer.scrollTop = divContainer.scrollHeight;
    });
    ipcRenderer.on("line-esptool-error", (event, arg) => {
      console.log("line-esptool-error");
      console.log(arg);
      //esptoolOutput = arg;
      //this.terminalData = "";
      this.terminalData = this.terminalData + arg;
      var divContainer = this.$el.querySelector("#textarea");
      divContainer.scrollTop = divContainer.scrollHeight;
    });
    ipcRenderer.on("progress-bar", (event, arg) => {
      this.flashProgressValue = mapValue(arg, 0, 36, 0, 100);
    });

    ipcRenderer.on("esptool-error-code", (event, errorCode) => {
      console.log("esptool-error-code");
      console.log(errorCode);
      switch (errorCode) {
        case 0: // got stdout no error
          this.showSpinner = false;
          this.showErrorMark = false;
          this.showCheckMark = true;
          //this.terminalData = "";
          //this.terminalData = esptoolOutput;
          break;
        case 1: // got stderr
          this.showSpinner = false;
          this.showCheckMark = false;
          this.showErrorMark = true;
          //this.terminalData = "";
          //this.terminalData = esptoolError;
          break;
        case 2:
          this.showSpinner = false;
          this.showCheckMark = false;
          this.showErrorMark = true;
          //this.terminalData = "";
          //this.terminalData = esptoolError;
          break;
        default:
        // code block
      }
    });
  },
  methods: {
    setBaudrate: function(baudrate) {
      console.log(baudrate);
      this.baudrateSpeed = baudrate;
      this.cmdLineArgs.baudrate = baudrate;
      this.baudrateInputState = null;
    },
    setComPort: function(comPort) {
      console.log(comPort);
      this.comPort = comPort;
      this.cmdLineArgs.comPort = comPort;
      this.comPortInputState = null;
    },
    testConnection: function() {
      if (this.comPort == "" || this.baudrateSpeed == "") {
        this.makeToast("danger", "Select COM port and Baudrate");
        this.comPortInputState = false;
        this.baudrateInputState = false;
      } else {
        this.flashProgressValue = 0;
        this.showCheckMark = false;
        this.showErrorMark = false;
        this.showSpinner = true;
        this.terminalData = "";

        this.cmdLineArgs.baudrate = this.baudrateSpeed;
        this.cmdLineArgs.comPort = this.comPort;

        // Async message sender
        ipcRenderer.send("test-esptool-connection", this.cmdLineArgs);
      }
    },
    flash: function() {
      if (this.comPort == "" || this.baudrateSpeed == "") {
        this.makeToast("danger", "Select COM port and Baudrate");
        this.comPortInputState = false;
        this.baudrateInputState = false;
      } else if (this.firmwareFile == "" || this.firmwareAddress == "") {
        this.makeToast("danger", "Select at least firmware file and address");
        this.firmwareFileInputState = false;
        //this.webpageFileInputState = false;
        this.firmwareAddressInputState = false;
        //this.webpageAddressInputState = false;
      } else {
        this.flashProgressValue = 0;
        this.showCheckMark = false;
        this.showErrorMark = false;
        this.showSpinner = true;
        this.terminalData = "";

        this.cmdLineArgs.baudrate = this.baudrateSpeed;
        this.cmdLineArgs.comPort = this.comPort;
        this.cmdLineArgs.firmwareFilePath = this.firmwareFile;
        this.cmdLineArgs.webpageFilePath = this.webpageFile;
        this.cmdLineArgs.firmwareAddress = this.firmwareAddress;
        this.cmdLineArgs.webpageAddress = this.webpageAddress;

        // Async message sender
        ipcRenderer.send("start-esptool-flash", this.cmdLineArgs);
      }
    },
    selectFirmwareFilePath() {
      console.log("get firmware file path...");
      ipcRenderer.send("selectFirmwareFilePath");
      this.firmwareFileInputState = null;
      this.firmwareAddressInputState = null;
    },
    selectWebpageFilePath() {
      console.log("get webpage file path...");
      ipcRenderer.send("selectWebpageFilePath");
      //this.webpageFileInputState = null;
      //this.webpageAddressInputState = null;
    },
    makeToast(variant = null, message) {
      this.$bvToast.toast(message, {
        title: "Error",
        variant: variant,
        solid: true,
        autoHideDelay: 3000
      });
    }
  }
};
</script>

<style>
.firmware-input {
  width: 100%;
  padding: 5px 0px 2px 10px;
}
.firmware-input-address {
  width: 100%;
  padding: 5px 0px 2px 10px;
}
.webpage-input {
  width: 100%;
  padding: 5px 0px 5px 10px;
}
.webpage-input-address {
  width: 100%;
  padding: 5px 0px 5px 10px;
}
.com-input {
  width: 100%;
  padding: 2px 0px 2px 10px;
}
.baud-input {
  width: 100%;
  padding: 5px 0px 30px 10px;
}
.btn-test-connection {
  width: 100%;
  padding: 10px 10px 10px 10px;
  text-align: left;
}
.btn-flash {
  width: 100%;
  padding: 5px 10px 10px 10px;
  text-align: left;
}
.btn-advanced {
  width: 100%;
  padding: 5px 10px 5px 10px;
  text-align: left;
}
.spinner-container {
  /* width: 120px; */
  position: relative;
  top: 10px;
  left: 720px;
  width: 100%;
  /* background-color: lemonchiffon; */
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0px 0px 0px 0px;
  /* position: right; */
  /* margin: 0 auto; */
}
.overlay {
  position: fixed;
  z-index: 2;
}
.check-icon-container {
  width: 50px;
  height: 50px;
  margin: auto;
  display: block;
  /* vertical-align: auto; */
}
.check-icon > path {
  fill: rgb(0, 180, 105);
}
.error-icon > path {
  fill: rgb(230, 80, 34);
}
.flash-progress {
  width: 100%;
  padding: 0px 10px 10px 10px;
}
.terminal-container {
  width: 100%;
  padding: 0px 10px 10px 10px;
}
.terminal {
  background-color: rgb(47, 47, 47);
  width: 100%;
  height: 220px;
  border-radius: 8px;
  text-align: start;
  resize: none;
  outline: none;
}
.terminal-data {
  color: aliceblue;
  font-family: "Courier New", Courier, monospace;
  font-size: 15px;
  line-height: 14px;
  /* display: inline; */
  padding: 5px;
}
</style>
