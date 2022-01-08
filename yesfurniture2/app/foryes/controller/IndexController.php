<?php
// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2018 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Released under the MIT License.
// +----------------------------------------------------------------------
// | Author: 老猫 <thinkcmf@126.com>
// +----------------------------------------------------------------------

namespace app\foryes\controller;

use cmf\controller\HomeBaseController;

class IndexController extends HomeBaseController
{
    public function index()
    {
        // 设置英文
        cookie('think_var', 'en-us');
        $this->assign('haha',cookie('think_var'));
        return $this->fetch(':index');
    }

    public function product()
    {
        return $this->fetch(':product');
    }

    public function productdetail()
    {
        return $this->fetch(':productdetail');
    }

    public function example()
    {
        return $this->fetch(':example');
    }
    public function exampledetail()
    {
        return $this->fetch(':exampledetail');
    }

    public function aboutus()
    {
        return $this->fetch(':aboutus');
    }

    public function contact()
    {
        return $this->fetch(':contact');
    }
}
