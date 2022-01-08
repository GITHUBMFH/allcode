<?php
namespace app\controller;

use app\BaseController;
use app\model\Basesql;
use think\facade\Db;

class Index extends BaseController
{
    public function index()
    {
        if (request()->method()=='POST') {
            $data =  request()->param('name');
            $result = Db::name('order')->select();
        }
        return json($result);
    }
    
    public function delete($name)
    {
        if (request()->method()=='POST') {
            $sql = Db::name($name);
            $id= request()->post('id');
            $result = $sql->where('id', 'in', $id)->delete();
            $data['msg']='成功';
            $eorro['msg']='删除失败';
            return $result?json($data):json($eorro);
        }
    }

    public function expExcel()
    {
        // 1.选取表中要输出数据
        $con = array(
            [
                'id' => 1,
                'name' => '名字',
                'image' => '头像'
            ],
            [
                'id' => 2,
                'name' => '名字2',
                'image' => '头像2'
            ],
        );
        //没有第二部
        //3.实例化PHPExcel类
        $objPHPExcel = new \PHPExcel();
        //4.激活当前的sheet表
        $objPHPExcel->setActiveSheetIndex(0);
        //5.设置表格头（即excel表格的第一行）
        $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue('A1', '订单列表')
            ->setCellValue('A2', '序号')
            ->setCellValue('B2', '姓名')
            ->setCellValue('C2', '性别')
            ->setCellValue('D2', '年龄')
            ->setCellValue('E2', '电话')
            ->setCellValue('F2', '地址')
            ->setCellValue('G2', '详细地址');

        //设置单元格宽度
        $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('A')->setWidth(10);
        $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('B')->setWidth(10);
        $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('C')->setWidth(10);
        $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('D')->setWidth(10);
        $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('E')->setWidth(10);
        $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('F')->setWidth(30);
        $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('G')->setWidth(30);
        // 设置基本样式
        $styleArray = array(
            'font'  => array(
                'bold'  => true,//设置字体加粗
                'color' => array('rgb' => 'ff0000'),//设置字体颜色
                'Italic'=> true,//设置字体倾斜
                'size'  => 11,//设置字体名
                'name'  => 'Verdana',//设置字体大小
                'Underline'=> true,//设置字体下划线
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
        //6.循环刚取出来的数组，将数据逐一添加到excel表格。
        for ($i = 0; $i < count($con); $i++) {
            $objPHPExcel->getActiveSheet()->setCellValue('A' . ($i + 3), $con[$i]['id']);//ID
            $objPHPExcel->getActiveSheet()->setCellValue('B' . ($i + 3), $con[$i]['name']);//姓名
            $objPHPExcel->getActiveSheet()->setCellValue('C' . ($i + 3), $con[$i]['image']);//性别
        }
        // 合并
        $objPHPExcel->getActiveSheet()->mergeCells('A1:G1');
        $objPHPExcel->getActiveSheet()->mergeCells('B5:G5');
        $objPHPExcel->getActiveSheet()->setCellValue('b5', '合并');


        $objPHPExcel->getActiveSheet()->setCellValue('A5', '=SUM(A2:A3)'); // 公式
        // 同一设置样式
        $objPHPExcel->getActiveSheet()->getStyle('A1:G'.(count($con)+2))->applyFromArray($styleArray);

        // 设置默认高度
        $objPHPExcel->getActiveSheet()->getDefaultRowDimension()->setRowHeight(15);
        // 第一行的默认高度
        $objPHPExcel->getActiveSheet()->getRowDimension('1')->setRowHeight(100);

        //7.设置保存的Excel表格名称
        $filename = 'user' . date('ymd', time()) . '.xls';
        //8.设置当前激活的sheet表格名称
        $objPHPExcel->getActiveSheet()->setTitle('user');
        //9.设置浏览器窗口下载表格
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header('Content-Disposition:inline;filename="' . $filename . '"');
        //生成excel文件
        $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        //下载文件在浏览器窗口
        $objWriter->save('php://output');
        exit;
    }
}
