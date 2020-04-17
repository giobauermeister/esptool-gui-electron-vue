<template>
  <div class="home">
    
    <div class="com-input">
      <b-input-group size="sm">
        <b-form-input v-model="comPort" placeholder=""></b-form-input>
        <template v-slot:prepend>
          <b-dropdown size="sm" text="Select COM port" variant="primary">
            <b-dropdown-item v-bind:key="comPort" v-for="comPort in comPortsList">{{ comPort.value }}</b-dropdown-item>
          </b-dropdown>
        </template>
      </b-input-group>
    </div>

    <div class="baud-input">
      <b-input-group size="sm">
        <b-form-input id="baudrate-input" v-model="baudrateSpeed" placeholder="">teste</b-form-input>
        <template v-slot:prepend>
          <b-dropdown size="sm" text="Select baudrate" variant="primary">
            <b-dropdown-item v-on:click="setInput" v-bind:key="baudrate" v-for="baudrate in baudrateList">{{ baudrate.value }}</b-dropdown-item> 
          </b-dropdown>
        </template>
      </b-input-group>
    </div>

    

    <div class="firmware-input">
      <b-form-file size="sm"
      v-model="firmwareFile"
      :state="Boolean(firmwareFile)"
      placeholder="Select firmware file"
      drop-placeholder="Drop file here..."
      ></b-form-file>
    </div>

    <div class="webpage-input">
      <b-form-file size="sm"
      v-model="webpageFile"
      :state="Boolean(webpageFile)"
      placeholder="Select webpage file"
      drop-placeholder="Drop file here..."
      ></b-form-file>
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
      //comPort: "COM1",
      //baudrateSpeed: 9600,
      selected: null,
      comPortsList: [
        { value: 'COM1', text: 'COM1' },
        { value: 'COM2', text: 'COM2' },
        { value: 'COM3', text: 'COM3' },
        { value: 'COM4', text: 'COM4' },
        { value: 'COM5', text: 'COM5' }
      ],
      baudrateList: [
        { value: 9600 },
        { value: 115200 },
        { value: 921600 }
      ]        
    }
  },
  methods: {
    setInput: function () {
      console.log(this.comPortsList[0].value);      
    }
  }
};
</script>

<style>
  .com-input {
    width: 50%;
    padding: 10px 10px 10px 10px;
  }
  .baud-input {
    width: 50%;
    padding: 5px 10px 10px 10px;
  }
  .firmware-input{
    width: 50%;
    padding: 5px 10px 10px 10px;
  }
  .webpage-input {
    width: 50%;
    padding: 5px 10px 10px 10px;
  }
</style>
