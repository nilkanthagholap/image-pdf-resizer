const fileTypeSelect = document.getElementById('fileTypeSelect');
const preset = document.getElementById('preset');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const sizeInput = document.getElementById('sizeInput');
const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const processBtn = document.getElementById('processBtn');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');
const downloads = document.getElementById('downloads');
const imageOptions = document.getElementById('imageOptions');
const presetGroup = document.getElementById('presetGroup');

function showImageInputs(show) {
  imageOptions.style.display = show ? 'block' : 'none';
  presetGroup.style.display = show ? 'block' : 'none';
}

fileTypeSelect.addEventListener('change', () => {
  if (fileTypeSelect.value === 'image') {
    showImageInputs(true);
  } else if (fileTypeSelect.value === 'pdf') {
    showImageInputs(false);
  } else {
    // Auto: reset view
    showImageInputs(false);
  }
});

preset.addEventListener('change', () => {
  switch(preset.value) {
    case 'ssc':
      widthInput.value = 100;
      heightInput.value = 120;
      sizeInput.value = 20;
      break;
    case 'upsc':
      widthInput.value = 200;
      heightInput.value = 230;
      sizeInput.value = 40;
      break;
    case 'bank':
      widthInput.value = 150;
      heightInput.v
