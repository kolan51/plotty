"use strict";

var speedCanvas = document.getElementById("heatPumpChart");
const btnPlot = document.querySelector(".btn");

// Chart.defaults.global.defaultFontFamily = "Lato";
// Chart.defaults.global.defaultFontSize = 18;

//* Reads file from local storage inside project
var fileInput = document.getElementById("fileInput");
var fileDisplayArea = document.getElementById("fileDisplayArea");
var date = document.querySelector(".date");
var version = document.querySelector(".version");
var versionR = document.querySelector(".rVersion");

var divisors = [];
var parameters = [];
var data = [];

var dataLoaded = false;

fileInput.addEventListener("change", function (e) {
  var file = fileInput.files[0];
  var textType = /text.*/;
  divisors = [];
  parameters = [];
  data = [];
  if (file.type.match(textType)) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var content = reader.result;

      // By lines
      var lines = content.replace("/\\t/g", "").split("\n");
      for (var line = 0; line < lines.length; line++) {
        switch (line) {
          case 0:
            divisors = lines[line]
              .replace("Divisors", "")
              .replace("\r", "")
              .replace(" ", "0")
              .split("\t");
            divisors[0] = "0";
            divisors[1] = "0";
            break;
          case 1:
            parameters = lines[line].replace("\r", "").split("\t");
            parameters = parameters.slice(4, parameters.length);
            break;
          default:
            data.push(lines[line].replace("\r", "").split("\t"));
            break;
        }
      }
      dataLoaded = true;
      date.textContent = "Date of data collection: " + data[0][0];
      version.textContent = "Version(43001): " + data[0][3];
      versionR.textContent = "R-version(44331): " + data[0][4];
      toggleChart();
      alert("Pump Data loaded!");
    };

    reader.readAsText(file);
  } else {
    fileDisplayArea.innerText = "File not supported!";
  }
});

const zoomOptions = {
  limits: {
    x: { min: -200, max: 200, minRange: 50 },
    y: { min: -200, max: 200, minRange: 50 },
  },
  pan: {
    enabled: true,
    mode: "xy",
  },
  zoom: {
    wheel: {
      enabled: true,
    },
    pinch: {
      enabled: true,
    },
    mode: "xy",
    onZoomComplete({ chart }) {
      // This update is needed to display up to date zoom level in the title.
      // Without this, previous zoom level is displayed.
      // The reason is: title uses the same beforeUpdate hook, and is evaluated before zoom.
      chart.update("none");
    },
  },
};

const scaleOpts = {
  ticks: {
    callback: (val, index, ticks) =>
      index === 0 || index === ticks.length - 1 ? null : val,
  },
  grid: {
    borderColor: "red",
    color: "rgba( 0, 0, 0, 0.1)",
  },
  title: {
    display: true,
    text: (ctx) => ctx.scale.axis + " axis",
  },
};
const scales = {
  x: {
    position: "top",
  },
  y: {
    position: "right",
  },
};
Object.keys(scales).forEach((scale) => Object.assign(scales[scale], scaleOpts));

var speedData = {
  labels: [],
  datasets: [],
};

var chartOptions = {
  legend: {
    display: true,
    position: "top",
    labels: {
      fontColor: "black",
    },
  },
  spanGaps: true, // enable for all datasets
  animation: false,
  spanGaps: true, // enable for all datasets

  labels: {
    boxWidth: 80,
    fontColor: "black",
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Timestamp",
        color: "#911",
        font: {
          family: "Comic Sans MS",
          size: 20,
          weight: "bold",
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 },
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: "Value",
        color: "#191",
        font: {
          family: "Times",
          size: 20,
          style: "normal",
          lineHeight: 1.2,
        },
        padding: { top: 30, left: 0, right: 0, bottom: 0 },
      },
      min: min,
      max: max,
      ticks: {
        // forces step size to be 50 units
        stepSize: 50,
      },
    },
  },
  responsive: true,
  title: {
    display: true,
    text: "Nibe Logs",
  },
  plugins: {
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: "xy",
      },
    },
  },
  onClick(e) {
    console.log(e.type);
  },
};

