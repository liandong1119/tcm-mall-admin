import request from '@/utils/request'

/**
 * 处理商家管理的dashboard面板数据。
 */

/**
 * 获取今日的订单数量和平均的订单金额
 * @param p
 * @returns {*}
 */
export function getTodayOrders() {
    return request({
        url: '/dashboard/todayOrder',
        method: 'get',
    })
}

/**
 * 获取待处理的订单的数量<p>
 *  包括今日的发货数量。
 * @returns {*}
 */
export function getUnProcessedOrders() {
    return request({
        url: '/dashboard/unprocessed',
        method: 'get',
    })
}

/**
 * 获取商品的库存数量
 * @returns {*}
 */
export function getAllStock(){
    return request({
        url: '/dashboard/allStock',
        method: 'get',
    })
}

/**
 * 获取今日的销售额，以及同周比信息
 * @returns {*}
 */
export function getTodaySales(){
    return request({
        url: '/dashboard/todaySales',
        method: 'get',
    })
}

/**
 * 获取最近一周的销售数量和销售的总的金额。
 * @returns {*}
 */
export function getLastWeekSales(){
    return request({
        url: '/dashboard/lastWeekSales',
        method: 'get',
    })
}

/**
 * 获取最近一周的销售数量和销售的总的金额。
 * @returns {*}
 */
export function getLastMonthSales(){
    return request({
        url: '/dashboard/lastMonthSales',
        method: 'get',
    })
}

/**
 * 获取近期的热销的商品
 */
export function getHotSellProduct(){
    return request({
        url: '/dashboard/hotSellProduct',
        method: 'get',
    })
}

/**
 * 获取不同品类的商品的销售占比
 * @returns {*}
 */
export function getCategorySales(){
    return request({
        url: '/dashboard/categorySales',
        method: 'get',
    })
}

/**
 * 获取订单状态的分布
 */
export function getStatusRate(){
    return request({
        url: '/dashboard/statusRate',
        method: 'get',
    })
}