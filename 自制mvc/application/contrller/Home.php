<?php
defined('BASEPATH') OR exit('禁止进入');//检测是否有这个常量，没有的话禁止访问
// namespace 
// require_once './application/contrller/Base.php';
class Home extends Base{
    public function index(){
        dump('我是助手函数');//使用助手函数
        // FrameWork::view('index');
        view('index');
    }
}