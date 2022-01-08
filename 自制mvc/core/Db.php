<?php
class Db{
    private static function db_connect(){
        $connet = mysqli_connect('127.0.0.1','root','root','qsbk');
        if(!$connet){
            exit('连接失败'.mysqli_connect_errno());
        }
        return $connet;
    }
}