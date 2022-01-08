<?php
// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2019 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 小夏 < 449134904@qq.com>
// +----------------------------------------------------------------------
namespace app\yes\controller;

use cmf\controller\AdminBaseController;
use think\Db;
use app\yes\model\AdminMenuModel;
use think\facade\Cache;

class IndexController extends AdminBaseController
{
    public function initialize()
    {
        $adminSettings = cmf_get_option('admin_settings');
        if (empty($adminSettings['admin_password']) || $this->request->path() == $adminSettings['admin_password']) {
            $adminId = cmf_get_current_admin_id();
            if (empty($adminId)) {
                session("__LOGIN_BY_CMF_ADMIN_PW__", 1);//设置后台登录加密码 // 不能直接从login/index的连接中进去，要先进入首页
            }
        }

        parent::initialize();
    }

    /**
     * 后台公共页面
     */
    public function index()
    {
        $adminMenuModel = new AdminMenuModel();
        $menus          = cache('admin_menus_' . cmf_get_current_admin_id(), '', null, 'admin_menus');

        if (empty($menus)) {
            $menus = $adminMenuModel->menuTree();
            cache('admin_menus_' . cmf_get_current_admin_id(), $menus, null, 'admin_menus');
        }
        
        $this->assign("menus", $menus);
        $this->assign("admin", cookie("admin_username"));
        return $this->fetch();
    }

    //首页
    public function yes()
    {
        return $this->fetch('data/yes');
    }

    public function vue()
    {
        return $this->fetch('vue/index');
    }
    
    //首页
    public function change_password()
    {
        if($this->request->isPost()){
            $pass = $this->request->param('old_password');
            $new_password = $this->request->param('new_password');
            $admin_id = session('ADMIN_ID');
            $result = Db::name('user')->where('id',$admin_id)->find();
            if (!empty($result) && $result['user_type'] == 1) {
                if (cmf_compare_password($pass, $result['user_pass'])) {
                    $res = Db::name('user')->where('id',$admin_id)->update(['user_pass' => cmf_password($new_password)]);
                    if($res){
                        session('ADMIN_ID', null);
                        $this->success('修改成功,请重新登录',"yes/Index/index",'3');
                    }else{
                        $this->error('修改失败');
                    }
                }else{
                    $this->error('密码不正确');
                }
            }else{
                $this->error('用户不存在');
            }
        }
    }

    //清除缓存
    public function clearCache()
    {
        if (!empty($content)) {
            return $content;
        }

        cmf_clear_cache();

        //清除钩子缓存
        $apps = cmf_scan_dir(APP_PATH . '*', GLOB_ONLYDIR);

        array_push($apps, 'cmf');

        foreach ($apps as $app) {
            if ($app == 'cmf') {
                $hookConfigFile = cmf_core_path() . 'hooks.php';
            } else {
                $hookConfigFile = APP_PATH . $app . '/hooks.php';
            }

            if (file_exists($hookConfigFile)) {
                $hooksInFile = include $hookConfigFile;

                foreach ($hooksInFile as $hookName => $hook) {
                    $hook['type'] = empty($hook['type']) ? 2 : $hook['type'];

                    if (!in_array($hook['type'], [2, 3, 4]) && $app != 'cmf') {
                        $hook['type'] = 2;
                    }

                    $findHook = Db::name('hook')->where('hook', $hookName)->count();

                    $hook['app'] = $app;

                    if ($findHook > 0) {
                        Db::name('hook')->where('hook', $hookName)->strict(false)->field(true)->update($hook);
                    } else {
                        $hook['hook'] = $hookName;
                        Db::name('hook')->insert($hook);
                    }
                }
            }
        }

        return $this->success('清除成功');
    }

