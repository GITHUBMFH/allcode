<?php
declare(strict_types = 1);

namespace app\controller;

use think\facade\Db;

class Expense
{
    public function lst()
    {
        if (request()->method()=='POST') {
            $pageSize= request()->post('pageSize')?request()->post('pageSize'):10;
            $pageIndex= request()->post('pageIndex')?request()->post('pageIndex'):1;
            $state= request()->post('state');
            $people_id= request()->post('people_id');
            $expense_id= request()->post('id');

            $sort['a.id']='desc';
            if (!empty($expense)) {
                $where[]=['a.name','in',$expense];
            }

            !empty($state)?$where[]=['a.state','=',$state]:null;
            !empty($people_id)?$where[]=['a.people_id','=',$people_id]:null;
            !empty($expense_id)?$where[]=['a.id','=',$expense_id]:null;

            $sql = Db::name('expense')
                    ->alias("a")
                    ->join('supplier b', 'a.supplier =b.id', 'LEFT')
                    ->join('people c', 'a.people_id =c.id', 'LEFT')
                    ->join('order d', 'a.relate_orderid =d.id', 'LEFT')
                    ->field('a.*,b.name as supplier_name,c.name as name,d.name as order_name,d.num as order_num')
                    ->where(isset($where)?$where:[]);
            $result = $sql
            ->order($sort)
            ->paginate(['list_rows'=>$pageSize,'page'=>$pageIndex]);
            $ret = [];
            if ($result) {
                foreach ($result->items() as $a) {
                    $a['proof']?$proof = explode(",", $a['proof']):$proof=[];
                    $array = [
                        "id"     => $a['id'],
                        "people_id"   => $a['people_id'],
                        "num"   => $a['num'],
                        "result"   => $a['result'],
                        "state"   => $a['state'],
                        "supplier"   => $a['supplier'],
                        "proof_num"   => $a['proof_num'],
                        "date"   => $a['date'],
                        "proof_data"   => date("Y-m-d", strtotime($a['proof_data'])),
                        "name"   => $a['name'],
                        "proof"   => $proof,
                        "order_name"   =>$a['order_num']?$a['order_num'].'-'.$a['order_name']:'库存',
                        "supplier_name"   =>$a['supplier_name']?$a['supplier_name']:'',
                    ];

                    if (strpos($_SERVER['HTTP_USER_AGENT'], 'wechat') !== false) {
                        $a['relate']?$relate = explode(",", $a['relate']):$relate = null;

                        $array['relate']=$relate;
                        $array['relate_orderid']=$a['relate_orderid'];
                        $array['steps']=[
                            ['text'=>'提交','desc'=>$a['date']?date("Y-m-d", strtotime($a['date'])):"暂无"],
                            // ['text'=>'审核1','desc'=>''],
                            // ['text'=>'审核2','desc'=>''],
                            ['text'=>'付款','desc'=>$a['pay_data']?date("Y-m-d", strtotime($a['pay_data'])):'暂无'],
                        ];
                    }
                    $ret[]=$array;
                };
            }
            return $result?create($ret, '查询成功', 200, $result->total()):create([], '查询失败', 204);
        }
    }

    public function save()
    {
        if (request()->method()=='POST') {
            $data = request()->Post();
            $shoplst = request()->Post('shoplst');
            unset($data['shoplst']);
            if (!empty($shoplst)) if(!saveall($shoplst,'shop')) return create([], '采购单修改失败', 204);
            $sql =Db::name('expense');
            $result = $sql->save($data);
            $succes['msg']='成功';
            $eorro['msg']='写入失败';
            return $result?create([], '添加成功'):create([], '添加失败', 204);
        }
    }
}