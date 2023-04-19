import bus from './events';
import {pullAll} from 'lodash';

// 行情Socket
const KLINE_URL = "wss://stream.binance.com:9443/ws/@miniTicker";
/// 重试间隔
const RECONNECTION_INTERVAL = 5000;
const DATA_EVENT_KEY = 'market.websocket.data';

// 已订阅币对
const subscribeSymbols = [];
// 已连接
let isConnect = false;
// 连接中
let isConnecting = false;
// socket 实例
let socket = null;

const _reconnect = () => {
    isConnect = false;
    isConnecting = false;
    setTimeout(_connect, RECONNECTION_INTERVAL);
}

// 建立链接
const _connect = () => {
    if(isConnect || isConnecting) return;
    isConnecting = true;
    socket = new WebSocket(KLINE_URL);
    socket.onopen = () => {
        isConnect = true;
        isConnecting = false;
        _requestSubscribe(subscribeSymbols);
    };
    socket.onmessage = (evt) => {
        let data = {};
        try{
            data = JSON.parse(evt.data);
        }catch (e) {}
        const { e, o, c, s } = data;
        if(e === '24hrMiniTicker') {
            bus.emit(DATA_EVENT_KEY, {
                symbol: (s || '').toLowerCase(),
                open: o,
                close: c
            });
        }
    };
    socket.onclose = () => _reconnect();
    socket.onerror = () => _reconnect();
}

const _pushSymbols = (symbols) => {
    symbols.forEach((symbol) => {
        if(!subscribeSymbols.includes(symbol)) subscribeSymbols.push(symbol);
    })
}

const _popSymbols = (symbols) => {
    pullAll(subscribeSymbols, symbols);
}

const _requestSubscribe = (symbols) => {
    if(!symbols || !symbols.length) return;
    const data = {
        method: "SUBSCRIBE",
        params: symbols.map((symbol) => `${symbol}@miniTicker`),
        id: Date.now()
    }
    socket.send(JSON.stringify(data));
}

const _requestUnsubscribe = (symbols) => {
    if(!symbols || !symbols.length) return;
    const data = {
        method: "UNSUBSCRIBE",
        params: symbols.map((symbol) => `${symbol}@miniTicker`),
        id: Date.now()
    }
    socket.send(JSON.stringify(data));
}

export const subscribe = (symbols = []) => {
    _connect();
    _pushSymbols(symbols);
    if(isConnect) _requestSubscribe(symbols);
}

export const unsubscribe = (symbols = []) => {
    _popSymbols(symbols);
    if(isConnect) _requestUnsubscribe(symbols);
}

export const on = (callback) => bus.on(DATA_EVENT_KEY, callback)

export const off = (callback) => bus.off(DATA_EVENT_KEY, callback)
