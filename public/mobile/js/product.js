// mui('.mui-scroll-wrapper').scroll({
//     indicators: false
// });
$(function () {  
    new App();
});
// 1、根据地址栏的参数  获取数据 进行渲染  下拉刷新效果
// 2、进行下拉操作 获取数据 进行渲染  下拉刷新效果
// 3、初始化 尺码选择功能
// 4、初始化 数量选择功能  这里用到的mui的组件，省略次步  
// 5、加入购物车
var App = function () {  
    // 想渲染的容器
    this.$el = $('.mui-scroll');
    // id
    this.id = zt.getParamsByUrl().productId;
    this.init();
};
// 初始化
App.prototype.init = function () {  
    this.initPullRefresh();
    // this.render();
    this.bindEvent();
};
// 绑定事件
App.prototype.bindEvent = function () {  
    var that = this;
    that.$el.on('tap','.pro_size span', function () {  
        that.changeSize(this);
    }).on('tap','mui-numbox button',function () {  
        that.changeNum(this);
    });
    $('.btn_cart').on('tap', function () {  
        that.addCart();
    })
}
// 根据数据  渲染页面
App.prototype.render = function () {  
    var that = this;
    $.ajax({
        type: 'get',
        url: '/product/queryProductDetail',
        data: {id:that.id},
        dataType: 'json',
        success: function (data) {  
            console.log(data);
            that.$el.html(template('detail',data));
            // 初始化轮播图   页面结构更新
            mui('.mui-slider').slider();
            // 初始化数字输入框
            mui('.mui-numbox').numbox();
            // 结束下拉
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
        }
    })
}
// 
App.prototype.initPullRefresh = function () {  
    var that = this;
    mui.init({
        pullRefresh: {
            container:'.mui-scroll-wrapper',
            indicators: false,
            down: {
                auto: true,
                callback: function () {  
                    that.render();
                }
            }
        }
    })
};
// 
App.prototype.changeSize = function (sizeBtn) {  
    // 给当前点击的按钮加选中效果 其他清除选中
    $(sizeBtn).addClass('now').siblings().removeClass('now');
    this.size = sizeBtn.dataset.size;
}
// 
App.prototype.changeNum = function (numBtn) {  
    // var $numBtn = $(numBtn);
    // if($numBtn.hasClass('mui-numbox-btn-minus')) {
    //     // 减
    //     if(value <= 1) {
    //         mui.toast('至少一件');
    //     } else {
    //         // 加
    //     }
    // }
}
//
App.prototype.addCart = function () {  
    // 商品id  商品尺码  数量
    var that = this;
    if(!that.size) {
        mui.toast('请选择尺码');
        return;
    }
    $.ajax({
        type: 'post',
        url: ' /cart/addCart',
        data: {
            productId: that.id,
            // size: $('.pro_size.now').data('size');
            size: that.size,
            num: mui('.mui-numbox').numbox().getValue()
        },
        dataType: 'json',
        success: function (data) {  
            console.log(data);
            if(data.error === 400) {
                location.href = '/mobile/user/login.html?returnUrl=' + encodeURIComponent(location.href);
            }
            // 如果登录成功 会返回 success： true
            if(data.success) {
                mui.confirm('亲,添加成功，去购物车看看~','温馨提示',['取消','确定'],function (e) {  
                    // 点击按钮后的回调函数
                    console.log(e);
                    if(e.index == 1) {
                        location.href = '/mobile/user/cart.html';
                    }
                });
            }
        }
    });
}