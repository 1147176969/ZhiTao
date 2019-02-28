$(function () {  
    /*1、 登录*/
    $('#loginForm').on('submit', function (e) {
        // 阻止默认的提交
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/employee/employeeLogin',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (data) {  
                console.log(data);
                if(data.success) {
                    location.href = 'index.html';
                } else {
                    $('#message').html(data.message);
                }
            }
        });
    });
});