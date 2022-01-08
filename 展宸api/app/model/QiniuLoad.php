<?php
declare(strict_types = 1);
namespace app\model;

use Qiniu\Auth;
use Qiniu\Storage\UploadManager;
use think\facade\Env;
use Qiniu\Storage\BucketManager;

class QiniuLoad
{
    protected $accessKey;
    protected $secretKey;
    protected $bucket;

    public function __construct()
    {
        $this->accessKey=Env::get('qiniu.qiniu_access_key');
        $this->secretKey=Env::get('qiniu.qiniu_secret_key');
        $this->bucket=Env::get('qiniu.qiniu_bucket');
        $this->domain=Env::get('qiniu.qiniu_domain');
    }
    // 上传图片
    public function upload($files)
    {
        $expires = 3600;
        $returnBody = '{"code":"0","msg":"success","key":$(key)}';//此处为设置json返回格式
        $policy = array(
            'returnBody' => $returnBody
        );
        $auth  = new Auth($this->accessKey, $this->secretKey);
        $token = $auth->uploadToken($this->bucket, null, $expires, $policy, true);

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

    // 删除图片
    public function del($filename)
    {
        $auth  = new Auth($this->accessKey, $this->secretKey);
        $config = new \Qiniu\Config();
        $bucketManager = new BucketManager($auth, $config);
        list($ret, $err)  = $bucketManager->delete($this->bucket, $filename);
        if ($err !== null) {
            // echo '上传失败';
        } else {
            // return $ret;
            return true;
        }
    }

    // 获取图片下载连接
    public function getdownurl($filename)
    {
        $auth  = new Auth($this->accessKey, $this->secretKey);
        // http://resource.yasfurniture.cn/xlsx1564553187.xlsx?attname=
        $baseUrl = 'http://resource.yasfurniture.cn/'.$filename;
        $signedUrl = $auth->privateDownloadUrl($baseUrl);
        return $signedUrl;
    }
}
