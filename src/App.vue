<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<style>
html {
    width: 100%;
    min-height: 100%;
}
body {
    width: inherit;
    min-height: inherit;
    margin: 0;
    padding: 0;
    background: rgb(237,237,237);
    background: radial-gradient(circle, rgba(237,237,237,1) 0%, rgba(215,215,215,1) 47%, rgba(219,219,219,1) 100%);
    overflow: hidden;
}
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
::-webkit-scrollbar { display: none; }
</style>
