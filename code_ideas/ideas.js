// linear interpolation
interpolate(x, x0, y0, x1, y1) {
    return y0 + ((y1 - y0)/(x1 - x0)) * (x - x0);
}


// ==================== FOR IMAGE_DATA ====================

// set pixel to imageData.data
setPixel(x, y, r, g, b, data, width) {
    const i = (y * width + x) * 4;

    data[i] = r;
    data[i+1] = g;
    data[i+2] = b;
    data[i+3] = 255;
}

// #ffffff -> 255, 255, 255
hashToRGB(hash) {
    // 1. delete '#' on front
    hash = hash.slice(1); 

    // 2. divide into 3 parts (RGB)
    const rStr = hash.slice(0,2);
    const gStr = hash.slice(2,4);
    const bStr = hash.slice(4,6);

    // 3. calculate RGB [hexadecimal to decimal]
    const r = this.hexToDec(rStr[1]) + 16 * this.hexToDec(rStr[0]);
    const g = this.hexToDec(gStr[1]) + 16 * this.hexToDec(gStr[0]);
    const b = this.hexToDec(bStr[1]) + 16 * this.hexToDec(bStr[0]);

    return {r: r, g: g, b: b};
}

hexToDec(hex) {
    switch(hex) {
            case 'a':
                return 10;
            case 'b':
                return 11;
            case 'c':
                return 12;
            case 'd':
                return 13;
            case 'e':
                return 14;
            case 'f':
                return 15;
            default:
                if (!Number.isInteger(Number(hex))) return null;

                const number = Number(hex);
                if (number < 0 || number > 9) return null;

                return number;
        }
}