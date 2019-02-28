$(function () {
    /*1.侧边栏显示隐藏*/
    $('[data-menu]').on('click',function () {
        $('aside').toggle();
        $('section').toggleClass('menu');
    });
    /*2.菜单的滑入滑出*/
    $('.menu a[href="javascript:;"]').on('click',function () {
        $(this).next('div').slideToggle();
    });
    // 配置ajax 加载进度条
    $(window).ajaxStart(function () {  
        // 只要调用了ajax  在请求之前执行
        NProgress.start();
    });
    $(window).ajaxStop(function () {  
        // 只要调用了ajax  在请求之前执行
        NProgress.done();
    });
});