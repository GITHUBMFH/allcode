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

use app\yes\model\AdminMenuModel;
use cmf\controller\AdminBaseController;
use think\Db;
use think\facade\Cache;

class MenuController extends AdminBaseController
{
    /**
     * 后台菜单管理
     * @adminMenu(
     *     'name'   => '后台菜单',
     *     'parent' => 'admin/Setting/default',
     *     'display'=> false,
     *     'hasView'=> true,
     *     'order'  => 10000,
     *     'icon'   => '',
     *     'remark' => '后台菜单管理',
     *     'param'  => ''
     * )
     * @return mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function index()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');

            // 获取数据
            $result =  Db::name('AdminMenu')->where('parent_id', '0')->page($page, $limit)->field(['id','name','concat("/",app,"/",controller,"/",action)'=>'url'])->order(['id'=>'desc',"app" => "ASC", "controller" => "ASC", "action" => "ASC"])->select()->toArray();
            $count =  Db::name('AdminMenu')->where('parent_id', '0')->count();

            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
        return $this->fetch();
    }

    /**
     * 后台菜单添加提交保存
     * @adminMenu(
     *     'name'   => '后台菜单添加提交保存',
     *     'parent' => 'index',
     *     'display'=> false,
     *     'hasView'=> false,
     *     'order'  => 10000,
     *     'icon'   => '',
     *     'remark' => '后台菜单添加提交保存',
     *     'param'  => ''
     * )
     */
    public function addPost()
    {
        if ($this->request->isPost()) {
            $post_data = $this->request->param();
            $result = $this->validate($this->request->param(), 'AdminMenu');
            if ($result !== true) {
                $this->error($result);
            } else {
                $insert_menu = Db::name('AdminMenu')->strict(false)->field(true)->insert($post_data);

                $app          = $this->request->param("app");
                $controller   = $this->request->param("controller");
                $action       = $this->request->param("action");
                // $param        = $this->request->param("param");
                $authRuleName = "$app/$controller/$action";
                $menuName     = $this->request->param("name");

                $findAuthRuleCount = Db::name('auth_rule')->where([
                    'app'  => $app,
                    'name' => $authRuleName,
                    'type' => 'yes_url'
                ])->count();
                if (empty($findAuthRuleCount)) {
                    $findAuthRule = Db::name('AuthRule')->insert([
                        "name"  => $authRuleName,
                        "app"   => $app,
                        "type"  => "yes_url", //type 1-admin rule;2-user rule
                        "title" => $menuName,
                        // 'param' => $param,
                    ]);
                }

                $this->_exportAppMenuDefaultLang();
                Cache::clear('admin_menus');// 删除后台菜单缓存
                if ($insert_menu && $findAuthRule) {
                    $this->success("添加成功");
                } else {
                    $this->error("添加失败");
                }
            }
        }
    }

    /**
     * 后台菜单编辑
     * @adminMenu(
     *     'name'   => '后台菜单编辑',
     *     'parent' => 'index',
     *     'display'=> false,
     *     'hasView'=> true,
     *     'order'  => 10000,
     *     'icon'   => '',
     *     'remark' => '后台菜单编辑',
     *     'param'  => ''
     * )
     * @return mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function childmenu()
    {
        if ($this->request->isPost()) {
            $data_post = $this->request->param();
            $parent_id = $this->request->param('id');
            $result =  Db::name('AdminMenu')->where('parent_id', $parent_id)->field(['id','name','concat("/",app,"/",controller,"/",action)'=>'url','parent_id'])->order(["app" => "ASC", "controller" => "ASC", "action" => "ASC"])->select()->toArray();

            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            return $data;
        }
        return $this->fetch('childmenu');
    }

    /**
     * 后台菜单编辑提交保存
     * @adminMenu(
     *     'name'   => '后台菜单编辑提交保存',
     *     'parent' => 'index',
     *     'display'=> false,
     *     'hasView'=> false,
     *     'order'  => 10000,
     *     'icon'   => '',
     *     'remark' => '后台菜单编辑提交保存',
     *     'param'  => ''
     * )
     * @throws \think\Exception
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     * @throws \think\exception\PDOException
     */
    public function editPost()
    {
        if ($this->request->isPost()) {
            $id      = $this->request->param('id', 0, 'intval');
            $oldMenu = Db::name('AdminMenu')->where('id', $id)->find();

            $result = $this->validate($this->request->param(), 'AdminMenu.edit');

            if ($result !== true) {
                $this->error($result);
            } else {
                $updatamenu = Db::name('AdminMenu')->where('id', $id)->strict(false)->field(true)->update($this->request->param());
                $app          = $this->request->param("app");
                $controller   = $this->request->param("controller");
                $action       = $this->request->param("action");
                // $param        = $this->request->param("param");
                $authRuleName = "$app/$controller/$action";
                $menuName     = $this->request->param("name");

                $findAuthRuleCount = Db::name('auth_rule')->where([
                    'app'  => $app,
                    'name' => $authRuleName,
                    'type' => 'yes_url'
                ])->count();
                // 如果authrule存在这个数据，存在修改数据不存就在插入
                if (empty($findAuthRuleCount)) {
                    $oldApp        = $oldMenu['app'];
                    $oldController = $oldMenu['controller'];
                    $oldAction     = $oldMenu['action'];
                    $oldName       = "$oldApp/$oldController/$oldAction";
                    $findOldRuleId = Db::name('AuthRule')->where("name", $oldName)->value('id');
                    if (empty($findOldRuleId)) {
                        $updataauthrule = Db::name('AuthRule')->insert([
                            "name"  => $authRuleName,
                            "app"   => $app,
                            "type"  => "yes_url",
                            "title" => $menuName,
                            // "param" => $param
                        ]);//type 1-admin rule;2-user rule
                    } else {
                        $updataauthrule = Db::name('AuthRule')->where('id', $findOldRuleId)->update([
                            "name"  => $authRuleName,
                            "app"   => $app,
                            "type"  => "yes_url",
                            "title" => $menuName,
                            // "param" => $param
                            ]);//type 1-admin rule;2-user rule
                    }
                } else {
                    $updataauthrule = Db::name('AuthRule')->where([
                        'app'  => $app,
                        'name' => $authRuleName,
                        'type' => 'yes_url'
                    ])->update(["title" => $menuName]);//type 1-admin rule;2-user rule
                }
                $this->_exportAppMenuDefaultLang();
                Cache::clear('admin_menus');// 删除后台菜单缓存
                if ($updatamenu && $updataauthrule) {
                    $this->success("修改成功");
                } else {
                    $this->error("修改失败");
                }
            }
        }
    }

