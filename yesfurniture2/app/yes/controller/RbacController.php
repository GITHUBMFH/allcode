<?php

namespace app\yes\controller;

use cmf\controller\AdminBaseController;
use think\Db;
use think\facade\Cache;
use tree\Tree;
use app\admin\model\AdminMenuModel;

class RbacController extends AdminBaseController
{

    /**
     * 角色管理列表
     * @adminMenu(
     *     'name'   => '角色管理',
     *     'parent' => 'admin/User/default',
     *     'display'=> true,
     *     'hasView'=> true,
     *     'order'  => 10000,
     *     'icon'   => '',
     *     'remark' => '角色管理',
     *     'param'  => ''
     * )
     * @return mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function index()
    {
        $content = hook_one('admin_rbac_index_view');

        if (!empty($content)) {
            return $content;
        }
        if ($this->request->isPost()) {
            $result = Db::name('role')->order(["list_order" => "ASC", "id" => "DESC"])->select()->toArray();
            foreach ($result as &$vo) {
                $vo['create_time'] = date("Y年m月d日", $vo['create_time']);
                $vo['update_time'] = date("Y年m月d日", $vo['update_time']);
            }
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
        return $this->fetch();
    }

    /**
     * 添加角色提交
     * @adminMenu(
     *     'name'   => '添加角色提交',
     *     'parent' => 'index',
     *     'display'=> false,
     *     'hasView'=> false,
     *     'order'  => 10000,
     *     'icon'   => '',
     *     'remark' => '添加角色提交',
     *     'param'  => ''
     * )
     */
    public function roleAddPost()
    {
        if ($this->request->isPost()) {
            $data   = $this->request->param();
            $result = $this->validate($data, 'role');
            if ($result !== true) {
                // 验证失败 输出错误信息
                $this->error($result);
            } else {
                $result = Db::name('role')->insert($data);
                if ($result) {
                    $this->success("添加角色成功", url("rbac/index"));
                } else {
                    $this->error("添加角色失败");
                }
            }
        }
    }

    /**
     * 编辑角色提交
     * @adminMenu(
     *     'name'   => '编辑角色提交',
     *     'parent' => 'index',
     *     'display'=> false,
     *     'hasView'=> false,
     *     'order'  => 10000,
     *     'icon'   => '',
     *     'remark' => '编辑角色提交',
     *     'param'  => ''
     * )
     * @throws \think\Exception
     * @throws \think\exception\PDOException
     */
    public function roleEditPost()
    {
        $id = $this->request->param("id", 0, 'intval');
        if ($id == 1) {
            $this->error("超级管理员角色不能被修改！");
        }
        if ($this->request->isPost()) {
            $data   = $this->request->param();
            $result = $this->validate($data, 'role');
            if ($result !== true) {
                // 验证失败 输出错误信息
                $this->error($result);
            } else {
                if (Db::name('role')->update($data) !== false) {
                    $this->success("保存成功！");
                } else {
                    $this->error("保存失败！");
                }
            }
        }
    }

    /**
     * 删除角色
     * @adminMenu(
     *     'name'   => '删除角色',
     *     'parent' => 'index',
     *     'display'=> false,
     *     'hasView'=> false,
     *     'order'  => 10000,
     *     'icon'   => '',
     *     'remark' => '删除角色',
     *     'param'  => ''
     * )
     * @throws \think\Exception
     * @throws \think\exception\PDOException
     */
    public function roleDelete()
    {
        $id = $this->request->param("id", 0, 'intval');
        if ($id == 1) {
            $this->error("超级管理员角色不能被删除！");
        }
        $count = Db::name('RoleUser')->where('role_id', $id)->count();
        if ($count > 0) {
            $this->error("该角色已经有用户！");
        } else {
            $status = Db::name('role')->delete($id);
            if (!empty($status)) {
                $this->success("删除成功！", url('rbac/index'));
            } else {
                $this->error("删除失败！");
            }
        }
    }

    //获取用户有权限访问菜单的id
    public function authorize()
    {
        $content = hook_one('admin_rbac_authorize_view');

        if (!empty($content)) {
            return $content;
        }
        $gettreemenu = $this->gettree(0);
        if ($this->request->isPost()) {
            $AuthAccess     = Db::name("AuthAccess");
            //角色ID
            $roleId = $this->request->param("id", 0, 'intval');
            if (empty($roleId)) {
                $this->error("参数错误！");
            }
            
            $privilegeData = $AuthAccess->where("role_id", $roleId)->column("rule_name");
            $result_id = $this->eachmenu($gettreemenu, $privilegeData);
            return $result_id;
        }
    }

    // 循环所有菜单，并且筛选出有权限的id
    public function eachmenu($data, $privilegeData)
    {
        static $result_id=[];
        foreach ($data as $key =>$vlue) {
            if (isset($vlue['children'])) {
                $this->eachmenu($vlue['children'], $privilegeData);
            }
            if (in_array(strtolower($vlue['rule_name']), $privilegeData)&&
            strpos(strtolower($vlue['rule_name']),'none') == false
            ) {
                $result_id[]=$vlue['id'];
            }
        }
        return array_unique($result_id);
    }

    // 菜单缓存
    public function gettreemenu()
    {
        $gettreemenu = $this->gettree(0);
        return $gettreemenu;
    }

    //筛选所有菜单，并且对菜单进行字段整理
    public function gettree($myId, $lev='0')
    {
        // $menu = cache('gettreemenu');
        // if (empty($menu)) {
            $adminMenuModel = Db::name("AdminMenu");
            $result = $adminMenuModel->where('parent_id', $myId)->field(['id','name','parent_id','concat(app,"/",controller,"/",action)'=>'rule_name'])->select();
            $ret = [];
            $lev++;
            foreach ($result as $a) {
                $array = [
                    "id"     => $a['id'],
                    "title"   => $a['name'],
                    "rule_name"   => $a['rule_name'],
                    "lev"   => $lev,
                ];
                $child = $this->getTree($a['id'], $lev);
                // $child = $adminMenuModel->where('parent_id', $a['id'])->count();
                if (count($child)>0) {
                    $array['children'] = $this->getTree($a['id'], $lev);
                }
                $ret[]=$array;
            }
            cache('gettreemenu', $ret);
            return $ret;
        // }
        // return $menu;
    }

    /**
     * 角色授权提交
     * @adminMenu(
     *     'name'   => '角色授权提交',
     *     'parent' => 'index',
     *     'display'=> false,
     *     'hasView'=> false,
     *     'order'  => 10000,
     *     'icon'   => '',
     *     'remark' => '角色授权提交',
     *     'param'  => ''
     * )
     * @throws \think\Exception
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     * @throws \think\exception\PDOException
     */
    public function authorizePost()
    {
        if ($this->request->isPost()) {
            $roleId = $this->request->param("roleId", 0, 'intval');
            if (!$roleId) {
                $this->error("需要授权的角色不存在！");
            }
            Db::name("authAccess")->where(["role_id" => $roleId])->delete();
            foreach ($_POST['menuId'] as $menuId) {
                $menu = Db::name("adminMenu")->where("id", $menuId)->field("app,controller,action")->find();
                if ($menu) {
                    $app    = $menu['app'];
                    $model  = $menu['controller'];
                    $action = $menu['action'];
                    $name   = strtolower("$app/$model/$action");
                    Db::name("authAccess")->insert(["role_id" => $roleId, "rule_name" => $name, 'type' => 'yes_url']);
                }
            }
            cmf_clear_cache();
            $this->success("授权成功！");
        }
    }
}
