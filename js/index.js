$(function() {
    let GET_P = new Get_Params()
    let _API = new API()
    let _Draw = new Draw()
    let _Message = new Message()
    initTask()
    $('.dialog').hide();
    // $('.loading-container').hide();
    //确认提交任务
    $('#submitTask').click(function() {
        //通过基础检验 才发送请求
        if (GET_P.getRunTaskParams()) {
            _Message.showMessage('提交中...')
            _API.run_tasks(JSON.stringify(GET_P.getRunTaskParams())).then(res => {
                initTask()
                reset()
                $('.dialog').hide();
                _Message.showMessage('提交成功')
                _Message.hideMessage()
            })
        }
    })
    //取消提交任务
    $('#cancelTask').click(function() {
        reset()
        $('.dialog').hide();
    })
    //点击任务提交按钮 弹出dialog框
    $('.showdialog').click(function() {
        $('.dialog').fadeIn();
    })
    //删除任务
    $('#task-aborted').on('click', '.del-btn', function() {
        let params = GET_P.getDelTaskParams($(this).data("id"))
        _API.del_task(params).then(res => {
            initTask()
        })
    })
    //查询任务
    $('#queryTask').click(function() {
        if (GET_P.getQueryParams()) {
            _Message.showMessage('加载中...')
            _API.get_task(GET_P.getQueryParams()).then(res => {
                _Draw.drawTask(res)
                _Message.hideMessage()
                // $('.loading-container').hide();
            })
        }
    })
    //重置查询条件
    $('#cancelQuery').click(function() {
        // query-date
        document.getElementById("queryform").reset(); //清空
        initTask()
    })
    //提示信息显示隐藏
    $('.tishi-icon').mouseenter(function() {
        $(this).find('.tips').css("display", "block")
    })
    $('.tishi-icon').mouseleave(function() {
        $(this).find('.tips').css("display", "none")
    })
    //任务提交表单的移入移出
    $('#run-task-form input').keyup(function() {
        if ($(this).val()) {
            $(this).removeClass("warning-input");
            $(this).siblings(".input-warning").css("display", "none");
            // input-warning
        } else {
            $(this).addClass("warning-input");
            $(this).siblings(".input-warning").css("display", "block");
        }
    })
    $('#run-task-form input').blur(function() {
        if ($(this).val()) {
            $(this).removeClass("warning-input");
            $(this).siblings(".input-warning").css("display", "none");
            // input-warning
        } else {
            $(this).addClass("warning-input");
            $(this).siblings(".input-warning").css("display", "block");
        }
    })
    $('#run-task-form textarea').keyup(function() {
        if ($(this).val()) {
            $(this).removeClass("warning-input");
            $(this).siblings(".input-warning").css("display", "none");
        } else {
            if (($('#run-task-form .area').val()) || ($('#run-task-form .line').val()) || ($('#run-task-form .point').val())) {
                $('#run-task-form textarea').removeClass("warning-input");
                $('#run-task-form .area').siblings(".input-warning").css("display", "none");
                // input-warning
            } else {
                $('#run-task-form textarea').addClass("warning-input");
                $('#run-task-form .area').siblings(".input-warning").css("display", "block");
            }
        }
    })
    $('#run-task-form textarea').blur(function() {
        if ($(this).val()) {
            $(this).removeClass("warning-input");
            $(this).siblings(".input-warning").css("display", "none");
        } else {
            if (($('#run-task-form .area').val()) || ($('#run-task-form .line').val()) || ($('#run-task-form .point').val())) {
                $('#run-task-form textarea').removeClass("warning-input");
                $('#run-task-form .area').siblings(".input-warning").css("display", "none");
                // input-warning
            } else {
                $('#run-task-form textarea').addClass("warning-input");
                $('#run-task-form .area').siblings(".input-warning").css("display", "block");
            }
        }
    })
    $('.dialog').click(function(event) {
        $('.dialog').hide()
    })
    $('#run-task-form').click(function(event) {
        event.stopPropagation()
        // $('.dialog').show()
    })

    //重置
    function reset() {
        $(`#run-task-form .yuan-warning`).css("display", "none");
        $('#run-task-form input').removeClass("warning-input");
        $('#run-task-form textarea').removeClass("warning-input");
        $('#run-task-form input').siblings(".input-warning").css("display", "none");
        $('#run-task-form textarea').siblings(".input-warning").css("display", "none");
        document.getElementById("run-task-form").reset(); //清空
    }
    //加载task
    function initTask() {
        _Message.showMessage('加载中...')
        _API.get_tasks().then(res => {
            _Draw.drawTasksList(res)
            $('.loading-container').hide();
        }).catch(error => {
            $('.loading-container').hide();
        })
    }

});
//获取参数
class Get_Params {
    constructor() {
        this.queryParamsMap = {
            'thisTime': '开始时间',
            'thisName': '案例名称'
        }
    }
    //获取查询的参数
    getQueryParams() {
        let queryParams = {}
        queryParams.thisTime = ($('#queryform .thisTime').val()).replace(/-/g, '')
        queryParams.thisName = $('#queryform .thisName').val()
        if (this.checkParams(queryParams)) {
            return queryParams
        } else {
            return
        }
    }
    //获取任务提交的参数
    getRunTaskParams() {
        let runTaskParams = {}
        let lat1 = +$('.lat1').val()
        let lat2 = +$('.lat2').val()
        let lon1 = +$('.lon1').val()
        let lon2 = +$('.lon2').val()
        runTaskParams.thisTime = ($('#run-task-form .thisTime').val()).replace(/-/g, '')
        runTaskParams.days = +$('#run-task-form .days').val()
        runTaskParams.thisName = $('#run-task-form .thisName').val()
        runTaskParams.xcell = +$('#run-task-form .xcell').val()
        runTaskParams.region = [lat1, lat2, lon1, lon2]
        runTaskParams.point = ($('#run-task-form .point').val()).replace(/\n/g, '\n')
        runTaskParams.line = $('#run-task-form .line').val()
        runTaskParams.area = $('#run-task-form .area').val()
        runTaskParams.site = $('#run-task-form .site').val()
        // runTaskParams.test = 1
        this.checkRunTaskParams(runTaskParams)
        if (this.checkRunTaskParams(runTaskParams)) {
            return runTaskParams
        } else {
            return false
        }
    }
    //获取删除任务参数
    getDelTaskParams(val) {
        let tempArr = val.split('-')
        let delTaskParams = {
            thisTime: tempArr[1],
            thisName: tempArr[0],
        }
        return delTaskParams
    }
    // 检查查询参数
    checkParams(params) {
        let toggle = true
        for (const key in params) {
            if (!params[key]) {
                alert(this.queryParamsMap[key] + '不能为空')
                toggle = false
            }
        }
        return toggle
    }
    // 检查提交任务参数
    checkRunTaskParams(params) {
        let w_num = 0
        let reg = /^[A-Za-z0-9_]|[\b]+$/g
        for (const key in params) {
            if (!params[key] && key !== 'point' && key !== 'area' && key !== 'line') {
                $(`#run-task-form .${key}-warning`).css("display", "block");
                $(`#run-task-form .${key}`).addClass("warning-input");
                w_num++
            } else {
                $(`#run-task-form .${key}-warning`).css("display", "none");
                $(`#run-task-form .${key}`).removeClass("warning-input");

            }
            if (key == 'point' || key == 'area' || key == 'line') {
                if (!params['point'] && !params['area'] && !params['line']) {
                    // $(`#run-task-form .${key}-warning`).css("display", "block");
                    $(`#run-task-form .${key}`).addClass("warning-input");
                    $(`#run-task-form .yuan-warning`).css("display", "block");

                    w_num++
                } else {
                    $(`#run-task-form .yuan-warning`).css("display", "none");

                }
            }
        }
        let regionBoolean = params.region.every(item => item) //四个模拟区域点位必须都填写
        if (!regionBoolean) {
            $(`#run-task-form .region-warning`).css("display", "block");
            w_num++
        } else {
            $(`#run-task-form .region-warning`).css("display", "none");
        }
        if (params.thisName) {
            if (!(/[A-Za-z0-9-\_]$/g.test(params.thisName))) { //英文数字下划线
                console.log('格式错了')
                $(`#run-task-form .thisName-warning`).css("display", "block");
                $(`#run-task-form .thisName`).addClass("warning-input");
                $(`#run-task-form .thisName-warning`).html("格式为英文字母、数字、下划线");
            }
        } else {
            $(`#run-task-form .thisName-warning`).css("display", "block");
            $(`#run-task-form .thisName-warning`).html("请输入案例名称");
        }

        if (w_num == 0) {
            return true
        } else {
            return false
        }
    }
}
//请求
class API {
    constructor() {
        //除了获取全部任务是BASEURLS 其他都是BASEURL
        this.BASEURL = `http://10.110.18.200:4000/api/lava/v1/calpuff/case`
        this.BASEURLS = `http://10.110.18.200:4000/api/lava/v1/calpuff/cases`
    }
    run_tasks(params) {
        return this._ajax('POST', this.BASEURL, params)
    }
    del_task(params) {
        return this._ajax('DELETE', this.BASEURL, params)
    }
    //获取所有任务
    get_tasks() {
        return this._ajax('GET', this.BASEURLS, {})
    }
    //查询单个任务
    get_task(params) {
        return this._ajax('GET', this.BASEURL, params)
    }
    /*
    @name _ajax
    @params type<String> 请求类型 GET POST DELETE
    @params baseurl<String> 请求基准地址
    @params params 请求参数
    */
    _ajax(type, baseurl, params) {
        // $('.loading-container').show();
        let url = baseurl
        if (type === 'DELETE') {
            url = `${baseurl}?thisTime=${params.thisTime}&thisName=${params.thisName}`
        }
        let headers = {}
        if (type === 'POST') {
            headers = { 'Content-Type': 'application/json' }
        }
        return new Promise(function(resolve, reject) {
            $.ajax({
                type,
                url,
                dataType: "json",
                data: params,
                headers,
                success: function(data) {
                    resolve(data)
                },
                error: function(error) {
                    reject(error)
                    return
                },
            });
        })
    }
}
//绘制task列表
class Draw {
    constructor() {
        this.BASEURL = 'http://10.110.18.200:4000'
    }
    drawTasksList(data) {
        this.voidTaskList() //清空内容
        let { aborted, active, complete } = data
        let task_complete_html = '',
            task_aborted_html = '',
            task_active_html = ''
        // 绘制已完成列表
        for (const key in complete) {
            task_complete_html += `<div class="content-task-item">
          <div>${key}</div>
          <div class="primary-btn btn"><a href="${this.BASEURL}${complete[key]}">下载</a></div>
        </div>`
        }
        // 绘制错误列表
        aborted.forEach(aborted_item => {
            task_aborted_html += `<div class="content-task-item">
          <div class="task-name">${aborted_item}</div>
          <div class="del-btn btn" data-id="${aborted_item}">删除</div>
        </div>`
        });
        // 绘制正在运行列表
        active.forEach(active_item => {
            task_active_html += `<div class="content-task-item">
        <div class="task-name">${active_item}</div>
      </div>`
        });
        $('#task-complete').html(task_complete_html)
        $('#task-aborted').html(task_aborted_html)
        $('#task-active').html(task_active_html)
    }
    drawTask(data) {
        this.voidTaskList() //清空内容
        let { status, name } = data
        if (status === "complete") {
            $('#task-complete').html(`<div class="content-task-item">
            <div>${name}</div>
            <div class="primary-btn btn"><a href="${this.BASEURL}${data.link}">下载</a></div>
          </div>`)
        } else if (status === "active") {
            $('#task-active').html(`<div class="content-task-item">
            <div class="task-name">${name}</div>
          </div>`)
        } else if (status === "aborted") {
            $('#task-aborted').html(`<div class="content-task-item">
            <div class="task-name">${name}</div>
            <div class="del-btn btn" data-id="${name}">删除</div>
          </div>`)
        }
    }
    voidTaskList() {
        $('#task-complete').html('')
        $('#task-aborted').html('')
        $('#task-active').html('')
    }
}
class Message {
    constructor() {
        // this.msg = msg
    }
    showMessage(msg) {
        $('.loading-container').show();
        $('.loading-container .loading-title').html(msg)
    }
    hideMessage() {
        $('.loading-container').hide();
    }
}