<?php
namespace app\yes\controller;

use cmf\controller\AdminBaseController;
use app\yes\model\RecordModel;
use think\Db;
use think\facade\Cache;

class RecordController extends AdminBaseController
{
    public function index()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $result = RecordModel::with('supplier')
                        ->page($page, $limit)
                        // ->order('number desc,data desc')
                        ->order('data desc')
                        ->select();
            $count = RecordModel::with('supplier')->select()->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        };
        $supplier = Db::name('supplier')->Distinct(true)->select();
        $this->assign('supplier', $supplier);
        return $this->fetch();
    }

    public function addPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $state = $this->request->param('state');
            if ($state =='5') {
                $finance['type'] = 'supplier';
                $finance['method'] = '5513账户';
                $finance['price'] = $this->request->param('price');
                $finance['name_id'] = $this->request->param('supplier');
                $finance['data'] = $this->request->param('data');
                $data['finance_id'] = Db::name('finance')->insertGetId($finance);
            }
            $result  = new RecordModel;
            $order  = $result->allowField(true)->save($data);
            if ($order) {
                return $this->success('添加成功');
            } else {
                return $this->error('添加失败');
            }
        }
    }

    public function editPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $id = $this->request->param('id');
            $state = $this->request->param('state');

            $result  = new RecordModel;
            $order  = $result->allowField(true)->update($data);

            if ($state =='5') {
                $finance_id = Db::name('record')->where('id', $id)->value('finance_id');
                $finance['type'] = 'supplier';
                $finance['method'] = '5513账户';
                $finance['price'] = $this->request->param('price');
                $finance['name_id'] = $this->request->param('supplier');
                $finance['data'] = $this->request->param('data');
                if (empty($finance_id)) {
                    $data['finance_id'] = Db::name('finance')->insertGetId($finance);
                    Db::name('record')->where('id', $id)->update(['finance_id'=>$data['finance_id']]);
                } else {
                    Db::name('finance')->where('id', $finance_id)->update($finance);
                }
            } elseif ($state =='4') {
                $finance_id = Db::name('record')->where('id', $id)->value('finance_id');
                $sum = Db::name('record')->where('finance_id', $finance_id)->sum('price');
                $result  = Db::name('finance')->where('id', $finance_id)->update(['price'=>null]);
                $result  = Db::name('finance')->where('id', $finance_id)->update(['price'=>$sum]);
            } else {
                $finance_id = Db::name('record')->where('id', $id)->value('finance_id');
                if (!empty($finance_id)) {
                    Db::name('finance')->delete($finance_id);
                    Db::name('record')->where('id', $id)->update(['finance_id'=>null]);
                }
            }
            if ($order) {
                return $this->success('修改成功');
            } else {
                return $this->error('修改失败');
            }
        }
    }

    //批量修改状态
    public function changeState()
    {
        if ($this->request->isPost()) {
            $result = new RecordModel();
            $data = $this->request->param('id');
            $state = $this->request->param('state');

            $Spare = $result->where('id', 'in', $data)->update(['state'=>$state]);
            if ($Spare) {
                return $this->success('修改成功');
            } else {
                return $this->error('修改失败');
            }
        }
    }

    //批量修改状态
    public function endmonth()
    {
        if ($this->request->isPost()) {
            if (session('ADMIN_ID')!=1&&session('ADMIN_ID')!=14) {
                return $this->error('权限不足');
            }
            $result = new RecordModel();
            $id = $this->request->param('id');
            $supplier = $this->request->param('supplier');

            $sum = $result->where('id', 'in', $id)->sum('price');

            $finance['type'] = 'supplier';
            $finance['method'] = '5513账户';
            $finance['price'] = $sum;
            $finance['name_id'] = $this->request->param('supplier');
            $finance['data'] = $this->request->param('time');
            $finance_id = Db::name('finance')->insertGetId($finance);

            $Spare = $result->where('id', 'in', $id)->update(['state'=>'4','finance_id'=>$finance_id]);
            if ($Spare) {
                return $this->success('修改成功');
            } else {
                return $this->error('修改失败');
            }
        }
    }

    public function delPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $state = Db::name('record')->where('id', $id)->value('state');
            if ($state =='5') {
                $finance_id = Db::name('record')->where('id', $id)->value('finance_id');
                if (!empty($finance_id)) {
                    Db::name('finance')->delete($finance_id);
                }
            } elseif ($state =='4') {
                return $this->error('已结清，请前往进账页面删除');
            }
            $result  = new RecordModel;
            $order  = $result->destroy($id);
            if ($order) {
                return $this->success('删除成功');
            } else {
                return $this->error('删除失败');
            }
        }
    }

    public function account()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('dataid');
            $result = Db::name('record')
                        ->alias("a")
                        ->join('__RECORD_DETAILS__ b', 'a.id =b.record_id', 'LEFT')
                        ->join('__SUPPLIER__ c', 'a.supplier =c.id', 'LEFT')
                        ->whereIn('a.id',$id)
                        ->field('a.number,a.data,b.name,b.num,b.oneprice,b.price,b.unit,b.size,c.name as supplier_name')
                        ->select();
            $amount = Db::name('record')
                        ->alias("a")
                        ->join('__RECORD_DETAILS__ b', 'a.id =b.record_id', 'LEFT')
                        ->join('__SUPPLIER__ c', 'a.supplier =c.id', 'LEFT')
                        ->whereIn('a.id',$id)
                        ->value('sum(binary(b.price))');   
                        
            $max_data = Db::name('record')
                        ->alias("a")
                        ->join('__RECORD_DETAILS__ b', 'a.id =b.record_id', 'LEFT')
                        ->join('__SUPPLIER__ c', 'a.supplier =c.id', 'LEFT')
                        ->whereIn('a.id',$id)
                        ->value('max(a.data)');
            $min_data = Db::name('record')
                        ->alias("a")
                        ->join('__RECORD_DETAILS__ b', 'a.id =b.record_id', 'LEFT')
                        ->join('__SUPPLIER__ c', 'a.supplier =c.id', 'LEFT')
                        ->whereIn('a.id',$id)
                        ->value('min(a.data)');

            // halt($result);
            $this->assign('result', $result);
            $this->assign('amount', $amount);
            $this->assign('max_data', $max_data);
            $this->assign('min_data', $min_data);
            $this->assign('date', date("Y年m月d日"));
            return $this->fetch();
        }
    }

    // 搜索
    public function searchlst()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $where = array_filter($this->request->param());
            $where2 = [];
            unset($where['page']);
            unset($where['limit']);
            if (isset($where['number'])) {
                $where= [['number', 'like', '%'.$where['number'].'%']];
                unset($where['number']);
            };
            if (isset($where['starttime'])||isset($where['endtime'])) {
                $starttime = $where['starttime'];
                $endtime = $where['endtime'];
                $where2 = [['data', 'between time', [$starttime, $endtime]]];
                unset($where['starttime']);
                unset($where['endtime']);
            };
            $result = RecordModel::with('supplier')
                    ->where($where)
                    ->where($where2)
                    ->page($page, $limit)
                    ->order('data desc')
                    ->select();
            $count =  RecordModel::with('supplier')
                    ->where($where)
                    ->where($where2)
                    ->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }

    public function search()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');

            $result = Db::name('record')
                        ->alias("a")
                        ->join('__SUPPLIER__ b', 'a.supplier =b.id', 'LEFT')
                        ->join('__RECORD_DETAILS__ c', 'c.record_id =a.id', 'LEFT')
                        ->join('__MATERIAL_TYPE__ d', 'c.type_id =d.id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ e', 'c.product_id =e.id', 'LEFT')
                        ->join('__ORDER__ f', 'e.order_id =f.id', 'LEFT')
                        ->field('c.*,b.s_name,a.number,a.data,a.state,d.name as type_name,e.pro_num,f.year,f.num as order_num')
                        ->page($page, $limit)
                        ->order('a.data desc,a.number desc')
                        ->cache(true)
                        ->select();

            $count = Db::name('record')
                    ->alias("a")
                    ->join('__SUPPLIER__ b', 'a.supplier =b.id', 'LEFT')
                    ->join('__RECORD_DETAILS__ c', 'c.record_id =a.id', 'LEFT')
                    ->join('__MATERIAL_TYPE__ d', 'c.type_id =d.id', 'LEFT')
                    ->join('__ORDER_PRODUCT__ e', 'c.product_id =e.id', 'LEFT')
                    ->join('__ORDER__ f', 'e.order_id =f.id', 'LEFT')
                    ->field('c.*,b.s_name,a.number,a.data,a.state,d.name as type_name,e.pro_num,f.year,f.num as order_num')
                    ->cache(true)
                    ->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        };
        $supplier = Db::name('supplier')->Distinct(true)->select();
        $this->assign('supplier', $supplier);
        $client = Db::name('client')->Distinct(true)->select();
        $this->assign('client', $client);
        $year = Db::name('order')->Distinct(true)->field('year')->select();
        $this->assign('year', $year);
        $type = Db::name('material_type')->Distinct(true)->select();
        $this->assign('type', $type);
        return $this->fetch('record/search');
    }

    public function recordsearch()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $where = array_filter($this->request->param());
            $where2 = [];
            $where3 = [];
            $where4 = [];
            unset($where['page']);
            unset($where['limit']);
            if (isset($where['starttime'])||isset($where['endtime'])) {
                $starttime = $where['starttime'];
                $endtime = $where['endtime'];
                $where2 = [['data', 'between time', [$starttime, $endtime]]];
                unset($where['starttime']);
                unset($where['endtime']);
            }
            if (isset($where['supplier'])) {
                $where['a.supplier'] = $where['supplier'];
                unset($where['supplier']);
            }
            if (isset($where['state'])) {
                $where['a.state'] = $where['state'];
                unset($where['state']);
            }
            if (isset($where['type_id'])) {
                $where['c.type_id'] = $where['type_id'];
                unset($where['type_id']);
            };
            if (isset($where['year'])) {
                $where['f.year'] = $where['year'];
                unset($where['year']);
            };
            if (isset($where['order_id'])) {
                $where['c.order_id'] = $where['order_id'];
                unset($where['order_id']);
            };
            if (isset($where['product_id'])) {
                $where['c.product_id'] = $where['product_id'];
                unset($where['product_id']);
            };
            if (isset($where['number'])) {
                $where3= [['a.number', 'like', '%'.$where['number'].'%']];
                unset($where['number']);
            };
            if (isset($where['name'])) {
                $where4= [['c.name', 'like', '%'.$where['name'].'%']];
                unset($where['name']);
            };
            $result = Db::name('record')
                        ->alias("a")
                        ->join('__SUPPLIER__ b', 'a.supplier =b.id', 'LEFT')
                        ->join('__RECORD_DETAILS__ c', 'c.record_id =a.id', 'LEFT')
                        ->join('__MATERIAL_TYPE__ d', 'c.type_id =d.id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ e', 'c.product_id =e.id', 'LEFT')
                        ->join('__ORDER__ f', 'c.order_id =f.id', 'LEFT')
                        ->join('__CLIENT__ g', 'f.client_id =g.id', 'LEFT')
                        ->field('c.*,b.s_name,a.number,a.data,a.state,d.name as type_name,e.pro_num,f.year,f.num as order_num,g.id as client_id')
                        ->where($where)
                        ->where($where2)
                        ->where($where3)
                        ->where($where4)
                        ->page($page, $limit)
                        ->order('a.data desc,a.number desc')
                        // ->cache(true)
                        ->select();
            $count =  Db::name('record')
                        ->alias("a")
                        ->join('__SUPPLIER__ b', 'a.supplier =b.id', 'LEFT')
                        ->join('__RECORD_DETAILS__ c', 'c.record_id =a.id', 'LEFT')
                        ->join('__MATERIAL_TYPE__ d', 'c.type_id =d.id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ e', 'c.product_id =e.id', 'LEFT')
                        ->join('__ORDER__ f', 'e.order_id =f.id', 'LEFT')
                        ->join('__CLIENT__ g', 'f.client_id =g.id', 'LEFT')
                        ->field('c.*,b.s_name,a.number,a.data,a.state,d.name as type_name,e.pro_num,f.year,f.num as order_num,g.id as client_id')
                        ->where($where)
                        ->where($where2)
                        ->where($where3)
                        ->where($where4)
                        ->cache(true)
                        ->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }
}
