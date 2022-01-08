<?php

namespace app\yes\model;

use think\Model;

class ClientModel extends Model
{

    public function contact()
    {
        return $this->morphMany('ContactModel', 'contact','client');
    }

    public function address()
    {
        return $this->morphOne('AddressModel',['address_type','type_id'],'client');
    }

    public function bank()
    {
        return $this->morphOne('BankModel',['bank_type','bank_id'],'client');
    }
}