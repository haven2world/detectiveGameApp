# detectiveGameApp
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
一个自用的app

This is an app used to play the face-to-face Detective game. And it only supports mobile phones. If you open it on pc, it will display a wrong layout. Of course, you can play the game online, but first, you have to solve the problem of communicate. This app contains a user system. You can write a Detective game script in the app, create a game room for it, invite your friends to join the room, and then you guys could enjoy the game.

## 账户密码保护
客户端传输密码时 hash = sha1(密码+loginId) 
服务端储存 sha1(hash + 随机盐)
随机盐由csprng生成 保存在数据库
