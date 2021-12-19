'use strict'

let bodyContainer = document.getElementById('bodyContainer')
let mainTable = document.getElementById('mainTable')
let tBody
let currentScore = 0
let scoreCounter = document.getElementById('score')
let scoreWrapper = document.getElementById('scoreWrapper')
let animationDone = true // счетчик анимаций, по умолчанию true

let grid = []
let rowsNumber = 0
let columnsNumber = 0

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

function createGrid(height, width) {
    for (let i = 1; i <= height; i++) {
        let row = []
        grid.push(row)
        for (let n = 1; n <= width; n++) {
            let cell = {
                value: false,
                row: `${i}`,
                column: `${n}`
            }
            row.push(cell)
        }
    }
    rowsNumber = height
    columnsNumber = width
}

function drawGrid(targetArray) {
    mainTable = document.createElement('table')
    mainTable.id = 'mainTable'
    mainTable.style.height = 120*targetArray.length + 20 + 'px'
    mainTable.style.width = 120*targetArray.length + 20 + 'px'
    bodyContainer.append(mainTable)
    tBody = document.createElement('tbody')
    mainTable.append(tBody)
    for (let i = 0; i < targetArray.length; i++) {
        let tr = document.createElement('tr')
        tr.style.width = mainTable.style.width
        tBody.append(tr)
        for (let n = 0; n < targetArray[i].length; n++) {
            let td = document.createElement('td')
            td.style.height = '100px'
            td.style.width = '100px'
            tr.append(td)
        }
    }
}

