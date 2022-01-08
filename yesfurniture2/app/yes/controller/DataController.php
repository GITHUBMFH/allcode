<?php
namespace app\yes\controller;

use app\yes\model\OrderModel;
use app\yes\model\OrderPriceModel;
use app\yes\model\OrderProductPriceModel;
use cmf\controller\AdminBaseController;
use think\Db;
use think\facade\Cache;

class DataController extends AdminBaseController
{
    //订单列表
    public function order()
    {
        if ($this->request->isPost()) {
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $order = Db::name('order')
                    ->alias("a")
                    ->join('__ORDER_PRICE__ c', 'c.order_id =a.id', 'LEFT')
                    ->join('__ORDER_PRICE_LST__ d', 'd.order_id =a.id', 'LEFT')
                    ->join('__CLIENT__ b', 'a.client_id =b.id', 'LEFT')
                    ->field('a.*,b.s_name,c.price,sum(d.receipt) as receipt')
                    ->page($page, $limit)
                    ->group('a.id')
                    ->order('a.order_time desc,a.num desc')
                    ->select()->toArray();

            $productprice = Db::name('order')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT__ g', 'g.order_id =a.id', 'LEFT')
                    ->join('__ORDER_PRODUCT_PRICE__ f', 'f.product_id =g.id', 'LEFT')
                    ->field('sum(f.price * g.amount) as productprice')
                    ->page($page, $limit)
                    ->group('a.id')
                    ->order('a.order_time desc,a.num desc')
                    ->select()->toArray();
            
            foreach ($productprice as $key =>$vlue) {
                $order[$key]['productprice'] = $vlue['productprice'];
            }
            $count = Db::name('order')
                    ->alias("a")
                    ->join('__CLIENT__ b', 'a.client_id =b.id', 'LEFT')
                    ->join('__ORDER_PRICE__ c', 'c.order_id =a.id', 'LEFT')
                    ->join('__ORDER_PRICE_LST__ d', 'd.order_id =a.id', 'LEFT')
                    ->field('a.*,b.s_name,c.price,sum(d.receipt) as receipt')
                    ->group('a.num')
                    ->count();
            $data["data"]=$order;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
        $order  = new OrderModel;
        $year = $order->Distinct(true)->field('year')->select();
        $client = Db::name('client')->Distinct(true)->select();
        $this->assign('client', $client);
        $this->assign('year', $year);
        return $this->fetch('data/order');
    }

    //生产单总价格
    public function changprice()
    {
        $id = $this->request->param('id', 0, 'intval');
        $data = $this->request->param();
        $result = new OrderPriceModel;
        $count = $result->where('order_id', $id)->count();
        unset($data['id']);
        $data['order_id'] = $id;
        if ($count>0) {
            $order  = $result->allowField(true)->where('order_id', $id)->update(['price'=>$data['price'],'remark'=>$data['remark']]);
        } else {
            $order  = $result->allowField(true)->save($data);
        }
        if ($order) {
            $this->success('提交成功');
        } else {
            $this->error('提交失败');
        }
    }

    //生产单搜索
    public function orderSearchlst()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $where = array_filter($this->request->param());
            $where2 = [];
            $where3 = [];
            $where4 = [];
            $where5 = [];
            $complete = 0;
            if (isset($where['complete'])) {
                if ($where['complete']==1) {
                    $complete = 1;
                } else {
                    $complete = 2;
                }
                unset($where['complete']);
            }
            unset($where['page']);
            unset($where['limit']);
            if (isset($where['order_id'])) {
                $where['a.id']=$where['order_id'];
                unset($where['order_id']);
            }
            if (isset($where['pro_progress'])) {
                if ($where['pro_progress']==1) {
                    $where3 = [['a.pro_progress', '<', 100]];
                } else {
                    $where3 = [['a.pro_progress', '>=', 100]];
                }
                unset($where['pro_progress']);
            }

            if (isset($where['ship_progress'])) {
                if ($where['ship_progress']==1) {
                    $where4 = [['a.ship_progress', '<', 100]];
                } else {
                    $where4 = [['a.ship_progress', '>=', 100]];
                }
                unset($where['ship_progress']);
            }

            if (isset($where['starttime'])||isset($where['endtime'])) {
                $starttime = $where['starttime'];
                $endtime = $where['endtime'];
                $where2 = [['data', 'between time', [$starttime, $endtime]]];
                unset($where['starttime']);
                unset($where['endtime']);
            };
            $result = Db::name('order')
                            ->alias("a")
                            ->join('__ORDER_PRICE__ c', 'c.order_id =a.id', 'LEFT')
                            ->join('__ORDER_PRICE_LST__ d', 'd.order_id =a.id', 'LEFT')
                            ->join('__CLIENT__ b', 'a.client_id =b.id', 'LEFT')
                            ->field('a.*,b.s_name,c.price,sum(d.receipt) as receipt,(c.price-sum(d.receipt)) as complete')
                            ->where($where)
                            ->where($where2)
                            ->where($where3)
                            ->where($where4)
                            // ->page($page, $limit)
                            ->group('a.id')
                            ->order('a.order_time desc,a.num desc')
                            ->select()->toArray();

            $productprice = Db::name('order')
                            ->alias("a")
                            ->join('__ORDER_PRODUCT__ g', 'g.order_id =a.id', 'LEFT')
                            ->join('__ORDER_PRODUCT_PRICE__ f', 'f.product_id =g.id', 'LEFT')
                            ->field('sum(f.price * g.amount) as productprice')
                            ->where($where)
                            ->where($where2)
                            ->where($where3)
                            ->where($where4)
                            // ->page($page, $limit)
                            ->group('a.id')
                            ->order('a.order_time desc,a.num desc')
                            ->select()->toArray();
                    
            foreach ($productprice as $key =>$vlue) {
                $result[$key]['productprice'] = $vlue['productprice'];
            }

            // 未结清
            if ($complete==1) {
                foreach ($result as $key => &$vlue) {
                    if ($result[$key]['complete'] < 0 || $result[$key]['complete'] =='0'||$result[$key]['price']=='0') {
                        unset($result[$key]);
                    }
                }
                $result = array_merge($result);
            }
            // 结清
            if ($complete==2) {
                foreach ($result as $key => &$vlue) {
                    if ($result[$key]['complete'] >0) {
                        unset($result[$key]);
                    }else if ($result[$key]['receipt'] ===null && $result[$key]['price'] !='0') {
                        unset($result[$key]);
                    }else if ($result[$key]['price'] ===null) {
                        unset($result[$key]);
                    }
                }
                $result = array_merge($result);
            }

            $count = Db::name('order')
                            ->alias("a")
                            ->join('__ORDER_PRICE__ c', 'c.order_id =a.id', 'LEFT')
                            ->join('__ORDER_PRICE_LST__ d', 'd.order_id =a.id', 'LEFT')
                            ->join('__CLIENT__ b', 'a.client_id =b.id', 'LEFT')
                            ->field('a.*,b.s_name,c.price,sum(d.receipt) as receipt')
                            ->where($where)
                            ->where($where2)
                            ->where($where3)
                            ->where($where4)
                            ->group('a.id')
                            ->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }

