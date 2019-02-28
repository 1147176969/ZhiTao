$(function () {  
    $('form').on('submit', function (e) {  
        // submit默认有提交操作  阻止浏览器默认行为
        e.preventDefault();
        // ajax 提交
        $.ajax({
            type: 'post',
            url: '/user/login',
            data: {
                username: $('[type=text]').val(),
                password: $('[type=password]').val()
            },
            dataType: 'json',
            success: function (data) {  
                console.log(data);
                if(data.success) {
                    var returnUrl = zt.getParamsByUrl().returnUrl;
                    // 1、跳转来源
                    if(returnUrl) {
                        location.href = returnUrl;
                        // 2、跳转个人中心
                    } else {
                        location.href = '/mobile/user/index.html';
                    }
                } else {
                    mui.toast(data.message);
                }
            }
        });
    })
})