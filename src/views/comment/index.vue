<template>
    <div class="comment-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
            <!-- 面包屑导航区域 -->
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>评论管理</el-breadcrumb-item>                      
                </el-breadcrumb>               
            </div>

            <!-- 
                1、把数据列表绑定给表格的 data :data= articles
                2、设计表格列 5列
                3、给表格列绑定要渲染的数据字段
             -->
             <el-table class="table-list"
                :data="articles"
                stripe
                style="width: 100%" >
                <el-table-column
                prop="title"
                label="标题"
                >
                </el-table-column>
                <el-table-column
                prop="total_comment_count"
                label="总评论数"
                >
                </el-table-column>
                <el-table-column
                prop="fans_comment_count"
                label="粉丝评论数">
                </el-table-column>
                <el-table-column prop="comment_status" label="评论状态">
                    <template slot-scope="scope">
                        {{ scope.row.comment_status ? '正常' : '关闭' }}
                    </template>
                </el-table-column>
                <el-table-column prop="option" label="操作">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.comment_status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="onStatusChange(scope.row)"
                            :disabled="scope.row.statusDisabled">
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 数据分页功能 -->
            <!-- 
                绑定页码
                绑定每页大小
                :current-page 绑定的是高亮的页码数，数据仍然是第1页的
                :page-sizes 控制可选的每页大小[1, 2, 5, 8], 默认为10
                :page-size 控制当前
             -->
            <el-pagination background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size.sync="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>

        </el-card>
    </div>
</template>
<script>
import { getArticles, updateCommentStatus } from '@/api/article'

export default {
    name: 'CommentIndex',
    components: {},
    props: {},
    data () {
        return {
            articles: [], //文章数据列表
            totalCount: 0, // 总数据条数
            pageSize: 10, //
            page: 1 //当前激活的页码

        }
    },
    computed: {},
    watch: {},
    created () {
        this.loadArticles()
    },
    mounted () {

    },
    methods: {
        handleSizeChange () {
            //每页大小改变以后重新发送请求
            this.loadArticles(1)
        },
        handleCurrentChange (page) {
            // console.log(page);
            //页码改变，加载指定页码数据
            this.loadArticles(page)
        },
        loadArticles (page = 1) {
            this.page = page
            getArticles({
                response_type: 'comment',
                page,
                per_page: this.pageSize
            }).then(res => {
                // console.log(res);
            const { results } = res.data.data //解构
            // 遍历每个按钮，设置一个数据，用来进行按钮的控制禁用状态
            results.forEach(article => {
                article.statusDisabled = false
            })
                this.articles = results
                //在请求成功以后
                this.totalCount = res.data.data.total_count
            })
        },
        onStatusChange (article) {
            // 最开始禁用开关的事件
            article.statusDisabled = true

            // console.log(article.comment_status);
            //请求提交修改
            updateCommentStatus(article.id.toString(), 
                article.comment_status).then(res => {
                    // console.log(res)
                    this.$message({
                        type: 'success',
                        message: `${article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'}`
                    })
                    // 启用开关
                    article.statusDisabled = false
                })

        }
    }
    

}
</script>
<style lang="less" scoped>
    .table-list {
        margin-bottom: 30px;
    }
</style>