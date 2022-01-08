<?php
declare (strict_types = 1);

namespace app\controller;

use think\facade\Db;

class Changeconst
{
    public function gettag(){
        if(request()->method()=='POST'){
            $result = Db::name('const')->where('name','=','tag')->value('value');
            return $result?create(json_decode($result),'查询成功'):create([],'查询失败',202);
        }
    }
    public function savetag(){
        if(request()->method()=='POST'){
            $value = request()->post('tag');
            $value = json_encode($value);
            $result = Db::name('const')->where('name','=','tag')->save(['value' => $value]);
            return $result?create([],'修改成功'):create([],'修改失败',202);
        }
    }
}
