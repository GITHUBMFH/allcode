<?php
namespace app\yes\controller;

use app\yes\model\DailyPriceModel;
use cmf\controller\AdminBaseController;
use think\Db;
use think\facade\Cache;

class DailyPriceController extends AdminBaseController
{
    public function index()
    {
        if ($this->request->isPost()) {
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $dailyprice = DailypriceModel::with(['worktype'])->page($page, $limit)->order('id','desc')->select();
            $count =DailypriceModel::with(['worktype'])->count(); 
            $data["data"]=$dailyprice;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        };
        $result = new DailyPriceModel();
        $type = $result->worktype()->select();
        $this->assign('type', $type);
        return $this->fetch('dailyprice/index');
    }

    public function addPost()
    {
        if ($this->request->isPost()) {
            $dailyprice = new DailypriceModel;
            $result = $dailyprice->allowField(true)->save($_POST);
            if ($result) {
                return $this->success('添加成功');
            } else {
                return $this->error('添加失败');
            }
        };
    }

    public function delPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $dailyprice = new DailypriceModel;
            $result = $dailyprice->destroy($id);
            if ($result) {
                return $this->success('删除成功');
            } else {
                return $this->error('删除失败');
            }
        };
    }


    public function editPost()
    {
        if ($this->request->isPost()) {
            $dailyprice = new DailypriceModel;
            $result = $dailyprice->allowField(true)->update($_POST);
            if ($result) {
                return $this->success('修改成功');
            } else {
                return $this->error('修改失败');
            }
        };
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

            $result =DailypriceModel::with(['worktype'])
                    ->where($where)
                    ->order('id','desc')
                    ->page($page, $limit)
                    ->select();
            $count =DailypriceModel::with(['worktype'])
                    ->where($where)
                    ->count();    
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }
}
