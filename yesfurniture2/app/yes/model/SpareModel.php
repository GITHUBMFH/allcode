<?php

namespace app\yes\model;

use think\Model;

class SpareModel extends Model
{
    protected $autoWriteTimestamp = 'datetime';

    public function orderproduct()
    {
        return $this->belongsTo('OrderProductModel','product_id','id');
    }
}