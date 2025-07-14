export class UseWebSocket<T> {
	private readonly url: string;
	private socket: WebSocket | null = null;
	private isConnected = false;
	private reconnectCount = 0;
	private readonly maxReconnect = 5;
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
	private isManuallyClosed: boolean = false;

	constructor(url: string) {
		this.url = url;
	}

	connect(callBack?: (messageBody: T) => void) {
		if (this.isConnected) return;
		this.socket = new WebSocket(this.url);
		this.socket.onopen = () => {
			console.log('🟢 WebSocket 已连接');
			this.startHeartBeat();
			this.isConnected = true;
			this.reconnectCount = 0;
		};

		this.socket.onmessage = (event) => {
			console.log('📩 收到消息', event.data);
			try {
				const data = JSON.parse(event.data);
				callBack?.(data);
			} catch (err) {
				console.warn('⚠️ 消息解析失败', err);
			}
		};

		this.socket.onclose = () => {
			// 后端主动关闭会调用这个
			console.warn('🔴 WebSocket 已关闭');
			this.isConnected = false;
			this.tryReconnect(callBack);
		};

		this.socket.onerror = (err) => {
			console.error('🚨 WebSocket 错误', err);
			this.isConnected = false;
			this.tryReconnect(callBack);
		};
	}

	sendMessage(data: object | string) {
		if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
			console.warn('⚠️ WebSocket 未连接，发送失败');
			return;
		}

		try {
			if (typeof data === 'object') {
				this.socket.send(JSON.stringify(data));
			} else {
				this.socket.send(data);
			}
		} catch (err) {
			console.error('❌ 消息发送失败', err);
		}
	}

	private startHeartBeat() {
		// console.log('心跳开始建立', new Date().toLocaleString())
		this.heartbeatInterval = setInterval(() => {
			this.sendMessage('PING');
		}, 15000);
	}

	private tryReconnect(callBack?: (messageBody: T) => void) {
		clearInterval(this.heartbeatInterval as ReturnType<typeof setInterval>);
		if (this.isManuallyClosed) return;

		if (this.reconnectCount >= this.maxReconnect) {
			console.warn('🚫 达到最大重连次数');
			return;
		}
		if (this.reconnectTimer) return;

		this.reconnectCount++;
		console.log(`🔁 第 ${this.reconnectCount} 次尝试重连`);

		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;
			this.connect(callBack);
		}, 3000);
	}

	close() {
		if (this.socket) {
			this.socket.close();
			this.socket = null;
			clearInterval(this.heartbeatInterval as ReturnType<typeof setInterval>);
			this.isManuallyClosed = true;
		}
		this.isConnected = false;
		console.log('🔌 手动关闭 WebSocket');
	}
}
