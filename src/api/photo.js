import request from '@/utils/request'
import {ElMessage} from "element-plus";


// 商品图片上传
export function uploadProductImage(data) {
    return request({
        url: '/photo/upload',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

/**
 * 删除一张图片（图片上传后，不想使用这个，便删除图片）
 * @returns {*}
 * @param data
 */
export function deletePhoto(data) {
    return request({
        url: `/photo`,
        method: 'delete',
        data
    }).then(res => {
        ElMessage.success("删除成功")
    })
}