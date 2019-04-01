# detectiveGameApp
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
一个自用的app

## 账户密码保护
客户端传输密码时 hash = sha1(密码+loginId) 
服务端储存 sha1(hash + 随机盐)
随机盐由csprng生成 保存在数据库
