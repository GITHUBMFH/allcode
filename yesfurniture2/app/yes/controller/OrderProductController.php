<?php
namespace app\yes\controller;

use app\yes\model\OrderProductModel;
use app\yes\model\CostLaborModel;
use app\yes\model\CostModel;
use app\yes\model\DailyPriceModel;
use cmf\controller\AdminBaseController;
use app\yes\model\OrderModel;
use think\Db;
use think\facade\Cache;

class OrderProductController extends AdminBaseController
{
    //产品列表
    public function index()
    {
        if ($this->request->isPost()) {
            $result = new OrderProductModel;
            $id  = $this->request->param('id');
            $OrderProduct = $result->where('order_id', $id)->select();
            $orderproject = Db::name('order')->where('id', $id)->value('project');
            $orderremark = Db::name('order')->where('id', $id)->value('remark');
            foreach ($OrderProduct as &$vo) {
                if (!is_null(json_decode($vo['product_dec']))) {
                    $vo['product_dec'] = json_decode($vo['product_dec']);
                }
                if (!is_null(json_decode($vo['remark']))) {
                    $vo['remark'] = json_decode($vo['remark']);
                }
            }
            foreach ($OrderProduct as &$vo) {
                $b = Db::name('order_product')
                    ->alias("a")
                    ->join('__TASK__ e', 'e.product_id = a.id', 'LEFT')
                    ->join('__WORKER__ c', 'c.id = e.worker_id', 'LEFT')
                    ->join('__WORK_TYPE__ d', 'd.id = c.work_id', 'LEFT')
                    ->where('a.id', $vo['id'])
                    ->whereIn('d.id', '1,2,3,4,5,7,22,15,16,18,19')
                    ->field('c.work_id,sum(e.num) as task_num,c.name')
                    ->group('d.id')
                    ->select()
                    ->toArray();
                $a = Db::name('order_product')
                    ->alias("a")
                    ->join('__MATCH__ b', 'b.product_id = a.id', 'LEFT')
                    ->join('__WORKER__ c', 'c.id = b.worker_id', 'LEFT')
                    ->join('__WORK_TYPE__ d', 'd.id = c.work_id', 'LEFT')
                    ->where('a.id', $vo['id'])
                    ->whereIn('d.id', '1,2,3,4,5,7,22,15,16,18,19')
                    ->field('c.work_id,sum(b.num) as pro_num,c.name')
                    ->group('d.id')
                    ->select()
                    ->toArray();

                $task = [
                        ['task_num'=>"0", 'work_id'=>'1','pro_num'=>'0','name'=>'裁床'],
                        ['task_num'=>"0", 'work_id'=>'2','pro_num'=>'0','name'=>'车位'],
                        ['task_num'=>"0", 'work_id'=>'3','pro_num'=>'0','name'=>'木工'],
                        ['task_num'=>"0", 'work_id'=>'4','pro_num'=>'0','name'=>'开棉'],
                        ['task_num'=>"0", 'work_id'=>'5','pro_num'=>'0','name'=>'打底'],
                        ['task_num'=>"0", 'work_id'=>'7','pro_num'=>'0','name'=>'扪工'],
                        ['task_num'=>"0", 'work_id'=>'22','pro_num'=>'0','name'=>'实木'],
                        ['task_num'=>"0", 'work_id'=>'15','pro_num'=>'0','name'=>'扪工炒更'],
                        ['task_num'=>"0", 'work_id'=>'18','pro_num'=>'0','name'=>'车位炒更'],
                        ['task_num'=>"0", 'work_id'=>'19','pro_num'=>'0','name'=>'裁床炒更'],
                        ['task_num'=>"0", 'work_id'=>'16','pro_num'=>'0','name'=>'实木炒更'],
                    ];
                foreach ($task as &$io) {
                    foreach ($b as &$ii) {
                        if ($io['work_id']==$ii['work_id']) {
                            foreach ($a as &$iu) {
                                if ($iu['work_id']==$ii['work_id']) {
                                    $ii['pro_num'] =  $iu['pro_num'];
                                } else {
                                    $ii['pro_num'] =  '0';
                                }
                            }
                            if ($ii['task_num']==null) {
                                $io['task_num']='0';
                            } else {
                                $io['task_num']=$ii['task_num'];
                            }
                        }
                    }

                    foreach ($a as &$ii) {
                        if ($io['work_id']==$ii['work_id']) {
                            foreach ($b as &$iu) {
                                if ($iu['work_id']==$ii['work_id']) {
                                    $ii['task_num'] =  $iu['task_num'];
                                } else {
                                    $ii['task_num'] =  '0';
                                }
                            }
                            if ($ii['pro_num']==null) {
                                $io['pro_num']='0';
                            } else {
                                $io['pro_num']=$ii['pro_num'];
                            }
                        }
                    }
                }
                $vo['task'] = $task;
            }
            // halt($OrderProduct);
            $data["data"]=$OrderProduct;
            $data["code"]=0;
            $data["msg"]='';
            $data["project"]= $orderproject;
            $data["remark"]= $orderremark;
            return $data;
        }
        $daily_price = new DailypriceModel;
        $cost_labor = DailypriceModel::with(['worktype'])->where('type_id', '>', 0)->select();
        $costlabor_data = [];
        foreach ($cost_labor as $vo) {
            array_push($costlabor_data, $vo['worktype']);
        };
        $costlabor = array_unique($costlabor_data);

        $material  = $daily_price->where('type_id', '=', 999)->field('name')->select();
        $material_data = [];
        foreach ($material as $vo) {
            array_push($material_data, $vo['name']);
        };
        $material = array_unique($material_data);
        $this->assign('cost_labor', $costlabor);
        $this->assign('material', $material);
        $dailyprice = $daily_price->where('type_id', '<', 999)->select();

        $dailypriceresult = array();
        foreach ($dailyprice as $k) {
            $dailypriceresult[$k['type_id']] =[];
            foreach ($dailyprice as $ki) {
                if ($k['type_id'] == $ki['type_id']) {
                    $result['standard'] = $ki['standard'];
                    $result['price'] = $ki['price'];
                    array_push($dailypriceresult[$k['type_id']], $result);
                }
            }
        }
        $work_type = Db::name('work_type')->Distinct(true)->field('name,id')->select();
        $this->assign('work_type', $work_type);
        $worker_name = Db::name('worker')->field('name,id')->select();
        $this->assign('worker_name', $worker_name);
        $this->assign('dailyprice', $dailypriceresult);
        return $this->fetch('order/orderproduct');
    }

