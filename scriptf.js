// Slide functionality implementation

document.getElementById('next').onclick = function() {
    let lists = document.querySelectorAll('.item');
    if (lists.length > 0) {
        document.getElementById('slide').appendChild(lists[0]);
    }
};

document.getElementById('prev').onclick = function() {
    let lists = document.querySelectorAll('.item');
    if (lists.length > 0) {
        document.getElementById('slide').prepend(lists[lists.length - 1]);
    }
};

// Scroll detection to show slider
window.addEventListener('scroll', function() {
    const sliderSection = document.getElementById('project-slider');
    if (!sliderSection) return;
    const rect = sliderSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
        sliderSection.style.display = 'block';
    } else {
        sliderSection.style.display = 'none';
    }
});
