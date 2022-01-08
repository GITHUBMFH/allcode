<?php
// 应用公共文件

use think\Response;
use think\facade\Db;

if (!function_exists('create')) {
    function create($data, $msg, $code=200, $count=false, $type='json')
    {
        $result=[
            'code'=>$code,
            'msg'=>$msg,
            'data'=>$data,
        ];
        $count?$result['count']=$count:null;
        return Response::create($result, $type);
    }
}

if (!function_exists('saveall')) {
    function saveall($data, $name)
    {
        {
            $sql="UPDATE zc_$name SET";
            $primarykeyfield="id";
            $updatekeys=array_keys($data[0]);
            $sql.=array_reduce($updatekeys, function ($a, $b) use ($data, $primarykeyfield) {
                if ($b != $primarykeyfield) {
                    $cache = $b . "= case " . $primarykeyfield . " ";
                    $v = array_reduce($data, function ($c, $d) use ($b, $primarykeyfield) {
                        return $c .= " when " . $d[$primarykeyfield] . " then " . $d[$b];
                    }, "");
                    if (!empty($v)) {
                        $a .= $cache . $v." end, ";
                    }
                }
                return $a;
            }, " ");
            $sql=rtrim($sql, ', ');
            $sql.=" where ".$primarykeyfield." IN (".implode(',', array_column($data, $primarykeyfield)).")";
            $result=Db::execute($sql);
            return $result;
        }
    }
}

