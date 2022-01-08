<?php
namespace app\yes\controller;

use cmf\controller\AdminBaseController;
use app\yes\model\RecordDetailsModel;
use app\yes\model\OrderModel;
use think\Db;
use think\facade\Cache;

class RecordDetailsController extends AdminBaseController
{
    public function index()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $record_id = $this->request->param('id');
            $result = Db::name('RecordDetails')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                    ->join('__ORDER__ c', 'a.order_id =c.id', 'LEFT')
                    ->join('__MATERIAL_TYPE__ d', 'a.type_id =d.id', 'LEFT')
                    ->join('__UNIT__ e', 'a.unit =e.id', 'LEFT')
                    ->field('a.*,b.pro_num,c.year,c.num as order_num,d.name as type_name,e.name as unit_name')
                    ->where('a.record_id',$record_id)
                    ->select()->toArray();
            $count = Db::name('RecordDetails')->select()->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        };
        $supplier = Db::name('supplier')->Distinct(true)->select();
        $this->assign('supplier', $supplier);        
        $type = Db::name('MaterialType')->Distinct(true)->select();
        $this->assign('type', $type);
        $unit = Db::name('Unit')->Distinct(true)->select();
        $this->assign('unit', $unit);
        $order = new OrderModel;
        $year = $order->Distinct(true)->field('year')->select();
        $this->assign('year', $year);
        return $this->fetch('record/details');
    }

    public function addPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = New RecordDetailsModel;
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
            $result  = New RecordDetailsModel;
            $order  = $result->allowField(true)->update($data);
            if ($order) {
                return $this->success('修改成功');
            } else {
                return $this->error('修改失败');
            }
        }
    }

    public function delPost()
    {
        if ($this->request->isPost()) {
            $Id = $this->request->param('id');
            $result  = New RecordDetailsModel;
            $order  = $result->destroy($Id);
            if ($order) {
                return $this->error('删除成功');
            } else {
                return $this->error('删除失败');
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
            $where2 = [];
            unset($where['page']);
            unset($where['limit']);
            if(isset($where['starttime'])||isset($where['endtime'])){
                $starttime = $where['starttime'];
                $endtime = $where['endtime'];
                $where2 = [['product_data', 'between time', [$starttime, $endtime]]];
                unset($where['starttime']);
                unset($where['endtime']);
            };
            $result = Db::name('record')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                    ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
                    ->field('a.*,b.order_id,b.pro_num,c.year,c.num')
                    ->where($where)
                    ->where($where2)
                    ->page($page, $limit)
                    ->cache(true)
                    ->select();
            $count =  Db::name('record')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                    ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
                    ->field('a.*,b.order_id,b.pro_num,c.year,c.num')
                    ->where($where)
                    ->where($where2)
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
