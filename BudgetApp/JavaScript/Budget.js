let mainNav = document.getElementById('navbar');

let navBarToggle = document.getElementById('js-navbar-toggle');

navBarToggle.addEventListener('click', function () {
    mainNav.classList.toggle('active');
})

function onLoad() {
    var today = new Date()
    $.ajax({
        method: "GET",
        url: "../api/Transactions?getBalance=true&year=" + today.getFullYear(),
        dataType: "json",
        success: function (data) {
            if (data > 0) {
                document.getElementById('BalanceDiv').classList.add('panel-success')
                document.getElementById('BalanceNumber').innerHTML = 'Current Projected Balance : $' + data;
            }
        }
    });
}