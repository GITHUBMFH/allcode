---
title: python
date: 2019-06-09 11:53:42
tags: python
categories: 代码
---

* 常用细节
> #encodinng:utf-8,代码前加上这个避免乱码 
> ctrl+f5,运行程序 com+k清除命令行 ctl+c结束命令行
输入 exit() 退出 或者ctr+d

* 变量
```
name="hehe"
global num
print(name)
/t 空格
/n 换行
r 表示取消转义
```

* 列表
```
a=['1',"2","3"]
#类表的切片
print（a[1:2]）

# 修改列表
a.append("hee")
a.insert(2,haah)
a.remove("hee")
del a[4]
a.pop[4]

获取长度
len（a）
```

* 元组
>a=('1',"2","3"),不能修改

* 字典
>a={"dfs":34,"sdfd":"sdfd,"sdf":435,"dfs":}
>print(a["dfs"])

* 集合
>a={"dfs","sdfd","sdf","dfs"}
b=set(["dfs","sdfd","sdf","dfs"]) 可以去重

a={1,2,3,4,5,6}
b={4,5,6,7,8,9}
print(a-b) 可以去除a中和b相同的值
print(a|b) 合并2个集合
print(a&b) 集合的交集
print(a^b) 集合的差集

* if/else
```
a = int(input("请输入："))
if (a>100):
    print("1")
    if (a>100):
        print("1")
    else:
        print("3")
elif(a>120):
    print("2")
else:
    print("3")
```

* for
```
for i in range(10):
    print("打印第",i+1,"次")

a = {"name":"he","age":4}
for i in a:
    print(a[i])
```
* 函数
```
def show(name,age,hoddy,sex='男'):
    print('我叫：',name,"，年纪：",age,'，性别：',sex)

show(name='mfh',age=12,hoddy='df')

def addd(*args):
    sum=0
    for i in args:
        sum=sum+i
    return sum

d=addd(3,2)
print(d)
```

* 引入模块
import time
from random import choice,random
from random import *

urllib 爬虫模块
os 系统控制模块
webborwser 控制浏览器

安装第三方模块库
www.lfd.uci.edu
python3 -m pip install --upgrade pip 更新pip
pip install 库
pip uninstall 库
pip list 查看库
python3 -m pip install 库

* 文件读写
```
fl1=open(r'/Users/mfh/Desktop/RHINO快捷键 2.txt','r')
fl1=open(r'/Users/mfh/Desktop/RHINO快捷键 2.txt','w')# 覆盖写入
fl1=open(r'/Users/mfh/Desktop/RHINO快捷键 2.txt','a')# 追加写入
fl1=open(r'/Users/mfh/Desktop/RHINO快捷键 2.txt','rb')# 读取二进制
fl1=open(r'/Users/mfh/Desktop/RHINO快捷键 2.txt','wb')# 写入二进制
#6.r+读写模式,既能读又能以追加的模式写
#如果写的位置上已经有文本，会直接替换
f1=open(r"C:\aaadir\003.txt","r+")
#7.w+写读模式
#文件存在就清空再写入，不存在就先创建
f1=open(r"C:\aaadir\003.txt","w+")
#8.a+追加读写模式
#和r+不同点：a+模式在读的时候自动定位到开头，
#写的时候自动定位到末尾
#a+模式中如果文件不存在就会创建，而r+会报错
f1=open(r"C:\aaadir\003.txt","a+")

# 读取
# data=fl1.read() 
# data=fl1.readline() #读取一行
# data=fl1.readlines() #按行读取一行

#还有一种方式,会自动处理异常，而且会帮我们关闭文件句柄：*****
with open(r"C:\aaadir\001.jpg","rb") as f1,open(r"C:\bbbdir\001.jpg","wb") as f2:
	f2.write(f1.read())

#11.附加：文件重命名和删除
#import os
# os.rename("F:/001.txt","F:/111.txt")
# os.remove("F:/003.txt")
# os.mkdir("文件夹路径")


# print(data)
for i in fl1: # 读取大文件
    print(i)

# 覆盖写入
# fl1.write('hehe")

fl1.close()
```

* 类
```
class dog(object):
    typee='dog'
    def __init__ (self,name,age,color):
        self.name = name
        self.age = age
        self.color = color
    
    def eat(self,food):
        print(self.name,"在吃",food)

dog = dog("fe",'ef','err')
print(dog.name)
dog.eat('haha')
```

* 线程
```
import threading
import time

lock = threading.Lock() #线程锁

def run(name):
    lock.acquire() #锁住 代表这块代码一次只能执行一个线程 不会有冲突
    global num
    print(name)
    time.sleep(5)
    lock.release() #释放锁


t1=threading.Thread(target=run,args=("t1",))
t2=threading.Thread(target=run,args=("t2",))
<!-- 开启线程 -->
t1.start() #开始线程
t2.start()
<!-- 加入主线程 -->
t1.join() #加入主线程
t2.join()

print("执行完毕")
```

* 多线程
```
from multiprocessing import Process
import time
def run(name):
    print(name)
    time.sleep(5)

if __name__ == '__main__':
    t1=Process(target=run,args=("t1",))
    t2=Process(target=run,args=("t2",))
    t3=Process(target=run,args=("t3",))
    t4=Process(target=run,args=("t4",))
    t5=Process(target=run,args=("t5",))

    t1.start() #开始线程
    t2.start()
    t3.start()
    t4.start()
    t5.start()
 ```

 * 数据库
 下载模块 pip install pymysql
 ```
  import pymysql
    db = pymysql.Connect(host="localhost",port=3306,user="test",passwd="123456",db="stu",charset="utf-8")
    cursor = db.cursor()
    sql = """create table student(
        id int not null
        name varchar(20)
        age int
    )
"""
cursor.execute(sql)

 ```

 * 日期
 import datetime

#获取当前日期
 ```
# now=datetime.datetime.now()
# print(now)

#获取一个指定的日期
# d=datetime.datetime(2019,10,1,12,23,40)
# print(d)

#日期转字符串
# now=datetime.datetime.now()
# d=now.strftime("%Y====%m=====%d %H:%M:%S")
# print(d)

#字符串转日期
s="2020-8-15 2:30:20"
d=datetime.datetime.strptime(s,"%Y-%m-%d %H:%M:%S")
print(type(d))
 ```

 * json转换
 ```
 import json

#json转字典
j='{"city":"北京","name":"熊猫"}'
#p=json.loads(j)
#print(type(p))

#字典转json
dictt={"city":"北京","name":"熊猫"}
ss=json.dumps(dictt,ensure_ascii=False)
print(type(ss))
 ```


 * 解码和编码
  ```
 #python3中字符串的两种类型：byte,str,str存储unicode类型，bytes存储byte类型

#字符串（unicode）转byte-----编码
a="我爱北京天安门"
b=a.encode("gbk")#转成字节码
# print(b)


#byte转字符串（unicode）----解码
c=b.decode("gbk")
print(c)

#编码方式和解码方式要一致
 ```