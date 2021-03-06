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
                    $a['num']?$relate =$a['num'].'-'.$a['name']:$relate='??????';
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

                        $array['steps']=[['text'=>'??????','desc'=>date("Y-m-d", strtotime($a['date']))],['text'=>'??????','desc'=>$a['passdate']?date("Y-m-d", strtotime($a['passdate'])):'??????'],['text'=>'??????','desc'=>$a['getdate']?date("Y-m-d", strtotime($a['getdate'])):'??????']];
                    }
                    $ret[]=$array;
                };
            }
            return $result?create($ret, '????????????', 200, $result->total()):create($ret, '????????????', 204);
        }
    }

    public function save()
    {
        if (request()->method()=='POST') {
            $data = request()->Post();
            $sql =Db::name('shop');
            $result = $sql->json(['detail'])->save($data);
            return $result?create([], '????????????'):create([], '????????????', 204);
        }
    }

    public function upload($id)
    {
        // ???????????????????????? ???????????????001.jpg
        $file = request()->file('file');
        // ????????????????????????
        $savename = \think\facade\Filesystem::disk('public')->putFile('topic', $file);
        if ($savename) {
            $sql =Db::name('product');
            $where[]=['id','=',$id];
            $name = $sql->where($where)->value('pic');
            if ($name) {
                $savename = $name.','.$savename ;
            }
            $result=$sql->save(['id'=>$id,'pic'=>$savename]);
            return $result?create([], '????????????'):create([], '????????????', 204);
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
                return $result?create([], '????????????'):create([], '????????????', 204);
            }
        }
    }

    // ??????
    public function delete()
    {
        if (request()->method()=='POST') {
            $sql = Db::name('shop');
            $id= request()->post('id');
            $result = $sql->where('id', 'in', $id)->delete();
            return $result?create([], '????????????'):create([], '????????????', 204);
        }
    }


    //????????????????????????????????????
    public function sendCmd($url, $data)
    {
        $curl = curl_init(); // ????????????CURL??????
        curl_setopt($curl, CURLOPT_URL, $url); // ??????????????????
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0); // ??????????????????????????????
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2); // ??????????????????SSL????????????????????????
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Expect:')); //??????????????????????????????
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1); // ??????????????????
        curl_setopt($curl, CURLOPT_AUTOREFERER, 1); // ????????????Referer
        curl_setopt($curl, CURLOPT_POST, 1); // ?????????????????????Post??????
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data); // Post??????????????????
        // curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($curl, CURLOPT_TIMEOUT, 30); // ??????????????????????????????
        curl_setopt($curl, CURLOPT_HEADER, 0); // ???????????????Header????????????
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); // ??????????????????????????????????????????
    
        $tmpInfo = curl_exec($curl); // ????????????
        if (curl_errno($curl)) {
            echo 'Errno'.curl_error($curl);
        }
        curl_close($curl); // ??????CURL??????

        return $tmpInfo; // ????????????
    }
    public function getmsg()
    {
        $formid=request()->post('formid');
        $appid='wx332b26121cc4817b';//?????????appid
        $appsecret='48dfa8205e79655c22af2c9fa5a5d90b';//?????????appsecret
        
        
        $url_access_token = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$appid.'&secret='.$appsecret;
        $json_access_token =$this->sendCmd($url_access_token, array());
        //access_token?????????
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
                     
                  "phrase3" => array("value" => '????????????'),

                  "thing6" => array( "value" => 'dfs'),
                      
                  "date8" => array("value" => '2019-01-01'),
                       
                  )
        );
        $result = $this->sendCmd($urls, json_encode($data));
        return $result;
    }

    // ??????????????????
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
    // ???????????????????????? ???????????????????????????
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

    // ??????????????????
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
        // ???????????????????????? ???????????????001.jpg
        $file = request()->file('file');
        // ????????????????????????
        $savename = \think\facade\Filesystem::disk('public')->putFile('topic', $file);
        $succes['url']=$savename;
        return json($succes);
    }
    // ????????????
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
                $succes['msg']='??????';
                $eorro['msg']='??????';
                return $result?json($succes):json($eorro);
            }
            return '????????????';
        }
    }
    // ??????
    public function getshop()
    {
        if (request()->method()=='POST') {
            $sql = Db::name('shop');
            $useid = $this->getuserid();
            if ($useid) {
                $ids=request()->post('id');
                $savename=request()->post('savename');
                $result = $sql->where('id', 'in', $ids)->update(['state' => '4','getpeople' => $useid,'getsign_pic' => $savename,'getdate'=>date('Y-m-d H:i:s', time())]);
                $succes['msg']='??????';
                $eorro['msg']='??????';
                return $result?json($succes):json($eorro);
            }
            return '????????????';
        }
    }
    // ??????????????????id
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
            $succes['msg']='??????';
            return json($succes);
        }
    }
}
