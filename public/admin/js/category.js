$(function () {  
    new App();
});
var App = function () {  
    this.$el = $('tbody');
    this.page = 1;  //默认显示第一页
    this.pageSize = 5; //一页显示多少条
    this.init();
};
// 初始化
App.prototype.init = function () {  
    var that = this;
    that.render(function (data) {
        that.pagination(data);
    });
    that.dropDown();
    that.fileUpload();
    that.bindEvent();
};
// 绑定事件
App.prototype.bindEvent = function () {  
    var that = this;
    $('.btn-primary').on('click',function () {  
        that.addCategory();
    })
};
// 渲染
App.prototype.render = function (callback) {
    var that = this;
    $.ajax({
        type: 'get',
        url: '/category/querySecondCategoryPaging',
        data: {
            page: that.page,
            pageSize: that.pageSize
        },
        dataType: 'json',
        success: function (data) {  
            console.log(data);
            that.$el.html(template('list', data));
            callback && callback(data);
        }
    })
};
// 分页功能
App.prototype.pagination = function (data) {  
    // 1、 使用bootstarp分页组件  ul.pagination 结构
    // 2、 使用js插件
    // 3、 初始化插件
    var that = this;
    $('.pagination').bootstrapPaginator({
        // 配置选项
        bootstrapMajorVersion: 3, //版本
        // 总页码
        totalPages: Math.ceil(data.total / data.size),
        // 当前页
        currentPage: data.page,
        // 配置显示普通按钮的数量
        numberOfPages: 4,
        // 配置按钮点击 返回当前的页码数
        onPageClicked: function (event,originalEvent,type,page) {  
            // 点击之后的回调函数
            // event  jquery的事件对象
            // originalEvent 原生的事件对象
            // type 按钮类型
            // page 当前点击按钮对应的页码
            that.page = page;
            that.render();
        }
    })
};
// 添加分类功能
App.prototype.addCategory = function () {  
    var that = this;
    var $dropdown = $('.dropdown');
    $.ajax({
        type: 'post',
        url: '/category/addSecondCategory',
        data: {
            brandName: $('form [name="brandName"]').val(),
            categoryId: $('.dropdown .text').data('id'),
            brandLogo: $('.imgBox img').attr('src')
        },
        dataType: 'json',
        success: function (data) {  
            if(data.success) {
                // 更新列表   渲染第一页数据
                that.page = 1;
                that.render(function (data) {  
                    that.pagination(data);
                });
                $('#addCategory').modal('hide');
                $('#addCategory').on('hidden.bs.modal', function (e) {
                    $('form [name="brandName"]').val('');
                    $('.imgBox img').attr('src',null);
                    $dropdown.find('.text').html('请选择');
                  })
            }
        }
    });
};
// 初始化下拉菜单功能
App.prototype.dropDown = function () {  
    var $dropdown = $('.dropdown');
    $.ajax({
        type:'get',
        url: '/category/queryTopCategoryPaging',
        data: {
            page: 1,
            pageSize: 10000
        },
        dataType: 'json',
        success:function (data) {  
            console.log(data);
            $dropdown.find('.dropdown-menu').html(template('topCate',data)).on('click','a',function () {  
                $dropdown.find('.text').html(this.dataset.text).data('id',this.dataset.id);
            });
        }
    });
};
// 初始化图片上传功能
App.prototype.fileUpload = function () {  
    // 1、 插件名称  jquery-fileupload 
    // 2、 jquery.ui.widget     jquery.fileupload
    // 3、 页面结构
    // 4、 初始化
    $('#fileUpload').fileupload({
        // 类似发送ajax请求
        url: '/category/addSecondCategoryPic',
        dataType: 'json',
        done: function (e,data) {  
            //完成了上传  后台返回了地址
            // var picAddr = JSON.parse(data.result).picAddr;
            console.log(data.result.picAddr);
            $('.imgBox img').attr('src',data.result.picAddr);
        }
    });
};