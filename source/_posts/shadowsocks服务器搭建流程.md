---
title: shadowsocks服务器搭建流程
date: 2020-02-12 01:10:08
tags: [翻墙]
categories: 翻墙
---

最近很闹心。
一是一直白嫖的ss账号用不了了，二是github也被墙了，改host都没用。还是自己搭个梯子靠谱。

<!--more-->

# 1. 服务商的选择
## 1.1 hostwind
最便宜的一个月4.5刀。这个vps是之前我用过一段时间的，速度不算特别快，但胜在稳定，而且一直没被封！但是由于价格原因放弃之。

## 1.2 vultr
我现在用的vps，最便宜的有3.5刀的（听说有2.5bug不知道好使不），目前还没遇到什么问题，因为可以免费换ip所以也不怕被封。现在vultr新注册用户送100刀（[注册地址aff](https://www.vultr.com/?ref=8445517-6G)），虽然有效期只有一个月，不过能白嫖自然是好的。


## 1.3 搬瓦工
这个地址特山寨的官网竟然是真·官网：[https://bwh88.net/](https://bwh88.net/)
50刀一年，算下来一个月不到4.2刀。老牌的一个vps，不过据说最近可能被封，而且换ip好像要收费？总之就是没有选择他了。

# 2.购买服务器
以vultr为例。
首先注册成功之后，会要求充值。充值完才能购买服务器。和其他服务商不同，这个服务器是按照每小时来计费的，而不是一个月。所以当不用的时候把服务器删掉，就不会扣费了（用了多少小时扣多少小时）。但是很坑的地方在于充值10刀起步，不过这个钱是可以退的，自行百度。

- 点击deploy
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200218005548983.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbmdzaWRvdQ==,size_16,color_FFFFFF,t_70)
- 选择cloud compute，地址选Atlanta或者NY（有3.5刀一月的），系统建议ubuntu，然后Deploy Now

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200218005854351.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbmdzaWRvdQ==,size_16,color_FFFFFF,t_70)
然后就购买成功了。

**然后重要的地方**，检查一下这个ip是否被封[https://www.toolsdaquan.com/ipcheck/](https://www.toolsdaquan.com/ipcheck/)
在这个网址输入你刚才买的服务器ip，如果都是可用的话，那么就是ok的。如果是不可用，那么ip就被封了，需要更换服务器。(方法见**3.2.2**)


# 3. 服务器搭建
## 3.1 配置shadowsocks
1. 输入以下命令安装python和shadowsocks：
apt-get update
apt-get install python-pip
pip install shadowsocks
pip 是 python 下的方便安装的工具

 2. 写一个配置文件保存为/etc/ss.json，文件内容如下：
{
  "server":"0.0.0.0", // 填自己服务器的 ip 地址
  "server_port":8388,
  "local_port":1080,
  "password":"xxxxxxxxx",// 填写密码
  "timeout":600,
  "method":"aes-256-cfb",
}

3. 启动ss服务
ssserver -c /etc/shadowsocks.json -d start

4. 停止ss服务
ssserver -c /etc/shadowsocks.json -d stop

本节内容来自：[https://www.jianshu.com/p/f6508078d918](https://www.jianshu.com/p/f6508078d918)

## 3.2 其他
到3.1为止，shadowsocks服务正常运行了。不出意外的话，我们用客户端连接服务器就可以进行fq了。
但是生活那能缺得了意外呢？

### 3.2.1 开启bbr算法
开启bbr算法可以极大提高速度。我遇到一部分的机器是默认开启bbr的，但是大部分是需要我们手动打开的。
本节来自：[https://blog.csdn.net/dta0502/article/details/81544165](https://blog.csdn.net/dta0502/article/details/81544165)

启用BBR算法之前首先要确定系统的Linux内核版本在4.9以上。

1. **查看内核版本**
`uname -a`
如果内核版本小于4.9则需要更新内核，4.9及以上跳过第二步

2. **更新内核**
此方法仅适用于Ubuntu和Debian 
首先查看系统位数，执行以下命令
`getconf LONG_BIT`
下载4.11的内核：
#32位
`wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.11/linux-image-4.11.0-041100-generic_4.11.0-041100.201705041534_i386.deb`
 #64位
`wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.11/linux-image-4.11.0-041100-generic_4.11.0-041100.201705041534_amd64.deb`
安装内核：
`dpkg -i *.deb`
`/usr/sbin/update-grub`
安装完成后立即重启系统

3. **启用BBR算法**
写入配置文件：
`echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf`
`echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf`
使配置文件生效：
`sysctl -p`
检查BBR算法是否成功开启：
`sysctl net.ipv4.tcp_available_congestion_control`
如果开启成功会返回以下内容：
`net.ipv4.tcp_available_congestion_control = bbr cubic reno`
开启bbr算法后的效果很明显，某些服务器的速度可以提升十倍以上。


### 3.2.2 ip被封
前面说了vultr是可以免费换ip的。

- 打开控制台，点击服务器右边的三点。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200218011741342.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbmdzaWRvdQ==,size_16,color_FFFFFF,t_70)
- 选择Server Destroy

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200218011825934.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbmdzaWRvdQ==,size_16,color_FFFFFF,t_70)

然后确定即可。删除了服务器之后，这个服务器就停止计费了。然后再重新购买一个服务器，以此类推。从我个人经验来看，运气好第一次就能买到可用的ip，运气不好三次也够了。


### 3.2.3 启动shadowsocks报错AttributeError: /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1: undefined symbol: EVP_CIPHER_CTX_cleanup
本节来自：[https://blog.csdn.net/weixin_39220714/article/details/86729935](https://blog.csdn.net/weixin_39220714/article/details/86729935)

1. 用vim打开文件`/usr/local/lib/python2.7/dist-packages/shadowsocks/crypto/openssl.py `
2. 将所有`libcrypto.EVP_CIPHER_CTX_cleanup`改为`libcrypto.EVP_CIPHER_CTX_reset`

再次启动shadowsocks即可。
