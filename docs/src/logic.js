'use strict'

export {logicOptions, mainGame}

import {getRandomInt} from "./utilityFunctions.js";

const logicOptions = {
    gridWidth: 4,
    gridHeight: 4,
}

class mainGame {
    grid = [];
    constructor(options) {
        this.getGrid = function () {
            return this.grid
        }
        this.addToCurrentScore = function (value) {
            this.currentScore += value
        }
        this.createGrid = function (height, width) {
            for (let i = 1; i <= height; i++) {
                let row = []
                this.grid.push(row)
                for (let n = 1; n <= width; n++) {
                    let cell = {
                        value: false,
                        row: `${i}`,
                        column: `${n}`
                    }
                    row.push(cell)
                }
            }
            return this.grid
        }
        this.elementCreate = function (targetGrid) { // Создаем два новых элемента; "2" с шансом 90%, "4" с шансом 10%
            let newElementValue
            if (getRandomInt(0,10) === 9) {
                newElementValue = 4
            }
            else newElementValue = 2

            let rowIndex
            let columnIndex
            do {
                rowIndex = getRandomInt(0, logicOptions.gridHeight)
                columnIndex = getRandomInt(0, logicOptions.gridWidth)
            } while (targetGrid[+rowIndex][+columnIndex].value !== false);
            targetGrid[+rowIndex][+columnIndex].value = newElementValue
            return targetGrid[rowIndex][columnIndex]
        }
        this.getElementCreate = function () {
            return this.elementCreate
        }
        this.move = function (direction) {
            const horizontalRows = this.grid // массив горизонтальных рядов таблицы
            let animationData = []
            let verticalColumns = []
            for (let i = 0; i < this.grid[0].length; i++) {
                let column = []
                for (let row of this.grid) {
                    column.push(row[i])
                }
                verticalColumns.push(column)
            }
            if (direction === 'left') {
                for (let row of horizontalRows) { // проходимся по каждому из рядов
                    for (let element of this.sum(row, 'left')) {
                        animationData.push(element)
                    }
                    for (let i = 1; i < row.length; i++) { // нулевой элемент не учитываем, он и так в крайней левой позиции
                        if (row[i].value !== false) { // нас интересуют только не пустые элементы
                            for (let n = 0; n <= i; n++) { // двигаемся по элементам ряда от его начала к индексу элемента
                                if (row[n].value === false) { // если находим пустой элемент
                                    row[n].value = row[i].value // перезаписываем в него значение перемещаемого элемента
                                    row[i].value = false // значение в старом элементе обнуляем
                                    animationData.push(this.moveHelper(row, 'left', i, n)) // moveHelper создает анимационный объект движения, затем сразу же добавляем его к массиву анимаций передвижения
                                    break // переходим к следующему передвигаемому элементу во внешний цикл
                                }
                            }
                        }
                    }
                }
            }
            if (direction === 'right') {
                for (let row of horizontalRows) { // проходимся по каждому из рядов
                    for (let element of this.sum(row, 'right')) {
                        animationData.push(element)
                    }
                    for (let i = row.length-2; i >= 0; i--) { // тк двигаемся слева направо, начинаем с с конца массива (последний элемент не учитываем,тк он в любом случае в крайнем правом положении)
                        if (row[i].value !== false) { // нас интересуют только не пустые элементы
                            for (let n = row.length-1; n >= i; n--) { // двигаемся по элементам ряда от его конца к индексу элемента
                                if (row[n].value === false) { // если находим пустой элемент
                                    row[n].value = row[i].value // перезаписываем в него значение перемещаемого элемента
                                    row[i].value = false // значение в старом элементе обнуляем
                                    animationData.push(this.moveHelper(row, 'right', i, n)) // moveHelper создает анимационный объект движения, затем сразу же добавляем его к массиву анимаций передвижения
                                    break // переходим к следующему передвигаемому элементу во внешний цикл
                                }
                            }
                        }
                    }
                }
            }
            if (direction === 'top') {
                for (let column of verticalColumns) { // проходимся по каждой из колонок
                    for (let element of this.sum(column, 'top')) {
                        animationData.push(element)
                    }
                    for (let i = 1; i < column.length; i++) { // нулевой элемент не учитываем, он и так в крайней высшей (?) позиции
                        if (column[i].value !== false) { // нас интересуют только не пустые элементы
                            for (let n = 0; n <= i; n++) { // двигаемся по элементам ряда от его начала к индексу элемента
                                if (column[n].value === false) { // если находим пустой элемент
                                    column[n].value = column[i].value // перезаписываем в него значение перемещаемого элемента
                                    column[i].value = false // значение в старом элементе обнуляем
                                    animationData.push(this.moveHelper(column, 'top', i, n)) // moveHelper создает анимационный объект движения, затем сразу же добавляем его к массиву анимаций передвижения
                                    break // переходим к следующему передвигаемому элементу во внешний цикл
                                }
                            }
                        }
                    }
                }
            }
            if (direction === 'bottom') {
                for (let column of verticalColumns) { // проходимся по каждой из колонок
                    for (let element of this.sum(column, 'bottom')) {
                        animationData.push(element)
                    }
                    for (let i = column.length-2; i >= 0; i--) { // тк двигаемся сверху вниз, начинаем с с конца массива (последний элемент не учитываем,тк он в любом случае в крайнем нижнем положении)
                        if (column[i].value !== false) { // нас интересуют только не пустые элементы
                            for (let n = column.length-1; n >= i; n--) { // двигаемся по элементам ряда от его конца к индексу элемента (снизу вверх)
                                if (column[n].value === false) { // если находим пустой элемент
                                    column[n].value = column[i].value // перезаписываем в него значение перемещаемого элемента
                                    column[i].value = false // значение в старом элементе обнуляем
                                    animationData.push(this.moveHelper(column, 'bottom', i, n)) // moveHelper создает анимационный объект движения, затем сразу же добавляем его к массиву анимаций передвижения
                                    break // переходим к следующему передвигаемому элементу во внешний цикл
                                }
                            }
                        }
                    }
                }
            }
            if (animationData.length > 0) {
                this.animationDone = false // если в массив анимаций были добавлены новые элементы, обнуляем индикатор выполнения анимаций
                let newElement = this.elementCreate(this.grid)
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
        this.moveHelper = function (targetArray, direction, i, n) {
            if ((direction === 'left') || (direction === 'top')) {
                let animationTarget = {
                    animationType: 'move',
                    animationTargetRow: targetArray[i].row,
                    animationTargetColumn: targetArray[i].column,
                    animationDirection: direction,
                    animationDistance: i - n,
                }
                return animationTarget
            }
            if ((direction === 'right') || (direction === 'bottom')) {
                let animationTarget = {
                    animationType: 'move',
                    animationTargetRow: targetArray[i].row,
                    animationTargetColumn:targetArray[i].column,
                    animationDirection: direction,
                    animationDistance: n - i,
                }
                return animationTarget
            }
        } // функция для создания анимационных объектов движения
        this.getMove = function () {
            return this.move
        }
        this.sum = function (targetArray, direction) { // В качестве аргумента передаем массив элементов (колонку или ряд) в котором содержится элемент и счетчик изменений
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
                                    this.addToCurrentScore(targetArray[i].value) // НОВОЕ значение добавляем к счетчику
                                    innerAnimationData.push(this.sumHelper(targetArray, direction, i, n)) // sumHelper создает анимационный объект сложения, затем сразу же добавляем его к массиву анимаций сложения
                                    break
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
                                    this.addToCurrentScore(targetArray[i].value) // НОВОЕ значение добавляем к счетчику
                                    innerAnimationData.push(this.sumHelper(targetArray, direction, i, n)) // sumHelper создает анимационный объект сложения, затем сразу же добавляем его к массиву анимаций сложения
                                    break
                                }
                            }
                        }
                    }
                }
            }
            return innerAnimationData // возвращаем массив анимаций сложения
        }
        this.sumHelper = function (targetArray, direction, i, n) {
            if ((direction === 'left') || (direction === 'top')) {
                let animationTarget = {
                    animationType: 'sum',
                    animationTargetRow: targetArray[n].row,
                    animationTargetColumn: targetArray[n].column,
                    animationDirection: direction,
                    animationDistance: n-i,
                    animationNewValue: targetArray[i].value,
                }
                return animationTarget
            }
            if ((direction === 'right') || (direction === 'bottom')) {
                let animationTarget = {
                    animationType: 'sum',
                    animationTargetRow: targetArray[n].row,
                    animationTargetColumn: targetArray[n].column,
                    animationDirection: direction,
                    animationDistance: i-n,
                    animationNewValue: targetArray[i].value,
                }
                return animationTarget
            }
        } // функция для создания анимационных объектов суммирования

        this.grid = this.createGrid(options.gridHeight, options.gridWidth)
        this.currentScore = 0
        this.animationDone = true
    }
}