    public function getproductdata()
    {
        if ($this->request->isPost()) {
            $num = $this->request->param('num');
            if (strpos($num, '-')) {
                $date = $this->getMonth($num);
            } else {
                $date = $this->getweeks($num);
            }
            $starttime = min($date);
            $endtime = max($date);
            $product['time']=$date;
            $getproduce=[];
            $getshipment=[];
            $getcost=[];
            $produce = Db::name('produce')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT_PRICE__ b', 'b.product_id =a.product_id', 'LEFT')
                    ->where('product_data', 'between time', [$starttime, $endtime])
                    ->field('a.product_data,sum(b.price*a.product_num) as amount')
                    ->group('a.product_data')
                    ->select();
            $shipment = Db::name('shipment')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT_PRICE__ b', 'b.product_id =a.product_id', 'LEFT')
                    ->where('shipment_data', 'between time', [$starttime, $endtime])
                    ->field('a.shipment_data,sum(b.price*a.shipment_num) as amount')
                    ->group('a.shipment_data')
                    ->select();
            $cost = Db::name('record')
                    ->where('data', 'between time', [$starttime, $endtime])
                    ->field('data,price as amount')
                    ->group('data')
                    ->select();
            foreach ($date as $key=>$vlaue) {
                foreach ($produce as $v) {
                    if ($vlaue==$v['product_data']) {
                        $getproduce[$key]=$v['amount'];
                        break;
                    } else {
                        $getproduce[$key]='0';
                    }
                }
            }
            foreach ($date as $key=>$vlaue) {
                foreach ($shipment as $v) {
                    if ($vlaue==$v['shipment_data']) {
                        $getshipment[$key]=$v['amount'];
                        break;
                    } else {
                        $getshipment[$key]='0';
                    }
                }
            }
            foreach ($date as $key=>$vlaue) {
                foreach ($cost as $v) {
                    if ($vlaue==$v['data']) {
                        $getcost[$key]=$v['amount'];
                        break;
                    } else {
                        $getcost[$key]='0';
                    }
                }
            }
            $product['produce']=$getproduce;
            $product['shipment']=$getshipment;
            $product['cost']=$getcost;
            return $product;
        }
    }

    /**
 * 获取最近七天所有日期
 */
    public function getweeks($num)
    {
        $time =time();
        $date = [];
        for ($i=1; $i<=$num; $i++) {
            $date[$i] = date('Y-m-d', strtotime('+' . $i-$num .' days', $time));
        }
        return $date;
    }

    //获取每月的天数
    public static function getMonth($time = '', $format='Y-m-d')
    {
        $time = $time != '' ? strtotime($time) : time();
        //获取当前月份的天数
        $week = date('d', $time);
        $date = [];
        for ($i=1; $i<= date('t', $time); $i++) {
            $date[$i] = date($format, strtotime('+' . $i-$week .' days', $time));
        }
        return $date;
    }