    //产品价格
    public function product()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $order = Db::name('order_product')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT_PRICE__ b', 'b.product_id =a.id', 'LEFT')
                    ->join('__COST__ c', 'c.product_id =a.id', 'LEFT')
                    ->join('__RECORD_DETAILS__ d', 'd.product_id =a.id', 'LEFT')
                    ->where('a.order_id', $id)
                    ->field('a.*,sum(d.price) as a_price,c.labor_cost,c.material_cost,b.price,b.price*a.amount as money')
                    ->page($page, $limit)
                    ->group('a.id')
                    ->select();

            $count = Db::name('order_product')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT_PRICE__ b', 'b.product_id =a.id', 'LEFT')
                    ->join('__COST__ c', 'c.product_id =a.id', 'LEFT')
                    ->join('__RECORD_DETAILS__ d', 'd.product_id =a.id', 'LEFT')
                    ->where('a.order_id', $id)
                    ->group('a.id')
                    ->count();
            $data["data"]=$order;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }

    //生产单总价格
    public function productprice()
    {
        $id = $this->request->param('id', 0, 'intval');
        $data = $this->request->param();
        $result = new OrderProductPriceModel;
        $count = $result->where('product_id', $id)->count();
        unset($data['id']);
        $data['product_id'] = $id;
        if ($count>0) {
            $order  = $result->allowField(true)->where('product_id', $id)->update(['price'=>$data['price']]);
        } else {
            $order  = $result->allowField(true)->save($data);
        }
        if ($order) {
            $this->success('提交成功');
        } else {
            $this->error('提交失败');
        }
    }

    //进账
    public function finance()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $order = Db::name('order_price_lst')
                    ->alias("a")
                    ->join('__FINANCE__ b', 'a.finance_id =b.id', 'LEFT')
                    ->where('a.order_id', $id)
                    ->field('a.*,b.method,b.data')
                    ->select();

            $count = Db::name('order_price_lst')->count();
            $data["data"]=$order;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
    }

    //工资列表
    public function wage()
    {
        if ($this->request->isPost()) {
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $order = Db::name('wage')
                        ->alias("a")
                        ->join('__WORKER__ c', 'c.id = a.worker_id', 'LEFT')
                        ->join('__WORK_TYPE__ e', 'e.id = c.work_id', 'LEFT')
                        ->join('__MATCH__ d', 'd.worker_id = a.worker_id and d.month = a.month and d.year = a.year', 'LEFT')
                        ->field('a.*,c.name,sum(d.amount) as amount,e.name as work_name,e.id as work_id')
                        ->page($page, $limit)
                        ->group('a.id')
                        ->order('a.id desc')
                        ->select()
                        ->toArray();

            $duration = Db::name('wage')
                        ->alias("a")
                        ->join('__WORKER__ c', 'c.id = a.worker_id', 'LEFT')
                        ->join('__WORK_ATTEND__ f', 'f.work_id = c.id and date_format(f.data,"%Y") = a.year and date_format(f.data,"%m") = a.month and f.type = 1', 'LEFT')
                        ->join('__WORK_TYPE__ e', 'e.id = c.work_id', 'LEFT')
                        ->field('sum(f.duration) as duration')
                        ->page($page, $limit)
                        ->group('a.id')
                        ->order('a.id desc')
                        ->select()
                        ->toArray();

            $borrow = Db::name('wage')
                        ->alias("a")
                        ->join('__WORKER__ c', 'c.id = a.worker_id', 'LEFT')
                        ->join('__WAGE_BORROW__ g', 'g.wage_id = a.id', 'LEFT')
                        ->join('__WORK_TYPE__ e', 'e.id = c.work_id', 'LEFT')
                        ->field('sum(g.price) as borrow')
                        ->page($page, $limit)
                        ->group('a.id')
                        ->order('a.id desc')
                        ->select()
                        ->toArray();
            
            foreach ($order as $key => &$vo) {
                $order[$key]['duration'] = $duration[$key]['duration'];
                $order[$key]['borrow'] = $borrow[$key]['borrow'];
            }

            $count = Db::name('wage')
                        ->alias("a")
                        ->join('__WORKER__ c', 'c.id = a.worker_id', 'LEFT')
                        ->join('__WORK_TYPE__ e', 'e.id = c.work_id', 'LEFT')
                        ->join('__WAGE_BORROW__ g', 'g.wage_id = a.id', 'LEFT')
                        ->join('__MATCH__ d', 'd.worker_id = a.worker_id and d.month = a.month and d.year = a.year', 'LEFT')
                        ->group('a.id')
                        ->count();
            $data["data"]=$order;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
        $worker = Db::name('worker')->Distinct(true)->field('name,id')->select();
        $work_type = Db::name('work_type')->Distinct(true)->field('name,id')->select();
        $this->assign('worker', $worker);
        $this->assign('work_type', $work_type);
        $worker_name = Db::name('worker')->field('name,id')->select();
        $this->assign('worker_name', $worker_name);
        return $this->fetch('data/wage');
    }

    // 工资录入
    public function wageAdd()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = Db::name('wage');
            $where['worker_id'] = $data['worker_id'];
            $where['year'] = $data['year'];
            $where['month'] = $data['month'];
            $count = $result->where($where)->count();
            if ($count>0) {
                $this->error('已经有重复数据');
            } else {
                $order  = $result->insert($data);
                if ($order) {
                    $this->success('提交成功');
                } else {
                    $this->error('提交失败');
                }
            }
        }
    }
    
    public function wageEdit()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = Db::name('wage');
            $order  = $result->update($data);
            if ($order) {
                $this->success('提交成功');
            } else {
                $this->error('提交失败');
            }
        }
    }
    
    public function wageDel()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id');
            $result  = Db::name('wage');
            $order  = $result->delete($id);
            if ($order) {
                $this->success('删除成功');
            } else {
                $this->error('删除失败');
            }
        }
    }

    // 获取员工
    public function getworker()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id');
            $result  = Db::name('worker');
            if (empty($id)) {
                $order  = $result->field('name,id')->Distinct(true)->select();
            } else {
                $order  = $result->where(['work_id'=>$id])->field('name,id')->Distinct(true)->select();
            }
            return $order;
        }
    }

    // 搜索
    public function wageSearchlst()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $where = array_filter($this->request->param());
            unset($where['page']);
            unset($where['limit']);
            $starttime = $this->request->param('starttime');
            $endtime = $this->request->param('endtime');
            unset($where['starttime']);
            unset($where['endtime']);
            if (isset($where['worker_id'])) {
                $where['a.worker_id'] = $where['worker_id'];
                unset($where['worker_id']);
            }
            if (isset($where['year'])) {
                $where['a.year'] = $where['year'];
                unset($where['year']);
            }
            if (isset($where['month'])) {
                $where['a.month'] = $where['month'];
                unset($where['month']);
            }
            if (isset($where['state'])) {
                $where['a.state'] = $where['state'];
                unset($where['state']);
            }
            $result = Db::name('wage')
                        ->alias("a")
                        ->join('__WORKER__ c', 'c.id = a.worker_id', 'LEFT')
                        ->join('__WORK_TYPE__ e', 'e.id = c.work_id', 'LEFT')
                        ->join('__MATCH__ d', 'd.worker_id = a.worker_id and d.month = a.month and d.year = a.year', 'LEFT')
                        ->field('a.*,c.name,sum(d.amount) as amount,e.name as work_name,e.id as work_id')
                        ->where($where)
                        ->page($page, $limit)
                        ->group('a.id')
                        ->order('a.id desc')
                        ->select()
                        ->toArray();

            $duration = Db::name('wage')
                        ->alias("a")
                        ->join('__WORKER__ c', 'c.id = a.worker_id', 'LEFT')
                        ->join('__WORK_ATTEND__ f', 'f.work_id = c.id and date_format(f.data,"%Y") = a.year and date_format(f.data,"%m") = a.month and f.type = 1', 'LEFT')
                        ->join('__WORK_TYPE__ e', 'e.id = c.work_id', 'LEFT')
                        ->field('sum(f.duration) as duration')
                        ->where($where)
                        ->page($page, $limit)
                        ->group('a.id')
                        ->order('a.id desc')
                        ->select()
                        ->toArray();

            $borrow = Db::name('wage')
                        ->alias("a")
                        ->join('__WORKER__ c', 'c.id = a.worker_id', 'LEFT')
                        ->join('__WORK_TYPE__ e', 'e.id = c.work_id', 'LEFT')
                        ->join('__WAGE_BORROW__ g', 'g.wage_id = a.id', 'LEFT')
                        ->field('sum(g.price) as borrow')
                        ->where($where)
                        ->page($page, $limit)
                        ->group('a.id')
                        ->order('a.id desc')
                        ->select()
                        ->toArray();

            foreach ($result as $key => &$vo) {
                $result[$key]['duration'] = $duration[$key]['duration'];
                $result[$key]['borrow'] = $borrow[$key]['borrow'];
            }

            $count = Db::name('wage')
                        ->alias("a")
                        ->join('__WORKER__ c', 'c.id = a.worker_id', 'LEFT')
                        ->join('__WORK_TYPE__ e', 'e.id = c.work_id', 'LEFT')
                        ->join('__WAGE_BORROW__ g', 'g.wage_id = a.id', 'LEFT')
                        ->join('__MATCH__ d', 'd.worker_id = a.worker_id and d.month = a.month and d.year = a.year', 'LEFT')
                        ->where($where)
                        ->group('a.id')
                        ->count();

            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }

    //借款记录
    public function borrowlst()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $order = Db::name('wage_borrow')
                    ->where('wage_id', $id)
                    ->select();
            $data["data"]=$order;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
    }

    public function addborrow()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $order  = Db::name('wage_borrow')->insert($data);
            if ($order) {
                $this->success('提交成功');
            } else {
                $this->error('提交失败');
            }
        }
    }

    public function delborrow()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $order  =Db::name('wage_borrow')->delete($id);
            if ($order) {
                $this->success('删除成功');
            } else {
                $this->error('删除失败');
            }
        }
    }

    public function editborrow()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $order  = Db::name('wage_borrow')->update($data);
            if ($order) {
                $this->success('提交成功');
            } else {
                $this->error('提交失败');
            }
        }
    }
    //改变工资发放状态
    public function changestate()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $order  = Db::name('wage')->update($data);
            if ($order) {
                $this->success('提交成功');
            } else {
                $this->error('提交失败');
            }
        }
    }


    //材料分析
    public function material()
    {
        return $this->fetch('data/material');
    }

    //材料分析数据
    public function getsupplierdata()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $num = $this->request->param('num');
            $result = Db::name('record')
                    ->alias("a")
                    ->join('__SUPPLIER__ b', 'b.id =a.supplier', 'LEFT')
                    ->where('data', 'like', '%'.$num.'%')
                    ->field('sum(a.price) as amount,b.s_name')
                    ->group('a.supplier')
                    ->select();
            $togeter = Db::name('record')->where('data', 'like', '%'.$num.'%')->sum('price');
            $supplierdta['result'] = $result;
            $supplierdta['togeter'] = $togeter;
            return $supplierdta;
        }
    }

    //材料分析数据
    public function getmeteaildata()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $num = $this->request->param('num');
            $result = Db::name('record_details')
                        ->alias("a")
                        ->join('__MATERIAL_TYPE__ b', 'b.id =a.type_id', 'LEFT')
                        ->join('__RECORD__ c', 'c.id =a.record_id', 'LEFT')
                        ->where('c.data', 'like', '%'.$num.'%')
                        ->field('sum(a.price) as amount,b.name')
                        ->group('b.name')
                        ->select();
            return $result;
        }
    }
}
