<?php

namespace app\yes\model;

use think\Model;

class WorkTypeModel extends Model
{
    public function workertype()
    {
        return $this->belongsTo('User','uid');
    }

}