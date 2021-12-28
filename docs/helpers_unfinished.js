import {defineColor} from "./utilityFunctions";

#moveHelper (targetArray, direction, i, n) {
    targetArray[n].value = targetArray[i].value // перезаписываем в него значение перемещаемого элемента
    targetArray[i].value = false // значение в старом элементе обнуляем
    if ((direction === 'left') || (direction === 'top')) {
        let animationTarget = {
            animationType: 'move',
            animationTargetRow: +targetArray[i].row,
            animationTargetColumn: +targetArray[i].column,
            animationDirection: direction,
            animationDistance: i - n,
        }
        return animationTarget
    }
    if ((direction === 'right') || (direction === 'bottom')) {
        let animationTarget = {
            animationType: 'move',
            animationTargetRow: +targetArray[i].row,
            animationTargetColumn: +targetArray[i].column,
            animationDirection: direction,
            animationDistance: n - i,
        }
        return animationTarget
    }
}
#sumHelper (targetArray, direction, i, n) {
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
        if ((direction === 'left') || (direction === 'top')) {
            let animationTarget = {
                animationType: 'sum',
                animationTargetRow: +targetArray[n].row,
                animationTargetColumn: +targetArray[n].column,
                animationDirection: direction,
                animationDistance: n - i,
                animationNewValue: targetArray[i].value,
            }
            return animationTarget
        }
        if ((direction === 'right') || (direction === 'bottom')) {
            let animationTarget = {
                animationType: 'sum',
                animationTargetRow: +targetArray[n].row,
                animationTargetColumn: +targetArray[n].column,
                animationDirection: direction,
                animationDistance: i - n,
                animationNewValue: targetArray[i].value,
            }
            return animationTarget
        }
    }
}
#animateSumHelper (animationElement, targetAnimationData, currentAnimationTarget, direction, movementDistance) {
    let sumMoveAnimation1 = {
        animationType: 'move',
        animationDirection: direction,
        animationDistance: movementDistance,
    }
    let sumMoveAnimation2 = {
        animationType: 'move',
        animationDirection: direction,
        animationDistance: movementDistance + animationElement.animationDistance,
        animationTargetRow: animationElement.animationTargetRow,
        animationTargetColumn: animationElement.animationTargetColumn,
    }
    if (direction === 'left') {
        sumMoveAnimation1.animationTargetRow = animationElement.animationTargetRow
        sumMoveAnimation1.animationTargetColumn = animationElement.animationTargetColumn - animationElement.animationDistance
    }
    if (direction === 'right') {
        sumMoveAnimation1.animationTargetRow = animationElement.animationTargetRow
        sumMoveAnimation1.animationTargetColumn = animationElement.animationTargetColumn + animationElement.animationDistance
    }
    if (direction === 'top') {
        sumMoveAnimation1.animationTargetRow = animationElement.animationTargetRow - animationElement.animationDistance
        sumMoveAnimation1.animationTargetColumn = animationElement.animationTargetColumn
    }
    if (direction === 'bottom') {
        sumMoveAnimation1.animationTargetRow = animationElement.animationTargetRow + animationElement.animationDistance
        sumMoveAnimation1.animationTargetColumn = animationElement.animationTargetColumn
    }
    targetAnimationData.splice(targetAnimationData.indexOf(animationElement+1), 0, sumMoveAnimation1) // СНАЧАЛА статичный а ПОТОМ подвижный (в зависимости от направления статичный и подвижный разные)
    targetAnimationData.splice(targetAnimationData.indexOf(animationElement+2), 0, sumMoveAnimation2)
    currentAnimationTarget.innerText = animationElement.animationNewValue
    currentAnimationTarget.style.zIndex = '2' // чтобы блок с новым значением всегда был сверху
    defineColor(currentAnimationTarget)
}


