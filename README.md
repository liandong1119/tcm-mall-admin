# 中药商城管理系统 (TCM Mall Admin)

基于 Vue 3 + Vite 开发的中药商城管理系统前端项目。

## 技术栈

- Vue 3.4.15
- Vite 5.0.12
- Vue Router 4.2.5
- Pinia 2.1.7
- Element Plus 2.9.5
- Vue I18n 9.9.0
- Axios 1.7.9
- ECharts 5.6.0

## 开发环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

## 项目设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
tcm-mall-admin/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   ├── assets/            # 项目资源
│   ├── components/        # 公共组件
│   ├── i18n/             # 国际化配置
│   ├── layout/           # 布局组件
│   ├── locales/          # 语言文件
│   ├── router/           # 路由配置
│   ├── store/            # Pinia 状态管理
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── .env                   # 环境变量
├── index.html            # HTML 模板
├── package.json          # 项目配置
└── vite.config.js        # Vite 配置
```

## API 文档

### 用户管理 API

#### 获取用户列表
- 请求方法：GET
- 路径：/admin/users
- 参数：
  ```javascript
  {
    page: Number,       // 页码
    pageSize: Number,   // 每页数量
    username: String,   // 用户名（可选）
    status: Number      // 状态（可选）
  }
  ```
- 响应示例：
  ```javascript
  {
    "code": 0,
    "message": "success",
    "data": {
      "total": 100,
      "list": [
        {
          "id": "1",
          "username": "user123",
          "nickname": "张三",
          "phone": "13800138000",
          "email": "user123@example.com",
          "status": 1,
          "createTime": "2024-02-24 10:00:00",
          "lastLoginTime": "2024-02-24 15:30:00"
        }
      ]
    }
  }
  ```

#### 更新用户状态
- 请求方法：PUT
- 路径：/admin/users/{id}/status
- 参数：
  ```javascript
  {
    status: Number      // 状态：0-禁用，1-启用
  }
  ```
- 响应示例：
  ```javascript
  {
    "code": 0,
    "message": "success",
    "data": null
  }
  ```

### 商品管理 API

#### 获取商品列表
- 请求方法：GET
- 路径：/products
- 参数：
  ```javascript
  {
    page: Number,       // 页码
    pageSize: Number,   // 每页数量
    name: String,       // 商品名称（可选）
    category: String,   // 分类ID（可选）
    status: Number      // 状态（可选）
  }
  ```
- 响应示例：
  ```javascript
  {
    "code": 0,
    "message": "success",
    "data": {
      "total": 100,
      "list": [
        {
          "id": "1",
          "name": "人参",
          "categoryId": "1",
          "category": "补气类",
          "price": 299.99,
          "stock": 100,
          "status": 1,
          "images": [
            "http://example.com/images/1.jpg"
          ],
          "description": "优质人参",
          "createTime": "2024-02-24 10:00:00"
        }
      ]
    }
  }
  ```

#### 添加商品
- 请求方法：POST
- 路径：/products
- 参数：
  ```javascript
  {
    name: String,       // 商品名称
    categoryId: String, // 分类ID
    price: Number,      // 价格
    stock: Number,      // 库存
    images: Array,      // 图片列表
    description: String // 描述
  }
  ```
- 响应示例：
  ```javascript
  {
    "code": 0,
    "message": "success",
    "data": {
      "id": "1",
      "name": "人参",
      "categoryId": "1",
      "price": 299.99,
      "stock": 100,
      "images": ["http://example.com/images/1.jpg"],
      "description": "优质人参",
      "createTime": "2024-02-24 10:00:00"
    }
  }
  ```

### 订单管理 API

#### 获取订单列表
- 请求方法：GET
- 路径：/admin/orders
- 参数：
  ```javascript
  {
    page: Number,       // 页码
    pageSize: Number,   // 每页数量
    orderNo: String,    // 订单号（可选）
    status: String      // 状态（可选）
  }
  ```
- 响应示例：
  ```javascript
  {
    "code": 0,
    "message": "success",
    "data": {
      "total": 100,
      "list": [
        {
          "id": "1",
          "orderNo": "202402240001",
          "amount": 599.98,
          "status": "paid",
          "customerName": "张三",
          "phone": "13800138000",
          "createTime": "2024-02-24 10:00:00",
          "items": [
            {
              "id": "1",
              "name": "人参",
              "price": 299.99,
              "quantity": 2,
              "images": ["http://example.com/images/1.jpg"]
            }
          ]
        }
      ]
    }
  }
  ```

#### 发货
- 请求方法：POST
- 路径：/admin/orders/{id}/ship
- 参数：
  ```javascript
  {
    trackingNo: String, // 快递单号
    carrier: String     // 快递公司
  }
  ```
- 响应示例：
  ```javascript
  {
    "code": 0,
    "message": "success",
    "data": {
      "id": "1",
      "orderNo": "202402240001",
      "status": "shipped",
      "shipping": {
        "trackingNo": "SF1234567890",
        "carrier": "SF",
        "shipTime": "2024-02-24 15:30:00"
      }
    }
  }
  ```

### 退款管理 API

#### 获取退款列表
- 请求方法：GET
- 路径：/admin/refunds
- 参数：
  ```javascript
  {
    page: Number,       // 页码
    pageSize: Number,   // 每页数量
    status: String      // 状态（可选）
  }
  ```
- 响应示例：
  ```javascript
  {
    "code": 0,
    "message": "success",
    "data": {
      "total": 100,
      "list": [
        {
          "id": "1",
          "orderNo": "202402240001",
          "amount": 599.98,
          "reason": "商品质量问题",
          "status": "pending",
          "createTime": "2024-02-24 10:00:00",
          "evidence": [
            "http://example.com/images/evidence1.jpg"
          ]
        }
      ]
    }
  }
  ```

#### 处理退款
- 请求方法：POST
- 路径：/admin/refunds/{id}/handle
- 参数：
  ```javascript
  {
    status: String,     // 状态：approved/rejected
    reason: String      // 拒绝原因（拒绝时必填）
  }
  ```
- 响应示例：
  ```javascript
  {
    "code": 0,
    "message": "success",
    "data": {
      "id": "1",
      "status": "approved",
      "handleTime": "2024-02-24 15:30:00"
    }
  }
  ```

### 商家管理 API

#### 获取商家列表
- 请求方法：GET
- 路径：/admin/merchants
- 参数：
  ```javascript
  {
    page: Number,       // 页码
    pageSize: Number,   // 每页数量
    name: String,       // 商家名称（可选）
    status: Number      // 状态（可选）
  }
  ```
- 响应示例：
  ```javascript
  {
    "code": 0,
    "message": "success",
    "data": {
      "total": 100,
      "list": [
        {
          "id": "1",
          "name": "同仁堂",
          "contact": "李四",
          "phone": "13900139000",
          "email": "merchant@example.com",
          "address": "北京市东城区东华门街道",
          "status": 1,
          "createTime": "2024-02-24 10:00:00"
        }
      ]
    }
  }
  ```

#### 更新商家状态
- 请求方法：PUT
- 路径：/admin/merchants/{id}/status
- 参数：
  ```javascript
  {
    status: Number      // 状态：0-禁用，1-启用
  }
  ```
- 响应示例：
  ```javascript
  {
    "code": 0,
    "message": "success",
    "data": null
  }
  ```

### 评价管理 API

#### 获取评价列表
- 请求方法：GET
- 路径：/reviews
- 参数：
  ```javascript
  {
    page: Number,       // 页码
    pageSize: Number,   // 每页数量
    productName: String,// 商品名称（可选）
    rating: Number,     // 评分（可选）
    status: String      // 状态（可选）
  }
  ```
- 响应示例：
  ```javascript
  {
    "code": 0,
    "message": "success",
    "data": {
      "total": 100,
      "list": [
        {
          "id": "1",
          "productName": "人参",
          "rating": 5,
          "content": "商品质量很好",
          "username": "user123",
          "createTime": "2024-02-24 10:00:00",
          "images": [
            "http://example.com/images/review1.jpg"
          ],
          "reply": "感谢您的购买和评价",
          "status": "replied"
        }
      ]
    }
  }
  ```

#### 回复评价
- 请求方法：POST
- 路径：/admin/review/reply
- 参数：
  ```javascript
  {
    id: String,        // 评价ID
    content: String    // 回复内容
  }
  ```
- 响应示例：
  ```javascript
  {
    "code": 0,
    "message": "success",
    "data": {
      "id": "1",
      "reply": "感谢您的购买和评价",
      "replyTime": "2024-02-24 15:30:00"
    }
  }
  ```

## 状态码说明

- 200：成功
- 400：请求参数错误
- 401：未授权
- 403：禁止访问
- 404：资源不存在
- 500：服务器错误

## 环境变量配置

```env
# API 基础路径
VITE_APP_API_BASE_URL=http://localhost:3000/api

# 上传文件路径
VITE_APP_UPLOAD_URL=http://localhost:3000/api/upload

# 系统标题
VITE_APP_TITLE=中药商城管理系统
VITE_APP_TITLE_EN=TCM Mall Admin
```

## 国际化支持

系统支持中文和英文两种语言，可以通过右上角的语言切换按钮进行切换。语言文件位于 `src/locales` 目录下：

- zh.js：中文语言包
- en.js：英文语言包

## 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/xxx`
3. 提交更改：`git commit -m 'Add some feature'`
4. 推送到分支：`git push origin feature/xxx`
5. 提交 Pull Request

## 许可证

[MIT](https://opensource.org/licenses/MIT)
