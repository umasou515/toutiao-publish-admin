<template>
    <div class="settings-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
            <!-- 面包屑导航区域 -->
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>个人设置</el-breadcrumb-item>                      
                </el-breadcrumb>               
            </div>
            <el-row>
              <el-col :span="15">
                <el-form :model="user" ref="form" label-width="100px" :rules="formRules">
                  <el-form-item label="编号：" prop="id">
                    {{ user.id }}
                  </el-form-item>
                  <el-form-item label="手机：" prop="mobile">
                    {{ user.mobile }}
                  </el-form-item>

                  <el-form-item label="媒体名称：" prop="name">
                    <el-input v-model="user.name"></el-input>
                  </el-form-item>

                  <el-form-item label="媒体介绍：" prop="intro">
                    <el-input type="textarea" v-model="user.intro"></el-input>
                  </el-form-item>              
                  <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="user.email"></el-input>
                  </el-form-item>
                  
                  <el-form-item>
                    <el-button type="primary" @click="onUpdateUser"
                                :loading="updateProfileLoading">保存</el-button>               
                  </el-form-item>
                </el-form>
              </el-col>
              
              <el-col :span="5" :offset="3">
                <el-avatar shape="circle" :size="200" :fit="'cover'" 
                            :src="user.photo"
                          ></el-avatar>
                          <p @click="$refs.file.click()">点击修改头像1</p>
                          <input type="file" hidden ref="file" @change="onFileChange">
                          <!-- <label for="file2">点击修改头像2</label>
                          <input id="file2" hidden type="file"> -->
              </el-col>             
            </el-row>
        </el-card>

        <el-dialog
          title="修改头像"
          :visible.sync="dialogVisible"
          append-to-body
          @opened="onDialogOpened"
          @closed="onDialogClosed">

          <div class="preview-image-wrap">
            <img class="preview-imgage" 
                 :src="previewImage"
                 ref="preview-image"
            >

          </div>
          
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onUpdatePhoto"
                        :loading="updatePhotoLoading">确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>
<script>
import {  
        getUserProfile, 
        updateUserPhoto, 
        updateUserProfile
} from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'


export default {
    name: 'SettingsIndex',
    components: {},
    props: {},
    data () {
        return {
            user: {
              email: '',
              id: null,
              intro: '',
              mobile: '',
              name: '',
              photo: ''
            }, // 用户资料
            //表单验证
            formRules: {
                name: [
                    { required: true, message: '请输入媒体的名称', trigger: 'blur' },
                    { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
                ],
                intro: [
                  // { required: true, message: '请输入文章内容', trigger: 'change' }
                  {
                      validator (rule, value, callback) {
                      if(value === '<p></p>') {
                          //验证失败
                          callback(new Error('请输入媒体介绍内容'))
                      } else {
                          //验证成功
                          callback()
                      }
                      }
                  },
                      { required: true, message: '请输入文章内容', trigger: 'change'}                 
                ],
                email: [
                  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]

            },
            dialogVisible: false, //控制上传图片裁切预览的显示
            previewImage: '', // 预览图片
            cropper: null, //裁切器示例
            updatePhotoLoading: false, //更新用户头像的 loading 状态
            updateProfileLoading: false //更新基本信息的 loading 状态
        }
    },
    computed: {},
    watch: {},
    created () {
      this.loadUser()
    },
    mounted () {},
    methods: {
      onUpdateUser () {
        // console.log('submit!')
        //表单验证
        //开启 loading 状态
        this.updateProfileLoading = true
        //验证通过，提交表单
        const { name, intro, email } = this.user  //解构
        updateUserProfile({
          name,
          intro,
          email
        }).then(res => {
          // console.log(res);
          this.$message({
            type: 'success',
            method: '保存成功'
          })
          // 关闭 loading 状态
          this.updatePhotoLoading = false

          // 更新头部当前登录用户的信息
          // 发布通知， 用户信息已修改
          globalBus.$emit('update-user', this.user)
        })       
      },
      loadUser () {
        getUserProfile().then(res => {
          // console.log(res)
          this.user = res.data.data
        })
      },

      onFileChange () {
        //处理图片预览
        const file = this.$refs.file

        //得到图片的文件对象
        const blobData = window.URL.createObjectURL(file.files[0])
        this.previewImage = blobData

        console.log(blobData)
        //展示弹出层，预览用户选择的图片
        this.dialogVisible = true

        //解决选择相同文件不触发 change 事件的问题
        this.$refs.file.value = ''
      },
      //初始化裁切器
      onDialogOpened () {
        //图片裁切器必须基于 img 进行初始化
        //注意：img 必须是可见状态才能正常完成初始化(完全打开状态opened)
        // 因为我们这里要在对话框里面初始化裁切器,所以务必要在对话框完全打开的状态下初始化
        //获取图片的 DOM 节点
        const image = this.$refs['preview-image']
        //第 1 次初始化完以后，如果预览裁切的图片发生了变化，裁切器默认不会更新
        //如果需要预览图片发生变化更新裁切器：
        //     方式一：裁切器.replace 方法
        //     方式二：销毁裁切器，重新初始化
        // 初始化裁切器

        // if(this.cropper) {
        //   this.cropper.replace(this.previewImage)
        //   return
        // } //第 2 种方法
        this.cropper = new Cropper(image, {
          aspectRatio: 16 / 9,
          viewMode: 1, // 画布范围内
          dragMode: 'none', //移动画布
          cropBoxMovable: true,//裁切器移动
          cropBoxResizable: false,
          // background: false, //背景
          // movable: true

          //当你移动裁切器的时候回触发调用 crop 方法
          // crop (event) {
          //   console.log(event.detail.x)
          //   console.log(event.detail.y)
          //   console.log(event.detail.width)
          //   console.log(event.detail.height)
          //   console.log(event.detail.rotate)
          //   console.log(event.detail.scaleX)
          //   console.log(event.detail.scaleY)
          // }
        })

      },
      onDialogClosed () {
        //关闭对话框，销毁裁切器,第 1 种方法
        this.cropper.destroy()
      },
      onUpdatePhoto () {
        //让确定按钮开始 loading
        this.updatePhotoLoading = true
        // 获取裁切的图片对象
        this.cropper.getCroppedCanvas().toBlob(file => {
          const fd = new FormData()
          fd.append('photo', file)
          //请求更新用户头像  请求提交 fd
          updateUserPhoto(fd).then(res => {
            console.log(res)
            //关闭对话框
            this.dialogVisible = false
            // 更新视图展示

            //直接把裁切结果的文件对象转为 blob 数据本地预览
            this.user.photo = window.URL.createObjectURL(file)

            //关闭确定按钮的loading
            this.updatePhotoLoading = false

            // 友情提示
            this.$message({
              type: 'success',
              method: '更新头像成功'
            })

            // 更新顶部登录用户的信息
            globalBus.$emit('update-user', this.user)
            
            // 把服务端返回的图片进行展示有点慢
            // this.user.photo = res.data.data.photo
          })
        })
      }


    }
    
}
</script>
<style lang="less" scoped>
      /* Ensure the size of the image fit the container perfectly */
      .preview-image-wrap{
        display: block;

        /* This rule is very important, please don't ignore this */
        max-width: 100%;
        height: 200px;
      }
</style>