<?php

namespace app\myes\controller;

use cmf\controller\AdminBaseController;
use app\yes\model\OrderProductModel;
use app\yes\model\OrderModel;
use think\Db;

class LoginController extends AdminBaseController
{
    public function initialize()
    {
    }

    /**
     * 后台登陆界面
     */
    public function index()
    {
        $loginAllowed = session("__LOGIN_BY_CMF_ADMIN_PW__");
        if (empty($loginAllowed)) {
            //$this->error('非法登录!', cmf_get_root() . '/');
            return redirect(cmf_get_root() . "/");
        }

        $admin_id = session('ADMIN_ID');
        if (!empty($admin_id)) {//已经登录
            return redirect(url("yes/Index/index"));
        } else {
            session("__SP_ADMIN_LOGIN_PAGE_SHOWED_SUCCESS__", true);
            $result = hook_one('admin_login');
            if (!empty($result)) {
                return $result;
            }
            $this->assign("csspass", time());
            return $this->fetch("index");
        }
    }

    /**
     * 登录验证
     */
    public function doLogin()
    {
        session("__LOGIN_BY_CMF_ADMIN_PW__", 1);
        if (hook_one('admin_custom_login_open')) {
            $this->error('您已经通过插件自定义后台登录！');
        }

        $loginAllowed = session("__LOGIN_BY_CMF_ADMIN_PW__");
        if (empty($loginAllowed)) {
            $this->error('非法登录!', cmf_get_root() . '/');
        }

        // $captcha = $this->request->param('captcha');
        // if (empty($captcha)) {
        //     $this->error(lang('CAPTCHA_REQUIRED'));
        // }
        //验证码
        // if (!cmf_captcha_check($captcha)) {
        //     $this->error(lang('CAPTCHA_NOT_RIGHT'));
        // }

        $name = $this->request->param("username");
        if (empty($name)) {
            $this->error(lang('USERNAME_OR_EMAIL_EMPTY'));
        }
        $pass = $this->request->param("password");
        if (empty($pass)) {
            $this->error(lang('PASSWORD_REQUIRED'));
        }
        if (strpos($name, "@") > 0) {//邮箱登陆
            $where['user_email'] = $name;
        } else {
            $where['user_login'] = $name;
        }

        $result = Db::name('user')->where($where)->find();

        if (!empty($result) && $result['user_type'] == 1) {
            if (cmf_compare_password($pass, $result['user_pass'])) {
                $groups = Db::name('RoleUser')
                    ->alias("a")
                    ->join('__ROLE__ b', 'a.role_id =b.id')
                    ->where(["user_id" => $result["id"], "status" => 1])
                    ->value("role_id");
                if ($result["id"] != 1 && (empty($groups) || empty($result['user_status']))) {
                    $this->error(lang('USE_DISABLED'));
                }
                //登入成功页面跳转
                session('ADMIN_ID', $result["id"]);
                session('name', $result["user_login"]);
                $result['last_login_ip']   = get_client_ip(0, true);
                $result['last_login_time'] = time();
                $token                     = cmf_generate_user_token($result["id"], 'web');
                if (!empty($token)) {
                    session('token', $token);
                }
                Db::name('user')->update($result);
                cookie("admin_username", $name, 3600 * 24 * 30);
                session("__LOGIN_BY_CMF_ADMIN_PW__", null);
                $this->success(lang('LOGIN_SUCCESS'), url("myes/Index/index"));
            } else {
                $this->error(lang('PASSWORD_NOT_RIGHT'));
            }
        } else {
            $this->error(lang('USERNAME_NOT_EXIST'));
        }
    }

    /**
     * 后台管理员退出
     */
    public function logout()
    {
        session('ADMIN_ID', null);
        return redirect(url('yes/index/index', [], false, true));
    }

    public function checkmacth()
    {
        $loginAllowed = session("__LOGIN_BY_CMF_ADMIN_PW__");
        if (empty($loginAllowed)) {
            $this->error('非法登录!', cmf_get_root() . '/');
        }
        
        if (!empty($_COOKIE['worker_id'])) {
            return redirect(url('myes/Login/macth', [], false, true));
        }
        $this->assign("csspass", time());
        return $this->fetch('checkmacth');
    }

    public function workerdoLogin()
    {
        session("__LOGIN_BY_CMF_ADMIN_PW__", 1);

        $loginAllowed = session("__LOGIN_BY_CMF_ADMIN_PW__");
        if (empty($loginAllowed)) {
            $this->error('非法登录!', cmf_get_root() . '/');
        }

        $name = $this->request->param("worker_id");
        if (empty($name)) {
            $this->error('请输入工号');
        }
        $starstr = substr($this->request->param("worker_id"), 0, 4);
        $endstr = substr($this->request->param("worker_id"), -2);
        // halt($endstr);
        if ($starstr != '1259' || $endstr != '20') {
            $this->error('工号错误');
        }

        $domain  =  substr($this->request->param("worker_id"), 0, -2);
        $domain2  =  substr($domain, 4);
        $result = Db::name('worker')->where('id', intval($domain2))->find();
        if (!empty($result)) {
            cookie("worker_id", $name, 3600 * 24 * 30);
            $this->success(url("myes/Login/macth"));
        } else {
            $this->error('工号错误');
        }
    }

