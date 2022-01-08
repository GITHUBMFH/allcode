<?php

namespace app\yes\model;

use think\Model;

class WorkerModel extends Model
{

    public function salary()
    {
        return $this->morphMany('SalaryModel', 'salary_id','id');
    }

}