const images = [
    { src: '/images/land-1.jpg', text: 'Альпы — это величественная горная система в Европе, простирающаяся через восемь стран, включая Францию, Швейцарию, Италию и Австрию. Известные своими захватывающими пейзажами, Альпы представляют собой популярное направление для туристов круглый год.' },
    { src: '/images/land-2.jpg', text: 'Амазонка — крупнейшая река в мире по объему воды, протекающая через несколько стран Южной Америки, включая Бразилию, Перу и Колумбию. Этот массивный экосистемный комплекс считается "легким дыхания" планеты.' },
    { src: '/images/land-3.jpg', text: 'Гранд-Каньон — это грандиозная природная формация в штате Аризона, США, широко известная своими впечатляющими пропорциями и яркими цветами. Этот каньон глубиной более 1,6 километра образовался в результате эрозии реки Колорадо и предлагает потрясающие виды.' },
    { src: '/images/land-4.jpg', text: 'Большой барьерный риф — это самый большой коралловый риф в мире, расположенный у побережья Австралии. Протяженность рифа составляет более 2,300 километров, и он включает тысячи отдельных рифов и островов.' },
    { src: '/images/land-5.jpg', text: 'Сахара — это самая большая пустыня в мире, занимающая территорию около 9,2 миллиона квадратных километров в Северной Африке. Пустыня известна своими обширными песчаными дюнами, каменистыми плато и засушливыми равнинами.' },
];

let currentIndex = 0;

const carouselImage = document.getElementById('carouselImage');
const imageDescription = document.getElementById('imageText');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

function updateCarousel() {
    carouselImage.src = images[currentIndex].src;
    imageDescription.textContent = images[currentIndex].text;
}

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
    updateCarousel();
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
    updateCarousel();
});

// Инициализация отображения первой картинки
updateCarousel();