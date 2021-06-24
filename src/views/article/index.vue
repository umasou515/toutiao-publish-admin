<template>
    <div class="article-container">
            <el-card class="filter-card">
                <div slot="header" class="clearfix">
                    <!-- 面包屑导航区域 -->
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>内容管理</el-breadcrumb-item>                      
                    </el-breadcrumb>
                </div>
        <!-- 数据筛选表 -->
        <el-form ref="form" label-width="40px" size="mini" 
                 :model="form" v-loading="loading">
            <el-form-item label="状态">
                <el-radio-group v-model="status">
                    <!-- el-radio 默认把label 作为文本和选中之后的 value 值 -->
                <el-radio :label="null">全部</el-radio>
                <el-radio :label="0">草稿</el-radio>
                <el-radio :label="1">待审核</el-radio>
                <el-radio :label="2">审核通过</el-radio>
                <el-radio :label="3">审核失败</el-radio>
                <el-radio :label="4">已删除</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="频道">
                <el-select v-model="channelId" placeholder="请选择频道">
                <el-option label="全部" :value="null"></el-option>
                <el-option :label="channels.name" :value="channels.id" 
                v-for="(channels, index) in channels" :key="index"></el-option>
                
                </el-select>
            </el-form-item>


            <el-form-item label="日期">
                <el-date-picker
                    v-model="rangeDate"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['12:00:00']" 
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <!-- button 按钮的 click 事件有个默认参数，当你没有指定参数的时候，它会默认传递一个没用的数据 -->
            <el-form-item>
                <el-button type="primary" @click="loadArticles(1)"
                :disabled="loading">查询</el-button>                
            </el-form-item>

        </el-form>
        </el-card>

        
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                根据筛选条件共查询到 {{ totalCount }} 条结果：
            </div>
            <!-- 数据列表 -->
            <!-- table 表格组件
                1.把需要展示的数组列表数据绑定给 table 组件的 data 属性
                2.设计表格列 el-table-column ，
                  width可以设定表格的宽度 ， label 可以设定表格的列表,
                  prop 用来设定要渲染的列表项数据字段,只能展示文本
                3.表格列默认只能渲染普通文本，如果需要展示其他内容，例如放个按钮、图片，那就
                  需要自定义表格列模板了：https://element.eleme.cn/2.15/#/zh-CN/component/table  -->
            <el-table
                :data="articles" stripe
                style="width: 100%" class="list-table"
                size="small" v-loading="loading">
                <el-table-column
                    prop="date"
                    label="封面">
                    <template slot-scope="scope">                       
                        <!-- <img
                            v-if="scope.row.cover.images[0]"
                            class="article-cover"
                            :src="scope.row.cover.images[0]" alt="" >
                        <img v-else class="article-cover" src="./no-cover.jpg" alt=""> -->
                        <el-image
                        style="width: 60px; height: 60px"
                        :src="scope.row.cover.images[0]"
                        fit="cover" lazy>
                            <div slot="placeholder" class="image-slot">
                                加载中<span class="dot">...</span>
                            </div>
                        </el-image>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="title"
                    label="标题"
                    >
                </el-table-column>
                <el-table-column
                   
                    label="状态">
                    <!-- 如果需要在自定义列模板中获取当前遍历项数据，那么就在 template 上声明 slot-scope="scope" -->
                    <template slot-scope="scope">
                        <!-- <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
                        <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
                        <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
                        <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
                        <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag> -->
                        <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="pubdate"
                    label="发布时间">
                    </el-table-column>
                <el-table-column                    
                    label="操作">
                    <template slot-scope="scope">
                        <el-button circle size="mini" type="primary" icon="el-icon-edit"
                                    @click="$router.push('/publish?id=' + scope.row.id.toString())"></el-button>
                        <el-button circle size="mini" type="danger" icon="el-icon-delete"
                                    @click="onDeleteArticle(scope.row.id)"></el-button>
                    </template>
                    </el-table-column>
            </el-table>
            <!-- 分页功能 -->
            <el-pagination background               
                @current-change="onCurrentChange"               
                :page-size="pageSize"
                layout="prev, pager, next"
                :current-page.sync="page"
                :total="totalCount" :disabled="loading">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'


export default {
    name: 'ArticleIndex',
    components: {},
    props: {},
    data () {
        return {
            form: {
                name: '',
                // region: '',
                date1: '',
                
                delivery: false,
                type: [],
                // resource: '',
                desc: ''
            },
                // currentPage4: 4,
                articles: [], //文章数据列表
                articleStatus: [
                    { status: 0, text: '草稿', type: 'info' }, //0
                    { status: 1, text: '待审核', type: '' }, //1
                    { status: 2, text: '审核通过', type: 'success' }, //2
                    { status: 3, text: '审核失败', type: 'warning' }, //3
                    { status: 4, text: '已删除', type: 'danger' } //4
                ],
                totalCount: 0, //总数据条数
                pageSize: 10, //每页大小
                status: null, //查询文章的状态,不传就是全部
                channels: [], //文章频道列表
                channelId: null, //查询文章的频道
                rangeDate: null, //筛选的范围日期
                loading: true, // 表格数据加载中 loading
                page: 1 //当前页码
        }
    },
    computed: {},
    watch: {},
    created () {
        this.loadChannels()
        this.loadArticles(1)
    },
    mounted () {},
    methods: {
        loadArticles (page = 1) {
            // 展示加载中 loading
            this.loading = true
            getArticles( {
                page,
                per_page: this.pageSize,
                status: this.status,
                channel_id: this.channelId,
                begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, //开始日期
                end_pubdate: this.rangeDate ? this.rangeDate[1] : null //截止日期
            }).then(res => {
                // console.log(res)
                const { results, total_count: totalCount } = res.data.data //解构
                this.articles = results
                this.totalCount = totalCount//驼峰法：重命名后

                //关闭加载中 loading
                this.loading = false
            })
        },
        onSubmit() {
        console.log('submit!');
      },
      //分页
    //   handleSizeChange(pageSize) {
    //     // console.log(`每页 ${val} 条`);
    //     // this.queryInfo.pagesize = newSize
    //         this.loadArticles(pageSize)
    //   },
      onCurrentChange(page) {
        // console.log(`当前页: ${val}`);
        this.loadArticles(page)
        // this.loadArticles()
      },
      loadChannels () {
          getArticleChannels().then(res => {
            //   console.log(res);
            this.channels = res.data.data.channels
          })
      },
      //根据 id 删除操作
      onDeleteArticle (articleId) {
          console.log(articleId.toString())
          this.$confirm('确认删除吗？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //确认执行这里
          deleteArticle(articleId.toString()).then(res => {
            //   console.log(res);
            //删除成功，更新当前页的文章数据列表
            this.loadArticles(this.page)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })          
        })

           // 找到数据接口
          // 封装请求路径
          // 删除请求调用
          // 处理响应结果
        //   console.log('onDeleteArticle');
          //询问用户是否删除
      }
    }     
}          
            
      

</script>
<style lang="less" scoped>
    .filter-card {
        margin-bottom: 30px;
    }
    .list-table {
        margin-bottom: 20px;
    }
    // .article-cover {
    //     width: 60px;
    //     background-size: cover;
    // }
    .image-slot {
        text-align: center;//居中
        display: table-cell;
        
    }
</style>