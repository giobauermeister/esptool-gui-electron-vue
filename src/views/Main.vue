<template>
  <div class="home">
    
    <div class="com-input">
      <b-input-group size="sm">
        <b-form-input v-model="comPort" placeholder=""></b-form-input>
        <template v-slot:prepend>
          <b-dropdown size="sm" text="Select COM port" variant="primary">
            <b-dropdown-item>COM1</b-dropdown-item>
            <b-dropdown-item>COM2</b-dropdown-item>
          </b-dropdown>
        </template>
      </b-input-group>
    </div>

    <div class="baud-input">
      <b-input-group size="sm">
        <b-form-input v-model="baudrateSpeed" placeholder=""></b-form-input>
        <template v-slot:prepend>
          <b-dropdown size="sm" text="Select baudrate" variant="primary">
            <b-dropdown-item v-model="selected" :options="options">9600</b-dropdown-item>
            <!-- <b-dropdown-item>115200</b-dropdown-item>
            <b-dropdown-item>921600</b-dropdown-item> -->
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
      comPort: "COM1",
      baudrateSpeed: 9600,
      selected: null,
      options: [
        { value: 'COM1', text: 'COM1' },
        { value: 'COM2', text: 'COM2' },
        { value: 'COM3', text: 'COM3' }
      ]
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
