import request from '@/utils/request'

export function getUserSlatApi(params) {
    return request({
        url: '/blog/user-stats',
        method: 'get',
        params
    })
}

// 导出一个函数addstarApi，用于添加星星
export function starBlogApi(data) {
    // 发送post请求，url为/blog/star，data为传入的数据
    return request({
        url: '/blog/star',
        method: 'post',
        data
    })
}
// 统计接口

export function analysisApi() {
    return request({
        url: '/blog/analytics',
        method: 'get'
    })
}

// 回复评论
export function replyCommentApi(data) {
    return request({
        url: '/blog/comment/reply',
        method: 'post',
        data
    })
}

// 评论
export function addCommentApi(data) {
    return request({
        url: '/blog/comment',
        method: 'post',
        data
    })
}   

// 点赞
export function likeBlogApi(data) {
    return request({
        url: '/blog/like',
        method: 'post',
        data
    })
}

// 详情
export function getBlogDetailApi(params) {
    return request({
        url: '/blog/detail',
        method: 'get',
        params
    })
}

// 我的博客
export function getMyBlogsApi(params) {
    return request({
        url: '/blog/mylist',
        method: 'get',
        params
    })
}

// 列表
export function getBlogListApi(params) {
    return request({
        url: '/blog/list',
        method: 'get',
        params
    })
}

// 添加
export function addBlogApi(data) {
    return request({
        url: '/blog/new',
        method: 'post',
        data
    })
}

// 删除
export function deleteBlogApi(data) {
    return request({
        url: '/blog/del',
        method: 'post',
        data
    })
}

// 编辑
export function updateBlogApi(data) {
    return request({
        url: '/blog/update',
        method: 'post',
        data
    })
}
// 注册
export function registerApi(data) {
    return request({
        url: '/user/register',
        method: 'post',
        data
    })
}
// 获取用户列表
export function getUserListApi(params) {
    return request({
        url: '/user/list',
        method: 'get',
        params
    })
}

// 更新用户信息
export function updateUserInfoApi(data) {
    return request({
        url: '/user/update',
        method: 'post',
        data
    })
}

// 导出用户列表
export function exportUserListApi(params) {
    return request({
        url: '/user/export',
        method: 'get',
        params,
        responseType: 'blob'
    })
}

// 登录
export function loginApi(data) {
    return request({
      url: '/user/login',
      method: 'post',
      data
    })
  }


