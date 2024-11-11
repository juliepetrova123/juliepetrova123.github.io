function toggleMenu() {
    const menu = document.querySelector('.menu-hamburger');
    menu.classList.toggle('active');

    // const bars = document.querySelectorAll('.bar');
    // bars.forEach((bar, index) => {
    //     if (menu.classList.contains('active')) {
    //         bar.style.transform = `translateY(${index * 10}px) rotate(${index === 1 ? 180 : 0}deg)`;
    //     } else {
    //         bar.style.transform = 'translateY(0) rotate(0)';
    //     }
    // });
}