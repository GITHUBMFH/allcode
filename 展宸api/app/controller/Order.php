<?php
declare(strict_types = 1);

namespace app\controller;

use app\validate\order as ValidateOrder;
use DateTime;
use think\facade\Db;

use think\exception\ValidateException;

class Order
{
    public function __call($name, $arguments)
    {
        // 404方法不存在
        return create([], '资源不存在', 404);
    }
    // 项目列表
    public function orderlst()
    {
        if (request()->method()=='POST') {
            $pageSize= request()->post('pageSize')?request()->post('pageSize'):10;
            $pageIndex= request()->post('pageIndex')?request()->post('pageIndex'):1;

            $ordername= request()->post('filter.ordername');
            $orderdtae= request()->post('filter.orderdtae');
            $ordernum= request()->post('filter.ordernum');
            try {
                validate(ValidateOrder::class)->scene('search')->check([
                    'pageSize'=>$pageSize,
                    'pageIndex'=>$pageIndex,
                    'ordername'=>$ordername,
                    'orderdtae'=>$orderdtae,
                    'ordernum'=>$ordernum,
                ]);
            } catch (ValidateException $e) {
                return create([], $e->getError(), 400);
            };

            $numsort=request()->post('numsort');
            $datesort=request()->post('datesort');

            $where[]=['parent_id','=','0'];
            $sort['date']='desc';
            $sort['num']='desc';

            if (!empty($orderdtae)) {
                $where[]=['date','between time',[$orderdtae[0],$orderdtae[1]]];
            }
            if (!empty($ordername)) {
                $where[]=['name','in',$ordername];
            }
            if (!empty($ordernum)) {
                $where[]=['num','in',$ordernum];
            }

            if ($datesort==='descend') {
                $sort['date']='desc';
            } elseif ($datesort==='ascend') {
                $sort['date']='asc';
            } else {
                unset($sort['date']);
            }

            if ($numsort==='descend') {
                $sort['num']='desc';
            } elseif ($numsort==='ascend') {
                $sort['num']='asc';
            } else {
                $sort['num']='desc';
            }

            $sql = Db::name('order');
            $data = $sql->where($where)->order($sort)->paginate(['list_rows'=>$pageSize,'page'=>$pageIndex]);

            $ret = [];
            foreach ($data->items() as $a) {
                $array = [
                    "id"     => $a['id'],
                    "date"   => $a['date'],
                    "file"   => $a['file'],
                    "name"   => $a['name'],
                    "num"   => $a['num'],
                    "parent_id"   => $a['parent_id'],
                    "remark"   => $a['remark'],
                ];
                $sql = Db::name('order');
                $childsql = $sql->where('parent_id', $a['id']);
                $child =$childsql->count();
                $array['children']=[];
                $array['nzShowExpand']=false;
                if ($child>0) {
                    $array['children'] = $childsql->select()->toArray();
                    $array['nzShowExpand']=true;
                }
                $array['expand']=false;
                $ret[]=$array;
            }
            return create($ret, '查询成功', 200, $data->total());
        }
        return false;
    }

    // 新增项目
    public function save()
    {
        if (request()->method()=='POST') {
            $data = request()->param();
            $year = substr((new DateTime())->format("Y"), -2);
            $parentid = request()->post('parent_id');

            if ($parentid) {//添加新订单
                $num = Db::name('order')->where('id', $parentid)->value('num');
                if ($num) {
                    $code = Db::name('order')->where('parent_id', $parentid)->max('num');
                    !$code?$data['num']=$num.'01':$data['num']=$code+1;
                }
            } else {//添加新项目
                $num = request()->post('num');
                if (!$num) {
                    // 查询今天最大的工令号
                    $where[]=['num','like',"%$year%"];
                    $where[]=['parent_id','=','0'];
                    $code = Db::name('order')->where($where)->max('num');
                    !$code?$data['num']=$year.'01':$data['num']=$code+1;
                }
            };
            try {
                validate(ValidateOrder::class)->scene('save')->check($data);
            } catch (ValidateException $e) {
                return create([], $e->getError(), 400);
            };
            $result = Db::name('order')->save($data);
            return $result?create([], '添加成功'):create([], '添加失败', 204);
        }
    }

