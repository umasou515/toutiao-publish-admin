/**
 * 用户相关请求模块
 */

import request from "@/utils/request"

//用户登录
export const login = (data) => {
    return request({
        method: 'POST',
        url: '/mp/v1_0/authorizations',
        // data用来设置 POST 请求体
        data: data
    })
}

//获取用户信息
export const getUserProfile = () =>{
    //用 JSON 还原为原来的数据对象
    // const user = JSON.parse(window.localStorage.getItem('user'))
    
    return request ({
        method: 'GET',
        url: '/mp/v1_0/user/profile'
        //后端要求把需要授权的用户身份放到请求头中
        // axios 可以通过 headers 选项设置请求头
        // headers: {
        //     //属性名和值都得看接口的要求
        //     //属性名：Authorization ,接口要求的
        //     //属性值；'Bearer'空格 token数据
        //     Authorization: `Bearer ${user.token}` 
        // }
    })
}

//修改用户头像
export const updateUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: '/mp/v1_0/user/photo',
        //一般文件上传的接口都要求把请求头中的 Content-Type 设置为 multipart/form-data
        //但是我们使用 axios 上传文件的话不需要手动设置，你只要给 data 一个 FormData 对象即可
        // new FormData()
        data
    })
}

//修改用户基本信息
export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/mp/v1_0/user/profile',
        //一般文件上传的接口都要求把请求头中的 Content-Type 设置为 multipart/form-data
        //但是我们使用 axios 上传文件的话不需要手动设置，你只要给 data 一个 FormData 对象即可
        // new FormData()
        data
    })
}