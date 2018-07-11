var MyCheckout = {

    anonymousCheckout: 0,

    signedIn: 0,

    digitalOrder: 0,

    createAccount: 0,

    checkoutLogin: 0,

    type: '',

    createAppend: '',

    completedSteps: [],

    stepErrors: {},

    submitting: 0,

    card_payment_provider: 'checkout_authorizenet',

    paypal_payment_provider: 'checkout_paypalexpress',

    payment_provider: 'checkout_authorizenet',
    settingGuest: 0,
    ready: 0,
    cardType: '',

    init: function() {


        if (sessionStorage.hitError == 'yes') {
            alert('There was an error creating your order, please enter your information and try again');
            sessionStorage.clear();
        }
        if ($('#CheckoutGuestForm').css('display') == 'none') {
            MyCheckout.settingGuest = 0;
        } else {
            MyCheckout.settingGuest = 1;
        }

        $('#ConfirmOrder').hide();

        if ($('.CheckoutHideOrderTermsAndConditions').css('display') == 'block') {
            $('.termsy').show();

        } else {
            $('.termsy').hide();
        }

        if ($('.CheckoutOrderComments').css('display') == 'block') {
            $('.Ccomments').show();

        } else {
            $('.Ccomments').hide();

        }

        if (this.signedIn == 1) {
            $('.AccountLogins').remove();
            $('#CheckoutMain').show();
            $('#CheckoutStepAccountDetails').hide();
            MyCheckout.submitBilling();


            $('.isYou').css('display', 'block');

        } else {
            $('#CreateAccountButton').submit();
        }


        $('#SideCartContents > div > ul > li').each(function() {
            var options = $(this).children('small');
            var optionText = options.text();
            var optArray = optionText.substring(optionText.lastIndexOf("(") + 1, optionText.lastIndexOf(")")).split(',');
            var optHtml = '';
            for (var i = 0; i < optArray.length; i++) {
                var optSplit = optArray[i].split(':');
                optHtml += '<p><small>' + optSplit[0] + ':</small><small>' + optSplit[1] + '</small></p>';
            };
            var optJquery = $(optHtml);
            options.replaceWith(optJquery);
        });
        $('.totalInfo').html($('span.cartCost strong').html());

        $('#Shipping').hide();

        MyCheckout.setAddressListeners();
        MyCheckout.setProviderListener();

        $('#sel_billing_address').change(function() {
            MyCheckout.saveBillingAddress();
        });

        $('#sel_shipping_address').change(function() {
            MyCheckout.saveShippingAddress();
        });
        $('#provider_list input').live('click', MyCheckout.changePaymentProvider);


        $('#SubmitCoupon').click(MyCheckout.applyCouponCode);


        $('#CVV2Help').click(function() {
            alert('For Visa/MasterCard/Discover cards, it\'s the three digit code beside your signature strip on the back of the card. For American Express cards, it\'s the four digit code above the account number on the front of the card.');
            return false;
        });

        $('#AuthorizeNet_ccno').change(MyCheckout.setCardType);

        if ($('label:contains(" Pay using my store credit")').parent().parent().css('display') != 'none' && MyCheckout.signedIn == 1) {

            $('.CheckoutColumn:nth-child(2) .payByStore').prepend('<input type="radio" name="store_credit" id="store_credit" value="1" checked="checked"><label >Pay By Store Credit</label> ');
            $('.CheckoutColumn:nth-child(2) .remainingMethods').append($('#credit_provider_list').html());
            $('.CheckoutColumn:nth-child(2) .alternatePayment').prepend('<input type="radio" name="store_credit" value="0" id="altPay"><label >Choose Another Payment Method</label>');
            $('.CheckoutColumn:nth-child(2) .alternateMethods').append($('.OrderContents #provider_list').html());
            $('.payByStore #store_credit').click();
            $('.alternateMethods').hide();
            MyCheckout.submitBilling();
            MyCheckout.submitShipping();
            MyCheckout.saveShippingProvider();
        } else {

            $('.CheckoutColumn:nth-child(2) .alternateMethods').html($('.OrderContents #provider_list').html());
            $('.CheckoutColumn:nth-child(2) .alternateMethods').find('.radio:first-child input').click();
            MyCheckout.card_payment_provider = $('#CheckoutMain label:contains(Credit Card)').prev().find('input').val();

        }

        if ($('p:contains("Pay the remaining")').text().indexOf('%') != -1) {
            $('.remainingMethods').hide();
        } else {
            $('.remainingMethods').show();
        }

    },

    GetAddressForm: function(type) {
        $.ajax({
            url: 'remote.php',
            type: 'post',
            dataType: 'json',
            data: {
                w: 'expressCheckoutGetAddressFields',
                type: type
            },
            success: MyCheckout.HandleResponse
        });
    },

    HandleResponse: function(data) {
        MyCheckout.card_payment_provider = $('#CheckoutMain label:contains(Credit Card)').prev().find('input').val();
        MyCheckout.payment_provider = $('#CheckoutMain label:contains(Credit Card)').prev().find('input').val();

        if (MyCheckout.signedIn == 1 && $('#CheckoutMain .payByStore #store_credit').parent().attr('class') == 'checked' && $('.totalInfo .ProductPrice').text().trim() == '') {
            MyCheckout.payment_provider = "Non-Credit";

        }
        if ($('.alternateMethods:contains(Checkout with PayPal)').length > 0) {
            MyCheckout.payment_provider = 'Non-Credit';
            $('.CheckoutLink').val('Confirm Order');
            $('#CCCheckoutForm').hide();

        }


        if ($('#credit_checkout_provider_checkout_paypalexpress').parent().attr('class') == 'checked') {
            $('#CCCheckoutForm').hide();
            $('#credit_checkout_provider_checkout_paypalexpress').click();
            $('.CheckoutLink').val('Confirm Order');
            $('.paypalConfirm').show();


        }
        if (data.status == 1) {
            $('#CheckoutMain').show();

            if (data.completedSteps) {
                for (var i = 0; i < data.completedSteps.length; i++) {
                    var id = data.completedSteps[i].id;
                    if (MyCheckout.completedSteps.indexOf(id) == -1) {
                        MyCheckout.completedSteps.push(id);
                    }
                    delete MyCheckout.stepErrors[id];
                };
            } else {
                for (var i = 0; i < data.completeSteps.length; i++) {
                    var id = data.completeSteps[i].id;
                    if (MyCheckout.completedSteps.indexOf(id) == -1) {
                        MyCheckout.completedSteps.push(id);
                    }
                    delete MyCheckout.stepErrors[id];
                };
            }
            switch (data.changeStep) {
                case 'BillingAddress':
                    if (data.completedSteps[0].id == 'AccountDetails' && data.completedSteps[0].message == 'Checking out as a guest') {
                        MyCheckout.type = 'guest';
                    }
                    if (data.completedSteps[0].id == 'AccountDetails' && data.completedSteps[0].message.indexOf('@') != -1) {
                        MyCheckout.signedIn = 1;
                    }
                    $('#CheckoutMain').show();
                    $('#CheckoutStepAccountDetails').hide();

                    $('#CheckoutMain').find('#Billing').html(data.stepContent[0].content);
                    $('#CheckoutMain').find('#Shipping').html(data.stepContent[1].content);

                    $('#Shipping').hide();
                    MyCheckout.submitBilling();
                    break;
                case 'ShippingAddress':
                    $('#Shipping').show();
                	 MyCheckout.submitShipping();

                    break;
                case 'ShippingProvider':

                    if (data.stepContent[1]) {

                        $('#CheckoutMain').find('#ShippingProvider').html(data.stepContent[1].content);


                    } else {

                        $('#CheckoutMain').find('#ShippingProvider').html(data.stepContent[0].content);


                    }
                    MyCheckout.setProviderListener();

                    if(typeof sessionStorage.selectedShip != 'undefined'){ $('#CheckoutMain').find('#ShippingProvider').find('input[value="'+sessionStorage.selectedShip+'"]').prop('checked', true).parent().addClass('checked'); }

                    MyCheckout.saveShippingProvider();
                    break;

                case 'Confirmation':


                    if (MyCheckout.couponSubmit == 1) {
                        if ($('.ErrorMessage', data.stepContent[0].content).attr('style') != 'display: none') {
                            alert($('.ErrorMessage', data.stepContent[0].content).text());
                        }
                        if ($('.SuccessMessage', data.stepContent[0].content).attr('style') != 'display: none') {
                            alert($('.SuccessMessage', data.stepContent[0].content).text());
                        }



                      MyCheckout.couponSubmit = 0;
                    }
                    $('.shippingInfo').html($('tr:contains("Shipping")', data.stepContent[0].content).find('em.ProductPrice').parent().html());
                    $('.totalInfo').html($('tr:contains("Grand Total")', data.stepContent[0].content).find('em.ProductPrice').parent().html());

                    $('.handlingInfo').html($('tr:contains("Handling")', data.stepContent[0].content).find('em.ProductPrice').parent().html());

                    if ($('.handlingInfo').text().trim().length == 0) {
                        $('.handlingInfo, .HandTotal').hide();
                    } else {
                        $('.handlingInfo, .HandTotal').show();
                    }


                    $('.taxInfo').html($('tr:contains("Tax")', data.stepContent[0].content).find('em.ProductPrice').parent().html());
                    if ($('.taxInfo').text().trim().length == 0) {
                        $('.taxInfo, .TaxTotal').hide();
                    } else {
                        $('.taxInfo, .TaxTotal').show();
                    }
                    if ($('tr.SubTotal:contains("Coupon")', data.stepContent[0].content).length > 0) {
                        $('.couponName').html($('tr.SubTotal:contains("Coupon")', data.stepContent[0].content).find('strong').html());
                        $('.couponInfo').html($('tr.SubTotal:contains("Coupon")', data.stepContent[0].content).find('em').parent().html());
                        $('.couponName, .couponInfo').show();
                    }


                    var confInfo = data.stepContent[0].content;
                    if (confInfo.length == 0) {
                        window.location.reload();
                    }

                    if ($('#checkout_provider_checkout_paypalexpress').prop('checked')) {
                        $('#checkout_provider_checkout_paypalexpress').click();

                    }

                    if ($('td:contains("Remaining")', data.stepContent[0].content).next().text().length == 0 && MyCheckout.signedIn == 1) {
                        $('.storecreditP').html($('tr:contains("Your store credit balance:")').find('td:last-child').text().trim());
                        $('.creditPrice').text('0');


                    } else {
                        $('.creditPrice').html($('td:contains("Remaining")', data.stepContent[0].content).next().html());
                        $('.storecreditP').html($('tr:contains("Your store credit balance:")').find('td:last-child').text().trim());

                        if ($('.creditPrice').text() != '' && $('.creditPrice').text() != '0') {
                            $('.GrandTotal').hide();
                        }
                    }

                    if ($('.payByStore #store_credit').parent().attr('class') == 'checked') {
                        $('.totalInfo em').text($('tr:contains("Your outstanding")', data.stepContent[0].content).find('.ProductPrice').text());

                        $('.storecredito').show();
                        $('.storecreditP').show();
                        $('.creditTotal').show();
                        $('.creditPrice').show();

                    } else {
                        $('.totalInfo em').text($('tr:contains("Grand Total")', data.stepContent[0].content).find('em.ProductPrice').parent().text());

                        $('.storecredito').hide();
                        $('.storecreditP').hide();
                        $('.creditTotal').hide();
                        $('.creditPrice').hide();
                    }

                    if($('.totalInfo').text().trim() == '$0.00'){
                        $('.CheckoutBorders').eq(1).hide();
                         $('.CheckoutBorders').eq(1).prev().hide();
                         $('.CheckoutLink').attr('onclick', '$("#bottom_payment_button").click()' );
                    }

            $('.alternatePayment div span').each(function(){
                MyCheckout.card_payment_provider = $('#CheckoutMain label:contains(Credit Card)').prev().find('input').val();
                if($(this).attr('class') == 'checked'){
                if($(this).find('input').val() != MyCheckout.card_payment_provider && $(this).find('input').val() != 'checkout_braintree' && $(this).find('input').val() != 'checkout_braintreepaypal'){
                 MyCheckout.payment_provider = 'Non-Credit';
              }
          else{
            MyCheckout.payment_provider = $(this).find('input').val();
            }
            }
                });

                    break;
                case 'PaymentDetails':
                    MyCheckout.ready = 1;
                    if (MyCheckout.submitting == 1) {
                        MyCheckout.checkout();
                    }
                    break;
                default:

            }

            $('#CheckoutMain .CheckoutColumn:first input[type="text"], #CheckoutMain .CheckoutColumn:first input[type="password"]').not('#AuthorizeNet_cccode').each(function() {
                var PL = $(this).parent().prev('dt').text().replace('*', '').replace(':', '').trim();
                $(this).parent().prev('dt').hide();
                $(this).attr('placeholder', PL);
                if ($(this).attr('aria-required') == 'true') {
                    $(this).css('border-color', '#e3e3e3');
                    if ($(this).attr('placeholder').indexOf('*') == -1) {
                        var PL = PL + '*';
                        $(this).attr('placeholder', PL);
                        $('#CheckoutMain input[type="text"] ').placeholder();
                    }
                }
            });
            $('#AuthorizeNet_cccode').css('border-color', '#e3e3e3');

            $('#CheckoutMain dt:contains("Country"), #CheckoutMain dt:contains("State")').hide();
        } else {
            var stepIndex = MyCheckout.completedSteps.indexOf(data.changeStep);
            MyCheckout.stepErrors[data.changeStep] = data.errorMessage;
            if (stepIndex != -1) {
                MyCheckout.completedSteps.splice(stepIndex, 1);
            }
            if (MyCheckout.submitting == 1) {
                alert(data.errorMessage);
                MyCheckout.submitting == 0;
                return;
            }

            if (data.changeStep == 'BillingAddress' && MyCheckout.validateBilling()) {
                $('#CheckoutMain .CheckoutColumn:first-child input[type="text"], #CheckoutMain .CheckoutColumn:first-child input[type="password"]').not('#AuthorizeNet_cccode').each(function() {
                    var PL = $(this).parent().prev('dt').text().replace('*', '').replace(':', '').trim();
                    $(this).parent().prev('dt').hide();
                    $(this).attr('placeholder', PL);
                    if ($(this).attr('aria-required') == 'true') {
                        $(this).css('border-color', '#e3e3e3');
                        if ($(this).attr('placeholder').indexOf('*') == -1) {
                            var PL = PL + '*';
                            $(this).attr('placeholder', PL);
                            $('#CheckoutMain input[type="text"] ').placeholder();
                        }
                    }
                });
                MyCheckout.submitting == 0;

                return;
            }
            if (data.changeStep == 'ShippingAddress' && (MyCheckout.validateShipping() || (MyCheckout.validateBilling && (
                    ($('#ship_to_billing_existing').attr('checked') == 'checked' && MyCheckout.signedIn == 1) || $('#ship_to_billing_new').attr('checked') == 'checked')))) {
                alert(data.errorMessage);
                MyCheckout.submitting == 0;
                return;
            }
        }
    },

    GuestCheckout: function(e) {
        MyCheckout.signedIn = 0;
        if (MyCheckout.signedIn == 0 && MyCheckout.settingGuest == 1) {
            MyCheckout.type = 'guest';
            MyCheckout.anonymousCheckout = 1;
            MyCheckout.createAccount = 0;
        } else {
            MyCheckout.type = 'account';
            MyCheckout.anonymousCheckout = 0;
            MyCheckout.createAccount = 1;
        }

        MyCheckout.GetAddressForm(MyCheckout.type);
    },

    Login: function() {

        MyCheckout.anonymousCheckout = 0;
        MyCheckout.createAccount = 0;

        if (MyCheckout.validateEmailAddress($('#login_email').val()) === false) {
            alert(lang.LoginEnterValidEmail);
            $('#login_email').focus();
            $('#login_email').select();
            return false;
        }

        if ($('#login_pass').val() === '') {
            alert(lang.LoginEnterPassword);
            $('#login_pass').focus();
            return false;
        }



        $.ajax({
            url: 'remote.php',
            type: 'post',
            dataType: 'json',
            data: 'w=expressCheckoutLogin&' + $('#LoginForm').serialize(),
            success: function(result) {
                if (result.status == 1) {
                    window.location.reload();
                } else {
                    alert("Your Email & Password Combination is incorrect. ");
                }
            }
        });
    },

    validateZip: function(zip) {
        if (zip.length == 0 || zip.indexOf(' ') === 0) {
            return false;
        }
        return true;
    },


    saveBillingAddress: function() {
        if (MyCheckout.type == 'guest' || MyCheckout.type == 'account') {
            var addressType = 'new';
        } else if ($('#BillingAddressTypeExisting').prop('checked') === true && MyCheckout.signedIn == 1 && $('#sel_billing_address option').length > 0) {
            var addressType = 'existing';
        } else {
            var addressType = 'new';

        }


        if (MyCheckout.createAccount == 1) {
            MyCheckout.createAppend = '&createAccount=1';

        }

        var formData = $('#NewBillingAddress').serialize();
        $.ajax({
            url: 'remote.php',
            type: 'post',
            dataType: 'json',
            data: 'w=saveExpressCheckoutBillingAddress&' + formData + '&BillingAddressType=' + addressType + MyCheckout.createAppend,
            success: MyCheckout.HandleResponse
        });
    },

    saveShippingAddress: function() {
        if (MyCheckout.type == 'guest' || MyCheckout.type == 'account') {
            var addressType = 'new';
        } else {
            var addressType = ($('#ShippingAddressTypeExisting').prop('checked') === true && MyCheckout.signedIn == 1) ? 'existing' : 'new';
        }


        var formData = $('#NewShippingAddress').serialize();

        $.ajax({
            url: 'remote.php',
            type: 'post',
            dataType: 'json',
            data: 'w=saveExpressCheckoutShippingAddress&' + formData + '&ShippingAddressType=' + addressType,
            success: MyCheckout.HandleResponse
        });
    },

    saveShippingProvider: function() {
        $.ajax({
            url: 'remote.php',
            type: 'post',
            dataType: 'json',
            data: 'w=saveExpressCheckoutShippingProvider&' + $('#ShippingProvider form').serialize(),
            success: MyCheckout.HandleResponse
        });
    },

    LoadPaymentForm: function(paymentPath, payment_provider) {

        $.ajax({
            url: 'remote.php',
            data: paymentPath + payment_provider,
            dataType: 'json',
            type: 'post',
            success: MyCheckout.HandleResponse
        });
    },

    validateEmailAddress: function(email) {
        if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            $('#FormField_1').css('border-color', 'red');
            return false;
        }

        return true;

    },

    validateShipping: function() {
        if (($('#ShippingAddressTypeExisting').attr('checked') == 'checked' && MyCheckout.signedIn == 1) || ($('#FormField_14').val().length > 0 && $('#FormField_15').val().length > 0 && $('#FormField_23').val().length > 0 &&  $('#FormField_20').val().length > 0 && $('#FormField_21').val().length > 0 && $('#FormField_22').val().length > 0 )) {
            return true;
        } else {
            return false;
        }
    },

    validateBilling: function() {
        if (MyCheckout.signedIn == 0) {
            if (!MyCheckout.validateEmailAddress($('#FormField_1').val())) {
                return false;
            }
        }
        if (($('#BillingAddressTypeExisting').attr('checked') == 'checked' && MyCheckout.signedIn == 1) || ($('#FormField_4').val().length > 0 && $('#FormField_5').val().length > 0 && $('#FormField_13').val().length > 0 &&  $('#FormField_10').val().length > 0 && $('#FormField_11').val().length > 0 && $('#FormField_12').val().length > 0 )) {
            if (MyCheckout.createAccount == 0 || ($('#FormField_2').val() == $('#FormField_3').val() && $('#FormField_3').val().length > 0)) {
                return true;
            } else {
                if ($('#FormField_3').val().length > 0 && $('#FormField_2').val().length > 0) {
                    alert('Your password fields must match.');
                    $('#FormField_3').focus();
                }
                return false;
            }
        } else {
            return false;
        }
    },

    validateCard: function() {
        var cardtype = MyCheckout.cardType;
        var nolength = cardtype == 'AMEX' ? 15 : 16;
        var cvvlength = cardtype == 'AMEX' ? 4 : 3;
        switch (cardtype) {
            case 'AMEX':
                var initial = '3';
                break;
            case 'DISCOVER':
                var initial = '6';
                break;
            case 'VISA':
                var initial = '4';
                break;
            case 'MC':
                var initial = '5';
                break;
            default:
                break;
        }

        if ($('#AuthorizeNet_ccexpm').val().length == 0 || $('#AuthorizeNet_ccexpm').val().length == 0) {
            alert('Please ensure you have valid information for Addresses, Shipping Method and Payment Provider');
            MyCheckout.submitting = 0;
            $('.CheckoutLink').prop('disabled', false);
            $('.CheckoutLink').val('Place My Order');
            return false;
        }
        if ($('#AuthorizeNet_ccno').val().length != nolength) {
            alert('Your card number should have ' + nolength + ' digits. Please correct it and try again.');
            MyCheckout.submitting = 0;
            $('.CheckoutLink').prop('disabled', false);
            $('.CheckoutLink').val('Place My Order');
            return false;
        }
        if ($('#AuthorizeNet_cccode').val().length != cvvlength) {
            alert('Your CVV should have ' + cvvlength + ' digits. Please correct it and try again.');
            MyCheckout.submitting = 0;
            $('.CheckoutLink').prop('disabled', false);
            $('.CheckoutLink').val('Place My Order');
            return false;
        }
        return true;
    },

    setCardType: function() {
        var cardNo = $('#AuthorizeNet_ccno').val();
        var initial = cardNo.charAt(0);
        switch (initial) {
            case '3':
                MyCheckout.cardType = 'AMEX';
                break;
            case '4':
                MyCheckout.cardType = 'VISA';
                break;
            case '5':
                MyCheckout.cardType = 'MC';
                break;
            case '6':
                MyCheckout.cardType = 'DISCOVER';
                break;
            default:
                break;
        }
    },

    selectCard: function(cardType) {

    },

    changePaymentProvider: function() {


        if ($('.payByStore #store_credit').parent().attr('class') == 'checked') {
            $('.CheckoutLink').val('Place My Order');
            $('.storecredito').show();
            $('.storecreditP').show();
            $('.creditTotal').show();
            $('.creditPrice').show();

        } else {

            $('.CheckoutLink').val('Place My Order');
            $('.storecredito').hide();
            $('.storecreditP').hide();
            $('.creditTotal').hide();
            $('.creditPrice').hide();

        }

        if ($(this).val() == MyCheckout.card_payment_provider && $('#store_credit').attr('checked') == 'checked') {
            paymentPath = 'w=expressCheckoutLoadPaymentForm&action=pay_for_order&store_credit=1&couponcode=&checkout_provider=';
            MyCheckout.payment_provider = MyCheckout.card_payment_provider;
            $('input#AgreeTermsAndConditions').parent().addClass('checked');
            $('input#join_order_list').parent().addClass('checked');
            $('#Visa').attr('class', '');
            $('#Amex').attr('class', '');
            $('#Mastercard').attr('class', '');
            $('#Discover').attr('class', '');
            $('#PaypalCard').attr('class', '');
            $('.paypalChose').hide();

            $('#PayPal').hide();
            $('#CCCheckoutForm').show();
            $('#CCForm').show();
            $('.CheckoutLink').val('Place My Order');
            $('.GrandTotal').show();
            $('.totalInfo').show();

        } else if ($(this).val() == MyCheckout.card_payment_provider && typeof $('#store_credit').attr('checked') == 'undefined') {
            paymentPath = 'w=expressCheckoutLoadPaymentForm&action=pay_for_order&store_credit=0&couponcode=&checkout_provider=';
            MyCheckout.payment_provider = MyCheckout.card_payment_provider;

            $('input#AgreeTermsAndConditions').parent().addClass('checked');
            $('input#join_order_list').parent().addClass('checked');
            $('#Visa').attr('class', '');
            $('#Amex').attr('class', '');
            $('#Mastercard').attr('class', '');
            $('#Discover').attr('class', '');
            $('#PaypalCard').attr('class', '');
            $('.paypalChose').hide();
            $('#CCCheckoutForm').show();
            $('#PayPal').hide();
            $('#CCForm').show();
            $('.CheckoutLink').val('Place My Order');

            $('.GrandTotal').show();
            $('.totalInfo').show();

        } else if ($(this).val() == "checkout_paypalexpress") {
            MyCheckout.payment_provider = MyCheckout.paypal_payment_provider;
            MyCheckout.ready = 0;
            $('#PaypalCard').attr('class', 'Cardactive');
            $('#Visa').attr('class', '');
            $('#Amex').attr('class', '');
            $('#Mastercard').attr('class', '');
            $('#Discover').attr('class', '');
            $('#PayPalCard').attr('class', '');
            $('.paypalChose').show();

            $('#PayPal').show();
            $('#CCCheckoutForm').hide();
            $('#CCForm').hide();
            $('.GrandTotal').show();
            $('.totalInfo').show();
            $('.CheckoutLink').val('Proceed to PayPal');
            $('#CheckoutMain').find('select:visible').each(function() {
                $(this).css('border', '');
            });
            $('#CheckoutMain').find('[aria-required="true"]:visible').each(function() {
                $(this).css('border', '');
            });

        } else {
            MyCheckout.payment_provider = "Non-Credit";
            $('.paypalChose').hide();
            $('#PayPal').hide();
            $('#CCCheckoutForm').hide();
            $('#CCForm').hide();
            $('#CCCheckoutForm').hide();
            $('.GrandTotal').show();
            $('.totalInfo').show();
            $('.CheckoutLink').val('Place My Order');
        }

    },

    setAddressListeners: function() {
        $('.AddBillingAddress input').live('change', MyCheckout.submitBilling);
  $('.AddBillingAddress select').live('change', MyCheckout.submitBilling);
        $('.AddBillingAddress input, .AddBillingAddress select').live('focus', MyCheckout.setShowRequiredBilling);

        $('#Shipping input').live('change', MyCheckout.submitShipping);
  $('#Shipping select').live('change', MyCheckout.submitShipping);
       $('#Shipping input, #Shipping select').live('focus', MyCheckout.setShowRequiredShipping);

    },

    setProviderListener: function() {
        $('.ShippingProviderList input').click(MyCheckout.saveShippingProvider);

    },

    setShowRequiredBilling: function() {
        $('#CheckoutMain').find('input, select').not('.AddBillingAddress input, .AddBillingAddress select').live('focus', MyCheckout.showRequiredBilling);

    },

    setShowRequiredShipping: function() {
        $('#CheckoutMain').find('input, select').not('#Shipping input, #Shipping select').live('focus', MyCheckout.showRequiredShipping);

    },

    showRequiredBilling: function() {
        $('.AddBillingAddress input[aria-required="true"], .AddBillingAddress select').each(function() {
            if ($(this).val().length == 0 || typeof($(this).val()) === 'undefined') {
                $(this).css('border-color', '#b20e29');
            } else {
                $(this).css('border-color', '#e3e3e3');
            }
        });
    },

    showRequiredShipping: function() {
        $('#Shipping input[aria-required="true"]').each(function() {
            if ($(this).val().length == 0 || typeof($(this).val()) === 'undefined') {
                $(this).css('border-color', '#b20e29');
            } else {
                $(this).css('border-color', '#e3e3e3');
            }
        });

        $(' #Shipping select').each(function() {
            if ($(this).val() == '' || typeof($(this).val()) === 'undefined') {
                $(this).css('border-color', '#b20e29');
            } else {
                $(this).css('border-color', '#e3e3e3');
            }
        });

    },

    submitShipping: function() {
        if (MyCheckout.validateShipping()) {
            MyCheckout.saveShippingAddress();
        }
    },

    submitBilling: function() {
        if (MyCheckout.validateBilling()) {
            MyCheckout.saveBillingAddress();
        }
    },


    checkout: function() {
try {
        sessionStorage.formType = MyCheckout.type;

}catch(error){ }
        if ($('.termbox').prop('checked') == true) {
            $('#AgreeTermsAndConditions').prop('checked', true);
        } else {
            $('#AgreeTermsAndConditions').prop('checked', false);

        }
        $('.CheckoutLink').prop('disabled', true);
        $('.CheckoutLink').val("Processing Order...");


        $('.Field400').val($('.comentField').val());
        if (MyCheckout.signedIn == 0) {
            var splitAddy = $('#NewBillingAddress').serialize().split('&');
            var forCreate = splitAddy[3] + "&" + splitAddy[4] + "&" + splitAddy[5] + "&" + splitAddy[6] + "&" + splitAddy[7] + "&" + splitAddy[8] + "&" + splitAddy[9] + "&" + splitAddy[10] + "&" + splitAddy[11] + "&" + splitAddy[12];
try{
            sessionStorage.useraddress = forCreate;
}catch(error){}
        }
        if (MyCheckout.payment_provider == 'checkout_paypalexpress' && $('#FormField_1').val() == '') {

            $('#PayPalSubmit').submit();
        } else {
            var alertCheck = 0;
            dofirst(alertCheck);
        }


        function dofirst() {

            $('#CheckoutMain').find('[aria-required="true"]:visible').each(function() {
                var checkValue = $(this).val();
                $(this).css('border-color', '#e3e3e3');
                if (typeof checkValue == "undefined" || checkValue == '') {
                    $(this).css('border-color', 'red');
                    alertCheck = 1;

                }
            });

            $('#CheckoutMain').find('select:visible').each(function() {
                var checkSelects = $(this).val();
                $(this).css('border', '1px solid #e3e3e3');
                if (typeof checkSelects == "undefined" || checkSelects == '') {
                    $(this).parent('.selector').css('border', '1px solid red');
                    alertCheck = 1;
                }
            });
            fireSecond(alertCheck);
        }

        function fireSecond(alertCheck) {
            if (MyCheckout.signedIn != 1) {
                if ($('#FormField_1').val().indexOf('@') == -1 || $('#FormField_1').val().indexOf('.') == -1) {
                    $('#FormField_1').css('border-color', 'red');
                }
            }
            if (alertCheck == 1) {
                alertCheck = 0;
                $('.CheckoutLink').prop('disabled', false);
                $('.CheckoutLink').val("Place My Order");
            } else {

            }
        }

        if (MyCheckout.completedSteps.length < 3 && MyCheckout.stepErrors.length == 0) {
            MyCheckout.submitBilling();

        }
        var i = 0;
        for (var step in MyCheckout.stepErrors) {
            if (MyCheckout.stepErrors.hasOwnProperty(step)) {
                alert(MyCheckout.stepErrors[step]);
                i++;
            }
            if (i > 0) {
                return;
            }
        }
        if (MyCheckout.completedSteps.length < 3 && MyCheckout.payment_provider != 'checkout_paypalexpress' && $('.CheckoutBorders #SideCartContents li:contains(Gift Certificate)').length == 0) {
            alert('Please ensure you have valid information for Email Address, Addresses, Shipping Method and Payment Provider');
            MyCheckout.submitting = 0;
            $('.CheckoutLink').prop('disabled', false);
            $('.CheckoutLink').val('Place My Order');
            return;
        }
        if (MyCheckout.payment_provider != MyCheckout.card_payment_provider && $('#FormField_1').val() != '') {
            $('#bottom_payment_button').click();
        } else if (MyCheckout.payment_provider == MyCheckout.card_payment_provider) {

        	  var checkCard = $('#AuthorizeNet_ccno').val().substring(0, 1);
                if (checkCard == '4') {
                    $('#Visa').attr('class', 'Cardactive');
                    $('#Amex').attr('class', '');
                    $('#Mastercard').attr('class', '');
                    $('#Discover').attr('class', '');
                    $('#PaypalCard').attr('class', '');
                    $('#creditcard_cctype').children('option[value="VISA"]').attr('selected', 'selected').click();
                }
                if (checkCard == '3') {
                    $('#Amex').attr('class', 'Cardactive');
                    $('#Visa').attr('class', '');
                    $('#Mastercard').attr('class', '');
                    $('#Discover').attr('class', '');
                    $('#PaypalCard').attr('class', '');
                    $('#creditcard_cctype').children('option[value="AMEX"]').attr('selected', 'selected').click();
                }
                if (checkCard == '5') {

                    $('#Mastercard').attr('class', 'Cardactive');
                    $('#Amex').attr('class', '');
                    $('#Visa').attr('class', '');
                    $('#Discover').attr('class', '');
                    $('#PaypalCard').attr('class', '');
                    $('#creditcard_cctype').children('option[value="MC"]').attr('selected', 'selected').click();

                }
                if (checkCard == '6') {
                    $('#Discover').attr('class', 'Cardactive');
                    $('#Amex').attr('class', '');
                    $('#Mastercard').attr('class', '');
                    $('#Visa').attr('class', '');
                    $('#PaypalCard').attr('class', '');
                    $('#creditcard_cctype').children('option[value="DISCOVER"]').attr('selected', 'selected').click();
                }

                if (MyCheckout.card_payment_provider == 'checkout_authorizenet') {
                    $('#AuthorizeNet_name').attr('name', 'AuthorizeNet_name');
                    $('#AuthorizeNet_ccno').attr('name', 'AuthorizeNet_ccno');
                    $('#AuthorizeNet_ccexpm').attr('name', 'AuthorizeNet_ccexpm');
                    $('#AuthorizeNet_ccexpy').attr('name', 'AuthorizeNet_ccexpy');
                    $('#AuthorizeNet_cccode').attr('name', 'AuthorizeNet_cccode');

                } else if (MyCheckout.card_payment_provider == 'checkout_payflowpro') {
                    $('#AuthorizeNet_name').attr('name', 'PayflowPro_name');
                    $('#AuthorizeNet_ccno').attr('name', 'PayflowPro_ccno');
                    $('#AuthorizeNet_ccexpm').attr('name', 'PayflowPro_ccexpm');
                    $('#AuthorizeNet_ccexpy').attr('name', 'PayflowPro_ccexpy');
                    $('#AuthorizeNet_cccode').attr('name', 'PayflowPro_cccode');
                } else {
                    $('#AuthorizeNet_name').attr('name', 'creditcard_name');
                    $('#AuthorizeNet_ccno').attr('name', 'creditcard_ccno');
                    $('#AuthorizeNet_ccexpm').attr('name', 'creditcard_ccexpm');
                    $('#AuthorizeNet_ccexpy').attr('name', 'creditcard_ccexpy');
                    $('#AuthorizeNet_cccode').attr('name', 'creditcard_cccvd');
                }
            if (MyCheckout.ready == 1) {

                if (MyCheckout.validateCard()) {
                $('#CheckoutMain').hide();
                $('.loadai').show();
                  setTimeout(function(){
                        $('#CCCheckoutForm')[0].submit();
             }, 1500);
                }
            } else {
                var grabComment = $('.Ccomments textarea').val();
                  var couponCode = $('#CouponCode').val().trim();
                if ($('.EmailForm span').attr('class') == 'checked') {
                    var isEmail = "on";
                } else {
                    var isEmail = "off";
                }
                if ($('#store_credit').parent().attr('class') == 'checked') {
                    var paymentPath = "w=expressCheckoutLoadPaymentForm&action=pay_for_order&store_credit=1&ordercomments=" + grabComment + "&join_mailing_list=" + isEmail + "&join_order_list=off&couponcode="+couponCode+"&checkout_provider=";
                } else {
                    var paymentPath = "w=expressCheckoutLoadPaymentForm&action=pay_for_order&store_credit=0&ordercomments=" + grabComment + "&join_mailing_list=" + isEmail + "&join_order_list=off&couponcode="+couponCode+"&checkout_provider=";
                }
                MyCheckout.submitting = 1;
                MyCheckout.LoadPaymentForm(paymentPath, MyCheckout.card_payment_provider);

            }
        }


    },

    applyCouponCode: function() {
        if ($('#CouponCode').val().length > 0) {
            if (MyCheckout.completedSteps.indexOf('BillingAddress') !== -1) {
                MyCheckout.submitCouponCode($('#CouponCode').val());
            } else {
                error = MyCheckout.stepErrors.BillingAddress ? MyCheckout.stepErrors.BillingAddress : (MyCheckout.stepErrors.ShippingAddress ? MyCheckout.stepErrors.ShippingAddress : '');
                alert('Please correct your billing and shipping addresses before applying your coupon code: ' + error);
            }
        } else {
            alert('Please enter a coupon code.');
        }
    },

    submitCouponCode: function(code) {
        MyCheckout.couponSubmit = 1;
        $.ajax({
            url: 'remote.php',
            data: 'w=getExpressCheckoutConfirmation&action=pay_for_order&ordercomments=&store_credit=0&couponcode=' + code,
            dataType: 'json',
            type: 'post',
            success: MyCheckout.HandleResponse
        });
    }
}



