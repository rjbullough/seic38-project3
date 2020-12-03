<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/search">Search</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Beth+Ellen&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300&display=swap');
#app {
  font-family: 'Assistant';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-size: 29px;
  color: #2c3e50;
  padding: 0.5em;
}

#nav a.router-link-exact-active {
  color: coral;
}
</style>
