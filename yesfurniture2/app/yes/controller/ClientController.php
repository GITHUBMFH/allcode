<?php
namespace app\yes\controller;

use app\yes\model\ClientModel;
use app\yes\model\BankModel;
use cmf\controller\AdminBaseController;
use think\Db;
use think\facade\Cache;

class ClientController extends AdminBaseController
{
    public function index()
    {
        if ($this->request->isPost()) {
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $client = ClientModel::with(['address'])
                    ->page($page, $limit)
                    ->order('id','desc')
                    ->select()
                    ->hidden(['address'=>['id','address_type','type_id']]);
            $count = ClientModel::with(['address'])
                    ->select()
                    ->count();
            $data["data"]=$client;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        };
        return $this->fetch();
    }

    public function addPost()
    {
        if ($this->request->isPost()) {
            $data['s_name'] = $this->request->param('s_name');
            $data['name'] = $this->request->param('name');
            $address['address'] = $this->request->param('address');
            
            $result = new ClientModel;
            $mian = $result->save($data);
            $less = $result->address()->save($address);
            if ($mian || $less) {
                return $this->success('提交成功');
            } else {
                return $this->error('提交失败');
            }
        }
    }

    public function editPost()
    {
        if ($this->request->isPost()) {
            $updtaId = $this->request->param('id');
            $data['s_name'] = $this->request->param('s_name');
            $data['name'] = $this->request->param('name');
            $address['address'] = $this->request->param('address');
            
            $result = new ClientModel;
            $mian = $result->where('id', $updtaId)->update($data);
            $less = $result->address()->where('type_id', $updtaId)->update($address);
            if ($mian || $less) {
                return $this->success('提交成功');
            } else {
                return $this->error('提交失败');
            }
        }
    }

    public function delPost()
    {
        if ($this->request->isPost()) {
            $updtaId = $this->request->param('id');
            $result = new ClientModel;
            $count = Db::name('order')->where('client_id',$updtaId)->count();
            if($count>0){
                return $this->error('客户有生产单联系,请先修改生产单');
            }else{
                $mian = $result->where('id', $updtaId)->delete();
                $less = $result->address()->where('type_id', $updtaId)->delete();
                $contact = $result->contact()->where('contact_id', $updtaId)->delete();
            }
            if ($mian || $less || $contact) {
                return $this->success('提交成功');
            } else {
                return $this->error('提交失败');
            }
        }
    }

    // 联系方式操作
    public function contact()
    {
        return $this->fetch();
    }

    public function checkContact()
    {
        if ($this->request->post()) {
            $contactId = $this->request->param('id');
            $result = ClientModel::get($contactId);
            $contact = $result->contact()->select();
            $count = $contact->count();
            $data["data"]=$contact;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }

    public function addContact()
    {
        if ($this->request->post()) {
            $data['name'] = $this->request->param('name');
            $data['number'] = $this->request->param('number');
            $data['station'] = $this->request->param('station');
            $contactId = $this->request->param('id');
            $result = ClientModel::get($contactId);
            $contact = $result->contact()->save($data);
            if ($contact) {
                return $this->success('提交成功');
            } else {
                return $this->error('提交失败');
            }
        }
    }

    public function editContact()
    {
        if ($this->request->post()) {
            $updtaId = $this->request->param('id');
            $data['name'] = $this->request->param('name');
            $data['number'] = $this->request->param('number');
            $data['station'] = $this->request->param('station');
            $result = new ClientModel;
            $contact = $result->contact()->where('id', $updtaId)->update($data);
            if ($contact) {
                return $this->success('修改成功');
            } else {
                return $this->error('修改失败');
            }
        }
    }

    public function delContact()
    {
        $updtaId = $this->request->param('id');
        $result = new ClientModel;
        $contact = $result->contact()->where('id', $updtaId)->delete();
        if ($contact) {
            return $this->success('删除成功');
        } else {
            return $this->error('删除失败');
        }
    }

    public function bank()
    {
        if ($this->request->isPost()) {
            $contactId = $this->request->param('id');
            $result = ClientModel::get($contactId);
            $client = $result->bank()->select();
            $count = $client->count();
            $data["data"]=$client;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        };
        return $this->fetch();
    }

    public function bankAdd()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = new BankModel;
            $order  = $result->allowField(true)->save($data);
            if ($order) {
                $this->success('提交成功');
            } else {
                $this->error('提交失败');
            }
        }
    }

    public function bankEdit()
    {
        if ($this->request->isPost()) {
            $data = $this->request->param();
            $result  = new BankModel;
            $order  = $result->allowField(true)->update($data);
            if ($order) {
                $this->success('提交成功');
            } else {
                $this->error('提交失败');
            }
        }
    }

    public function bankDel()
    {
        if ($this->request->isPost()) {
            $id = $this->request->param('id');
            $result  = new BankModel;
            $order  = $result->destroy($id);
            if ($order) {
                $this->success('删除成功');
            } else {
                $this->error('删除失败');
            }
        }
    }

    // 搜索
    public function searchlst()
    {
        if ($this->request->isPost()) {
            // 获取分页数据
            $page = $this->request->param('page');
            $limit = $this->request->param('limit');
            $where = $this->request->param();
            unset($where['page']);
            unset($where['limit']);
            $result = ClientModel::with(['address'])
                    ->where('name','like','%'.$where['name'].'%')
                    ->page($page, $limit)
                    ->select()
                    ->hidden(['address'=>['id','address_type','type_id']]);
            $count = ClientModel::with(['address'])
                    ->where('name','like','%'.$where['name'].'%')
                    ->select()
                    ->count();
            $data["data"]=$result;
            $data["code"]=0;
            $data["msg"]='';
            $data["count"]=$count;
            return $data;
        }
    }
}
