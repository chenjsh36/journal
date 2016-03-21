####使用css计数器counter自动生成目录

设计师设计了如下所示的列表图：
![design.png](http://upload-images.jianshu.io/upload_images/1642766-52c3de8c1873b0da.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

一开始的想法是在段落里面加入一个icon类，作为列表开头的数字，实现完后发现了一个问题，一旦出现换行，下一行会出现icon类的下方，不能实现设计师的设计稿。

但是把icon放在p的外面有不符合逻辑，而且写起来很麻烦。

后来想到使用伪元素before，因为before可以在元素添加进去前放一层在其下面，利用这个功能实现提前在段落前加入一个background-image为蓝色气泡的伪元素，然后定位到左上角，再让段落p有一段padding-left，使得每一段p左边都有一个图标，这样就不用在每个p中手动添加一个icon元素

接下来就是使用css3的一个新属性__counter__，这是css的content新加入的一个值，能够进行简单的加减乘除计数和重置，因此能够用来自动生成目录。这样就不用手动一个个去进伪元素中了。

<pre><code>
	.counter {
 
  		counter-reset: p-counter 0;
                //每当遇到counter类就重置计数器
    	}
	    .counter p {

		  counter-increment: 1;
                  // 每当遇到p元素就自增加1
	    }
	    .counter p:before {
	       	content: counter(p-counter);
                // 将计数器的值赋给p的伪元素的content
	    }
</code></pre>
这是前一周发现的css新特性，markdown了下来，结果真的用上了，所以多看看一些文章有利于提高自己解决方法的能力。