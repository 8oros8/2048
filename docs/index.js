'use strict'

let basicElements = document.getElementsByClassName('basicElement')
let mainTable = document.getElementById('mainTable')
let slotsOrdered = Array.from(document.querySelectorAll('td'))
let slotsShuffled = slotsOrdered
let newGameButton = document.getElementById('newGameButton')
let scoreCounter = document.getElementById('score')
let scoreWrapper = document.getElementById('scoreWrapper')
let currentScore = 0

let colors = { // После 2048 все элементы черные
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


function defineColor(element) {
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


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function shuffle(array) { // Перемешиваем массив базовых элементов для случайной вставки новых
    array.sort(() => Math.random() - 0.5);
}

function elementCreate() { // Создаем два новых элемента; "2" с шансом 90%, "4" с шансом 10%
    let newElement = document.createElement('div')
    newElement.className = 'basicElement'
    if (getRandomInt(0,10) === 9) {
        newElement.innerText = '4'
    }
    else newElement.innerText = '2'
    defineColor(newElement)

    shuffle(slotsShuffled)
    for (let slot of slotsShuffled) {
        if (slot.firstElementChild === null) {
            slot.append(newElement)
            setTimeout(function (){
                newElement.style.animation = 'none' // после вставки элемента отключаем анимацию
                newElement.style.height = '100%' // тк анимация изменяет размеры элемента, необходимо перезаписать их
                newElement.style.width = '100%' // тк анимация изменяет размеры элемента, необходимо перезаписать их
            }, 400)
            break
        }
    }
}


function moveToBottom() {
    let movementChecker = 0 // счетчик для отслеживания изменений движения (добавлять или не добавлять новый элемент)
    let sumChecker = 0 // счетчик для отслеживания изменений суммирования
    let verticalColumns = []
    for (let i = 0; i <= 3; i++) { // проходимся по рядам таблицы для получения колонок таблицы
        let verticalColumn = []
        for (let tr of Array.from(document.querySelectorAll('tr'))) {
            let trChildren = Array.from(tr.querySelectorAll('td'))
            verticalColumn.unshift(trChildren[i]) // .unshift для последующего перебора снизу вверх
        }
        verticalColumns.push(verticalColumn)
    }
    for (let column of verticalColumns) {
        let elementContainersArr = Array.from(column) // не используем .reverse для движения слева направо
        sumChecker += sumElements(elementContainersArr, 'bottomDirection') // прежде чем двигать суммируем, если можем
        for (let i = 1; i <= 4; i++) { // нулевой элемент не учитываем, тк он в любом случае в самой крайней позиции
                if (i === 4) {
                    for (let element of elementContainersArr) {
                        if (element.firstElementChild !== null) {
                            setTimeout(function () {
                                element.firstElementChild.style.top = '0'
                                setTimeout(function () {
                                    if (element.firstElementChild.firstElementChild !== null) { // если есть неудаленные двигающиеся элементы
                                        element.firstElementChild.firstElementChild.remove() // удалить их
                                    }
                                }, 350)
                            })
                        }
                    }
                    break
                }
                if (elementContainersArr[i].firstElementChild === null) {
                    // пропускаем элемент, если внутри него нет базовых элементов
                }
                else {
                    let element = elementContainersArr[i].firstElementChild // искомый базовый элемент
                    for (let n = 0; n <= i; n++) { // двигаемся по элементам ряда от его начала к индексу элемента
                        if (elementContainersArr[n].firstElementChild === null) { // если находим пустую ячейку
                            elementContainersArr[n].appendChild(element) // вставляем текущий элемент
                            element.style.top = -120 * (i-n) + 'px' // мудрейший выход из хуевой логики: для кода элементы содержатся уже в ячейках назначения, однако до применения анимаций визуально они располагаются на своих старых (до передвижения) местах
                            movementChecker++ // произошло перемещение
                            break
                        }
                    }
                }
            }
    }
    setTimeout(function () {
        if ((movementChecker > 0) || (sumChecker > 0)) { // если были операции движения или сложения, добавляем новый элемент
            elementCreate()
        }
    }, 300)
}

function moveToTop() {
    let movementChecker = 0 // счетчик для отслеживания изменений движения (добавлять или не добавлять новый элемент)
    let sumChecker = 0 // счетчик для отслеживания изменений суммирования
    let verticalColumns = []
    for (let i = 0; i <= 3; i++) { // проходимся по рядам таблицы для получения колонок таблицы
        let verticalColumn = []
        for (let tr of Array.from(document.querySelectorAll('tr'))) {
            let trChildren = Array.from(tr.querySelectorAll('td'))
            verticalColumn.push(trChildren[i]) // .push для последующего перебора сверху вниз
        }
        verticalColumns.push(verticalColumn)
    }
    for (let column of verticalColumns) {
        let elementContainersArr = Array.from(column) // не используем .reverse для движения слева направо
        sumChecker += sumElements(elementContainersArr, 'topDirection') // прежде чем двигать суммируем, если можем
        for (let i = 1; i <= 4; i++) { // нулевой элемент не учитываем, тк он в любом случае в самой крайней позиции
                if (i === 4) {
                    for (let element of elementContainersArr) {
                        if (element.firstElementChild !== null) {
                            setTimeout(function () {
                                element.firstElementChild.style.top = '0'
                                setTimeout(function () {
                                    if (element.firstElementChild.firstElementChild !== null) { // если есть неудаленные двигающиеся элементы
                                        element.firstElementChild.firstElementChild.remove() // удалить их
                                    }
                                }, 350)
                            })
                        }
                    }
                    break
                }
                if (elementContainersArr[i].firstElementChild === null) {
                    // пропускаем элемент, если внутри него нет базовых элементов
                }
                else {
                    let element = elementContainersArr[i].firstElementChild // искомый базовый элемент
                    for (let n = 0; n <= i; n++) { // двигаемся по элементам ряда от его начала к индексу элемента
                        if (elementContainersArr[n].firstElementChild === null) { // если находим пустую ячейку
                            elementContainersArr[n].appendChild(element) // вставляем текущий элемент
                            element.style.top = 120 * (i-n) + 'px' // мудрейший выход из хуевой логики: для кода элементы содержатся уже в ячейках назначения, однако до применения анимаций визуально они располагаются на своих старых (до передвижения) местах
                            movementChecker++ // произошло перемещение
                            break
                        }
                    }
                }
            }
    }
    setTimeout(function () {
        if ((movementChecker > 0) || (sumChecker > 0)) { // если были операции движения или сложения, добавляем новый элемент
            elementCreate()
        }
    }, 300)
}

function moveToRight() {
    let movementChecker = 0 // счетчик для отслеживания изменений движения (добавлять или не добавлять новый элемент)
    let sumChecker = 0 // счетчик для отслеживания изменений суммирования
    let horizontalRows = Array.from(document.querySelectorAll('tr'))
    for (let row of horizontalRows) {
        let elementContainersArr = Array.from(row.querySelectorAll('td')).reverse() // используем .reverse для движения слева направо
        sumChecker += sumElements(elementContainersArr, 'rightDirection') // прежде чем двигать суммируем, если можем
        for (let i = 1; i <= 4; i++) { // нулевой элемент не учитываем, тк он в любом случае в самой крайней позиции
                if (i === 4) {
                    for (let element of elementContainersArr) {
                        if (element.firstElementChild !== null) {
                            setTimeout(function () {
                                element.firstElementChild.style.left = '0'
                                setTimeout(function () {
                                    if (element.firstElementChild.firstElementChild !== null) { // если есть неудаленные двигающиеся элементы
                                        element.firstElementChild.firstElementChild.remove() // удалить их
                                    }
                                }, 350)
                            })
                        }
                    }
                    break
                }
                if (elementContainersArr[i].firstElementChild === null) {
                    // пропускаем элемент, если внутри него нет базовых элементов
                }
                else {
                    let element = elementContainersArr[i].firstElementChild // искомый базовый элемент
                    for (let n = 0; n <= i; n++) { // двигаемся по элементам ряда от его начала к индексу элемента
                        if (elementContainersArr[n].firstElementChild === null) { // если находим пустую ячейку
                            elementContainersArr[n].appendChild(element) // вставляем текущий элемент
                            element.style.left = -120 * (i-n) + 'px' // мудрейший выход из хуевой логики: для кода элементы содержатся уже в ячейках назначения, однако до применения анимаций визуально они располагаются на своих старых (до передвижения) местах
                            movementChecker++ // произошло перемещение
                            break
                        }
                    }
                }
            }
        }
    setTimeout(function () {
        if ((movementChecker > 0) || (sumChecker > 0)) { // если были операции движения или сложения, добавляем новый элемент
            elementCreate()
        }
    }, 300)
}
function moveToLeft() {
    let movementChecker = 0 // счетчик для отслеживания изменений движения (добавлять или не добавлять новый элемент)
    let sumChecker = 0 // счетчик для отслеживания изменений суммирования
    let horizontalRows = Array.from(document.querySelectorAll('tr'))
    for (let row of horizontalRows) {
        let elementContainersArr = Array.from(row.querySelectorAll('td')) // не используем .reverse для движения слева направо
        sumChecker += sumElements(elementContainersArr, 'leftDirection') // прежде чем двигать суммируем, если можем
        for (let i = 1; i <= 4; i++) { // нулевой элемент не учитываем, тк он в любом случае в самой крайней позиции
                if (i === 4) {
                    for (let element of elementContainersArr) {
                        if (element.firstElementChild !== null) {
                            setTimeout(function () {
                                element.firstElementChild.style.left = '0'
                                setTimeout(function () {
                                    if (element.firstElementChild.firstElementChild !== null) { // если есть неудаленные двигающиеся элементы
                                        element.firstElementChild.firstElementChild.remove() // удалить их
                                    }
                                }, 350)
                            })
                        }
                    }
                    break
                }
                if (elementContainersArr[i].firstElementChild === null) {
                    // пропускаем элемент, если внутри него нет базовых элементов
                }
                else {
                    let element = elementContainersArr[i].firstElementChild // искомый базовый элемент
                    for (let n = 0; n <= i; n++) { // двигаемся по элементам ряда от его начала к индексу элемента
                        if (elementContainersArr[n].firstElementChild === null) { // если находим пустую ячейку
                            elementContainersArr[n].appendChild(element) // вставляем текущий элемент
                            element.style.left = 120 * (i-n) + 'px' // мудрейший выход из хуевой логики: для кода элементы содержатся уже в ячейках назначения, однако до применения анимаций визуально они располагаются на своих старых (до передвижения) местах
                            movementChecker++ // произошло перемещение
                            break
                        }
                    }
                }
            }
    }
    setTimeout(function () {
        if ((movementChecker > 0) || (sumChecker > 0)) { // если были операции движения или сложения, добавляем новый элемент
            elementCreate()
        }
    }, 300)
}

function sumElements (targetArray, direction) { // В качестве аргумента передаем массив элементов (колонку или строку) в котором содержится элемент и счетчик изменений
    let innerSumChecker = 0 // внутренний счетчик операций сложения
    for (let i = 0; i < targetArray.length; i++) { // Массивы изначально отсортированы таким образом, что targetArray[0] - самая правая/левая/верхняя/нижняя ячейка строки/столбца
        if (innerSumChecker === 2) { // если за одно исполнение функции произошло 2 операции сложения
            break // прекращаем складывать, такова внутренняя логика игры (2/2/2/2 => 4/4 !=> 8)
        }
        if (targetArray[i].children.length > 0) {
            let currentElementValue = parseInt(targetArray[i].firstElementChild.innerText)
            if ((i < 3) && (targetArray[i + 1].firstElementChild !== null)) { //  проверить есть ли ребенок у первого ближайшего
                let closestElementValue = parseInt(targetArray[i + 1].firstElementChild.innerText)
                if (currentElementValue === closestElementValue) { // если у элементов одинаковые значения
                    let movingElement = targetArray[i + 1].firstElementChild // дальний от края элемент, который будет двигаться
                    let staticElement = targetArray[i].firstElementChild // более крайний элемент (статичный)
                    staticElement.innerText = currentElementValue * 2 + '' // значение более крайнего меняем на x2
                    defineColor(targetArray[i].firstElementChild) // определяем цвет нового квадрата
                    movingElement.style.position = 'absolute'
                    movingElement.style.width = '98px'
                    movingElement.style.height = '98px'
                    staticElement.appendChild(movingElement) // вставляем двигающийся элемент в целевой элемент, чтобы он не мешал коду дальше
                    currentScore += currentElementValue*2 // добавляем значение нового квадрата к счетчику очков
                    innerSumChecker++
                    if (direction === 'rightDirection') {
                        movingElement.style.left = '-240px' // "мудрое" решение: для кода двигающийся элемент находится внутри целевого контейнера и не мешает вычислениям, но визуально мы пока что оставляем его на месте (ради анимаций)
                    }
                    if (direction === 'leftDirection') {
                        movingElement.style.left = '120px'
                    }
                    if (direction === 'topDirection') {
                        movingElement.style.top = '120px'
                    }
                    if (direction === 'bottomDirection') {
                        movingElement.style.top = '-120px'
                    }
                    setTimeout(function () { // после выполнения кода сработает плавная анимация
                        movingElement.style.left = '0'
                        movingElement.style.top = '0'
                    })
                }
            }
            else if ((i < 2) && (targetArray[i + 2].firstElementChild !== null)) { // проверить есть ли ребенок у второго ближайшего
                let closestElementValue = parseInt(targetArray[i + 2].firstElementChild.innerText)
                if (currentElementValue === closestElementValue) { // если у элементов одинаковые значения
                    let movingElement = targetArray[i + 2].firstElementChild // дальний от края элемент, который будет двигаться
                    let staticElement = targetArray[i].firstElementChild // более крайний элемент (статичный)
                    staticElement.innerText = currentElementValue * 2 + '' // значение более крайнего меняем на x2
                    defineColor(targetArray[i].firstElementChild) // определяем цвет нового квадрата
                    movingElement.style.position = 'absolute'
                    movingElement.style.width = '98px'
                    movingElement.style.height = '98px'
                    staticElement.appendChild(movingElement) // вставляем двигающийся элемент в целевой элемент, чтобы он не мешал коду дальше
                    currentScore += currentElementValue*2 // добавляем значение нового квадрата к счетчику очков
                    innerSumChecker++
                    if (direction === 'rightDirection') {
                        movingElement.style.left = '-480px' // "мудрое" решение: для кода двигающийся элемент находится внутри целевого контейнера и не мешает вычислениям, но визуально мы пока что оставляем его на месте (ради анимаций)
                    }
                    if (direction === 'leftDirection') {
                        movingElement.style.left = '240px'
                    }
                    if (direction === 'topDirection') {
                        movingElement.style.top = '240px'
                    }
                    if (direction === 'bottomDirection') {
                        movingElement.style.top = '-240px'
                    }
                    setTimeout(function () { // после выполнения кода сработает плавная анимация
                        movingElement.style.left = '0'
                        movingElement.style.top = '0'
                    })
                }
            }
            else if ((i < 1) && (targetArray[i + 3].firstElementChild !== null)) { // есть ли ребенок у 3го
                let closestElementValue = parseInt(targetArray[i + 3].firstElementChild.innerText)
                if (currentElementValue === closestElementValue) { // если у элементов одинаковые значения
                    let movingElement = targetArray[i + 3].firstElementChild // дальний от края элемент, который будет двигаться
                    let staticElement = targetArray[i].firstElementChild // более крайний элемент (статичный)
                    staticElement.innerText = currentElementValue * 2 + '' // значение более крайнего меняем на x2
                    defineColor(targetArray[i].firstElementChild) // определяем цвет нового квадрата
                    movingElement.style.position = 'absolute'
                    movingElement.style.width = '98px'
                    movingElement.style.height = '98px'
                    staticElement.appendChild(movingElement) // вставляем двигающийся элемент в целевой элемент, чтобы он не мешал коду дальше
                    currentScore += currentElementValue*2 // добавляем значение нового квадрата к счетчику очков
                    innerSumChecker++
                    if (direction === 'rightDirection') {
                        movingElement.style.left = '-720px' // "мудрое" решение: для кода двигающийся элемент находится внутри целевого контейнера и не мешает вычислениям, но визуально мы пока что оставляем его на месте (ради анимаций)
                    }
                    if (direction === 'leftDirection') {
                        movingElement.style.left = '360px'
                    }
                    if (direction === 'topDirection') {
                        movingElement.style.top = '360px'
                    }
                    if (direction === 'bottomDirection') {
                        movingElement.style.top = '-360px'
                    }
                    setTimeout(function () { // после выполнения кода сработает плавная анимация
                        movingElement.style.left = '0'
                        movingElement.style.top = '0'
                    })
                }
            }
        }
    }
    return innerSumChecker
}


addEventListener('keydown', function (event) {
    if (event.code === 'ArrowLeft')  {
        event.preventDefault() // предотвращение базового действия прокрутки
        moveToLeft() // сначала движение в указанном направлении,
         // и только потом создание новых элементов
    }
    if (event.code === 'ArrowDown') {
        event.preventDefault()
        moveToBottom()
    }
    if (event.code === 'ArrowUp') {
        event.preventDefault()
        moveToTop()
    }
    if (event.code === 'ArrowRight') {
        event.preventDefault()
        moveToRight()
    }
})

newGameButton.onclick = function () {
    let currentElements = document.getElementsByClassName('basicElement')
    while (currentElements[0]) {
        currentElements[0].remove()
    }
    currentScore = 0
    elementCreate()
    elementCreate()
}

let generalObserver = new MutationObserver(function ()  { // обновление счета при любых изменениях
    if (currentScore !== parseInt(scoreCounter.innerText)) {
        scoreCounter.innerText = currentScore
    }
})

let flickerObserver = new MutationObserver( function () {
    scoreWrapper.animate( [
        { // from
            backgroundColor: '#2EE59D'
        },
        { // to
            backgroundColor: 'whitesmoke'
        }
        ], 500)
})

setTimeout(function (){
    flickerObserver.observe(scoreCounter, {
        childList: true,
        characterDataOldValue: true,
        characterData: true
    })
})

generalObserver.observe(mainTable, {
    subtree: true,
    childList: true,
    characterDataOldValue: true
})

for (let div of basicElements) {
    defineColor(div)
}
elementCreate()
elementCreate()

