---
title: 极简Android开源弹幕控件：EasyDanmaku
date: 2021-05-20 11:38:21
tags: [Android, 开源]
categories: Android
top: 10
---

EasyDanmaku是一款开源的Android弹幕库，简单易用。经测试，在开启字幕描边的情况下，0.2.0版本在模拟器上能同屏显示500条弹幕而保持满帧率；在真机小米mix2上，同屏显示约1300+条弹幕（不描边则为2500+条）时，才开始出现丢帧。

先放Github地址：[https://github.com/LittleFogCat/EasyDanmaku](https://github.com/LittleFogCat/EasyDanmaku)

<!--more-->

# EasyDanmaku v0.2.0 更新了！

更新时间：2021年12月20日

Github地址：[https://github.com/LittleFogCat/EasyDanmaku](https://github.com/LittleFogCat/EasyDanmaku)
欢迎star、issue。

针对反馈得到的信息，0.1.x版本存在卡顿的情况，于是重新设计实现了本库。新版本为0.2.x，采用kotlin编写，基于Easy Surface UI System。
经测试，在开启字幕描边的情况下，0.2.0版本在模拟器上能同屏显示500条弹幕而保持满帧率；在真机小米mix2上，同屏显示约1300+条弹幕（不描边则为2500+条）时，开始出现丢帧。



**README：**

# EasyDanmaku

一个方便简单的Android弹幕控件，顾名思义so easy。

**注意！**这个库尚未完善，仅供共同学习进步，勿要用在正式项目！

![easydanmaku](https://img-blog.csdnimg.cn/img_convert/568ed86ed30c8be4fcff0ca3decc136e.gif)
![easydanmaku](https://img-blog.csdnimg.cn/img_convert/4338594874d3163eb1760c42b477e713.gif)

## 1. 用法

### 1.1 在布局中引入一个DanmakuView

```html

<top.littlefogcat.easydanmaku.ui.DanmakuView
        android:id="@+id/container"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
```

### 1.2 设置数据

```kotlin
val danmakuView: DanmakuView = findView()
val danmakus: Collection<DanmakuItem> = getDanmakus()
danmakuView.setDanmakus(danmakus)
```

### 1.3 设置时间

DanmakuView使用子线程绘制，根据时间确定当前弹幕。在设置弹幕数据之后，只需设置时间即可刷新界面。

通过`setActionOnFrame`设置每一帧的动作，在其中更新时间，即可刷新界面。当然，自定义Timer固定时间刷新也是可以的。

```kotlin
// 使用setActionOnFrame刷新界面
danmakuView.setActionOnFrame {
    val progress = getVideoProgress() // 获取播放进度
    danmakuView.time = progress // 设置时间
}

// 或者使用Timer
//timer(initialDelay = 0L, period = 16L) {
//    val progress = getVideoProgress()
//    danmakuView.time = progress
//}
```

**就是这么easy**

## 2. changelog

**EasyDanmaku v0.2.0 - 2021.12.20**

- 使用kotlin全部重写；
- 使用SurfaceView重新实现；

**EasyDanmaku v0.1.3**

- 优化DanmakuView缓存复用的机制；

**EasyDanmaku v0.1.2**

- 添加了横竖屏切换的显示；
- 修复了可能导致显示异常的bug；

**EasyDanmaku v0.1.1**

- 修改了字体大小的设置方式；
- 其他的一些优化。

**EasyDanmaku v0.1.0**

- 重写了DanmakuView。
- 优化结构，去除冗余类。
- 修复弹幕过长导致显示内容不完整的问题。
- 加入顶部和底部弹幕。

**EasyDanmaku v0.0.0**

一个方便的Android弹幕控件~

顾名思义，实现起来easy，用起来也easy，（功能也很easy）代码很少，就几个文件，直接复制进项目里去吧！

