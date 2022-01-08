<?php

namespace app\yes\model;

use think\Model;

class CostLaborModel extends Model
{
    public function worktype()
    {
        return $this->belongsTo('WorkTypeModel','worker_id','id');
    }

    public function dailyprice()
    {
        return $this->belongsTo('DailyPriceModel','standard_id','id');
    }

}