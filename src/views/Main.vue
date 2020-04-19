<template>
  <div class="home">
    <b-row>
      <b-col>

        <div class="com-input">
          <b-input-group size="sm">
            <b-form-input v-model="comPort" placeholder></b-form-input>
            <template v-slot:prepend>
              <b-dropdown size="sm" text="Select COM port" variant="primary">
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
              <b-dropdown size="sm" text="Select baudrate" variant="primary">
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
        size="sm"
        v-model="webpageFile"
        :state="Boolean(webpageFile)"
        placeholder="Select webpage file"
        drop-placeholder="Drop file here..."
      ></b-form-file>
    </div>


      </b-col>

      <b-col>
        <div class="btn-test-connection">
          <b-button size="md">Test connection</b-button>
        </div>

        <div class="btn-flash">
          <b-button size="md">Flash</b-button>
        </div>
      </b-col>
    </b-row>

    

    

    <div style="width: 100%; background-color: #ffff">
      <div style="padding: 4px; text-align: center; background-color: #acacac; border-radius: 5px">
        <p>test</p>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Main",
  components: {
    //HelloWorld
  },
  data() {
    return {
      firmwareFile: null,
      webpageFile: null,
      comPort: "com port",
      baudrateSpeed: "bau rate",
      selected: null,
      comPortsList: [
        { port: "COM1", text: "COM1" },
        { port: "COM2", text: "COM2" },
        { port: "COM3", text: "COM3" },
        { port: "COM4", text: "COM4" },
        { port: "COM5", text: "COM5" }
      ],
      baudrateList: [{ value: 9600 }, { value: 115200 }, { value: 921600 }]
    };
  },
  methods: {
    setBaudrate: function(baudrate) {
      console.log(baudrate);
      this.baudrateSpeed = baudrate;
    },
    setComPort: function(comPort) {
      console.log(comPort);
      this.comPort = comPort;
    }
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
  padding: 10px 10px 10px 0px;
}
.btn-flash{
  width: 100%;
  padding: 10px 10px 10px 0px;
}
</style>
