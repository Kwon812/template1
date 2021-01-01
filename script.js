const icon = document.querySelector('.icon');
const on = document.querySelector('.fas.fa-video');
const off = document.querySelector('.fas.fa-video-slash');
const camera = document.querySelector('.camera');
const name = document.querySelector('.name');
const percent = document.querySelector('.percent');
const description = document.querySelector('.description');

const URL = './model/';

let model, webcam, maxPredictions;

icon.addEventListener('click', async () => {
  on.classList.toggle('invisible');
  off.classList.toggle('invisible');

  if (on.classList.length === 2) {
    await webcam.pause();
  } else {
    await webcam.play();
    window.requestAnimationFrame(loop);
  }
});

async function init() {
  const modelURL = URL + 'model.json';
  const metadataURL = URL + 'metadata.json';

  
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true;
  webcam = new tmImage.Webcam(380, 380, flip);
  await webcam.setup();

  camera.appendChild(webcam.canvas);
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

init();

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  for (let i = 0; i < maxPredictions; i++) {
    const className = prediction[i].className;
    const probability = prediction[i].probability.toFixed(2) * 100;

    const data = {
      BarredSpiralGalaxy: '막대나선은하',  NormalspiralGalaxy: '정상나선은하', IrregularGalaxy:'불규칙은하',
      
    };

    if (probability >= 65) {
      if (name.innerHTML !== className) {
        name.innerHTML = className;
        description.innerHTML = data[className];
      }

      if (percent.innerHTML !== probability + '%') {
        percent.innerHTML = probability + '%';
      }
    }
  }
}

