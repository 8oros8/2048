'use strict'

export const colors = { // После 2048 все элементы черные
    2: '#f0e5da',
    4: '#efe2c6',
    8: '#fbb26c',
    16: '#ff9251',
    32: '#ff744e',
    64: '#ff4d08',
    128: '#f0d360',
    256: '#f1d146',
    512: '#f1cd26',
    1024: '#f2ca00',
    2048: '#f2c700'
}
export function defineColor(element) {
    let colorDefiner = parseInt(element.innerText)
    if (colorDefiner <= 2048) {
        element.style.backgroundColor = colors[`${colorDefiner}`]
        if (colorDefiner > 4) {
            element.style.color = '#faf6f2'
        }
    }
    else {
        element.style.backgroundColor = 'black'
    }
}
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

