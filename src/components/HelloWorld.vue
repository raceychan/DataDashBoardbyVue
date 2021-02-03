
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
        <Button @click="todashboard">进入看板</Button>
    <ul>
      <li>
        <a  href="https://a.aukeyit.com"> 回到鹰眼</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods:{
    todashboard: function(){
      this.$router.replace('/dashboard')
    }
  },
  name: 'HelloWorld',
  data () {
    return {
      msg: 'PND鹰眼2.0品类排名看板'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div{
    width: 100%;

    height: 100%;

    background-color: #f5f5f5;
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #00000c;
}
</style>
