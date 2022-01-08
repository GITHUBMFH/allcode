<?php
declare(strict_types = 1);

namespace app\controller;

class Error{
    public function index(){
        // 404 类不存在
        return create([],'资源不存在',404);
    }
}