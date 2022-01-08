<?php
namespace app\myes\controller;

use cmf\controller\AdminBaseController;
use think\Db;
use app\yes\model\OrderModel;
use app\yes\model\OrderProductModel;
use app\yes\model\DailyPriceModel;
use app\yes\model\AdminMenuModel;
use think\facade\Cache;

class IndexController extends AdminBaseController
{
    public function initialize()
    {
        $adminSettings = cmf_get_option('admin_settings');
        if (empty($adminSettings['admin_password']) || $this->request->path() == $adminSettings['admin_password']) {
            $adminId = cmf_get_current_admin_id();
            if (empty($adminId)) {
                session("__LOGIN_BY_CMF_ADMIN_PW__", 1);//设置后台登录加密码 // 不能直接从login/index的连接中进去，要先进入首页
            }
        }

        parent::initialize();
    }

    /**
     * 后台公共页面
     */
    public function index()
    {
        $result  = new OrderModel;
        $client = $result->client()->select();
        $this->assign('client', $client);
        $year = $result->Distinct(true)->field('year')->select();
        $this->assign('year', $year);
        return $this->fetch(':order');
    }

    public function spare()
    {
        $order = new OrderModel;
        $year = $order->Distinct(true)->field('year')->select();
        $client = Db::name('client')->Distinct(true)->select();
        $this->assign('client', $client);
        $this->assign('year', $year);
        return $this->fetch(":spare");
    }

    public function spareid()
    {
        if ($this->request->isGet()) {
            $id = $this->request->param('id', 0, 'intval');
            $result = Db::name('Spare')
            ->alias("a")
            ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
            ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
            ->join('__CLIENT__ g', 'c.client_id =g.id', 'LEFT')
            ->field('a.*,b.order_id,b.pro_num,c.year,c.num,c.client_id,g.s_name as client_name')
            ->where('a.id', $id)
            ->find();
            $this->assign('result', $result);
        }

        $order = new OrderModel;
        $year = $order->Distinct(true)->field('year')->select();
        $client = Db::name('client')->Distinct(true)->select();
        $this->assign('client', $client);
        $this->assign('year', $year);
        return $this->fetch(":spareid");
    }

    //产品列表
    public function orderproduct()
    {
        $order = new OrderModel;
        $year = $order->Distinct(true)->field('year')->select();
        $this->assign('year', $year);

        $work_type = Db::name('work_type')->Distinct(true)->field('name,id')->select();
        $this->assign('work_type', $work_type);
        $worker_name = Db::name('worker')->field('name,id')->select();
        $this->assign('worker_name', $worker_name);
        return $this->fetch(':orderproduct');
    }

