<?php

namespace app\yes\model;

use think\Model;

class AddressModel extends Model
{

    public function address()
    {
        return $this->morphTo();
    }

}