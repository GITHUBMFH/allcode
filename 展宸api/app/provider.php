<?php
use app\ExceptionHandle;
use app\Request;

// 容器Provider定义文件
return [
    'think\Request'          => Request::class,
    'think\exception\Handle' => ExceptionHandle::class,
    'basesql' => app\model\Basesql::class,
    'file'=>app\model\QiniuLoad::class
];
