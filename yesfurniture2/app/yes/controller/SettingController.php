<?php

namespace app\yes\controller;

use cmf\controller\AdminBaseController;
use think\Db;

class SettingController extends AdminBaseController
{

    public function index()
    {
        // $data['site_name'] = '你好';
        // $data['site_seo_title'] = '你好';
        // $data['site_seo_keywords'] = '你好';
        // $data['site_seo_description'] = '你好';
        // $data['ICP'] = '你好';
        // $data['address'] = '你好';
        // $data['phone'] = '你好';
        // $data['qq'] = '你好';
        // $data['skype'] = '你好';
        // $data['whatapp'] = '你好';
        // $data['facebook'] = '你好';
        // $data['img'] = '你好';
        // $data['code'] = '你好';
        // $option['option_value'] = json_encode($data);
        // halt($option['option_value']);
        $this->assign('site_info', cmf_get_option('site_info'));
        return $this->fetch();
    }

    public function setPost(){
        if($this->request->isPost()){
            $options = $this->request->param('options/a');
            // halt()
            $result = cmf_set_option('site_info', $options);
            if($result){
                $this->success('修改成功');
            }else{
                $this->error('修改失败');
            }
        }
    }

}