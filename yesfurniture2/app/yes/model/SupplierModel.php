<?php

namespace app\yes\model;

use think\Model;

class SupplierModel extends Model
{
    // protected $autoWriteTimestamp = 'datetime';

    public function contact()
    {
        return $this->morphMany('ContactModel', 'contact','supplier');
    }

    public function address()
    {
        return $this->morphOne('AddressModel',['address_type','type_id'],'supplier');
    }

    public function bank()
    {
        return $this->morphOne('BankModel',['bank_type','bank_id'],'supplier');
    }

}