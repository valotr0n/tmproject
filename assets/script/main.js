let modelCats, modelDogs;

async function loadModels() {
    try {
        modelCats = await tmImage.load('assets/ai/cats/model.json', 'assets/ai/cats/metadata.json');
        modelDogs = await tmImage.load('assets/ai/dogs/model.json', 'assets/ai/dogs/metadata.json');
    } catch (error) {
        console.log('Не загрузилось: ', error);
    }
}

function predict(file, resultElement, modelType, previewElement) {
    if (!file.type.startsWith('image/')) {
        resultElement.innerHTML = 'Это не картинка';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        previewElement.src = e.target.result;
        previewElement.style.display = 'block';
    };
    reader.readAsDataURL(file);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async function() {
        let model = modelType === 'cats' ? modelCats : modelDogs;
        let prediction = await model.predict(img, false);

        let bestGuess = prediction.reduce((max, pred) => pred.probability > max.probability ? pred : max, prediction[0]);
        resultElement.innerHTML = `Предсказание: <strong>${bestGuess.className}</strong> с вероятностью <strong>${(bestGuess.probability * 100).toFixed(2)}%</strong>`;
    };
}

document.getElementById('cats-upload').onchange = function(e) {
    let file = e.target.files[0];
    predict(file, document.getElementById('cats-result'), 'cats', document.getElementById('cats-preview'));
};

document.getElementById('dogs-upload').onchange = function(e) {
    let file = e.target.files[0];
    predict(file, document.getElementById('dogs-result'), 'dogs', document.getElementById('dogs-preview'));
};

document.addEventListener('DOMContentLoaded', function() {
    let catsBtn = document.getElementById('cats-btn');
    let dogsBtn = document.getElementById('dogs-btn');
    let catsSection = document.getElementById('cats-section');
    let dogsSection = document.getElementById('dogs-section');
    let selectionSection = document.getElementById('selection-section');

    catsBtn.onclick = function() {
        selectionSection.classList.remove('active');
        catsSection.classList.add('active');
        dogsSection.classList.remove('active');
    };

    dogsBtn.onclick = function() {
        selectionSection.classList.remove('active');
        dogsSection.classList.add('active');
        catsSection.classList.remove('active');
    };

    document.getElementById('back-from-cats-btn').onclick = function() {
        catsSection.classList.remove('active');
        selectionSection.classList.add('active');
        clearSection('cats-section');
    };

    document.getElementById('back-from-dogs-btn').onclick = function() {
        dogsSection.classList.remove('active');
        selectionSection.classList.add('active');
        clearSection('dogs-section');
    };

    loadModels();
});

function clearSection(sectionId) {
    let section = document.getElementById(sectionId);
    if (sectionId === 'cats-section') {
        section.querySelector('#cats-upload').value = '';
        section.querySelector('#cats-preview').src = '';
        section.querySelector('#cats-preview').style.display = 'none';
        section.querySelector('#cats-result').innerHTML = '';
    } else {
        section.querySelector('#dogs-upload').value = '';
        section.querySelector('#dogs-preview').src = '';
        section.querySelector('#dogs-preview').style.display = 'none';
        section.querySelector('#dogs-result').innerHTML = '';
    }
}