var lineChart = new Chart(speedCanvas, {
  type: "line",
  data: speedData,
  options: chartOptions,
});

init();

var max = 300;
var min = -300;

function init() {
  lineChart.destroy();

  console.log(min, max);
  chartOptions = {
    legend: {
      display: true,
      position: "top",
      labels: {
        fontColor: "black",
      },
    },

    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Timestamp",
          color: "#911",
          font: {
            family: "Comic Sans MS",
            size: 20,
            weight: "bold",
            lineHeight: 1.2,
          },
          padding: { top: 20, left: 0, right: 0, bottom: 0 },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Value",
          color: "#191",
          font: {
            family: "Times",
            size: 20,
            style: "normal",
            lineHeight: 1.2,
          },
          padding: { top: 30, left: 0, right: 0, bottom: 0 },
        },
        min: min,
        max: max,
        ticks: {
          // forces step size to be 50 units
          stepSize: 50,
        },
      },
    },
    animation: false,
    spanGaps: true, // enable for all datasets
    showLine: true,
    responsive: true,
    title: {
      display: true,
      text: "Nibe Logs",
    },
    labels: {
      boxWidth: 80,
      fontColor: "black",
    },
    x: {
      display: true,
      title: {
        display: true,
        text: "Timestamp",
        color: "#911",
        font: {
          family: "Comic Sans MS",
          size: 20,
          weight: "bold",
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 },
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "xy",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
      },
    },
  };
  // Chart declaration:
  lineChart = new Chart(speedCanvas, {
    type: "line",
    data: speedData,
    options: chartOptions,
  });
}

function toggleChart() {
  //destroy chart:
  lineChart.destroy();

  speedData = {
    labels: [],
    datasets: [],
  };

  chartOptions = {
    legend: {
      display: true,
      position: "top",
      labels: {
        fontColor: "black",
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Timestamp",
          color: "#911",
          font: {
            family: "Comic Sans MS",
            size: 20,
            weight: "bold",
            lineHeight: 1.2,
          },
          padding: { top: 20, left: 0, right: 0, bottom: 0 },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Value",
          color: "#191",
          font: {
            family: "Times",
            size: 20,
            style: "normal",
            lineHeight: 1.2,
          },
          padding: { top: 30, left: 0, right: 0, bottom: 0 },
        },
        min: min,
        max: max,
        ticks: {
          // forces step size to be 50 units
          stepSize: 50,
        },
      },
    },
    animation: false,
    spanGaps: true, // enable for all datasets
    showLine: true,
    responsive: true,
    title: {
      display: true,
      text: "Nibe Logs",
    },
    labels: {
      boxWidth: 80,
      fontColor: "black",
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
      },
    },
  };
  //restart chart:
  init();
}

btnPlot.addEventListener("click", function () {
  if (dataLoaded) {
    var timestamp = [];
    var dataset = [];

    for (var counter1 = 0; counter1 < data.length - 1; counter1++) {
      timestamp.push(data[counter1][1]);
      dataset[counter1] = data[counter1]
        .slice(4, data[counter1].length)
        .map(Number);
    }

    var datasetPlot = [];
    var dataCurrent = [];

    var index = 0;
    divisors = divisors.slice(4, divisors.length).map(Number);

    for (var counter2 = 0; counter2 < parameters.length; counter2++) {
      dataCurrent = [];
      for (var counter3 = 0; counter3 < timestamp.length; counter3++) {
        dataCurrent.push(dataset[counter3][index] / divisors[counter2]);
      }
      console.log(parameters[0]);
      datasetPlot[counter2] = {
        label: parameters[counter2],
        data: dataCurrent,
        hidden: true,
        fill: false,
        borderColor: getRandomColor(),
        tension: 0.1,
      };
      index++;
    }

    console.log(datasetPlot.length, timestamp.length);
    console.log(timestamp);

    speedData = {
      labels: timestamp,
      datasets: datasetPlot,
    };

    init();
  }
});

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
