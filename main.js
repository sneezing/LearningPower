/*
 * @Description: 学习强国自动化脚本
 * @version: 0.0.1
 * @Author: Veagau
 * @LastEditors: Veagau
 * @Date: 2019-03-27 15:49:14
 * @LastEditTime: 2019-03-31 17:45:22
 */
//console.show();//调试窗口

auto.waitFor();//辅助权限授予
auto.setMode("normal");
//全局变量定义
var vTimeTotal = 20;//视频学习目标时间（秒），默认视频学习时长25分钟（25*60）
var sTimeTotal = 10;//视频分享目标时间（秒），默认视频分享时长10秒
var loops = 3;//视频分享次数，默认分享6次
var rTimeTotal = 10;//文章阅读目标时间（秒），默认文章阅读时长16分钟（16*60）

/**
 * @name:延迟函数ms→s 
 * @param {int}mm 
 * @return: null
 */
function toSDelay(params) {
    sleep(params * 1000);
}

/**
 * @name:初始化函数 
 * @param {none} 
 * @return: none
 */
function initScript() {
    toast('Hello World!');
    toSDelay(2);
    toast('学习强国启动中……');
    var initState = launchApp("学习强国");
    toSDelay(3);
    if (initState == false) {
        toast("启动失败\n找不到该应用")
    }
    return true;
};

/**
 * @name: 弹窗处理函数
 * @param 
 * @return: 
 */
function popupDeal(params) {
    while (text("我知道了").exists()) {
        text("我知道了").click();
    }
    while (text("继续播放").exists()) {
        text("继续播放").click();
    }
    while (text("重新播放").exists()) {
        text("重新播放").click();
    }
    return true;
}

/**
 * @name: 视频计时函数
 * @param {type} 
 * @return: 
 */
function watchTimer(time) {
    for (var timer = 0; timer < time;) {
        toSDelay(5);
        timer += 5
        if (timer <= 60) {
            toast("已学习" + timer + "秒");
        }
        else {
            var timerM = parseInt(timer / 60);
            var timerS = timer - timerM * 60;
            toast("已学习" + timerM + "分" + timerS + "秒");
        }
    }
    return true;
}

/**
 * @name: 微信分享函数
 * @param 
 * @return: 
 */
function wechatShare(loop) {
    for (var i = 1; i <= loop; i++) {
        while (!text("观点").exists());
        toast("开始分享第" + i + "/" + loop + "次");
        var shareIcon = classNameContains("ImageView").depth(2).findOnce(2);
        if(shareIcon.click()==true){
            print("点击分享按钮");
        }
        toSDelay(5);
        while (!textContains("分享给微信").exists());
        if(click("分享给微信\n好友")==true){
            toast("跳转微信中……");
        }
        while (!text("多选").exists());//等待微信界面载入
        toSDelay(2);
        back();
        toSDelay(3);
    }
    toast("视频分享任务完成");
    return true;
}

/**
 * @name: 视频收藏函数
 * @param {type} 
 * @return: 
 */
function videoLike() {
    var starIcon = classNameContains("ImageView").depth(2).findOnce(1);
    if (starIcon.click() == true) {
        popupDeal();//处理首次收藏提示弹窗
        toast("收藏成功");
        toSDelay(5);
    }
    return true;
}

/**
 * @name: 视频学习子任务01→观看新闻联播
 * @param {type} 
 * @return: 
 */
function videoWatch() {
    if (click("央视网", 0) == true) {
        toast("进入新闻联播");
        toSDelay(5);
    }
    popupDeal();
    if(watchTimer(vTimeTotal)==true){
        toSDelay(2);
        toast("视频观看完成");
    } 
    toSDelay(5);
    back();
    return true;
}

/**
 * @name: 视频学习子任务02→视频收藏分享
 * @param {none} 
 * @return: none
 */
function videoShare() {
    if (click("央视网", 1) == true) {
        toast("进入第二条视频新闻");
        toSDelay(5);
    }
    popupDeal();
    if(watchTimer(sTimeTotal)==true){
        toSDelay(2);
        toast("第二条视频观看完成");
    } 
    toSDelay(5);
    back();
    toSDelay(3);
    if (click("央视网", 2) == true) {
        toast("进入第三条视频新闻");
        toSDelay(5);
    }
    popupDeal();
    if(watchTimer(sTimeTotal)==true){
        toSDelay(2);
        toast("第三条视频观看完成");
    } 
    toSDelay(5);
    wechatShare(loops);
    toSDelay(2);
    videoLike();
    back();
    return true;
}

/**
 * @name: 视频学习
 * @param none
 * @return: none
 */
function videoStudy() {
    while (!desc("学习").exists());
    if (click("视频学习") == true) {
        toast("开始视频学习");
    }
    toSDelay(2);
    if (click("联播频道") == true) {
        toast("进入联播频道");
    }
    toSDelay(5);
    videoWatch();
    toSDelay(5);
    videoShare();
    return true;
}

/**
 * @name: 文章学习函数
 * @param {type} 
 * @return: 
 */
function newsStudy() {
    while (!desc("学习").exists());
    if (desc("学习").click() == true) {
        toast("进入学习模块");
        toSDelay(3);
    }
    if (click("要闻") == true) {
        toast("进入要闻模块");
        toSDelay(3);
    }
    var i = 0;
    if (click("“学习强国”学习平台", i) == true) {
        var count = i + 1;
        toast("开始阅读第" + count + "篇要闻……");
        toSDelay(3);
    }
    if(watchTimer(rTimeTotal)==true){
        toSDelay(2);
        toast("文章阅读完成");
    }
    toSDelay(5);
    back();
}

initScript();
videoStudy();
newsStudy();