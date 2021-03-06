<?php
namespace app\yes\controller;

use app\yes\model\OrderModel;
use cmf\controller\AdminBaseController;
use think\Db;
use think\facade\Cache;

class FinanceController extends AdminBaseController
{
    public function index()
    {
        if ($this->request->isPost()) {
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $supplier = Db::name('finance')
                        ->alias("a")
                        ->join('__SUPPLIER__ b', 'a.name_id =b.id', 'LEFT')
                        ->where('type', 'supplier')
                        ->field('a.*,b.s_name')
                        ->buildSql();
            $result = Db::name('finance')
                        ->alias("a")
                        ->join('__CLIENT__ b', 'a.name_id =b.id', 'LEFT')
                        ->where('type', 'client')
                        ->field('a.*,b.s_name')
                        ->union($supplier)
                        ->page($page, $limit)
                        ->order('data desc')
                        ->select();

            $count = Db::name('finance')
                    ->alias("a")
                    ->join('__CLIENT__ b', 'a.name_id =b.id', 'LEFT')
                    ->where('type', 'client')
                    ->field('a.*,b.s_name')
                    ->union($supplier)
                    ->select()
                    ->count();

            $result_data = [];
            foreach ($result as $vo) {
                $vo['img_url'] = explode(',', $vo['img_url']);
                array_push($result_data, $vo);
            }
            $data["data"]=$result_data;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
        $client = Db::name('client')->Distinct(true)->select();
        $this->assign('client', $client);
        $year = Db::name('order')->Distinct(true)->field('year')->select();
        $this->assign('year', $year);
        return $this->fetch();
    }

    //????????????
    public function uploadmulimg()
    {
        if ($this->request->isPost()) {
            $files = $_FILES;
            $id = $this->request->param('id', 0, 'intval');
            return $this->upimgagain($id, $files);
        }
    }

    // ????????????????????????
    public function upimgagain($id, $files)
    {
        $content = hook_one('fetch_upload_view', $files);
        if ($content) {
            $ulr = [];
            array_push($ulr, $content['key']);
            $oldimgurl = Db::name('finance')->where('id', $id)->value('img_url');
            $oldimgurl = $oldimgurl.','.$content['key'];
            $result = Db::name('finance')->where('id', $id)->update(['img_url' => preg_replace("/^\,/", "", $oldimgurl)]);
            if ($result) {
                $data["data"]=$ulr;
                $data["code"]=0;
                $data["msg"]='????????????';
                return $data;
            } else {
                $this->error('????????????');
            }
        } else {
            return $this->upimgagain($id, $files);
        }
    }

    //????????????????????????
    public function delmulimgPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $key = $this->request->param('key');

            $oldimgurl = Db::name('finance')->where('id', $id)->value('img_url');

            $oldimgurl = explode(",", $oldimgurl);
            foreach ($oldimgurl as $k=>$v) {
                if ($key == $v) {
                    unset($oldimgurl[$k]);
                }
            }
            $oldimgurl = implode(",", $oldimgurl);

            return $this->delmulimgPostagain($id, $oldimgurl, $key);
        }
    }
    //????????????????????????????????????
    public function delmulimgPostagain($id, $oldimgurl, $key)
    {
        $content = hook_one('deloneimg', $key);
        if ($content) {
            $deloneimg = Db::name('finance')->where('id', $id)->update(['img_url'=>$oldimgurl]);
            if ($deloneimg) {
                return $this->success('????????????');
            } else {
                return $this->error('?????????????????????');
            }
        } else {
            return $this->delmulimgPostagain($id, $oldimgurl, $key);
        }
    }


    public function gettype()
    {
        if ($this->request->isPost()) {
            $type = $this->request->param('type');
            if ($type == 'client') {
                $result = Db::name('client')->field('id,s_name')->select();
            } else {
                $result = Db::name('supplier')->field('id,s_name')->select();
            }
            return $result;
        }
    }

    public function addPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = Db::name('finance');
            $order  = $result->insert($data);
            if ($order) {
                $this->success('????????????');
            } else {
                $this->error('????????????');
            }
        }
    }

    public function editPost()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = Db::name('finance');
            $order  = $result->update($data);
            if ($order) {
                $this->success('????????????');
            } else {
                $this->error('????????????');
            }
        }
    }

    public function delPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id');
            $type = Db::name('finance')->where('id', $id)->value('type');
            if ($type == 'client') {
                $count = Db::name('order_price_lst')->where('finance_id', $id)->count();
            } else {
                $count = Db::name('record')->where('finance_id', $id)->count();
            }
            if ($count>0) {
                $this->error('????????????????????????');
            }
            $result  = Db::name('finance');
            $order  = $result->delete($id);
            if ($order) {
                $this->success('????????????');
            } else {
                $this->error('????????????');
            }
        }
    }

    // ????????????
    public function payLst()
    {
        if ($this->request->isPost()) {
            $finance_id = $this->request->param('id', 0, 'intval');
            $result = Db::name('record')
                        ->alias("a")
                        ->join('__SUPPLIER__ b', 'a.supplier =b.id', 'LEFT')
                        ->where('a.finance_id', $finance_id)
                        ->field('a.*,b.s_name')
                        ->order('a.id desc')
                        ->select();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
    }

    // ????????????
    public function delpayLst()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $state = Db::name('record')->where('id', $id)->value('state');
            $finance_id = Db::name('record')->where('id', $id)->value('finance_id');
            if ($state == '5') {
                $result  = Db::name('record')->where('id', $id)->update(['state'=>'1','finance_id'=>null]);
            } elseif ($state == '4') {
                $result  = Db::name('record')->where('id', $id)->update(['state'=>'3','finance_id'=>null]);
            }
            $count = Db::name('record')->where('id', $finance_id)->count();
            if ($count>1) {
                $sum = Db::name('record')->where('finance_id', $finance_id)->sum('price');
                $result  = Db::name('record')->where('id', $id)->update(['price'=>$sum]);
            } else {
                Db::name('finance')->delete($finance_id);
            }
            if ($result) {
                $this->success('????????????');
            } else {
                $this->error('????????????');
            }
        }
    }

    // ????????????
    public function financeLst()
    {
        if ($this->request->isPost()) {
            $finance_id = $this->request->param('id', 0, 'intval');
            $result = Db::name('order_price_lst')
                        ->alias("a")
                        ->join('__ORDER__ b', 'a.order_id =b.id', 'LEFT')
                        ->join('__CLIENT__ c', 'c.id =b.client_id', 'LEFT')
                        ->where('a.finance_id', $finance_id)
                        ->field('a.*,b.year,b.num as order_num,b.id as order_id,b.client_id,c.s_name')
                        ->order('a.id desc')
                        ->select();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
    }

    //??????????????????
    public function addFinanceLst()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = Db::name('order_price_lst');
            $order  = $result->insert($data);
            if ($order) {
                $this->success('????????????');
            } else {
                $this->error('????????????');
            }
        }
    }

    //??????????????????
    public function editFinanceLst()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = Db::name('order_price_lst');
            $order  = $result->update($data);
            if ($order) {
                $this->success('????????????');
            } else {
                $this->error('????????????');
            }
        }
    }

    //??????????????????
    public function delFinanceLst()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $result  = Db::name('order_price_lst');
            $order  = $result->delete($id);
            if ($order) {
                $this->success('????????????');
            } else {
                $this->error('????????????');
            }
        }
    }

    //?????????????????????????????????
    public function supplierLst()
    {
        if ($this->request->isPost()) {
            $finance_id = $this->request->param('id', 0, 'intval');
            $result = Db::name('order_price_lst')
                        ->alias("a")
                        ->join('__ORDER__ b', 'a.order_id =b.id', 'LEFT')
                        ->join('__CLIENT__ c', 'c.id =b.client_id', 'LEFT')
                        ->where('a.finance_id', $finance_id)
                        ->field('a.*,b.year,b.num as order_num,c.s_name')
                        ->order('a.id desc')
                        ->select();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
    }

    // ??????
    public function searchlst()
    {
        if ($this->request->isPost()) {
            // ??????????????????
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $where = array_filter($this->request->param());
            $where2 = [];
            unset($where['page']);
            unset($where['limit']);
            if (isset($where['starttime'])||isset($where['endtime'])) {
                $starttime = $where['starttime'];
                $endtime = $where['endtime'];
                $where2 = [['data', 'between time', [$starttime, $endtime]]];
                unset($where['starttime']);
                unset($where['endtime']);
            };
            if (isset($where['type'])) {
                if ($where['type']=='client') {
                    $result = Db::name('finance')
                            ->alias("a")
                            ->join('__CLIENT__ b', 'a.name_id =b.id', 'LEFT')
                            ->where($where)
                            ->where($where2)
                            ->field('a.*,b.s_name')
                            ->order('data desc')
                            ->page($page, $limit)
                            ->select();
                    $count = Db::name('finance')
                            ->alias("a")
                            ->join('__CLIENT__ b', 'a.name_id =b.id', 'LEFT')
                            ->where($where)
                            ->where($where2)
                            ->count();
                } else {
                    $result = Db::name('finance')
                            ->alias("a")
                            ->join('__SUPPLIER__ b', 'a.name_id =b.id', 'LEFT')
                            ->where($where)
                            ->where($where2)
                            ->field('a.*,b.s_name')
                            ->order('data desc')
                            ->page($page, $limit)
                            ->select();
                    $count = Db::name('finance')
                            ->alias("a")
                            ->join('__SUPPLIER__ b', 'a.name_id =b.id', 'LEFT')
                            ->where($where)
                            ->where($where2)
                            ->count();
                }
            } else {
                $supplier = Db::name('finance')
                        ->alias("a")
                        ->join('__SUPPLIER__ b', 'a.name_id =b.id', 'LEFT')
                        ->where('type', 'supplier')
                        ->where($where)
                        ->where($where2)
                        ->field('a.*,b.s_name')
                        ->buildSql();
                $result = Db::name('finance')
                        ->alias("a")
                        ->join('__CLIENT__ b', 'a.name_id =b.id', 'LEFT')
                        ->where('type', 'client')
                        ->where($where)
                        ->where($where2)
                        ->field('a.*,b.s_name')
                        ->union($supplier)
                        ->page($page, $limit)
                        ->order('data desc')
                        ->select();
                $count = Db::name('finance')
                        ->alias("a")
                        ->join('__CLIENT__ b', 'a.name_id =b.id', 'LEFT')
                        ->where('type', 'client')
                        ->where($where)
                        ->where($where2)
                        ->field('a.*,b.s_name')
                        ->union($supplier)
                        ->select()
                        ->count();
            }

            $result_data = [];
            foreach ($result as $vo) {
                $vo['img_url'] = explode(',', $vo['img_url']);
                array_push($result_data, $vo);
            }

            $data["data"]=$result_data;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }
}
