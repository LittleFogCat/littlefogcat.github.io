---
title: V2Ray 报错 failed to handler mux client connection... 的解决方式
date: 2023-12-12 01:10:08
tags: [翻墙, v2ray]
categories: 翻墙
---

通过 `tail -f /var/log/v2ray/access.log` 命令查看 V2Ray 的日志，发现报错 `VMessAEAD is enforced and a non VMessAEAD connection is received. You can still disable this security feature with environment variable v2ray.vmess.aead.forced = false`。

根据 [文章](https://zaxin.gitlab.io/2022/01/08/) 所述，在 v2ray.service 文件中添加一行 `Environment="V2RAY_VMESS_AEAD_FORCED=false"` 即可。我使用的 [233boy脚本](https://233boy.com/v2ray/v2ray-script/) 安装在 Ubuntu 18.04 上，该文件位于 `/lib/systemd/system/v2ray.service`。

修改完即可正常连接。