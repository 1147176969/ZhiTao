$(function () {  
    // 基于区域滚动插件
    // mui('.mui-scroll-wrapper').scroll({
    //     indicators: false
    // });

    // 1、下拉刷新效果
    // 2、上拉加载效果
    
    new App();
});
var App = function () {
    // 产品名称
    this.proName = zt.getParamsByUrl().proName;
    // 将输入框中的内容 替换为当前搜索的内容
    this.$searchInput = $('.zt_search input').val(this.proName);
    // 搜索按钮
    this.$searchBtn = $('.zt_search a');
    // 页码
    this.page =1;
    // 一页的条数
    this.pageSize=4;
    // 产品
    this.$product = $('.zt_product');
    // 排序
    this.$order = $('.zt_order');
    this.init();
}
// 1、 当页面刷新的时候 获取地址栏参数  设置给输入框
// 2、 当页面初始化 主动触发一次下拉刷新 发送ajax请求 获取后台数据
// 3、 当页面 用户去下拉的时候  去获取后台数据 进行页面的渲染
// 4、 当页面用户去上拉的时候  追加渲染
// 5、 当用户点击排序的时候 根据你点击的排序方式 重新获取属性
// 6、当用户点击搜索 根据新的产品名称 获取数据 渲染产品界面

// 初始化
App.prototype.init = function () {
    // 初始化上拉和下拉 效果
    this.initPullRefresh();
    // 初始化 绑定事件
    this.bindEvent();
}
// 初始化拉加载刷新
App.prototype.initPullRefresh = function () {
    var that = this;
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            indicators: false,
            down: {
                auto:true,// 初始化的时候 默认加载
                callback: function () {  
                    var pullThis = this;
                    that.page = 1;
                    that.render(function (data) {  
                        // data数据 替换
                        that.$product.html(template('product', data));
                        // 结束下拉
                        pullThis.endPulldownToRefresh();
                        // 重置下拉操作
                        pullThis.refresh(true);
                    });
                }
            },
            up: {
                callback: function () {
                    var pullThis = this;
                    that.page++;
                    that.render(function (data) {  
                        // data数据  追加
                        that.$product.append(template('product', data));
                        // 结束下拉
                        pullThis.endPullupToRefresh(!data.data.length);
                    });
                }
            }
        }
    });
}
// 绑定事件
App.prototype.bindEvent = function () {  
    var that = this;
    that.$searchBtn.on('tap', function () {  
        that.search();
    });
    that.$order.on('tap','a', function () {
        console.log('滴滴滴');
        that.order(this);
    })
}
// 获取数据并渲染页面
App.prototype.render = function (callback) {  
    var that = this;
    var obj = {
        proName: that.proName,
        page: that.page,
        pageSize: that.pageSize
    };
    // 动态追加属性  才能保证只传了一个排序方式
    if(that.orderType) {
        obj[that.orderType] = that.orderValue;
    }
    $.ajax({
        type: 'get',
        url: '/product/queryProduct',
        data: obj,
        dataType: 'json',
        success:function (data) {
            callback && callback(data);
            console.log(data);
        }
    });
}
// 搜索
App.prototype.search = function () {
    var value = $.trim(this.$searchInput.val());
    if(!value) {
        mui.toast('请输入关键字');
        return;
    }
    this.proName = value;
    // 主动触发下拉操作
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
}
// 排序
App.prototype.order = function (current) {
    var $current = $(current);
    // 1、样式的切换
    // 未选中的容器
    if(!$current.hasClass('now')) {
        // 当前
        $current.addClass('now');
        // 其它
        $current.siblings().removeClass('now').find('span').attr('class', 'fa fa-angle-down');
    // 选中的容器
    } else {
        var $span = $current.find('span');
        if($span.hasClass('fa-angle-down')) {
            $span.attr('class', 'fa fa-angle-up');
        } else {
            $span.attr('class', 'fa fa-angle-down');
        }
    }
    // 2、数据更新  按排序
    // 获取当前的排序方式
    //  price 1升序  2 降序 ;;;  num 1升序  2 降序
    // ajax data 传参中内有一个属性，要么是price 要么是num

    // 排序的类型   设置自定义属性  data-type  
    var orderType = $current.data('type');
    // 排序的值   1 or 2  (1：升序  2：降序)
    var orderValue = $current.find('span').hasClass('fa-angle-down') ? 2 : 1;
    // 只能传一种
    this.orderType = orderType;
    this.orderValue = orderValue;
    // 主动触发下拉操作
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
}