    public function orderproductlist()
    {
        if ($this->request->isPost()) {
            $result = new OrderProductModel;
            $id  = $this->request->param('id');
            $OrderProduct = Db::name('order_product')
                            ->alias("a")
                            ->join('__SAMPLE__ b', 'a.id =b.product_id', 'LEFT')
                            ->where('order_id', $id)
                            ->field('a.*,b.sofa,b.solid,b.solid_num')
                            ->select();
            foreach ($OrderProduct as &$vo) {
                if (!is_null(json_decode($vo['product_dec']))) {
                    $vo['product_dec'] = json_decode($vo['product_dec']);
                }
                if (!is_null(json_decode($vo['remark']))) {
                    $vo['remark'] = json_decode($vo['remark']);
                }
            }
            $data["data"]=$OrderProduct;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
    }

    public function sofa_sample()
    {
        if ($this->request->isPost()) {
            if (session('ADMIN_ID')!=1&&session('ADMIN_ID')!=18) {
                return $this->error('权限不足');
            }
            $id = $this->request->param('product_id', 0, 'intval');
            $data  = $this->request->param();
            $result = Db::name('sample');
            $count = $result->where('product_id', $id)->count();
            if ($count>0) {
                $content = Db::name('sample')->where('product_id', $id)->update($data);
            } else {
                $content = Db::name('sample')->insert($data);
            }
            if ($content) {
                $this->success('修改成功');
            } else {
                $this->error('修改失败');
            }
        }
    }
    //产品列表
    public function product()
    {
        if ($this->request->isGet()) {
            $id = $this->request->param('id', 0, 'intval');
            $result = Db::name('order_product')
                    ->alias("a")
                    ->join('__ORDER__ b', 'a.order_id  =b.id', 'LEFT')
                    ->join('__CLIENT__ c', 'b.client_id  =c.id', 'LEFT')
                    ->where('a.id', $id)
                    ->field('a.*,b.year,b.project,b.num,c.name as client_name')
                    ->find();
            $img  = Db::name('product_file')
                    ->where('product_id', $id)
                    ->where('style', 'img')
                    ->select()
                    ->toArray();
            if (!is_null(json_decode($result['product_dec']))) {
                $result['product_dec'] = json_decode($result['product_dec']);
            }
            if (!is_null(json_decode($result['remark']))) {
                $result['remark'] = json_decode($result['remark']);
            }
            $this->assign('result', $result);
            $this->assign('img', $img);
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
            return $this->fetch(':product');
        }
    }

    //生产记录
    public function produce()
    {
        $order = new OrderModel;
        $client = Db::name('client')->Distinct(true)->select();
        $this->assign('client', $client);
        $year = $order->Distinct(true)->field('year')->select();
        $this->assign('year', $year);
        return $this->fetch(':produce');
    }

    public function addproduce()
    {
        if ($this->request->isGet()) {
            $id = $this->request->param('id', 0, 'intval');
            $result = Db::name('produce')
                        ->alias("a")
                        ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                        ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
                        ->join('__CLIENT__ g', 'c.client_id =g.id', 'LEFT')
                        ->field('a.*,b.order_id,b.pro_num,c.year,c.num,c.client_id,g.s_name as client_name')
                        ->where('a.id', $id)
                        ->find();
            $this->assign('result', $result);
        }
        $order = new OrderModel;
        $client = Db::name('client')->Distinct(true)->select();
        $this->assign('client', $client);
        $year = $order->Distinct(true)->field('year')->select();
        $this->assign('year', $year);
        return $this->fetch(':addproduce');
    }
    
    //出货列表
    public function shipment()
    {
        $order = new OrderModel;
        $year = $order->Distinct(true)->field('year')->select();
        $client = Db::name('client')->Distinct(true)->select();
        $this->assign('client', $client);
        $this->assign('year', $year);
        return $this->fetch(':shipment');
    }

    //出货列表
    public function addshipment()
    {
        if ($this->request->isGet()) {
            $id = $this->request->param('id', 0, 'intval');
            $result = Db::name('shipment')
                        ->alias("a")
                        ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                        ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
                        ->join('__CLIENT__ g', 'c.client_id =g.id', 'LEFT')
                        ->field('a.*,b.order_id,b.pro_num,c.year,c.num,c.client_id,g.s_name as client_name')
                        ->order('a.shipment_data desc')
                        ->where('a.id', $id)
                        ->find();
            $this->assign('result', $result);
        }
        $order = new OrderModel;
        $year = $order->Distinct(true)->field('year')->select();
        $client = Db::name('client')->Distinct(true)->select();
        $this->assign('client', $client);
        $this->assign('year', $year);
        return $this->fetch(':addshipment');
    }

    // 价格参考搜索
    public function record()
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
                        ->join('__UNIT__ g', 'g.id =c.unit', 'LEFT')
                        ->Distinct(true)
                        ->field('c.name,c.oneprice,c.size,b.s_name,d.name as type_name,g.name as unit')
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
                    ->join('__UNIT__ g', 'g.id =c.unit', 'LEFT')
                    ->field('c.name,c.oneprice,c.size,b.s_name,d.name as type_name,g.name as unit')
                    ->Distinct(true)
                    ->cache(true)
                    ->select()
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
        return $this->fetch(':recordsearch');
    }

    //采购搜索
    public function recordsearch()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $where = array_filter($this->request->param());
            unset($where['page']);
            unset($where['limit']);
            $where2 = [];
            if (isset($where['supplier'])) {
                $where['a.supplier'] = $where['supplier'];
                unset($where['supplier']);
            }
            if (isset($where['name'])) {
                $where2= [['c.name', 'like', '%'.$where['name'].'%']];
                unset($where['name']);
            };
            if (isset($where['type_id'])) {
                $where['c.type_id'] = $where['type_id'];
                unset($where['type_id']);
            };

