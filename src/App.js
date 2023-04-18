import './App.css';
import {off, on, subscribe, unsubscribe} from './plugins/market.websocket';
import {fix, sub, toNum, div, mul} from "./plugins/math";
import {useEffect, useMemo, useState} from "react";
import classNames from "classnames";

function App() {
    const [data, setData] = useState({});
    const onData = (data) => {
        console.log(data);
        setData(data);
    };

    useEffect(() => {
        on(onData);
        subscribe(['btcusdt']);
        return () => {
            off(onData);
            unsubscribe(['btcusdt']);
        }
    }, []);

    const item = useMemo(() => {
        const { close = 0, open = 0 } = data;
        const cv = toNum(fix(close, 4));
        const ratio = fix(mul(div(sub(close, open), open),100), 2);
        let prefix = toNum(ratio) > 0 ? '+' : '-';
        const clazz = ["item"];
        if(prefix === '+') clazz.push("up");
        if(prefix === '-') clazz.push("down");
        return <div className={classNames(clazz)}>
            <div className="value">{!cv || cv === '0' ? '--' : cv}</div>
            <div className="ratio">{ratio ? `${prefix === '+' ? prefix: ''}${ratio}%`: '--'}</div>
        </div>;
    }, [data])

    return <div className="mainWindow">
        { item }
    </div>;
}

export default App;
