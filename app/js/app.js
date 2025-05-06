const startAnimation = (diamond) => {
    let direction = 1;
    let position = 0;
    const speed = 5;

    const moveDiamond = () => {
        const maxWidth = window.innerWidth - diamond.offsetWidth;

        position += speed * direction;


        if (position >= maxWidth || position <= 0) {
            direction *= -1;
        }

        diamond.style.transform = `translateX(${position}px)`;

        requestAnimationFrame(moveDiamond);
    };

    requestAnimationFrame(moveDiamond);
};

const createDiamond = (size) => {
    console.log(`createDiamond is running with size: ${size}`);

    const container = document.getElementById(`diamond-container`);
    container.innerHTML = ``;

    const diamondWrapper = document.createElement(`div`);
    diamondWrapper.classList.add(`diamond-wrapper`);

    const generateRow = (spaces, stars, className) => {
        let row = document.createElement(`div`);
        row.classList.add(`diamond-row`, className);
        row.textContent = `${` `.repeat(spaces)}${`* `.repeat(stars).trim()}`;
        return row;
    };

    // Ensure a proper diamond shape regardless of size (even or odd)
    for (let i = 0; i < size; i++) {
        let spaces = Math.abs(Math.floor(size / 2) - i);
        let stars = size - spaces * 2;
        diamondWrapper.appendChild(generateRow(spaces, stars, `diamond-row`));
    }

    container.appendChild(diamondWrapper);
    startAnimation(diamondWrapper);
};

// Ensure size input is valid
const size = parseInt(window.prompt(`Enter the size of your diamond as a number:`), 10);
if (!isNaN(size) && size > 0) {
    createDiamond(size);
} else {
    alert(`Please enter a valid number for the diamond size.`);
}