    //上传图片
    public function uploadimg()
    {
        $files = $_FILES;
        $content = hook_one('fetch_upload_view', $files);
        return $content;
    }

    //添加产品
    public function addPost()
    {
        if ($this->request->isPost()) {
            $result = new OrderProductModel();
            $data = $this->request->param();
            $data['product_dec'] = json_encode($data['product_dec']);
            $OrderProduct = $result->allowField(true)->save($data);
            if ($OrderProduct) {
                return $this->success('添加成功');
            } else {
                return $this->error('添加失败');
            }
        }
    }

    //删除产品
    public function delPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $result = new OrderProductModel();
            $key = $result->where('id', $id)->value('img');
            if ($key!='null'&&$key!=null) {
                $content = hook_one('deloneimg', $key);
            } else {
                $content = true;
            }
            Db::name('order_product_price')->where('product_id', $id)->delete();
            Db::name('produce')->where('product_id', $id)->delete();
            Db::name('shipment')->where('product_id', $id)->delete();
            Db::name('spare')->where('product_id', $id)->delete();
            $del = $result->destroy($id);
            if ($content||$del) {
                return $this->success('删除成功');
            } else {
                return $this->error('删除失败');
            }
        }
    }

    //编辑产品
    public function editPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $img= $this->request->param('img');

            $data = $this->request->param();
            
            if (!empty($data['product_dec'])) {
                $data['product_dec'] = json_encode($data['product_dec']);
            }
            if (!empty($data['remark'])) {
                $data['remark'] = json_encode($data['remark']);
            }

            $result = new OrderProductModel();
            $key = $result->where('id', $id)->value('img');
            if ($key!=$img) {
                if ($key!='null'&&$key!=null) {
                    $content = hook_one('deloneimg', $key);
                } else {
                    $content = true;
                }
            } else {
                $content = true;
            }
            $edit = $result->update($data);

            //修改进度
            $order_id = $result->where('id', $id)->value('order_id');

            $amount = Db::name('order_product')->where('order_id', $order_id)->sum('amount');
            $shipment_num = Db::name('order_product')->where('order_id', $order_id)->sum('shipment_num');
            $ship_progress = round($shipment_num/$amount*100, 2);
            Db::name('order')->where('id', $order_id)->update(['ship_progress'=>$ship_progress]);

            $product_num = Db::name('order_product')->where('order_id', $order_id)->sum('product_num');
            $pro_progress = round($product_num/$amount*100, 2);
            Db::name('order')->where('id', $order_id)->update(['pro_progress'=>$pro_progress]);

            if ($content||$edit) {
                return $this->success('修改成功');
            } else {
                return $this->error('修改失败');
            }
        }
    }

    //删除某个产品图片
    public function deloneimgPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');

            $result = new OrderProductModel();
            $key = $result->where('id', $id)->value('img');
            $content = hook_one('deloneimg', $key);
            $deloneimg = $result->where('id', $id)->update(['img' => null]);
            if ($deloneimg||$content) {
                return $this->success('删除成功');
            } else {
                return $this->error('删除失败');
            }
        }
    }

    //备料
    public function getspare()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $result = OrderProductModel::get($id);
            $contact = $result->spare()->select();
            $data["data"]=$contact;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
    }

    //删除备料
    public function delsparePost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id');
            $result = new OrderProductModel;
            $content = $result->spare()->destroy($id);
            if ($content) {
                return $this->success('删除成功');
            } else {
                return $this->error('删除失败');
            }
        }
    }

    //添加备料
    public function addsparePost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result = new OrderProductModel;
            $data['who']=cookie("admin_username");
            $content = $result->spare()->allowField(true)->save($data);
            if ($content) {
                return $this->success('添加成功');
            } else {
                return $this->error('添加失败');
            }
        }
    }

    //编辑备料
    public function eidtsparePost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result = new OrderProductModel;
            $content = $result->spare()->allowField(true)->update($data);
            if ($content) {
                return $this->success('修改成功');
            } else {
                return $this->error('修改失败');
            }
        }
    }

    //人工费用
    public function costlabor()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $result = CostLaborModel::with(['worktype','dailyprice'])->where('product_id', $id)->select();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
    }

    //增加人工费用
    public function addcostlabor()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $product_id = $this->request->param('product_id');
            $worker_id = $this->request->param('worker_id');
            $standard_id = $this->request->param('standard_id');

            $data['price'] = Db::name('daily_price')->where('id', $standard_id)->value('price');
            $result = new CostLaborModel;
            $num =  $result->where('product_id', $product_id)->where('worker_id', $worker_id)->count();
            if ($num>0) {
                return $this->error('已经添加工种，请先删除');
            } else {
                $costlabor = $result->allowField(true)->save($data);
            }

            $sum = $result->where('product_id', $product_id)->sum('price');
            $cost = new CostModel;
            $count = $cost->where('product_id', $product_id)->count();
            if ($count>0) {
                $costlaborsum = $cost->where('product_id', $product_id)->update(['labor_cost'=>$sum]);
            } else {
                $costlaborsum = $cost->allowField(true)->save(['labor_cost'=>$sum,'product_id'=>$product_id]);
            }
            
            if ($costlabor) {
                return $this->success('添加成功');
            } else {
                return $this->error('添加失败');
            }
        }
    }
    
    //增加常规人工费用
    public function addcostlabors()
    {
        $id = $this->request->param('id', 0, 'intval');
        $product_id = $this->request->param('product_id');

        $data1 = [
            ['product_id'=>$product_id,'worker_id'=>1,'standard_id'=>23],
            ['product_id'=>$product_id,'worker_id'=>2,'standard_id'=>29],
            ['product_id'=>$product_id,'worker_id'=>3,'standard_id'=>80],
            ['product_id'=>$product_id,'worker_id'=>4,'standard_id'=>60],
            ['product_id'=>$product_id,'worker_id'=>5,'standard_id'=>54],
            // ['product_id'=>$product_id,'worker_id'=>6,'standard_id'=>48],
            ['product_id'=>$product_id,'worker_id'=>7,'standard_id'=>73],
            // ['product_id'=>$product_id,'worker_id'=>8,'standard_id'=>41],
        ];
        $data2 = [
            ['product_id'=>$product_id,'worker_id'=>1,'standard_id'=>24],
            ['product_id'=>$product_id,'worker_id'=>2,'standard_id'=>31],
            ['product_id'=>$product_id,'worker_id'=>3,'standard_id'=>81],
            ['product_id'=>$product_id,'worker_id'=>4,'standard_id'=>63],
            ['product_id'=>$product_id,'worker_id'=>5,'standard_id'=>55],
            // ['product_id'=>$product_id,'worker_id'=>6,'standard_id'=>49],
            ['product_id'=>$product_id,'worker_id'=>7,'standard_id'=>74],
            // ['product_id'=>$product_id,'worker_id'=>8,'standard_id'=>42],
        ];
        $data3 = [
            ['product_id'=>$product_id,'worker_id'=>1,'standard_id'=>25],
            ['product_id'=>$product_id,'worker_id'=>2,'standard_id'=>33],
            ['product_id'=>$product_id,'worker_id'=>3,'standard_id'=>82],
            ['product_id'=>$product_id,'worker_id'=>4,'standard_id'=>66],
            ['product_id'=>$product_id,'worker_id'=>5,'standard_id'=>56],
            // ['product_id'=>$product_id,'worker_id'=>6,'standard_id'=>50],
            ['product_id'=>$product_id,'worker_id'=>7,'standard_id'=>75],
            // ['product_id'=>$product_id,'worker_id'=>8,'standard_id'=>43],
        ];
        $data4 = [
            ['product_id'=>$product_id,'worker_id'=>1,'standard_id'=>28],
            ['product_id'=>$product_id,'worker_id'=>2,'standard_id'=>37],
            ['product_id'=>$product_id,'worker_id'=>3,'standard_id'=>84],
            ['product_id'=>$product_id,'worker_id'=>4,'standard_id'=>71],
            ['product_id'=>$product_id,'worker_id'=>5,'standard_id'=>58],
            // ['product_id'=>$product_id,'worker_id'=>6,'standard_id'=>52],
            ['product_id'=>$product_id,'worker_id'=>7,'standard_id'=>78],
            // ['product_id'=>$product_id,'worker_id'=>8,'standard_id'=>47],
        ];
        $data5 = [
            ['product_id'=>$product_id,'worker_id'=>1,'standard_id'=>26],
            ['product_id'=>$product_id,'worker_id'=>2,'standard_id'=>35],
            ['product_id'=>$product_id,'worker_id'=>3,'standard_id'=>83],
            ['product_id'=>$product_id,'worker_id'=>4,'standard_id'=>72],
            ['product_id'=>$product_id,'worker_id'=>5,'standard_id'=>57],
            // ['product_id'=>$product_id,'worker_id'=>6,'standard_id'=>51],
            ['product_id'=>$product_id,'worker_id'=>7,'standard_id'=>79],
            // ['product_id'=>$product_id,'worker_id'=>8,'standard_id'=>41],
        ];
        $data6 = [
            ['product_id'=>$product_id,'worker_id'=>1,'standard_id'=>27],
            ['product_id'=>$product_id,'worker_id'=>2,'standard_id'=>38],
            ['product_id'=>$product_id,'worker_id'=>3,'standard_id'=>85],
            ['product_id'=>$product_id,'worker_id'=>4,'standard_id'=>70],
            ['product_id'=>$product_id,'worker_id'=>5,'standard_id'=>59],
            // ['product_id'=>$product_id,'worker_id'=>6,'standard_id'=>53],
            ['product_id'=>$product_id,'worker_id'=>7,'standard_id'=>76],
            // ['product_id'=>$product_id,'worker_id'=>8,'standard_id'=>47],
        ];
        $data7 = [
            ['product_id'=>$product_id,'worker_id'=>1,'standard_id'=>204],
            ['product_id'=>$product_id,'worker_id'=>2,'standard_id'=>205],
            ['product_id'=>$product_id,'worker_id'=>3,'standard_id'=>206],
            ['product_id'=>$product_id,'worker_id'=>4,'standard_id'=>207],
            ['product_id'=>$product_id,'worker_id'=>5,'standard_id'=>208],
            // ['product_id'=>$product_id,'worker_id'=>6,'standard_id'=>53],
            ['product_id'=>$product_id,'worker_id'=>7,'standard_id'=>209],
            // ['product_id'=>$product_id,'worker_id'=>8,'standard_id'=>47],
        ];

        switch ($id) {
            case "1":
                $data = $data1;
                break;
            case "2":
                $data = $data2;
                break;
            case "3":
                $data = $data3;
                break;
            case "4":
                $data = $data4;
                break;
            case "5":
                $data = $data5;
                break;
            case "6":
                $data = $data6;
                break;
            case "7":
                $data = $data7;
                break;
            }

        $result = new CostLaborModel;

        $result->where('product_id', $product_id)->delete();
        foreach ($data as &$vo) {
            $vo['price'] = Db::name('daily_price')->where('id', $vo['standard_id'])->value('price');
        }

        $costlabor = $result->saveAll($data);

        $sum = $result->where('product_id', $product_id)->sum('price');
        $cost = new CostModel;
        $count = $cost->where('product_id', $product_id)->count();
        if ($count>0) {
            $costlaborsum = $cost->where('product_id', $product_id)->update(['labor_cost'=>$sum]);
        } else {
            $costlaborsum = $cost->allowField(true)->save(['labor_cost'=>$sum,'product_id'=>$product_id]);
        }

        if ($costlaborsum) {
            return $this->success('添加成功');
        } else {
            return $this->error('添加失败');
        }
    }

    //删除人工费用
    public function delcostlabor()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id');
            $result = new CostLaborModel;
            $product_id = $result->where('id', 'in', $id)->Distinct(true)->value('product_id');
            $costlabor = $result->destroy($id);
            
            $sum = $result->where('product_id', $product_id)->sum('price');
            $cost = new CostModel;
            $cost->where('product_id', $product_id)->update(['labor_cost'=>$sum]);

            if ($costlabor) {
                return $this->success('删除成功');
            } else {
                return $this->error('删除失败');
            }
        }
    }

    //编辑人工费用
    public function editcostlabor()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $price = $this->request->param('price');
            $product_id = $this->request->param('product_id');

            $result = new CostLaborModel;
            $costlabor = $result->allowField(true)->update(['price'=>$price,'id'=>$id]);

            $sum = $result->where('product_id', $product_id)->sum('price');

            $cost = new CostModel;
            $count = $cost->where('product_id', $product_id)->count();
            if ($count>0) {
                $costlaborsum = $cost->where('product_id', $product_id)->update(['labor_cost'=>$sum]);
            } else {
                $costlaborsum = $cost->allowField(true)->save(['labor_cost'=>$sum,'product_id'=>$product_id]);
            }
            if ($costlabor||$costlaborsum) {
                return $this->success('修改成功');
            } else {
                return $this->error('修改失败');
            }
        }
    }

    //材料用量
    public function costmaterial()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $result =  new CostModel;
            $costmaterial = $result->where('product_id', $id)->field('material_config')->find();
            if (empty($costmaterial['material_config'])) {
                $data["data"] = [];
                $data["code"]=0;
                return $data;
            }
            $data["data"]=json_decode($costmaterial['material_config'], true);
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
    }

    // 更新用量
    public function updatacost()
    {
        $data['product_id'] = $this->request->param('id', 0, 'intval');
        $data['material_config'] = json_encode($this->request->param('material_config'));
        $data['material_cost'] = $this->request->param('material_cost');
        $result =  new CostModel;
        $cout = $result->where('product_id', $data['product_id'])->count();
        if ($cout>0) {
            $costmaterial = $result->allowField(true)->where('product_id', $data['product_id'])->update([
                'material_config'=>$data['material_config'],
                'material_cost'=>$data['material_cost'],
            ]);
        } else {
            $costmaterial = $result->allowField(true)->save($data);
        }
        if ($costmaterial) {
            return $this->success('修改成功');
        } else {
            return $this->error('修改失败');
        }
    }

    //获取用料下拉框
    public function getcostselect()
    {
        if ($this->request->isPost()) {
            $name = $this->request->param('name');
            $daily_price = new DailypriceModel;
            $standard  = $daily_price->where('name', $name)->select();
            return $standard;
        }
    }

    //获取人工下拉框
    public function getcostlaborselect()
    {
        if ($this->request->isPost()) {
            $type_id = $this->request->param('type_id');
            $daily_price = new DailypriceModel;
            $standard  = $daily_price->where('type_id', $type_id)->select();
            return $standard;
        }
    }

    //产品列表
    public function progress()
    {
        if ($this->request->isPost()) {
            $result = new OrderProductModel;
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $OrderProduct = $result
                            ->alias("a")
                            ->join('__ORDER__ e', 'a.order_id = e.id', 'LEFT')
                            ->field('a.*,e.year as order_year,e.num as order_num')
                            ->order('order_time desc,num desc')
                            ->page($page, $limit)
                            ->select();
            $count = $result
                    ->alias("a")
                    ->join('__ORDER__ e', 'a.order_id = e.id', 'LEFT')
                    ->field('a.*,e.year as order_year,e.num as order_num')
                    ->count();

            foreach ($OrderProduct as &$vo) {
                if (!is_null(json_decode($vo['product_dec']))) {
                    $vo['product_dec'] = json_decode($vo['product_dec']);
                }
                if (!is_null(json_decode($vo['remark']))) {
                    $vo['remark'] = json_decode($vo['remark']);
                }
            }
            foreach ($OrderProduct as &$vo) {
                $b = Db::name('order_product')
                        ->alias("a")
                        ->join('__TASK__ e', 'e.product_id = a.id', 'LEFT')
                        ->join('__WORKER__ c', 'c.id = e.worker_id', 'LEFT')
                        ->join('__WORK_TYPE__ d', 'd.id = c.work_id', 'LEFT')
                        ->where('a.id', $vo['id'])
                        ->whereIn('d.id', '1,2,3,4,5,7,22,15,16,18,19')
                        ->field('c.work_id,sum(e.num) as task_num,c.name')
                        ->group('d.id')
                        ->select()
                        ->toArray();
                $a = Db::name('order_product')
                        ->alias("a")
                        ->join('__MATCH__ b', 'b.product_id = a.id', 'LEFT')
                        ->join('__WORKER__ c', 'c.id = b.worker_id', 'LEFT')
                        ->join('__WORK_TYPE__ d', 'd.id = c.work_id', 'LEFT')
                        ->where('a.id', $vo['id'])
                        ->whereIn('d.id', '1,2,3,4,5,7,22,15,16,18,19')
                        ->field('c.work_id,sum(b.num) as pro_num,c.name')
                        ->group('d.id')
                        ->select()
                        ->toArray();
    
                $task = [
                            ['task_num'=>"0", 'work_id'=>'3','pro_num'=>'0','name'=>'木工'],
                            ['task_num'=>"0", 'work_id'=>'22','pro_num'=>'0','name'=>'实木'],
                            ['task_num'=>"0", 'work_id'=>'5','pro_num'=>'0','name'=>'打底'],
                            ['task_num'=>"0", 'work_id'=>'1','pro_num'=>'0','name'=>'裁床'],
                            ['task_num'=>"0", 'work_id'=>'2','pro_num'=>'0','name'=>'车位'],
                            ['task_num'=>"0", 'work_id'=>'4','pro_num'=>'0','name'=>'开棉'],
                            ['task_num'=>"0", 'work_id'=>'7','pro_num'=>'0','name'=>'扪工'],
                        ];
                foreach ($task as &$io) {
                    foreach ($b as &$ii) {
                        if ($io['work_id']==$ii['work_id']) {
                            foreach ($a as &$iu) {
                                if ($iu['work_id']==$ii['work_id']) {
                                    $ii['pro_num'] =  $iu['pro_num'];
                                } else {
                                    $ii['pro_num'] =  '0';
                                }
                            }
                            if ($ii['task_num']==null) {
                                $io['task_num']='0';
                            } else {
                                $io['task_num']=$ii['task_num'];
                            }
                        }
                    }
    
                    foreach ($a as &$ii) {
                        if ($io['work_id']==$ii['work_id']) {
                            foreach ($b as &$iu) {
                                if ($iu['work_id']==$ii['work_id']) {
                                    $ii['task_num'] =  $iu['task_num'];
                                } else {
                                    $ii['task_num'] =  '0';
                                }
                            }
                            if ($ii['pro_num']==null) {
                                $io['pro_num']='0';
                            } else {
                                $io['pro_num']=$ii['pro_num'];
                            }
                        }
                    }
                }
                $vo['task'] = $task;
            }
            $data["data"]=$OrderProduct;
            $data["code"]=0;
            $data["count"]=$count;
            $data["msg"]='';
            return $data;
        }
        $work_type = Db::name('work_type')->Distinct(true)->field('name,id')->select();
        $this->assign('work_type', $work_type);
        $worker_name = Db::name('worker')->field('name,id')->select();
        $this->assign('worker_name', $worker_name);

        $result  = new OrderModel;
        $year = $result->Distinct(true)->field('year')->select();
        $client = $result->client()->select();
        $this->assign('client', $client);
        $this->assign('year', $year);
        return $this->fetch('order/progress');
    }
    // 搜索
    public function progresssearchlst()
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
            if (isset($where['starttime'])||isset($where['endtime'])) {
                $starttime = $where['starttime'];
                $endtime = $where['endtime'];
                $where = [['order_time', 'between time', [$starttime, $endtime]]];
                unset($where['starttime']);
                unset($where['endtime']);
            };
            if (isset($where['pro_progress'])) {
                if ($where['pro_progress']==1) {
                    $where3 = [['e.pro_progress', '<', 100]];
                } else {
                    $where3 = [['e.pro_progress', '>=', 100]];
                }
                unset($where['pro_progress']);
            }
    
            if (isset($where['ship_progress'])) {
                if ($where['ship_progress']==1) {
                    $where4 = [['e.ship_progress', '<', 100]];
                } else {
                    $where4 = [['e.ship_progress', '>=', 100]];
                }
                unset($where['ship_progress']);
            }

            if (isset($where['order_id'])) {
                $where['a.order_id'] = $where['order_id'];
                unset($where['order_id']);
            }

            if (isset($where['year'])) {
                $where['e.year'] = $where['year'];
                unset($where['year']);
            };
            if (isset($where['menggong'])) {
                $menggong=$where['menggong'];
                unset($where['menggong']);
            };
            if (isset($where['caichuang'])) {
                $caichuang=$where['caichuang'];
                unset($where['caichuang']);
            };
            if (isset($where['chewei'])) {
                $chewei=$where['chewei'];
                unset($where['chewei']);
            };
            if (isset($where['mugong'])) {
                $mugong=$where['mugong'];
                unset($where['mugong']);
            };
            if (isset($where['dadi'])) {
                $dadi=$where['dadi'];
                unset($where['dadi']);
            };
            if (isset($where['shimu'])) {
                $shimu=$where['shimu'];
                unset($where['shimu']);
            };
            if (isset($where['kaimian'])) {
                $kaimian=$where['kaimian'];
                unset($where['kaimian']);
            };
    
            $result = new OrderProductModel;
            $OrderProduct = $result
                            ->alias("a")
                            ->join('__ORDER__ e', 'a.order_id = e.id', 'LEFT')
                            ->join('__CLIENT__ f', 'e.client_id = f.id', 'LEFT')
                            ->field('a.*,e.year as order_year,e.num as order_num,f.s_name,f.id as client_id,e.order_time as order_time')
                            ->where($where)
                            ->where($where2)
                            ->where($where3)
                            ->where($where4)
                            ->order('order_time desc,num desc')
                            ->page($page, $limit)
                            ->select();

            foreach ($OrderProduct as &$vo) {
                $b = Db::name('order_product')
                    ->alias("a")
                    ->join('__TASK__ e', 'e.product_id = a.id', 'LEFT')
                    ->join('__WORKER__ c', 'c.id = e.worker_id', 'LEFT')
                    ->join('__WORK_TYPE__ d', 'd.id = c.work_id', 'LEFT')
                    ->where('a.id', $vo['id'])
                    ->whereIn('d.id', '1,2,3,4,5,7,22,15,16,18,19')
                    ->field('c.work_id,sum(e.num) as task_num,c.name')
                    ->group('d.id')
                    ->select()
                    ->toArray();
                $a = Db::name('order_product')
                    ->alias("a")
                    ->join('__MATCH__ b', 'b.product_id = a.id', 'LEFT')
                    ->join('__WORKER__ c', 'c.id = b.worker_id', 'LEFT')
                    ->join('__WORK_TYPE__ d', 'd.id = c.work_id', 'LEFT')
                    ->where('a.id', $vo['id'])
                    ->whereIn('d.id', '1,2,3,4,5,7,22,15,16,18,19')
                    ->field('c.work_id,sum(b.num) as pro_num,c.name')
                    ->group('d.id')
                    ->select()
                    ->toArray();
                    
                $task = [
                            ['task_num'=>"0", 'work_id'=>'3','pro_num'=>'0','name'=>'木工'],
                            ['task_num'=>"0", 'work_id'=>'22','pro_num'=>'0','name'=>'实木'],
                            ['task_num'=>"0", 'work_id'=>'4','pro_num'=>'0','name'=>'开棉'],
                            ['task_num'=>"0", 'work_id'=>'5','pro_num'=>'0','name'=>'打底'],
                            ['task_num'=>"0", 'work_id'=>'1','pro_num'=>'0','name'=>'裁床'],
                            ['task_num'=>"0", 'work_id'=>'2','pro_num'=>'0','name'=>'车位'],
                            ['task_num'=>"0", 'work_id'=>'7','pro_num'=>'0','name'=>'扪工'],
                        ];
                foreach ($task as &$io) {
                    foreach ($b as &$ii) {
                        if ($io['work_id']==$ii['work_id']) {
                            foreach ($a as &$iu) {
                                if ($iu['work_id']==$ii['work_id']) {
                                    $ii['pro_num'] =  $iu['pro_num'];
                                } else {
                                    $ii['pro_num'] =  '0';
                                }
                            }
                            if ($ii['task_num']==null) {
                                $io['task_num']='0';
                            } else {
                                $io['task_num']=$ii['task_num'];
                            }
                        }
                    }
                    
                    foreach ($a as &$ii) {
                        if ($io['work_id']==$ii['work_id']) {
                            foreach ($b as &$iu) {
                                if ($iu['work_id']==$ii['work_id']) {
                                    $ii['task_num'] =  $iu['task_num'];
                                } else {
                                    $ii['task_num'] =  '0';
                                }
                            }
                            if ($ii['pro_num']==null) {
                                $io['pro_num']='0';
                            } else {
                                $io['pro_num']=$ii['pro_num'];
                            }
                        }
                    }
                }
                $vo['task'] = $task;
            }
            foreach ($OrderProduct as $key => &$vo) {
                if (isset($mugong) && $vo['task']['0']['pro_num']<$vo['amount']) {
                    unset($OrderProduct[$key]);
                }
            }
            foreach ($OrderProduct as $key => &$vo) {
                if (isset($shimu) && $vo['task']['1']['pro_num']<$vo['amount']) {
                    unset($OrderProduct[$key]);
                }
            }
            foreach ($OrderProduct as $key => &$vo) {
                if (isset($kaimian) && $vo['task']['2']['pro_num']<$vo['amount']) {
                    unset($OrderProduct[$key]);
                }
            }
            foreach ($OrderProduct as $key => &$vo) {
                if (isset($dadi) && $vo['task']['3']['pro_num']<$vo['amount']) {
                    unset($OrderProduct[$key]);
                }
            }
            foreach ($OrderProduct as $key => &$vo) {
                if (isset($caichuang) && $vo['task']['4']['pro_num']<$vo['amount']) {
                    unset($OrderProduct[$key]);
                }
            }
            foreach ($OrderProduct as $key => &$vo) {
                if (isset($chewei) && $vo['task']['5']['pro_num']<$vo['amount']) {
                    unset($OrderProduct[$key]);
                }
            }
            foreach ($OrderProduct as $key => &$vo) {
                if (isset($menggong) && $vo['task']['6']['pro_num']<$vo['amount']) {
                    unset($OrderProduct[$key]);
                }
            }


            // 获取总数
            $count = $result
                            ->alias("a")
                            ->join('__ORDER__ e', 'a.order_id = e.id', 'LEFT')
                            ->join('__CLIENT__ f', 'e.client_id = f.id', 'LEFT')
                            ->field('a.*,e.year as order_year,e.num as order_num,f.s_name,f.id as client_id,e.order_time as order_time')
                            ->where($where)
                            ->where($where2)
                            ->where($where3)
                            ->where($where4)
                            ->order('order_time desc,num desc')
                            ->select();

            foreach ($count as &$vo) {
                $b = Db::name('order_product')
                    ->alias("a")
                    ->join('__TASK__ e', 'e.product_id = a.id', 'LEFT')
                    ->join('__WORKER__ c', 'c.id = e.worker_id', 'LEFT')
                    ->join('__WORK_TYPE__ d', 'd.id = c.work_id', 'LEFT')
                    ->where('a.id', $vo['id'])
                    ->whereIn('d.id', '1,2,3,4,5,7,22,15,16,18,19')
                    ->field('c.work_id,sum(e.num) as task_num,c.name')
                    ->group('d.id')
                    ->select()
                    ->toArray();
                $a = Db::name('order_product')
                    ->alias("a")
                    ->join('__MATCH__ b', 'b.product_id = a.id', 'LEFT')
                    ->join('__WORKER__ c', 'c.id = b.worker_id', 'LEFT')
                    ->join('__WORK_TYPE__ d', 'd.id = c.work_id', 'LEFT')
                    ->where('a.id', $vo['id'])
                    ->whereIn('d.id', '1,2,3,4,5,7,22,15,16,18,19')
                    ->field('c.work_id,sum(b.num) as pro_num,c.name')
                    ->group('d.id')
                    ->select()
                    ->toArray();
                    
                $task = [
                            ['task_num'=>"0", 'work_id'=>'3','pro_num'=>'0','name'=>'木工'],
                            ['task_num'=>"0", 'work_id'=>'22','pro_num'=>'0','name'=>'实木'],
                            ['task_num'=>"0", 'work_id'=>'4','pro_num'=>'0','name'=>'开棉'],
                            ['task_num'=>"0", 'work_id'=>'5','pro_num'=>'0','name'=>'打底'],
                            ['task_num'=>"0", 'work_id'=>'1','pro_num'=>'0','name'=>'裁床'],
                            ['task_num'=>"0", 'work_id'=>'2','pro_num'=>'0','name'=>'车位'],
                            ['task_num'=>"0", 'work_id'=>'7','pro_num'=>'0','name'=>'扪工'],
                        ];
                foreach ($task as &$io) {
                    foreach ($b as &$ii) {
                        if ($io['work_id']==$ii['work_id']) {
                            foreach ($a as &$iu) {
                                if ($iu['work_id']==$ii['work_id']) {
                                    $ii['pro_num'] =  $iu['pro_num'];
                                } else {
                                    $ii['pro_num'] =  '0';
                                }
                            }
                            if ($ii['task_num']==null) {
                                $io['task_num']='0';
                            } else {
                                $io['task_num']=$ii['task_num'];
                            }
                        }
                    }
                    
                    foreach ($a as &$ii) {
                        if ($io['work_id']==$ii['work_id']) {
                            foreach ($b as &$iu) {
                                if ($iu['work_id']==$ii['work_id']) {
                                    $ii['task_num'] =  $iu['task_num'];
                                } else {
                                    $ii['task_num'] =  '0';
                                }
                            }
                            if ($ii['pro_num']==null) {
                                $io['pro_num']='0';
                            } else {
                                $io['pro_num']=$ii['pro_num'];
                            }
                        }
                    }
                }
                $vo['task'] = $task;
            }
            foreach ($count as $key => &$vo) {
                if (isset($mugong) && $vo['task']['0']['pro_num']<$vo['amount']) {
                    unset($count[$key]);
                }
            }
            foreach ($count as $key => &$vo) {
                if (isset($shimu) && $vo['task']['1']['pro_num']<$vo['amount']) {
                    unset($count[$key]);
                }
            }
            foreach ($count as $key => &$vo) {
                if (isset($kaimian) && $vo['task']['2']['pro_num']<$vo['amount']) {
                    unset($count[$key]);
                }
            }
            foreach ($count as $key => &$vo) {
                if (isset($dadi) && $vo['task']['3']['pro_num']<$vo['amount']) {
                    unset($count[$key]);
                }
            }
            foreach ($count as $key => &$vo) {
                if (isset($caichuang) && $vo['task']['4']['pro_num']<$vo['amount']) {
                    unset($count[$key]);
                }
            }
            foreach ($count as $key => &$vo) {
                if (isset($chewei) && $vo['task']['5']['pro_num']<$vo['amount']) {
                    unset($count[$key]);
                }
            }
            foreach ($count as $key => &$vo) {
                if (isset($menggong) && $vo['task']['6']['pro_num']<$vo['amount']) {
                    unset($count[$key]);
                }
            }

            $data["data"]=$OrderProduct;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]= count($count);
            return $data;
        }
    }
}
