<?php
declare (strict_types = 1);

namespace app\validate;

use think\Validate;

class file extends Validate
{
    /**
     * 定义验证规则
     * 格式：'字段名' =>  ['规则1','规则2'...]
     *
     * @var array
     */
    protected $rule = [
        'img'=>'file|image|fileExt:jpeg,png,jpg|fileSize:1024*5',
        'pdf'=>'file|fileExt:pdf|fileSize:1024*5',
        'excel'=>'file|fileExt:xls,xlsx|fileSize:1024*5',
        'dwg'=>'file|fileExt:dwg|fileSize:1024*10',
    ];

    /**
     * 定义错误信息
     * 格式：'字段名.规则名' =>  '错误信息'
     *
     * @var array
     */
    protected $message = [
        'img.file'=>'文件错误',
        'img.image'=>'文件错误',
        'img.fileExt'=>'文件错误',
        'img.fileSize'=>'文件超出大小',
        'pdf.file'=>'文件错误',
        'pdf.fileExt'=>'文件错误',
        'pdf.fileSize'=>'文件超出大小',
        'excel.file'=>'文件错误',
        'excel.fileExt'=>'文件错误',
        'excel.fileSize'=>'文件超出大小',
        'dwg.file'=>'文件错误',
        'dwg.fileExt'=>'文件错误',
        'dwg.fileSize'=>'文件超出大小',
    ];
    
    protected $scene = [
        'img'  =>  ['img'],
        'pdf'  =>  ['pdf'],
        'excel'  =>  ['excel'],
        'dwg'  =>  ['dwg'],
    ]; 
}
