<style scoped>
.layout{ position:relative;

}
</style>

<template>
<div class="layout" >
<Layout >

    

<Card style='width: 2300px'>


<table>
      <tr>
          <th v-for='(i,ind) in category.columns'  :key='ind'>{{$moment(i).format('YYYY-MM-DD')}}</th> 
      </tr>
      <tbody>
      <tr v-for='(item,index) in category.data'  :key='index'>
          <td v-for='(it,ind) in item' :key='ind'>{{item[ind]}}</td>
      </tr>
      </tbody>
</table>


</Card>
<Footer class="layout-footer-center"> 2021 &copy; 品类规划部 </Footer>
</Layout>
</div>
</template>


<script>

export default {

data (){
    return { 
    category: [{
        columns:'',
        data:'',
    }]
    }
},

mounted(){
          this.$axios({
              url: `http://127.0.0.1:8000/rank/`,  // 后台接口
              method: 'get',  // 请求方式
              params: {category_id:'3767531'}
          }).then(response => {  // 请求成功
              console.log('请求成功');
              console.log(JSON.parse(response.data));
              this.category = JSON.parse(response.data);  // 将后台数据赋值给前台变量完成页面渲染
          }).catch(error => {  // 请求失败
              console.log('请求失败');
              console.log(error);
          })
          }
  }





</script>


