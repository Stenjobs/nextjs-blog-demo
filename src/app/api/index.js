import request from '@/utils/request'

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
export function getMyBlogApi(params) {
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
export function editBlogApi(data) {
    return request({
        url: '/blog/update',
        method: 'post',
        data
    })
}
