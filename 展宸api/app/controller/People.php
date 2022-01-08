<?php
declare(strict_types = 1);

namespace app\controller;

use think\facade\Db;
use think\facade\Request;

class People
{
    public function lst()
    {
        if (request()->method()=='POST') {
            $pageSize= request()->post('pageSize')?request()->post('pageSize'):10;
            $pageIndex= request()->post('pageIndex')?request()->post('pageIndex'):1;
            $peopelname= request()->post('filter.peopelname');
            $peopleclass= request()->post('filter.peopleclass');
            $peoplestate= request()->post('filter.peoplestate');

            $sort['id']='desc';
            if (!empty($peopelname)) {
                $where[]=['name','in',$peopelname];
            }
            if (!empty($peopleclass)) {
                $peopleclass==='0'?null:$where[]=['class','=',$peopleclass];
            }
            if (!empty($peoplestate)) {
                $peoplestate==='0'?null:$where[]=['state','=',$peoplestate];
            }

            $sql = Db::name('people')->where(isset($where)?$where:[]);
            $result = $sql
            ->json(['detail'])
            ->order($sort)
            ->paginate(['list_rows'=>$pageSize,'page'=>$pageIndex]);
            
            $ret = [];
            if ($result) {
                foreach ($result->items() as $a) {
                    $array = [
                        "id"     => $a['id'],
                        "name"   => $a['name'],
                        "class"   => $a['class'],
                        "card_id"   => $a['detail']['card_id']?$a['detail']['card_id']:'- -',
                        "bank"   =>$a['detail']['bank']?$a['detail']['bank_num']."(".$a['detail']['bank'].')'."[".$a['detail']['bank_name'].']':'- -',
                        "wage"   => $a['detail']['wage']?$a['detail']['wage']:'- -',
                        "auth"   => $a['auth'],
                        "state"   => $a['state'],
                    ];
                    if (strpos($_SERVER['HTTP_USER_AGENT'], 'wechat') !== false) {
                        $array['iphone']=$a['iphone']?$a['iphone']:"   ";
                    }
                    $ret[]=$array;
                };
            }
            return $result?create($ret, '查询成功',200, $result->total()):create([], '查询失败', 204);
            
        }
    }

    public function save()
    {
        if (request()->method()=='POST') {
            $data = request()->Post();
            $sql =Db::name('people');
            $result = $sql->json(['detail'])->save($data);
            return $result?create([], '添加成功'):create([], '添加失败',204);
        }
    }

    //搜索查询的时候获得项目名称
    public function getname()
    {
        if (request()->method()=='POST') {
            $sql = Db::name('people');
            $value = request()->post('name');
            $where[]=['name','like','%'.$value.'%'];
            $result = $sql->Distinct(true)->where($where)->column('name');
            return $result?create($result, '查询成功'):create([], '查询失败', 204);
        }
    }

    // 微信登录
    // 1.判断是否有openid,
    //如果没有跳转到注册页面注册新用户
    //如果有openid检查是否有传合法的token，没有就跳转到登录页面，合法就跳转到首页
    public function login()
    {
        if (request()->method()=='POST') {
            $code=request()->post('code');
            $data['name']=request()->post('name');
            $data['iphone']=request()->post('iphone');
            $data['class']=request()->post('class');
            
            $appid="wx332b26121cc4817b"; //自己的appid
            $secret="48dfa8205e79655c22af2c9fa5a5d90b";  //自己的secret
            $api="https://api.weixin.qq.com/sns/jscode2session?appid={$appid}&secret={$secret}&js_code={$code}&grant_type=authorization_code";  //可去小程序开发文档中查看这个链接

            $curl=curl_init();
            curl_setopt($curl, CURLOPT_HEADER, false);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_TIMEOUT, 500);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            curl_setopt($curl, CURLOPT_URL, $api);
    
            $json= curl_exec($curl);
            curl_close($curl);
            $json = json_decode($json);
            $res = get_object_vars($json);
    
            $data['openid'] = $res['openid'];
            $sql = Db::name('people');
            $getopenidnum = $sql->where('openid', $data['openid'])->find();
            if ($getopenidnum) {//数据库中有这个用户
                $token=$getopenidnum['x_token'];
                $puttoken = Request::instance()->header('token');
                if ($token===$puttoken&&!empty($token)&&!empty($puttoken)) {//有token的情况
                    if ($getopenidnum['state']==='1') {//用户审核中
                        $result['data']=$getopenidnum;
                        unset($result['data']['openid']);
                        $result['code']='202';
                        $result['msg']='审核中';
                    } else {//登录成功
                        $result['token']=$token;
                        $result['peopleid']=$getopenidnum['id'];
                        $result['username']=$getopenidnum['name'];
                        $result['code']='200';
                        $result['msg']='验证成功';
                    }
                } else {//没有token
                    $result['code']='404';
                    $result['msg']='验证失败';
                }
            } else {//数据库中没有这个用户
                if ($data['name']) {//如果有客户的基本信息（注册页面验证）
                    $insertGetId = $sql->insertGetId($data);
                    if ($insertGetId) {//成功插入数据库
                        session('adminId', $insertGetId);
                        $gettoken = $this->maketoken();
                        $instetoken = $sql->where('id', $insertGetId)->save(['x_token' =>$gettoken ]);
                        if ($instetoken) {
                            $result['token']=$gettoken;
                            $result['peopleid']=$insertGetId;
                            $result['username']=$data['name'];
                            $result['code']='200';
                            $result['msg']='注册成功';
                        } else {
                            $result['code']='404';
                            $result['msg']='验证数据写入失败';
                        }
                    } else {//客户信息插入失败
                        $result['code']='404';
                        $result['msg']='注册失败';
                    }
                } else {//没有客户的基本信息（程序进入时验证）
                    $result['code']='404';
                    $result['msg']='请先注册';
                }
            }
        }
        return json($result);
    }
    

    public function maketoken()
    {
        $str = md5(uniqid(md5(microtime())), true);
        $str=sha1($str);
        return $str;
    }


    // 获取当前用户id
    public function getuser()
    {
        $puttoken = Request::instance()->header('token');
        $sql = Db::name('people');
        $info = $sql->where('x_token', $puttoken)->json(['detail'])->field('id,name,class,state,iphone,detail')->select();
        if ($info) {
            $info = $info[0];
            if ($info['class']=='1') {
                $info['class']='板式部门';
            } elseif ($info['class']=='2') {
                $info['class']='实木部门';
            } elseif ($info['class']=='3') {
                $info['class']='油漆部门';
            } elseif ($info['class']=='4') {
                $info['class']='沙发部门';
            } elseif ($info['class']=='5') {
                $info['class']='包装部门';
            } elseif ($info['class']=='6') {
                $info['class']='办公室部门';
            }

            $result['data']=$info;
            $info['detail']['card_id']?$result['data']['card_id']=$info['detail']['card_id']:$result['data']['card_id']='';
            $info['detail']['bank']?$result['data']['bank']=$info['detail']['bank']:$result['data']['bank']='';
            $info['detail']['bank_name']?$result['data']['bank_name']=$info['detail']['bank_name']:$result['data']['bank_name']='';
            $info['detail']['bank_num']?$result['data']['bank_num']=$info['detail']['bank_num']:$result['data']['bank_num']='';
            $info['detail']['wage']?$result['data']['wage']=$info['detail']['wage']:$result['data']['wage']='';
            return json($result);
        }
        return false;
    }
}
