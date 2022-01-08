<?php
namespace app;

// 应用请求对象类
class Request extends \think\Request
{
    // 设置数据默认过滤
    protected $filter = ['trim','strip_tags','htmlspecialchars','stripslashes','addslashes'];
}
