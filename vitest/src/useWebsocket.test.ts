import { UseWebSocket } from '@funtoy/utils';
import { vi, it, beforeEach, describe, expect, afterEach } from 'vitest';

let mockSocket;

beforeEach(() => {
	vi.useFakeTimers(); // 使用假的定时器
	mockSocket = {
		//实际上我们的好多判断都是基于这里来的
		send: vi.fn(), //vi.fn() 会创建一个 空的模拟函数，这个函数本身什么都不做，但它会记录所有被调用的信息，比如调用了几次、调用时传了什么参数、返回值等等
		close: vi.fn(),
		readyState: 1, // OPEN 状态
		onopen: null,
		onmessage: null,
		onerror: null,
		onclose: null
	};
	global.WebSocket = vi.fn(() => mockSocket) as any;
});
afterEach(() => {
	vi.clearAllTimers();
	vi.restoreAllMocks(); // 清除 mock
});

describe('UseWebSocket', () => {
	it('should connect and call onopen', () => {
		const ws = new UseWebSocket('ws://localhost');
		ws.connect();

		expect(global.WebSocket).toHaveBeenCalledWith('ws://localhost');

		// 模拟连接成功
		mockSocket.onopen?.();
	});

	it('should send message', () => {
		const ws = new UseWebSocket('ws://localhost');
		ws.connect();
		mockSocket.readyState = WebSocket.OPEN; // 关键：模拟连接打开
		mockSocket.onopen?.();
		ws.sendMessage('hello');
		expect(mockSocket.send).toHaveBeenCalledWith('hello'); // 会被 JSON.stringify
	});

	it('should send heartbeat PING every 15s after connection', () => {
		const ws = new UseWebSocket('ws://localhost');
		ws.connect();

		mockSocket.readyState = WebSocket.OPEN; // 关键：模拟连接打开
		// 模拟连接成功
		mockSocket.onopen?.();

		// 快进 15 秒
		vi.advanceTimersByTime(15000);

		expect(mockSocket.send).toHaveBeenCalledWith('PING');

		// 快进到 30 秒
		vi.advanceTimersByTime(15000);
		expect(mockSocket.send).toHaveBeenCalledTimes(2);
	});
});
