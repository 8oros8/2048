'use strict'

import {defineColor} from "./utilityFunctions.js";

import {logicOptions as logicOptions} from "./logic.js";
import {mainGame} from "./logic.js";

const htmlOptions = {
    rootElement: document.getElementById('bodyContainer'),
    scoreWrapper: document.getElementById('scoreWrapper'),
}

class htmlRender {
    #rootElement
    #scoreWrapper
    constructor(options) {
        this.#rootElement = options.rootElement
        this.#scoreWrapper = options.scoreWrapper
        this.#drawGrid(logic.getGrid())
        this.#drawElements(logic.getGrid())
        this.#newGame()
        this.touchStart = null; //Точка начала касания
        this.touchPosition = null; //Текущая позиция
        this.sensitivity = 20
        this.#observers()
        this.touchStartFunc = function (event) {
            this.touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY } //Получаем текущую позицию касания
            this.touchPosition = { x: this.touchStart.x, y: this.touchStart.y }
        }
        this.touchMove = function (event) {
            this.touchPosition = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }
        }
        this.touchEnd = function () {
            let swipeType = this.checkAction() //Определяем, какой жест совершил пользователь
            this.touchStart = null //Очищаем позиции
            this.touchPosition = null
            return swipeType
        }
        this.checkAction = function () {
            let d = { //Получаем расстояния от начальной до конечной точек по обеим осям
                x: this.touchStart.x - this.touchPosition.x,
                y: this.touchStart.y - this.touchPosition.y
            }
            let swipeType //Сообщение
            if(Math.abs(d.x) > Math.abs(d.y)) { //Проверяем, движение по какой оси было длиннее
                if(Math.abs(d.x) > this.sensitivity) {//Проверяем, было ли движение достаточно длинным
                    if(d.x > 0) { //Если значение больше нуля, значит пользователь двигал пальцем справа налево
                        swipeType = "Swipe left"
                    }
                    else { //Иначе он двигал им слева направо
                        swipeType = "Swipe right"
                    }
                }
            }
            else { //Аналогичные проверки для вертикальной оси
                if(Math.abs(d.y) > this.sensitivity) {
                    if(d.y > 0) { //Свайп вверх
                        swipeType = "Swipe up"
                    }
                    else { //Свайп вниз
                        swipeType = "Swipe down"
                    }
                }
            }
            return swipeType
        }
    }
    #drawGrid(targetArray) {
        const mainTable = document.createElement('table')
        mainTable.id = 'mainTable'
        mainTable.style.height = 120*targetArray.length + 20 + 'px'
        mainTable.style.width = 120*targetArray.length + 20 + 'px'
        htmlOptions.rootElement.append(mainTable)
        const tBody = document.createElement('tbody')
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
    #drawElements(target) {
        let htmlRows = htmlOptions.rootElement.firstElementChild.firstElementChild.querySelectorAll('tr')
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
    getDrawElements() {
        return this.#drawElements
    }
    #animate(targetAnimationData) {
        const drawElements = this.getDrawElements()
        let htmlRows = document.querySelectorAll('tr')
        let htmlColumns = []
        for (let i = 0; i < htmlOptions.rootElement.firstElementChild.firstElementChild.firstElementChild.childElementCount; i++) { // количество колонок === количество элементов tr. доступ к tr через root element
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
                    logic.animationDone = true // ВНУТРИ таймаута (то есть уже после выполнения анимаций) даем счетчику знать, что анимация выполнена. тк любая анимация сопровождается вставкой нового элемента, счетчик ставим только сюда
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
                            targetAnimationData.splice(targetAnimationData.length-1, 0 , this.#animateSumHelper(element, element.animationDirection, movementDistance, currentAnimationTarget))
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
                            targetAnimationData.splice(targetAnimationData.length-1, 0 , this.#animateSumHelper(element, element.animationDirection, movementDistance, currentAnimationTarget))
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
                            targetAnimationData.splice(targetAnimationData.length-1, 0 , this.#animateSumHelper(element, element.animationDirection, movementDistance, currentAnimationTarget))
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
                            targetAnimationData.splice(targetAnimationData.length-1, 0 , this.#animateSumHelper(element, element.animationDirection, movementDistance, currentAnimationTarget))
                        }
                    }
                }
            }
        }
    }
    #animateSumHelper (animationElement, direction, movementDistance, currentAnimationTarget) {
        let sumMoveAnimation = {
            animationType: 'move',
            animationDirection: direction,
            animationDistance: movementDistance + animationElement.animationDistance,
            animationTargetRow: animationElement.animationTargetRow,
            animationTargetColumn: animationElement.animationTargetColumn,
        }
        currentAnimationTarget.innerText = animationElement.animationNewValue
        currentAnimationTarget.style.zIndex = '2' // чтобы блок с новым значением всегда был сверху
        defineColor(currentAnimationTarget)
        return sumMoveAnimation
    }
    getAnimate () {
        return this.#animate
    }
    #observers() {
        const generalObserver = new MutationObserver(function ()  { // обновление счета при любых изменениях
            if (logic.currentScore !== parseInt(htmlOptions.scoreWrapper.firstElementChild.innerText)) {
                htmlOptions.scoreWrapper.firstElementChild.innerText = logic.currentScore
            }
        })
        const flickerObserver = new MutationObserver( function () {
            htmlOptions.scoreWrapper.animate( [
                { // from
                    backgroundColor: '#2EE59D'
                },
                { // to
                    backgroundColor: 'whitesmoke'
                }
            ], 500)
        })
        generalObserver.observe(htmlOptions.rootElement.firstElementChild, {
            subtree: true,
            childList: true,
            characterDataOldValue: true
        })
        flickerObserver.observe(htmlOptions.scoreWrapper.firstElementChild, {
            childList: true,
            characterDataOldValue: true,
            characterData: true
        })
    }
    #newGame() {
        const newGameButton = document.getElementById('newGameButton')
        const drawElements = this.#drawElements
        const elementCreate = logic.getElementCreate()
        newGameButton.onclick = function () {
            let currentElements = document.getElementsByClassName('basicElement')
            while (currentElements[0]) {
                currentElements[0].remove()
            }
            for (let element of logic.getGrid()) {
                for (let subelement of element) {
                    if (subelement.value !== false) {
                        subelement.value = false
                    }
                }
            }
            logic.currentScore = 0
            elementCreate(logic.getGrid())
            elementCreate(logic.getGrid())
            drawElements(logic.getGrid())
        }
    }
}

