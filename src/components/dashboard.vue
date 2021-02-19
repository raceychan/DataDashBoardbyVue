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
    margin-left:50px;
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
.ivu-table td.table-meta-column{
    background-color: #2db7f5;
    color: #fff;
}


</style>
<template>
<div class="layout" >
<Layout >
    <Header style="font-weight:bold" class= 'layout-header' >
    傲基  2.0品类排名看板 
    </Header>
        <Content :style="{padding: '0 10px'}">
            <Breadcrumb :style="{margin: '15px 0'}">
            <BreadcrumbItem to="/">主页</BreadcrumbItem>
            <BreadcrumbItem>排名看板 </BreadcrumbItem>
            
            </Breadcrumb>
    <Row>
    <Col span='24'>
        <Card class='layout-card' style="width: 1780px">
        <div style="height: 650 px;">
            <Row>
                <Col span = '1' style = "margin:5px"> 品类名称: </Col>
                
                <Col span='5'>
                        <Select v-model="select">
                            <Option v-for ="(names,index) in category_names"  :key='index'  :value="names">{{names}}</Option>
                        </Select> 
                </Col>
                <Poptip trigger = "hover" word-wrap width="200" content="系统将每小时追踪一次品类排名，以当日每小时排名中位数作为日排名，以当月每日排名中位数作为月排名。">
                    <Icon style = "margin:5px 0px 0px 10px" type="ios-help-circle" size = "20"/>
                </Poptip>
                <Col span='2'>  &nbsp; </Col>
                <p style = "margin:5px 0px 0px 0px">月份选择：</p>
                <Col span="3">
                    <DatePicker v-model="date"  type="month" placeholder="Select month" style="width: 200px"></DatePicker>
                </Col>
            </Row>
                    
            <Row> 
                <Col span='12'>   
                <Table :loading="loading" style="margin-top: 15px; margin-bottom: 0px" stripe height='590' width="900" border :columns="catnames"  :data="catdata" @on-row-click="showDetail" size="small">  </Table>         
                </Col>

                <Col span='12'>  
                        <div ref="chart" style="width: 900px;height:590px "> </div>
                </Col> 
            </Row>

            <Row> 
                <Col span='10'>
                <Page :total="10" style = "margin: 20px 0px 0px 60px;" />
                </Col> 
            <Col span='2'>

            <Button type="primary" style = "margin: 15px 0px 0px 70px;" @click="modal1 = true">导出数据</Button>
            <Modal
                v-model="modal1"
                title="选择需要导出的数据"
                @on-ok="ok"
                @on-cancel="cancel">
                <Row>
                <download-excel
                    :data   = "categoryAllData"
                    :fields = "categoryAllColumn"
                    type    = "csv"
                    worksheet = 'Sheet1'
                    name    = "原始数据.xls">
                    <Button type="success" style = "margin: 15px 0px 0px 80px" > 导出原始数据  </Button>
                </download-excel>
                <download-excel
                    :data   = "catdata"
                    :fields = "catnamecsv"
                    type    = "csv"
                    worksheet = 'Sheet1'
                    name    = "当月排名数据.xls">
                    <Button type="success" style = "margin: 15px 0px 0px 80px" > 导出当月数据  </Button>
                </download-excel>
                </Row>
            </Modal>


            </Col> 
            </Row>
            <Row> &nbsp;  &nbsp; </Row>
        </div>  
        </Card>
        </Col>
        </Row>
        </Content>


  <Footer class="layout-footer-center"> Copyright &copy; 2021 品类规划部 </Footer>
</Layout>    
</div>
</template>

