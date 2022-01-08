<?php

namespace app\yes\model;

use think\Model;

class DailyPriceModel extends Model
{
    public function worktype()
    {
        return $this->belongsTo('WorkTypeModel','type_id','id');
    }
}