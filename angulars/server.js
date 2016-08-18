//导入express
var express  = require('express');
var path = require('path');
var fs = require('fs');
//设置静态文件夹
var app = express();
var books = [
    {name:'nodejs',price:20,count:1,id:1},
    {name:'angularjs',price:20,count:1,id:2},
    {name:'vuejs',price:20,count:1,id:3},
    {name:'reactjs',price:20,count:1,id:4},
];
/*var bodyParser = require('body-parser');
app.use(bodyParser.json());*/
function bodyParser() {
    return function (req,res,next) {
        var result = '';
        req.on('data',function (data) {
            result+=data;
        });
        req.on('end',function () {
            if(result!=''){
                req.body = JSON.parse(result);
            }
            next();
        });
    }
}
app.use(bodyParser());


app.use(express.static(path.resolve('node_modules')));
app.listen(3000);
//访问/时将首页进行返回
app.get('/', function (req,res) {
    res.sendFile('./1.bookstore.html',{root:__dirname});
});
app.delete('/book/:id',function (req,res) {
    //我们需要获得最新的要删除的图书的id
    var bookid = req.params.id;
    books = books.filter(function (item) {
        return item.id!=bookid;
    });
    res.send({'success':'删除成功'});//如果请求未完成则不会发起第二个请求
});
app.post('/book/:id',function (req,res) {
    //获取请求体
    var book = req.body;//请求体对象
    books.push(book);
    res.send({'success':'增加成功'});
})
app.get('/book',function (req,res) {
    res.send(books);
});

app.put('/book/:id',function (req,res) {
    var bookid = req.params.id;
    var book = req.body; //修改后的那一本书
    books = books.map(function (item) {
        if(item.id == bookid){
            //说明找到那本书了，应该返回修改的内容
            return book;
        }
        return item;
    });
    res.send({success:'修改成功'});
})

/*
静态文件中间件
app.use(static(path.resolve('node_modules')));
function static(p) {
    //先读取req.path拿到用户输入的路径 和我们的当前传入的路径拼出一个绝对地址。如果有则读取出来返回，没有继续
    //我们当前访问的路径是
    return function (req,res,next) {
        //将两个目录拼接起来就会生成一个绝对路径
        var filePath = path.join(p,req.path);
        var exist = fs.existsSync(filePath);
        if(exist){
            fs.createReadStream(filePath).pipe(res);
        }else{
            next();
        }
    }
}
//我们中间件需要传入一个function*/
