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
            return $result?create($ret, '????????????',200, $result->total()):create([], '????????????', 204);
            
        }
    }

    public function save()
    {
        if (request()->method()=='POST') {
            $data = request()->Post();
            $sql =Db::name('people');
            $result = $sql->json(['detail'])->save($data);
            return $result?create([], '????????????'):create([], '????????????',204);
        }
    }

    //???????????????????????????????????????
    public function getname()
    {
        if (request()->method()=='POST') {
            $sql = Db::name('people');
            $value = request()->post('name');
            $where[]=['name','like','%'.$value.'%'];
            $result = $sql->Distinct(true)->where($where)->column('name');
            return $result?create($result, '????????????'):create([], '????????????', 204);
        }
    }

    // ????????????
    // 1.???????????????openid,
    //????????????????????????????????????????????????
    //?????????openid???????????????????????????token????????????????????????????????????????????????????????????
    public function login()
    {
        if (request()->method()=='POST') {
            $code=request()->post('code');
            $data['name']=request()->post('name');
            $data['iphone']=request()->post('iphone');
            $data['class']=request()->post('class');
            
            $appid="wx332b26121cc4817b"; //?????????appid
            $secret="48dfa8205e79655c22af2c9fa5a5d90b";  //?????????secret
            $api="https://api.weixin.qq.com/sns/jscode2session?appid={$appid}&secret={$secret}&js_code={$code}&grant_type=authorization_code";  //????????????????????????????????????????????????

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
            if ($getopenidnum) {//???????????????????????????
                $token=$getopenidnum['x_token'];
                $puttoken = Request::instance()->header('token');
                if ($token===$puttoken&&!empty($token)&&!empty($puttoken)) {//???token?????????
                    if ($getopenidnum['state']==='1') {//???????????????
                        $result['data']=$getopenidnum;
                        unset($result['data']['openid']);
                        $result['code']='202';
                        $result['msg']='?????????';
                    } else {//????????????
                        $result['token']=$token;
                        $result['peopleid']=$getopenidnum['id'];
                        $result['username']=$getopenidnum['name'];
                        $result['code']='200';
                        $result['msg']='????????????';
                    }
                } else {//??????token
                    $result['code']='404';
                    $result['msg']='????????????';
                }
            } else {//??????????????????????????????
                if ($data['name']) {//??????????????????????????????????????????????????????
                    $insertGetId = $sql->insertGetId($data);
                    if ($insertGetId) {//?????????????????????
                        session('adminId', $insertGetId);
                        $gettoken = $this->maketoken();
                        $instetoken = $sql->where('id', $insertGetId)->save(['x_token' =>$gettoken ]);
                        if ($instetoken) {
                            $result['token']=$gettoken;
                            $result['peopleid']=$insertGetId;
                            $result['username']=$data['name'];
                            $result['code']='200';
                            $result['msg']='????????????';
                        } else {
                            $result['code']='404';
                            $result['msg']='????????????????????????';
                        }
                    } else {//????????????????????????
                        $result['code']='404';
                        $result['msg']='????????????';
                    }
                } else {//??????????????????????????????????????????????????????
                    $result['code']='404';
                    $result['msg']='????????????';
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


    // ??????????????????id
    public function getuser()
    {
        $puttoken = Request::instance()->header('token');
        $sql = Db::name('people');
        $info = $sql->where('x_token', $puttoken)->json(['detail'])->field('id,name,class,state,iphone,detail')->select();
        if ($info) {
            $info = $info[0];
            if ($info['class']=='1') {
                $info['class']='????????????';
            } elseif ($info['class']=='2') {
                $info['class']='????????????';
            } elseif ($info['class']=='3') {
                $info['class']='????????????';
            } elseif ($info['class']=='4') {
                $info['class']='????????????';
            } elseif ($info['class']=='5') {
                $info['class']='????????????';
            } elseif ($info['class']=='6') {
                $info['class']='???????????????';
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
