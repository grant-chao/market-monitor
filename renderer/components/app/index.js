import styles from './style.module.scss';
import {off, on, subscribe, unsubscribe} from '../../plugins/market.websocket';
import {fix, sub, toNum, div, mul} from "../../plugins/math";
import {useEffect, useMemo, useState} from "react";
import classNames from "classnames";

function App() {
    const [data, setData] = useState({});

    useEffect(() => {
        on(setData);
        subscribe(['btcusdt']);
        return () => {
            off(setData);
            unsubscribe(['btcusdt']);
        }
    }, []);

    const item = useMemo(() => {
        const { close = 0, open = 0 } = data;
        const cv = toNum(fix(close, 4));
        const ratio = fix(mul(div(sub(close, open), open),100), 2);
        let prefix = toNum(ratio) > 0 ? '+' : '-';
        const clazz = [styles.item];
        if(prefix === '+') clazz.push(styles.up);
        if(prefix === '-') clazz.push(styles.down);
        return <div className={classNames(clazz)}>
            <div className={styles.value}>{!cv || cv === '0' ? '--' : cv}</div>
            <div className={styles.ratio}>{ratio ? `${prefix === '+' ? prefix: ''}${ratio}%`: '--'}</div>
        </div>;
    }, [data])

    return <div className={styles.mainWindow}>{item}</div>;
}

export default App;
