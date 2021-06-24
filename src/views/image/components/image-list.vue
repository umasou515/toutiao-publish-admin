<template>
    <div  class="image-list">
        
        <div class="action-head">
                <el-radio-group v-model="collect" size="mini" @change="loadImages(1)">
                    <el-radio-button :label="false">全部</el-radio-button>
                    <el-radio-button :label="true">收藏</el-radio-button>
                </el-radio-group>      
                <el-button type="success" size="mini" 
                            @click="dialogUploadVisible = true"
                            v-if="isShowAdd">上传素材</el-button>         
            </div>
            
            <!-- 素材列表 -->
            <el-row :gutter="10">
                <el-col :xs="12" :sm="6" :md="6" :lg="4" 
                        v-for="(img, index) in images" :key="index"
                        class="image-item"
                        @click.native="selected = index"
                    >
                    <el-image
                        style="height: 100px"
                        :src="img.url"
                        fit="cover"
                    ></el-image>

                        <div class="selected"
                             v-if="isShowSelected && selected === index">

                        </div>

                    <div class="image-action" v-if="isShowAction">
                        <!-- 
                            class 样式绑定 
                            {
                                CSS类名：布尔值
                            }
                            true: 作用类名
                            false: 不作用类名
                         -->
                         <el-button type="warning" 
                                    :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" circle
                                    size="small" @click="onCollect(img)"
                                    :loading="img.loading"
                                ></el-button>
                         <el-button size="small"  type="danger"
                                    icon="el-icon-delete-solid" circle
                                    :loading="img.loading"
                                    @click="onDelete(img)"
                                ></el-button>
                        <!-- <i 
                            :class="{
                                'el-icon-star-on': img.is_collected,
                                'el-icon-star-off': !img.is_collected
                            }"
                            @click="onCollect(img)"
                        ></i> -->
                        <!-- <i class="el-icon-delete-solid"></i> -->
                    </div>
                </el-col>
            </el-row>

            <!-- 数据分页功能 -->
            <!-- 分页数据改变后，页码不会变化，它需要单独处理高亮的页码 -->
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totalCount"
                :page-size="pageSize"
                :current-page.sync="page"
                @current-change="onPageChange">
            </el-pagination>

            <el-dialog title="上传素材" :visible.sync="dialogUploadVisible"
                    :append-to-body="true">
                    <!-- 
                        upload 组件本身就支持请求提交上传操作,
                        说白了你使用它不用自己去发请求，它会自己发。
                        请求方法：默认就是 POST
                        请求路径: action , 必须要写完整路径
                        请求头： headers
                     -->
                <el-upload
                    v-if="dialogUploadVisible"
                    class="upload-demo"
                    drag
                    action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
                    :headers="uploadHeaders"
                    name="image"
                    :show-file-list="false"
                    multiple
                    :on-success="onUploadSuccess">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
        </el-dialog>

    </div>
</template>
<script>
import { getImages, collectImage, deleteImage } from '@/api/image'

export default {
    name: 'ImageList',
    components: {},
    props: {
        //进行声明
        //是否展示 上传素材 的按钮功能

        //是否显示添加素材
        isShowAdd: {
            type: Boolean, //布尔值
            default: true // 默认值
        },
        //是否显示图片下方的收藏与删除按钮
        isShowAction: {
            type: Boolean,
            default: true
        },
        //是否展示选择
        isShowSelected: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const user = JSON.parse(window.localStorage.getItem('user'))
        return {
             collect: false, // 默认查询全部素材列表
             images: [], //图片素材列表
             dialogUploadVisible: false,
             uploadHeaders: {
                 Authorization: `Bearer ${user.token}`
             },
             totalCount: 0, //总页码数
             pageSize: 10, //每页大小
             page: 1, //当前页码
             selected: null //选中的索引
        }
    },
    computed: {},
    watch: {},
    created () {
        //页面初始化加载第 1 页数据
        this.loadImages(1)
    },
    mounted () {

    },
    methods: {
        loadImages (page = 1) {
            //重置高亮的页码，防止数据与页码不对应
            this.page = page
            getImages({
                collect: this.collect,
                page,
                per_page: this.pageSize
            }).then(res => {
                // console.log(res);
                const results = res.data.data.results
                results.forEach(img => {
                    //img 对象本来没有 loading 数据
                    //我们这里手动的往里面添加该数据是用来控制每个收藏按钮的 loading 状态
                    img.loading = false
                })

                this.images = results
                this.totalCount = res.data.data.total_count
            })
        },
        // onCollectChange () {
        //     // console.log(value);
        //     this.loadImages(1)
        // },
        onUploadSuccess () {
            //关闭对话框
            this.dialogUploadVisible = false
            //更新素材列表
            this.loadImages(this.page)

            this.$message({
                type: 'success',
                message: '上传成功'
            })
        },
        onPageChange (page) {
            // console.log(page)
            this.loadImages(page)
        },
        onCollect (img) {
            // 展示 loading
            img.loading = true
            collectImage(img.id, !img.is_collected).then(res => {
                // 更新视图状态
                img.is_collected = !img.is_collected
                //关闭 loading
                img.loading = false
            })
            // if(img.is_collected){
            //     // 如果已收藏，取消收藏
            //     collectImage(img.id, false)
            // } else {
            //     //没有收藏，点击收藏
            //     collectImage(img.id, true)
            // }           
            
        },
        onDelete (img) {
            img.loading = true
            //请求调用
            deleteImage(img.id).then(res => {
                // console.log(res);
                //重新加载数据列表
                this.loadImages(this.page)

                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
            })
                
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
    .image-item {
        position: relative;
    }
    .image-action {
        font-size: 25px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: #fff;

        height: 40px;
        background-color: rgba(204, 204, 204, .5);
        position: absolute;
        bottom: 4px;
        left: 5px;
        right: 5px;
    }
    .selected {
        background:url(./selected.png) no-repeat;
        background-size: cover;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: .8;
    }
</style>