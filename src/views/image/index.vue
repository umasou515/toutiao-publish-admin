<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
            <!-- 面包屑导航区域 -->
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>素材管理</el-breadcrumb-item>                      
                </el-breadcrumb>               
            </div>

             <!-- 图片列表 -->
             <image-list />
             <!-- /图片列表 -->

             
        </el-card>

        

    </div>
</template>
<script>
// import { getImages, collectImage, deleteImage } from '@/api/image'
import ImageList from './components/image-list.vue'

export default {
    name: 'ImageIndex',
    components: {
        //注册在这里，进行引用时候
        ImageList
    },
    props: {},
    data () {
        return {}
    },
    computed: {},
    watch: {},
    created () {
        //页面初始化加载第 1 页数据
        // this.loadImages(1)
    },
    mounted () {},
   methods: {}
}
</script>
<style lang="less" scopde>
    
</style>