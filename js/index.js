// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector(".fruits__list"); // список карточек
const shuffleButton = document.querySelector(".shuffle__btn"); // кнопка перемешивания
const filterButton = document.querySelector(".filter__btn"); // кнопка фильтрации
const sortKindLabel = document.querySelector(".sort__kind"); // поле с названием сортировки
const sortTimeLabel = document.querySelector(".sort__time"); // поле с временем сортировки
const sortChangeButton = document.querySelector(".sort__change__btn"); // кнопка смены сортировки
const sortActionButton = document.querySelector(".sort__action__btn"); // кнопка сортировки
const kindInput = document.querySelector(".kind__input"); // поле с названием вида
const colorInput = document.querySelector(".color__input"); // поле с названием цвета
const weightInput = document.querySelector(".weight__input"); // поле с весом
const addActionButton = document.querySelector(".add__action__btn"); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "желтый", "weight": 35},
  {"kind": "Личи", "color": "красный", "weight": 17},
  {"kind": "Карамбола", "color": "зеленый", "weight": 28},
  {"kind": "Тамаринд", "color": "коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
console.log("first fruits", fruits);

let lastFruits = [];
let displayedArr = [];

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
function display(arr) {
  fruitsList.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    // Insert li element
    let liNew = document.createElement("li");
    liNew.className = "fruit__item fruit_violet";
    fruitsList.appendChild(liNew);

    // Insert block: div-info
    let divInfo = document.createElement("div");
    divInfo.className = "fruit__info";
    liNew.append(divInfo);

    // Insert divs and fruit content in the main div-info
    let divIndex = document.createElement("div");
    divIndex.innerHTML = `<strong>index: </strong> ${i}`;

    let divKind = document.createElement("div");
    divKind.innerHTML = `<strong>kind: </strong>${arr[i]["kind"]}`;

    let divColor = document.createElement("div");
    divColor.innerHTML = `<strong>color: </strong>${arr[i].color}`;

    let divWeight = document.createElement("div");
    divWeight.innerHTML = `<strong>weight (кг): </strong>${arr[i].weight}`;

    divInfo.append(divIndex, divKind, divColor, divWeight);

    displayedArr = arr;
  }
}

// первая отрисовка карточек
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  while (fruits.length > 0) {
    let deletedFruit = fruits.splice(getRandomInt(0, fruits.length - 1), 1);
    result.push(deletedFruit[0]);
  }

  fruits = result;

  // Проверка на дубль массива и алерт
  if (JSON.stringify(lastFruits) === JSON.stringify(result)) {
    alert("Попался дубль массива, перемешайте еще разок");
    console.log("Попался дубль массива идем на переобход");
  }
};

shuffleButton.addEventListener("click", () => {
  shuffleFruits();
  lastFruits = fruits;
  display(fruits);
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
function FilterByWeight(minWeight = 0, maxWeight = Infinity, notFiltredFruits) {
  let result = [];
  result = notFiltredFruits.filter((item) => {
    return item.weight >= minWeight && item.weight <= maxWeight;
  });

  display(result);
}

filterButton.addEventListener("click", (event) => {
  event.preventDefault;

  let minWeight =
    document.getElementById("minWeight").value == ""
      ? 0
      : document.getElementById("minWeight").value;
  let maxWeight =
    document.getElementById("maxWeight").value == ""
      ? Infinity
      : document.getElementById("maxWeight").value;
  let notFiltredFruits = fruits;
  FilterByWeight(minWeight, maxWeight, notFiltredFruits);
});

/*** СОРТИРОВКА ***/

let sortKind = "bubbleSort"; // инициализация состояния вида сортировки
let sortTime = "-"; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const priority = [
    "белый",
    "красный",
    "оранжевый",
    "желтый",
    "зеленый",
    "голубой",
    "синий",
    "фиолетовый",
    "коричневый",
    "черный",
  ];
  const indexA = priority.indexOf(a.color);
  const indexB = priority.indexOf(b.color);
  return indexA > indexB;
};

const sortAPI = {
  bubbleSort(arr) {
    for (let j = 0; j < arr.length; j++) {
      for (let i = 0; i < arr.length - 1 - j; i++) {
        if (comparationColor(arr[i], arr[i + 1])) {
          let temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
        }
      }
    }
  },

  quickSort(arr) {
    if (arr.length < 2) {
      return arr;
    }

    const index = Math.floor(Math.random() * arr.length);
    const currentItem = arr[index];

    const left = [];
    const right = [];

    for (let i = 0; i < arr.length; i++) {
      if (i === index) {
        continue;
      }

      if (comparationColor(arr[i], currentItem)) {
        right.push(arr[i]);
      } else {
        left.push(arr[i]);
      }
    }

    let firstResult = [
      ...sortAPI.quickSort(left),
      currentItem,
      ...sortAPI.quickSort(right),
    ];

    displayedArr = firstResult;

    return firstResult;
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr) {
    const start = new Date().getTime();
    sort(arr);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
    // console.log("sortTime", sortTime)
    // console.log("arr 2", arr);
    sortTimeLabel.textContent = sortTime;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener("click", () => {
  if (sortKind == "bubbleSort") {
    sortKindLabel.textContent = "quickSort";
    sortKind = "quickSort";
  } else {
    sortKindLabel.textContent = "bubbleSort";
    sortKind = "bubbleSort";
  }
});

sortActionButton.addEventListener("click", () => {
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, displayedArr);
  display(displayedArr);
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener("click", () => {
  let kindInputValue = kindInput.value;
  let colorInputValue = colorInput.value;
  let weightInputValue = Number(weightInput.value.replace(",", "."));

  if (kindInputValue == "" || colorInputValue == "" || weightInputValue == "") {
    alert("Нужно ввести все значения для добавления нового фрукта");
  } else if (Number(weightInputValue) < 0 || isNaN(weightInputValue)) {
    alert(
      "Ну разве может быть такой вес? Ну серьезно! Введите корректное положительное число"
    );
  } else {
    let newFruit = {
      kind: kindInputValue,
      color: colorInputValue,
      weight: Number(weightInputValue),
    };

    fruits.push(newFruit);

    display(fruits);
    kindInput.value = "";
    colorInput.value = "";
    weightInput.value = "";
  }
});