    // 删除项目列表
    public function delete()
    {
        if (request()->method()=='POST') {
            $id= request()->post('id');
            
            try {
                validate(ValidateOrder::class)->scene('del')->check(['id'=>$id]);
            } catch (ValidateException $e) {
                return create([], $e->getError(), 400);
            };
            
            $childid = Db::name('order')->where('parent_id', 'in', $id)->column('id');
            $childid?$ids = array_merge($id, $childid):$ids = $id;
            $checkexpense=$this->checkexpense($ids);
            if ($checkexpense) {
                return create([], '无法删除', 204);
            }
            Db::startTrans();
            try {
                $delimg=$this->delproduct($ids);
                if ($delimg) {
                    $result=Db::name('order')->where('id', 'in', $ids)->delete();
                } else {
                    return create([], '产品删除失败', 204);
                }
                Db::commit();
            } catch (\Exception $e) {
                Db::rollback();
            }
            return $result?create([], '删除成功'):create([], '删除失败', 204);
        }
    }

    // 删除订单下的产品
    public function delproduct($ids)
    {
        $productid = Db::name('product')->where('order_id', 'in', $ids)->column('id');
        $imgs=Db::name('product')->where('id', 'in', $productid)->column('pic');
        if (empty($productid)) {
            return true;
        }
        if (!empty($imgs)) {
            foreach ($imgs as $i) {
                $lst=explode(",", $i);
                foreach ($lst as $b) {
                    $delurl = app()->getRootPath().'/public/storage/'.$b;
                    if (file_exists($delurl)) {
                        @unlink($delurl);
                    }
                }
            }
        }
        $result2 = Db::name('product')->where('id', 'in', $productid)->delete();
        return $result2;
    }
    // 检查是否绑定有采购单
    public function checkexpense($ids)
    {
        return Db::name('expense')->where('relate', 'in', $ids)->column('relate');
    }

    //搜索查询的时候获得项目名称
    public function getordername()
    {
        if (request()->method()=='POST') {
            $sql = Db::name('order');
            $value = request()->post('name');
            $where[]=['name','like','%'.$value.'%'];
            request()->post('item')?$where[]=['parent_id','not in',[0]]:$where[]=['parent_id','=','0'];
            $result = $sql->Distinct(true)->where($where)->column('name');
            return $result?create($result, '查询成功'):create([], '查询失败', 204);
        }
    }

    // 联动搜索时获取工令号
    public function getordernum()
    {
        if (request()->method()=='POST') {
            $sql = Db::name('order');
            $name = request()->post('name');
            $value = request()->post('value');
            request()->post('item')?$where[]=['parent_id','not in',[0]]:$where[]=['parent_id','=','0'];
            $where[]=['num','like', '%'.$value.'%'];
            $name?$where[]=['name','in', $name]:null;
            $result = $sql->Distinct(true)->where($where)->column('num');
            return $result?create($result, '查询成功'):create([], '查询失败', 204);
        }
    }
    //查询所有的子订单
    public function getallorder()
    {
        if (request()->method()=='POST') {
            $sql = Db::name('order');
            $where[]=['parent_id','not in',[0]];
            $result = $sql->Distinct(true)->where($where)->field('name,id,num,state')->select();
            return $result?create($result, '查询成功'):create([], '查询失败', 204);
        }
    }


