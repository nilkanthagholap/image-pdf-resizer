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
      heightInput.value = 200;
      sizeInput.value = 50;
      break;
    case 'custom':
    default:
      widthInput.value = '';
      heightInput.value = '';
      sizeInput.value = '';
  }
});

dropArea.addEventListener('click', () => fileInput.click());
dropArea.addEventListener('dragover', e => {
  e.preventDefault();
  dropArea.classList.add('hover');
});
dropArea.addEventListener('dragleave', () => dropArea.classList.remove('hover'));
dropArea.addEventListener('drop', e => {
  e.preventDefault();
  dropArea.classList.remove('hover');
  fileInput.files = e.dataTransfer.files;
});

processBtn.addEventListener('click', async () => {
  const files = fileInput.files;
  if (!files.length) {
    alert("Please select files.");
    return;
  }

  downloads.innerHTML = '';
  result.innerHTML = '';

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      await processImage(file);
    } else if (file.type === 'application/pdf') {
      await processPDF(file);
    } else {
      result.innerHTML += `<p>Unsupported file: ${file.name}</p>`;
    }
  }
});

async function processImage(file) {
  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);
  const maxSizeKB = parseInt(sizeInput.value);
  if (!width || !height || !maxSizeKB) {
    alert("Enter valid image size and max file size.");
    return;
  }

  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();

  canvas.width = width;
  canvas.height = height;
  const picaResizer = pica();
  await picaResizer.resize(img, canvas);

  let quality = 0.9;
  let blob = await getBlob(quality);
  while (blob.size / 1024 > maxSizeKB && quality > 0.1) {
    quality -= 0.1;
    blob = await getBlob(quality);
  }

  const size = (blob.size / 1024).toFixed(1);
  result.innerHTML += `<p>${file.name}: ${size} KB</p>`;
  const url = URL.createObjectURL(blob);
  downloads.innerHTML += `<a href="${url}" download="processed_${file.name}">Download ${file.name}</a>`;
}

async function processPDF(file) {
  const maxSizeKB = parseInt(sizeInput.value);
  if (!maxSizeKB) {
    alert("Enter max file size.");
    return;
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
  const pdfBytes = await pdfDoc.save();
  let blob = new Blob([pdfBytes], { type: 'application/pdf' });

  const size = (blob.size / 1024).toFixed(1);
  result.innerHTML += `<p>${file.name}: ${size} KB</p>`;
  const url = URL.createObjectURL(blob);
  downloads.innerHTML += `<a href="${url}" download="processed_${file.name}">Download ${file.name}</a>`;
}

function getBlob(quality) {
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/jpeg', quality);
  });
}
