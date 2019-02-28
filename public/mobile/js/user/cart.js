$(function () {  
    window.app = new App();
})
var App = function () {  
    this.$el = $('.mui-scroll');
    this.init();
};
// 初始化
App.prototype.init = function () {  
    this.initPullRefresh();
    this.bindEvent();
}
// 初始化下拉刷新
App.prototype.initPullRefresh = function () {  
    var that = this;
    mui.init({
        pullRefresh: {
            container: '.mui-scroll-wrapper',
            indicators: false,
            down: {
                auto: true,
                callback: function () {  
                    //当你触发了callback 用户想更新数据
                    that.cartList = null;
                    that.render();
                }
            }
        }
    });
}
// 渲染
App.prototype.render = function () {  
    var that = this;
    if(that.cartList) {
        that.$el.html(template('cart',{list: that.cartList}));
    } else {
        $.ajax({
            type: 'get',
            url: '/cart/queryCart',
            data: '',
            dataType: 'json',
            success: function (data) {  
                console.log(data);
                if(data.error == 400) {
                    location.href = '/mobile/user/login.html?returnUrl=' + encodeURIComponent(location.href);
                    return;
                }
                that.cartList = data;
                that.$el.html(template('cart',{list: that.cartList}));
                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            }
        });
    }
}
// 绑定事件
App.prototype.bindEvent = function () {  
    var that = this;
    $('.fa-refresh').on('tap', function () {  
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
        // console.log(mui('.mui-scroll-wrapper').pullRefresh());
    });
    that.$el.on('tap','.fa-edit',function () {  
        // 编辑按钮
        // console.log('hah');
        that.edit(this);
    }).on('tap','.fa-trash',function () { 
        // 删除按钮
        that.delete(this);
     }).on('change','input[type="checkbox"]',function () {  
        //  如果选中 给对应的商品数据 加上一个标识  用来判断是否被选中的标识
        var index = this.dataset.index;
        var product = that.cartList[index];
        // prop  获取布尔类型属性   attr 获取所有 属性值
        product.isChecked = $(this).prop('checked');
        //  当你在选择商品的时候 就要计算商品的价格
         that.setAmount();
     })
}
// 编辑功能
App.prototype.edit = function (editBtn) {  
    // 弹窗布局
    // 动态渲染弹窗信息
    // 初始化尺码选择
    // 点击确定发送修改商品数据的请求
    // 修改成功 更新列表信息
    var that = this;
    var index = editBtn.dataset.index; //商品索引
    var product = that.cartList[index];
    var html = template('edit', product).replace(/\n/g,'');
    console.log(product);
    // 需要在页面完全渲染成功之后 才能绑定事件   
    setTimeout(function () {  
        // 只有在渲染过后 才会有.pro_size span
        $('.pro_size span').on('tap',function () {  
            $(this).addClass('now').siblings().removeClass('now');
        });
        mui('.mui-numbox').numbox();
    },0);
    mui.confirm(html,'编辑商品',['取消','确认'], function (e) {  
        if(e.index == 1) {
            var size = $('.pro_size span.now').data('size');
            var num = mui('.mui-numbox').numbox().getValue();
            $.ajax({
                type: 'post',
                url: '/cart/updateCart',
                data: {
                    id: product.id,
                    size: size,
                    num: num
                },
                dataType: 'json',
                success: function (data) {  
                    console.log(data);
                    if(data.success) {
                        // 更新列表
                        product.size = size;
                        product.num = num;
                        //根据缓存数据
                        that.render();
                        // 提示
                        mui.toast('修改完毕');
                        // 计算金额
                        that.setAmount();
                    }
                }
            });
        }
    });
}
// 删除功能 
App.prototype.delete = function (delBtn) {  
    var that = this;
    // 获取id
    var index = delBtn.dataset.index;
    var product = this.cartList[index];
    // 弹窗提示
    mui.confirm('亲您确定要删除此商品吗？','温馨提示',['取消','确认'], function (e) {  
        if(e.index == 1) {
            // 发起删除请求
            $.ajax({
                type: 'get',
                url: '/cart/deleteCart',
                data: {id:product.id},
                dataType: 'json',
                success: function (data) {  
                    if(data.success) {
                        // 后台操作成功
                        // 更新缓存数据
                        that.cartList.splice(index,1);
                        // 根据缓存数据渲染页面
                        that.render();
                        // 提示
                        mui.toast('删除成功');
                        // 计算金额
                        that.setAmount();
                    }
                }
            });
        }
    });
}
// 计算金额
App.prototype.setAmount = function () {  
    // 选择 删除 修改 价格都会改变
    var amount = 0;
    // 遍历
    this.cartList.forEach(function (item, i) {  
        if(item.isChecked) {
            // 总金额 等于  单价 * 数量
            amount += item.price * item.num;
        }
    });
    // tofixed(2)  截取两位小数点
    $('.zt_amount').find('span').html('订单总额：￥'+ amount.toFixed(2) +'')
}