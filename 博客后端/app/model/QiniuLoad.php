<?php
declare(strict_types = 1);
namespace app\model;

use Qiniu\Auth;
use Qiniu\Storage\UploadManager;
use think\facade\Env;
use Qiniu\Storage\BucketManager;

class QiniuLoad
{
    protected $accessKey='C2qYOg1kIGqgxv8hbiZJii73Fv0JeCx-HhWKddY_';
    protected $secretKey='tFbW1T4bNzSxDn-RC5VkKc3YS-I1QAUgl8kXhM24';
    protected $bucket='yesfurniture';
    protected $domain='resource.yasfurniture.cn';

    public function __construct()
    {
    }
    
    public function gettoken(){
        $expires = 3600;
        $returnBody = '{"code":200,"msg":"success","key":$(key)}';//此处为设置json返回格式
        $policy = array(
            'returnBody' => $returnBody
        );
        $auth  = new Auth($this->accessKey, $this->secretKey);
        $token = $auth->uploadToken($this->bucket, null, $expires, $policy, true);
        return $token;
    }
    // 上传图片
    public function upload($files)
    {
        $expires = 3600;
        $returnBody = '{"code":200,"msg":"success","key":$(key)}';//此处为设置json返回格式
        $errmsg = '{"code":202,"msg":"err"}';//此处为设置json返回格式
        $policy = array(
            'returnBody' => $returnBody
        );
        $auth  = new Auth($this->accessKey, $this->secretKey);
        $token = $auth->uploadToken($this->bucket, null, $expires, $policy, true);

        $uploadMgr = new UploadManager();

        $filePath = $files['file']['tmp_name'][0];//'./php-logo.png';  //接收图片信息
        if ($files['file']['type']=="video/mp4") {
            $key = 'csvideo'.time().'.mp4';
        } elseif ($files['file']['type'][0]=="audio/mpeg") {
            $key = 'csaudio'.time().'.mp3';
        } elseif ($files['file']['type'][0]=="application/pdf") {
            $key = 'cspdf'.time().'.pdf';
        } elseif ($files['file']['type'][0]=='application/octet-stream') {
            $key = 'csplt'.time().'.plt';
        } elseif ($files['file']['type'][0]=="image/vnd.dwg") {
            $key = 'csdwg'.time().'.dwg';
        } elseif ($files['file']['type'][0]=="image/vnd.dxf") {
            $key = 'csdxf'.time().'.dxf';
        } elseif ($files['file']['type'][0]=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            $key = 'csxlsx'.time().'.xlsx';
        } elseif ($files['file']['type'][0]=="application/x-rar") {
            $key = 'csrar'.time().'.rar';
        } elseif ($files['file']['type'][0]=="text/plain") {
            $key = 'cstxt'.time().'.txt';
        } elseif ($files['file']['type'][0]=="application/vnd.ms-excel") {
            $key = 'csxls'.time().'.xls';
        } elseif ($files['file']['type'][0]=="application/msword") {
            $key = 'csdoc'.time().'.doc';
        } elseif ($files['file']['type'][0]=="text/html") {
            $key = 'cshtml'.time().'.html';
        } elseif ($files['file']['type'][0]=="application/vnd.ms-powerpoint") {
            $key = 'csppt'.time().'.ppt';
        } elseif ($files['file']['type'][0]=="image/vnd.adobe.photoshop") {
            $key = 'cspsd'.time().'.psd';
        } elseif ($files['file']['type'][0]=="application/javascript") {
            $key = 'csjs'.time().'.js';
        } elseif ($files['file']['type'][0]=="application/x-linguist") {
            $key = 'csts'.time().'.ts';
        } elseif ($files['file']['type'][0]=="text/css") {
            $key = 'cscss'.time().'.css';
        } else {
            $key = 'csjpg'.time().'.jpg';
        }
        list($ret, $err) = $uploadMgr->putFile($token, $key, $filePath);
        if ($err !== null) {
            return $errmsg;
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
            return false;
        } else {
            return true;
        }
    }

    // 获取图片下载连接
    public function getdownurl($filename)
    {
        $auth  = new Auth($this->accessKey, $this->secretKey);
        $baseUrl = 'http://resource.yasfurniture.cn/'.$filename;
        $signedUrl = $auth->privateDownloadUrl($baseUrl);
        return $signedUrl;
    }

    public function downfile()
    {
        // require_once("qiniu/rs.php");
        // $key = 'pic.jpg';
        // $domain = $this->domain;
        // $accessKey = $this->accessKey;
        // $secretKey = $this->secretKey;
        // QIniu_Setkeys
        // Qiniu_SetKeys($accessKey, $secretKey);
        // $baseUrl = Qiniu_RS_MakeBaseUrl($domain, $key);
        // $getPolicy = new Qiniu_RS_GetPolicy();
        // $privateUrl = $getPolicy->MakeRequest($baseUrl, null);
        // echo "====> getPolicy result: \n";
        // echo $privateUrl . "\n";
    }
}
