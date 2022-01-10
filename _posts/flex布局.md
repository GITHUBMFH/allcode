<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: mfh
 * @Date: 2019-05-28 14:48:56
 * @LastEditors: mfh
 * @LastEditTime: 2021-12-17 05:13:57
-->
---
title: flex布局
date: 2019-05-28 14:48:56
tags: flex
categories: 代码
---

> 容器的属性
```
flex-direction: row | row-reverse | column | column-reverse;  //主轴的方向
flex-wrap: nowrap | wrap | wrap-reverse; //换行排序
justify-content: flex-start | flex-end | center | space-between | space-around;  //项目在主轴上的对齐方式
align-items: flex-start | flex-end | center | baseline | stretch;  //项目在交叉轴上如何对齐。
align-content: flex-start | flex-end | center  | stretch| space-between | space-around; 垂直方向
```

> 项目的属性
```
order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。
flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。
align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，
```

> 兼用写法，参考链接https://www.cnblogs.com/zhongfufen/p/6424189.html
```
  display: box;         
  display: -webkit-box; 
  display: -moz-box;    
  display: -ms-flexbox; 
  display: -webkit-flex;
  display: flex

  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  -o-justify-content: center;
  justify-content: center;

  -webkit-box-align: center;
  -webkit-align-items: center;
  -moz-align-items: center;
  -ms-align-items: center;
  -o-align-items: center;
  align-items: center;
```

transition: all .3s;
-webkit-transition: all .3s;

transform: translate3d(-220px,0,0);
-webkit-transform: translate3d(-220px,0,0);

left:50%;top:50%;
transform:translate(-50%,-50%);
-ms-transform:translate(50%,50%); 	/* IE 9 */
-moz-transform:translate(50%,50%); 	/* Firefox */
-webkit-transform:translate(50%,50%); /* Safari 和 Chrome */
-o-transform:translate(50%,50%); 


> 网格
display: grid | inline-grid;
grid-template-columns  可以是长度值，百分比，或者等份网格容器中可用空间（使用 fr 单位）repeat() minmax(100px, 1fr);
grid-template-areas:
    "h h h h h h h h h h h h"
    "m m c c c c c c c c c c"
    "f f f f f f f f f f f f";
    ". f f f f f f f f f f .";

grid-template
grid-column-gap
grid-row-gap
grid-gap   间隙

justify-items
align-items
place-items
justify-content
align-content
place-content

grid-auto-columns
grid-auto-rows
grid-auto-flow  row和column，还可以设成row dense和column dense

grid

子元素 网格项(Grid Items) 属性
grid-column-start
grid-column-end
grid-row-start
grid-row-end
grid-column
grid-row
grid-area
justify-self
align-self
place-self