    /**
     * 后台菜单删除
     * @adminMenu(
     *     'name'   => '后台菜单删除',
     *     'parent' => 'index',
     *     'display'=> false,
     *     'hasView'=> false,
     *     'order'  => 10000,
     *     'icon'   => '',
     *     'remark' => '后台菜单删除',
     *     'param'  => ''
     * )
     * @throws \think\Exception
     * @throws \think\exception\PDOException
     */
    public function delete()
    {
        $id = $this->request->param("id", 0, 'intval');
        $adminMenuModel = new AdminMenuModel();
        $menus = Db::name('AdminMenu')->where(['parent_id' => $id])->order("list_order", "ASC")->select()->toArray();
        if ($menus) {
            // halt($menus);
            foreach ($menus as $vo) {
                $result = Db::name('AdminMenu')->where('id', $vo['id'])->find();
                $app          = $result['app'];
                $controller   = $result['controller'];
                $action       = $result['action'];
                $oldName       = "$app/$controller/$action";
                $findOldRuleId = Db::name('AuthRule')->where("name", $oldName)->delete();
                $delmenu = Db::name('AdminMenu')->delete($vo['id']);
            }
        }
        $result = Db::name('AdminMenu')->where('id', $id)->find();
        $app          = $result['app'];
        $controller   = $result['controller'];
        $action       = $result['action'];
        $oldName       = "$app/$controller/$action";
        $findOldRuleId = Db::name('AuthRule')->where("name", $oldName)->delete();
        $delmenu = Db::name('AdminMenu')->delete($id);
        $this->_exportAppMenuDefaultLang();
        Cache::clear('admin_menus');// 删除后台菜单缓存
        if ($delmenu && $findOldRuleId) {
            $this->success("删除菜单成功！");
        } else {
            $this->error("删除失败！");
        }
    }

    /**
     * 导出后台菜单语言包
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    private function _exportAppMenuDefaultLang()
    {
        $menus         = Db::name('AdminMenu')->order(["app" => "ASC", "controller" => "ASC", "action" => "ASC"])->select();
        $langDir       = config('DEFAULT_LANG');
        $adminMenuLang = CMF_ROOT . "data/lang/" . $langDir . "/admin_menu.php";

        if (!empty($adminMenuLang) && !file_exists_case($adminMenuLang)) {
            mkdir(dirname($adminMenuLang), 0777, true);
        }

        $lang = [];

        foreach ($menus as $menu) {
            $lang_key        = strtoupper($menu['app'] . '_' . $menu['controller'] . '_' . $menu['action']);
            $lang[$lang_key] = $menu['name'];
        }

        $langStr = var_export($lang, true);
        $langStr = preg_replace("/\s+\d+\s=>\s(\n|\r)/", "\n", $langStr);

        if (!empty($adminMenuLang)) {
            file_put_contents($adminMenuLang, "<?php\nreturn $langStr;");
        }
    }
}
