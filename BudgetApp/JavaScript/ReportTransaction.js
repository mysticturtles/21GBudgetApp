
$("#CategoryDropDown").change(filterByType);

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

function getReoccur(myClass) {
    $(myClass).html(`
       <option value="0">Please Select...</option>
       <option value="1">Yes</option>
       <option value="0">No</option>
    `)

    $(myClass).chosen();
}


function getSpender(myClass) {
    $(myClass).html(`
       <option value="0">Please Select...</option>
       <option value="3">Chelsi</option>
       <option value="2">Zach</option>
    `)

    $(myClass).chosen();
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

$(document).ready(function () {
    getTypes(TransactionTypeDropdown);
    getCategory(CategoryDropDown);
    getReoccur(ReoccuringDropDrown);
    getSpender(SpenderDropDown);
    $('#ReoccuringLabelSection').hide()
    $('#ReoccuringDropdownSection').hide()
});