            $result = Db::name('record')
                        ->alias("a")
                        ->join('__SUPPLIER__ b', 'a.supplier =b.id', 'LEFT')
                        ->join('__RECORD_DETAILS__ c', 'c.record_id =a.id', 'LEFT')
                        ->join('__MATERIAL_TYPE__ d', 'c.type_id =d.id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ e', 'c.product_id =e.id', 'LEFT')
                        ->join('__ORDER__ f', 'e.order_id =f.id', 'LEFT')
                        ->join('__CLIENT__ g', 'f.client_id =g.id', 'LEFT')
                        ->field('c.name,c.oneprice,c.size,b.s_name,d.name as type_name')
                        ->where($where)
                        ->where($where2)
                        ->page($page, $limit)
                        ->order('a.data desc,a.number desc')
                        ->Distinct(true)
                        ->select();
            $count =  Db::name('record')
                        ->alias("a")
                        ->join('__SUPPLIER__ b', 'a.supplier =b.id', 'LEFT')
                        ->join('__RECORD_DETAILS__ c', 'c.record_id =a.id', 'LEFT')
                        ->join('__MATERIAL_TYPE__ d', 'c.type_id =d.id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ e', 'c.product_id =e.id', 'LEFT')
                        ->join('__ORDER__ f', 'e.order_id =f.id', 'LEFT')
                        ->join('__CLIENT__ g', 'f.client_id =g.id', 'LEFT')
                        ->field('c.name,c.oneprice,c.size,b.s_name,d.name as type_name')
                        ->Distinct(true)
                        ->where($where)
                        ->where($where2)
                        ->select()
                        ->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }

    // 添加对单
    public function match()
    {
        if ($this->request->isGet()) {
            $data =[];
            $data['worker_id'] = $this->request->param('worker_id');
            $data['product_id'] = $this->request->param('product_id');
            $data['number'] = $this->request->param('number');

            $result = Db::name('order_product')
            ->alias("a")
            ->join('__ORDER__ b', 'a.order_id  =b.id', 'LEFT')
            ->where('a.id', $data['product_id'])
            ->field('a.*,b.year,b.project,b.num')
            ->select();
            $product=[];
            foreach ($result as &$value) {
                if (!is_null(json_decode($value['product_dec']))) {
                    $value['product_dec'] = json_decode($value['product_dec']);
                }
                if (!is_null(json_decode($value['remark']))) {
                    $value['remark'] = json_decode($value['remark']);
                }
                array_push($product, $value);
            }
            $worker = Db::name('Worker')
                    ->alias("a")
                    ->join('__WORK_TYPE__ b', 'a.work_id =b.id', 'LEFT')
                    ->field('a.name,b.name as work_name,a.work_id')
                    ->where('a.id', $data['worker_id'])
                    ->find();

            // 获取产品单价
            $where['product_id'] = $this->request->param('product_id');
            $where['worker_id'] = $worker['work_id'];
            $price = Db::name('cost_labor')->where($where)->sum('price');

            $this->assign('worker_id', $data['worker_id']);
            $this->assign('product_id', $data['product_id']);
            $this->assign('price', $price);
            $this->assign('product', $product);
            $this->assign('worker', $worker);
            $this->assign('number', $data['number']);
            $this->assign('date', date("m"));
            $this->assign('year', date("Y"));
            return $this->fetch(':match');
        }
    }
    public function sample()
    {
        if ($this->request->isGet()) {
            $result = Db::name('order_product')
            ->alias("a")
            ->join('__ORDER__ b', 'a.order_id  =b.id', 'LEFT')
            ->where('a.id', $this->request->param('product_id'))
            ->field('a.*,b.year,b.project,b.num')
            ->select();
            $product=[];
            foreach ($result as &$value) {
                if (!is_null(json_decode($value['product_dec']))) {
                    $value['product_dec'] = json_decode($value['product_dec']);
                }
                if (!is_null(json_decode($value['remark']))) {
                    $value['remark'] = json_decode($value['remark']);
                }
                array_push($product, $value);
            }
            $sofa = Db::name('sample')->where('product_id', $this->request->param('product_id'))->value('sofa');
            $this->assign('product_id', $this->request->param('product_id'));
            $this->assign('sofa', $sofa);
            $this->assign('product', $product);
            $this->assign('date', date("Y年m月d日"));
            return $this->fetch(':sample');
        }
    }
    public function getsuccess()
    {
        return $this->fetch(':success');
    }

    // 下发任务
    public function task()
    {
        $order = new OrderModel;
        $year = $order->Distinct(true)->field('year')->select();
        $this->assign('year', $year);
        $work_type = Db::name('work_type')->Distinct(true)->field('name,id')->select();
        $this->assign('work_type', $work_type);
        $worker_name = Db::name('worker')->field('name,id')->select();
        $this->assign('worker_name', $worker_name);
        return $this->fetch(':task');
    }

    // 已完成任务查询
    public function macthsearchlst()
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
                        ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                        ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                        ->field('a.*,sum(a.num) as num,b.name,e.year as order_year,e.num as order_num,b.work_id,d.pro_num')
                        ->where($where)
                        ->page($page, $limit)
                        ->group('d.id,a.month,a.year')
                        ->order('a.id desc')
                        ->select();

            $count = Db::name('match')
                        ->alias("a")
                        ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                        ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                        ->where($where)
                        ->group('d.id,a.month,a.year')
                        ->order('a.id desc')
                        ->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }
}
