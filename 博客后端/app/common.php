<?php
use think\Response;
use think\facade\Db;

// 应用公共文件
if (!function_exists('create')) {
    function create($data, $msg, $code=200, $count=false, $type='json')
    {
        $result=[
            'code'=>$code,
            'msg'=>$msg,
            'data'=>$data,
        ];
        $count?$result['count']=$count:null;
        return Response::create($result, $type);
    }
}


/**
 *  解决跨域访问公共方法
 */
function setheader()
{
    // 设置能访问的域名
    $originArr = [
        'http://localhost:4200',
        'http://mfh.yasfurniture.cn'
    ];
    // 获取当前跨域域名
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if (in_array($origin,$originArr)) {
        // 允许 $originarr 数组内的 域名跨域访问
        header('Access-Control-Allow-Origin:' . $origin);
        // 响应类型
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
        // 带 cookie 的跨域访问
        header('Access-Control-Allow-Credentials: true');
        // 响应头设置
        header('Access-Control-Allow-Headers:x-requested-with,Content-Type,X-CSRF-Token');
    }
}