import Decimal from 'decimal.js-light';
/*
	Decimal rounding

	Property		Value	Description
	ROUND_UP			0	Rounds away from zero
	ROUND_DOWN			1	Rounds towards zero
	ROUND_CEIL			2	Rounds towards Infinity
	ROUND_FLOOR			3	Rounds towards -Infinity
	ROUND_HALF_UP		4	Rounds towards nearest neighbour. If equidistant, rounds away from zero
	ROUND_HALF_DOWN		5	Rounds towards nearest neighbour. If equidistant, rounds towards zero
	ROUND_HALF_EVEN		6	Rounds towards nearest neighbour. If equidistant, rounds towards even neighbour
	ROUND_HALF_CEIL		7	Rounds towards nearest neighbour. If equidistant, rounds towards Infinity
	ROUND_HALF_FLOOR	8	Rounds towards nearest neighbour. If equidistant, rounds towards -Infinity
*/

Decimal.set({
    precision: 50,
    rounding: Decimal.ROUND_DOWN
});
export const add = (a, b) => {
    if (isNaN(a * 1) || isNaN(b * 1)) {
        return NaN;
    }
    const aa = new Decimal(a || 0);
    const bb = new Decimal(b || 0);
    return aa.add(bb);
};
export const sub = (a, b) => {
    if (isNaN(a * 1) || isNaN(b * 1)) {
        return NaN;
    }
    const aa = new Decimal(a || 0);
    const bb = new Decimal(b || 0);
    return aa.sub(bb);
};
export const mul = (a, b) => {
    if (isNaN(a * 1) || isNaN(b * 1)) {
        return NaN;
    }
    const aa = new Decimal(a || 0);
    const bb = new Decimal(b || 0);
    return aa.mul(bb);
};
export const div = (a, b) => {
    if (isNaN(a * 1) || isNaN(b * 1)) {
        return NaN;
    }
    if (!b) {
        return '--';
    }
    const aa = new Decimal(a || 0);
    const bb = new Decimal(b);
    return aa.div(bb);
};
export const fix = (a, n = 0, rounding, trimZero = true) => {
    if (isNaN(a)) {
        return a;
    }
    if (a === 0 || a === "0" || a?.valueOf() === 0 || a?.valueOf() === "0") {
        return 0;
    }
    const aa = new Decimal(a || 0);
    let fixed = aa.toFixed(n, rounding);
    if(trimZero) {
        fixed = fixed.replace(/(0+)$/g,"")
        if(fixed.endsWith('.')) fixed = fixed.substring(0, fixed.length - 1);
    }
    return fixed;
};
export const comparedTo = (a, b) => {
    const aa = new Decimal(a || 0);
    const bb = new Decimal(b || 0);
    return aa.comparedTo(bb);
};
export const toNum = (a) => {
    const aa = new Decimal(a || 0);
    return aa.toFixed();
};
export const fixPrice = (a, n = 0) => {
    if (isNaN(a * 1)) {
        return a;
    }
    const aa = new Decimal(a || 0);
    const maybePrecision = n - 1; // NOTE: 精度 -1 为了保证在 0.0X 的情况下能显示成 0.0XXX
    let needSpread;
    if (aa < Number(`1e${-maybePrecision}`)) {
        needSpread = 1;
    }
    if (a * 1 && needSpread) {
        const { index: noneZeroIndex = 0 } = aa.toFixed(10).match(/[^.0]/) || {}; // 取第一位非 0 的下标
        if (noneZeroIndex === 0) {
            n = 2;
        } else {
            n = Math.min(noneZeroIndex + 1, 10);
        }
    }
    // return aa.toFixed(parseInt(n));
    if (aa.toFixed(parseInt(n)) * 1){
        return aa.toFixed(parseInt(n));
    }else{
        return aa.toFixed(2);
    }
};

export const n2s = (a) => {
    if (isNaN(a * 1)) {
        return a;
    }
    const aa = new Decimal(a || 0);
    return aa.toFixed();
};

/**
 * 求两个时间差值
 * @export timeDiff
 * @param start {String} 时间戳
 * @param end {String} 时间戳
 * @returns {String} 相差天数
 */
export const timeDiff = (start,end) => {
    let time = end - start;
    return Math.ceil(time / 24 / 60 / 60 / 1000);
};
