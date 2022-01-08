<?php

namespace app\yes\controller;

use app\yes\model\SpareModel;
use app\yes\model\OrderProductModel;
use app\yes\model\OrderModel;
use cmf\controller\AdminBaseController;
use think\Db;

class SpareController extends AdminBaseController
{
    public function index()
    {
        if ($this->request->isPost()) {
            $spare  =new SpareModel;
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            
            $result = Db::name('Spare')
                        ->alias("a")
                        ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                        ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
                        ->join('__CLIENT__ g', 'c.client_id =g.id', 'LEFT')
                        ->field('a.*,b.order_id,b.pro_num,c.year,c.num,c.client_id,g.s_name as client_name')
                        ->page($page, $limit)
                        ->order('a.create_time desc,a.id desc')
                        ->select()->toArray();
            $count = $spare->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
        $order = new OrderModel;
        $year = $order->Distinct(true)->field('year')->select();
        $client = Db::name('client')->Distinct(true)->select();
        $this->assign('client', $client);
        $this->assign('year', $year);
        return $this->fetch();
    }

    // 获取生产单
    public function getordernum()
    {
        if ($this->request->isPost()) {
            $where = array_filter($this->request->param());
            $order = new OrderModel;
            $order_list = $order->where($where)->field('num,id as order_id')->order('id desc')->select();
            return $order_list;
        }
    }

    // 获取产品id
    public function getproductnum()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $order = new OrderProductModel;
            $productnum = $order->where('order_id', $id)->field('pro_num,id as product_id')->select();
            return $productnum;
        }
    }

    //添加备料
    public function addPost()
    {
        if ($this->request->isPost()) {
            $result = new SpareModel();
            $data = $this->request->param();
            $state = $this->request->param('state');
            $data['details'] = str_replace(PHP_EOL, ',', $data['details']);
            $data['who']=cookie("admin_username");
            if ($state > 1) {
                $data['person']=cookie("admin_username");
            }
            $Spare = $result->allowField(true)->save($data);
            if ($Spare) {
                $used='';
                if($data['product_id']>1){
                    $usefor = Db::name('order_product')
                    ->alias("a")
                    ->join('__ORDER__ c', 'a.order_id =c.id', 'LEFT')
                    ->join('__CLIENT__ g', 'c.client_id =g.id', 'LEFT')
                    ->field('a.order_id,a.pro_num,c.year,c.num,c.client_id,g.s_name as client_name')
                    ->where('a.id',$data['product_id'])
                    ->find();
                    $used = $usefor['client_name'].':'.$usefor['year'].$usefor['num'].'-'.$usefor['pro_num'];
                }
                $msg = '<h1>'.date("Y年m月d日").'最新采购任务</h1>'.'<h4>'.'采购类型:'.$data['type'].'</h4>'.'<h4>'.'采购名称:'.$data['name'].'</h4>'.'<h4>'.'采购规格:'.$data['size'].'</h4>'.'<h4>'.'用量:'.$data['used'].'</h4>'.'<h4>'.'描述:'.$data['details'].'</h4>'.'<h4>'.'用途:'.$used.'</h4>';
                if ($data['state']==='1') {
                    sendMail('1044625472@qq.com', '采购通知', $msg);
                    sendMail('3277825274@qq.com', '采购通知', $msg);
                    // if (strpos($data['name'], '弯板') !== false) {
                    //     sendMail('3277825274@qq.com', '采购通知', $msg);
                    // }
                }
                if ($data['state']==='2') {
                    // sendMail('3277825274@qq.com', '采购通知', $msg);
                    sendMail('1525876591@qq.com', '采购通知', $msg);
                }
                return $this->success('添加成功');
            } else {
                return $this->error('添加失败');
            }
        }
    }

    //删除备料
    public function delPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $result = new SpareModel();
            $del = $result->destroy($id);
            if ($del) {
                return $this->success('删除成功');
            } else {
                return $this->error('删除失败');
            }
        }
    }
    
    //编辑备料
    public function editPost()
    {
        if ($this->request->isPost()) {
            $result = new SpareModel();
            $data = $this->request->param();
            $data['details'] = str_replace(PHP_EOL, ',', $data['details']);
            $state = $this->request->param('state');
            if ($state > 1) {
                $data['person']=cookie("admin_username");
            }
            $Spare = $result->allowField(true)->update($data);
            if ($Spare) {
                if($data['product_id']>1){
                    $usefor = Db::name('order_product')
                    ->alias("a")
                    ->join('__ORDER__ c', 'a.order_id =c.id', 'LEFT')
                    ->join('__CLIENT__ g', 'c.client_id =g.id', 'LEFT')
                    ->field('a.order_id,a.pro_num,c.year,c.num,c.client_id,g.s_name as client_name')
                    ->where('a.id',$data['product_id'])
                    ->find();
                    $used = $usefor['client_name'].':'.$usefor['year'].$usefor['num'].'-'.$usefor['pro_num'];
                }
                $msg = '<h1>'.date("Y年m月d日").'最新采购任务</h1>'.'<h4>'.'采购类型:'.$data['type'].'</h4>'.'<h4>'.'采购名称:'.$data['name'].'</h4>'.'<h4>'.'采购规格:'.$data['size'].'</h4>'.'<h4>'.'用量:'.$data['used'].'</h4>'.'<h4>'.'描述:'.$data['details'].'</h4>'.'<h4>'.'用途:'.$used.'</h4>';
                if ($data['state']==='1') {
                    sendMail('1044625472@qq.com', '采购修改通知', $msg);
                    if (strpos($data['name'], '弯板') !== false) {
                        sendMail('3277825274@qq.com', '采购修改通知', $msg);
                    }
                }
                if ($data['state']==='2') {
                    sendMail('1525876591@qq.com', '采购修改通知', $msg);
                }
                return $this->success('编辑成功');
            } else {
                return $this->error('编辑失败');
            }
        }
    }

    //批量修改状态
    public function changeState()
    {
        if ($this->request->isPost()) {
            $result = new SpareModel();
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

    public function searchlst()
    {
        if ($this->request->isPost()) {
            $spare  =new SpareModel;
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $where = array_filter($this->request->param());
            $where2 = [];
            unset($where['page']);
            unset($where['limit']);
            if (isset($where['starttime'])||isset($where['endtime'])) {
                $starttime = $where['starttime'];
                $endtime = $where['endtime'];
                $where2 = [['create_time', 'between time', [$starttime, $endtime]]];
                unset($where['starttime']);
                unset($where['endtime']);
            };
            $result = Db::name('Spare')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                    ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
                    ->join('__CLIENT__ g', 'c.client_id =g.id', 'LEFT')
                    ->field('a.*,b.order_id,b.pro_num,c.year,c.num,c.client_id,g.s_name as client_name')
                    ->where($where)
                    ->where($where2)
                    ->page($page, $limit)
                    ->order('a.create_time desc,a.id desc')
                    ->select();
            $count = Db::name('Spare')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                    ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
                    ->join('__CLIENT__ g', 'c.client_id =g.id', 'LEFT')
                    ->field('a.*,b.order_id,b.pro_num,c.year,c.num,c.client_id,g.s_name as client_name')
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
}
