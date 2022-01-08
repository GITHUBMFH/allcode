<?php

namespace app\yes\model;

use think\Model;

class RecordModel extends Model
{

    public function details()
    {
        return $this->belongsTo('RecordDetailsModel', 'record_id','id');
    }

    public function supplier()
    {
        return $this->belongsTo('SupplierModel', 'supplier','id');
    }
}