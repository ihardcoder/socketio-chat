var content = $('#content');
var status_txt = $('#status');
var input = $('#input');
var send_bt = $('#send_bt');
var connect_bt = $('#connect_bt');

// var socket= new io.Socket('localhost',{ 
//   port: 3000 
// }); 
var socket;

var myName = "";

var firstconnect = true;

//输入框“回车”提交
input.keydown(function(e) {
    if (e.keyCode === 13) {
      sendMsg();
    }
});

//提交按钮
send_bt.click(sendMsg);

connect_bt.click(connect);

function connect(){
    //建立websocket连接
    socket = io.connect('http://localhost:3000');
    // socket.connect();
    
    //与Server成功连接后得到server的反馈信息
    socket.on('connect',function(){
        if(firstconnect){
            status_txt.text('已连接!请输入昵称');
            firstconnect = false;
        }else{
            status_txt.text('已连接！');
        }
        
    });

    //监听welcome事件，第一次登陆显示欢迎信息
    socket.on('welcome',function(data){
        var p = document.createElement('p');
        p.innerHTML = data.time + "欢迎" + data.text + "加入";
        content.prepend(p); 
    });

    //监听disconnect事件，断开连接后显示退出信息
    socket.on('disconnect',function(data){
        var p = document.createElement('p');
        p.innerHTML = data.time + myName + "退出聊天室";
        content.prepend(p); 
    });


    //监听message事件，打印消息信息
    socket.on('message',function(json){
        var p = document.createElement('p');
        p.text = data.time + myName + "说：" + data.text;
        content.prepend(p);
    });
}

function sendMsg(){
        var msg = input.val();
        if (!msg){
            return
        };

        socket.send(msg);  //发送信息

        $(this).val('');   //清空输入框

        //如果是第一次连接，则设置昵称
        if (firstconnect) {
            myName = msg;
        }
}