function drawElements(target) {
    let htmlRows = tBody.querySelectorAll('tr')
    if (Array.isArray(target)) {
        for (let row of target) {
            for (let element of row) {
                let currentRowHtmlCells = htmlRows[element.row - 1].querySelectorAll('td') // уменьшаем на 1 тк массив начинается с 0
                if ((currentRowHtmlCells[element.column - 1].firstElementChild !== null) && (element.value === false)) {
                    currentRowHtmlCells[element.column - 1].firstElementChild.remove()
                }
                if (element.value !== false) {
                    if (currentRowHtmlCells[element.column - 1].firstElementChild !== null) {
                        currentRowHtmlCells[element.column - 1].firstElementChild.remove()
                    }
                    let cell = document.createElement('div')
                    cell.className = 'basicElement'
                    cell.innerText = element.value + ''
                    defineColor(cell)
                    currentRowHtmlCells[element.column - 1].append(cell)
                    setTimeout(function () {
                        cell.style.animation = 'none'
                    }, 200)
                }
            }
        }
    }
    else {
        let cell = document.createElement('div')
        cell.className = 'basicElement'
        cell.innerText = target.animationNewValue + ''
        defineColor(cell)
        htmlRows[target.animationTargetRow-1].querySelectorAll('td')[target.animationTargetColumn-1].append(cell)
        setTimeout(function () {
            cell.style.animation = 'none'
        }, 200)
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function elementCreate(targetGrid) { // Создаем два новых элемента; "2" с шансом 90%, "4" с шансом 10%
    let newElementValue
    if (getRandomInt(0,10) === 9) {
        newElementValue = 4
    }
    else newElementValue = 2

    let rowIndex
    let columnIndex
    do {
        rowIndex = getRandomInt(0, rowsNumber)
        columnIndex = getRandomInt(0, columnsNumber)
    } while (targetGrid[+rowIndex][+columnIndex].value !== false);
    targetGrid[+rowIndex][+columnIndex].value = newElementValue
    return targetGrid[rowIndex][columnIndex]
}

function move(direction) {
    let horizontalRows = grid // массив горизонтальных рядов таблицы
    let animationData = []
    let verticalColumns = []
    for (let i = 0; i < columnsNumber; i++) {
        let column = []
        for (let row of grid) {
            column.push(row[i])
        }
        verticalColumns.push(column)
    }
    if (direction === 'left') {
        for (let row of horizontalRows) { // проходимся по каждому из рядов
            for (let element of sum(row, 'left')) {
                animationData.push(element)
            }
            for (let i = 1; i < row.length; i++) { // нулевой элемент не учитываем, он и так в крайней левой позиции
                if (row[i].value !== false) { // нас интересуют только не пустые элементы
                    for (let n = 0; n <= i; n++) { // двигаемся по элементам ряда от его начала к индексу элемента
                        if (row[n].value === false) { // если находим пустой элемент
                            row[n].value = row[i].value // перезаписываем в него значение перемещаемого элемента
                            row[i].value = false // значение в старом элементе обнуляем
                            let animationTarget = {
                                animationType: 'move',
                                animationTargetRow: row[i].row,
                                animationTargetColumn: row[i].column,
                                animationDirection: direction,
                                animationDistance: i-n,
                            }
                            animationData.push(animationTarget)
                            break // переходим к следующему передвигаемому элементу во внешний цикл
                        }
                    }
                }
            }
        }
    }
    if (direction === 'right') {
        for (let row of horizontalRows) { // проходимся по каждому из рядов
            for (let element of sum(row, 'right')) {
                animationData.push(element)
            }
            for (let i = row.length-2; i >= 0; i--) { // тк двигаемся слева направо, начинаем с с конца массива (последний элемент не учитываем,тк он в любом случае в крайнем правом положении)
                if (row[i].value !== false) { // нас интересуют только не пустые элементы
                    for (let n = row.length-1; n >= i; n--) { // двигаемся по элементам ряда от его конца к индексу элемента
                        if (row[n].value === false) { // если находим пустой элемент
                            row[n].value = row[i].value // перезаписываем в него значение перемещаемого элемента
                            row[i].value = false // значение в старом элементе обнуляем
                            let animationTarget = {
                                animationType: 'move',
                                animationTargetRow: row[i].row,
                                animationTargetColumn: row[i].column,
                                animationDirection: direction,
                                animationDistance: n-i,
                            }
                            animationData.push(animationTarget)
                            break // переходим к следующему передвигаемому элементу во внешний цикл
                        }
                    }
                }
            }
        }
    }
    if (direction === 'top') {
        for (let column of verticalColumns) { // проходимся по каждой из колонок
            for (let element of sum(column, 'top')) {
                animationData.push(element)
            }
            for (let i = 1; i < column.length; i++) { // нулевой элемент не учитываем, он и так в крайней высшей (?) позиции
                if (column[i].value !== false) { // нас интересуют только не пустые элементы
                    for (let n = 0; n <= i; n++) { // двигаемся по элементам ряда от его начала к индексу элемента
                        if (column[n].value === false) { // если находим пустой элемент
                            column[n].value = column[i].value // перезаписываем в него значение перемещаемого элемента
                            column[i].value = false // значение в старом элементе обнуляем
                            let animationTarget = {
                                animationType: 'move',
                                animationTargetRow: column[i].row,
                                animationTargetColumn: column[i].column,
                                animationDirection: direction,
                                animationDistance: i-n,
                            }
                            animationData.push(animationTarget)
                            break // переходим к следующему передвигаемому элементу во внешний цикл
                        }
                    }
                }
            }
        }
    }
    if (direction === 'bottom') {
        for (let column of verticalColumns) { // проходимся по каждой из колонок
            for (let element of sum(column, 'bottom')) {
                animationData.push(element)
            }
            for (let i = column.length-2; i >= 0; i--) { // тк двигаемся сверху вниз, начинаем с с конца массива (последний элемент не учитываем,тк он в любом случае в крайнем нижнем положении)
                if (column[i].value !== false) { // нас интересуют только не пустые элементы
                    for (let n = column.length-1; n >= i; n--) { // двигаемся по элементам ряда от его конца к индексу элемента (снизу вверх)
                        if (column[n].value === false) { // если находим пустой элемент
                            column[n].value = column[i].value // перезаписываем в него значение перемещаемого элемента
                            column[i].value = false // значение в старом элементе обнуляем
                            let animationTarget = {
                                animationType: 'move',
                                animationTargetRow: column[i].row,
                                animationTargetColumn: column[i].column,
                                animationDirection: direction,
                                animationDistance: n-i,
                            }
                            animationData.push(animationTarget)
                            break // переходим к следующему передвигаемому элементу во внешний цикл
                        }
                    }
                }
            }
        }
    }
    if (animationData.length > 0) {
        animationDone = false // если в массив анимаций были добавлены новые элементы, обнуляем индикатор выполнения анимаций
        let newElement = elementCreate(grid)
        let animationTarget = {
            animationType: 'append',
            animationTargetRow: newElement.row,
            animationTargetColumn: newElement.column,
            animationNewValue: newElement.value
        }
        animationData.push(animationTarget)
    }
    return animationData
}

function sum(targetArray, direction) { // В качестве аргумента передаем массив элементов (колонку или ряд) в котором содержится элемент и счетчик изменений
    let innerAnimationData = []
    if ((direction === 'left') || (direction === 'top')) { // для этих направлений двигаемся от начала массива к концу
        for (let i = 0; i < targetArray.length; i++) {
            if (innerAnimationData.length === 2) { // если это вторая операция сложения за этот вызов функции, прекращаем складывать вообще
                break
            }
            if (targetArray[i].value !== false) { // инетерсуют только непустые элементы
                for (let n = i+1; n < targetArray.length; n++) {
                    if (targetArray[n].value === targetArray[i].value) {
                        let spaceChecker = true
                        for (let element of targetArray.slice(i+1, n)) {
                            if (element.value !== false) {
                                spaceChecker = false
                            }
                        }
                        if (spaceChecker) {
                            targetArray[i].value *= 2 + ''
                            targetArray[n].value = false
                            currentScore += targetArray[i].value // НОВОЕ значение добавляем к счетчику
                            let animationTarget = {
                                animationType: 'sum',
                                animationTargetRow: targetArray[n].row,
                                animationTargetColumn: targetArray[n].column,
                                animationDirection: direction,
                                animationDistance: n-i,
                                animationNewValue: targetArray[i].value,
                            }
                            innerAnimationData.push(animationTarget)
                            break // выйти во внешний цикл, тк к этому элементу уже ничего прибавлять не нужно
                        }
                    }
                }
            }
        }
    }
    if ((direction === 'right') || (direction === 'bottom')) { // для этих направлений двигаемся от конца массива к началу
        for (let i = targetArray.length-1; i >= 0; i--) {
            if (innerAnimationData.length === 2) { // если это вторая операция сложения за этот вызов функции, прекращаем складывать вообще
                break
            }
            if (targetArray[i].value !== false) { // только непустые элементы
                for (let n = i-1; n >= 0; n--) {
                    if (targetArray[n].value === targetArray[i].value) {
                        let spaceChecker = true
                        for (let element of targetArray.slice(n+1, i)) {
                            if (element.value !== false) {
                                spaceChecker = false
                            }
                        }
                        if (spaceChecker) {
                            targetArray[i].value *= 2 + ''
                            targetArray[n].value = false
                            currentScore += targetArray[i].value // НОВОЕ значение добавляем к счетчику
                            let animationTarget = {
                                animationType: 'sum',
                                animationTargetRow: targetArray[n].row,
                                animationTargetColumn: targetArray[n].column,
                                animationDirection: direction,
                                animationDistance: i-n,
                                animationNewValue: targetArray[i].value,
                            }
                            innerAnimationData.push(animationTarget)
                            break // выйти во внешний цикл, тк к этому элементу уже ничего прибавлять не нужно
                        }
                    }
                }
            }
        }
    }
    return innerAnimationData
}

function animate(targetAnimationData) {
    let htmlRows = document.querySelectorAll('tr')
    let htmlColumns = []
    for (let i = 0; i < columnsNumber; i++) {
        let htmlColumn = []
        for (let row of htmlRows) {
            htmlColumn.push(row.querySelectorAll('td')[i])
        }
        htmlColumns.push(htmlColumn)
    }
    for (let element of targetAnimationData) {
        if (element.animationType === 'move') {
            if ((element.animationDirection === 'right') || (element.animationDirection === 'left')) {
                let currentRowHtmlCells = htmlRows[element.animationTargetRow - 1].querySelectorAll('td') // на 1 меньше тк массив начинается с 0
                if (element.animationDirection === 'right') {
                    let currentAnimationTarget = currentRowHtmlCells[element.animationTargetColumn - 1].firstElementChild
                    if (currentAnimationTarget !== null) {
                        setTimeout(function () {
                            currentAnimationTarget.style.animation = 'none'
                        })
                        currentAnimationTarget.style.left = 120 * element.animationDistance + 'px'
                        setTimeout(function () {
                            let targetHtmlCell = currentRowHtmlCells[(element.animationTargetColumn - 1) + element.animationDistance] // тк двигаемся к концу массива (направо), складываем
                            targetHtmlCell.appendChild(currentAnimationTarget)
                            currentAnimationTarget.style.left = '0'
                            currentAnimationTarget.style.zIndex = '1'
                            for (let cell of currentRowHtmlCells) { // тк в результате передвижений складываемых элементов они оба оказываются внутри целевого блока, один из них нужно удалить
                                if (cell.childElementCount > 1) {
                                    cell.firstElementChild.remove()
                                }
                            }
                        }, 200)
                    }
                }
                if (element.animationDirection === 'left') {
                    let currentAnimationTarget = currentRowHtmlCells[element.animationTargetColumn - 1].firstElementChild
                    if (currentAnimationTarget !== null) {
                        setTimeout(function () {
                            currentAnimationTarget.style.animation = 'none'
                        })
                        currentAnimationTarget.style.left = -240 * element.animationDistance + 'px'
                        setTimeout(function () {
                            let targetHtmlCell = currentRowHtmlCells[(element.animationTargetColumn - 1) - element.animationDistance] // тк двигаемся к началу массива (налево), вычитаем
                            targetHtmlCell.appendChild(currentAnimationTarget)
                            currentAnimationTarget.style.left = '0'
                            currentAnimationTarget.style.zIndex = '1'
                            for (let cell of currentRowHtmlCells) {
                                if (cell.childElementCount > 1) {
                                    cell.firstElementChild.remove()
                                }
                            }
                        }, 200)
                    }
                }
            }
            if ((element.animationDirection === 'top') || (element.animationDirection === 'bottom')) {
                let currentColumnsHtmlCells = htmlColumns[element.animationTargetColumn - 1]
                if (element.animationDirection === 'top') {
                    let currentAnimationTarget = currentColumnsHtmlCells[element.animationTargetRow - 1].firstElementChild
                    if (currentAnimationTarget !== null) {
                        setTimeout(function () {
                            currentAnimationTarget.style.animation = 'none'
                        })
                        currentAnimationTarget.style.top = -120 * element.animationDistance + 'px'
                        setTimeout(function () {
                            let targetHtmlCell = currentColumnsHtmlCells[(element.animationTargetRow - 1) - element.animationDistance]
                            targetHtmlCell.appendChild(currentAnimationTarget)
                            currentAnimationTarget.style.top = '0'
                            currentAnimationTarget.style.zIndex = '1'
                            for (let cell of currentColumnsHtmlCells) {
                                if (cell.childElementCount > 1) {
                                    cell.firstElementChild.remove()
                                }
                            }
                        }, 200)
                    }
                }
                if (element.animationDirection === 'bottom') {
                    let currentAnimationTarget = currentColumnsHtmlCells[element.animationTargetRow - 1].firstElementChild
                    if (currentAnimationTarget !== null) {
                        setTimeout(function () {
                            currentAnimationTarget.style.animation = 'none'
                        })
                        currentAnimationTarget.style.top = 120 * element.animationDistance + 'px'
                        setTimeout(function () {
                            let targetHtmlCell = currentColumnsHtmlCells[(element.animationTargetRow - 1) + element.animationDistance]
                            targetHtmlCell.appendChild(currentAnimationTarget)
                            currentAnimationTarget.style.top = '0'
                            currentAnimationTarget.style.zIndex = '1'
                            for (let cell of currentColumnsHtmlCells) {
                                if (cell.childElementCount > 1) {
                                    cell.firstElementChild.remove()
                                }
                            }
                        }, 200)
                    }
                }
            }
        }
        if (element.animationType === 'append') {
            setTimeout(function () {
                drawElements(element)
                animationDone = true // ВНУТРИ таймаута (то есть уже после выполнения анимаций) даем счетчику знать, что анимация выполнена. тк любая анимация сопровождается вставкой нового элемента, счетчик ставим только сюда
            }, 300)
        }
        if (element.animationType === 'sum') {
            if ((element.animationDirection === 'left') || (element.animationDirection === 'right')) {
                let currentRowHtmlCells = htmlRows[element.animationTargetRow - 1].querySelectorAll('td') // на 1 меньше тк массив начинается с 0
                if (element.animationDirection === 'left') {
                    let movementDistance = 0 // счетчик для считывания дистанции статичного и передвигающегося суммируемых блоков
                    let currentAnimationTarget = currentRowHtmlCells[element.animationTargetColumn - 1].lastElementChild //блок значение которого изменится в ходе сложения
                    if (currentAnimationTarget !== null) {
                        for (let otherAnimationData of targetAnimationData) {
                            if ((otherAnimationData.animationType === 'move') && (otherAnimationData.animationTargetRow === element.animationTargetRow) && (otherAnimationData.animationTargetColumn === element.animationTargetColumn - element.animationDistance + '')) {
                                movementDistance = otherAnimationData.animationDistance // ищем среди других объектов анимации тот, который создавался для перемещения результата сложения 2/2/2/2 => -/4/-/4 => -/-/4/4 => одну из четверок после сложения нужно передвинуть еще на 1. это значение хранит счетчик
                                }
                        } // создаем два анимационных объекта для каждого из слагаемых
                            let sumMoveAnimation1 = { // первый - статичный (относительно операции сложения)
                            animationType: 'move',
                            animationTargetRow: element.animationTargetRow,
                            animationTargetColumn: +element.animationTargetColumn - element.animationDistance,
                            animationDirection: element.animationDirection,
                            animationDistance: movementDistance,
                        }
                        let sumMoveAnimation2 = { // второй - подвижный (относительно операции сложения)
                            animationType: 'move',
                            animationTargetRow: element.animationTargetRow,
                            animationTargetColumn: element.animationTargetColumn,
                            animationDirection: element.animationDirection,
                            animationDistance: movementDistance + element.animationDistance,
                        }
                        targetAnimationData.push(sumMoveAnimation1) // передаем объекты в основной цикл анимирующей функции
                        targetAnimationData.push(sumMoveAnimation2) // СНАЧАЛА статичный а ПОТОМ подвижный
                        currentAnimationTarget.innerText = element.animationNewValue // меняем значение одного из элементов
                        currentAnimationTarget.style.zIndex = '2' // чтобы блок с новым значением всегда был сверху
                        defineColor(currentAnimationTarget) // меняем цвет и возвращемся во внешний цикл
                    }
                }
                if (element.animationDirection === 'right') {
                    let movementDistance = 0
                    let currentAnimationTarget = currentRowHtmlCells[element.animationTargetColumn - 1].lastElementChild
                    if (currentAnimationTarget !== null) {
                        for (let otherAnimationData of targetAnimationData) {
                            if ((otherAnimationData.animationType === 'move') && (otherAnimationData.animationTargetRow === element.animationTargetRow) && (otherAnimationData.animationTargetColumn === +element.animationTargetColumn + element.animationDistance + '')) {
                                movementDistance = otherAnimationData.animationDistance
                            }
                        }
                        let sumMoveAnimation1 = { // двигается
                            animationType: 'move',
                            animationTargetRow: element.animationTargetRow,
                            animationTargetColumn: element.animationTargetColumn,
                            animationDirection: element.animationDirection,
                            animationDistance: movementDistance + element.animationDistance,
                        }
                        let sumMoveAnimation2 = { // статичный
                            animationType: 'move',
                            animationTargetRow: element.animationTargetRow,
                            animationTargetColumn: +element.animationTargetColumn + element.animationDistance,
                            animationDirection: element.animationDirection,
                            animationDistance: movementDistance,
                        }
                        targetAnimationData.push(sumMoveAnimation2) // СНАЧАЛА статичный а ПОТОМ подвижный (в зависимости от направления статичный и подвижный разные)
                        targetAnimationData.push(sumMoveAnimation1)
                        currentAnimationTarget.innerText = element.animationNewValue
                        currentAnimationTarget.style.zIndex = '2' // чтобы блок с новым значением всегда был сверху
                        defineColor(currentAnimationTarget)
                    }
                }
            }
            if ((element.animationDirection === 'top') || (element.animationDirection === 'bottom')) {
                let currentColumnsHtmlCells = htmlColumns[element.animationTargetColumn - 1]
                if (element.animationDirection === 'top') {
                    let movementDistance = 0 // счетчик для считывания дистанции статичного и передвигающегося суммируемых блоков
                    let currentAnimationTarget = currentColumnsHtmlCells[element.animationTargetRow - 1].lastElementChild
                    if (currentAnimationTarget !== null) {
                        for (let otherAnimationData of targetAnimationData) {
                            if ((otherAnimationData.animationType === 'move') && (otherAnimationData.animationTargetColumn === element.animationTargetColumn) && (otherAnimationData.animationTargetRow === element.animationTargetRow - element.animationDistance + '')) {
                                movementDistance = otherAnimationData.animationDistance // ищем среди других объектов анимации тот, который создавался для перемещения результата сложения 2/2/2/2 => -/4/-/4 => -/-/4/4 => одну из четверок после сложения нужно передвинуть еще на 1. это значение хранит счетчик
                            }
                        } // создаем два анимационных объекта для каждого из слагаемых
                        let sumMoveAnimation1 = { // первый - статичный (относительно операции сложения)
                            animationType: 'move',
                            animationTargetRow: +element.animationTargetRow - element.animationDistance,
                            animationTargetColumn: element.animationTargetColumn,
                            animationDirection: element.animationDirection,
                            animationDistance: movementDistance,
                        }
                        let sumMoveAnimation2 = { // второй - подвижный (относительно операции сложения)
                            animationType: 'move',
                            animationTargetRow: element.animationTargetRow,
                            animationTargetColumn: element.animationTargetColumn,
                            animationDirection: element.animationDirection,
                            animationDistance: movementDistance + element.animationDistance,
                        }
                        targetAnimationData.push(sumMoveAnimation1) // передаем объекты в основной цикл анимирующей функции
                        targetAnimationData.push(sumMoveAnimation2) // СНАЧАЛА статичный а ПОТОМ подвижный
                        currentAnimationTarget.innerText = element.animationNewValue // меняем значение одного из элементов
                        currentAnimationTarget.style.zIndex = '2' // чтобы блок с новым значением всегда был сверху
                        defineColor(currentAnimationTarget) // меняем цвет и возвращемся во внешний цикл
                    }
                }
                    if (element.animationDirection === 'bottom') {
                        let movementDistance = 0
                        let currentAnimationTarget = currentColumnsHtmlCells[element.animationTargetRow - 1].lastElementChild
                        if (currentAnimationTarget !== null) {
                            for (let otherAnimationData of targetAnimationData) {
                                if ((otherAnimationData.animationType === 'move') && (otherAnimationData.animationTargetColumn === element.animationTargetColumn) && (otherAnimationData.animationTargetRow === +element.animationTargetRow + element.animationDistance + '')) {
                                    movementDistance = otherAnimationData.animationDistance
                                }
                            }
                            let sumMoveAnimation1 = { // двигается
                                animationType: 'move',
                                animationTargetRow: element.animationTargetRow,
                                animationTargetColumn: element.animationTargetColumn,
                                animationDirection: element.animationDirection,
                                animationDistance: movementDistance + element.animationDistance,
                            }
                            let sumMoveAnimation2 = { // статичный
                                animationType: 'move',
                                animationTargetRow: +element.animationTargetRow + element.animationDistance,
                                animationTargetColumn: element.animationTargetColumn,
                                animationDirection: element.animationDirection,
                                animationDistance: movementDistance,
                            }
                            targetAnimationData.push(sumMoveAnimation2) // СНАЧАЛА статичный а ПОТОМ подвижный (в зависимости от направления статичный и подвижный разные)
                            targetAnimationData.push(sumMoveAnimation1)
                            currentAnimationTarget.innerText = element.animationNewValue
                            currentAnimationTarget.style.zIndex = '2' // чтобы блок с новым значением всегда был сверху
                            defineColor(currentAnimationTarget)
                        }
                    }
                }
            }
        }
}

window.addEventListener('keydown', function(event) {
    event.preventDefault()
    if (animationDone) { // проверяем завершилась ли предыдущая анимация
        if (event.code === 'ArrowLeft') {
            let animationArray = move('left')
            queueMicrotask(function () {
                animate(animationArray)
            })
        }
        if (event.code === 'ArrowDown') {
            let animationArray = move('bottom')
            queueMicrotask(function () {
                animate(animationArray)
            })
        }
        if (event.code === 'ArrowUp') {
            let animationArray = move('top')
            queueMicrotask(function () {
                animate(animationArray)
            })
        }
        if (event.code === 'ArrowRight') {
            let animationArray = move('right')
            queueMicrotask(function () {
                animate(animationArray)
            })
        }
    }
})

newGameButton.onclick = function () {
    let currentElements = document.getElementsByClassName('basicElement')
    while (currentElements[0]) {
        currentElements[0].remove()
    }
    for (let element of grid) {
        for (let subelement of element) {
            if (subelement.value !== false) {
                subelement.value = false
            }
        }
    }
    currentScore = 0
    elementCreate(grid)
    elementCreate(grid)
    drawElements(grid)
}

createGrid(5, 5)

grid[0][1].value = 2

grid[0][4].value = 2


drawGrid(grid)
drawElements(grid)


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

generalObserver.observe(mainTable, {
    subtree: true,
    childList: true,
    characterDataOldValue: true
})

flickerObserver.observe(scoreCounter, {
    childList: true,
    characterDataOldValue: true,
    characterData: true
})

