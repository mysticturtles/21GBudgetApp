let mainNav = document.getElementById('navbar');

let navBarToggle = document.getElementById('js-navbar-toggle');

navBarToggle.addEventListener('click', function () {
    mainNav.classList.toggle('active');
})

function onLoad() {
    $.ajax({
        method: "GET",
        url: "..api/Transactions?getBalance=true&year="+currYear
    });
}