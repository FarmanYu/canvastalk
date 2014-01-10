var colors = ['#c877ff', ' #ff77ab', ' #ff6600', ' #aa8800', ' #77c7ff','#ad77ff', ' #ff77ff', ' #dd0083', ' #777700', ' #00aa00'];
var colorContainer = document.getElementById("colors");
function getUser(){
    return "user_" + Math.random();
}
var gColor = colors[0];
var user = getUser();
colors.forEach(function(color){
    var oli = document.createElement("li");
    oli.style.backgroundColor = color;
    colorContainer.appendChild(oli);
    oli.onclick = function(){
        gColor = this.style.backgroundColor;
        socket.emit('color', {user:user, color:gColor});
    };
});
var canvasElem = document.getElementById("canvas");
var ctx = canvasElem.getContext("2d");
ctx.lineWidth = 2;
canvasElem.onmousedown = canvasElem.ontouchstart = function(){
    socket.emit('start', {user:user,color:gColor});
    canvasElem.onmousemove = canvasElem.ontouchmove = function(e){
        var x = e.offsetX,
            y = e.offsetY;
        if (e.targetTouches && e.targetTouches.length == 1) {
            var touch = e.targetTouches[0];
            x = touch.pageX;
            y = touch.pageY;
        }  
            
        var data = {user:user,x:x,y:y};
        socket.emit('move', data);
    }
}
document.body.addEventListener('touchmove', function(event) {
    event.preventDefault();
 }, false);
document.onmouseup = document.ontouchend = function(){
    socket.emit('close', {user:user});
}
canvasElem.ondblclick = function(){
    socket.emit('clear', {user:user});
}
function canvasMove(data){
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
}
function canvasColor(data){
    gColor = data.color;
    ctx.strokeStyle = data.color;
}
function canvasStart(data){
    ctx.beginPath();
    canvasColor(data);
}
function canvasClose(){
    canvasElem.onmousemove = null;
}
function canvasClear(){
    canvasElem.onmousemove = null;
    ctx.clearRect(0,0,600,500);
}

var url = location.protocol+'//'+ location.host;
var socket = io.connect(url);
socket.on('move', function (data) {
    canvasMove(data);
});
socket.on('color', function (data) {
    canvasColor(data);
});
socket.on('start', function (data) {
    canvasStart(data);
});
socket.on('close', function (data) {
    canvasClose();
});
socket.on('clear', function (data) {
    canvasClear();
});