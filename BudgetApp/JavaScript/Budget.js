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
                document.getElementById('BalanceDiv').classList.add('panel-income')
                document.getElementById('BalanceNumber').innerHTML = 'Current Projected Balance : $' + data;
            } else {
                document.getElementById('BalanceDiv').classList.add('panel-purchase')
                document.getElementById('BalanceNumber').innerHTML = 'Current Projected Balance : $' + data;
            }
        },
        error: function (data) {
            document.getElementById('BalanceDiv').classList.add('panel-purchase')
            document.getElementById('BalanceNumber').innerHTML = 'Current Projected Balance : $' + data;
        }
    });
    data = {
        month:  today.getMonth() + 1,
        year: today.getFullYear()
    }
    $.ajax({
        method: "POST",
        url: "../api/Transactions?getIncomes=true&filter=true",
        data: data,
        success: function (data) {
            console.log(data)
            if (data[0].spender == 'NO RECORDS') {
                document.getElementById('incomeTable').classList.add('inactive')
                console.log('Hiding Income Table')
            } else {
                var incomes = [];
                $.each(data, function (index, value) {
                    incomes.push('<tr><td class="clickableID">' + value.transactionID + '</td><td>' + value.source + '</td><td>' + value.amount + '</td><td>' + value.category + '</td><td>' + value.date + '</td></tr>');
                });
                $('#incomedata').html(incomes.join(""));
            }
        },
        error: function (data) {
            document.getElementById('incomeTable').classList.add('inactive')
            console.log('unable to load income data')
        }

    })
    $.ajax({
        method: "POST",
        url: "../api/Transactions?getExpenses=true&filter=true",
        data: data,
        success: function (data) {
            console.log(data)
            if (data[0].spender == 'NO RECORDS') {
                document.getElementById('expenseTable').classList.add('inactive')
                console.log('Hiding Expense Table')
            } else {
                var incomes = [];
                $.each(data, function (index, value) {
                    incomes.push('<tr><td class="clickableID">' + value.transactionID + '</td><td>' + value.source + '</td><td>' + value.amount + '</td><td>' + value.category + '</td><td>' + value.date + '</td></tr>');
                });
                $('#expensedata').html(incomes.join(""));
            }
        },
        error: function (data) {
            document.getElementById('expenseTable').classList.add('inactive')
            console.log('unable to load income data')
        }

    })
    $.ajax({
        method: "POST",
        url: "../api/Transactions?getPurchases=true&filter=true",
        data: data,
        success: function (data) {
            console.log(data)
            if (data[0].spender == 'NO RECORDS') {
                document.getElementById('purchaseTable').classList.add('inactive')
                console.log('Hiding Purchase Table')
            } else {
                var incomes = [];
                $.each(data, function (index, value) {
                    incomes.push('<tr><td class="clickableID">' + value.transactionID + '</td><td>' + value.source + '</td><td>' + value.amount + '</td><td>' + value.category + '</td><td>' + value.date + '</td></tr>');
                });
                $('#purchasedata').html(incomes.join(""));
            }
        },
        error: function (data) {
            document.getElementById('purchaseTable').classList.add('inactive')
            console.log('unable to load income data')
        }

    })
}