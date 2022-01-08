<?php
declare(strict_types = 1);

namespace app\controller;

use think\facade\Db;
use think\facade\Request;

class Shop
{
    public function lst()
    {
        if (request()->method()=='POST') {
            $pageSize= request()->post('pageSize')?request()->post('pageSize'):10;
            $pageIndex= request()->post('pageIndex')?request()->post('pageIndex'):1;
            $ordername= request()->post('filter.ordername');
            $orderdtae= request()->post('filter.orderdtae');
            $ordernum= request()->post('filter.ordernum');
            $orderstate= request()->post('filter.orderstate');

            $sort['a.date']='desc';

            if (!empty($orderdtae)) {
                $where[]=['a.date','between time',[$orderdtae[0],$orderdtae[1]]];
            }
            if (!empty($ordername)) {
                $where[]=['b.name','in',$ordername];
            }
            if (!empty($ordernum)) {
                $where[]=['b.num','in',$ordernum];
            }
            if (!empty($orderstate)) {
                $orderstate==='0'?null:$where[]=['a.state','=',$orderstate];
            }

            if (strpos($_SERVER['HTTP_USER_AGENT'], 'wechat') !== false) {
                $shopname= request()->post('filter.shopname');
                $shopid= request()->post('shopid');
                $shopids= request()->post('shopids');
                $relate= request()->post('orderid');
                $peopleid=request()->post('peopleid');
                $expense=request()->post('expense');

                !empty($shopids)?$where[]=['a.id','in',$shopids]:null;
                !empty($peopleid)?$where[]=['a.people','=',$peopleid]:null;
                !empty($expense)?$where[]=['a.expense','=',$expense]:null;
                !empty($shopname)?$where[]=['a.detail->name','like','%'.$shopname.'%']:null;
                !empty($shopid)?$where[]=['a.id','=',$shopid]:null;
                if (!empty($relate)) {
                    $where[]=['a.relate','=',$relate];
                }
            }

            $sql =
            Db::name('shop')
            ->alias("a")
            ->join('order b', 'a.relate =b.id', 'LEFT')
            ->join('people c', 'a.people =c.id', 'LEFT')
            ->join('people d', 'a.passpeople =d.id', 'LEFT')
            ->join('people e', 'a.getpeople =e.id', 'LEFT')
            ->field('a.*,b.name,b.num,c.name as s_name,d.name as passname,e.name as getname')
            ->where(isset($where)?$where:[]);

            $result = $sql
            ->json(['detail'])
            ->order($sort)
            ->paginate(['list_rows'=>$pageSize,'page'=>$pageIndex]);

            $ret = [];
            if ($result) {
                foreach ($result->items() as $a) {
                    $a['pic']?$pic = explode(",", $a['pic']):$pic=$a['pic'];
                    // $a['transform']?$transform = explode(",", $a['transform']):$transform=$a['transform'];
                    $a['num']?$relate =$a['num'].'-'.$a['name']:$relate='库存';
                    $array = [
                        "id"     => $a['id'],
                        "p_id"     => $a['people'],
                        "name"   => $a['detail']['name'],
                        "size"   => $a['detail']['size'],
                        "num"   => $a['detail']['num'].$a['detail']['unit'],
                        "remark"   => $a['detail']['remark']?$a['detail']['remark']:'',
                        "people"   => $a['s_name'],
                        "relate"   => $relate,
                        "date"   => $a['date'],
                        "getdate"   => $a['getdate'],
                        "act_num"   => $a['act_num']?$a['act_num'].$a['act_unit']:'- -',
                        // "pic"   => $pic,
                        // "transform"   => $transform,
                        "state"   => $a['state'],
                    ];
                    if (strpos($_SERVER['HTTP_USER_AGENT'], 'wechat') !== false) {
                        $a['pic']?$pic = explode(",", $a['pic']):$pic=[];
                        $a['shop_pic']?$shop_pic = explode(",", $a['shop_pic']):$shop_pic=[];

                        $array['getpeople']=$a['getname']?$a['getname']:"   ";
                        $array['passpeople']=$a['passname']?$a['passname']:"   ";
                        $array['a_num']=$a['detail']['num']?$a['detail']['num']:"   ";
                        $array['unit']=$a['detail']['unit']?$a['detail']['unit']:"   ";
                        $array['act_unit']=$a['act_unit']?$a['act_unit']:null;
                        $array['act_num']=$a['act_num']?$a['act_num']:null;
                        $array['type']=$a['type']?$a['type']:null;
                        $array['relateid']=$a['relate'];
                        $array['price']=$a['price']?$a['price']:'';
                        $array['peopleid']=$a['people']?$a['people']:null;
                        $array['pic']=$pic;
                        $array['shop_pic']=$shop_pic;

                        $array['steps']=[['text'=>'下单','desc'=>date("Y-m-d", strtotime($a['date']))],['text'=>'审核','desc'=>$a['passdate']?date("Y-m-d", strtotime($a['passdate'])):'暂无'],['text'=>'签收','desc'=>$a['getdate']?date("Y-m-d", strtotime($a['getdate'])):'暂无']];
                    }
                    $ret[]=$array;
                };
            }
            return $result?create($ret, '查询成功', 200, $result->total()):create($ret, '查询成功', 204);
        }
    }

    public function save()
    {
        if (request()->method()=='POST') {
            $data = request()->Post();
            $sql =Db::name('shop');
            $result = $sql->json(['detail'])->save($data);
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
            $sql = Db::name('shop');
            $id= request()->post('id');
            $result = $sql->where('id', 'in', $id)->delete();
            return $result?create([], '删除成功'):create([], '删除失败', 204);
        }
    }


