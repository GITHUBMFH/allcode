<?php
declare(strict_types = 1);

namespace app\controller;

use think\facade\Db;
use think\Request;

class product
{
    /**
     * 显示资源列表
     *
     * @return \think\Response
     */
    public function lst()
    {
        if (request()->method()=='POST') {
            $id= request()->post('id');
            $sql =Db::name('product');
            $where[]=['order_id','=',$id];
            $result = $sql->json(['detail'])->where($where)->select();
            
            $ret = [];
            if ($result) {
                foreach ($result as $key => $a) {
                    $a['pic']?$pic = explode(",", $a['pic']):$pic=$a['pic'];
                    $array = [
                        "id"     => $a['id'],
                        "order"     => $key+1,
                        "pic"   => $pic,
                        "area"   => $a['detail']['area'],
                        "m_num"   => $a['detail']['m_num'],
                        "name"   => $a['detail']['name'],
                        "size"   => $a['detail']['size'],
                        "num"   => $a['detail']['num'],
                        "unit"   => $a['detail']['unit'],
                        "remark"   => $a['detail']['remark'],
                        "state"   => $a['state'],
                    ];
                    if (strpos($_SERVER['HTTP_USER_AGENT'], 'wechat') !== false) {
                        $a['tag']?$tag = explode(",", $a['tag']):$tag=[];
                        $array['tag']=$tag;
                    }
                    $ret[]=$array;
                };
            }
            return $result?create($ret, '查询成功'):create([], '查询失败', 204);
        }
    }

    public function save()
    {
        if (request()->method()=='POST') {
            $data = request()->Post();
            $sql =Db::name('product');
            $result = $sql->json(['detail'])->save($data);
            return $result?create([], '添加成功'):create([], '添加失败', 204);
        }
    }

    public function saveall()
    {
        if (request()->method()=='POST') {
            $data = request()->Post();
            $sql =Db::name('product');
            $result = $sql->json(['detail'])->insertAll($data);
            return $result?create([], '添加成功'):create([], '添加失败', 204);
        }
    }

    public function upload($id)
    {
        // 获取表单上传文件 例如上传了001.jpg
        $file = request()->file('file');
        // 上传到本地服务器
        $savename = \think\facade\Filesystem::disk('public')->putFile('topic', $file);
        if ($savename) {
            $sql =Db::name('product');
            $where[]=['id','=',$id];
            $name = $sql->where($where)->value('pic');
            if ($name) {
                $savename = $name.','.$savename ;
            }
            $result=$sql->save(['id'=>$id,'pic'=>$savename]);
            return $result?create([], '上传成功'):create([], '上传失败', 204);
        }
    }

    public function delimg()
    {
        if (request()->method()=='POST') {
            $id=request()->post('id');
            $pic=request()->post('pic');
            $delurl=request()->post('delurl');
            $delurl = app()->getRootPath().'/public/storage/'.$delurl;
            if (file_exists($delurl)) {
                @unlink($delurl);
                $sql =Db::name('product');
                $result = $sql->save(['id' => $id, 'pic' => $pic]);
                return $result?create([], '删除成功'):create([], '删除失败', 204);
            }
        }
    }

    // 删除
    public function delete()
    {
        if (request()->method()=='POST') {
            $sql = Db::name('product');
            $id= request()->post('id');
            $imgs=$sql->where('id', 'in', $id)->column('pic');
            $imgs=array_filter($imgs);
            if (!empty($imgs)) {
                foreach ($imgs as $i) {
                    $lst=explode(",", $i);
                    foreach ($lst as $b) {
                        $delurl = app()->getRootPath().'/public/storage/'.$b;
                        if (file_exists($delurl)) {
                            @unlink($delurl);
                        }
                    }
                }
            }

            $result = $sql->where('id', 'in', $id)->delete();
            return $result?create([], '删除成功'):create([], '删除失败', 204);
        }
    }

    public function emptyexcel()
    {
        $exceltitle = [
            // 第一行
            ['A1','佛山市展辰酒店家具有限公司-生产订单','A',10],
            // 第二行
            ['A2','工令号:','A',10],
            ['D2','项目名称:','A',10],
            ['G2','下单日期:','A',10],
            // 第三行
            ['A3','序号','A',10,],
            ['B3','楼层区域','B',20,],
            ['C3','编号','C',10],
            ['D3','名称','D',20],
            ['E3','尺寸','E',30],
            ['F3','数量','F',10],
            ['G3','单位','G',10],
            ['H3','备注','H',30]
        ];
        $con = array(
            [1,'','','','','','',''],
            [2,'','','','','','',''],
            [3,'','','','','','',''],
            [4,'','','','','','',''],
            [5,'','','','','','',''],
            [6,'','','','','','',''],
            [7,'','','','','','',''],
            [8,'','','','','','',''],
            [9,'','','','','','',''],
            [10,'','','','','','',''],
        );
        $order=['','',''];
        return create([], downexcel($exceltitle, $con, $order));
    }
    // 下载文件
    public function downeexcel()
    {
        $filename=request()->param('filename');
        $file_dir=app()->getRootPath() . 'public/storage/'.$filename;
        downfile($file_dir,$filename);
    }
}