    // 项目列表
    public function itemlst()
    {
        if (request()->method()=='POST') {
            $pageSize= request()->post('pageSize')?request()->post('pageSize'):10;
            $pageIndex= request()->post('pageIndex')?request()->post('pageIndex'):1;
            $ordername= request()->post('filter.ordername');
            $orderdtae= request()->post('filter.orderdtae');
            $ordernum= request()->post('filter.ordernum');
            $orderstate= request()->post('filter.orderstate');

            try {
                validate(ValidateOrder::class)->scene('search')->check([
                    'pageSize'=>$pageSize,
                    'pageIndex'=>$pageIndex,
                    'ordername'=>$ordername,
                    'orderdtae'=>$orderdtae,
                    'ordernum'=>$ordernum,
                ]);
            } catch (ValidateException $e) {
                return create([], $e->getError(), 400);
            };

            $numsort=request()->post('numsort');
            $datesort=request()->post('datesort');
    
            $where[]=['parent_id','not in',[0]];
            $sort['date']='desc';
            $sort['num']='desc';

            if (!empty($orderdtae)) {
                $where[]=['date','between time',[$orderdtae[0],$orderdtae[1]]];
            }
            if (!empty($ordername)) {
                if (strpos($_SERVER['HTTP_USER_AGENT'], 'wechat') !== false) {
                    $where[]=['name','like','%'.$ordername.'%'];
                } else {
                    $where[]=['name','in',$ordername];
                }
            }
            if (!empty($ordernum)) {
                $where[]=['num','in',$ordernum];
            }

            if (!empty($orderstate)) {
                $orderstate==='0'?null:$where[]=['state','=',$orderstate];
            }
    
            if ($datesort==='descend') {
                $sort['date']='desc';
            } elseif ($datesort==='ascend') {
                $sort['date']='asc';
            } else {
                unset($sort['date']);
            }
    
            if ($numsort==='descend') {
                $sort['num']='desc';
            } elseif ($numsort==='ascend') {
                $sort['num']='asc';
            } else {
                $sort['num']='desc';
            }

            $sql = Db::name('order');
            $data = $sql->where($where)->order($sort)->paginate(['list_rows'=>$pageSize,'page'=>$pageIndex]);
            return create($data->items(), '查询成功', 200, $data->total());
        }
        return false;
    }
    // 获取订单数量
    public function getordercount()
    {
        if (request()->method()=='POST') {
            $ordername= request()->post('name');
            $result['count1']=$this->getcount1($ordername);
            $result['count2']=$this->getcount2($ordername);
            return json($result);
        }
    }
    // 获取完成订单数量
    public function getcount1($ordername)
    {
        $sql = Db::name('order');
        $count= $sql->where([['parent_id','not in',[0]],['state','=',1],['name','like','%'.$ordername.'%']])->count();
        return $count;
    }
    // 获取待发货订单数量
    public function getcount2($ordername)
    {
        $sql = Db::name('order');
        $count= $sql->where([['parent_id','not in',[0]],['state','=',2],['name','like','%'.$ordername.'%']])->count();
        return $count;
    }
    // 获取订单号
    public function getproducttitle()
    {
        if (request()->method()=='POST') {
            $sql = Db::name('order');
            $id= request()->post('id');
            $data=$sql->find($id);
            $result='ZC-'.$data['num'].'-'.$data['name'];
            return json($result);
        }
    }

    // 生产排序
    public function ordersotr()
    {
        $where[]=['parent_id','not in',[0]];
        $where[]=['state','=','1'];
        $sql = Db::name('order');
        $dataid = $sql->where($where)->column('id');
        $data = $sql->where($where)->select()->toarray();

        $sotr = Db::name('const')->where('name', '=', 'ordersotr')->value('value');

        $sotr2 = explode(",", $sotr);

        foreach ($dataid as $a) {
            if (!in_array($a, $sotr2)) {
                array_push($sotr2, $a);
            }
        }
        if($sotr!=$sotr2){
            $value = implode(",", $sotr2);
            Db::name('const')->where('name', '=', 'ordersotr')->save(['value' => $value]);;
        }

        $reslut=[];
        foreach ($sotr2 as $a) {
            foreach ($data as $k) {
                if($k['id']==$a){
                    array_push($reslut, $k);
                }
            }
        }
        return create($reslut, '查询成功', 200);
    }

    public function savesotr(){
        if(request()->method()=='POST'){
            $value = request()->post('id');
            $value = implode(",", $value);
            $result=Db::name('const')->where('name', '=', 'ordersotr')->save(['value' => $value]);
            return $result?create([], '修改成功', 200):create([], '修改失败', 204);
        }
    }
}
