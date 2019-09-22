# detectiveGameApp
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)

## Description
This is an app used to play the face-to-face Detective game. And it only supports mobile phones. Of course, you can play the game online, but first, you have to solve the problem of communications. This app contains a user system. You can write a Detective game script in the app, create a game room for it, invite your friends to join the room, and then you guys could enjoy the game.

## 简介
这是一个用于进行面对面侦探游戏的 App。 暂时只支持手机使用，因为没有做 pc 端适配的原因，用电脑打开布局会比较奇怪。你也可以利用它在线上玩游戏，但是 App 本身不提供聊天功能，所以你得自己想办法沟通。你可以用这个 App 去编写脚本，创建房间，然后邀请你的朋友来加入你的房间一起玩你写的剧本。

## 开发记录

### 前端
- 通过 Umi 直接搭建的 react
- UI 库使用的 Ant Design Mobile
- 大部分页面都是普通请求走 Axios，玩家游戏页面使用我自己封装的 websocket 保证推送的及时性
- 体验了 react hook 封装逻辑，体验很好，十分灵活
- 直接部署在 Nginx 下作为静态资源

### 后端
- 使用 koa2 搭建后端
- 自行设计了 controller 层 service 层 dao 层和 modal 层
- 数据库使用 Mongo 储存剧本的大量文本
- 自行设计了 websocket 的路由层
- 使用 pm2 部署， Nginx 转发

### 账号系统 - 账户密码保护
客户端传输密码时 hash = sha1(密码+loginId) 
服务端储存 sha1(hash + 随机盐)
随机盐由csprng生成 保存在数据库
 
