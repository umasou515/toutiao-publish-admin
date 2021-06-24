<template>
    <div class="layout-container">
       <!-- <div>顶部导航栏</div> 
       <div>底部导航栏</div>     -->
        <!-- 子路由出口 -->
        <!-- <router-view/>        -->
       
       <el-container class="layout-container">
          <el-aside class="aside" width="auto">
              <app-aside class="aside-menu" :is-collapse="isCollapse"/>
          </el-aside>
          <el-container>
              <el-header class="header">
                <div>
                  <i :class="{ 'el-icon-s-fold': isCollapse, 'el-icon-s-unfold': !isCollapse }" @click="isCollapse = !isCollapse"></i>
                  <span>迈禾科技有限公司</span>
                </div>
                  
                <el-dropdown>
                    <div class="avatar-wrap">
                        <img  class="avatar" :src="user.photo" alt="">
                        <span>{{ user.name }}</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </div>
                    <!-- <span>
                        Hello<i class="el-icon-arrow-down el-icon--right"></i>
                    </span> -->
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>个人设置</el-dropdown-item>
                        <el-dropdown-item @click.native="onLogout">退出登录</el-dropdown-item>

                    </el-dropdown-menu>
                </el-dropdown>

              </el-header>
              <el-main class="main">
                  <!-- 子路由出口 -->
                  <router-view/>
              </el-main>
          </el-container>
       </el-container>

    </div>
</template>
<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'

import globalBus from '@/utils/global-bus'


export default {
    name: 'LayoutIndex',
    components: {
        AppAside
    },
    props: {},
    data () {
        return {
            user: {}, // 当前登录用户信息
            isCollapse: false // 侧边菜单栏的展示状态
        }
    },
    mounted: {},
    watch: {},
    created () {
        //组件初始化好，请求获取用户的资料
        this.loadUserProfile(),

        // 注册自定义事件
        // 当这个事件发布以后， 这个注册函数就会被调用
        globalBus.$on('update-user', (data) => {
            // console.log('update-user', data)
            // this.user = data //注意: 不要这么做，对象之间赋值的是引用，会导致相互影响的问题
            this.user.name = data.name
            this.user.photo = data.photo
        })
    },
    mounted () {},
    methods: {
        //除了登录接口，其他所有接口都需要授权才能使用
        //或者说，除了登录接口，其他接口都需要提供你的身份令牌才能获取数据
        loadUserProfile () {
            getUserProfile().then(res => {
                // console.log(res);
                this.user = res.data.data
            })
        },

        //退出登录
        onLogout() {
        this.$confirm('此操作将退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
             //清空 token
            window.localStorage.removeItem('user')
            //跳转到登录页
            this.$router.push('/login');
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })          
        })

        }
    }
}
</script>
<style lang="less" scoped>
    .layout-container {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .aside {
        background-color: #d3dce6;
        .aside-menu {
            height: 100%;
        }
    }
    .header {
        height: 60px;
        // background-color: #b3c0d1;
        display: flex;//水平布局
        justify-content: space-between;//内部元素左右撑开
        align-items: center;//垂直居中
        border-bottom: 1px solid #ccc;//底边框颜色
    }
    .main {
        background-color: #e9eef3;
    }

    .avatar-wrap {
        display: flex;//水平居中
        align-items: center;//垂直
        justify-content: center;
        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }

        
    }
</style>