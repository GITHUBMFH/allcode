<?php
class FrameWork
{
    public static function init()
    {
        $request_url = $_SERVER['REQUEST_URI'];
        $script_name= $_SERVER['SCRIPT_NAME'];
        
        $request = str_replace($script_name, '', $request_url);//提取出控制器和参数 $request_url中的$script_name替换为空
        $request = ltrim($request, '/');
        $request_array = explode('?', $request);//用？分割为数组
        $controller_action = $request_array[0];
        $controller_action = explode('/', $controller_action);//分割控制器和方法

        if (count($controller_action)>=2) {
            $controller=$controller_action[0];
            $action=$controller_action[1];
        } else {
            $config=include("./config/config.php");
            // print_r($indb);
            // require_once './config/config.php';
            $controller=$config['default_controller'];
            $action=$config['default_action'];
        }
        return array('controller'=>$controller,"action"=>$action);
    }

    // public static function view($viewname){
    //     $title = '我是title';
    //     require_once './application/view/'.$viewname.'.html';
    // }
}

function view($viewname)
{
    $title = '我是后台设置的title';
    require_once './application/view/'.$viewname.'.html';
}
function dump($data)
{
    echo '<pre>';
    print_r($data);
    echo '</pre>';
}
function get($params=false)
{
    if (!$params) {
        return $_GET?$_GET:false;
    }
    return isset($_GET[$params])?$_GET($params):false;
}


// trait eat
// {
//     public $name='mfh';
// }

// class name{
//     use eat;
//     public function geteat(){
//     }
// }
