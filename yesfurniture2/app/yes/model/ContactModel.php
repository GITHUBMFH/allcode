<?php

namespace app\yes\model;

use think\Model;

class ContactModel extends Model
{

    public function contact()
    {
        return $this->morphTo();
    }

}