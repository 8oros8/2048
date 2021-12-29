'use strict'




#animateMoveHelper (currentAnimationTarget, animationElement) {
    setTimeout(function () {
        currentAnimationTarget.style.animation = 'none'
    })
    if ((animationElement.animationDirection === 'left') || (animationElement.animationDirection === 'right')) {
        if (animationElement.animationDirection === 'left') {
            currentAnimationTarget.style.left = -240 * animationElement.animationDistance + 'px'
        }
        if (animationElement.animationDirection === 'right') {
            currentAnimationTarget.style.left = 120 * animationElement.animationDistance + 'px'
        }
    }
    if ((animationElement.animationDirection === 'top') || (animationElement.animationDirection === 'bottom')) {
        if (animationElement.animationDirection === 'top') {
            currentAnimationTarget.style.top = -120 * animationElement.animationDistance + 'px'
        }
        if (animationElement.animationDirection === 'bottom') {
            currentAnimationTarget.style.top = 120 * animationElement.animationDistance + 'px'
        }
    }
}
