//禁止拖拽
document.addEventListener("touchmove", function (e) {
    e.preventDefault();
    },{
    passive:false
    });
/* 解决软键盘顶上去 页面不下来 */
$('input').blur(function () {
    setTimeout(() => {
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
        window.scrollTo(0, Math.max(scrollHeight, 0))
    }, 100)
});
//横屏显示
let screenOrientationTip = new LandscapeTip();
//加载页面
var man1 = document.querySelector(".man1");
var man2 = document.querySelector(".man2");
var flag_load = 0;
setInterval(
    ()=>{
        if(flag_load==0) {
            man1.style.display = "block";
            man2.style.display = "none";
            flag_load=1;
        }
        else {
            man1.style.display = "none";
            man2.style.display = "block";
            flag_load=0;
        }
        
    },800
)
/* 加载图片 */
var imgs = [  
    'img/loading/loading-bg.png',  
    'img/loading/Loading-text.png',  
    'img/loading/man1.png',  
    'img/loading/man2.png',  
    'img/loading/progress-index.png',  
    'img/loading/progress.png',  
    ];  
//用来记录问题开始位置
var startOffset = [];
$.preload(
    imgs,{
        minTimer : 2000,
        each:function(count) {
            $(".progress-index").css("width",(((count+1)/imgs.length)*595));
        },
        end :function() {
            $(".loading").fadeOut(1000);
            $("#page-one").fadeIn(1000);
            var mySwiper2 = new Swiper('.swiper-container',{//子swiper
                direction: 'vertical',
                nested:true,
                // resistanceRatio: 0,  配置回弹
                slidesPerView: 'auto',
                freeMode: true,
                autoHeight: true, 
                //设置了自动之后,swiper-container会设置为父级宽高的100%,而swiper-wrapper和swiper-slide会由内容撑开

                // freeModeMomentumBounceRatio : 5,释放后滑动的距离
            })
            //一开始就获取所有的问题的位置
            
            for(var i=0;i<$("div[class^='question-']").length;i++){
                startOffset.push($("div[class^='question-']").eq(i).offset().top);
            }
        }
    }
)
window.onload = function() {
    //设置轮播图宽高
    $("#page-one").css("width",window.innerWidth).css("height",window.innerHeight);
    //弹出层宽高
    //选择人物页
    $(".pop-con").css("width",window.innerWidth).css("height",window.innerHeight);
    //填写信息页
    $(".import").css("width",window.innerWidth).css("height",window.innerHeight);

    //为5题添加背景
    $(".question-five .an-yes").eq(0).addClass("ans-one");
    $(".question-five .an-yes").eq(1).addClass("ans-two");
    $(".question-five .an-yes").eq(2).addClass("ans-three");
    $(".question-five .an-yes").eq(3).addClass("ans-four");
    

    //答题算法start
    //声明一个变量记录分数
    var account = 0;
    //声明变量让其不能再次点击
    var flag_ani = 0;
    //让所有的元素都加上属性
    $("[class^='question']").attr("data-flag","0");
    var next_flag = 0;
    var that = null;
    $("[class^='question'] li").on("click",function(){
        that = this;
        if(next_flag==0) {
            if($(this).parents("[class^='question']").attr("data-flag")==0) {
                next_flag = 1;
                $(this).parent().children().addClass("gray").children("span[class^='answer']").addClass("db");
                let reg = /true+/;
                let str ; 
                for(var i = 0;i< $(this).parent().children().length;i++){
                    str = $(this).parent().children().eq(i).find("span[class^='answer'] img").attr("src");
                    if(reg.test(str)) {
                        let t = $(this).parent().children().eq(i);
                        t.removeClass("gray");
                        t.children("img[class^='choice']").css("display","none").addClass("my-index");
                        t.children(".an-yes").removeClass("dn");
                        t.children(".an-yes2").removeClass("dn");
                        setTimeout(()=>{
                            t.children(".an-yes2").addClass("dn");
                            let cssName = $(that).parents("[class^='question']").get(0).className;
                            let newName = cssName.replace("question-","");
                            var srcAdr = "./img/choice/answer/"+newName+".png";
                            $(".pop-con").removeClass("dn").find(".answer-t").attr("src",srcAdr);
                        },1000)
                    }
                }
            }
            $(this).parents("[class^='question']").attr("data-flag",1);
            //记录得分以及播放音乐
            var msc = document.querySelector(".select-yes");
            var msc_no = document.querySelector(".select-no");
            if($(that).find("div").hasClass("an-yes")){
                account++;
                //播放音乐
                if (msc.paused) {
                    msc.play();
                    // btn.className = 'musicOn';
                    openMusic = true;
                } else {
                    msc.pause();
                    // btn.className = 'musicOff';
                    openMusic = false
                }
            }
            else {
                if (msc_no.paused) {
                    msc_no.play();
                    // btn.className = 'musicOn';
                    openMusic = true;
                } else {
                    msc_no.pause();
                    // btn.className = 'musicOff';
                    openMusic = false
                }
            }
        }
    })
    //弹出层的隐藏
    $(".secede").click(
        function() {
            $(".pop-con").addClass("dn");
            next_flag = 0;
        }
    )
    
    //要求:
        //1,点击题目弹出正确答案
        //2,如果是错误答案,就让其先抖动一下,然后再弹出来,也就是说,在点击之后,有个定时器,先停顿一下执行动画,再让弹出层显示出来
        //3,动画动起来就是加上动画这个属性,这里每一个动画都不一样,则可以在js里面直接加上动画
        //4,弹出层显示后几秒就让弹出层隐藏
    //答题算法end

  
     //记录输入的用户名
     var input_field = null;
    //点击让当前页面关闭
    $(".page1-result").on("click",
        function() {
            console.log(startOffset);
            console.log($("div[class^='question-']").eq(0).offset().top);
            //删选出没有选的题目,通过类名来删选
            for(var i=0;i<$("div[class^='question-']").length;i++){
                if($("div[class^='question-']").eq(i).find(".an-yes").hasClass("dn")) {
                    console.log(i);
                   
                    var t = "translateY("+ -startOffset[i] +"px)";
                    $(".swiper-wrapper").css("transform",t);
                    return false;
                }
             }
            
            $(".swiper-container").css("display","none");
            $(".person").removeClass("dn");  
        }
    )
    //记录选择的人物
    var myPerson = "";
    $(".select-person li").on("click",
        function(){
            myPerson = $(this).children("img").attr("src");
            if(input_field==null){
                $(".import").removeClass("dn");
            }
            else {
                //让生成结果的函数执行
                myResult ();
            }
        }
    )
    //输入页的返回按钮
    $(".back-box").click(
        function() {
            $(".import").addClass("dn");
        }
    )
   
    //创建生成结果的函数
    function myResult () {
        $(".import").addClass("dn");
        $(".person").addClass("dn");
        console.log(myPerson);
        console.log(input_field);
        console.log(account);
        //开始创建图片,根据分数来创建图片
        if(account>=8) {
            $(".personae-bg").attr("src","./img/result/four.png");
            $(".personae").attr("src",myPerson);
        }
        if(account>=6&&account<=7) {
            $(".personae-bg").attr("src","./img/result/five.png");
            $(".personae").attr("src",myPerson);
        }
        if(account>=4&&account<=5) {
            $(".personae-bg").attr("src","./img/result/one.png");
            $(".personae").attr("src",myPerson);
        }
        if(account>=2&&account<=3) {
            $(".personae-bg").attr("src","./img/result/three.png");
            $(".personae").attr("src",myPerson);
        }
        if(account>=0&&account<=1) {
            $(".personae-bg").attr("src","./img/result/two.png");
            $(".personae").attr("src",myPerson);
        }
        $(".result-content .myName").text(input_field);
        $(".result").removeClass("dn");
    }
    $(".confirm-box").click(
        function() {
            input_field = $(".input-field").val();
            var reg = /^([\w]{1,6}|[\u4e00-\u9fa5]{1,6})$/;
            if(!reg.test(input_field)){
                 //提示
                 layer.open({
                    content: '请填写正确的用户名'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
            }
            else {
                myResult ();
            }
        }
    )
    //设置四个按钮
    //重新选人
    $(".btn-top .btn1").click(
        function() {
            $(".result").addClass("dn");
            $(".person").removeClass("dn");
        }
    )
    $(".btn-top .btn2").click(
        function() {
            $(".result").addClass("dn");
            $("#page-one").removeClass("dn");
            $(".swiper-wrapper").css("transform","translate3d(0px, 0px, 0px)");
            //让页面能重新点击
            $("[class^='question']").attr("data-flag","0");
            //分数清零
            account = 0;
            //让页面还原
            $("[class^='question'] li").removeClass("gray").children("span[class^='answer']").removeClass("db");
            $(".an-yes").addClass("dn");
            $(".an-yes2").addClass("dn");
            $(".my-index").css("display","block");
            $(".swiper-container").css("display","block");
        }
    )
    $(".btn-bot .btn3").click(
        function() {
            location.href = "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=http://www.baidu.com&sharesource=qzone&title=爱你一万年&pics=&summary=我命由我"
        }
    )
    $(".btn-bot .btn4").click(
        function() {
            location.href = "http://h5.mogu.com/live-mona/live-list.html?ptp=_qd._tengxun__8609792.403.1.0";
        }
    )

    //要求:
    /* 
        1,需要点击就弹出弹框
        2,在弹框中输入信息,输入信息会被记录下来
        3,记录的信息会在之后弹出的页面中被使用
        4,更换页面的信息,页面信息的更换,都是跟之前选的人物以及答对的题目是相关的,所以在之前写题目的时候要记录分数
        5,分数以及统计出来了,现在只需要按照分数拍好背景图片与人物之间的组合
        6,在排之前,首先得记录用户选择的人物,还有用户名,这两样是不变的
    */


    //要求:
    /* 
        1,接下来要写音乐播放,包括背景音乐,点击时触发的音乐
        2,检测题目有没有填写,没有填写就返回这个题目的位置
    */
    $(".music").click(
        function(){
            if($(".bgm").get(0).paused) {
                $(".bgm").get(0).play();
                $(".music_bg1").removeClass("dn");
                $(".music_bg2").addClass("dn");
            }
            else {
                $(".bgm").get(0).pause();
                $(".music_bg1").addClass("dn");
                $(".music_bg2").removeClass("dn");
            }
            
        }
    )
    //第五题的音乐
    var pronunciation = document.querySelector(".pronunciation");
    $(".music5").click(
        function() {
            if (pronunciation.paused) {
                pronunciation.play();
                $(this).attr("src","./img/choice/music-open.gif");
            } else {
                pronunciation.pause();
                $(this).attr("src","./img/choice/music5.png");
            }
        }
    )
    $(".pronunciation").get(0).addEventListener("ended",function(){
        $(".music5").attr("src","./img/choice/music5.png");
    })

   
}

