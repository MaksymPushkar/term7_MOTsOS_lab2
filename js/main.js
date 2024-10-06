function FourierCoefficient(N, k) {
  let A = 0;
  let B = 0;

  for (let n = 0; n < N; n++) {
    A += sd(n) * Math.cos((-2 * Math.PI * k * n) / N);
    B += sd(n) * Math.sin((-2 * Math.PI * k * n) / N);
  }

  A /= N;
  B /= N;

  return {
    A: A,
    B: B,
    module: ModuleFourierCoefficient(A, B),
    arg: ArgFourierCoefficient(A, B),
  };
}

function ModuleFourierCoefficient(A, B) {
  return Math.sqrt(A ** 2 + B ** 2);
}

function ArgFourierCoefficient(A, B) {
  return Math.atan2(B, A);
}

function sd(n) {
  let NBinary = "01110010"; // 96 + 18 = 114; 114 -> 01110010
  return parseInt(NBinary.charAt(n));
}

function calculateFourierCoefficients(N) {
  let C = [];
  for (let k = 0; k <= N / 2; k++) {
    C.push(FourierCoefficient(N, k));
  }
  return C;
}

function primaryAnalogSignal(C, t) {
  let s = C[0].module;
  for (let k = 1; k < C.length - 1; k++) {
    s += 2 * C[k].module * Math.cos(2 * Math.PI * t * k + C[k].arg);
  }
  s +=
    C[C.length - 1].module *
    Math.cos(2 * Math.PI * t * (C.length - 1) + C[C.length - 1].arg);
  return s;
}

// Візуалізація за допомогою Chart.js з анотаціями

let N = 8;
let C = calculateFourierCoefficients(N); // обчислюємо коефіцієнти Фур'є
let dataPoints = [];
let labels = [];
let intervalsNumber = 32;

// Перетворення назад
let inverseTransformation = "";

for (let i = 0; i < N; i++) {
  inverseTransformation += Math.round(primaryAnalogSignal(C, i / N));
}

console.log(inverseTransformation);

// Генеруємо точки для графіка
for (let i = 0; i <= intervalsNumber; i++) {
  let t = i / intervalsNumber;
  labels.push(t.toFixed(2));
  dataPoints.push(primaryAnalogSignal(C, t));
}

// Налаштування графіка з горизонтальними лініями
const ctx = document.getElementById("fourierChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line", // Тип графіка
  data: {
    labels: labels, // Позначки по осі X
    datasets: [
      {
        label: "Primary Analog Signal",
        data: dataPoints, // Значення функції
        borderColor: "rgba(75, 192, 192, 1)", // Колір лінії
        borderWidth: 2, // Товщина лінії
        fill: false, // Вимикаємо заповнення під лінією
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (t)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Signal Amplitude",
        },
        suggestedMin: -1, // Мінімальне значення по осі Y
        suggestedMax: 2, // Максимальне значення по осі Y
      },
    },
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: "line",
            yMin: 0, // Позиція лінії на рівні 0
            yMax: 0,
            borderColor: "rgba(255, 99, 132, 1)", // Колір лінії
            borderWidth: 2, // Товщина лінії
            label: {
              enabled: true,
              content: "y = 0",
              position: "end",
            },
          },
          line2: {
            type: "line",
            yMin: 1, // Позиція лінії на рівні 1
            yMax: 1,
            borderColor: "rgba(54, 162, 235, 1)", // Колір лінії
            borderWidth: 2, // Товщина лінії
            label: {
              enabled: true,
              content: "y = 1",
              position: "end",
            },
          },
        },
      },
    },
  },
});
