var express = require('express'), 
    path = require('path'), 
    app = express(), 
    server = require('http').createServer(app), 
    io = require('socket.io').listen(server);

// Express 配置
app.configure(function(){
  app.set('port',  3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
 

//连接监听
io.on('connection', function (socket) {

  console.log("connected");

  // 构造客户端对象
  var client = {
    socket:socket,
    nickname:"",
  }
  
  // 对message事件的监听
  socket.on('message', function(msg){
    var res = {
      text : "",
      time : getTime()
    };

    // 第一次连接，触发welcome事件
    if(client.nickname === ""){
        client.nickname = msg;
        res['text']=client.nickname;
        console.log(client.nickname + ' login');

        //欢迎事件反馈
        socket.emit('welcome',res);
        //大厅广播新用户加入
        socket.broadcast.emit('welcome',res);
     }else{

        //如果不是第一次的连接，正常的聊天消息
        res['text']=msg;
        console.log(client.nickname + ' say: ' + msg);

        // 返回消息
        socket.emit('message',res);
        // 大厅广播用户发出的消息
        socket.broadcast.emit('message',res);
      }
    });

    //监听出退事件
    socket.on('disconnect', function () {  
      var res = {
        time:getTime(),
        text:client.nickname
      };

      // 大厅广播用户已退出
      socket.broadcast.emit('disconnect',res);
      console.log(client.nickname + 'Disconnect');
    });
  
});



app.configure('development', function(){
  app.use(express.errorHandler());
});

// 静态html文件
app.get('/', function(req, res){
  res.sendfile('views/index.html');
});

server.listen(app.get('port'), function(){
  console.log("Server is listening on port " + app.get('port'));
});


var getTime=function(){
  var date = new Date();
  return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
}

