const fileInput = document.getElementById('fileInput');
const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');
const elaBtn = document.getElementById('elaBtn');
const metaBtn = document.getElementById('metaBtn');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const infoBox = document.getElementById('infoBox');
const loadingMsg = document.getElementById('loadingMsg');
const magnifier = document.getElementById('magnifier');
const canvasContainer = document.getElementById('canvasContainer');
const placeholderText = document.getElementById('placeholderText');

let originalImage = null;
let currentFile = null;
let savedImageData = null;
let currentImageData = null;

// 파일 업로드
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    currentFile = file;
    const reader = new FileReader();

    reader.onload = function(event) {
        originalImage = new Image();
        originalImage.onload = function() {
            mainCanvas.width = originalImage.width;
            mainCanvas.height = originalImage.height;
            
            if(originalImage.width > 800) {
                mainCanvas.style.width = '100%';
            } else {
                mainCanvas.style.width = 'auto';
            }

            ctx.drawImage(originalImage, 0, 0);
            savedImageData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
            currentImageData = savedImageData;
            
            placeholderText.style.display = 'none';
            elaBtn.disabled = false;
            metaBtn.disabled = false;
            resetBtn.disabled = false;
            downloadBtn.disabled = false;
            infoBox.textContent = "> 이미지 로드 성공.\n> 분석 준비 완료.";
            magnifier.style.display = 'none';
        }
        originalImage.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

// 초기화
resetBtn.addEventListener('click', () => {
    if(originalImage && savedImageData) {
        ctx.putImageData(savedImageData, 0, 0);
        currentImageData = savedImageData;
        infoBox.textContent = "> 원본 상태로 복구됨.";
        magnifier.style.display = 'none';
    }
});

// ELA 분석
elaBtn.addEventListener('click', () => {
    if (!originalImage) return;

    loadingMsg.style.display = 'flex';
    infoBox.textContent = "> ELA 알고리즘 실행 중...";

    setTimeout(() => {
        performELA();
    }, 100);
});

function performELA() {
    const w = mainCanvas.width;
    const h = mainCanvas.height;
    const originalData = ctx.getImageData(0, 0, w, h);

    const jpegQuality = 0.95; 
    const jpegDataUrl = mainCanvas.toDataURL('image/jpeg', jpegQuality);

    const compressedImage = new Image();
    compressedImage.onload = function() {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(compressedImage, 0, 0);

        const compressedData = tempCtx.getImageData(0, 0, w, h);
        const outputData = ctx.createImageData(w, h);

        const scale = 20; 

        for (let i = 0; i < originalData.data.length; i += 4) {
            const rDiff = Math.abs(originalData.data[i] - compressedData.data[i]) * scale;
            const gDiff = Math.abs(originalData.data[i+1] - compressedData.data[i+1]) * scale;
            const bDiff = Math.abs(originalData.data[i+2] - compressedData.data[i+2]) * scale;

            outputData.data[i] = rDiff;
            outputData.data[i+1] = gDiff;
            outputData.data[i+2] = bDiff;
            outputData.data[i+3] = 255;
        }

        ctx.putImageData(outputData, 0, 0);
        currentImageData = outputData;
        loadingMsg.style.display = 'none';
        infoBox.innerHTML = "<strong>[ELA 분석 완료]</strong><br>균일한 노이즈 = 원본 확률 높음.<br>높은 대비/불규칙성 = 조작 가능성 있음.";
    };
    compressedImage.src = jpegDataUrl;
}

// 메타데이터 분석
metaBtn.addEventListener('click', () => {
    if (!currentFile) return;

    infoBox.textContent = "> 메타데이터 스트림 읽는 중...";

    EXIF.getData(currentFile, function() {
        const allTags = EXIF.getAllTags(this);
        let output = "<strong>[이미지 정보]</strong>\n";
        
        if (Object.keys(allTags).length === 0) {
            output += "> 메타데이터 없음.\n(스크린샷이거나 정보가 삭제됨)";
        } else {
            if(allTags.Make) output += `📷 제조사: ${allTags.Make}\n`;
            if(allTags.Model) output += `📸 모델: ${allTags.Model}\n`;
            if(allTags.DateTime) output += `📅 시간: ${allTags.DateTime}\n`;
            if(allTags.Software) output += `💾 소프트웨어: ${allTags.Software}\n`;
            if(allTags.PixelXDimension) output += `📏 해상도: ${allTags.PixelXDimension} x ${allTags.PixelYDimension}\n`;
            
            output += "\n-- 전체 데이터 --\n";
            for (let tag in allTags) {
                if (tag !== 'MakerNote' && tag !== 'UserComment' && tag !== 'Thumbnail') { 
                   output += `${tag}: ${allTags[tag]}\n`;
                }
            }
        }
        infoBox.innerHTML = output;
    });
});

// 돋보기
const ZOOM_LEVEL = 2; 

canvasContainer.addEventListener('mousemove', function(e) {
    if (!originalImage || placeholderText.style.display !== 'none') return;
    
    magnifier.style.display = 'block';
    
    const rect = mainCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        magnifier.style.display = 'none';
        return;
    }

    magnifier.style.left = (e.clientX - rect.left - 75) + "px"; 
    magnifier.style.top = (e.clientY - rect.top - 75) + "px";  

    const scaleX = mainCanvas.width / rect.width;
    const scaleY = mainCanvas.height / rect.height;

    magnifier.style.backgroundImage = `url('${mainCanvas.toDataURL()}')`;
    magnifier.style.backgroundSize = `${rect.width * ZOOM_LEVEL}px ${rect.height * ZOOM_LEVEL}px`;
    
    magnifier.style.backgroundPosition = `-${x * ZOOM_LEVEL - 75}px -${y * ZOOM_LEVEL - 75}px`;
});

canvasContainer.addEventListener('mouseleave', function() {
    magnifier.style.display = 'none';
});

// 결과 저장
downloadBtn.addEventListener('click', () => {
    if (!originalImage) return;
    const link = document.createElement('a');
    link.download = 'forensic_result.png';
    link.href = mainCanvas.toDataURL();
    link.click();
});

// 비교 기능
canvasContainer.addEventListener('mousedown', () => {
    if(!originalImage || !savedImageData || placeholderText.style.display !== 'none') return;
    ctx.putImageData(savedImageData, 0, 0);
});

canvasContainer.addEventListener('mouseup', () => {
    if(!originalImage || !currentImageData || placeholderText.style.display !== 'none') return;
    ctx.putImageData(currentImageData, 0, 0);
});

canvasContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if(originalImage && savedImageData && placeholderText.style.display === 'none') {
        ctx.putImageData(savedImageData, 0, 0);
    }
});

canvasContainer.addEventListener('touchend', (e) => {
    e.preventDefault();
    if(originalImage && currentImageData && placeholderText.style.display === 'none') {
        ctx.putImageData(currentImageData, 0, 0);
    }
});
