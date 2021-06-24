<template>
    <div class="fans-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
            <!-- 面包屑导航区域 -->
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>                      
                </el-breadcrumb>               
            </div>
            <template>
                <el-tabs v-model="activeName" type="card" >
                    <el-tab-pane label="粉丝列表" name="first" @change="loadFans(1)"
                                 v-loading="loading">
                        <el-row :gutter="20">                 
                            <el-col :span="3"
                                    v-for="(fans, index) in fans"
                                    :key="index">
                                <div class="fans-box">
                                    <el-image class="fans-img"                                   
                                    :src="fans.photo"
                                    ></el-image>
                                    <p>{{fans.name}}</p>
                                    <el-button type="primary" plain size="mini" class="btn">+关注</el-button>
                                </div>
                            </el-col>
                        </el-row>

                        <!-- 数据分页展示 -->
                        <el-pagination
                            background
                            layout="prev, pager, next"
                            :disabled="sure"
                            :total="totalCount"
                            :page="page"
                            :page-size="pageSize"
                            :current-page.sync="page"
                            @current-change="loadFans(page)"
                            >
                        </el-pagination>

                    </el-tab-pane>

                    <el-tab-pane label="粉丝图像" name="second">
                         <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
                          <div ref="main" style="width: 600px;height:400px;"></div>

                          <h2>地图图表示例</h2>
                          <map-demo />

                          <h2>百度地图</h2>
                          <bmap-demo />
                    </el-tab-pane>

                </el-tabs>
            </template>

            <!-- <div class="action-head">
                <el-tabs v-model="collect" @change="loadImages(1)">
                    <el-tab-pane :label="false">粉丝列表</el-tab-pane>
                    
                </el-tabs>                              
            </div> -->


        </el-card>
    </div>
</template>
<script>
import { getFans } from '@/api/fans'
// import echarts from 'echarts'
import * as echarts from 'echarts'
import MapDemo from './components/map-demo.vue'
import BmapDemo from './components/bmap-demo.vue'

export default {
    name: 'FansIndex',
    components: {
        //注册为子组件
        MapDemo, // 百度地图结合 echarts
        BmapDemo // 纯粹的百度地图
    },
    props: {},
    data () {
        return {
            activeName: 'first',
            fans: [], //粉丝素材
            page: 1,//分页
            pageSize: 24, //每页数量
            totalCount: 0, //数据总量
            sure: false,
            loading: false
        }
    },
    computed: {},
    watch: {},
    created () {
        this.loadFans()
    },
    mounted () {
        //注意初始化操作 DOM 一定要写到 mounted 钩子函数中
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.$refs.main);
        var option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
        }]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)

        
    },
    methods: {
        loadFans () {
            this.loading = true
            getFans({ 
                
                page: this.page,
                per_page: this.pageSize
            }).then(res => {
                // console.log(res)
                this.fans = res.data.data.results 
                this.totalCount = res.data.data.total_count
            })
            this.loading = false
            this.sure = false
        }
    }
}
</script>
<style lang="less" scoped>
    .action-head {
        padding-bottom: 15px;
        display: flex;
        justify-content: space-between;
    }
    .fans-box {
        margin-bottom: 10px;
        border: 1px dashed #ccc; //虚线边框
        width: 120px;
        height: 200px;         
        // background-color: coral;
        p {
            text-align: center;
            font-size: 15px;
            margin-top: 20px;
        }
    }
    .fans-img {
            display: block;
            width: 85px;
            height: 85px;
            margin: auto; //居中
            margin-top: 10px;
            border-radius:50%; //圆角显示
        }
    .btn {
        display: block;
        margin: 0 auto;
    }
</style>