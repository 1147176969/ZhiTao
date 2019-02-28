$(function () {
    // 实现区域滚动
    mui('.mui-scroll-wrapper').scroll({
        // 滚动条显示 默认为true
        indicators: false
    });
    // 轮播图
    mui('.mui-slider').slider({
        interval: 1000
    });
})