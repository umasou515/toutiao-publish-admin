<template>
    <div class="upload-cover" @click="showCoverSelect">
        <div class="cover-wrap">
            <img class="cover-image"
                 ref="cover-image"
                 :src="value">
        </div>

        <el-dialog
            title="选择封面"
            :visible.sync="dialogVisible"
            append-to-body>
                <el-tabs v-model="activeName" type="card">
                    <el-tab-pane label="素材库" name="first">
                        <!--
                            进行注册后引用外部组件
                            ref 有两个作用
                            1、作用到普通 HTML 标签上可以获取 DOM
                            2、作用到组件上可以获取组件
                         -->
                        <image-list :isShowAdd="false"
                                    :isShowAction="false"
                                    isShowSelected
                                    ref="image-list"
                                />
                    </el-tab-pane>
                    <el-tab-pane label="上传图片" name="second">
                        <input type="file" 
                                @change="onFileChange" 
                                ref="file"
                                >
                        <img 
                             width="100" 
                             ref="preciew-image"
                             >
                    </el-tab-pane>
                </el-tabs>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import { uploadImage } from '@/api/image'
import ImageList from '@/views/image/components/image-list'

export default {
    name: 'UploadCover',
    components: {
        // 外部组件注册在这里使用
        ImageList
    },
    // props: ['cover-image'],
    props: ['value'],
    data () {
        return {
            dialogVisible: false,
            activeName: 'first'
        }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
        showCoverSelect () {
            // 展示选择封面的弹窗
            this.dialogVisible = true
        },
        onFileChange () {
            // console.log('file change');
            //获取文件对象
            const file = this.$refs.file.files[0]
            //图片预览
            const blob = window.URL.createObjectURL(file)
            //拿到图片
            this.$refs['preciew-image'].src = blob
            // 防止用户选择同一个文件不触发 change 事件
            // this.$refs.file.value = ''
        },
        onCoverConfirm () {
            //如果 tab 是上传图片，并且 input-file 有选择的文件，才执行上传图片的操作
            if (this.activeName === 'second') {
                const file = this.$refs.file.files[0]
                if(!file) {
                    this.$message('请选择文件')
                    return
                }
                //执行上传文件的操作
                const fd = new FormData()
                fd.append('image', file)
                uploadImage(fd).then(res => {
                    console.log(res)
                    //关闭弹出层
                    this.dialogVisible = false
                    //展示上传的图片
                    this.$refs['cover-image'].src = res.data.data.url

                    //将图片地址发送给父组件
                    // this.$emit('update-cover', res.data.data.url)
                    this.$emit('input', res.data.data.url)
                })
            } else if (this.activeName === 'first') {
                //还有一种组件通信方式：父组件可以直接访问子组件中的数据
                const imageList = this.$refs['image-list']
                // console.log(imageList.selected)
                const selected = imageList.selected
                if (selected === null) {
                    this.$message('请选择封面图片')
                    return
                }
                //关闭对话框
                this.dialogVisible = false
                // 修改父组件绑定数据
                this.$emit('input', imageList.images[selected].url)
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .cover-wrap {
        width: 185px;
        height: 120px;
        border: 1px solid #000;
        display: flex;
        justify-content: space-between;
        .cover-image {
            height: 120px;
            max-width: 100%;
        }
    }
</style>