<script>

    export default {
                name:'Dashboard',
                    // 品类排名数据
                data(){
                    return {        
        categoryAllColumn: {
            'ASIN': 'asin',
            'CategoryId': 'category_id',
            'CategoryName': 'category_name',
            'Date':'date',
            'Ranking':'ranking',
            // 'Telephone 2' : {
            //     field: 'phone.landline',
            //     callback: (value) => {
            //         return `Landline Phone - ${value}`;
            //     }
            // },
        },
        categoryAllData: [

            //     'phone': {
            //         'mobile': '1-541-754-3010',
            //         'landline': '(541) 754-3010'

        ],
                        modal1: false,
                        loading: true,
                        chosed_asin: '',
                        categoryAllData:[],
                        x_axis:[],
                        echart_data:[],
                        category_names:[],
                        date: new Date(),
                        select:'Electric Mattress Pads',
                        slider: '',
                        Switch: true,
                        catdata:[],
                        catnames:[],
                        catnamecsv:{
                        },
                        newdate:''
                            }
                        },
                watch:{
                    select: function (){
                        this.$Message.warning('正在加载数据')
                        this.getData()              
                    },
                    chosed_asin:function(){
                        this.getEchartData()
                    },
                    date:function(){
                        this.getDate(this.date)
                        this.getData()
                    }
                      },
                methods:{
                    ok () {
                            this.$Message.info('Clicked ok');
                            },
                    cancel () {
                this.$Message.info('Clicked cancel');
                    },

                    getDate(input){
                        var d = new Date(input)
                        this.month=d.getMonth()+1
                    },
                    getData: function(){
                    this.loading=true
                    this.$axios.get(`http://10.1.10.129:8503/rank/${this.select}/${this.month}`// 后台接
                    ).then(response => {  // 请求成功
                    console.log('请求成功');
                    this.catdata=JSON.parse(response.data[0]);
                    this.catnames=JSON.parse(response.data[1]);
                    console.log('catdata',this.catdata);  
                    console.log('catname',this.catnames)
                    var size = Object.keys(this.catdata[0]).length;
                    this.chosed_asin=this.catdata[0].asin
                    this.echart_data=Object.entries(this.catdata[0]).slice(1,size-1).map(entry => entry[1]);
                    this.x_axis=Object.entries(this.catdata[0]).slice(1,size-1).map(entry => entry[0])
                    
                    this.pre_processed_name = Object.keys(this.catdata[0])
                    this.catnamecsv = Object.assign(...this.pre_processed_name.map(v => ({ [v]: v })));
                    console.log('catnamecsv',this.catnamecsv)


                    this.$Message.success('数据加载完成')
                    this.loading=false
                    // 将后台数据赋值给前台变量完成页面渲染
                    }).catch(error => {
                    console.log('请求失败');
                    console.log(error);})
                    },
                    showDetail(data){
                        this.isShow = true;
                        var size = Object.keys(data).length;
                        this.chosed_asin=data.asin
                        this.echart_data=Object.entries(data).slice(1,size-1).map(entry => entry[1]);
                        this.x_axis=Object.entries(data).slice(1,size-1).map(entry => entry[0])
                    },                  
                    getNames: function(){
                    this.$axios.get('http://10.1.10.129:8503/categoryNames')
                    .then(response =>{
                    console.log('品类名称请求成功');
                    this.category_names=JSON.parse(response.data);
                    }).catch(error =>  {
                    console.log('品类名称请求失败');
                    console.log(error);})
                    },
                    getCategoryAllData: function(){
                    this.$axios.get('http://127.0.0.1:8000/categoryAllData')
                    .then(response =>{
                    this.categoryAllData=JSON.parse(response.data);
                    console.log('导出数据就绪', this.categoryAllData)
                    }).catch(error =>  {
                    console.log('导出数据请求失败');
                    console.log(error);})
                    },
                    getEchartData() {
                    const chart = this.$refs.chart
                    if (chart) 
                    {
                    const myChart = this.$echarts.init(chart)
                    const option = {
                    title: { left:'center',
                            text: 'ASIN: '+ this.chosed_asin + ' 排名趋势'},
                    tooltip:{
                        trigger: 'axis',
                        axisPointer:{
                            type: 'shadow'
                        },
                    },
                    xAxis: {
                                type: 'category',
                                data: this.x_axis,
                                axisLine: { show: false },
                                splitLine:{ show:false }
                            },
                            yAxis: {
                                type: 'value',
                                inverse: true
                            },
                            series: [{
                                name: '当日排名:',
                                data: this.echart_data,
                                type: 'line',
                                markLine:{
                                    symbol:'none',
                                    data:[{
                                        lineStyle:{type:'solid',color:'#FA3934'},
                                        type:'median',name:'中位数'}]
                                        }
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
                        })}         
                        },
                created(){
                this.month = new Date().getMonth()+1
                this.getData()
                this.getNames()
                this.getCategoryAllData()
                },
                mounted(){
                    this.getEchartData()
                }          
                }
</script>
