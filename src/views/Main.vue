<template>
  <div class="home">
    <b-row>
      <b-col cols="8">
        <div class="com-input">
          <b-input-group size="sm">
            <b-form-input v-model="comPort" placeholder></b-form-input>
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
            <b-form-input v-model="baudrateSpeed" id="baudrate-input" placeholder></b-form-input>
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

        <div class="firmware-input">
          <b-form-file
            size="sm"
            v-model="firmwareFile"
            :state="Boolean(firmwareFile)"
            placeholder="Select firmware file"
            drop-placeholder="Drop file here..."
          ></b-form-file>
        </div>

        <div class="webpage-input">
          <b-form-file
            style="font-weight: 100!important;"
            size="sm"
            v-model="webpageFile"
            :state="Boolean(webpageFile)"
            placeholder="Select spiffs file"
            drop-placeholder="Drop file here..."
          ></b-form-file>
        </div>
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

            <svg v-if="showErrorMark" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" class="error-icon svg-inline--fa fa-times-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path></svg>


            <b-spinner
              v-if="showSpinner"
              style="width: 4rem; height: 4rem; "
              variant="info"
              type="grow"
            ></b-spinner>
          </div>
        </div>
      </b-col>
    </b-row>

    <div class="flash-progress">
      <b-progress
        :value="flashProgressValue"
        variant="info"
        striped
        show-progress
        :animated="animate"
        class="mt-2"
      ></b-progress>
    </div>

    <div class="terminal-container">
      <textarea class="terminal terminal-data" v-model="terminalData"></textarea>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
const { ipcRenderer } = require("electron");

export default {
  name: "Main",
  components: {
    //HelloWorld
  },
  data() {
    return {
      firmwareFile: null,
      webpageFile: null,
      comPort: "",
      baudrateSpeed: "",
      flashProgressValue: 75,
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
        { port: "COM7" }
      ],
      baudrateList: [{ value: 115200 }, { value: 921600 }],
      terminalData: "",
      cmdLineArgs: {
        baudrate: this.baudrate,
        comPort: this.comPort
      }
    };
  },
  mounted() {
    // Async message handler
    var esptoolError = "";
    var esptoolOutput = "";
    ipcRenderer.on("esptool-error", (event, arg) => {
      console.log("esptool-error");      
      console.log(arg);
      esptoolError = arg;
      //this.terminalData = "";
      //this.terminalData = arg;
    });
    ipcRenderer.on("esptool-output", (event, arg) => {
      console.log("esptool-output"); 
      console.log(arg);
      esptoolOutput = arg;
      //this.terminalData = "";
      //this.terminalData = arg;
    });
    ipcRenderer.on("esptool-error-code", (event, errorCode) => {
      console.log("esptool-error-code");
      console.log(errorCode);
      switch(errorCode) {
        case 0: // got stdout no error
          this.showSpinner = false;
          this.showErrorMark = false;
          this.showCheckMark = true;
          this.terminalData = "";
          this.terminalData = esptoolOutput;
          break;
        case 1: // got stderr
          this.showSpinner = false;
          this.showCheckMark = false;
          this.showErrorMark = true;
          this.terminalData = "";
          this.terminalData = esptoolError;
          break;
        case 2:
          this.showSpinner = false;
          this.showCheckMark = false;
          this.showErrorMark = true;
          this.terminalData = "";
          this.terminalData = esptoolError;
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
      //ipcRenderer.send('asynchronous-message', 'hello world');
    },
    setComPort: function(comPort) {
      console.log(comPort);
      this.comPort = comPort;
      this.cmdLineArgs.comPort = comPort;
    },
    testConnection: function() {
      this.showCheckMark = false;
      this.showErrorMark = false;
      this.showSpinner = true;      
      //this.terminalData = this.terminalData + "\n" + "test";

      this.cmdLineArgs.baudrate = this.baudrateSpeed;
      this.cmdLineArgs.comPort = this.comPort;

      

      // Async message sender
      ipcRenderer.send("cmdLineArgs", this.cmdLineArgs);

      //console.log(ipcRenderer.sendSync('cmdLineArgs', this.cmdLineArgs))
    },
    flash: function() {},
  }
};


</script>

<style>
.com-input {
  width: 100%;
  padding: 10px 0px 10px 10px;
}
.baud-input {
  width: 100%;
  padding: 5px 0px 10px 10px;
}
.firmware-input {
  width: 100%;
  padding: 5px 0px 10px 10px;
}
.webpage-input {
  width: 100%;
  padding: 5px 0px 10px 10px;
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
.spinner-container {
  width: 120px;
  /* background-color: lemonchiffon; */
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0px 0px 0px 15px;
  /* margin: 0 auto; */
}
.check-icon-container {
  width: 60px;
  height: 60px;
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
