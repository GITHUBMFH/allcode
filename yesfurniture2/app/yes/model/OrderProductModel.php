<?php

namespace app\yes\model;

use think\Model;

class OrderProductModel extends Model
{

    public function order()
    {
        return $this->belongsTo('orderModel','order_id','id');
    }

    public function spare()
    {
        return $this->hasMany('spareModel','product_id');
    }

    public function cost()
    {
        return $this->hasOne('CostModel','product_id');
    }

    public function costlabor()
    {
        return $this->hasMany('CostLaborModel','product_id');
    }
}