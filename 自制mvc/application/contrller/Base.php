<?php
defined('BASEPATH') OR exit('禁止进入');//检测是否有这个常量，没有的话禁止访问

class Base{
    public function __construct()
    {
        echo '我是基础控制器';
    }

    function __destruct()
    {
        
    }
}

class saler{
    const pi='dsf';
}
echo saler::pi;