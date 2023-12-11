function printCurrentTime() {
  // 获取当前时间
  var now = new Date();

  // 格式化当前时间
  var formattedTime = now.toLocaleString();

  // 在控制台输出当前时间
  console.log(formattedTime);
}

// 设置定时器，每3秒执行一次 printCurrentTime() 函数
setInterval(printCurrentTime, 3000);
