let heights = [];
let bars = [];
let barValues = [];

let barSlider = document.getElementById('barSlider');
let n = barSlider.value;
let speedSlider = document.getElementById('speedSlider');
let delay = 375-speedSlider.value;

let container = document.getElementById('container');
let width = container.offsetWidth;
let height = container.offsetHeight-24;
let lineWidth = width / n - 2;
 
let isStopped = true;
let isPaused = false;
let isGenerated = true;
let isSorted = false;


// stack implementation.
class Stack {
  constructor() {
    this.arr = [];
    this.top = -1;
  }
  push(element) {
    this.top++;
    this.arr.push(element);
  }
  isEmpty() {
    return this.top == -1;
  }
  pop() {
    if (this.isEmpty() === false) {
      this.top = this.top - 1;
      return this.arr.pop();
    }
  }
}

let audioCtx=null;

function playNote(freq){
  if(audioCtx==null){
    audioCtx=new(
        AudioContext ||
        webkitAudioContext ||
        window.webkitAudioContext
    )();
  }
  const dur=0.1;
  const osc=audioCtx.createOscillator();
  osc.frequency.value=freq;
  osc.start();
  //osc.type=type();
  osc.stop(audioCtx.currentTime+dur);

  const node=audioCtx.createGain();
  node.gain.value=0.8;
  node.gain.linearRampToValueAtTime(
    0,audioCtx.currentTime+dur
  );
  osc.connect(node);
  node.connect(audioCtx.destination);
}

function Note(freq){
  if(audioCtx==null){
    audioCtx=new(
        AudioContext ||
        webkitAudioContext ||
        window.webkitAudioContext
    )();
  }
  const dur=0.07;
  const osc=audioCtx.createOscillator();
  osc.frequency.value=freq;
  osc.start();
  //osc.type=type();
  osc.stop(audioCtx.currentTime+dur);

  const node=audioCtx.createGain();
  node.gain.value=2;
  node.gain.linearRampToValueAtTime(
    0,audioCtx.currentTime+dur
  );
  osc.connect(node);
  node.connect(audioCtx.destination);
}
// get random value between min and max;
function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}
// Generate random heights of the bar and create div element of the bar.
function generateRandomArray() {
  isGenerated = true;
  isSorted = false;
  isStopped = true;
  isPaused = false;
  n = barSlider.value;
  width = container.offsetWidth;
  lineWidth = width / n - 1;
  container.innerHTML = '';
  for (let i = 0; i < n; i++) {
    heights[i] = parseInt(getRandomValue(2, height));
    bars.push(document.createElement('div'));
    bars[i].style.width = `${lineWidth}px`;
    bars[i].style.height = `${heights[i]}px`;
    bars[i].style.transform = `translate(${i * lineWidth + i}px)`;
    bars[i].style.backgroundColor = 'white';
    bars[i].className = 'bar';
    container.appendChild(bars[i]);

    // if there are more numer of bars then it is not feasible to show bar values because they gets mixed up.
    if (n <= 60) {
      barValues.push(document.createElement('div'));
      barValues[i].innerHTML = heights[i];
      barValues[i].style.marginBottom = `${heights[i] + 5}px`;
      barValues[i].style.transform = `translate(${i * lineWidth + i}px)`;
      barValues[i].className = 'barValue';
      container.appendChild(barValues[i]);
    }
  }
  playNote(2000);
}
generateRandomArray();


// swap 2 bars and also swap trnasform property for the animation.
function swap(i, minindex) {
  
  [heights[i], heights[minindex]] = [heights[minindex], heights[i]];

  [bars[i], bars[minindex]] = [bars[minindex], bars[i]];
  [bars[i].style.transform, bars[minindex].style.transform] = [bars[minindex].style.transform, bars[i].style.transform];

  [barValues[i], barValues[minindex]] = [barValues[minindex], barValues[i]];
  [barValues[i].style.transform, barValues[minindex].style.transform] = [
    barValues[minindex].style.transform,
    barValues[i].style.transform,
  ];
  //playNote(432);
}
// Draw bars with their new Updated heights.
function draw(coloredBars, colors) {
  // coloredBars contains indices of the bars which will be in different color than default color
  // colors array stores color for different bars.
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'white';
    for (let j = 0; j < coloredBars.length; j++) {
      if (i == coloredBars[j]) {
        bars[i].style.backgroundColor = colors[j];
        break;
      }
    }
  }
}

