let mainNav = document.getElementById('navbar');

let navBarToggle = document.getElementById('js-navbar-toggle');

var activeDropdown = {};  

navBarToggle.addEventListener('click', function () {
    mainNav.classList.toggle('active');
})

document.getElementById('yearDropdown').addEventListener('click', function () {
    if (activeDropdown.id && activeDropdown.id !== event.target.id) {
        activeDropdown.element.style.visibility = 'hidden';
    }
    if (event.target.tagName === 'LI') {
        document.getElementById('yearText').innerHTML = event.target.innerHTML;
        year = document.getElementById('yearText').innerHTML
        month = document.getElementById('monthText').innerHTML
        newDate = new Date(year + month + '01')
        console.log(newDate);
        mainDataSection(newDate);
    }
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].classList.contains('dropdown-selection')) {
            activeDropdown.id = this.id;
            activeDropdown.element = this.children[i];
            activeDropdown.span = 'yearCaret';
            this.children[i].style.visibility = 'visible';
        }
    }
    document.getElementById('yearCaret').classList.remove('fa-caret-square-right')
    document.getElementById('yearCaret').classList.add('fa-caret-square-down')

    
});

document.getElementById('monthDropdown').addEventListener('click', function () {
    if (activeDropdown.id && activeDropdown.id !== event.target.id) {
        activeDropdown.element.style.visibility = 'hidden';
    }
    if (event.target.tagName === 'LI') {
        document.getElementById('monthText').innerHTML = event.target.innerHTML;
        year = document.getElementById('yearText').innerHTML
        month = document.getElementById('monthText').innerHTML
        newDate = new Date(year + month + '01')
        console.log(newDate);
        mainDataSection(newDate)
    }
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].classList.contains('dropdown-selection')) {
            activeDropdown.id = this.id;
            activeDropdown.element = this.children[i];
            activeDropdown.span = 'monthCaret';
            this.children[i].style.visibility = 'visible';
        }
    }
    document.getElementById('monthCaret').classList.remove('fa-caret-square-right')
    document.getElementById('monthCaret').classList.add('fa-caret-square-down')

    
});

window.onclick = function (event) {
    if (!event.target.classList.contains('dropdown-button')) {
        activeDropdown.element.style.visibility = 'hidden';
        document.getElementById(activeDropdown.span).classList.remove('fa-caret-square-down')
        document.getElementById(activeDropdown.span).classList.add('fa-caret-square-right')
    }
}
function onLoad() {
    var today = new Date()
    console.log(today)
    mainDataSection(today)
    getMonths(today)
    getYears(today)
}

function getMonths(today) {
    $.ajax({
        method: "GET",
        url: "../api/date?getMonth=true",
        dataType: "json",
        success: function (data) {
            var Months = [];
            $.each(data, function (index, value) {
                Months.push('<li value="' + value.monthInt + '">' + value.monthName + '</li>')
                if (value.monthInt == today.getMonth() + 1) {
                    document.getElementById('monthText').textContent = value.monthName
                        
                }
            });
            $('#monthOptions').html(Months);
        },       
    })
}

function getYears(today) {
    $.ajax({
        method: "GET",
        url: "../api/date?getYear=true",
        dataType: "json",
        success: function (data) {
            var Years = [];
            $.each(data, function (index, value) {
                Years.push('<li value="' + value.yearInt + '">' + value.yearInt + '</li>')
                if (value.yearInt == today.getFullYear()) {
                    document.getElementById('yearText').textContent = value.yearInt
                }
            });
            $('#yearOptions').html(Years);
        },
    })
}

