---
title: python
date: 2019-06-09 11:53:42
tags: python爬虫
categories: 代码
---

# 访问url
 ```
# import urllib.request
from urllib import request
import re
url = r'http://www.baidu.com/'

#构造请求头信息User-Agent
header={
"User-Agent":"Mozilla/5.0 (Linux; U; An\
droid 8.1.0; zh-cn; BLA-AL00 Build/HUAW\
EIBLA-AL00) AppleWebKit/537.36 (KHTML, l\
ike Gecko) Version/4.0 Chrome/57.0.2987.13\
2 MQQBrowser/8.9 Mobile Safari/537.36"
}

#创建自定义请求对象  
#反爬虫机制1：判断用户是否是浏览器访问
#可以通过伪装浏览器进行访问

# 创建自定义请求对象
req=request.Request(url,headers=header)

response = request.urlopen(req).read().decode()  # 记得用decode解码


pat = r"<title>(.*?)</title>"

data = re.findall(pat, response)  # 通过正则表达式清洗数据

print(data)
 ```

# http和https和ip代理处理
```
#创建自定义opener
from urllib import request

#构建HTTP处理器对象（专门处理HTTP请求的对象）
http_hander=request.HTTPHandler()

#创建自定义opener
opener=request.build_opener(http_hander)

#创建自定义请求对象
req=request.Request("http://www.baidu.com")

#发送请求，获取响应
reponse=opener.open(req).read()
#或者
#把自定义opener设置为全局，这样用urlopen发送的请求也会使用自定义的opener;
request.install_opener(opener)
reponse=request.urlopen(req).read()

print(reponse)

> ip 代理
proxylist=[
	{"http":"101.248.64.82:80"}
]

proxy=random.choice(proxylist)

#构建代理处理器对象
proxyHandler=request.ProxyHandler(proxy)

#创建自定义opener
opener=request.build_opener(proxyHandler)

#创建请求对象
req=request.Request("http://www.baidu.com")

res=opener.open(req)
 ```

# got和post 处理 2.11和 2.17
 ```
 # go和post处理
wd={"wd":"北京"}

url="http://www.baidu.com/s?"

#构造url编码
# data=rllib.parse.urlencode(formdata).encode(encoding='utf-8')
wdd=urllib.parse.urlencode(wd)

url=url+wdd

# req=request.Request(url,data=data,headers=header)
req=request.Request(url)

reponse=request.urlopen(req).read().decode()

print(reponse)

 ```

# 利用requests模块
> get
```
import requests

headers = {
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Ap\
pleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Sa\
fari/537.36"
}

wd={"wd":"中国"}

response=requests.get("http://www.baidu.com/s?",params=wd,headers=headers)

data=response.text #返回一个字符串形式的数据

data2=response.content #返回一个二进制形式的数据

print(data2.decode())
```
> post
```
import requests
import re

#构造请求头信息
header={
"User-Agent":"Mozilla/5.0 (Linux; U; An\
droid 8.1.0; zh-cn; BLA-AL00 Build/HUAW\
EIBLA-AL00) AppleWebKit/537.36 (KHTML, l\
ike Gecko) Version/4.0 Chrome/57.0.2987.13\
2 MQQBrowser/8.9 Mobile Safari/537.36"
}

url="http://fanyi.youdao.com/translate?smartresult=dict&smartresult=rule"

key="自学"

#post请求需要提交的参数
formdata={
	"i":key,
	"from":"AUTO",
	"to":"AUTO",
	"smartresult":"dict",
	"client":"fanyideskweb",
	"salt":"15503049709404",
	"sign":"3da914b136a37f75501f7f31b11e75fb",
	"ts":"1550304970940",
	"bv":"ab57a166e6a56368c9f95952de6192b5",
	"doctype":"json",
	"version":"2.1",
	"keyfrom":"fanyi.web",
	"action":"FY_BY_REALTIME",
	"typoResult":"false"
}


response=requests.post(url,headers=header,data=formdata)

#正则表达式 提取"tgt":"和"}]]中间的任意内容
pat=r'"tgt":"(.*?)"}]]'

result=re.findall(pat,response.text)

print(result)
```

>设置代理

#设置ip地址
```
proxy={
"http":"http://101.248.64.72:80",
"http":"http://101.248.64.68:80",
"https":"https://101.248.64.72:80",
}

response=requests.get("http://www.baidu.com",proxies=proxy)

print(response.content.decode())
```
> 获取响应的cookie
```
import requests

response=requests.get("http://www.baidu.com")

#1.获取返回的cookiejar对象
cookiejar=response.cookies

#2.将cookiejar转换成字典
cookiedict=requests.utils.dict_from_cookiejar(cookiejar)

print(cookiejar)
```
>利用session登录
```
#使用session实现登陆

import requests

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36"}

#创建session对象
ses=requests.session()

#构造登陆需要的参数
data={"email":"3254272716@qq.com","password":"123321a"}

#通过传递用户名密码得到cookie信息
ses.post("http://www.renren.com/PLogin.do",data=data)

#请求需要的页面
response=ses.get("http://www.renren.com/880151247/profile")

print(response.text)
```

