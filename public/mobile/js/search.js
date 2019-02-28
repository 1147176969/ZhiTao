$(function () {
    /*
    需求分析：
        1、点击搜索框 获取输入框内容 追加到历史记录 且完成商品列表跳转
        1、1 如果搜索的关键字 和在记录的列表中有相同的 删除之前的历史记录 追加现在的历史记录
        1、2 如果搜索的关键字 超过了10条 删除第一条历史记录 追加现在的历史记录
        2、页面初始化 根据当前存储的历史信息 渲染页面
        3、点击删除按钮 删除当前的历史记录
        4、点击清空按钮  删除所有的历史记录
    */ 
    new App();
});
var App = function () {
    // 约定
    this.KEY = 'zt_history';
    // el  待渲染的元素
    this.$el = $('.zt_history');
    // 搜索按钮
    this.$searchBtn = $('.zt_search a');
    // 搜索框
    this.$searchInput = $('.zt_search input').val('');
    // 获取需要的数据  localstorage获取 约定key  数据类型 {‘’，‘’}
    // 类型就是数组
    this.list = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    this.init();
}
App.prototype.init = function () {
    this.render();
    this.bindEvent();
}
// 初始化  页面的渲染
App.prototype.render = function () {
    this.$el.html(template('history', {rows:this.list,ec:encodeURIComponent}))
}
// 绑定事件
App.prototype.bindEvent = function () {
    var that = this;
    that.$searchBtn.on('tap',function () {  
        that.push();
    });
    // 删除功能
    that.$el.on('tap','li span', function () {  
        that.delete(this.dataset.index);
        // 清空记录功能
    }).on('tap','.clear',function () {  
        that.clear();
    });
}
// 追加
App.prototype.push = function () {  
    // 搜索框输入的内容 $.trim() 工具函数 清除左右两侧空格
    var value = $.trim(this.$searchInput.val());
    if(!value) {
        mui.toast('请输入关键字')
        return;
    }
    // 默认没有相同的
    var isSame = false;
    var sameIndex = null;
    this.list.forEach(function (item,i) {  
        if(item == value) {
            isSame = true;
            sameIndex = i;
        }
    });

    if(isSame) {
        // 删除之前的  根据索引
        this.list.splice(sameIndex, 1);
    } else if(this.list.length >= 10) {
        // 删除第一条 
        this.list.splice(0,1);
    }
    // 追加现在的
    this.list.push(value);
    // 存储
    localStorage.setItem(this.KEY, JSON.stringify(this.list));
    // 跳转
    // encodeURIComponent  转换成url编码 把url编码转换成正常字符串 decodeURIComponent
    // 在html传递数据 可能出现特殊字符 影响解析 在IE浏览器会出现乱码
    location.href = 'list.html?proName=' + encodeURIComponent(value);
}
// 删除
App.prototype.delete = function (index) {
    // 根据索引删除 一个
    this.list.splice(index, 1);
    // 删完  把当前的状态存储
    localStorage.setItem(this.KEY, JSON.stringify(this.list));
    // 并重新渲染
    this.render();
}
// 清空
App.prototype.clear = function () {  
    this.list = [];
    // 存储
    localStorage.setItem(this.KEY, JSON.stringify(this.list));
    // 重新渲染
    this.render();
}