function mainDataSection(selectedDate) {
    //Gets the current projected balance

    $.ajax({
        method: "GET",
        url: "../api/Transactions?getBalance=true&year=" + selectedDate.getFullYear(),
        dataType: "json",
        success: function (data) {
            if (data > 0) {
                document.getElementById('BalanceDiv').classList.add('panel-income')
                document.getElementById('BalanceDiv').classList.remove('panel-purchase')
                document.getElementById('BalanceNumber').innerHTML = 'Current Projected Balance : $' + data;
            } else {
                document.getElementById('BalanceDiv').classList.add('panel-purchase')
                document.getElementById('BalanceNumber').innerHTML = 'Current Projected Balance : $' + data;
            }
        },
        error: function (data) {
            document.getElementById('BalanceDiv').classList.add('panel-purchase')
            document.getElementById('BalanceDiv').classList.remove('panel-income')
            document.getElementById('BalanceNumber').innerHTML = 'Current Projected Balance : $' + data;
        }
    });
    //Gets the month and year for use in the table
    data = {
        month:  /*1,*/selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear()
    }
    //Loads the Incomes for this month and builds the table
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
                document.getElementById('incomeTable').classList.remove('inactive')
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
    //Loads the expenses and builds the table for this month
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
                document.getElementById('expenseTable').classList.remove('inactive')
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
    //Loads the Purchases from this month and builds the table
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
                document.getElementById('purchaseTable').classList.remove('inactive')
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

function getTypes(myClass, selectedType) {
    $.ajax({
        type: "GET",
        url: "../api/types?getTypes=true",
        dataType: "json",
        success: function (data) {
            var transactionTypes = [];
            $.each(data, function (index, value) {
                if (value.typeId == selectedType) {
                    transactionTypes.push('<option class="TypeSelections" value="' + value.typeId + '" data-category="' + value.typeMod + '" selected>' + value.typeName + '</option>');
                    if (value.typeMod == 'expense') {
                        $('#ReoccuringLabelSection').show()
                        $('#ReoccuringDropdownSection').show()
                    }
                } else {
                    transactionTypes.push('<option class="TypeSelections" value="' + value.typeId + '" data-category="' + value.typeMod + '">' + value.typeName + '</option>');
                }
            });
            if (selectedType == "") {
                $(myClass).html('<option value="" selected > Please Select...</option>' + transactionTypes.join(""));
            } else {
                $(myClass).html('<option value="">Please Select...</option>' + transactionTypes.join(""));
            }
            $(myClass).chosen();
        }
    })
}

function getCategory(myClass) {
    $(myClass).html(`
       <option value="">Please Select...</option>
       <option value="income">Income</option>
       <option value="expense">Expense</option>
       <option value="purchase">Purchase</option> 
    `)
    

    $(myClass).chosen();
}

function getReoccur(myClass, selectedReoccur) {
    Reoccur = [];
    if (selectedReoccur == null) {
        $(myClass).html(`
            <option value="0">Please Select...</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
        `)
        $(myClass).chosen();
    } else {
        if (selectedReoccur == 1) {
            $(myClass).html(`
                <option value="0">Please Select...</option>
                <option value="1" selected>Yes</option>
                <option value="0">No</option>
            `)
            $(myClass).chosen();
        } else if (selectedReoccur == 0) {
            $(myClass).html(`
            <option value="0">Please Select...</option>
            <option value="1">Yes</option>
            <option value="0" selected>No</option>
            `)
            $(myClass).chosen();
        }
    }
}


function getSpender(myClass, selectedSpender) {
    if (selectedSpender == null) {
        $(myClass).html(`
           <option value="0">Please Select...</option>
           <option value="3">Chelsi</option>
           <option value="2">Zach</option>
        `)
        $(myClass).chosen();
    } else {
        if (selectedSpender == 3) {
            $(myClass).html(`
           <option value="0">Please Select...</option>
           <option value="3" selected>Chelsi</option>
           <option value="2">Zach</option>
        `)
            $(myClass).chosen();
        } else if (selectedSpender == 2) {
            $(myClass).html(`
                   <option value="0">Please Select...</option>
                   <option value="3">Chelsi</option>
                   <option value="2" selected>Zach</option>
                `)
            $(myClass).chosen();
        }
    }
}

function AddTransaction() {
    $('.HidePage').show();
    
    document.getElementById('Add/UpdateTransaction').innerHTML = `
        <div class="frontPage">
        <div id="AddTransaction"><h2>Add Transaction</h2></div>
        <div class="centerForm">
            <div class="formSpacing" id="CategorySection">
                <div class="leftForm" id="CategoryLabelSection">
                    <label class="formLabel" id="TransactionCategory" for="CategoryDropDown">Transaction Category</label>
                </div>
                <div class="rightForm" id="CategoryInputSection">
                    <select class="maindropdown" id="CategoryDropDown">
                    </select>
                </div>
            </div>
            <div class="formSpacing" id="SourceSection">
                <div class="leftForm" id="SourceLabelSection">
                    <label class="formLabel" id="Source" for="SourceInput">Transaction Source</label>
                </div>
                <div class="rightForm" id="SourceInputSection">
                    <input type="text" class="form-control formSpacing" id="SourceInput" name="SourceInput" required />
                </div>
            </div>
            <div class="formSpacing" id="AmountSection">
                <div class="leftForm" id="AmountLabelSection">
                    <label class="formLabel" id="Amount" for="AmountInput">Transaction Amount</label>
                </div>
                <div class="rightForm" id="AmountInputSection">
                    <input type="text" class="form-control formSpacing" id="AmountInput" name="AmountInput" required />
                </div>
            </div>
            <div class="formSpacing" id="TypeSection">
                <div class="leftForm" id="TypeLabelSection">
                    <label class="formLabel" id="Category" for="TransactionTypeDropdown">Transaction Type</label>
                </div>
                <div class="rightForm" id="TypeDropdownSection">
                    <select class="maindropdown" id="TransactionTypeDropdown"> 
                    </select>
                </div>
            </div>
            <div class="formSpacing" id="DateSection">
                <div class="leftForm" id="DateLabelSection">
                    <label class="formLabel" id="Date" for="DateInput">Transaction Date</label>
                </div>
                <div class="rightForm" id="DateInputSection">
                    <input name="DateInput" type="date" class="form-control" id="DateInput" required />
                </div>
            </div>
            <div class="formSpacing" id="DescriptionSection">
                <div class="leftForm" id="DescriptionLabelSection">
                    <label class="formLabel" id="Description" for="DescriptionInput">Description</label>
                </div>
                <div class="rightForm" id="DescriptionInputSection">
                    <input name="DescriptionInput" id="DescriptionInput" class="form-control formSpacing" type="text" />
                </div>
            </div>
            <div class="formSpacing" id="ReoccuringSection">
                <div class="leftForm" id="ReoccuringLabelSection">
                    <label class="formLabel" id="Reoccuring" for="ReoccuringDropDown">Reoccuring?</label>
                </div>
                <div class="rightForm" id="ReoccuringDropdownSection">
                    <select class="maindropdown chosen" id="ReoccuringDropDrown">
                    </select>
                </div>
            </div>
            <div class="formSpacing" id="SpenderSection">
                <div class="leftForm" id="SpenderLabelSection">
                    <label class="formLabel" id="Spender" for="SpenderDropDown">Transaction Spender</label>
                </div>
                <div class="rightForm" id="SpenderDropdownSection">
                    <select class="maindropdown" id="SpenderDropDown">
                    </select>
                </div>
            </div>
            <div class="formSpacing">
                <button class="confirmButton" id="addTransaction">Add Transaction</button>
                <button class="closeButton" id="closeTransactionFrom" onclick="CloseTransactionForm()">Close</button>
            </div>
        </div>
    </div>
    `
    getTypes(TransactionTypeDropdown);
    getCategory(CategoryDropDown);
    getReoccur(ReoccuringDropDrown);
    getSpender(SpenderDropDown);
    $('#ReoccuringLabelSection').hide()
    $('#ReoccuringDropdownSection').hide()
}

function UpdateTransaction(ID) {
    $('.HidePage').show();

    $.ajax({
        type: "GET",
        url: "../api/Transactions?getTransaction=true&id="+ID,
        dataType: "json",
        success: function (data) {
            console.log(data)
            document.getElementById('Add/UpdateTransaction').innerHTML = `
                <div class="frontPage">
                <div id="AddTransaction"><h2>Add Transaction</h2></div>
                <div class="centerForm">
                    <div class="formSpacing" id="IDSection">
                        <div class="leftForm" id="IDLabelSection">
                            <label class="formLabel" id="ID" for="IDInput">Transaction ID</label>
                        </div>
                        <div class="rightForm" id="IDInputSection">
                            <input type="text" class="form-control formSpacing" id="IDInput" name="IDInput" value="` + data.transactionID + `" readonly />
                        </div>
                    </div> 
                    <div class="formSpacing" id="SourceSection">
                        <div class="leftForm" id="SourceLabelSection">
                            <label class="formLabel" id="Source" for="SourceInput">Transaction Source</label>
                        </div>
                        <div class="rightForm" id="SourceInputSection">
                            <input type="text" class="form-control formSpacing" id="SourceInput" name="SourceInput" value="` + data.source + `" required />
                        </div>
                    </div>
                    <div class="formSpacing" id="AmountSection">
                        <div class="leftForm" id="AmountLabelSection">
                            <label class="formLabel" id="Amount" for="AmountInput">Transaction Amount</label>
                        </div>
                        <div class="rightForm" id="AmountInputSection">
                            <input type="text" class="form-control formSpacing" id="AmountInput" name="AmountInput" value="` + data.amount + `" required />
                        </div>
                    </div>
                    <div class="formSpacing" id="TypeSection">
                        <div class="leftForm" id="TypeLabelSection">
                            <label class="formLabel" id="Category" for="TransactionTypeDropdown">Transaction Type</label>
                        </div>
                        <div class="rightForm" id="TypeDropdownSection">
                            <select class="maindropdown" id="TransactionTypeDropdown"> 
                            </select>
                        </div>
                    </div>
                    <div class="formSpacing" id="DateSection">
                        <div class="leftForm" id="DateLabelSection">
                            <label class="formLabel" id="Date" for="DateInput">Transaction Date</label>
                        </div>
                        <div class="rightForm" id="DateInputSection">
                            <input name="DateInput" type="date" class="form-control" id="DateInput" value="` + new Date(data.date).toISOString().slice(0,10) + `"/>
                        </div>
                    </div>
                    <div class="formSpacing" id="DescriptionSection">
                        <div class="leftForm" id="DescriptionLabelSection">
                            <label class="formLabel" id="Description" for="DescriptionInput">Description</label>
                        </div>
                        <div class="rightForm" id="DescriptionInputSection">
                            <input name="DescriptionInput" id="DescriptionInput" class="form-control formSpacing" type="text" value="` + data.description + `" />
                        </div>
                    </div>
                    <div class="formSpacing" id="ReoccuringSection">
                        <div class="leftForm" id="ReoccuringLabelSection">
                            <label class="formLabel" id="Reoccuring" for="ReoccuringDropDown">Reoccuring?</label>
                        </div>
                        <div class="rightForm" id="ReoccuringDropdownSection">
                            <select class="maindropdown chosen" id="ReoccuringDropDrown">
                            </select>
                        </div>
                    </div>
                    <div class="formSpacing" id="SpenderSection">
                        <div class="leftForm" id="SpenderLabelSection">
                            <label class="formLabel" id="Spender" for="SpenderDropDown">Transaction Spender</label>
                        </div>
                        <div class="rightForm" id="SpenderDropdownSection">
                            <select class="maindropdown" id="SpenderDropDown">
                            </select>
                        </div>
                    </div>
                    <div class="formSpacing">
                        <button class="confirmButton" id="UpdateTransaction">Update Transaction</button>
                        <button class="closeButton" id="closeTransactionFrom" onclick="CloseTransactionForm()">Close</button>
                        <button class="deleteButton" id="deleteTransaction" onclick="deleteTransaction(`+ data.transactionID +`)">Delete</button>
                    </div>
                </div>
            </div>
            `
            getTypes(TransactionTypeDropdown, data.category);
            getReoccur(ReoccuringDropDrown, data.reoccur);
            getSpender(SpenderDropDown, data.spender);
            $('#ReoccuringLabelSection').hide()
            $('#ReoccuringDropdownSection').hide()
        }
    });
}

$('.HidePage').click(CloseTransactionForm);
function CloseTransactionForm() {
    document.getElementById("Add/UpdateTransaction").innerHTML = "";
    $('.HidePage').hide();
}

function deleteTransaction(ID) {
    alert("Are you sure you want to delete Transaction " + ID)
    console.log(ID)
    $.ajax({
        type: "DELETE",
        url: "../api/Transactions?deleteTransaction=true&id=" + ID,
        dataType: "json",
        success: function (data) {
            alert("Success Deleting " + ID)
        }
    })
}

function filterByType() {
    filter = document.getElementById('CategoryDropDown').value;
    console.log(filter)
    if (filter == "expense") {
        $('#ReoccuringLabelSection').show()
        $('#ReoccuringDropdownSection').show()
    } else {
        $('#ReoccuringLabelSection').hide()
        $('#ReoccuringDropdownSection').hide()
    }
    $(document.getElementsByClassName('TypeSelections')).each(function (value) {
        var rowTypeMod = $(this).attr('data-category');
        if (rowTypeMod == filter) {
            $(this).show();
        } else {
            $(this).hide();
        }

    });
    $('#TransactionTypeDropdown').trigger("chosen:updated");
}


$(document.body).on('click', '#addTransaction', function (e) {
    console.log('Clicked on the add button!')
    var spender = $(document.getElementById('SpenderDropDown')).val()
    console.log(spender);
    var source = $(document.getElementById('SourceInput')).val();
    console.log(source);
    var amount = $(document.getElementById('AmountInput')).val();
    console.log(amount);
    var category = $(document.getElementById('TransactionTypeDropdown')).val();
    console.log(category);
    var date = $(document.getElementById('DateInput')).val()
    console.log(date);
    var description = $(document.getElementById('DescriptionInput')).val()
    console.log(description);
    var reoccur = $(document.getElementById('ReoccuringDropDrown')).val();
    console.log(reoccur);
    if (spender == 0 || source == "" || amount <= 0 || category == "" || date == "" || description == "" || reoccur >= 2) {
        alert("Please complete all fields before submiting form")
    } else {
        data = {
            spender: spender,
            source: source,
            amount: amount,
            category: category,
            date: date,
            description: description,
            reoccur: reoccur,
        }
        console.log(data);
        $.ajax({
            type: "POST",
            url: "../api/Transactions?addTransaction=true",
            data: data,
            success: function (data) {
                alert("Created Transaction " + data)
            }
        })

    }
});




$(document.body).on('change', '#CategoryDropDown', filterByType);
$(document.body).on('click', '.clickableID', function () {
    if ($(this).text() == 0) {
        console.log($(this).text())
        alert("The Transaction ID for this transaction doesn't seem to be valid")
    } else {
        console.log($(this).text())
        UpdateTransaction($(this).text())
    }
})
