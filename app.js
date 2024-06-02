let images = [
    "https://images.unsplash.com/photo-1562426509-5044a121aa49?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FyJTIwcGFya2luZ3xlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNhciUyMHBhcmtpbmd8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1597173874497-2546ef685f43?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGNhciUyMHBhcmtpbmd8ZW58MHx8MHx8fDA%3D"
];

let counter = 0;
let leftButton = document.querySelector("#left-button");
let rightButton = document.querySelector("#right-button");
document.querySelector("img").src = images[0];

function leftbtn() {
    if (counter === 0) {
        counter = images.length - 1;
        document.querySelector("img").src = images[counter];
    } else {
        counter--;
        document.querySelector("img").src = images[counter];
    }
}

function rightbtn() {
    if (counter === images.length - 1) {
        counter = 0;
        document.querySelector("img").src = images[counter];
    } else {
        counter++;
        document.querySelector("img").src = images[counter];
    }
}

leftButton.addEventListener("click", leftbtn);
rightButton.addEventListener("click", rightbtn);

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle mouseover event
    function handleMouseOver() {
        // Get the img element within Slot 1
        const slot1Image = document.querySelector('.Slot1').classList;

    }

    
    // Attach event listeners to Slot 1
    const slot1 = document.querySelector('.Slot1');
    slot1.addEventListener('mouseover', handleMouseOver);
});
function redirectToPaymentForm() {
    // Redirect to the payment form page (payment.html)
    window.location.href = 'paymentForm.html';
  }