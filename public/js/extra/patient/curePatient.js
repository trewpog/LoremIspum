$(document).ready(function () {

    var id_patient;
    var isSelectedCure = false;
    var teethsArray = [];
	var noMoreClickOnSingleOperation = 0;
    var isEditableModal = false;

    var $btnUpdateCureGlob = $('#btnUpdateCure').hide();
    var $btnCreateCureeGlob = $('#btnCreateCure').show();
    var $btnDeleteCureeGlob = $('#btnDeleteCure').hide();

    // open Modal of Charts patient when button is clicked
    $('#btnNewCare, #btnCreateCureFromChart').click(function () {

        resetTreeCategoriesAndCureModal();
    });

    function resetTreeCategoriesAndCureModal() {
        resetCureModal();

        $('.jstree-clicked').removeClass('jstree-clicked').addClass('');

        $('#cureModal').modal({backdrop: 'static', keyboard: false});
        console.log('Open Modal Cures Panel');

        $('#selectAllUp').prop('disabled', true);
        $('#selectAllDown').prop('disabled', true);
    }

    // Putting a trigger when change the value can call this method here
    $('#id_patient_hidden').change(function () {
        id_patient = $(this).val();
    });

    /**
     * Called from TeethChartPatientListCure.js to open modal and edit cure
     */
    $('#call_cure_modal_from_chart').change(function () {

        if(selectedCureOpenModal != '' && selectedCureOpenModal != null) {
            var itemCure = selectedCureOpenModal;

            resetTreeCategoriesAndCureModal();

            console.log( itemCure );
            isEditableModal = true;
            isSelectedCure = true;

            $btnUpdateCureGlob.show();
            $btnDeleteCureeGlob.show();
            $btnCreateCureeGlob.hide();

            var id_cure = itemCure.id;
            var shortCode = itemCure.short_code;
            var shortCode = itemCure.short_code;
            var description = itemCure.description;
            var price = itemCure.price;
            var amount = itemCure.amount;
            var id_teeth_prizes = itemCure.id_teeth_prizes;
            var listTeeths = itemCure.teeth_no;

            $('#id_cure_hidden').val( id_cure );
            $('#shortCode').val( shortCode );
            $('#description').val( description );
            $('#price').val( price );
            $('#amount').val( amount );
            $('#id_teeth_prizesHide').val( id_teeth_prizes );

            $('#selectAllUp').prop('disabled', false);
            $('#selectAllDown').prop('disabled', false);

            // expand all the tree
            $('#jstree1').jstree('open_all');

            if(typeof description !== "undefined") {
                setItemSelectedAtTree(description.substring(1));
            }

            // setTheCureSelected(itemCure);
            var listTeethsArray = listTeeths.split(',');

            $.each(listTeethsArray, function (i, item) {

                var itemId = '#teeth_' + item.trim();

                setSelectedOrUnSelectTeethImage(itemId);
            });
        }
    });

    function setSelectedOrUnSelectTeethImage(idImage) {

        var hasClass = $(idImage).attr('class');

        if (typeof hasClass !== typeof undefined && hasClass !== false) {
            $(idImage).removeAttr("class");

            if (idImage.substring(0, 7) == '#teeth_') {
                idImage = idImage.substring(7);
            }
            var pos = teethsArray.indexOf(idImage);

            teethsArray.splice(pos, 1);

        } else {
            $(idImage).addClass("teeth-border-cure");

            if (idImage.substring(0, 7) == '#teeth_') {
                idImage = idImage.substring(7);
            }

            teethsArray.push(idImage);
        }

        calculateTheAmount(teethsArray.length);
    }

    function calculateTheAmount(countTeeths) {

        var price = $('#price').val();
        var discount = $('#discount').val();
        var amount = 0;

        if (discount > 100) {
            amount = 0;
        } else {
            amount = parseFloat(( price * countTeeths ) - (( price * countTeeths ) * (discount / 100) )).toFixed(2);
        }

        $('#amount').val(amount);

        $('h2.font-bold-teeth').html(countTeeths)
    }

    $('#call_delete_cure_from_teethChart_to_cure').change(function () {

        noMoreClickOnSingleOperation++;

        ajaxFormDeleteCure(noMoreClickOnSingleOperation);
    });

    function setItemSelectedAtTree(description) {

        $('a:contains(' + description + ')').addClass('jstree-clicked');
    }

    // Child node selected
    $(function () {
        $('#jstree1')
            .on('changed.jstree', function (e, data) {
                var i, j, r = [];
                for(i = 0, j = data.selected.length; i < j; i++) {
                    r.push(data.instance.get_node(data.selected[i]).text);

                    console.log ('Node: ' + data.instance.get_node(data.selected[i]).text);
                }
                selectedCureCategory( r.join(', ') );
            })
            .jstree();
    });

    function selectedCureCategory(cureName) {

        console.log('Category-Cure selected: ' + cureName);

        resetCureModal();

        var cureNameTrim = cureName.trim();

        if (cureNameTrim.substr(cureNameTrim.length - 1) === '|') {
            console.log('Category selected! Choose the cure item.');
            isSelectedCure = false;

            $('#selectAllUp').prop('disabled', true);
            $('#selectAllDown').prop('disabled', true);
        } else {

            var data = {
                        cureName: cureName,
                        _token:   token
                       };

            ajaxRequest('POST', selectedCure, data,
                function (msg) {

                    setTheCureSelected( msg.theCure );
            });

        }
    }

    function setTheCureSelected( theCure ) {
        console.log( theCure );
        isSelectedCure = true;

        var shortCode = (theCure.detail).substring(0, 4).trim();
        var description = ((theCure.detail).split('-')[1]).trim();
        var price = theCure.price1;
        var amount = parseFloat( 0 ).toFixed(2);
        var id_teeth_prizes = theCure.id;


        $('#shortCode').val( shortCode );
        // first letter uppercase
        $('#description').val( description[0].toUpperCase() + description.slice(1) );
        $('#price').val( price );
        $('#amount').val( amount );
        $('#id_teeth_prizesHide').val( id_teeth_prizes );

        jQuery("#jstree1").jstree("select_node", "#test2");

        $('#selectAllUp').prop('disabled', false);
        $('#selectAllDown').prop('disabled', false);

    }

    $("#teeth-group img").on("click", function() {
        console.log("clicked: " + $(this).prop('id') );

        var idImage = "#" + $(this).prop('id');

        if (idImage != ("#" + "teeth") && isSelectedCure) {
            setSelectedOrUnSelectTeethImage(idImage);
        }

    });

    $('#price').bind('keyup mouseup', function() {
        calculateTheAmount(teethsArray.length);
    });

    $('#discount').bind('keyup mouseup', function() {
        calculateTheAmount(teethsArray.length);
    });

    // Create new Cure for this patient
    $('#btnCreateCure, #btnUpdateCure').click(function (event) {
        event.preventDefault();
		noMoreClickOnSingleOperation++;

        ajaxFormSaveUpdateCure(noMoreClickOnSingleOperation);

    });

    // Delete the Cure for this patient
    $('#btnDeleteCure').click(function (event) {
        event.preventDefault();
        noMoreClickOnSingleOperation++;

        ajaxFormDeleteCure(noMoreClickOnSingleOperation);

    });

    function ajaxFormDeleteCure(noMoreClickOnSingleOperation) {

        swal({
                title: "Delete Cure with ID: " + $('#id_cure_hidden').val(),
                text: "Are you sure to delete this cure?",
                type: "error", showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            },

            function () {
                if (validateFieldsIfEmpty() && noMoreClickOnSingleOperation == 1) {

                    var data = {
                                id:     $('#id_cure_hidden').val(),
                                _token: token
                               };

                    ajaxRequest('POST', urlDeleteCure, data,
                        function (msg) {

                            $('#cureModal').modal('hide');
                            $('#call_refresh_list_cures_from_cureDetail_to_chart').val('Start')
                            $('#call_refresh_list_cures_from_cureDetail_to_chart').trigger('change');

                            console.log(JSON.stringify(msg));
                    });

                }
            });
    }

    function ajaxFormSaveUpdateCure(noMoreClickOnSingleOperation) {

        if (validateFieldsIfEmpty() && noMoreClickOnSingleOperation == 1) {

            var data = {
                        id:              $('#id_cure_hidden').val(),
                        teeth_no:        sortAndConvertToString(teethsArray),
                        type_cure:       $('input[name=typeCure]:checked').val(),
                        status_cure:     $('input[name=statusCure]:checked').val(),
                        short_code:      $('#shortCode').val(),
                        date:            changeFormatDate($('#date_cure').datepicker("getDate")),
                        description:     $('#description').val(),
                        desc_client:     $('#descOfClient').val(),
                        currency:        $('#currencyHide').val(),
                        price:           $('#price').val(),
                        quantity:        teethsArray.length,
                        discount:        $('#discount').val(),
                        amount:          $('#amount').val(),
                        id_teeth_prizes: $('#id_teeth_prizesHide').val(),
                        id_patient:      id_patient,
                        isEditableModal: isEditableModal,
                        id_chart:        idChartGlob,
                        _token:          token
                    };

            ajaxRequest('POST', urlSaveUpdateCure, data,
                function (msg) {

                    $('#cureModal').modal('hide');

                    $('#call_refresh_list_cures_from_cureDetail_to_chart').val('Start')
                    $('#call_refresh_list_cures_from_cureDetail_to_chart').trigger('change');

                    console.log(JSON.stringify(msg));

                    sweetAlert("The cure has been created!", "", "success");
            });
        }
    }

    // select all teeth toggle buttons
    $('#selectAllUp').click(function () {
        var idButton = '#selectAllUp';
        theFunctionSelectAllTeeths(1, 17, idButton);
        }
    );

    $('#selectAllDown').click(function () {
            var idButton = '#selectAllDown';
            theFunctionSelectAllTeeths(17, 33, idButton);
        }
    );

    function theFunctionSelectAllTeeths(i, length, idButton) {

        if ($(idButton).hasClass('active')) {

            for (var index = i; index < length; index++) {
                var idImageTeeth = '#teeth_' + index;
                var hasClass = $(idImageTeeth).attr('class');

                if (typeof hasClass !== typeof undefined && hasClass !== false) {

                    $(idImageTeeth).removeAttr("class");

                    if (idImageTeeth.substring(0, 7) == '#teeth_') {
                        idImageTeeth = idImageTeeth.substring(7);
                    }
                    var pos = teethsArray.indexOf(idImageTeeth);
                    teethsArray.splice(pos, 1);
                }
            }
        } else {

            for (var index = i; index < length; index++) {
                var idImageTeeth = '#teeth_' + index;
                var hasClass = $(idImageTeeth).attr('class');

                if (!(typeof hasClass !== typeof undefined && hasClass !== false)) {

                    $(idImageTeeth).addClass("teeth-border-cure");

                    if (idImageTeeth.substring(0, 7) == '#teeth_') {
                        idImageTeeth = idImageTeeth.substring(7);
                    }

                    teethsArray.push(idImageTeeth);
                }
            }
        }
        calculateTheAmount(teethsArray.length);
        $('h2.font-bold-teeth').html(teethsArray.length)

    }
    
    function resetCureModal() {

        isSelectedCure = false;
        isEditableModal = false;
		noMoreClickOnSingleOperation = 0;

        $btnUpdateCureGlob.hide();
        $btnDeleteCureeGlob.hide();
        $btnCreateCureeGlob.show();

        // empty the array
        teethsArray.length = 0;

        $('h2.font-bold-teeth').html(teethsArray.length)

        /**
         * Remove the check attribute added at the div and set it at the default
         * radio button
         * */
        var allChildrenStatusTheCure = $("#allChildrenStatusTheCure div.iradio_square-green");

        for(var i = 0; i < allChildrenStatusTheCure.length; i++) {
            allChildrenStatusTheCure[i].className = "iradio_square-green";
        }

        $("#DE label div").addClass("iradio_square-green checked");
        $('#id_cure_hidden').val('');
        $("#shortCode").val('');
        $("#description").val('');
        $("#descOfClient").val('');

        var theUser = '';
        $("#user option").filter(function() {
            //may want to use $.trim in here
            return $(this).text() == theUser;
        }).prop('selected', true);

        $("#price").val('0.00');
        $("#amount").val('0.00');
        $("#discount").val('0');

        for(var i = 1; i < 33; i++) {
            $( ("#teeth_" + i) ).removeAttr("class");
        }

        $('#selectAllUp').removeClass('active');
        $('#selectAllDown').removeClass('active');

        // $('#jstree1').jstree(true).destroy(true);
        // $('#jstree1').jstree(true).create(true);

        console.log('Reset Modal Cures Panel');
    }
    
    function validateFieldsIfEmpty() {
        
        var validateFields = false;
        
        if(teethsArray.length > 0) {
            validateFields = true;
        } else {
            swal("Please, select a teeth to process.");
			noMoreClickOnSingleOperation = 0;
        }
        
        return validateFields;
    }

    $('#jstree1').jstree({
        'core' : {
            'check_callback' : true
        },
        'plugins' : [ 'types', 'dnd' ],
        'types' : {
            'default' : {
                'icon' : 'fa fa-folder'
            },
            'html' : {
                'icon' : 'fa fa-file-code-o'
            },
            'svg' : {
                'icon' : 'fa fa-file-picture-o'
            },
            'css' : {
                'icon' : 'fa fa-file-code-o'
            },
            'img' : {
                'icon' : 'fa fa-file-image-o'
            },
            'js' : {
                'icon' : 'fa fa-file-text-o'
            }
        }
    });

    function changeFormatDate(inputDate) {
        var date = new Date(inputDate);
        if (!isNaN(date.getTime())) {

            var day =  formatDigitsDate( date.getDate() );
            // Months use 0 index.
            var month =  formatDigitsDate( date.getMonth() + 1 );

            return date.getFullYear() + '/' + month + '/' + day;
        }
    }

    function sortAndConvertToString(teethArrayList) {

        return (teethArrayList.sort(function (a, b) { return a - b; })).toString();
    }

});





