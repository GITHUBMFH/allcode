<?php
/*
 * @Description: 
 * @Version: 2.0
 * @Autor: mfh
 * @Date: 2021-09-29 14:23:35
 * @LastEditors: mfh
 * @LastEditTime: 2021-09-30 12:25:30
 */
// 这是系统自动生成的公共文件

use think\facade\Db;

if (!function_exists('saveall')) {
    function saveall($data, $name)
    {
        {
            $sql="UPDATE v_$name SET";
            $primarykeyfield="id";
            $updatekeys=array_keys($data[0]);
            $sql.=array_reduce($updatekeys, function ($a, $b) use ($data, $primarykeyfield) {
                if ($b != $primarykeyfield) {
                    $cache = $b . "= case " . $primarykeyfield . " ";
                    $v = array_reduce($data, function ($c, $d) use ($b, $primarykeyfield) {
                        return $c .= " when " . $d[$primarykeyfield] . " then " . $d[$b];
                    }, "");
                    if (!empty($v)) {
                        $a .= $cache . $v." end, ";
                    }
                }
                return $a;
            }, " ");
            $sql=rtrim($sql, ', ');
            $sql.=" where ".$primarykeyfield." IN (".implode(',', array_column($data, $primarykeyfield)).")";
            $result=Db::execute($sql);
            return $result;
        }
    }
}