    //获取每年的月数
    public static function getYear($time = '', $format='Y-m')
    {
        $time = $time != '' ? strtotime($time.'-12') : time();
        $date = [];
        for ($i=1; $i<= 12; $i++) {
            $date[$i] = date($format, strtotime('+' . $i-12 .' months', $time));
        }
        return $date;
    }
    public function getmontydata()
    {
        if ($this->request->isPost()) {
            $num = $this->request->param('num');
            $date = $this->getYear($num);
            $datamonth = $this->getYear($num,'m');

            $starttime = min($date);
            $endtime = max($date);
            $getproduce=[];
            $getshipment=[];
            $getcost=[];
            $getwage=[];
            $getfinance=[];
            $produce = Db::name('produce')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT_PRICE__ b', 'b.product_id =a.product_id', 'LEFT')
                    ->where('product_data', 'like','%'.$num.'%')
                    ->field('sum(b.price*a.product_num) as amount,date_format(a.product_data,"%Y-%m") as month')
                    ->group('month')
                    ->select();
            $shipment = Db::name('shipment')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT_PRICE__ b', 'b.product_id =a.product_id', 'LEFT')
                    ->where('shipment_data', 'like','%'.$num.'%')
                    ->field('sum(a.shipment_num),sum(b.price*a.shipment_num) as amount,date_format(a.shipment_data,"%Y-%m") as month')
                    ->group('month')
                    ->select();
            $cost = Db::name('record')
                    ->where('data', 'like','%'.$num.'%')
                    ->field('sum(price) as amount,date_format(data,"%Y-%m") as month')
                    ->group('month')
                    ->select();
            $wage = Db::name('wage')
                    ->where('year',$num)
                    ->field('sum(wage) as amount,month')
                    ->group('month')
                    ->select();
            $finance = Db::name('finance')
                    ->where('data', 'like','%'.$num.'%')
                    ->where('type', 'client')
                    ->field('sum(price) amount,date_format(data,"%Y-%m") as month')
                    ->group('month')
                    ->select();
            foreach ($date as $key=>$vlaue) {
                foreach ($produce as $v) {
                    if ($vlaue==$v['month']) {
                        $getproduce[$key]=$v['amount'];
                        break;
                    } else {
                        $getproduce[$key]='0';
                    }
                }
            }
            foreach ($date as $key=>$vlaue) {
                foreach ($shipment as $v) {
                    if ($vlaue==$v['month']) {
                        $getshipment[$key]=$v['amount'];
                        break;
                    } else {
                        $getshipment[$key]='0';
                    }
                }
            }
            foreach ($date as $key=>$vlaue) {
                foreach ($cost as $v) {
                    if ($vlaue==$v['month']) {
                        $getcost[$key]=$v['amount'];
                        break;
                    } else {
                        $getcost[$key]='0';
                    }
                }
            }
            foreach ($datamonth as $key=>$vlaue) {
                foreach ($wage as $v) {
                    if (preg_replace ('/^0*/', '',$vlaue)==$v['month']) {
                        $getwage[$key]=$v['amount'];
                        break;
                    } else {
                        $getwage[$key]='0';
                    }
                }
            }
            foreach ($date as $key=>$vlaue) {
                foreach ($finance as $v) {
                    if ($vlaue==$v['month']) {
                        $getfinance[$key]=$v['amount'];
                        break;
                    } else {
                        $getfinance[$key]='0';
                    }
                }
            }
            $product['produce']=$getproduce;
            $product['shipment']=$getshipment;
            $product['cost']=$getcost;
            $product['wage']=$getwage;
            $product['time']=$date;
            $product['finance']=$getfinance;
            return $product;
        }
    }

    // 分析生产单
    public function getorderdata()
    {
        if ($this->request->isPost()) {
            $num = $this->request->param('num');
            $result = Db::name('produce')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT_PRICE__ b', 'b.product_id =a.product_id', 'LEFT')
                    ->join('__ORDER_PRODUCT__ c', 'c.id =a.product_id', 'LEFT')
                    ->join('__ORDER__ d', 'd.id =c.order_id', 'LEFT')
                    ->join('__CLIENT__ e', 'e.id =d.client_id', 'LEFT')
                    ->where('a.product_data', 'like','%'.$num.'%')
                    ->field(['sum(b.price*a.product_num) as amount','concat(e.s_name,"-",d.year,"-",d.num)'=>'order'])
                    ->group('d.id')
                    ->orderRaw('CONVERT( e.s_name USING gbk ) ASC')
                    ->select();
            return $result;
        }
    }

    // 分析客户
    public function getclientdata()
    {
        if ($this->request->isPost()) {
            $num = $this->request->param('num');
            $result = Db::name('produce')
                    ->alias("a")
                    ->join('__ORDER_PRODUCT_PRICE__ b', 'b.product_id =a.product_id', 'LEFT')
                    ->join('__ORDER_PRODUCT__ c', 'c.id =a.product_id', 'LEFT')
                    ->join('__ORDER__ d', 'd.id =c.order_id', 'LEFT')
                    ->join('__CLIENT__ e', 'e.id =d.client_id', 'LEFT')
                    ->where('a.product_data', 'like','%'.$num.'%')
                    ->field(['sum(b.price*a.product_num) as amount','e.s_name as client'])
                    ->group('e.id')
                    ->select();
            $togeter = Db::name('produce')
                        ->alias("a")
                        ->join('__ORDER_PRODUCT_PRICE__ b', 'b.product_id =a.product_id', 'LEFT')
                        ->where('a.product_data', 'like','%'.$num.'%')
                        ->sum('b.price*a.product_num');      
            $client['result'] = $result;
            $client['togeter'] = $togeter;
            return $client;
        }
    }
}
