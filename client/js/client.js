var chatText = document.getElementById('chat-box');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form'); 
var ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';

var socket = io();
    
socket.on('newPositions',function(data){
    ctx.clearRect(0,0,500,500);
    for(var i = 0 ; i < data.player.length; i++)
        ctx.fillText(data.player[i].number,data.player[i].x,data.player[i].y);     
        
    for(var j = 0 ; j < data.bullet.length; j++)
        ctx.fillRect(data.bullet[j].x-5,data.bullet[j].y-5,10,10); 
            
});

socket.on('addToChat',function(data){
    chatText.innerHTML += '<div>'+ data +'</div>';
});

socket.on('evalAnswer',function(data){
    console.log(data);
});

chatForm.onsubmit = function(e){
    e.preventDefault();
    //send value that the player typed to the chat box
    if (chatInput.value[0] == '/')
        socket.emit('evalServer', chatInput.value.slice(1));
    else 
        socket.emit('sendMsgToServer', chatInput.value);
    
    chatInput.value = '';
};

//key presses
document.onkeydown = function(event){
    if(event.keyCode === 68)        //d
        socket.emit('keyPress',{inputId:'right',state:true});
    else if(event.keyCode === 83)   //s
        socket.emit('keyPress',{inputId:'down',state:true});
    else if(event.keyCode === 65)   //a
        socket.emit('keyPress',{inputId:'left',state:true});
    else if(event.keyCode === 87)   // w
        socket.emit('keyPress',{inputId:'up',state:true});
        
};
document.onkeyup = function(event){
    if(event.keyCode === 68)        //d
        socket.emit('keyPress',{inputId:'right',state:false});
    else if(event.keyCode === 83)   //s
        socket.emit('keyPress',{inputId:'down',state:false});
    else if(event.keyCode === 65)   //a
        socket.emit('keyPress',{inputId:'left',state:false});
    else if(event.keyCode === 87)   // w
        socket.emit('keyPress',{inputId:'up',state:false});
};

//on any mouse (un)click on screen 
document.onmousedown = function(event) {
    socket.emit('keyPress',{inputId: 'attack',state:true});
};
document.onmouseup = function(event) {
    socket.emit('keyPress',{inputId: 'attack',state:false});
};

//calculate angle from center of screen to mouse
document.onmousemove = function(event){
    var x = -250 + event.clientX - 8;
    var y = -250 + event.clientY - 8;
    var angle = Math.atan2(y,x) / Math.PI * 180;
    socket.emit('keyPress',{inputId:'mouseAngle',state:angle});
};