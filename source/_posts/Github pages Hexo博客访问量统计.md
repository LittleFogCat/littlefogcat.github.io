---
title: Github pages Hexo博客访问量统计
date: 2023-12-12 01:10:08
tags: [Github, 博客]
categories: 博客
---

之前使用Hexo搭建了自己的github.io博客[https://littlefogcat.github.io/](https://littlefogcat.github.io/)。但是没有访问统计功能，让人头大。于是决定着手整一个。

首先需要有一台自己的服务器，如果没有的话就用[busuanzi.js](https://www.baidu.com/s?ie=UTF-8&wd=busuanzi.js)吧。（不过我总觉得数据在自己手里比较开心）

由于我对前后端开发几乎都是一窍不通，所以耗费了很多精力，不过最后还是稍有所得，在此记录。

<!--more-->

# 1. 要点

## 1.1 跨域（同源策略）

由于浏览器的安全策略，js只可以访问相同协议、相同域名、相同端口（同源）下的资源。这就带来一个问题，博客中的js文件无法调用服务器端的接口。

## 1.2 jsonp

为了解决非同源跨域问题，这里采用了[jsonp](https://www.runoob.com/json/json-jsonp.html)的解决方案。由于jsonp只支持get方式，所以参数都写在url中。

**js端：**
```
var currentPageUrl = window.location.href; // 当前页面地址
    
// 处理服务端返回的数据
function handleCallback(jsonData) {
    // 将获取到的访问量写入html中
}

// 参数
var arrivalServer = "https://myApi?callback=handleCallback&url=" + currentPageUrl;
```
其中`myApi`是服务端暴露的获取访问量的接口，而当前页面的url作为唯一标识符做参数传递。这里是有问题的，最好还是不要把url写在参数里，可以考虑base64编码。使用`window.btoa()`即可将字符串进行base64编码，反之使用`window.atob()`即可进行解码。
```
var serverBase64 = window.btoa(arrivalServer);
```
`callback=handleCallback`表示当服务端返回数据时，调用js里的handleCallback函数。

**服务端**

仅就Java而言，使用`com.fasterxml.jackson.databind.util.JSONPObject`这个类可以快速创建一个jsonp对象。
示例：
```
    // Code in Controller
    @ResponseBody
    @RequestMapping("/arrival")
    public Object getGithubIoArrival(@RequestParam String callback,
                                     @RequestParam String articleUrl,
                                     @RequestParam(required = false) String ip) {
        GithubIoArrivalResult result = service.getArrival(articleUrl, ip);

        return new JSONPObject(callback, result);
    }
```

## 1.3 https

由于Github Pages强制使用https访问，所以服务端也应该支持https。这篇文章有详细的步骤：[5分钟内搞定 Tomcat 的 SSL 配置](https://www.oschina.net/question/12_23148)
如果不想整个应用都是用https，只用将`url-pattern`标签的内容改成所需要的即可。
如：`<url-pattern>/githubio/*</url-pattern>`

# 2. 服务端

首先明确需求，很简单：
- 每个页面单独统计访问量
- 单个ip每日最多计算一次访问量
- 所有单次访问都有记录

这样需要两张表，一张保存每个页面的访问量（pv），一张保存详细的访问记录（record）。

逻辑很简单。当一个Get请求到达时，首先将其保存至record表中，然后再查找当天是否已经浏览过本页面。只有当这个ip当日没有浏览过本页面时，才更新pv表，本页面的浏览量+1。最后返回页面浏览数。


# 3. 前端（Hexo）

找到hexo博客的根目录， 修改`themes\landscape\layout\_partial\head.ejs`文件。
在其中添加一行
```
<script src="http://pv.sohu.com/cityjson?ie=utf-8" type="text/javascript"></script>
```
这个搜狐的链接，用于获取当前用户的IP地址。

然后，修改`themes\landscape\layout\_partial\footer.ejs`文件。添加以下内容
```
  <script type="text/javascript">
	var href = window.location.href; // 当前页面地址

	function handleCallback(jsonData) {
		console.log("jsonData = " + jsonData);
		var arrival = jsonData.arrival;
		document.getElementById("page_view").innerHTML = arrival;
	}
	
	var src = "https://106.14.152.93:8443/third/githubio/arrival?callback=handleCallback&articleUrl="
         + href + "&ip=" + returnCitySN["cip"];
	
	document.write("<script type=\"text/javascript\" src=\"" + src + "\"><\/script>");
  </script>
```

至此，访问统计功能就完成了。
![sample](https://upload-images.jianshu.io/upload_images/6532223-84848cf961e1a51d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


# 4 查漏

## 4.1 编码

在url中传递url会出现问题，这是显而易见的。所以，对于每个页面，其url需要经过编码才能传给服务端。常见的方式有base64。但是js中的base64编码只支持ascii字符，并不支持中文，所以不能使用这个方法。最后选择了`encodeURIComponent`来进行编码。

**js端**
```
var href = window.location.href;
href = encodeURIComponent(href)
```
编码前：`https://littlefogcat.top/api/test/testEncodeURIComponent?param=hello你好`
编码后：`https%3A%2F%2Flittlefogcat.top%2Fapi%2Ftest%2FtestEncodeURIComponent%3Fparam%3Dhello%E4%BD%A0%E5%A5%BD`

**服务端**

`java.net.URLEncoder`类和`java.net.URLDecoder`类和js的`encodeURIComponent`、`decodeURIComponent`是同样的作用。前端传递过来经过编码的url，只需要通过一句代码就能解码：
```
String urlDecoded = URLDecoder.decode(urlEncoded, "utf8");
```

## 4.2 ERR_CERT_AUTHORITY_INVALID

有可能会出现无法显示访问量的情况，F12报错：ERR_CERT_AUTHORITY_INVALID；这是因为浏览器的安全策略造成的。
在设置里面允许不安全的内容即可。
![设置](https://upload-images.jianshu.io/upload_images/6532223-80bec9bfed49882d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


# 5. 示例
[LittleFogCat's Page - https://littlefogcat.github.io/](https://littlefogcat.github.io/)