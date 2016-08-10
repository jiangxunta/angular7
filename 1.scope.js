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
    
};
var scope = new Scope();
scope.name = 1;
scope.age = 1;
scope.$watch('name',function (newVal,oldVal) {
});
scope.$watch('age',function (newVal,oldVal) {
});
console.log(scope.$$watchers)