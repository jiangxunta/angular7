function Scope() {
    this.$$watchers = [];
}
//当我们调用$watch方法时，会传递两个参数 当前监控的变量和回调函数
Scope.prototype.$watch  = function (exp,fn) {
    //每当watch触发时候就要把当前的监听者放入到$$watchers
    this.$$watchers.push({
        exp:exp,
        fn:fn,
        last:this[exp]
    })
};
Scope.prototype.$apply = function () {
    console.log(this.$$watchers);//[ { exp: 'name', fn: [Function], last: 1 } ]
    //他是如何更新，根据last的值和当前的值进行比较看有没有变化，
    //遍历每一个$$watchers,看值有没有变
    this.$$watchers.forEach((item)=>{
        item.last //上一次的值  1
       // this[item.exp] //当前最新的值  2 现在的值，在当前作用域下取当前item上表达式对应的值
        //脏检查
        if(item.last !=this[item.exp]){
            item.fn(this[item.exp],item.last);
            //现在的值要变成旧的
            item.last = this[item.exp];
        }
    });
};
var scope = new Scope();
scope.name = 1;
scope.age = 1;
scope.$watch('name',function (newVal,oldVal) {
   scope.age = Math.random();
    console.log(scope.age)
});
scope.$watch('age',function (newVal,oldVal) {
    scope.name = Math.random();
    console.log(scope.name)
});
scope.name = 2;
scope.$apply();
