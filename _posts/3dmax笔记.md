---
title: 3dmax笔记
date: 2019-08-18 09:52:40
tags:
categories:
---
>控制页面上的工具面板
* 菜单栏->自定义->显示ui
* 左下角可以控制视图的布局，如果有调节布局可以放在视图交界处又键重置视图。
* ctr+x 专家模式，可以隐藏所有工具只看视图。
* 更改皮肤 菜单栏->自定义->加载自定义用户界面方案
* 工具栏右键可以对工具栏进行隐藏和显示。
* 删除视图右上角的图标，右键->配置->viewcoube取消就可以了
* 锁定工具栏就不会随意移动了，菜单栏->自定义->锁定ui布局
* 设置单位，菜单栏->自定义->单位设置->系统单位设置.
* 设置自动保存文件，菜单栏->自定义->首选项->文件->启动自动备份，文件会自动保存在文档->3dmax->autoback

>视图操作
* 右键取消
* 平移快捷键 鼠标中间
* 视图缩放 鼠标中间滑动
* 旋转 alt+鼠标中键
* z键 显示所有对象，选择对象再按z可以最大化这个对象
* alt+w 最大化所选视图
<!-- * ctrl+w 放大可视物体的视图 -->
* t l f p可以切换视图的方向。
* 在透视图按 F3切换线框模式，F4默认 
* 选中对象alt+x透明化
* g 隐藏栅格，右键上部工具栏一个3图标的->主栅格
* 参数调整，鼠标放在上下的地方一直按着左键可以微调可以归零，之后如果右键可以恢复到原来的值
* 保存为图片，shift+q渲染 界面-> 保存

* 选择对象有2种方式,交叉和窗口 ,菜单栏->自定义->首选项->常规->设置方向切换选择方式,也可以在上部工具栏选择
* h 按名称选择

* shift+拖动=复制，实例可以同时改变复制出来的，参考复制出来的和实例一般，但是修改器不会一起变动。
* alt+a对齐，点击要对齐的对象,还有快速对齐轴心得工具
* w是移动，e是旋转，r缩放，右键图标都是可以设置参数的，有绝对的参数和相对的参数。或者在底部也可以快速调节
* r缩放,可以选择挤压缩放，里面的体积不变
* a 角度捕捉，s捕捉开关
* 2维捕捉只是可以捕捉xy轴上的点，2.5对应不同视图的网格。捕捉的时候如果圆没有出现切点，就是这个圆的阔值不够大，圆是又一条条线段组成的。顶点可以替代端点。右键捕捉->选项->启用轴约束->F5约束x轴 F6约束y轴 F7约束z轴
* + - 可以对轴的大小进行调整。
* 在输入框中ctr+n弹出计算器
* 阵列，右键菜单->附加
* alt+q 孤立选择的对象，只是显示所选对象
* 空格 锁定选择的对象，其他的不能编辑。锁定锁定选定的点。
* 选择对象右键->冻结，选择的物体不会被编辑。冻结的对象一般是没有办法捕捉的，右键捕捉->选项->捕捉到冻结对象。可以在右边工具栏->显示中操作解冻。可以更改冻结对象的颜色，菜单栏->自定义->自定义用户界面->颜色->冻结
* 选择集，上部工具栏，输入名称就可以了。可以结合组来使用


>组，组内是不能编辑物体的。
* 选择物体选择组，可以成组。解组=解开物体组合
* 炸开=可以分解所有物体。
* 附加=添加到一个组
* 分离=分离出某个组前先打开组
* 自定义组的快捷键 菜单栏->自定义->加载自定义用户界面->键盘->类别=ground

