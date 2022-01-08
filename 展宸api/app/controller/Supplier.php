<?php
declare(strict_types = 1);

namespace app\controller;

use think\facade\Db;

class Supplier
{
    public function lst()
    {
        if (request()->method()=='POST') {
            $pageSize= request()->post('pageSize')?request()->post('pageSize'):10;
            $pageIndex= request()->post('pageIndex')?request()->post('pageIndex'):1;
            $supplier= request()->post('filter.supplier');
            $name= request()->post('name');
            $id= request()->post('id');

            $sort['id']='desc';
            if (!empty($supplier)) {
                $where[]=['name','in',$supplier];
            }

            !empty($name)?$where[]=['name','like','%'.$name.'%']:null;
            !empty($id)?$where[]=['id','=',$id]:null;

            $sql = Db::name('supplier')->where(isset($where)?$where:[]);

            $succes['count'] = $sql->count();
            $result = $sql
            ->order($sort)
            ->paginate(['list_rows'=>$pageSize,'page'=>$pageIndex]);
            $succes['count'] = $result->total();
            
            $ret = [];
            if ($result) {
                foreach ($result->items() as $a) {
                    $array = [
                        "id"     => $a['id'],
                        "name"   => $a['name'],
                        "address"   => $a['address'],
                        "contact"   => $a['contact'],
                    ];
                    $ret[]=$array;
                };
            }
            $succes['data']=$ret;
            $succes['msg']='成功';
            $eorro['msg']='失败';
            return $result?json($succes):json($eorro);
        }
    }

    public function save()
    {
        if (request()->method()=='POST') {
            $data = request()->Post();
            $sql =Db::name('supplier');
            $result = $sql->save($data);
            $succes['msg']='成功';
            $eorro['msg']='写入失败';
            return $result?json($succes):json($eorro);
        }
    }

    //搜索查询的时候获得项目名称
    public function getname()
    {
        if (request()->method()=='POST') {
            $sql = Db::name('supplier');
            $value = request()->post('name');
            $where[]=['name','like','%'.$value.'%'];
            $result = $sql->Distinct(true)->where($where)->column('name');
            $data['data']= $result;
            $data['msg']='成功';
            $eorro['msg']='查询失败';
            return $result?json($data):json($eorro);
        }
    }
}