# scrapy框架使用
> 安装
pip install Scrapy
> 创建项目
scrapy startproject 项目名称
scrapy.cfg ：项目的配置文件
items.py ：项目的目标文件
pipelines.py ：项目的管道文件
settings.py ：项目的设置文件
spiders/ ：存储爬虫代码目录

> 创建爬虫
scrapy genspider 名称 主机地址

> 开始爬虫
scrapy crawl 爬虫名称 -o 名称.文件格式
> yield item #通过yield关键字的方式把每一个itme传到pipelines

> 新建mian.py,可以直接运行这个文件
from scrapy import cmdline
cmdline.execute('scrapy crawl sun'.split())

# 写入excel
> 使用xlswriter模块
```
import xlsxwriter

#创建文件，并添加一个工作表
workbook=xlsxwriter.Workbook('demo.xlsx')
worksheet=workbook.add_worksheet()

#在指定位置写入数据
worksheet.write("A1","我要自学网")
worksheet.write("A2","python初学者教程")

data1=pattern1.findall(response)
data2=pattern2.findall(response)

for i in range(0,len(data1)):
	#写入数据
	worksheet.write("A"+str(i+1),data1[i])
	worksheet.write("B"+str(i+1),data2[i])

print(resultlist)

#关闭表格文件
workbook.close()
```
* lmxl模块使用
https://www.cnblogs.com/zhangxinqi/p/9210211.html#_label4
html=etree.HTML(text)
```
from lxml import etree

#获取本地html文档
html=etree.parse(r"C:\file\hello.html")
#获取现有html
html=etree.HTML(text)
#将html对象转成字符串
result=etree.tostring(html,encoding="utf-8").decode()


result=html.xpath("//span") #获取所有span标签的信息
print(result[0].text)

获取class为item-88的li标签里的值
# result1=html.xpath("//li[@class='item-88']")
获取li标签下a标签中href为link2.html标签里的值
result2=html.xpath("//li/a[@href='link2.html']")

获取li的class的值
# result1=html.xpath("//li/@class")
result2=html.xpath("//li/a/@href")

result1=html.xpath("//li/a") #获取下一级子标签
result2=html.xpath("//li//span") #获取所有符合条件子标签

#获取li标签下a标签里所有的class
result3=html.xpath("//li/a//@class")

#获取倒数第二个li元素下a的内容
#result1=html.xpath("//li[last()-1]/a")

result3=html.xpath("//*[@class='bold']")
print(result3[0].tag) #.tag表示获取标签名
```

* #模块下载安装：pip install bs4
```
#解析字符串形式的html
soup=BeautifulSoup(html,"lxml")
# #解析本地html文件
# soup2=BeautifulSoup(open("index.html"))

# #获取标签内容
# print(soup.title.string)
# #获取标签名
# print(soup.title.name)
# #获取标签内所有属性
# print(soup.p.attrs["name"])
#获取直接子标签，结果是一个列表
# print(soup.head.contents)
#获取直接子标签，结果是一个生成器
# for i in soup.head.children:
# 	print(i)

#根据字符串查找所有的a标签，返回一个结果集，里面装的是标签对象
# data=soup.find_all("a")
# for i in data:
# 	print(i.string)

#根据正则表达式查找标签
# data2=soup.find_all(re.compile("^b"))
# for i in data2:
# 	print(i.string)

#根据属性查找标签
# data3=soup.find_all(id="link2")
# for i in data3:
# 	print(i)

#根据标签内容获取标签内容
data4=soup.find_all(text="Lacie")
data5=soup.find_all(text=["Lacie","Tillie"])
data6=soup.find_all(text=re.compile("Do"))

# #解析字符串形式的html
soup=BeautifulSoup(html,"lxml")

#CSS选择器类型：标签选择器、类选择器、id选择器

#通过标签名查找
# data=soup.select("a")

#通过类名查找
# data=soup.select(".sister")

#通过id查找
# data=soup.select("#link2")

#组合查找
# data=soup.select("p #link1")

#通过其他属性查找
data=soup.select('a[href="http://example.com/tillie"]')
```

* 使用selenium
https://www.cnblogs.com/momoon/p/11850831.html
基本使用
https://www.jianshu.com/p/3aa45532e179
pip install -U selenium
下载Chromedriver版本
安装Chromedrive
将下载好的可执行文件移动到/usr/local/bin目录中；
http://chromedriver.storage.googleapis.com/index.html?path=83.0.4103.39/