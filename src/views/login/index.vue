<template>
    <div class="login-container">
        <!-- el-form 表单组件 -->

        <div class="login-form-wrap">
        <div class="login-head">
            <div class="logo"></div>
        </div>

        <!-- 配置form表单验证
            1.给el-form 组件绑定 :model="" 为表单数据对象
            2.给需要验证的表单项 el-form-item 绑定 prop="" 属性
              注意: prop 属性需要指定表单对象中的数据名称
            3.通过 el-form 组件的 rules 配置验证规则 :rules="" 在data中

            手动触发表单验证:
            1.给 el-form 设置 ref 起个名字(随便起名，不要重复即可)
            2.通过 ref 获取 el-form 组件，调用组件的 validate 方法进行验证
         -->
        <el-form :model="user" ref="login-form" class="login-form" :rules="formRules">
            <el-form-item prop="mobile">
                <el-input v-model="user.mobile" placeholder="请输入手机号" prefix-icon="el-icon-mobile"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input v-model="user.code" placeholder="请输入验证码" prefix-icon="el-icon-sunrise"></el-input>
            </el-form-item>
            <el-form-item prop="agree">
                <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
            </el-form-item>
            
            <el-form-item>
                <el-button class="login-btn" type="primary" @click="onLogin" :loading="loginLoading">登录</el-button>
                
            </el-form-item>
        </el-form>
        </div>

    </div>
</template>
<script>
// import request from '@/utils/request.js'
import { login } from '@/api/user.js'

export default {
    name: 'LoginIndex',
    components: {},
    props: {},
    data() {
        return {
            user: {
                mobile: '13911111111',//手机号
                code: '246810' ,//验证码
                agree: false //是否同意协议
            },
            
            loginLoading: false, //默认加载为false
            formRules: {//表单验证规则配置
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'change' },
                    { pattern:/^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
                ],
                code: [
                    { required: true, message: '验证码不能为空', trigger: 'change' },
                    { pattern: /^\d{6}$/, message: '请输入正确的验证码格式' }
                ],
                //
                agree: [
                    {
                        //自定义校验规则
                        //验证通过：callback()
                        //验证失败：callback(new Error('错误消息'))
                        validator: (rule, value, callback) => {
                            if(value) {
                                callback()
                            }else {
                                callback(new Error('请勾选同意用户协议'))
                            }
                            
                        },
                        // messsage: '请勾选同意用户协议',
                        trigger: 'change'
                    }
                ]
            }
        
      }        
    },
    computed: {},
    watch: {},
    created() {

    },
    mounted() {},
    methods: {
        onLogin () {
            // console.log('submit!');
            // 获取表单数据（根据接口要求绑定数据）
            const user = this.user
            //表单验证
            this.$refs['login-form'].validate(valid => {
                //如果表单验证失败，停止请求提交
                if(!valid) {
                    return
                }

                //验证通过，请求登录
                this.login()
            })

            
            
        },
        login() {
            //开启登陆中 loading...
            this.loginLoading = true

            // 对于代码中的请求操作
            // 1.接口请求可能需要重用
            // 2.实际工作中，接口非常容易变动，修改起来麻烦
            // 建议的做法是，把所有的请求封装为函数，然后统一的组织到模块中进行管理
            //这样做的好处是: 管理维护更方便，重用也方便
            login(this.user).then(res => {
                // console.log(res);

                //登录成功
                this.$message({
                    message: '登录成功',
                    type: 'success'
                });

                //关闭loading...
                this.loginLoading = false

                //将接口返回的用户相关数据放到本地存储，方便应用数据共享
                //本地存储只能存储字符串，
                //如果需要存储对象，数组类型的数据，则把他们转换为 JSON 格式字符串进行存储
                window.localStorage.setItem('user', JSON.stringify(res.data.data))

                //跳转到 home 首页
                this.$router.push({
                    name: 'home'
                })

            }).catch(err => {
                console.log('登录失败！', err);
                //登录失败
                this.$message.error('登录失败，手机号或者验证码错误！')

                //关闭loading...
                this.loginLoading = false

            })
        }     
    }
    
}
</script>
<style lang="less" scoped>
    .login-container {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: url('./云.jpg') no-repeat;
        background-size: cover;
       .login-form-wrap {
      min-width: 300px;
      padding: 30px 50px 10px;
      background-color: #fff;
      .login-head {
        display: flex;
        justify-content: center;
        // margin: 8px;
        padding: 10px;
        .logo {
          width: 100px;
          height: 57px;
          text-align: center;
          background: url('./史努比.jpeg') no-repeat;
          background-size: contain;
        }
      }
      .login-form {
        .login-btn {
          width: 100%;
        }
      }
    }
    }
</style>