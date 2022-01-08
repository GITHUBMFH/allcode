<?php
namespace app\yes\controller;

use cmf\controller\AdminBaseController;
use app\yes\model\OrderModel;
use think\Db;
use think\facade\Cache;

class ProduceController extends AdminBaseController
{
    public function index()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            
            $result = Db::name('produce')
                        ->alias("a")
                        ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                        ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
                        ->join('__CLIENT__ g', 'c.client_id =g.id', 'LEFT')
                        ->field('a.*,b.order_id,b.pro_num,c.year,c.num,c.client_id,g.s_name as client_name')
                        ->page($page, $limit)
                        ->order('a.product_data desc')
                        ->select();
            $count = Db::name('produce')->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        };
        $order = new OrderModel;
        $client = Db::name('client')->Distinct(true)->select();
        $this->assign('client', $client);
        $year = $order->Distinct(true)->field('year')->select();
        $this->assign('year', $year);
        return $this->fetch();
    }

    public function addPost()
    {
        if ($this->request->isPost()) {
            $product_id = $this->request->param('product_id');
            $data = $this->request->param();
            $order_id = $this->request->param('num');
            unset($data['num']);
            $mian = Db::name('produce')->insert($data);
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
            } else {
                return $this->error('添加失败');
            }
        }
    }

    public function alladdPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param('data');
            $order_id = $this->request->param('orderid');
            foreach ($data as $key =>$vlue) {
                $mian = Db::name('produce')->insert($vlue);
                $product_id = $vlue['product_id'];
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
                            if(count($data)-1==$key){
                                return $this->success('添加成功');
                            }
                        }
                    }
                } else {
                    return $this->error('添加失败');
                }
            }
        }
    }

    public function editPost()
    {
        if ($this->request->isPost()) {
            $product_id = $this->request->param('product_id');
            $data = $this->request->param();
            $order_id = $this->request->param('num');
            unset($data['num']);
            $mian = Db::name('produce')->update($data);
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
                    return $this->success('修改成功');
                } else {
                    return $this->error('修改失败');
                }
            } else {
                return $this->error('修改失败');
            }
        }
    }

    public function delPost()
    {
        if ($this->request->isPost()) {
            $updtaId = $this->request->param('id', 0, 'intval');
            $product_id = Db::name('produce')->where('id', $updtaId)->value('product_id');
            $mian = Db::name('produce')->where('id', $updtaId)->delete();
            if ($mian) {
                $sum = Db::name('produce')->where('product_id', $product_id)->sum('product_num');
                $result = Db::name('order_product')->where('id', $product_id)->update(['product_num' =>'']);
                if ($sum!=0) {
                    $result = Db::name('order_product')->where('id', $product_id)->update(['product_num' => $sum]);
                }
                if ($result) {
                    $order_id = Db::name('order_product')->where('id', $product_id)->value('order_id');
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
                    return $this->success('删除成功');
                } else {
                    return $this->error('删除失败');
                }
            } else {
                return $this->error('生进度更新错误');
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
            if (isset($where['starttime'])||isset($where['endtime'])) {
                $starttime = $where['starttime'];
                $endtime = $where['endtime'];
                $where2 = [['product_data', 'between time', [$starttime, $endtime]]];
                unset($where['starttime']);
                unset($where['endtime']);
            };
            $result = Db::name('produce')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                    ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
                    ->join('__CLIENT__ g', 'c.client_id =g.id', 'LEFT')
                    ->field('a.*,b.order_id,b.pro_num,c.year,c.num,c.client_id,g.s_name as client_name')
                    ->where($where)
                    ->where($where2)
                    ->page($page, $limit)
                    ->order('a.product_data desc')
                    ->select();
            $count =  Db::name('produce')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                    ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
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