* 画图形的时候又自动栅格和开始新图形可以勾选，自动栅格是可以在新的物体创建物体，开始新图形则是之后创建的是新的图形不会跟着一起移动。
* 修改->配置修改器集->显示列表中所有集合，可以让修改器分类更加细化。
* 修改->配置修改器集->配置修改集+显示按钮，可以添加显示我们经常用的几个修改器。
* 右键转换可编辑样条线或者添加可编辑样条线修改器 可编辑样条线 顶点，线段，样条线
线段用拆分的时候，记得把点变成角点，这样才可以平分。
* 修改->几个体，附加，附加多个可以吧几个图形组合
* 顶部工具栏 使用选择中心，轴会自动在选择对象的中
* 可编辑样条线加点的方式，点->优化，线段->分段

* i 可以把鼠标的位置居中显示
* 使用不同的材质时，在修改器要勾选使用图形id，同时也要在对象线段曲面属性中设置图形id
* 间隔工具 shift+i，根据路径复制对象

> 平面贴图：右边工具栏->实用工具->资源浏览器，找到图片直接拖到平面上面，在前视图要F4明暗处理,选择平面右键属性勾选冻结，去掉以灰色显示冻结对象。

> uvw展开
* ctrl+e，编辑uvw
* 重新编辑uv贴图，uvw修改器->投影->点击平面贴图
* 选择要断开的线段->编辑uvw中的炸开中的断开（设置uv接缝绿色的线）->编辑uvw中底部按元素uv切换选择->剥->右键松弛
* 编辑uvw中全选->排列元素->紧缩
* 要记得打开 uvw修改器->选择->按元素xy切换选择

> 修改器
> 样条线建模
* 挤出
* 倒角修改器
* 倒角剖面，是根据某个形状进行挤出。以其中一条为路径，另一条为截面得到三维图形。和车削不同的是可以自定义路径，车削只能360度。
* 车削修改器，是画出侧面，然后根据侧面360循环，比如漏斗。
* 间隔工具 shift+i，根据路径复制对象

> 实体建模
* 弯曲修改器
* 扭曲修改器
* 壳修改器
* 锥化
* 路径变现
* ffd
* 晶格
* 噪波
* 松弛
* 置换

> 复合建模
* 超级布尔
* 放样 ，修改器->变现（可以在弹出框添加点来调节图形的形状）
* 图层合并

> 其他建模
* cloth修改器，可以快速建立抱枕，对象属性->勾选布料->压力阻力都设成50->确定->模拟局部，执行修改器的物体一定要分段，u弯曲越小物体越柔软
* massfx 右键上部工具栏->调出massfx->选择物体定义为动态钢体（受重力影响，第一个）（动态钢体不受影响，第三个)(静态柔体，衣服的标记)

> 编辑多边形
* 右键->属性->勾选背面消隐，在视图中背面会不可见
* 添加法线修改器，可以使背面和正面互换，一般制作房间
* 边界是指有漏洞的地方，闭合多边形是没有边界的，
* 在附加多个对象之后，元素就是选择附加里面的某个对象
* 点的移除会保留面，而del是不会保留面的
* 焊接只能焊接相连得2个点
* 使用ctl（加选）或者alt（减选）加上边上的选择按钮可以更好的选择
* 边选择情况下ctl +移除，可以把多余的点也删除
* 面的选择情况下，挤出倒角都有2个模式可以选择，翻转相当于添加一个法线修改器
* 切片平面->切片就可以切割
* 面的分离，有3个模式，分离到元素，分离出来还是组合在这一堆的元素中。
* 选择边->转换到面，可以把这边的面选中。
* 可以在编辑多边形进行约束移动


> unfold教程
* e 最大化视图
* 双击可以选择同一圈的线，选边F2，shift可以一直选
* c切割
* w缝合，当切割错的时候可以选择错的边进行缝合
* p 分割和主体分离显示
* u展开 o优化
* h隐藏 y全部显示 i显示选中
* alt+鼠标左（旋转）中（移动）右（缩放）
* ctr+shift 减选
* a 以选择的边旋转
* f最大化选择的边
* alt+b适配

> 摄像机
* c切换到摄像机视图，ctl+c设置成摄像机视图，shift+c隐藏摄像机
* 设置近距和远距离可以调节视口的范围
* 右键摄像机->添加摄像机修改器
* shift+f安全框=渲染的的视图