<?php
declare (strict_types = 1);

namespace app\validate;

use think\Validate;

class order extends Validate
{
    /**
     * 定义验证规则
     * 格式：'字段名' =>  ['规则1','规则2'...]
     *
     * @var array
     */
    protected $rule = [
        'id'=>'require|array',//id
        'num'=>'require|integer',//工令号
        'parent_id'=>'integer',//父id
        'date'=>'date',//下单时间
        'remark'=>'chsDash',//备注
        'name'=>'require|chsDash',//项目名称
        'state'=>'require|num=>in:1,2,3',//项目状态

        'pageSize'=>'require|integer',//查询每页数量
        'pageIndex'=>'require|integer',//单前页
        'ordername'=>'array',//查询项目名称
        'orderdtae'=>'array',//查询项目时间
        'ordernum'=>'array',//查询项目工令号
    ];

    protected function sort($name){
        return $name=='desc'||$name=='asc'?true:false;
    }
    /**
     * 定义错误信息
     * 格式：'字段名.规则名' =>  '错误信息'
     *
     * @var array
     */
    protected $message = [
        'id.require'=>'缺少id',
        'id.array'=>'无效id',
        'num.require'=>'缺少订单号',
        'num.integer'=>'无效订单号',
        'date.date'=>'无效时间',

        'state.require'=>'缺少状态',
        'state.num'=>'无效状态',

        'parent_id.integer'=>'无效父类id',

        'remark.chsDash'=>'无效备注',
        'name.require'=>'缺少项目名称',
        'name.chsDash'=>'无效名称',

        'pageSize.require'=>'缺少参数',
        'pageSize.integer'=>'参数错误',
        'pageIndex.require'=>'缺少参数',
        'pageIndex.integer'=>'参数错误',
        'ordername.array'=>'参数错误',
        'orderdtae.array'=>'参数错误',
        'ordernum.array'=>'参数错误',
    ];

    protected $scene = [
        'save'  =>  ['parent_id','remark','num'],
        'del'  =>  ['id'],
        'search'=>['pageSize','pageIndex','ordername','orderdtae','ordernum'],
    ]; 
}