// to put delay between visualization.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Play animation after sorting process is finished
async function SortedAnimation() {
  // first we will go from left to right and color them in some color.
  // then we will again go from left to right and color them white.
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'lime';
    await sleep(10);
  }
  await sleep(300);
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'white';
    await sleep(10);
  }
  playNote(1000);
}

// Sorting algos implementation starts...
async function bubbleSort() {
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (isStopped) {
        draw([], []);
        return;
      }
      if (!isPaused) {
        if (heights[j] > heights[j + 1]) {
          swap(j, j + 1);
          playNote(432);
        }
        draw([j, j + 1], ['green', 'yellow']);
      } else {
        j--;
      }
      await sleep(delay);
    }
  }
  console.log('Bubble sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

async function selectionSort() {
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (isStopped) {
        draw([], []);
        return;
      }
      if (!isPaused) {
        if (heights[j] < heights[minIndex]) {
          minIndex = j;
        }
        draw([i, j, minIndex], ['blue', 'red', 'green']);
      } else {
        j--;
      }
      await sleep(delay);
    }
    swap(i, minIndex);
    playNote(432);
  }
  console.log('Selection sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

async function insertionSort() {
  for (let i = 0; i < n; i++) {
    let key = heights[i];
    for (let j = i - 1; j >= 0 && heights[j] > key; j--) {
      if (isStopped) {
        draw([], []);
        return;
      }
      if (!isPaused) {
        swap(j, j + 1);
        playNote(432);
        draw([j, i + 1], ['green', 'red']);
      } else {
        j++;
      }
      await sleep(delay);
    }
  }
  console.log('Insertion sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

async function mergeSort() {
  for (let curSize = 1; curSize < n; curSize *= 2) {
    for (let start = 0; start < n - 1; start += 2 * curSize) {
      let mid = Math.min(start + curSize - 1, n - 1);
      let end = Math.min(start + 2 * curSize - 1, n - 1);
      let n1 = mid - start + 1;
      let n2 = end - mid;
      let L = [],
        R = [];
      for (let i = 0; i < n1; i++) L.push(heights[start + i]);
      for (let j = 0; j < n2; j++) R.push(heights[mid + 1 + j]);
      let i = 0,
        j = 0,
        k = start;

      let barsIndices = [];
      let barsColors = [];
      for (let i1 = start; i1 <= end; i1++) {
        barsIndices.push(i1);
        barsColors.push('yellow');
      }

      while (i < n1 || j < n2) {
        if (isStopped) {
          draw([], []);
          return;
        }
        if (!isPaused) {
          if (j == n2 || (i < n1 && L[i] <= R[j])) {
            draw([k, ...barsIndices], ['green', ...barsColors]);
            i++;
          } else {
            for (let i1 = mid + 1 + j; i1 > k; i1--) {
              swap(i1, i1 - 1);
            }
              playNote(432);
            draw([k, ...barsIndices], ['green', ...barsColors]);
            j++;
          }
          k++;
        }
        await sleep(delay);
      }
    }
  }
  console.log('Merge sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

async function quickSort() {
  let s = new Stack();
  s.push(0);
  s.push(n - 1);
  while (!s.isEmpty()) {
    let h = s.pop();
    let l = s.pop();

    let i = l - 1;

    let barsIndices = [];
    let barsColors = [];
    for (let i1 = l; i1 <= h; i1++) {
      barsIndices.push(i1);
      barsColors.push('yellow');
    }

    for (let j = l; j <= h - 1; j++) {
      if (isStopped) {
        draw([], []);
        return;
      }
      if (!isPaused) {
        draw([i, j, ...barsIndices], ['green', 'red', ...barsColors]);
        if (heights[j] <= heights[h]) {
          i++;
          swap(i, j);
          playNote(432);
        }
      } else {
        j--;
      }
      await sleep(delay);
    }
    swap(i + 1, h);
    playNote(432);
    let partition = i + 1;
    if (l < partition - 1) {
      s.push(l);
      s.push(partition - 1);
    }
    if (partition + 1 < h) {
      s.push(partition + 1);
      s.push(h);
    }
  }
  console.log('Quick sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

// when slider value is changed generate new bars and update the value of bar count on the navbar.
barSlider.oninput = () => {
  document.querySelector('.sliderValue').innerHTML = `Bars: ${barSlider.value}`;
  generateRandomArray();
};
speedSlider.oninput = () => {
  playNote(500);
  delay = 375 - speedSlider.value;
};
document.getElementById('sort_type').addEventListener('click', ()=>{
  playNote(500); 
});
document.getElementById('generateButton').addEventListener('click', generateRandomArray);
document.getElementById('sortButton').addEventListener('click', () => {
  playNote(2000);
  // get the name of selected sorting algorithm.
  type = document.getElementById('sort_type').value;
  // if there is another sorting visualization going on then return from the function.
  if (!isStopped) return;
  // if recently we used visualization and bars are sorted then generate new unsorted array.
  if (isSorted || !isGenerated) generateRandomArray();

  isGenerated = false;
  isPaused = false;
  isStopped = false;
  if (type == 'bubble') {
    bubbleSort();
  }
  else if (type == 'selection') selectionSort();
  else if (type == 'insertion') insertionSort();
  else if (type == 'merge') mergeSort();
  else if (type == 'quick') quickSort();
});
document.getElementById('stopButton').addEventListener('click', () => {
  playNote(600);
  isStopped = true;
  isPaused = false;
  document.getElementById('pauseButton').innerHTML = 'Pause';
  // if user presses stop button and random bars is not generated then generate rnadom bars.
  if (!isGenerated && !isSorted) generateRandomArray();
});

document.getElementById('pauseButton').addEventListener('click', () => {
  playNote(600);
  // if currently sorting is in progress then isStopped will be false.
  if (!isStopped) {
    // toggle button between pause and resume
    if (isPaused) {
      document.getElementById('pauseButton').innerHTML = 'Pause';
      isPaused = false;
    } else {
      document.getElementById('pauseButton').innerHTML = 'Resume';
      isPaused = true;
    }
  }
});

function changeTheme(){
  playNote(2000);
	if(document.getElementById('thbutton').innerHTML==='Switch to Dark Mode'){
		document.body.style.background='#000000e8';
		document.body.style.color='#d7d7d7';
    //document.a.style.color='white';
    container.style.background='#4646469f';
    thbutton.style.background='#d7d7d7';
    thbutton.style.color='black';
    sortButton.style.background='black';
    sortButton.style.color='white';
    pauseButton.style.background='black';
    pauseButton.style.color='white';
    stopButton.style.background='black';
    stopButton.style.color='white';
    generateButton.style.background='#4646469f';
    generateButton.style.color='white';
    sort_type.style.background='#4646469f';
    sort_type.style.color='white';
		document.getElementById('thbutton').innerHTML='Switch to Light Mode';
	}
	else{
		document.body.style.background='#d7d7d7';
		document.body.style.color='black';
    container.style.background='#76898f';
    thbutton.style.background='black';
    thbutton.style.color='white';
    sortButton.style.background='#76898f';
    pauseButton.style.background='#76898f';
    stopButton.style.background='#76898f';
    generateButton.style.background='#76898f';
    sort_type.style.background='#76898f';

    pauseButton.style.color='white';
    pauseButton.style.color='white';
    stopButton.style.color='white';
    generateButton.style.color='white';
    //document.a.style.color='#76898f';
		document.getElementById('thbutton').innerHTML='Switch to Dark Mode';
    
	}
}