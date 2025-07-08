# 开源工具库

## UseWebSocket

封装了给后台持续发送心跳与重连机制，给后端发送的心跳是 ***his.sendMessage('PING')***
url样例***ws://192.169.110.110/${Id}***
> 使用案例

```ts
const webSocket: UseWebSocket = new UseWebSocket(url); //注册ws 测试服务器
webSocket.connect((message) => {
});
```