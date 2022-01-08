<?php
declare(strict_types = 1);

namespace app\controller;

use think\facade\Db;
use think\Request;

class Resource
{
    // 获取文章数据
    public function getlst()
    {
        if (request()->method()=='POST') {
            $pageSize= request()->post('pageSize')?request()->post('pageSize'):10;
            $pageIndex= request()->post('pageIndex')?request()->post('pageIndex'):1;
            $tags= request()->post('tags');
            $value= request()->post('value');
            $where=[];
            if (!empty($tags)) {
                $where[]=['tag','=',$tags];
            }
            if (!empty($value)) {
                $where[]=['title','like','%'.$value.'%'];
            }
            $result=Db::name('resource')->where($where)->paginate(['list_rows'=>$pageSize,'page'=>$pageIndex]);
            $ret=[];
            return create($result->items(), '查询成功', 200, $result->total());
        }
    }
    // 上传文件
    public function upfile()
    {
        if (request()->method()=='POST') {
            $data['title']=request()->post('title');
            $data['tag']=request()->post('tag');
            $data['url']=request()->post('key');
            $result=Db::name('resource')->save($data);
            return $result?create([], '上传成功', 200):create([], '上传失败', 202);
        }
    }

    // 改变标题
    public function changetitle()
    {
        if (request()->method()=='POST') {
            $id=request()->post('id');
            $title=request()->post('title');
            $result=Db::name('resource')->where('id', $id)->save(['title' => $title]);
            return $result?create([], '修改成功', 200):create([], '修改失败', 202);
        }
    }

    // 改变tag
    public function changetag()
    {
        if (request()->method()=='POST') {
            $id=request()->post('id');
            $tag=request()->post('tag');
            $result=Db::name('resource')->where('id', $id)->save(['tag' => $tag]);
            return $result?create([], '修改成功', 200):create([], '修改失败', 202);
        }
    }
    // 删除资源
    public function dellst()
    {
        if (request()->method()=='POST') {
            $id=request()->post('id');
            $url=request()->post('url');
            $del=app('file')->del($url);
            if ($del) {
                $result=Db::name('resource')->delete($id);
                return $result?create([], '删除成功', 200):create([], '删除失败', 202);
            } else {
                return create([], '删除失败', 202);
            }
        }
    }
    // 下载文件
    public function downfile()
    {
        if (request()->method()=='POST') {
            $url=request()->post('url');
            $file_dir=app('file')->getdownurl($url);
            return $file_dir;
        }
    }

    // 获取七牛云上传token
    public function gettoken()
    {
        if (request()->method()=='POST') {
            $ret=app('file')->gettoken();
            return $ret;
        }
    }
}