const logic = new mainGame(logicOptions)
const render = new htmlRender(htmlOptions)

function listeners (render, logic) {
    const animate = render.getAnimate().bind(render)
    const move = logic.getMove().bind(logic)
    window.addEventListener('keydown', function(event) {
        event.preventDefault()
        if (logic.animationDone) { // проверяем завершилась ли предыдущая анимация
            if (event.code === 'ArrowLeft') {
                let animationArray = move('left')
                animate(animationArray)
            }
            if (event.code === 'ArrowDown') {
                let animationArray = move('bottom')
                animate(animationArray)
            }
            if (event.code === 'ArrowUp') {
                let animationArray = move('top')
                animate(animationArray)
            }
            if (event.code === 'ArrowRight') {
                let animationArray = move('right')
                animate(animationArray)
            }
        }
    })
    htmlOptions.rootElement.firstElementChild.addEventListener("touchstart", function (e) {
        render.touchStartFunc(e)
    }) //Начало касания
    htmlOptions.rootElement.firstElementChild.addEventListener("touchmove", function (e) {
        render.touchMove(e)
    }) //Движение пальцем по экрану
    htmlOptions.rootElement.firstElementChild.addEventListener("touchend", function (e) {
        e.preventDefault()
        if (render.touchEnd(e) === "Swipe left") {
            let animationArray = move('left')
            animate(animationArray)
        }
        if (render.touchEnd(e) === "Swipe right") {
            let animationArray = move('right')
            animate(animationArray)
        }
        if (render.touchEnd(e) === "Swipe up") {
            let animationArray = move('top')
            animate(animationArray)
        }
        if (render.touchEnd(e) === "Swipe down") {
            let animationArray = move('bottom')
            animate(animationArray)
        }
    })
}


listeners(render, logic)
