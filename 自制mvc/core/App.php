<?php

require_once './core/FrameWork.php';
$result = FrameWork::init();
$contrller = $result['controller'];
$action = $result['action'];

if(file_exists('./application/contrller/Base.php')){
    require_once './application/contrller/Base.php';
}

require_once './application/contrller/'.$contrller.'.php';

// 实例化控制器
// $class = new $contrller;
// $class->$action();

// 实例化控制器2
$class = new ReflectionClass($contrller);//建立$contrller这个类的反射类
$instance = $class->newInstanceArgs();//实例化$contrller这个类
$method = $class->getMethod($action);//获取$contrller类中的方法
$method->invoke($instance);//执行类中的方法