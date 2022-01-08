<?php
declare(strict_types = 1);

namespace app\controller;

use think\facade\Db;

class Page
{
    // 获取文章数据
    public function getdiv()
    {
        if (request()->method()=='POST') {
            $pageSize= request()->post('pageSize')?request()->post('pageSize'):10;
            $pageIndex= request()->post('pageIndex')?request()->post('pageIndex'):1;
            $tags= request()->post('tags');
            $value= request()->post('value');
            $where=[];
            $whereor=[];
            if (!empty($tags)) {
                $where[]=['tag','=',$tags];
            }
            if (!empty($value)) {
                $whereor[]=['title','like','%'.$value.'%'];
                $bb=json_encode(array($value));
                $str = preg_replace("/^\[\"|\"\]$/", "", $bb);
                $keyword= str_replace("\\", "\\\\", $str);
                $whereor[]=['content','like',"%{$keyword}%"];
            }

            $result=Db::name('page')->where($where)->where(function ($query) use ($whereor) {
                $query->whereOr($whereor);
            })->order('id', 'desc')->paginate(['list_rows'=>$pageSize,'page'=>$pageIndex]);


            $ret=[];
            foreach ($result->items() as $a) {
                $array = [
                    "id"     => $a['id'],
                    "tag"     => $a['tag'],
                    "title"=>$a['title'],
                    "content"=>$a['content']?json_decode($a['content']):'',
                    "date"=>$a['date']
                ];
                $ret[]=$array;
            }
            return create($ret, '查询成功', 200, $result->total());
        }
    }

    // 保存文章数据
    public function savediv()
    {
        if (request()->method()=='POST') {
            $value = input('post.pagedata', '', null);
            $data['title']=request()->post('title');
            $data['tag']=request()->post('tag');
            $id=request()->post('id');
            if (!empty($value)) {
                $value = json_encode($value);
                $data['content']=$value;
            } else {
                $data['content']='';
            }
            $where=[];
            $id?$where[]=['id','=',$id]:null;
            $result=Db::name('page')->where($where)->save($data);
            return $result?create([], '修改成功', 200):create([], '修改失败', 202);
        }
    }
    // 删除page
    public function delpage()
    {
        if (request()->method()=='POST') {
            $id=request()->post('id');
            $result=Db::name('page')->delete($id);
            return $result?create([], '删除成功', 200):create([], '删除失败', 202);
        }
    }

    // 上传文件
    public function upfile()
    {
        if (request()->method()=='POST') {
            $file = $_FILES;
            $result=app('file')->upload($file);
            return $result;
        }
    }
    // 删除文件
    public function delfile()
    {
        if (request()->method()=='POST') {
            $name=request()->post('name');
            $result=app('file')->del($name);
            return $result?create([], '删除成功', 200):create([], '删除失败', 202);
        }
    }

    // 改变tag
    public function changetag()
    {
        if (request()->method()=='POST') {
            $id=request()->post('id');
            $tag=request()->post('tag');
            $result=Db::name('page')->where('id', $id)->save(['tag' => $tag]);
            return $result?create([], '修改成功', 200):create([], '修改失败', 202);
        }
    }
}
