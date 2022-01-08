<?php
namespace app\yes\controller;

use app\yes\model\OrderModel;
use cmf\controller\AdminBaseController;
use think\Db;
use think\facade\Cache;

class OrderController extends AdminBaseController
{
    public function index()
    {
        if ($this->request->isPost()) {
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $order = OrderModel::with('client')
                    ->page($page, $limit)
                    ->order('order_time desc,num desc')
                    ->select();
            $count = OrderModel::with('client')->select()->count();
            $data["data"]=$order;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
        $result  = new OrderModel;
        $year = $result->Distinct(true)->field('year')->select();
        $client = $result->client()->select();
        $this->assign('client', $client);
        $this->assign('year', $year);
        return $this->fetch();
    }

    // 订单材料情况
    public function order_des(){
        if ($this->request->isPost()) {
            if(session('ADMIN_ID')!=1){
                return $this->error('权限不足');
            }
            $id = $this->request->param('id', 0, 'intval');
            $data  = $this->request->param();
            $result = Db::name('order');
            $count = $result->where('id',$id)->count();
            if($count>0){
                $content = $result->where('id',$id)->update([$data['name'] => $data['content']]);
            }else{
                $content = $result->data(['id'=>$id,$data['name']=>$data['content']])->insert();
            }
            if($content){
                $this->success('修改成功');
            }else{
                $this->error('修改失败');
            }
        }
    }

    public function addPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = new OrderModel;
            $order  = $result->allowField(true)->save($data);
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
            $result  = new OrderModel;
            $order  = $result->allowField(true)->update($data);
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
            $result  = new OrderModel;
            $count = Db::name('order_product')->where('order_id',$id)->count();
            if($count>0){
                $this->error('请先删除生产单内的产品');
            }else{
                Db::name('order_price')->where('order_id', $id)->delete();
                $order  = $result->destroy($id);
                if ($order) {
                    $this->success('删除成功');
                } else {
                    $this->error('删除失败');
                }
            }
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
            $where2 = [];
            $where3 = [];
            $where4 = [];
            $where5 = [];
            $where6 = [];
            $where7 = [];
            $where8 = [];
            if (isset($where['starttime'])||isset($where['endtime'])) {
                $starttime = $where['starttime'];
                $endtime = $where['endtime'];
                $where2 = [['order_time', 'between time', [$starttime, $endtime]]];
                unset($where['starttime']);
                unset($where['endtime']);
            };
            if (isset($where['pro_progress'])) {
                if($where['pro_progress']==1){
                    $where3 = [['pro_progress', '<', 100]];
                }else{
                    $where3 = [['pro_progress', '>=', 100]];
                }
                unset($where['pro_progress']);
            }

            if (isset($where['ship_progress'])) {
                if($where['ship_progress']==1){
                    $where4 = [['ship_progress', '<', 100]];
                }else{
                    $where4 = [['ship_progress', '>=', 100]];
                }
                unset($where['ship_progress']);
            }
            if(isset($where['order_id'])){
                $where['id'] = $where['order_id'];
                unset($where['order_id']);
            }
            if(isset($where['cloth'])){
                if($where['cloth']=='2'){
                    $where5 = [['cloth','like', '%完成%']];
                }else{
                    $where5 = [['cloth', 'NOT LIKE', '%完成%']];
                }
                unset($where['cloth']);
            }
            if(isset($where['hardware'])){
                if($where['hardware']=='2'){
                    $where5 = [['hardware','like', '%完成%']];
                }else{
                    $where5 = [['hardware', 'NOT LIKE', '%完成%']];
                }
                unset($where['hardware']);
            }
            if(isset($where['package'])){
                if($where['package']=='2'){
                    $where5 = [['package','like', '%完成%']];
                }else{
                    $where5 = [['package', 'NOT LIKE', '%完成%']];
                }
                unset($where['package']);
            }
            if(isset($where['paint'])){
                if($where['paint']=='2'){
                    $where5 = [['paint','like', '%完成%']];
                }else{
                    $where5 = [['paint', 'NOT LIKE', '%完成%']];
                }
                unset($where['paint']);
            }

            $result = OrderModel::with('client')
                    ->where($where)
                    ->where($where2)
                    ->where($where3)
                    ->where($where4)
                    ->where($where5)
                    ->where($where6)
                    ->where($where7)
                    ->where($where8)
                    ->order('order_time desc,num desc')
                    ->page($page, $limit)
                    ->select();
            $count = OrderModel::with('client')
                    ->where($where)
                    ->where($where2)
                    ->where($where3)
                    ->where($where4)
                    ->where($where5)
                    ->where($where6)
                    ->where($where7)
                    ->where($where8)
                    ->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }
}