$(window).load(function() {





    setTimeout(function() {
        if ($('#CheckoutMain .payByStore #store_credit').parent().attr('class') === 'checked') {
            MyCheckout.payment_provider = "Non-Credit";
        }
    }, 1500);



  $('#SubmitCoupon').live('click', function() {
    var couponCode = $('#CouponCode').val().trim();
    setTimeout(function(){


       $.ajax({
            url: 'remote.php',
            data: 'w=getExpressCheckoutConfirmation&action=pay_for_order&ordercomments=&store_credit=0&couponcode=' + couponCode,
            dataType: 'json',
            type: 'post',
            success: ExpressCheckout.HandleResponse
        });
     }, 1000);
        setTimeout(function() {

            MyCheckout.submitBilling();

        }, 2000);

    });
    $('.isYou a').live('click', function(e) {
        e.preventDefault();
        $.get('/login.php?action=logout', function(data) {});
        setTimeout(function() {
            window.location.reload();
        }, 1000);
    });

    if ($('#sel_billing_address option').length == 0 && MyCheckout.signedIn == 1) {
        $('#CheckoutMain .AccountLogins').hide();
    }
    setTimeout(function() {
        if ($('#sel_billing_address option').length > 0 && MyCheckout.signedIn == 1) {
            MyCheckout.submitBilling();


        }
    }, 2000);
    $("dt[style='']").hide();
    if ($('#altPay').parent().attr('class') == 'checked') {
        $('.storecreditP, .storecredito, .creditTotal, .creditPrice').hide();
    }


    $('.CheckoutColumn:nth-child(2) .remainingMethods input').live('click', function() {
        var thisPayment = $(this).val();
        $('.OrderContents #credit_provider_list').find('input[value="' + thisPayment + '"]').click();
        $('.OrderContents #provider_list span').removeClass('checked');
        $('.CheckoutColumn:nth-child(2) .alternateMethods span').removeClass('checked');
    });
    $('.CheckoutColumn:nth-child(2) .alternateMethods input').live('click', function() {
        var thisPayment = $(this).val();
        var thisLabel = $(this).parent().parent().next().text().trim();

        if (thisLabel.indexOf('Credit Card') == -1) {
            $('.OrderContents #provider_list').find('input[value="' + thisPayment + '"]').click();
            $('.OrderContents #credit_provider_list span').removeClass('checked');
            $('.CheckoutColumn:nth-child(2) .remainingMethods span').removeClass('checked');
        }
        if ($('.CheckoutColumn:nth-child(2) .alternateMethods:contains("Credit Card")').find('.radio:first-child input').parent().attr('class') == 'checked') {
            $('#CCForm').show();
        }

    });

    $('.CheckoutColumn:nth-child(2) #altPay').live('click', function() {
        $('.OrderContents label:contains(" Pay using an alternative payment method") input').click();
        $('.alternateMethods').show();
        $('.remainingMethods').hide();
        $('.OrderContents label:contains(" Pay using an alternative payment method") span').removeClass('checked');
        $('.CheckoutColumn:nth-child(2) .alternateMethods span').removeClass('checked');
        MyCheckout.submitBilling();
        MyCheckout.submitShipping();
        MyCheckout.saveShippingProvider();
    });

    $('.CheckoutColumn:nth-child(2) #store_credit').live('click', function() {
        $('.OrderContents label:contains(" Pay using my store credit") input').click();
        if ($('p:contains("Pay the remaining")').text().indexOf('%') != -1 || $('.totalInfo .ProductPrice').text().trim() == '') {
            $('.remainingMethods').hide();
        } else {
            $('.remainingMethods').show();

        }
        MyCheckout.submitBilling();
        MyCheckout.submitShipping();
        MyCheckout.saveShippingProvider();
        $('#provider_list').show();
        $('.alternateMethods').hide();
        $('.OrderContents label:contains(" Pay using my store credit") span').removeClass('checked');
        $('.CheckoutColumn:nth-child(2) .remainingMethods span').removeClass('checked');

    });


    $('.termText').html($('.Field400').html());
    $('.termsy p').live('click', function() {
        $('.termText').slideToggle();

    });

    $('.termbox').live('click', function() {
        $('input#AgreeTermsAndConditions').click();
    });
    $('.EmailForm input').live('click', function() {
        $('input#join_mailing_list').click();
    });

    $('.shippingButton, .billingButton ').hide();
    $('#uniform-ship_to_billing_new, #uniform-ship_to_billing_existing').live('click', function() {
        $('#Shipping').toggle();
        $('#Shipping').prev().toggle();
    });
var mil=["09004","09005","09006","09007","09008","09009","09010","09033","09034","09038","09042","09046","09049","09051","09067","09068","09069","09075","09079","09081","09086","09100","09102","09103","09104","09107","09112","09114","09002","09003","09011","09012","09013","09014","09020","09021","09028","09053","09054","09055","09058","09059","09060","09063","09088","09090","09092","09094","09095","09096","09099","09123","09126","09128","09131","09136","09137","09138","09177","09180","09186","09201","09211","09213","09214","09263","09264","09265","09267","09301","09302","09305","09139","09140","09142","09143","09154","09172","09173","09226","09227","09229","09237","09245","09250","09261","09306","09307","09308","09309","09310","09311","09313","09314","09319","09320","09327","09328","09330","09337","09354","09355","09356","09357","09360","09363","09364","09373","09374","09378","09380","09382","09383","09384","09447","09454","09459","09461","09463","09464","09468","09469","09470","09494","09496","09498","09501","09502","09338","09340","09343","09347","09348","09352","09353","09365","09366","09367","09368","09369","09370","09372","09387","09393","09394","09397","09399","09403","09421","09503","09504","09505","09506","09507","09508","09509","09510","09511","09513","09517","09524","09532","09534","09564","09565","09566","09567","09568","09569","09570","09581","09582","09586","09587","09588","09589","09590","09605","09606","09607","09608","09609","09610","09611","09543","09545","09549","09550","09554","09556","09557","09573","09574","09575","09576","09577","09578","09579","09591","09593","09594","09599","09602","09603","09604","09613","09617","09618","09620","09621","09622","09623","09636","09642","09643","09645","09647","09648","09649","09708","09709","09710","09711","09713","09714","09715","09723","09724","09726","09727","09728","09729","09730","09738","09739","09741","09742","09743","09744","09745","09624","09625","09626","09627","09630","09631","09633","09701","09702","09703","09704","09705","09706","09707","09716","09717","09718","09719","09720","09721","09722","09731","09732","09733","09734","09735","09736","09737","09747","09748","09749","09750","09751","09752","09757","09801","09803","09804","09805","09806","09807","09809","09817","09818","09820","09821","09822","09823","09824","09832","09833","09834","09835","09836","09837","09838","09758","09759","09762","09769","09777","09780","09798","09810","09811","09812","09813","09814","09815","09816","09825","09826","09827","09828","09829","09830","09831","09839","09840","09841","09842","09844","09845","09865","09868","09870","09871","09872","09873","09874","09875","09876","09880","09890","09892","09898","09846","09848","09852","09853","09855","09858","09859"];
    $("#FormField_13").live('keyup', function() {
        if ($("#FormField_13").val().length >= 5) {
            setTimeout(function() {
                var zip = $("#FormField_13").val();
                        var stringZip = zip.toString();
                if($.inArray(stringZip, mil) >=0) {
                    return;
                } else {
                var lat;
                var lng;
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    'address': zip
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        geocoder.geocode({
                            'latLng': results[0].geometry.location
                        }, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[1]) {
                                    var loc = getCityState(results);
                                }
                            }
                        });
                    }
                });

                function getCityState(results) {
                    var a = results[0].address_components;
                    var city, state, country;
                    for (i = 0; i < a.length; ++i) {
                        var t = a[i].types;
                        if (compIsType(t, 'country'))
                            country = a[i].long_name;
                        if (compIsType(t, 'administrative_area_level_1'))
                            state = a[i].long_name;
                        else if (compIsType(t, 'locality'))
                            city = a[i].long_name;
                    }

                    $("#FormField_11").val(country).prop('selected', true);
                    $("#FormField_11").change();
                    $("#FormField_10").val(city);
                    setTimeout(function() {

                        $("#FormField_12").val(state).prop('selected', true);
                        $("#FormField_12").change();

                    }, 1500);
                }

                function compIsType(t, s) {
                    for (z = 0; z < t.length; ++z)
                        if (t[z] == s)
                            return true;
                    return false;
                }
            }
            }, 1300);
        }


    });
    $("#FormField_23").live('keyup', function() {
        if ($("#FormField_23").val().length >= 5) {
            setTimeout(function() {
                var zip = $("#FormField_23").val();
                        var stringZip = zip.toString();
                if($.inArray(stringZip, mil) >=0) {
                    return;
                } else {
                var lat;
                var lng;
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    'address': zip
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        geocoder.geocode({
                            'latLng': results[0].geometry.location
                        }, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[1]) {
                                    var loc = getCityState(results);
                                }
                            }
                        });
                    }
                });

                function getCityState(results) {
                    var a = results[0].address_components;
                    var city, state, country;
                    for (i = 0; i < a.length; ++i) {
                        var t = a[i].types;
                        if (compIsType(t, 'country'))
                            country = a[i].long_name;
                        if (compIsType(t, 'administrative_area_level_1'))
                            state = a[i].long_name;
                        else if (compIsType(t, 'locality'))
                            city = a[i].long_name;
                    }
                    $("#FormField_21").val(country).prop('selected', true);
                    $("#FormField_21").change();
                    $("#FormField_20").val(city);
                    setTimeout(function() {

                        $("#FormField_22").val(state).prop('selected', true);
                        $("#FormField_22").change();
                    }, 1500);
                }

                function compIsType(t, s) {
                    for (z = 0; z < t.length; ++z)
                        if (t[z] == s)
                            return true;
                    return false;
                }
            }
            }, 1300);
        }
    });
    $('.promoShow').click(function() {

        $('.AddCheckoutPromo').toggle();
    });
    $('#loginCheck').click(function() {
        $('#CheckoutMain #LoginForm').toggle();

    });
    $('#guestCheck').click(function() {
        $('#CheckoutMain #LoginForm').hide();
    });

    $('#AuthorizeNet_ccno').live('keyup', function(event) {
        var card = $(this).val();
        var firstNumber = card.substr(0, 1);
        switch (firstNumber) {
            case '':
                $('#Visa').attr('class', '');
                $('#Amex').attr('class', '');
                $('#Mastercard').attr('class', '');
                $('#Discover').attr('class', '');
                $('#PaypalCard').attr('class', '');
                break;
            case '4':
                $('#Visa').attr('class', 'Cardactive');
                $('#Amex').attr('class', '');
                $('#Mastercard').attr('class', '');
                $('#Discover').attr('class', '');
                $('#PaypalCard').attr('class', '');
                $('#creditcard_cctype').children('option[value="VISA"]').attr('selected', 'selected').click();
                break;
            case '3':
                $('#Amex').attr('class', 'Cardactive');
                $('#Visa').attr('class', '');
                $('#Mastercard').attr('class', '');
                $('#Discover').attr('class', '');
                $('#PaypalCard').attr('class', '');
                $('#creditcard_cctype').children('option[value="AMEX"]').attr('selected', 'selected').click();
                break;
            case '5':
                $('#Mastercard').attr('class', 'Cardactive');
                $('#Amex').attr('class', '');
                $('#Visa').attr('class', '');
                $('#Discover').attr('class', '');
                $('#PaypalCard').attr('class', '');
                $('#creditcard_cctype').children('option[value="MC"]').attr('selected', 'selected').click();
                break;
            case '6':
                $('#Discover').attr('class', 'Cardactive');
                $('#Amex').attr('class', '');
                $('#Mastercard').attr('class', '');
                $('#Visa').attr('class', '');
                $('#PaypalCard').attr('class', '');
                $('#creditcard_cctype').children('option[value="DISCOVER"]').attr('selected', 'selected').click();
                break;
        }

    });

    if ($(window).width() <= 480) {

        $('#CVVHelp img').parent().css('display', 'none', 'important');
        $('#CVVHelp').click(function() {
            alert('For Visa, MasterCard and Discover use the last three digits (far right) on your signature strip. For American Express card use the four digit code located on the front of the card. CVV code is required.');
        });
    }



});