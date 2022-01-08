<?php
namespace app\yes\controller;

use cmf\controller\AdminBaseController;
use think\Db;
use think\facade\Cache;

class ProductlstController extends AdminBaseController
{
    //产品列表
    public function index()
    {
        if ($this->request->isPost()) {

             // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');

            $result = Db::name('product_lst')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                    ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
                    ->field('a.*,b.order_id,b.pro_num,c.year,c.num,c.client_id')
                    ->page($page, $limit)
                    ->order('a.id desc')
                    ->select();
            
            $result_data = [];
            foreach ($result as $vo) {
                $vo['img_url'] = explode(',', $vo['img_url']);
                $vo['file_url'] = json_decode($vo['file_url']);
                array_push($result_data, $vo);
            }
            $data["data"]=$result_data;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
        $client = Db::name('client')->Distinct(true)->select();
        $this->assign('client', $client);
        $year = Db::name('order')->Distinct(true)->field('year')->select();
        $this->assign('year', $year);
        return $this->fetch();
    }

    //上传图片
    public function uploadimg()
    {
        $files = $_FILES;
        $content = hook_one('fetch_upload_view', $files);
        return $content;
    }

    //多图上传
    public function uploadmulimg()
    {
        if ($this->request->isPost()) {
            $files = $_FILES;
            $id = $this->request->param('id', 0, 'intval');
            return $this->upimgagain($id, $files);
        }
    }
    // 多图上传失败处理
    public function upimgagain($id, $files)
    {
        $content = hook_one('fetch_upload_view', $files);
        if ($content) {
            $ulr = [];
            array_push($ulr, $content['key']);
            $oldimgurl = Db::name('product_lst')->where('id', $id)->value('img_url');
            $oldimgurl = $oldimgurl.','.$content['key'];
            $result = Db::name('product_lst')->where('id', $id)->update(['img_url' => preg_replace("/^\,/", "", $oldimgurl)]);
            if ($result) {
                $data["data"]=$ulr;
                $data["code"]=0;
                $data["msg"]='上传成功';
                return $data;
            } else {
                $this->error('上传失败');
            }
        } else {
            return $this->upimgagain($id, $files);
        }
    }

    //删除多图产品图片
    public function delmulimgPost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $key = $this->request->param('key');

            $oldimgurl = Db::name('product_lst')->where('id', $id)->value('img_url');

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
    //删除多图产品图片失败处理
    public function delmulimgPostagain($id, $oldimgurl, $key)
    {
        $content = hook_one('deloneimg', $key);
        if ($content) {
            $deloneimg = Db::name('product_lst')->where('id', $id)->update(['img_url'=>$oldimgurl]);
            if ($deloneimg) {
                return $this->success('删除成功');
            } else {
                return $this->error('数据库删除失败');
            }
        } else {
            return $this->delmulimgPostagain($id, $oldimgurl, $key);
        }
    }

    //文件上传
    public function uploadfile()
    {
        if ($this->request->isPost()) {
            // $files = $_FILES;
            $files = $this->request->param();
            // halt($this->request->param('file'));
            halt($files);
            $id = 1;
            // $id = $this->request->param('id', 0, 'intval');
            // halt($id);
            return $this->uploadfileagain($id, $files);
        }
    }
    //文件上传失败处理
    public function uploadfileagain($id, $files)
    {
        $content = hook_one('fetch_upload_view', $files);
        if ($content) {
            $ulr = [];
            $data['url'] = $content['key'];
            $data['remark'] = '';
            array_push($ulr, $data);
            $oldfile_url = Db::name('product_lst')->where('id', $id)->value('file_url');
            if (empty($oldfile_url)) {
                $oldfile_url = $ulr;
            } else {
                $oldfile_url = json_decode($oldfile_url);
                $oldfile_url = array_merge($oldfile_url, $ulr);
            }
            $oldfile_url = json_encode($oldfile_url);

            $result = Db::name('product_lst')->where('id', $id)->update(['file_url' => $oldfile_url]);
            if ($content||$result) {
                $data["data"]=json_decode($oldfile_url);
                $data["code"]=0;
                $data["msg"]='上传成功';
                return $data;
            } else {
                $this->error('上传失败');
            }
        }else{
            return $this->uploadfileagain($id, $files);
        }
    }

    //删除文件
    public function delmulfilePost()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $key = $this->request->param('key');

            $oldfile_url = Db::name('product_lst')->where('id', $id)->value('file_url');
            $oldfile_url = json_decode($oldfile_url);
            $filearray = [];
            foreach ($oldfile_url as $k=>$v) {
                if ($key !== $v->url) {
                    array_push($filearray, $v);
                }
            }
            $oldfile_url = json_encode($filearray);
            $content = hook_one('deloneimg', $key);

            $deloneimg = Db::name('product_lst')->where('id', $id)->update(['file_url' => $oldfile_url]);
            if ($deloneimg||$content) {
                $data["data"]=json_decode($oldfile_url);
                $data["code"]=0;
                $data["msg"]='删除成功';
                return $data;
            } else {
                return $this->error('删除失败');
            }
        }
    }

    // 获取文件下载链接
    public function getdown()
    {
        if ($this->request->isPost()) {
            $key = $this->request->param('key');
            $content = hook_one('getdownurl', $key);
            return $content;
        }
    }

    // 获取文件下载链接
    public function changeremark()
    {
        if ($this->request->isPost()) {
            $data['file_url'] = $this->request->param('file_url');
            $data['id'] = $this->request->param('id', 0, 'intval');
            $content =Db::name('product_lst')->update($data);
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
            $result = Db::name('product_lst');
            $data = $this->request->param();

            $OrderProduct = $result->insert($data);
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
            $result = Db::name('product_lst');

            $img_url = $result->where('id', $id)->value('img_url');
            $file_url = $result->where('id', $id)->value('file_url');

            // halt($img_url);
            if (!empty($img_url)) {
                $img_url = explode(",", $img_url);
                foreach ($img_url as $k=>$v) {
                    hook_one('deloneimg', $v);
                }
            }

            if (!empty($file_url)) {
                $file_url = json_decode($file_url);
                foreach ($file_url as $k=>$v) {
                    hook_one('deloneimg', $v->url);
                }
            }

            $del = $result->delete($id);
            if ($del) {
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
            $data = $this->request->param();
            if (isset($data['img_url'])) {
                unset($data['img_url']);
            }
            if (isset($data['file_url'])) {
                unset($data['file_url']);
            }
            $edit = Db::name('product_lst')->update($data);
            if ($edit) {
                return $this->success('修改成功');
            } else {
                return $this->error('修改失败');
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

            if (isset($where['order_id'])) {
                $where['b.order_id'] = $where['order_id'];
                unset($where['order_id']);
            }
            if (isset($where['year'])) {
                $where['c.year'] = $where['year'];
                unset($where['year']);
            }
            if (isset($where['client_id'])) {
                $where['c.client_id'] = $where['client_id'];
                unset($where['client_id']);
            }
            if (isset($where['product_id'])) {
                $where['b.id'] = $where['product_id'];
                unset($where['product_id']);
            }
            if (isset($where['type_id'])) {
                $where['a.type_id'] = $where['type_id'];
                unset($where['type_id']);
            }
            $result = Db::name('product_lst')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                    ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
                    ->field('a.*,b.order_id,b.pro_num,c.year,c.num,c.client_id')
                    ->where($where)
                    ->page($page, $limit)
                    ->order('a.id desc')
                    ->select();
            $count =Db::name('product_lst')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT__ b', 'a.product_id =b.id', 'LEFT')
                    ->join('__ORDER__ c', 'b.order_id =c.id', 'LEFT')
                    ->field('a.*,b.order_id,b.pro_num,c.year,c.num,c.client_id')
                    ->where($where)
                    ->order('a.id desc')
                    ->select();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }
}
