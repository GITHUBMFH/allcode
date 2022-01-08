<?php
declare(strict_types = 1);

namespace app\middleware;

use think\facade\Request;

class Check
{
    /**
     * 处理请求
     *
     * @param \think\Request $request
     * @param \Closure       $next
     * @return Response
     */
    public function handle($request, \Closure $next)
    {
        // $allowRquest=['people/login'];//允许访问的接口
        // $allowHost=['https://servicewechat.com/wx332b26121cc4817b/devtools/page-frame.html<br>/people/login','localhost:8000'];//允许访问的网站
        // // $gettoken = $request->session('token', '');

        // $puttoken = Request::instance()->header('token');

        // if(in_array($_SERVER['HTTP_REFERER'],$allowHost)){
        //     if(in_array($request->baseUrl(),$allowRquest)){
        //         return $next($request);
        //     }else{
        //         if($puttoken){
        //             return $next($request);
        //         }else{
        //             return '未登录';
        //         }
        //     }
        // }else{
        //     return '网站访问错误';
        // }
        return $next($request);
    }
    public function end($request)
    {
    }
}
