<?php
namespace app\yes\controller;

use app\yes\model\WorkerModel;
use app\yes\model\SalaryModel;
use app\yes\model\WorkAttendModel;
use cmf\controller\AdminBaseController;
use think\Db;
use think\facade\Cache;

class WorkerController extends AdminBaseController
{
    public function index()
    {
        if ($this->request->isPost()) {
            $Worker  = new WorkerModel;

            $page = $this->request->param('page');
            $limit = $this->request->param('limit');

            $result = $Worker
                    ->alias("a")
                    ->join('__WORK_TYPE__ b', 'a.work_id =b.id', 'LEFT')
                    ->field('a.*,b.name as work_name')
                    ->page($page, $limit)
                    ->select();
            $count = $Worker->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        };
        $work_type = Db::name('work_type')->Distinct(true)->select();
        $this->assign('work_type', $work_type);

        $worker_name = Db::name('worker')->field('name,id')->select();
        $this->assign('worker_name', $worker_name);
        return $this->fetch();
    }

    public function bank()
    {
        if ($this->request->isPost()) {
            $Worker  = new WorkerModel;
            $updtaId = $this->request->param('id', 0, 'intval');
            $result = $Worker
                    ->alias("a")
                    ->join('__SALARY__ b', 'a.id =b.worker_id', 'LEFT')
                    ->where('a.id', $updtaId)
                    ->field('a.idcard,a.bank_card,a.bank_type,a.band_address,b.salary,b.allowance,a.id')
                    ->select();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        };
    }

    public function salary()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $id = $this->request->param('id', 0, 'intval');

            $salary = new SalaryModel;
            $count = $salary->where('worker_id', $id)->count();
            if ($count>0) {
                $order  = $salary->allowField(true)->update($data);
            } else {
                $data['worker_id']=$id;
                $order  = $salary->allowField(true)->save($data);
            }
            if ($order) {
                $this->success('修改成功');
            } else {
                $this->error('修改失败');
            }
        }
    }

    public function addPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = new WorkerModel;
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
            $result  = new WorkerModel;
            $order  = $result->allowField(true)->update($data);
            if ($order) {
                $this->success('修改成功');
            } else {
                $this->error('修改失败');
            }
        }
    }

    public function delPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id');
            $result  = new WorkerModel;
            $order  = $result->destroy($id);
            if ($order) {
                $this->success('删除成功');
            } else {
                $this->error('删除失败');
            }
        }
    }

    // 查看底薪补贴
    public function check_salary()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $salary = new SalaryModel;
            $result = $salary->where('worker_id', $id)->find();
            return $result;
        }
    }

    // 员工搜索
    public function searchlst()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $where = array_filter($this->request->param());
            unset($where['page']);
            unset($where['limit']);
            $Worker  = new WorkerModel;
            if (isset($where['worker_id'])) {
                $where['a.id'] = $where['worker_id'];
                unset($where['worker_id']);
            };
            $result = $Worker
                    ->alias("a")
                    ->join('__WORK_TYPE__ b', 'a.work_id =b.id', 'LEFT')
                    ->field('a.*,b.name as work_name')
                    ->where($where)
                    ->page($page, $limit)
                    ->select();
            $count = $Worker->count();

            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }


    public function attend()
    {
        if ($this->request->isPost()) {
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');

            $result = Db::name('work_attend')
                    ->alias("a")
                    ->join('__WORKER__ b', 'a.work_id =b.id', 'LEFT')
                    ->field('a.*,b.name as work_name,b.work_id as type_id')
                    ->page($page, $limit)
                    ->order('a.data desc')
                    ->select();
            $count = Db::name('work_attend')
                    ->alias("a")
                    ->join('__WORKER__ b', 'a.work_id =b.id', 'LEFT')
                    ->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        };
        $worker = Db::name('worker')->Distinct(true)->field('name,id')->select();
        $this->assign('worker', $worker);
        $work_type = Db::name('work_type')->Distinct(true)->field('name,id')->select();
        $this->assign('work_type', $work_type);
        $worker_name = Db::name('worker')->field('name,id')->select();
        $this->assign('worker_name', $worker_name);
        return $this->fetch('attend');
    }

    public function attendAdd()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = new WorkAttendModel;
            $order  = $result->allowField(true)->save($data);
            if ($order) {
                $this->success('提交成功');
            } else {
                $this->error('提交失败');
            }
        }
    }

    public function attendEdit()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = new WorkAttendModel;
            $order  = $result->allowField(true)->update($data);
            if ($order) {
                $this->success('修改成功');
            } else {
                $this->error('修改失败');
            }
        }
    }

    public function attendDel()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id');
            $result  = new WorkAttendModel;
            $order  = $result->destroy($id);
            if ($order) {
                $this->success('删除成功');
            } else {
                $this->error('删除失败');
            }
        }
    }

    public function attendSearchlst()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $where = array_filter($this->request->param());
            $where2 = [];
            unset($where['page']);
            unset($where['limit']);
            
            if (isset($where['work_id'])) {
                $where['a.work_id'] = $where['work_id'];
                unset($where['work_id']);
            };
            if (isset($where['starttime'])||isset($where['endtime'])) {
                $starttime = $where['starttime'];
                $endtime = $where['endtime'];
                $where2 = [['data', 'between time', [$starttime, $endtime]]];
                unset($where['starttime']);
                unset($where['endtime']);
            };
            
            $result = Db::name('work_attend')
                    ->alias("a")
                    ->join('__WORKER__ b', 'a.work_id =b.id', 'LEFT')
                    ->field('a.*,b.name as work_name')
                    ->where($where)
                    ->where($where2)
                    ->page($page, $limit)
                    ->order('a.data desc')
                    ->select();
            $count =  Db::name('work_attend')
                    ->alias("a")
                    ->join('__WORKER__ b', 'a.work_id =b.id', 'LEFT')
                    ->field('a.*,b.name as work_name')
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
