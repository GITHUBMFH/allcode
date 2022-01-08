<?php

namespace app\yes\model;

use think\Model;

class OrderModel extends Model
{
    public function client()
    {
        return $this->belongsTo('clientModel','client_id','id');
    }

    public function price()
    {
        return $this->hasOne('OrderPriceModel','order_id','id');
    }
}