// 生成表格
function downexcel($exceltitle, $con,$order)
{
    //没有第二部
    //3.实例化PHPExcel类
    $objPHPExcel = new \PHPExcel();
    //4.激活当前的sheet表
    $objPHPExcel->setActiveSheetIndex(0);
    // //表头数据
    // $exceltitle = [
    //         // 第一行
    //         ['A1','佛山市展辰酒店家具有限公司-生产订单','A',10],
    //         // 第二行
    //         ['A2','工令号:','A',10],
    //         ['D2','项目名称:','A',10],
    //         ['G2','下单日期:','A',10],
    //         // 第三行
    //         ['A3','序号','A',10,],
    //         ['B3','楼层区域','B',20,],
    //         ['C3','编号','C',10],
    //         ['D3','名称','D',20],
    //         ['E3','尺寸','E',30],
    //         ['F3','数量','F',10],
    //         ['G3','单位','G',10],
    //         ['H3','备注','H',30]
    //     ];
    // // 选取表中要输出数据
    // $con = array(
    //                 [1,'1楼','ZC-01','三人沙发','300*28*56','34','件','高回弹海绵'],
    //                 [2,'1楼','ZC-01','三人沙发','300*28*56','34','件','高回弹海绵'],
    //                 [3,'1楼','ZC-01','三人沙发','300*28*56','34','件','高回弹海绵'],
    //                 [4,'1楼','ZC-01','三人沙发','300*28*56','34','件','高回弹海绵'],
    //                 [5,'1楼','ZC-01','三人沙发','300*28*56','34','件','高回弹海绵'],
    //                 [6,'1楼','ZC-01','三人沙发','300*28*56','34','件','高回弹海绵'],
    //                 [7,'1楼','ZC-01','三人沙发','300*28*56','34','件','高回弹海绵'],
    //             );
    $lengthexcel=[];//提取表格每列的字母
    foreach ($exceltitle as $a) {
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue($a[0], $a[1]);//设置表头
        $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($a[2])->setWidth($a[3]);//设置表单宽度
        in_array($a[2], $lengthexcel)?null:array_push($lengthexcel, $a[2]);
    }

    //6.循环刚取出来的数组，将数据逐一添加到excel表格。
    foreach ($con as $index =>$item) {
        foreach ($lengthexcel as $key => $a) {
            $objPHPExcel->getActiveSheet()->setCellValue($a. ($index + 4), $item[$key]);
        }
    }
    // 合并
    $tablelength =count($lengthexcel)-1;//最尾行
    $datalength =count($con)+4;//最尾列
    // 合并第二行
    $objPHPExcel->getActiveSheet()->mergeCells('E2:F2');
    $objPHPExcel->getActiveSheet()->mergeCells('B2:C2');
    // 合并首行
    $objPHPExcel->getActiveSheet()->mergeCells('A1:'.$lengthexcel[$tablelength].'1');
    // 合并尾行
    $objPHPExcel->getActiveSheet()->mergeCells('A'.$datalength.':'.$lengthexcel[$tablelength-3].$datalength);
    // 设置尾行值
    $objPHPExcel->getActiveSheet()->setCellValue('B2', $order[0]);
    $objPHPExcel->getActiveSheet()->setCellValue('E2', $order[1]);
    $objPHPExcel->getActiveSheet()->setCellValue('H2', $order[2]);

    $objPHPExcel->getActiveSheet()->setCellValue('A'.$datalength, '合并:');
    $objPHPExcel->getActiveSheet()->setCellValue($lengthexcel[$tablelength-2].$datalength, '=SUM('.$lengthexcel[$tablelength-2].'4:'.$lengthexcel[$tablelength-2].($datalength-1).')');

            
    // 设置高度为自动
    for ($i=0;$i<count($con)+4;$i++) {
        $objPHPExcel->getActiveSheet()->getRowDimension($i)->setRowHeight(-1);
    }
    $objPHPExcel->getActiveSheet()->getRowDimension('1')->setRowHeight(50);
    $objPHPExcel->getActiveSheet()->getRowDimension('2')->setRowHeight(20);
    $objPHPExcel->getActiveSheet()->getRowDimension('3')->setRowHeight(20);
    // 设置自动换行
    $objPHPExcel->getActiveSheet()->getStyle('A1:'.$lengthexcel[$tablelength].$datalength)->getAlignment()->setWrapText(true);

    // 设置默认高度
    // $objPHPExcel->getActiveSheet()->getDefaultRowDimension()->setRowHeight(15);
    // 第一行的默认高度

    // 设置基本样式
    $styleArray = array(
        'font'  => array(
            'bold'  => false,//设置字体加粗
            'color' => array('rgb' => '000000'),//设置字体颜色
            'Italic'=> false,//设置字体倾斜
            'size'  => 13,//设置字体大小
            'name'  => 'Verdana',//设置字体名
            'Underline'=> false,//设置字体下划线
        ),
        'borders' => array(
            'allborders' => array( //设置全部边框
                'style' => \PHPExcel_Style_Border::BORDER_THIN,//粗的是thick
            )
        ),
        'alignment' => array(
            'horizontal' => \PHPExcel_Style_Alignment::HORIZONTAL_CENTER,//获得水平居中方式
            'vertical' => \PHPExcel_Style_Alignment::VERTICAL_CENTER//获得垂直居中方式
        )
    );
    $stylename = array(
        'font'  => array(
            'bold'  => true,//设置字体加粗
            'size'  => 20,//设置字体大小
        ),
    );
    $styletitle = array(
        'font'  => array(
            'bold'  => true,//设置字体加粗
            'size'  => 13,//设置字体大小
        ),
    );
    $styletitle2 = array(
        'font'  => array(
            'bold'  => true,//设置字体加粗
            'size'  => 13,//设置字体大小
        ),
        'alignment' => array(
            'vertical' => \PHPExcel_Style_Alignment::HORIZONTAL_LEFT//获得垂直居中方式
        )
    );
    // 同一设置样式
    $objPHPExcel->getActiveSheet()->getStyle('A1:'.$lengthexcel[$tablelength].$datalength)->applyFromArray($styleArray);
    // 设置标题样式
    $objPHPExcel->getActiveSheet()->getStyle('A1:'.$lengthexcel[$tablelength].'1')->applyFromArray($stylename);

    // 设置表头样式
    $objPHPExcel->getActiveSheet()->getStyle('A2:'.$lengthexcel[$tablelength].'2')->applyFromArray($styletitle2);
    $objPHPExcel->getActiveSheet()->getStyle('A3:'.$lengthexcel[$tablelength].'3')->applyFromArray($styletitle);

    //7.设置保存的Excel表格名称
    $filename =date('ymdhis', time()) . '.xls';

    //8.设置当前激活的sheet表格名称
    $objPHPExcel->getActiveSheet()->setTitle('sheet1');
    //9.设置浏览器窗口下载表格
    // header("Content-Type: application/force-download");
    // header("Content-Type: application/octet-stream");
    // header("Content-Type: application/download");
    // header('Content-Disposition:inline;filename="' . $filename . '"');

    // header("Content-type:application/vnd.ms-excel");
    //生成excel文件
    $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
    //下载文件在浏览器窗口
    // 保存在服务器
    $objWriter->save( app()->getRootPath() . 'public/storage/'.$filename);
    return $filename;
}
// 下载表格
function downfile($file_dir,$filename){
    if (file_exists($file_dir)) {
        // 打开文件
        $file1 = fopen($file_dir, "r");
        // 输入文件标签
        Header("Content-type: application/octet-stream");
        Header("Accept-Ranges: bytes");
        Header("Accept-Length:".filesize($file_dir));
        Header("Content-Disposition: attachment;filename=" . $filename);
        ob_clean();     // 重点！！！
        flush();        // 重点！！！！可以清除文件中多余的路径名以及解决乱码的问题：
        //输出文件内容
        //读取文件内容并直接输出到浏览器
        echo fread($file1, filesize($file_dir));
        fclose($file1);
        @unlink($file_dir);
        exit();
    }
}