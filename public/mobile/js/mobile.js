// 定义公用函数

// zt  函数命名空间
if(!window.zt) {
    window.zt = function () {};
}

// zt的方法
// 从地址栏获取数据返回一个对象
zt.getParamsByUrl = function () {  
    // 目的：url= http://localhost:4000/mobile/list.html?proName=1&proId=100
    // 获取：{proName:1, proId:100}
    var obj = {};
    var search = location.search;
    if(search) {
        search = search.replace(/^\?/,'');  //把第一个？去掉   eg：？name
        var arr = search.split('&');  // 得到的结果 ['proName=1',"proId=100"]
        arr.forEach(function (item, i) {  
            var itemArr = item.split('='); // ["proName",1]    key ,value
            obj[itemArr[0]] = decodeURIComponent(itemArr[1]);
        });
    }
    return obj;
};