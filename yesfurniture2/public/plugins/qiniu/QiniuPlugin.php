<?php
// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2018 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>
// +----------------------------------------------------------------------
namespace plugins\qiniu;

use cmf\lib\Plugin;
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;
use Qiniu\Storage\BucketManager;

class QiniuPlugin extends Plugin
{
    public $info = [
        'name'        => 'Qiniu',
        'title'       => '七牛云存储',
        'description' => 'ThinkCMF七牛专享优惠码:507670e8',
        'status'      => 1,
        'author'      => 'ThinkCMF',
        'version'     => '1.0.1'
    ];

    public $hasAdmin = 0;//插件是否有后台管理界面

    // 插件安装
    public function install()
    {
        $storageOption = cmf_get_option('storage');
        if (empty($storageOption)) {
            $storageOption = [];
        }

        $storageOption['storages']['Qiniu'] = ['name' => '七牛云存储', 'driver' => '\\plugins\\qiniu\\lib\\Qiniu'];

        cmf_set_option('storage', $storageOption);
        return true;//安装成功返回true，失败false
    }

    // 插件卸载
    public function uninstall()
    {
        $storageOption = cmf_get_option('storage');
        if (empty($storageOption)) {
            $storageOption = [];
        }

        unset($storageOption['storages']['Qiniu']);

        cmf_set_option('storage', $storageOption);
        return true;//卸载成功返回true，失败false
    }

    // $content = hook_one('fetch_upload_view', $files);

    public function fetchUploadView($files)
    {
        $config     = $this->getConfig();
        $accessKey  = $config['accessKey'];
        $secretKey  = $config['secretKey'];
        $expires = 3600;
        $returnBody = '{"code":"0","msg":"success","key":$(key)}';//此处为设置json返回格式
        $policy = array(
            'returnBody' => $returnBody
        );
        $auth  = new Auth($accessKey, $secretKey);
        $token = $auth->uploadToken($config['bucket'], null, $expires, $policy, true);

        $uploadMgr = new UploadManager();

        $filePath = $files['file']['tmp_name'];//'./php-logo.png';  //接收图片信息
        if ($files['file']['type']=='video/mp4') {
            $key = 'csvideo'.time().'.mp4';
        } elseif ($files['file']['type']=='audio/mp3') {
            $key = 'csaudio'.time().'.mp3';
        } elseif ($files['file']['type']=='pdf') {
            $key = 'cspdf'.time().'.pdf';
        } elseif ($files['file']['type']=='plt') {
            $key = 'csjpg'.time().'.plt';
        } elseif ($files['file']['type']=='dwg') {
            $key = 'csdwg'.time().'.dwg';
        } elseif ($files['file']['type']=='max') {
            $key = 'csmax'.time().'.max';
        } elseif ($files['file']['type']=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            $key = 'csxlsx'.time().'.xlsx';
        } else {
            $key = 'csjpg'.time().'.jpg';
        }
        list($ret, $err) = $uploadMgr->putFile($token, $key, $filePath);
        if ($err !== null) {
            // echo '上传失败';
        } else {
            return $ret;
        }
        return $ret;
    }

    public function deloneimg($key)
    {
        $config     = $this->getConfig();
        $accessKey  = $config['accessKey'];
        $secretKey  = $config['secretKey'];
        $bucket     = $config['bucket'];
        $auth  = new Auth($accessKey, $secretKey);
        $config = new \Qiniu\Config();
        $bucketManager = new BucketManager($auth, $config);
        list($ret, $err)  = $bucketManager->delete($bucket, $key);
        if ($err !== null) {
            // echo '上传失败';
        } else {
            // return $ret;
            return true;
        }
    }

    public function getdownurl($key)
    {
        $config     = $this->getConfig();
        $accessKey  = $config['accessKey'];
        $secretKey  = $config['secretKey'];
        $bucket     = $config['bucket'];
        $auth  = new Auth($accessKey, $secretKey);
        // http://resource.yasfurniture.cn/xlsx1564553187.xlsx?attname=
        $baseUrl = 'http://resource.yasfurniture.cn/'.$key;

        $signedUrl = $auth->privateDownloadUrl($baseUrl);
        return $signedUrl;
    }
}
