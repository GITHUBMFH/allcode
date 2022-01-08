<?php
/*
 * @Description:
 * @Version: 2.0
 * @Autor: mfh
 * @Date: 2021-09-29 14:23:35
 * @LastEditors: mfh
 * @LastEditTime: 2021-10-01 21:56:22
 */
declare(strict_types = 1);

namespace app\proxy\controller;

use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7\Response;
use QL\QueryList;
use think\facade\Db;
use think\facade\Log;

class Index
{
    public $x=1;
    public $ips=[];
    public $start;
    public $usecount=0;

    public function index()
    {
        // $interval=1;
        ignore_user_abort();//关掉浏览器，PHP脚本也可以继续执行.
        set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
        $this->ips = Db::name('useip')->select()->toArray();
        do {
            $run = include 'shop.php';
            if (!$run) {
                die('程序停止');
            }
            $this->start = microtime(true);
            $this->getdata($this->x);
            // sleep($interval);
            usleep(50000);
            $this->x++;
        } while ($this->x<=3);
        Log::write('完成');
        die;
    }
    // 获取代理ip
    public function getdata($x)
    {
        try {
            $count= rand(0, count($this->ips)-1);
            $proxy= $this->ips[$count]['ip'].':'.$this->ips[$count]['port'];
            $ql = QueryList::get("https://www.kuaidaili.com/free/inha/".$x, null, [
            'timeout' => 1,
            'proxy' => 'http://'.$proxy,
            'headers' => [
                'Accept-Encoding'=> 'gzip, deflate, br',
                'Connection'=> 'keep-alive',
                'Host'=> 'www.kuaidaili.com',
                'Referer'=> 'https=>//www.kuaidaili.com/free/inha',
                'User-Agent'=> 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
                'X-Requested-With'=> 'XMLHttpRequest'
            ]
        ]);
            $table = $ql->find('table');
            // 采集表的每行内容
            $tableRows = $table->find('tr:gt(0)')->map(function ($row) {
                $datas = $row->find('td')->texts()->all();
                $data['ip']=$datas[0];
                $data['port']=$datas[1];
                $data['type']=$datas[3];
                $data['place']=$datas[4];
                $data['state']=$datas[2];
                return $data;
            })->all();
            
            $end = microtime(true);

            $time=$end-$this->start ;
            $timetext=number_format($time, 5, '.', '')."秒";
            Log::write($proxy.'连接成功,消耗时间:'.$timetext.',已完成:'.$this->x);
            foreach ($tableRows as $row) {
                Db::name('ip')->strict(false)->replace()->insert($row);
            }
        } catch (ConnectException $e) {
            // Log::write($proxy.'连接错误,消耗时间:'.$timetext);
            $run = include 'shop.php';
            if (!$run) {
                die('process abort');
            }
            $this->getdata($this->x);
        } catch (RequestException $e) {
            // $end = microtime(true);
            // $time=$end-$start;
            // $timetext=number_format($time, 5, '.', '')." 秒";
            // Log::write($proxy.'请求错误,消耗时间:'.$timetext);
            $run = include 'shop.php';
            if (!$run) {
                die('process abort');
            }
            $this->getdata($this->x);
        }
    }

    // 多线程
    public function mulget()
    {
        $urls = [];
        for ($x=1; $x<=2; $x++) {
            array_push($urls, "https://www.kuaidaili.com/free/inha/".$x);
        };
        $ips = Db::name('useip')->select()->toArray();
        $count= rand(0, count($ips)-1);
        $proxy= $ips[$count]['ip'].':'.$ips[$count]['port'];

        QueryList::multiGet($urls)
        // 设置并发数为2
        ->concurrency(2)
        // 设置GuzzleHttp的一些其他选项
        ->withOptions([
        'timeout' => 6,
        ])
        // 设置HTTP Header
        ->withHeaders([
            'Accept-Encoding'=> 'gzip, deflate, br',
            'Connection'=> 'keep-alive',
            'Host'=> 'www.kuaidaili.com',
            'Referer'=> 'https=>//www.kuaidaili.com/free/inha',
            'User-Agent'=> 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
            'X-Requested-With'=> 'XMLHttpRequest'
        ])
        // HTTP success回调函数
        ->success(function (QueryList $ql, Response $response, $index) {
            $data = $ql->find('table')->find('tr:gt(0)')->map(function ($row) {
                $datas = $row->find('td')->texts()->all();
                $data['ip']=$datas[0];
                $data['port']=$datas[1];
                $data['type']=$datas[3];
                $data['place']=$datas[4];
                $data['state']=$datas[2];
                return $data;
            })->all();
            dump($data);
        })
        // HTTP error回调函数
        ->error(function (QueryList $ql, $reason, $index) {
            // ...
            dump($reason);
        })
        ->send();
    }

    public $endcount;
    public $starcount;
    // 筛选出可以用的ip
    public function usefulid($count,$end=true)
    {
        $ips = Db::name('ip')->select()->toArray();;
        ignore_user_abort();//关掉浏览器，PHP脚本也可以继续执行.
        set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
        $this->starcount = $count;
        $this->endcount = $end?count($ips)-1:$count+10000;
        do {
            $run = include 'shop.php';
            if (!$run) {
                die('process abort');
            }
            $this->start = microtime(true);
            $this->checkip($ips[$this->starcount]['ip'].':'.$ips[$this->starcount]['port'], $ips[$this->starcount]);
            usleep(10000);
            $this->starcount++;
        } while ($this->starcount<=$this->endcount);
        Log::write('完成');
        die;
    }
    public $cscount=0;
    // 检查ip是否可用
    public function checkip($ip, $data)
    {
        try {
            $ql = QueryList::get('http://www.baidu.com', [], [
                        // 设置代理
                        'proxy' => 'http://'.$ip,
                        //设置超时时间，单位：秒
                        'timeout' => 3,
                        'headers' => [
                            'Referer' => 'https://querylist.cc/',
                            'User-Agent' => 'testing/1.0',
                            'Accept'     => 'application/json',
                            'X-Foo'      => ['Bar', 'Baz'],
                            'Cookie'    => 'abc=111;xxx=222'
                        ]
                    ]);
            $result=Db::name('csip')->strict(false)->replace()->insert($data);
            if ($result) {
                $end = microtime(true);
                $time=$end-$this->start ;
                $timetext=number_format($time, 5, '.', '')."秒";
                $this->usecount++;
                Log::write('插入数据:'.$ip.'有效,消耗时间:'.$timetext.'共插入'.$this->usecount);
            }else{
                Log::write('插入数据:'.$ip.' 失败');
            }
        } catch (ConnectException $e) {
            // Log::write($ip.'无效');
            $run = include 'shop.php';
            if (!$run) {
                die('process abort');
            }
        } catch (RequestException $e) {
            // Log::write('请求错误');
            $run = include 'shop.php';
            if (!$run) {
                die('process abort');
            }
        }
        $this->cscount++;
        Log::write('完成'.$this->cscount.'个检测,测试排序:'.$this->starcount);
    }
}
