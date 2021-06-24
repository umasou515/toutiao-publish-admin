/**
 * 文章相关请求模块
 */
// import article from '@/utils/request'
import request from '../utils/request'

/**
 * 获取文章列表
 */
export const getArticles = (abcparams) => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/articles',
        // Body 参数使用 data 设置
        // Query 参数使用 params 设置
        // Headers 参数使用 headers 设置
        // abc 为上面的形参,ES6中当属姓名和对象值一致时，可直接简写
        params: abcparams
    })
}


/**
 * 获取文章频道
 */
 export const getArticleChannels = () => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/channels',
        // Body 参数使用 data 设置
        // Query 参数使用 params 设置
        // Headers 参数使用 headers 设置
    })
}

/**
 * 删除文章
 */
 export const deleteArticle = (articleId) => {
    return request({
        method: 'DELETE',
        //接口文档中的写的路径参数需要在 url 中传递
        // 凡是看见接口路径中有 :xxx 格式的字段，则需要传递路径参数
        url: `/mp/v1_0/articles/${articleId}`,
        // Body 参数使用 data 设置
        // Query 参数使用 params 设置
        // Headers 参数使用 headers 设置
        // target 参数，${ :target }
    })
}

/**
 * 新建文章
 */
 export const addArticle = (data, draft = false ) => {
    return request({
        method: 'POST',
        url: '/mp/v1_0/articles',
        // Body 参数使用 data 设置
        // Query 参数使用 params 设置
        // Headers 参数使用 headers 设置
        params: {
            draft //是否存为草稿(true 为草稿)
        },
        data
    })
}

/**
 * 获取指定文章
 */
 export const getArticle = (articleId) => {
    return request({
        method: 'GET',
        url: `/mp/v1_0/articles/${articleId}`,
        // Body 参数使用 data 设置
        // Query 参数使用 params 设置
        // Headers 参数使用 headers 设置
    })
}

/**
 * 编辑文章
 */
 export const updateArticle = (articleId, data, draft = false) => {
    return request({
        method: 'PUT',
        url: `/mp/v1_0/articles/${articleId}`,
        // Body 参数使用 data 设置
        // Query 参数使用 params 设置
        // Headers 参数使用 headers 设置
        params: {
            draft //是否存为草稿(true 为草稿)
        },
        data
    })
}

/**
 * 修改文章评论状态
 */
 export const updateCommentStatus = (articleId, allowComment) => {
    return request({
        method: 'PUT',
        url: '/mp/v1_0/comments/status',
        // Body 参数使用 data 设置
        // Query 参数使用 params 设置
        // Headers 参数使用 headers 设置
        params: {
            //对象的属性名不受代码规范限制
            article_id: articleId //是否存为草稿(true 为草稿)
        },
        data: {
            allow_comment: allowComment
        }
    })
}


