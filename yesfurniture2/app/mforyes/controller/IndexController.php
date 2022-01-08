<?php

namespace app\mforyes\controller;

use cmf\controller\HomeBaseController;

class IndexController extends HomeBaseController
{
    public function index()
    {
        cookie('think_var', 'en-us');
        $this->assign('haha', cookie('think_var'));
        return 'jhee';
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
