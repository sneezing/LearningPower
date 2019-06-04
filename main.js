/*
 * @Description: 学习强国自动化脚本
 * @version: 0.0.1
 * @Author: Veagau
 * @LastEditors: Veagau
 * @Date: 2019-03-27 15:49:14
 * @LastEditTime: 2019-03-31 17:45:22
 * @Modify: MiuGod
 * @DateOfModify: 2019-06-02 17:21:30
 */
//console.show();//调试窗口

auto.waitFor();//辅助权限授予
auto.setMode("normal");
//全局变量定义
//const DEBUG = true;
const WIDTH = Math.min(device.width, device.height);
const HEIGHT = Math.max(device.width, device.height);
var vTimeTotal = DEBUG ? 1 : 180;//视频学习目标时间（秒），默认视频学习时长6分钟（18*60）
var sTimeTotal = 10;//视频分享目标时间（秒），默认视频分享时长10秒
var loops = 1;//视频分享次数，默认分享2次
var rTimeTotal = DEBUG ? 3 : 120;//文章阅读目标时间（秒），默认文章阅读时长12分钟（12*60）

if (DEBUG) {
    console.show();
}

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
    while (text("取消分享").exists()) {
        text("取消分享").click();
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
        toSDelay(DEBUG ? 1 : 5);
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
        var shareIcon = classNameContains("ImageView").depth(10).drawingOrder(4);
        if(shareIcon.click()==true){
            print("点击分享按钮");
        }
        toSDelay(2);
        while (!textContains("分享给微信").exists());
        if(click("分享给微信\n好友")==true){
            toast("跳转微信中……");
        }
        while (!text("多选").exists());//等待微信界面载入
        toSDelay(2);
        back();
        popupDeal();
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
    var starIcon = classNameContains("ImageView").depth(10).drawingOrder(3);
    for (var i=1;i<5;i++) {
        toSDelay(3);
        starIcon.click();
        popupDeal();
    }
    return true;
}

/**
 * @name: 视频学习子任务01→观看新闻联播
 * @param {type} 
 * @return: 
 */
function videoWatch() {
    console.log("开始视听学习");

    // 搜索联播频道框
    function getYsws(){
        var layer = text("联播频道").findOnce();
        function dfs(uiObj) {
            if (uiObj.text() == "央视网") {
                return true;
            }
            var ok = false;
            uiObj.children().every(element => {
                ok = ok || dfs(element);
                return !ok;
            });
            return ok;
        }
        while (true) {
            layer = layer.parent();
            if (dfs(layer)) {
                break;  // 如果dfs找到央视网则跳出
            }
        }
        return layer.children().find(text("央视网"));
    }
    

    // 开始看视频
    var count = 0;  // 央视网s的计数器
    var ysws = getYsws();
    for(var i = 0; i < 6; i++){
        console.log("watching videos");
        // console.verbose(ysws.get(i));
        var b = ysws.get(count).bounds();
        // console.verbose(b);
        if (click(b.centerX(), b.centerY()) == true) {
            toastLog("进入第"+(i+1)+"个视频");
            toSDelay(1);
            count++;
        }
        popupDeal();
        if(watchTimer(vTimeTotal)==true){
            toSDelay(1);
            toastLog((i+1)+"条视频观看完成");
        }     
        if (i < 5){
            back();
        } else {    // 最后一次分享收藏
            wechatShare(2);
            toSDelay(2);
            videoLike();
            back();
            break; 
        }       
        if (count == ysws.size()-1){
            toSDelay(3);
            console.log("xiahua");
            swipe(WIDTH/2, HEIGHT/5*4, WIDTH/2, HEIGHT/5, 1000);
            ysws = getYsws();
            count = 1;
        } 
              
        toSDelay(3);
    }
    return true;
}

/**
 * @name: 视频学习子任务02→视频收藏分享
 * @param {none} 
 * @return: none
 */


/**
 * @name: 视频学习
 * @param none
 * @return: none
 */
function videoStudy() {
    while (!desc("学习").exists());
    if (click("视听学习") == true) {
        toast("开始视频学习");
    }
    toSDelay(2);
    if (click("联播频道") == true) {
        toast("进入联播频道");
    }
    toSDelay(5);
    // videoShare();
    videoWatch();
    toSDelay(5);
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
    for(var i=0;i<6;i++){
        console.log("Begin reading.");
        if (click("“学习强国”学习平台", i) == true) {
            toast("开始阅读第" + (i+1) + "篇要闻……");
            toSDelay(3);
        }
        popupDeal();
        if(watchTimer(rTimeTotal)==true){
            toSDelay(2);
            toast((i+1)+"篇文章阅读完成");
        }
        
        back();
        toSDelay(5);
    }    
}

initScript();
videoStudy();
newsStudy();
