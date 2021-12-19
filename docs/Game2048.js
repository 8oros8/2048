const options = {
  gridWidth: 5,
  gridHeight: 6
}

class Game2048 {
  // Сетка
  #grid;

  // Счет
  #score;

  // Передаем опции для игры
  constructor(options) {
    // Генерируем сетку
  }

  move(direction) {
    // Выполняем действия на сетке
    // Возвращать массив объектов изменений
  }

  reset() {
    // Ресетим сетку
  }

  getScore() {
    // Получение счета
  }

  getState() {
    // Возвращаем сетку в формате двумерного массива
  }
}

const instance = new Game2048()

instance.move('right')

console.log(instance.getState())

console.log(instance.getScore())

instance.reset()
