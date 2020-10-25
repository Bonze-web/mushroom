/**
 * 图片预加载插件Preload
 * 
 * @param array imgs  预加载的图片地址数组列表
 * @param Object options  配置参数
 */

(function ($) {
    function Preload(imgs, options) {   //创建构造函数
        this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;     //如果传进来的是字符串,就是说直接把路径进来,则会将这个路径放在数组当中,如果是数组,则直接为数组
        this.options = {    
            order: false, //默认值false,代表无序加载
            minTimer: 0, //完成加载的最少时间，单位ms,默认为0，一般展示类型的loading动画会需要设置
            each: null, //单张图片加载完执行的方法,一般是修改进度状态
            end: null //所有图片加载完执行的方法，一般是隐藏loading页
        };
        this.timer = Date.now();    //获取时间戳
        this.init(options); //页面进行初始化
    };
    //插件初始化
    Preload.prototype.init = function (options) {   //将方法写在原型上,可以不占内存,因为创建的实例对象不会继承,但是却能够使用
        //配置参数合并
        this.options = $.extend(this.options, options); //继承传进来的参数,让当前的 this.options,指向Preload这个构造函数里面的this.options
        if (this.options.order) {   //判断是有序加载还是无序加载
            this.ordered(); //有序加载
        } else {
            this.unordered(); //无序加载
        }
    };
    // 有序加载
    Preload.prototype.ordered = function () {
        var that = this,
            imgs = this.imgs,   //因为原型上的this和构造函数的this都是指向一样的,所以能够使用构造函数的this.imgs
            len = imgs.length,  //传进来图片数组的长度
            count = 0,  
            options = this.options;
        load();

        function load() {
            var img = new Image();
            $(img).on('load error', function () {
                options.each && options.each(count);        //如果有each函数,则执行这个函数,each函数就是自己写的每加载一次执行的函数
                if (count >= len-1) {
                    //所有图片加载完毕,检查是否满足最小loading时间
                    var timerCount = Date.now() - that.timer;
                    if (timerCount < options.minTimer) {        //加载图片的时间如果小于自己设置的时间
                        var timeout = options.minTimer - timerCount;    //则让加载完成后执行的函数延缓执行,这样做的目的是为了让之前的动画能够让客户看得到
                        setTimeout(function () {
                            options.end && options.end();
                        }, timeout);
                    }else{
                        options.end && options.end();
                    }
                } else {
                    load();     //递归函数,如果没有加载完成,就继续调用这个函数
                }
                count++

            });
            // onload函数要写在改变src前,这样确保了onload函数一定会被调用
            // 即使onload函数写在了src加载之前,但是onload加载是一个事件,事件是异步的,所以还是会先执行src
            img.src = imgs[count];  //
        }
    };
    // 无序加载
    Preload.prototype.unordered = function () {
        var that = this,
            imgs = this.imgs,
            len = imgs.length,
            count = 0,
            options = this.options;
        for (var i = 0; i < len; i++) {     //无序加载就是不断的循环,实际上两种循环方式没有多大的区别,i的值与count的值是一致的,因为每一次执行count都会+1
            var img = new Image();
            $(img).on('load error', function () {
                options.each && options.each(count);
                if (count >= len-1) {
                    //所有图片加载完毕,检查是否满足最小loading时间
                    var timerCount = Date.now() - that.timer;
                    if (timerCount < options.minTimer) {
                        var timeout = options.minTimer - timerCount;
                        setTimeout(function () {
                            options.end && options.end();
                        }, timeout);
                    }else{
                        options.end && options.end();
                    }
                }
                count++;
            })
            img.src = imgs[i];
        }
    };
    //扩展到jQuery对象上
    $.extend($,{        //使用这样的拓展,则能将后面的这个对象里面的方法可以直接让$调用
        preload: function (imgs, options) {
            new Preload(imgs, options);
        }
    });
})(jQuery);

    //$.extend( [deep ], target, object1 [, objectN ] ) ;将objectN合并到object1里面,target表示自身,可以deep表示是不是要深度合并,如果为true,则对象里面的属性如果是对象,则这些属性对象也会合并