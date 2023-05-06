## 景洪综治平台微信端代码
##### V0.0.1 版本

## 控件说明
控件使用[uview](https://www.uviewui.com/)，如无特殊需求不建议引用新的控件

## Request请求使用说明
使用已有控件[luch-request](https://github.com/lei-mu/luch-request)，api中有使用的例子，
支持单独配置，特殊情况请查阅官网

## css说明
使用 [colorui](https://github.com/weilanwl/ColorUI)，布局及部分样式可直接调用

## 以上组件基本覆盖常规使用，请勿再增加其他插件，有疑问先沟通

## 项目结构
##### 目录结构描述
├── api                        # 构建相关  
├── colorui                    # coloruicss组件
├── common                     # 通用工具组件  
│   │── request                # 请求控件  
├── components                 # 其他组件  
├── page                       # 源代码  
│   ├── main                   # 主页  
│   ├── login                  # 登陆页面  
├── static                     # 静态资源  
├── store                      # 缓存  
├── utils                      # 通用方法  
├── uview-ui                   # uview组件
├── App.vue                    # 初始化文件  
├── main.js                    # 入口文件  
├── mainfest.json              # uniapp 配置  
├── pages.json                 # 页面配置  
└── uni.scss                   # 内置的常用样式变量  
