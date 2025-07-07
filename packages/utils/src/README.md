# 开源工具库

## UseWebSocket
封装了给后台持续发送心跳与重连机制
> 使用案例
```ts
const webSocket: UseWebSocket = new UseWebSocket(url); //注册ws 测试服务器
webSocket.connect((message) => {
});
```