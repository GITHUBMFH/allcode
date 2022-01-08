<?php
namespace app\yes\controller;

use cmf\controller\AdminBaseController;
use think\Db;
use think\facade\Cache;

class ProductController extends AdminBaseController
{
    //产品列表
    public function index()
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
            return $this->fetch('order/product');
        }
    }

    //上传图片
    public function uploadimg()
    {
        if ($this->request->isPost()) {
            $files = $_FILES;
            $id = $this->request->param('id', 0, 'intval');
            $key = Db::name('order_product')->where('id', $id)->value('img');
            if ($key!='null'&&$key!=null) {
                hook_one('deloneimg', $key);
            }
            $content = hook_one('fetch_upload_view', $files);
            if ($content) {
                $result = Db::name('order_product')->where('id', $id)->update(['img'=>$content['key']]);
                if ($result) {
                    $data["code"]=0;
                    $data["msg"]='上传成功';
                    return $data;
                } else {
                    $this->error('数据库修改失败');
                }
            } else {
                $this->error('上传失败');
            }
        }
    }

    //删除某个产品图片
    public function deloneimgPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $key = Db::name('order_product')->where('id', $id)->value('img');
            $content = hook_one('deloneimg', $key);
            $deloneimg = Db::name('order_product')->where('id', $id)->update(['img' => null]);
            if ($deloneimg||$content) {
                return $this->success('删除成功');
            } else {
                return $this->error('删除失败');
            }
        }
    }

    //多图上传
    public function uploadmulimg()
    {
        if ($this->request->isPost()) {
            $files = $_FILES;
            $id = $this->request->param('id', 0, 'intval');
            $ulr = [];
            foreach ($files as $value) {
                $content = hook_one('fetch_upload_view', $files);
                $data['product_id'] = $id;
                $data['file_url'] = $content['key'];
                $data['style'] = 'img';
                array_push($ulr, $data);
                Db::name('product_file')->insert($data);
            }
            if ($content) {
                $data["data"]=$ulr;
                $data["code"]=0;
                $data["msg"]='上传成功';
                return $data;
            } else {
                $this->error('上传失败');
            }
        }
    }

    //删除多图产品图片
    public function delmulimgPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $key = $this->request->param('key');
            $content = hook_one('deloneimg', $key);
            $deloneimg = Db::name('product_file')->delete($id);
            if ($deloneimg||$content) {
                return $this->success('删除成功');
            } else {
                return $this->error('删除失败');
            }
        }
    }

    //其他资源列表
    public function filelst()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            
            $result = Db::name('product_file')
                        ->where('product_id', $id)
                        ->where('style', 'other')
                        ->select();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
    }

    //多图上传
    public function uploadfile()
    {
        if ($this->request->isPost()) {
            $files = $_FILES;
            $id = $this->request->param('id', 0, 'intval');
            $ulr = [];
            foreach ($files as $value) {
                $content = hook_one('fetch_upload_view', $files);
                $data['product_id'] = $id;
                $data['file_url'] = $content['key'];
                $data['style'] = 'other';
                array_push($ulr, $data);
                Db::name('product_file')->insert($data);
            }
            if ($content) {
                $this->success('上传成功');
            } else {
                $this->error('上传失败');
            }
        }
    }

    // 获取下载链接
    public function getdown()
    {
        if ($this->request->isPost()) {
            $key = $this->request->param('key');
            $content = hook_one('getdownurl', $key);
            return $content;
        }
    }

    //修改备注
    public function changeremark()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $content =Db::name('product_file')->update($data);
            if ($content) {
                $this->success('修改成功');
            } else {
                $this->error('修改失败');
            }
        }
    }

    //添加产品
    public function addPost()
    {
        if ($this->request->isPost()) {
            $result = new OrderProductModel($_POST);
            $OrderProduct = $result->allowField(true)->save();
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
            $edit = $result->update($_POST);
            if ($content||$edit) {
                return $this->success('修改成功');
            } else {
                return $this->error('修改失败');
            }
        }
    }

    //多人任务
    public function getproduct()
    {
        if ($this->request->isPost()) {
            $dataid = $this->request->param('productid');
            $result = Db::name('order_product')
            ->alias("a")
            ->join('__ORDER__ b', 'a.order_id  =b.id', 'LEFT')
            ->where('a.id', $dataid)
            ->field('a.*,b.year,b.project,b.num')
            ->select();
            $data2=[];
            foreach ($result as &$value) {
                if (!is_null(json_decode($value['product_dec']))) {
                    $value['product_dec'] = json_decode($value['product_dec']);
                }
                if (!is_null(json_decode($value['remark']))) {
                    $value['remark'] = json_decode($value['remark']);
                }
                array_push($data2, $value);
            }
            $this->assign('result', $data2);
            $worker = $this->request->param('data');
            $this->assign('worker', json_decode($worker,true));
            $this->assign('date', date("Y年m月d日"));
            return $this->fetch('order/getproduct');
        }
    }

    //单人任务
    public function getsingerproduct()
    {
        if ($this->request->isPost()) {
            $dataid = explode(",", $this->request->param('dataid'));
            $dataid2 = explode(",", $this->request->param('dataid'));
            $amount = explode(",", $this->request->param('amount'));

            $result = Db::name('order_product')
                    ->alias("a")
                    ->join('__ORDER__ b', 'a.order_id  =b.id', 'LEFT')
                    ->whereIn('a.id', $dataid)
                    ->field('a.*,b.year,b.project,b.num')
                    ->select();
            $data2=[];
            foreach ($result as &$value) {
                if (!is_null(json_decode($value['product_dec']))) {
                    $value['product_dec'] = json_decode($value['product_dec']);
                }
                if (!is_null(json_decode($value['remark']))) {
                    $value['remark'] = json_decode($value['remark']);
                }
                array_push($data2, $value);
            }

            foreach ($data2 as $key => &$value) {
                foreach ($dataid2 as $ki => &$vo) {
                    if (strval($value['id']) == $vo) {
                        $data2[$key]['amount']= $amount[$ki];
                    }
                }
            }
            
            $worker = Db::name('worker')
                        ->alias("a")
                        ->join('__WORK_TYPE__ b', 'a.work_id  =b.id', 'LEFT')
                        ->where('a.id',$this->request->param('worker_id'))
                        ->field('a.name,b.name as type_name,a.id as worker_id')
                        ->select();

            $this->assign('worker', $worker);
            $this->assign('result', $data2);
            $this->assign('date', date("Y年m月d日"));
            return $this->fetch('order/getsingerproduct');
        }
    }

    public function sampleproduct()
    {
        if ($this->request->isPost()) {
            $dataid = explode(",", $this->request->param('dataid'));
            $result = Db::name('order_product')
            ->alias("a")
            ->join('__ORDER__ b', 'a.order_id  =b.id', 'LEFT')
            ->whereIn('a.id', $dataid)
            ->field('a.*,b.year,b.project,b.num')
            ->select();
            $data2=[];
            foreach ($result as &$value) {
                if (!is_null(json_decode($value['product_dec']))) {
                    $value['product_dec'] = json_decode($value['product_dec']);
                }
                if (!is_null(json_decode($value['remark']))) {
                    $value['remark'] = json_decode($value['remark']);
                }
                array_push($data2, $value);
            }
            $this->assign('result', $data2);
            $this->assign('date', date("Y年m月d日"));
            return $this->fetch('order/sampleproduct');
        }
    }
}
