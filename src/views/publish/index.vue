<template>
    <div class="publish-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
            <!-- 面包屑导航区域 -->
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>                      
                </el-breadcrumb>               
            </div>

            <el-form ref="publish-form" :model="article" label-width="55px" :rules="formRules">
                <el-form-item label="标题:" prop="title">
                    <el-input v-model="article.title"></el-input>
                </el-form-item>
                <el-form-item label="内容:" prop="content">
                    <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
                    <el-tiptap v-model="article.content" :extensions="extensions"
                               lang="zh" height="350" placeholder="请输入文章内容"></el-tiptap>
                </el-form-item>
                <el-form-item label="封面:">
                    <el-radio-group v-model="article.cover.type">
                    <el-radio :label="1">单图</el-radio>
                    <el-radio :label="3">三图</el-radio>
                    <el-radio :label="0">无图</el-radio>
                    <el-radio :label="-1">自动</el-radio>
                    </el-radio-group>
                    <!-- 
                        我们需要把选择的封面图片的地址放到 article.cover.images 数组中

                        当你给事件处理函数传递了自定义参数以后，就无法得到原本的那个数据参数了。

                        如果想要在事件处理函数自定义传参以后还想得到原来的那个事件
                        本身的参数，则手动指定$event，它就代表那个事件本身的参数

                        在组件上使用 v-model
                        当你给子组件提供的数据既要使用还要修改，这个时候我们可以使用 v-model简化数据绑定
                        v-model="article.cover.images[index]" 是两句话
                            给子组件传递了一个名字叫 value 的数据
                            :value="article.cover.images[index]"
                            默认监听 input 事件，当事件发生，它会让绑定数据 = 事件参数
                            @input="article.cover.images[index] = 时间参数"
                     -->

                    <template v-if="article.cover.type > 0">
                        <!-- 引入子组件 -->
                        <!-- <upload-cover 
                            :key="cover"
                            v-for="(cover, index) in article.cover.type"
                            :cover-image="article.cover.images[index]"
                            @update-cover="onUpdateCover(index, $event)"
                        />  -->
                        <upload-cover 
                            :key="cover"
                            v-for="(cover, index) in article.cover.type"
                            v-model="article.cover.images[index]"
                        /> 
                    </template>
                </el-form-item>
                

                <el-form-item label="频道:" prop="channel_id">
                    <el-select v-model="article.channel_id" placeholder="请选择频道">
                    <el-option :label="channels.name" :value="channels.id" 
                            v-for="(channels, index) in channels" :key="index"></el-option>
                    
                    </el-select>
                </el-form-item>
                
                
                
                <el-form-item>
                    <el-button type="primary" @click="onPublish(false)">{{ $route.query.id ? '修改' : '发表' }}</el-button>
                    <el-button @click="onPublish(true)">存入草稿</el-button>
                </el-form-item>
                </el-form>
            
        </el-card>

    </div>
</template>
<script>
import { getArticleChannels, addArticle, getArticle, updateArticle } from '@/api/article'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'

import UploadCover from './components/upload-cover.vue'

import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  Image,
  CodeBlock
} from 'element-tiptap'

export default {
    name: 'PublishIndex',
    components: {
        'el-tiptap': ElementTiptap,
        UploadCover //注册组件
    },
    props: {},
    data () {
      return {
        channels: [],// 文章频道列表
        article: {
            title: '', //文章标题
            content: '', //文章内容
            cover: {
                type: 1,//封面类型 -1:自动，0-无图，1-1张，3-3张
                images: [] //封面图片的地址
            },
            channel_id: null
        },
        extensions: [
            new Doc(),
            new Text(),
            new Paragraph(),
            new Heading({ level: 5 }),
            new Bold({ bubble: true }), 
            new Underline({ bubble: true, menubar: false }), //下划线
            new Image({
                //默认会把图片生成 base64 字符串和内容存储在一起，如果需要自定义图片上传
                uploadRequest (file) {
                    // console.log('uploadRequest')
                    // 如果接口要求 Content-Type 是multipart/form-data,则请求体必须使用 FormData
                    const fd = new FormData()
                    fd.append('image', file)
                    // 第一个return是返回 Promise 对象
                    //为什么？ 因为 axios 本身就是返回 Promise 对象
                    return uploadImage(fd).then(res => {
                        // 这个return 是返回最后的结果
                        return res.data.data.url
                    })
                    
                }
            }), //图片
            new Italic(),//斜体
            new Strike(),//删除线
            new HorizontalRule(),//华丽的分割线
            new ListItem(),//
            new BulletList(),//无序列表
            new OrderedList(),//有序列表
            new TodoItem(),
            new TodoList(),
            new Fullscreen(), //全屏
            new Preview(), //预览
            
            new CodeBlock()
            
        ],
        formRules: {
            title: [
                { required: true, message: '请输入文章的标题', trigger: 'blur' },
                { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur'}
            ],
            content: [
                // { required: true, message: '请输入文章内容', trigger: 'change' }
                {
                    validator (rule, value, callback) {
                    if(value === '<p></p>') {
                        //验证失败
                        callback(new Error('请输入文章内容'))
                    } else {
                        //验证成功
                        callback()
                    }
                    }
                },
                    { required: true, message: '请输入文章内容', trigger: 'change'}                 

            ],
            channel_id: [
                { required: true, message: '请选择文章的频道' }
            ]
        }
      }
    },
    computed: {},//shif+tab 往前倒
    watch: {},
    created() {
        this.loadChannels()
        //由于我们让发布和修改使用的同一个组件
        //这里要判断，如果路由路径参数中有 id ，则请求展示文章内容
        if(this.$route.query.id) {
            this.loadArticle()
        }
    },
    mounted () {},
    methods: {
        loadChannels () {
            getArticleChannels().then(({ data }) => {
                // console.log(res);
                this.channels = data.data.channels
            })
        },
        onPublish ( draft = false) {
            this.$refs['publish-form'].validate(valid => {
                //验证失败，停止提交表单
                if(!valid) {
                    return
                }
                //验证通过，提交表单
                
                //找到数据接口
                //封装请求方法
                //请求提交表单
                //如果是修改文章，则执行修改操作，否则执行添加操作
                const articleId = this.$route.query.id
                if(articleId) {
                    //执行修改操作
                    updateArticle(articleId, this.article, draft).then(res => {
                        console.log(res)
                        this.$message({
                            message: `${draft ? '存入草稿' : '修改成功'}`,
                            type: 'success'
                        })
                        //跳转到内容管理页面
                        this.$router.push('/article')
                    })
                }else {
                    //发布文章操作
                    addArticle(this.article, draft).then(res => {
                        //处理响应结果
                        // console.log(res)
                        this.$message({
                            message: `${draft ? '存入草稿' : '发表成功'}`,
                            type: 'success'
                        })
                        //跳转到内容管理页面
                        this.$router.push('/article')
                    }) 
                } 



            })            
      }, 
      //修改文章：加载文章内容
      loadArticle () {
          console.log('loadArticle');
          //找到数据接口
          //封装请求方法
          //请求获取数据
          getArticle(this.$route.query.id).then(res => {
            //   console.log(res);
            //模板绑定展示
            this.article = res.data.data
          })
      },
        onUpdateCover (index, url) {
            // console.log('onUpdateCover', url);
            //
            this.article.cover.images[index] = url
        }
    }
}
</script>
<style lang="less">
    
</style>