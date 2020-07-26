// source: https://github.com/nayuki/Nayuki-web-published-code/blob/master/creating-a-qr-code-step-by-step/instrumented-qrcodegen.ts#L525
export default class RSECG {

    private readonly coefficients: Array<number> = [];

    constructor(degree: number) {
        if (degree < 1 || degree > 255) throw Error("Degree out of range");
        let coefs: Array<number> = this.coefficients;

        for (let i: number = 0; i < degree - 1; i++) coefs.push(0);
        coefs.push(1);

        let root: number = 1;
        for (let i: number = 0; i < degree; i++) {
            for (let j: number = 0; j < coefs.length; j++) {
                coefs[j] = RSECG.multiply(coefs[j], root);
                if (j + 1 < coefs.length) coefs[j] ^= coefs[j + 1];
            }
            root = RSECG.multiply(root, 0x02);
        }
    }

    private static multiply(a: number, b: number): number {
        if (a >>> 8 != 0 || b >>> 8 != 0) throw Error("Invalid bytes");
        let n: number = 0;
        for (let i: number = 7; i >= 0; i--) {
            n = (n << 1) ^ ((n >>> 7) * 0x11D);
            n ^= ((b >>> i) & 1) * a;
        }
        if (n >>> 8 != 0) throw Error("Calculation error");
        return n;
    }

    public getRemainder(data: Array<number>): Array<number> {
        let result: Array<number> = this.coefficients.map(_ => 0);
        for (const byte of data) {
            const f: number = byte ^ (result.shift() as number);
            result.push(0);
            this.coefficients.forEach((coefficient, index) => {
                result[index] ^= RSECG.multiply(coefficient, f);
            });
        }
        return result;
    }
}