    public function macth()
    {
        $order = new OrderModel;
        $year = $order->Distinct(true)->field('year')->select();
        $this->assign('year', $year);
        $this->assign("csspass", time());

        $work_type = Db::name('work_type')->Distinct(true)->field('name,id')->select();
        $this->assign('work_type', $work_type);
        $worker_name = Db::name('worker')->field('name,id')->select();
        $this->assign('worker_name', $worker_name);
        return $this->fetch('macth');
    }

    // 搜索
    public function macthsearchlst()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $where = array_filter($this->request->param());
            unset($where['page']);
            unset($where['limit']);
            if (isset($where['year'])) {
                $where['e.year'] = $where['year'];
                unset($where['year']);
            };
            if (isset($where['m_year'])) {
                $where['a.year'] = $where['m_year'];
                unset($where['m_year']);
            };

            $domain  =  substr($_COOKIE['worker_id'], 0, -2);
            $domain2  =  substr($domain, 4);
            $where['a.worker_id'] = intval($domain2);

            if (isset($where['product_id'])) {
                $where['a.product_id'] = $where['product_id'];
                unset($where['product_id']);
            };

            $result = Db::name('match')
                        ->alias("a")
                        ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                        ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                        ->field('a.*,sum(a.num) as num,b.name,e.year as order_year,e.num as order_num,b.work_id,d.pro_num,d.img')
                        ->where($where)
                        ->page($page, $limit)
                        ->group('d.id,a.month,a.year')
                        ->order('a.id desc')
                        ->select();

            $count = Db::name('match')
                        ->alias("a")
                        ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                        ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                        ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                        ->where($where)
                        ->group('d.id,a.month,a.year')
                        ->order('a.id desc')
                        ->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }
    public function macthlogout()
    {
        cookie("worker_id", null);
        return redirect(url('myes/login/checkmacth', [], false, true));
    }
    // 获取生产单
    public function getordernum()
    {
        if ($this->request->isPost()) {
            $where = array_filter($this->request->param());
            $order = new OrderModel;
            $order_list = $order->where($where)->field('num,id as order_id')->order('id desc')->select();
            return $order_list;
        }
    }
    
    // 获取产品id
    public function getproductnum()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id', 0, 'intval');
            $order = new OrderProductModel;
            $productnum = $order->where('order_id', $id)->field('pro_num,id as product_id')->select();
            return $productnum;
        }
    }

    public function tasksearchlst()
    {
        // 获取分页数据
        $page = $this->request->param('page');
        $limit = $this->request->param('limit');
        $where = array_filter($this->request->param());
        unset($where['page']);
        unset($where['limit']);
    
        $where2=[];

        $domain  =  substr($_COOKIE['worker_id'], 0, -2);
        $domain2  =  substr($domain, 4);
        $where['a.worker_id'] = intval($domain2);

        if (isset($where['order_id'])) {
            $where['e.id'] = $where['order_id'];
            unset($where['order_id']);
        };
    
        if (isset($where['product_id'])) {
            $where['a.product_id'] = $where['product_id'];
            unset($where['product_id']);
        };

        if (isset($where['state'])) {
            $where2['a.state'] = $where['state'];
            unset($where['state']);
        } elseif (isset($where['detail'])) {
            unset($where['detail']);
        } else {
            $where2= [['a.state', 'neq', '1']];
            unset($where['state']);
        };

        $result = Db::name('task')
                            ->alias("a")
                            ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                            ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                            ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                            ->join('__WORK_TYPE__ f', 'b.work_id = f.id', 'LEFT')
                            ->field('a.*,sum(a.num) as num,b.name,e.year as order_year,e.num as order_num,b.work_id,d.pro_num,d.img,d.amount,f.name as work_name')
                            ->where($where)
                            ->where($where2)
                            ->page($page, $limit)
                            ->group('a.id')
                            ->order('e.year desc,e.num desc')
                            ->select()
                            ->toArray();

        $count = Db::name('task')
                            ->alias("a")
                            ->join('__WORKER__ b', 'a.worker_id =b.id', 'LEFT')
                            ->join('__ORDER_PRODUCT__ d', 'a.product_id = d.id', 'LEFT')
                            ->join('__ORDER__ e', 'd.order_id = e.id', 'LEFT')
                            ->where($where)
                            ->where($where2)
                            ->group('a.id')
                            ->order('a.id desc')
                            ->count();
        $data["data"]=$result;
        $data["code"]=0;
        $data["msg"]='';
        $data["count"]=$count;
        return $data;
    }


    public function product()
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
            $this->assign("csspass", time());
            return $this->fetch('product');
        }
    }
}
