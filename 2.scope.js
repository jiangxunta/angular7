function Scope() {
    this.$$watchers = [];
}
Scope.prototype.$watch  = function (exp,fn) {
    this.$$watchers.push({
        exp:exp,
        fn:fn,
        last:this[exp]
    })
};
Scope.prototype.$degist = function () {
    //先查一次让数组从头开始执行，执行一遍 发现有dirty = true 在执行一次知道dirty = false ,发现循环10次后值还在变化，那就提示报错死循环
    var dirty;
    var count = 10;
    do {
        dirty = this.$degistOne();//一直查询有没有脏值
        if(dirty&&count == 1){
            //此时有脏值并且已经循环10次了
            throw new Error('10 $digest() iterations reached. Aborting!')
        }
    }while(dirty&&count--);
};
Scope.prototype.$degistOne = function () {
    //先默认 杯子里干净的
    var dirty = false;
    this.$$watchers.forEach((item)=>{
        if(item.last !=this[item.exp]){
            item.fn(this[item.exp],item.last);
            item.last = this[item.exp];
            dirty = true;//   //如果当前脏了，那至少要执行两次
        }
    });
    return dirty;
};
Scope.prototype.$apply = function () {
    this.$degist();
}
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



/*[
    { exp: 'name', fn: [Function], last: 2 }, last=2 => age=2  5勺糖
    { exp: 'age', fn: [Function], last: 1 }        name = 3    6烧汤
    //但是在这个函数的回掉函数里我们又改变了name的值
]*/

//  我买了一杯咖啡，这杯咖啡放在桌子上，你先放了一勺糖，此时我不确定你是放了一勺糖就结束了么，等你把所有人杯子都放完了，我回来再看，看杯子里面多没多东西，如果没多 ，如果发现放奶了，我就在等你放一圈，再回来看里面是不是只有奶和糖，如果只有的话 ，你就只放了糖和奶


//这次已经执行完了， 我现在认为name =1  age =2
