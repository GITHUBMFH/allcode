<?php
namespace app\yes\controller;

use app\yes\model\OrderModel;
use cmf\controller\AdminBaseController;
use think\Db;
use think\facade\Cache;

class MatchController extends AdminBaseController
{
    public function index()
    {
        if ($this->request->isPost()) {
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $result = Db::name('match')
                        ->alias("a")
                        ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                        ->join('__COST_LABOR__ c', 'c.worker_id = b.work_id and c.product_id = a.product_id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                        ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                        ->join('__CLIENT__ f', 'e.client_id = f.id', 'LEFT')
                        ->field('a.*,sum(c.price) as price,b.name,e.year as order_year,e.num as order_num,f.s_name,f.id as client_id,d.order_id,d.pro_num,b.work_id,b.name as worker_name')
                        ->page($page, $limit)
                        ->group('a.id')
                        ->order('a.id desc')
                        ->select();
            $count = Db::name('match')
                        ->alias("a")
                        ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                        ->join('__COST_LABOR__ c', 'c.worker_id = b.work_id and c.product_id = a.product_id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                        ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                        ->join('__CLIENT__ f', 'e.client_id = f.id', 'LEFT')
                        ->group('a.id')
                        ->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
        $order = new OrderModel;
        $year = $order->Distinct(true)->field('year')->select();
        $client = Db::name('client')->Distinct(true)->select();
        $worker = Db::name('worker')->Distinct(true)->field('name,id')->select();
        $this->assign('worker', $worker);
        $this->assign('client', $client);
        $this->assign('year', $year);
        $work_type = Db::name('work_type')->Distinct(true)->field('name,id')->select();
        $this->assign('work_type', $work_type);
        $worker_name = Db::name('worker')->field('name,id')->select();
        $this->assign('worker_name', $worker_name);
        return $this->fetch();
    }

    public function getprice()
    {
        if ($this->request->isPost()) {
            $where['product_id'] = $this->request->param('product_id');
            $where['worker_id'] = $this->request->param('worker_id');
            $result = Db::name('cost_labor')->where($where)->sum('price');
            return $result;
        }
    }

    public function addPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $data['date'] = date("Y-m-d");
            $result  = Db::name('match');
            $worker_id = $this->request->param('worker_id');
            $order  = $result->insert($data);
            $work_type = Db::name('worker')->where('id', $worker_id)->value('work_id');
            if ($work_type=='7' || $work_type=='15') {
                $data2 = [];
                $product_id=$this->request->param('product_id');
                $order_id = Db::name('order_product')->where('id', $product_id)->value('order_id');
                $data2['product_id']=$this->request->param('product_id');
                $data2['product_num']=$this->request->param('num');
                $data2['product_data']= date("Y-m-d");
                $mian = Db::name('produce')->insert($data2);
                if ($mian) {
                    $sum = Db::name('produce')->where('product_id', $product_id)->sum('product_num');
                    $result = Db::name('order_product')->where('id', $product_id)->update(['product_num' =>'']);
                    $result = Db::name('order_product')->where('id', $product_id)->update(['product_num' => $sum]);
                    if ($result) {
                        $amount = Db::name('order_product')->where('order_id', $order_id)->sum('amount');
                        $product_num = Db::name('order_product')->where('order_id', $order_id)->sum('product_num');
                        $pro_progress = round($product_num/$amount*100, 2);
                        Db::name('order')->where('id', $order_id)->update(['pro_progress'=>$pro_progress]);
                        if ($amount<=$product_num) {
                            $maxdeta = Db::name('produce')->where('product_id', $product_id)->distinct(true)->field('product_data')->select()->toArray();
                            $maxtime=[];
                            foreach ($maxdeta as $v) {
                                array_push($maxtime, $v);
                            }
                            $maxdeta = max($maxtime);
                            Db::name('order')->where('id', $order_id)->update(['complete_time'=>$maxdeta['product_data']]);
                        }
                        return $this->success('添加成功');
                    } else {
                        return $this->error('添加失败');
                    }
                }
            }
            if ($order) {
                $this->success('提交成功');
            } else {
                $this->error('提交失败');
            }
        }
    }

    public function editPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = Db::name('match');
            $order  = $result->update($data);
            if ($order) {
                $this->success('提交成功');
            } else {
                $this->error('提交失败');
            }
        }
    }

    public function delPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id');
            $result  = Db::name('match');
            $order  = $result->delete($id);
            if ($order) {
                $this->success('删除成功');
            } else {
                $this->error('删除失败');
            }
        }
    }

    // 获取当前产品当前员工完成数量
    public function matchlst()
    {
        if ($this->request->isPost()) {
            $where = $this->request->param();
            unset($where['page']);
            unset($where['limit']);
            $result = Db::name('match')
                ->where($where)
                ->select();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
    }
    
    // 修改完成数量
    public function matchupdata()
    {
        $result = Db::name('match');
        $id = $this->request->param('id');
        $num = $this->request->param('num');
        $mag = $result->update(['id' => $id, 'num' => $num]);
        if ($mag) {
            return $this->success('修改成功');
        } else {
            return $this->error('修改失败');
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
            unset($where['page']);
            unset($where['limit']);
            if (isset($where['year'])) {
                $where['e.year'] = $where['year'];
                unset($where['year']);
            };
            if (isset($where['m_year'])) {
                $where['a.year'] = $where['m_year'];
                unset($where['m_year']);
            };
            if (isset($where['worker_id'])) {
                $where['a.worker_id'] = $where['worker_id'];
                unset($where['worker_id']);
            };
            if (isset($where['product_id'])) {
                $where['a.product_id'] = $where['product_id'];
                unset($where['product_id']);
            };
            $result = Db::name('match')
                    ->alias("a")
                    ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                    ->join('__COST_LABOR__ c', 'c.worker_id = b.work_id and c.product_id = a.product_id', 'LEFT')
                    ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                    ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                    ->join('__CLIENT__ f', 'e.client_id = f.id', 'LEFT')
                    ->field('a.*,c.price,b.name,e.year as order_year,e.num as order_num,f.s_name,f.id as client_id,d.order_id,d.pro_num,b.work_id,b.name as worker_name')
                    ->where($where)
                    ->page($page, $limit)
                    ->group('a.id')
                    ->order('a.id desc')
                    ->select();

            $count = Db::name('match')
                    ->alias("a")
                    ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                    ->join('__COST_LABOR__ c', 'c.worker_id = b.work_id and c.product_id = a.product_id', 'LEFT')
                    ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                    ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                    ->join('__CLIENT__ f', 'e.client_id = f.id', 'LEFT')
                    ->field('a.*,c.price,b.name,e.year as order_year,e.num as order_num,f.s_name,f.id as client_id')
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
}
