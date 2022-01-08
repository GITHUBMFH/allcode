<?php

namespace app\model;

use think\facade\Db;

class Basesql
{
    public function add($name, $data)
    {
        $result =  Db::name($name)->json(['remark'])->insertAll($data);
        return $result;
    }

    public function del($name, $data)
    {
        $result =  Db::name($name)->delete($data);
        return $result;
    }
    /*
* @param $saveWhere ：想要更新主键ID数组
* @param $saveData ：想要更新的ID数组所对应的数据
* @param $tableName : 想要更新的表明
* @param $saveWhere : 返回更新成功后的主键ID数组
* */
    public function saveAll($saveData, $tableName)
    {
        if ($tableName==null) {
            return false;
        }
        $len = count($saveData);
        $flag=true;
        // $model = isset($model)?$model:M($tableName);
        $sql = Db::name($tableName);
        //开启事务处理机制
        $sql->startTrans();
        //记录更新失败ID
        $error=[];
        // $data1=['id'=>34,'remark'=>'21f34'];
        // $data=[
        //     ['id'=>34,'remark'=>'dsfghf'],
        //     ['id'=>35,'remark'=>'213jn6']
        // ];
        // $result = $sql->save($data1);
        foreach ($saveData as $key=>$value) {
            $id=$value['id'];
            unset($value['id']);
            $isRight=$sql->where(['id'=>$id])->update($value);
            if ($isRight==0) {
                //将更新失败的记录下来
                $error[]=$key;
                $flag=false;
            }
            $flag=$flag&&$isRight;
        }

        if ($flag) {
            //如果都成立就提交
            $sql->commit();
            return true;
        } elseif (count($error)>0) {
            //先将原先的预处理进行回滚
            // halt($saveData);
            $sql->rollback();
            for ($i=0;$i<count($error);$i++) {
                unset($saveData[$error[$i]]);
            }
            $saveData=array_merge($saveData);
            //进行第二次递归更新
            $this->saveAll($saveData, $tableName);
        // return 0;
        } else {
            // halt(2);
            //如果都更新就回滚
            $sql->rollback();
            return 1;
        }
    }

    /*
* @param $saveWhere ：想要更新主键ID数组
* @param $saveData ：想要更新的ID数组所对应的数据
* @param $tableName : 想要更新的表明
* @param $saveWhere : 返回更新成功后的主键ID数组
* */
    public function saveAll2($saveWhere, &$saveData, $tableName)
    {
        if ($saveWhere==null||$tableName==null) {
            return false;
        }
        //获取更新的主键id名称
        $key = array_keys($saveWhere)[0];
        //获取更新列表的长度
        $len = count($saveWhere[$key]);
        $flag=true;
        // $model = isset($model)?$model:M($tableName);
        $model = Db::naem($tableName);
        //开启事务处理机制
        $model->startTrans();
        //记录更新失败ID
        $error=[];

        for ($i=0;$i<$len;$i++) {
            //预处理sql语句
            $isRight=$model->where($key.'='.$saveWhere[$key][$i])->save($saveData[$i]);
            if ($isRight==0) {
                //将更新失败的记录下来
                $error[]=$i;
                $flag=false;
            }
            //$flag=$flag&&$isRight;
        }
        if ($flag) {
            //如果都成立就提交
            $model->commit();
            return $saveWhere;
        } elseif (count($error)>0&count($error)<$len) {
            //先将原先的预处理进行回滚
            $model->rollback();
            for ($i=0;$i<count($error);$i++) {
                //删除更新失败的ID和Data
                unset($saveWhere[$key][$error[$i]]);
                unset($saveData[$error[$i]]);
            }
            //重新将数组下标进行排序
            $saveWhere[$key]=array_merge($saveWhere[$key]);
            $saveData=array_merge($saveData);
            //进行第二次递归更新
            $this->saveAll($saveWhere, $saveData, $tableName);
            return $saveWhere;
        } else {
            //如果都更新就回滚
            $model->rollback();
            return false;
        }
    }


    public function dbSaveAll($datas, $database_table_name, $primary_key)
    {
        $sql   = ''; //Sql
        $lists = []; //记录集$lists
        $pk    = $primary_key;//获取主键
        foreach ($datas as $key=>$data) {
            foreach ($data as $key=>$value) {
                if ($pk===$key) {
                    $ids[]=$value;
                } else {
                    $lists[$key].= sprintf("WHEN %u THEN '%s' ", $data[$pk], $value);
                    halt($lists);
                }
            }
        }
        halt($lists);
        foreach ($lists as $key => $value) {
            $sql.= sprintf("`%s` = CASE `%s` %s END,", $key, $pk, $value);
        }
        $sql = sprintf('UPDATE __%s__ SET %s WHERE %s IN ( %s )', strtoupper($database_table_name), rtrim($sql, ','), $pk, implode(',', $ids));

        return Db::execute($sql);
    }
}
