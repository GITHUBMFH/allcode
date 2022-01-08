<?php
namespace app\controller;

use think\facade\Log;

define("TOKEN", "mfh19960724");

class Wexin
{
    public function index()
    {
        $this->valid();
    }

    //检查签名
    private function valid()
    {
        $signature = request()->get('signature');
        $timestamp = request()->get('timestamp');
        $echoStr = request()->get('echostr');
        $nonce = request()->get('nonce');
        $token = TOKEN;
        $tmpArr = array($token, $timestamp, $nonce);
        sort($tmpArr, SORT_STRING);
        $tmpStr = implode($tmpArr);
        $tmpStr = sha1($tmpStr);
        if ($tmpStr == $signature && $echoStr) {
            return $echoStr;
        } else {
            // Log::write('435');
            // return false;
            $object = file_get_contents("php://input");
            $postarr = simplexml_load_string($object, "SimpleXMLElement", LIBXML_NOCDATA);
            $ToUserName = $postarr->ToUserName;
            $FromUserName = $postarr->FromUserName;
            $time = time();
            $temXML="<xml>
            <ToUserName><![CDATA[%s]]></ToUserName>
            <FromUserName><![CDATA[%s]]></FromUserName>
            <CreateTime>%s</CreateTime>
            <MsgType><![CDATA[%s]]></MsgType>
            <Content><![CDATA[%s]]></Content>
            </xml>";

            $msgType = "text";
            $contentStr = "Welcome to wechat world!";
                    
            $info = sprintf($temXML, $FromUserName, $ToUserName, $time, $msgType, $contentStr);
            // $info = sprintf($temXML,$FromUserName,$ToUserName,$time,'你好');
            // $info = sprintf($temXML,$ToUserName,$FromUserName,$time,'你好');

            // Log::write($info);
            echo $info;
            exit;
            // return $info;
        }
    }
}
