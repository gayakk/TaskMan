let star = document.querySelectorAll('i');
star.forEach((item) => {
    item.addEventListener('click', clicked);
})

function clicked(e) {
    e.target.classList.add('highlight');
    e.target.classList.add('stop');
    for (let i = 0; i < star.length; i++) {
        let item = star[i];
        item.classList.add('highlight');
        if (item.classList.contains('stop')) {
            break;
        }
    }
}

// Star rating

function subfun() {
    const reviewText = document.getElementById('description').value;

    if (reviewText.trim() === '') {
        alert('Please enter your review before submitting.');
        return;
    }
    const numStars = document.querySelectorAll('.highlight').length;
    const confirmMessage = `Rating: ${numStars}\nReview Text: ${reviewText}\n\nThanks a lot for reviewing for the webpage...!\n Thanks for reviewing😀..!`;
    const confirmed = window.confirm(confirmMessage);

    if (confirmed) {
        console.log('Rating:', numStars);
        console.log('Review Text:', reviewText);

        document.querySelector('form').style.display = 'none';

        document.body.appendChild(thanksMessage);
    } else {
        console.log('Review submission canceled.');
    }
}