    //发送模板消息提醒用户支付
    public function sendCmd($url, $data)
    {
        $curl = curl_init(); // 启动一个CURL会话
        curl_setopt($curl, CURLOPT_URL, $url); // 要访问的地址
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0); // 对认证证书来源的检测
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2); // 从证书中检查SSL加密算法是否存在
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Expect:')); //解决数据包大不能提交
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
        curl_setopt($curl, CURLOPT_AUTOREFERER, 1); // 自动设置Referer
        curl_setopt($curl, CURLOPT_POST, 1); // 发送一个常规的Post请求
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data); // Post提交的数据包
        // curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($curl, CURLOPT_TIMEOUT, 30); // 设置超时限制防止死循
        curl_setopt($curl, CURLOPT_HEADER, 0); // 显示返回的Header区域内容
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); // 获取的信息以文件流的形式返回
    
        $tmpInfo = curl_exec($curl); // 执行操作
        if (curl_errno($curl)) {
            echo 'Errno'.curl_error($curl);
        }
        curl_close($curl); // 关键CURL会话

        return $tmpInfo; // 返回数据
    }
    public function getmsg()
    {
        $formid=request()->post('formid');
        $appid='wx332b26121cc4817b';//填你的appid
        $appsecret='48dfa8205e79655c22af2c9fa5a5d90b';//填你的appsecret
        
        
        $url_access_token = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$appid.'&secret='.$appsecret;
        $json_access_token =$this->sendCmd($url_access_token, array());
        //access_token加缓存
        $arr_access_token = json_decode($json_access_token, true);
        $access_token = $arr_access_token['access_token'];
        $urls = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='.$access_token;
        $data = array(
            'touser' => 'opZr_0LeheQcIiAz4pnjQZc6nyAs',
            'template_id' => '2JBlk5J0LUk7xLqjQGTjbPeT7F26-_yEblNi_jZ1JoM',
            'miniprogram_state'=>'developer',
            'lang'=>'zh_CN',
            'data' => array(
                  "name1" => array("value"=>'ds'),
             
                  "thing4" => array( "value"=>'dfsf' ),
                     
                  "phrase3" => array("value" => '审核通过'),

                  "thing6" => array( "value" => 'dfs'),
                      
                  "date8" => array("value" => '2019-01-01'),
                       
                  )
        );
        $result = $this->sendCmd($urls, json_encode($data));
        return $result;
    }

    // 获取订单数量
    public function getshopcount()
    {
        if (request()->method()=='POST') {
            $shopname= request()->post('name');
            $peopleid= request()->post('peopleid');
            $peopleid?$peopleid=$peopleid:$peopleid=null;
            $result['count1']=$this->getcount($shopname, 1, $peopleid);
            $result['count2']=$this->getcount($shopname, 2, $peopleid);
            return json($result);
        }
    }
    // 获取完成订单数量 获取待发货订单数量
    public function getcount($shopname, $num, $peopleid=null)
    {
        $sql = Db::name('shop');
        $where=[];
        $where[]=['state','=',$num];
        $where[]=['detail->name','like','%'.$shopname.'%'];
        !empty($peopleid)?$where[]=['people','=',$peopleid]:null;
        $count= $sql->where($where)->count();
        return $count;
    }

    // 获取订单数量
    public function getexpensecount()
    {
        if (request()->method()=='POST') {
            $shopname= request()->post('name');
            $expense= request()->post('expense');

            $sql = Db::name('shop');
            $where=[];
            $where[]=['state','=',4];
            $where[]=['detail->name','like','%'.$shopname.'%'];
            !empty($expense)?$where[]=['expense','=',$expense]:null;

            $count= $sql->where($where)->count();

            $result['count1']=$count;
            return json($result);
        }
    }

    public function shopimg()
    {
        // 获取表单上传文件 例如上传了001.jpg
        $file = request()->file('file');
        // 上传到本地服务器
        $savename = \think\facade\Filesystem::disk('public')->putFile('topic', $file);
        $succes['url']=$savename;
        return json($succes);
    }
    // 通过审核
    public function passshop()
    {
        if (request()->method()=='POST') {
            $sql = Db::name('shop');
            $useid = $this->getuserid();
            if ($useid) {
                $ids=request()->post('id');
                $state=request()->post('state');
                $state?$state=$state:$state=2;
                $savename=request()->post('savename');
                $result = $sql->where('id', 'in', $ids)->update(['state' => $state,'passpeople' => $useid,'sign_pic' => $savename,'passdate'=>date('Y-m-d H:i:s', time())]);
                $succes['msg']='成功';
                $eorro['msg']='失败';
                return $result?json($succes):json($eorro);
            }
            return '用户错误';
        }
    }
    // 收货
    public function getshop()
    {
        if (request()->method()=='POST') {
            $sql = Db::name('shop');
            $useid = $this->getuserid();
            if ($useid) {
                $ids=request()->post('id');
                $savename=request()->post('savename');
                $result = $sql->where('id', 'in', $ids)->update(['state' => '4','getpeople' => $useid,'getsign_pic' => $savename,'getdate'=>date('Y-m-d H:i:s', time())]);
                $succes['msg']='成功';
                $eorro['msg']='失败';
                return $result?json($succes):json($eorro);
            }
            return '用户错误';
        }
    }
    // 获取当前用户id
    public function getuserid()
    {
        $puttoken = Request::instance()->header('token');
        $sql = Db::name('people');
        $id = $sql->where('x_token', $puttoken)->value('id');
        if ($id) {
            return $id;
        }
        return false;
    }

    public function deloneimg()
    {
        $delurl=request()->post('imgurl');
        $delurl = app()->getRootPath().'/public/storage/'.$delurl;
        if (file_exists($delurl)) {
            @unlink($delurl);
            $succes['msg']='成功';
            return json($succes);
        }
    }
}
