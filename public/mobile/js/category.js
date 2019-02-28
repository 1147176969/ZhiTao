$(function () {  
    // 使用面向对象的方式来组织业务： 可读性高 可维护性高
    new App();
});
// 业务应用程序  构造函数
var App = function () {  
    /* 
        1、当页面初始化：渲染一级分类
        2、当你渲染完成一级分类之后 根据第一个一级分类 去渲染二级分类
        3、当点击一级分类的时候 根据当前点击的分类 去加载渲染二级分类
    */
    //    
    this.$top = $('.zt_cateLeft');
    this.$second = $('.zt_cateRight');
    // 初始化调用
    this.init();
};
// 初始化  入口函数
App.prototype.init = function () {
    var that = this;
    // 使用回调函数callback 就要传入callback  此时把   function (id) {  that.renderSecond(id);}  当做形参传入 
    // 在一级分类渲染部分 传入 当前的id   这边接收到id，其中的二级分类获取到id  就传入到二级分类，
    // 二级分类就可以把id发送到服务端，就可以接收到与id对应的参数，进行模板引擎的渲染
    that.renderTop(function (id) {  // 此处是形参  （id）接收到  一级分类的传参   callback(data.rows[0].id)
        that.renderSecond(id);  // 二级分类得到 id  将id传入到 二级分类
    });
    that.bindEvent();
}
// 绑定事件
App.prototype.bindEvent = function () {
    var that = this;
    // tap: 移动端的轻触事件   click点击事件也可以用
    // 但是会有300ms的延时， 因为在点击的时候会进行判断 
    // 如果在300ms点了两次 就是双击放大
    // 不是点击事件了
    that.$top.on('tap','a',function () {
        // 改样式
        var $li = $(this).parent();
        $li.addClass('now').siblings().removeClass('now');
        // console.log($li.data('last') ==1);
        if($li.data('last') === 1) {
            $li.css('border-bottom', 'none');
        } else {
            $('[data-last="1"]').css('border-bottom', '1px solid #ccc');
        }
        // 渲染二级分类
        that.renderSecond($li.data('id'));
    })
}
// 渲染一级分类
App.prototype.renderTop = function (callback) { 
    var that = this; 
    $.ajax({
        type: 'get',
        url: ' /category/queryTopCategory',
        data: '',
        dataType: 'json', // 设置接收的数据类型
        success: function (data) {  
            // console.log(data);
            // 模板引擎 把json对象转换成html格式的字符串
            that.$top.html(template('top', data));
            // 当传入callback 才会去调用callback
            callback && callback(data.rows[0].id);
        }
    });
}
// 渲染二级分类
// 这边接收到 通过回调函数 获得的一级分类的id，然后通过id来发送ajax请求 再通过模板引擎渲染二级分类
App.prototype.renderSecond = function (id) {  
    var that = this; // this获取不到$top   
    $.ajax({
        type: 'get',
        url: '/category/querySecondCategory',
        data: {id:id},
        dataType: 'json',
        success: function (data) {  
            // console.log(data);
            that.$second.html(template('second', data));
        }
    });
}