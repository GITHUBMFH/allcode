<?php
namespace app\controller;

use app\BaseController;
use think\facade\View;

class Index extends BaseController
{
    public function index()
    {
        // halt('sdf');
        return View::fetch();
    }

    public function hello()
    {
        // dump('hello');
        halt('dsf');
        // return 'hello,';
    }

    public function getvideo()
    {
        $url="https://www.8090g.cn/?url=https://v.qq.com/x/cover/mzc00200jq7kvn8.html";
        $file="";
        if ($url==' ') {
            return false;
        }
        $fp = fopen($url, 'r') or exit('Open url faild!');
        if ($fp) {
            while (!feof($fp)) {
                $file .= fgets($fp) . "";
            }
            fclose($fp);
        }
        return $file;
        // dump($file);
        // die;
    }
}
