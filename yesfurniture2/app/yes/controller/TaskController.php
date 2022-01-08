<?php
namespace app\yes\controller;

use cmf\controller\AdminBaseController;
use think\Db;
use app\yes\model\OrderModel;

class TaskController extends AdminBaseController
{
    public function index()
    {
        if ($this->request->isPost()) {
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $result = Db::name('task')
                        ->alias("a")
                        ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                        ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                        ->join('__CLIENT__ f', 'e.client_id = f.id', 'LEFT')
                        ->join('__MATCH__ g', 'g.product_id = d.id and g.worker_id = a.worker_id', 'LEFT')
                        ->field('a.*,b.name,e.year as order_year,e.num as order_num,f.s_name,f.id as client_id,d.order_id,d.pro_num,b.work_id,b.name as worker_name,sum(g.num) as p_num')
                        ->page($page, $limit)
                        ->group('a.id')
                        ->order('a.date desc')
                        ->select();
            $count =  Db::name('task')
                        ->alias("a")
                        ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                        ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                        ->join('__CLIENT__ f', 'e.client_id = f.id', 'LEFT')
                        ->join('__MATCH__ g', 'g.product_id = d.id and g.worker_id = a.worker_id', 'LEFT')
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
    public function check()
    {
        if ($this->request->isPost()) {
            $product_id  = $this->request->param('product_id');
            $work_id  = $this->request->param('work_id');

            $result = Db::name('order_product')
                    ->alias("a")
                    // ->join('__MATCH__ b', 'b.product_id = a.id', 'LEFT')
                    ->join('__TASK__ e', 'e.product_id = a.id', 'LEFT')
                    ->join('__WORKER__ c', 'c.id = e.worker_id', 'LEFT')
                    ->join('__WORK_TYPE__ d', 'd.id = c.work_id', 'LEFT')
                    ->where('a.id', $product_id)
                    ->where('d.id', $work_id)
                    ->field('c.id,sum(e.num) as task_num,c.name')
                    ->group('c.id')
                    ->select()
                    ->toArray();
            $result2 = Db::name('order_product')
                    ->alias("a")
                    ->join('__MATCH__ b', 'b.product_id = a.id', 'LEFT')
                    ->join('__WORKER__ c', 'c.id = b.worker_id', 'LEFT')
                    ->join('__WORK_TYPE__ d', 'd.id = c.work_id', 'LEFT')
                    ->where('a.id', $product_id)
                    ->where('d.id', $work_id)
                    ->field('c.id,sum(b.num) as pro_num,c.name')
                    ->group('c.id')
                    ->select()
                    ->toArray();

            foreach ($result as &$ii) {
                foreach ($result2 as &$iu) {
                    if ($iu['id']===$ii['id']) {
                        $ii['pro_num'] =  $iu['pro_num'];
                    }
                }
            }

            foreach ($result2 as &$ii) {
                foreach ($result as &$iu) {
                    if ($iu['id']===$ii['id']) {
                        $ii['task_num'] =  $iu['task_num'];
                    } else {
                        $ii['task_num'] =  '0';
                    }
                }
            }

            $data["data"]=array_unique(array_merge($result, $result2), SORT_REGULAR);
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
    }
    public function addPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = Db::name('task');
            $order  = $result->insert($data);
            if ($order) {
                $this->success('提交成功');
            } else {
                $this->error('提交失败');
            }
        }
    }

    public function alladdPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param('data');
            $result  = Db::name('task');
            $exist = $this->getarrawy($data);
            if (empty($exist )) {
                $order  = $result->insertAll($data);
                if ($order) {
                    $this->success('提交成功');
                } else {
                    $this->error('提交失败');
                }
            } else {
                $this->error('序号:'.implode(",", $exist).',已经下发该员工');
            }
        }
    }

    public function getarrawy($data)
    {
        $exist=[];
        foreach ($data as $key=>$vo) {
            $result  = Db::name('task');
            $find = $result->where('worker_id', $vo['worker_id'])->where('product_id', $vo['product_id'])->count();
            if($find>0){
                $pro_num = Db::name('order_product')->where('id', $vo['product_id'])->value('pro_num');
                if($pro_num){
                    array_push($exist, $pro_num);
                }
            }
        }
        return $exist;
    }

    public function editPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = Db::name('task');
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
            $result  = Db::name('task');
            $order  = $result->delete($id);
            if ($order) {
                $this->success('删除成功');
            } else {
                $this->error('删除失败');
            }
        }
    }

    public function alldelPost()
    {
        if ($this->request->isPost()) {
            $id  = $this->request->param('id');
            $result  = Db::name('task');
            $order  = $result->where('id', 'in', $id)->delete();
            if ($order) {
                $this->success('删除成功');
            } else {
                $this->error('删除失败');
            }
        }
    }
    public function changestate()
    {
        if ($this->request->isPost()) {
            $id  = $this->request->param('id');
            $state  = $this->request->param('state');
            $result  = Db::name('task');
            $order  = $result->where('id', 'in', $id)->update(['state' => $state]);
            if ($order) {
                $this->success('标记成功');
            } else {
                $this->error('标记失败');
            }
        }
    }

    // 修改任务数量
    public function taskupdata()
    {
        $result = Db::name('task');
        $id = $this->request->param('id');
        $num = $this->request->param('num');
        $mag = $result->update(['id' => $id, 'num' => $num]);
        if ($mag) {
            return $this->success('修改成功');
        } else {
            return $this->error('修改失败');
        }
    }

    // 未完成任务查询
    public function tasksearchlst()
    {
        // 获取分页数据
        $page = $this->request->param('page');
        $limit = $this->request->param('limit');
        $where = array_filter($this->request->param());
        unset($where['page']);
        unset($where['limit']);
    
        $where2=[];
        $where3=[];
        if (isset($where['worker_id'])) {
            $where['a.worker_id'] = $where['worker_id'];
            unset($where['worker_id']);
        };
        if (isset($where['order_id'])) {
            $where['e.id'] = $where['order_id'];
            unset($where['order_id']);
        };
    
        if (isset($where['product_id'])) {
            $where['a.product_id'] = $where['product_id'];
            unset($where['product_id']);
        };

        if (isset($where['state'])) {
            $where2['a.state'] = $where['state'];
            unset($where['state']);
        } elseif (isset($where['detail'])) {
            unset($where['detail']);
        } else {
            $where2= [['a.state', 'neq', '1']];
            unset($where['state']);
        };

        if (isset($where['starttime'])||isset($where['endtime'])) {
            $starttime = $where['starttime'];
            $endtime = $where['endtime'];
            $where3 = [['a.date', 'between time', [$starttime, $endtime]]];
            unset($where['starttime']);
            unset($where['endtime']);
        };
        $result = Db::name('task')
                            ->alias("a")
                            ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                            ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                            ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                            ->join('__WORK_TYPE__ f', 'b.work_id = f.id', 'LEFT')
                            ->field('a.*,sum(a.num) as num,b.name,e.year as order_year,e.num as order_num,b.work_id,d.pro_num,d.img,d.amount,f.name as work_name')
                            ->where($where)
                            ->where($where2)
                            ->where($where3)
                            ->page($page, $limit)
                            ->group('a.id')
                            ->order('e.year desc,e.num desc')
                            ->select()
                            ->toArray();
    
        foreach ($result as &$vo) {
            $match = Db::name('match')
                ->where('worker_id', $vo['worker_id'])
                ->where('product_id', $vo['product_id'])
                ->value('sum(num)');
            if (empty($match)) {
                $vo['match']='0';
            } else {
                $vo['match']=$match;
            }
        }
        $count = Db::name('task')
                            ->alias("a")
                            ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                            ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                            ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                            ->where($where)
                            ->where($where2)
                            ->where($where3)
                            ->group('a.id')
                            ->order('a.id desc')
                            ->count();
        $data["data"]=$result;
        $data["code"]=0;
        $data["msg"]='';
        $data["count"]=$count;
        return $data;
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
            if (isset($where['worker_id'])) {
                $where['a.worker_id'] = $where['worker_id'];
                unset($where['worker_id']);
            };
            if (isset($where['product_id'])) {
                $where['a.product_id'] = $where['product_id'];
                unset($where['product_id']);
            };
            $result = Db::name('task')
                        ->alias("a")
                        ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                        ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                        ->join('__CLIENT__ f', 'e.client_id = f.id', 'LEFT')
                        ->join('__MATCH__ g', 'g.product_id = d.id and g.worker_id = a.worker_id', 'LEFT')
                        ->field('a.*,b.name,e.year as order_year,e.num as order_num,f.s_name,f.id as client_id,d.order_id,d.pro_num,b.work_id,b.name as worker_name,sum(g.num) as p_num')
                        ->where($where)
                        ->page($page, $limit)
                        ->group('a.id')
                        ->order('a.id desc')
                        ->select();
    
            $count = Db::name('task')
                        ->alias("a")
                        ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                        ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                        ->join('__CLIENT__ f', 'e.client_id = f.id', 'LEFT')
                        ->join('__MATCH__ g', 'g.product_id = d.id and g.worker_id = a.worker_id', 'LEFT')
                        ->field('a.*,b.name,e.year as order_year,e.num as order_num,f.s_name,f.id as client_id,d.order_id,d.pro_num,b.work_id,b.name as worker_name,sum(g.num) as p_num')
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
