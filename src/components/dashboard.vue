<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-footer-center{
    position:relative;
    text-align: center;
}

.layout-card{
    position:relative;
    margin-left:20px;
}
.layout-header{
    font-family: "PingFang SC";
    color:white;
    background:#464c5b;
    font-size: 25px;
    text-align: center;
}
.layout-Table{
    font-family: "PingFang SC";
    color:white;
    background:#464c5b;
    font-size: 12px;
    text-align: center;

}



</style>
<template>
<div class="layout" >
<Layout >
    <Header style="font-weight:bold" class= 'layout-header' >
    傲基2.0品类排名看板 
    </Header>
        <Content :style="{padding: '0 10px'}">
            <Breadcrumb :style="{margin: '20px 0'}">
            <BreadcrumbItem to="/">主页</BreadcrumbItem>
            <BreadcrumbItem>看板</BreadcrumbItem>
            </Breadcrumb>
    <Row>
    <Col span='24'>
        <Card class='layout-card' >
        <div class='card-content' style="min-height: 200 px;">

            <Row>
                品类名称: &nbsp; <Col span='7'>
                        <Select v-model="select">
                            
                            <Option v-for ="(names,index) in category_names"  :key='index'  :value="names">{{names}}</Option>

                        </Select>
                        <span>Selected: {{ select }}  &nbsp; {{status}}</span>
                </Col>
                <Col span='6'>  &nbsp; </Col>
                <!-- <Col span="10">
                        日期选择:  &nbsp;
                        <DatePicker type="daterange" placement="bottom-end" placeholder="起始日期" style="width: 200px"></DatePicker>
                        <span>{{ daterange }} </span>
                </Col> -->
            </Row>

            <Row> 
                <Col span='12'>   
                <Table stripe height='1000' width="900" border :columns="catnames"  :data="catdata" @on-row-click="showDetail">  </Table>         
                </Col>
                <Col span='12'> 
                        <div ref="chart" style="width:100%;height:999px"> </div>
                </Col>  
            </Row>

            <Row> &nbsp;  &nbsp; </Row>

            <!-- <Row>
                标签聚合
                <Col span="5">
                        <CheckboxGroup v-model="checkbox">
                            <Checkbox label="大健康"></Checkbox>
                            <Checkbox label="智能穿戴"></Checkbox>
                            <Checkbox label="中大件"></Checkbox>
                            <Checkbox label="车载影音"></Checkbox>
                        </CheckboxGroup>

                </Col>
            </Row> -->

            <!-- <Row>
                排名过滤  &nbsp; &nbsp;
                <Col span="8">  
                    <Slider v-model="slider"   show-input ></Slider>

                </Col>              
                
                <Col span="2"> &nbsp; </Col>
                
               <Col span="6">   
                        <i-switch v-model="Switch" size="large">
                            <span slot="open">On</span>
                            <span slot="close">Off</span>
                        </i-switch>

                </Col> 
             </Row> --> 
        </div>  
        </Card>
        </Col>

        </Row>
        </Content>


  <Footer class="layout-footer-center"> 2021 &copy; 品类规划部 </Footer>
</Layout>    
</div>
</template>

<script>  
    export default {
        
                name:'Dashboard',
                    // 品类排名数据
                data(){
                    return {
                        chosed_asin: '',
                        x_axis:[],
                        echart_data:[],
                        category_names:[],
                        select:'Back Massagers',
                        slider: '',
                        Switch: true,
                        daterange:'',
                        catdata:[],
                        catnames:[],
                        status:'正在加载数据'
                            }
                        },
                watch: {
                    select: function (){
                        this.status = '正在加载数据'
                        this.getData()              
                    },
                    chosed_asin:function(){
                        this.getEchartData()
                    }
                },
                methods:{
                    showDetail(data){
                        this.isShow = true;
                        var size = Object.keys(data).length;
                        this.chosed_asin=data.asin
                        this.echart_data=Object.entries(data).slice(1,size-1).map(entry => entry[1]);
                        this.x_axis=Object.entries(data).slice(1,size-1).map(entry => entry[0])


                    },
                    getData: function(){
                    this.$axios.get(`http://127.0.0.1:8000/rank/${this.select}`  // 后台接
                    ).then(response => {  // 请求成功
                    console.log('请求成功');
                    this.catdata=JSON.parse(response.data[0]);
                    this.catnames=JSON.parse(response.data[1]);
                    this.status='数据加载完成'
                    // 将后台数据赋值给前台变量完成页面渲染
                }).catch(error => {
                    console.log('请求失败');
                    console.log(error);
                        })},
                    getNames: function(){
                    this.$axios.get('http://127.0.0.1:8000/categoryNames')
                    .then(response =>{
                    console.log('品类名称请求成功');
                    this.category_names=JSON.parse(response.data);
                    }).catch(error => {
                    console.log('品类名称请求失败');
                    console.log(error);})},
                        getEchartData() {

                        const chart = this.$refs.chart
                        if (chart) 
                        {

                        const myChart = this.$echarts.init(chart)
                        const option = {
                        title: { left:'center',
                                text: 'ASIN: '+this.chosed_asin + ' 排名趋势'},
                        xAxis: {
                                    type: 'category',
                                    data: this.x_axis,
                                    axisLine:{ show: false },
                                    splitLine:{ show:false }
                                },
                                yAxis: {
                                    type: 'value',
                                    inverse: true
                                },
                                series: [{
                                    data: this.echart_data,
                                    type: 'line'
                                        }]}
                            myChart.setOption(option)
                            window.addEventListener("resize", function() {
                            myChart.resize()
                            })
                        }
                        this.$on('hook:destroyed',()=>{
                            window.removeEventListener("resize", function() {
                            myChart.resize();
                            });
                            })
                        }
                    
                    
                        },
                created() {
                this.getData()
                this.getNames()
                },
                mounted(){
                    this.getEchartData()
                }
                }
</script>
