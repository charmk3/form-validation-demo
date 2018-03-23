"use strict";
(function wrapper () {
    
    utilities.bindEvent(window, "load", initSignup);

    function initSignup () {
        var validater = {},
            languageDiv = {},
            currentLanguage = "";
        
        validater = {
            name : checkName,
            account : checkAccount,
            password : checkPassword,
            password_repeat : checkRepeatPassword,
            payment_password : checkPassword,
            payment_password_repeat : checkRepeatPassword,
            id_code : checkIdCode,
            referee : checkAccount,
            developer : checkAccount
        };
        languageDiv = document.querySelector("#lang");
        currentLanguage = utilities.getLanguage(languageDiv);
        utilities.bindEvent(document, "keyup", function (e) {
            if(e.keyCode == 13) {
                submit();
            }
            e.preventDefault();
        });

        (function inputTrim () {
            var textFields = [],
                emailField = {},
                cellPhoneField = {};

            textFields = document.querySelectorAll("input[type=text]");
            emailField = document.querySelector("#email");
            cellPhoneField = document.querySelector("#cell_phone");
            utilities.forEach(textFields, function (field) {
                utilities.bindEvent(field, "input", utilities.trimInput);
            });
            utilities.bindEvent(emailField, "input", utilities.trimInput);
            utilities.bindEvent(cellPhoneField, "input", utilities.trimInput);
        })();

        (function consumerGraphicBinding () {
            var graphics = [];

            graphics = document.querySelectorAll(".consumer .graphic");
            utilities.forEach(graphics, bindClickEvent);

            function bindClickEvent (element) {
                utilities.bindEvent(element, "click", highLight);
            }

            function highLight () {
                utilities.forEach(graphics, removeHighLight);
                utilities.classMod.add(this, "highlight");
            }

            function removeHighLight (element) {
                utilities.classMod.remove(element, "highlight");
            }
        })();

        (function validaterBinding () {
            var requiredFields = [],
                inputs = [];
            
            requiredFields = document.querySelectorAll("li.required");
            inputs = utilities.map(requiredFields, getInput);
            utilities.forEach(inputs, function bindEvents (input) {
                var type = "";

                type = input.getAttribute("id");
                if(validater[type]) {
                    utilities.bindEvent(input, "blur", validater[type]);
                    utilities.bindEvent(input, "focus", clear);
                }
            });
        })();

        (function dateInputBinding () {
            var birthday = {},
                currentDate = new Date(),
                currentYear = "";

            birthday = document.querySelector("#birthday");
            currentYear = currentDate.getFullYear();
            $(birthday).datepicker({
                changeYear: true,
                changeMonth: true,
                yearRange: "1970:" + currentYear,
            });
        })();

        (function submitBingding () {
            var submitButton = {};

            submitButton = document.querySelectorAll(".submit button")[0];
            utilities.bindEvent(submitButton, "click", submit);
        })();

        (function passwordStrengthBinding () {
            var password = {},
                paymentPassword = {};

            password = document.querySelector("#password");
            paymentPassword = document.querySelector("#payment_password");
            utilities.bindEvent(password, "input", validater["password"]);
            utilities.bindEvent(paymentPassword, "input", validater["password"]);
        })();

        function getInput (element) {
            return element.querySelectorAll("input")[0];
        }

        function checkName () {
            var input = {},
                value = "",
                errorField = {};
            
            input = this,
            value = input.value,
            errorField = getErrorField(input);
            if(!value) {
                errorField.textContent = languagePack[currentLanguage]["emptyName"];
                utilities.classMod.add(input, "invalid");

                return false;
            } else {
                clear.call(input);

                return true;
            }
        }

        function checkAccount () {
            var input = {},
                value = "",
                errorField = {};
            
            input = this;
            value = input.value;
            errorField = getErrorField(input);
            if(!value) {
                errorField.textContent = languagePack[currentLanguage]["emptyAccount"];
                utilities.classMod.add(input, "invalid");

                return false;
            } else if(value.length < 6) {
                errorField.textContent = languagePack[currentLanguage]["accountTooShort"];
                utilities.classMod.add(input, "invalid");

                return false;
            } else if(value.search(/[^a-zA-Z0-9]/) != -1) {
                errorField.textContent = languagePack[currentLanguage]["accountInvalid"];
                utilities.classMod.add(input, "invalid");

                return false;
            } else {
                clear.call(input);

                return true;
            }
        }

        function checkPassword (event) {
            var input = {},
                type = "",
                value = "",
                errorField = {},
                passwordStrength = {},
                strengthLevels = [],
                charTypes = 0,
                letters = /[a-zA-Z]+/,
                numbers = /\d+/,
                specialChars = /[^a-zA-Z0-9]+/;

            input = this;
            type = input.getAttribute("id");
            value = input.value;
            errorField = getErrorField(input);
            passwordStrength = input.parentElement.querySelectorAll("div.strength")[0];
            strengthLevels = passwordStrength.querySelectorAll("ul li");
            clear.call(input);
            utilities.classMod.add(passwordStrength, "hide");
            
            if(value.search(letters) != -1) {
                charTypes++;
            }
            if(value.search(numbers) != -1) {
                charTypes++;
            }
            if(value.search(specialChars) != -1) {
                charTypes++;
            }
            return doCheck(type);
            

            function doCheck (type) {
                if(!value) {                
                    if(type == "password") {
                        errorField.textContent = languagePack[currentLanguage]["emptyPassword"];
                    } else if(type = "payment_password") {
                        errorField.textContent = languagePack[currentLanguage]["emptyPaymentPassword"];
                    }
                    utilities.classMod.add(input, "invalid");
                    
                    return false;
                } else if (value.length < 6) {
                    if(event && event.type == "blur") {
                        if(type = "password") {
                            errorField.textContent = languagePack[currentLanguage]["passwordTooShort"];
                        } else if(type = "payment_password") {
                            errorField.textContent = languagePack[currentLanguage]["paymentPasswordTooShort"];
                        }
                        utilities.classMod.add(input, "invalid");
                    }

                    return false;
                } else if (value.length >= 6 && charTypes < 2) {
                    setStrength("weak");
                    if(event && event.type == "blur") {
                        clear.call(input);
                    }
                } else if (value.length > 6 && charTypes < 3) {
                    setStrength("normal");
                    if(event && event.type == "blur") {
                        clear.call(input);
                    }
                } else if(value.length > 6) {
                    setStrength("strong");
                    if(event && event.type == "blur") {
                        clear.call(input);
                    }
                }

                return true;
            }

            function setStrength (strength) {
                strengthLevels.forEach(function removeHighLight (element) {
                    utilities.classMod.remove(element, "active");
                });
                utilities.classMod.add(passwordStrength.getElementsByClassName(strength)[0], "active");
                utilities.classMod.remove(passwordStrength, "hide");
            }
        }

        function checkRepeatPassword () {
            var input = {},
                type = "",
                password = "",
                repeatPassword = "",
                errorField = {};

            input = this;
            type = input.getAttribute("id");
            password = document.getElementById(type.slice(0, -7)).value;
            repeatPassword = input.value,
            errorField = getErrorField(input);
            if(type == "password_repeat") {
                if(password !== repeatPassword) {
                    errorField.textContent = languagePack[currentLanguage]["differentPassword"];
                    utilities.classMod.add(input, "invalid");
                    
                    return false;
                }
            } else if(type == "payment_password_repeat") {
                if(password !== repeatPassword) {
                    errorField.textContent = languagePack[currentLanguage]["differentPaymentPassword"];
                    utilities.classMod.add(input, "invalid");
                    
                    return false;
                }
            }
            clear.call(input);

            return true;        
        }

        function checkIdCode () {
            var input = {},
                value = "",
                errorField = {};

            input = this;
            value = input.value;
            errorField = getErrorField(input);
            if(value.length != 18) {
                errorField.textContent = languagePack[currentLanguage]["idCodeTooShort"];
                utilities.classMod.add(input, "invalid");
                
                return false;
            }
            if(value.search(/\d{17}[\dX]{1}/) == -1) {
                errorField.textContent = languagePack[currentLanguage]["idCodeInvalid"];
                utilities.classMod.add(input, "invalid");
                
                return false;
            }
            clear.call(input);

            return true;
        }

        function showError (event) {
            console.error(event.message);
        }

        function getErrorField (element) {

            return element.parentElement.querySelectorAll(".error-tip")[0];
        }

        function showErrorMsg (field, text) {
            var errorField = {};

            errorField = getErrorField(field);
            utilities.classMod.add(field, "invalid");
            errorField.textContent = text;
        }

        function clear () {
            var input = {},
                errorField = {},
                strengthField = {};


            input = this;
            errorField = getErrorField(input);
            strengthField = input.parentElement.querySelectorAll("div.strength")[0];
            errorField.textContent = "";
            utilities.classMod.remove(input, "invalid");
            if(strengthField) {
                utilities.classMod.add(strengthField, "hide");
            }
        }

        function submit () {
            var data = {},
                ajaxRequest = new XMLHttpRequest(),
                inputs = [],
                nameField = {},
                accountField = {},
                passwordField = {},
                passwordRepeatField = {},
                paymentPasswordField = {},
                paymentPasswordRepeatField = {},
                idCodeField = {},
                refereeField = {},
                developerField = {},
                developPointField = {},
                submitButton = {};


            inputs = document.querySelectorAll("form input");
            nameField = document.querySelector("#name");
            accountField = document.querySelector("#account");
            passwordField = document.querySelector("#password");
            passwordRepeatField = document.querySelector("#password_repeat");
            paymentPasswordField = document.querySelector("#payment_password");
            paymentPasswordRepeatField = document.querySelector("#payment_password_repeat");
            idCodeField = document.querySelector("#id_code");
            refereeField = document.querySelector("#referee");
            developerField = document.querySelector("#developer");
            developPointField = document.querySelector("#develop_point");
            submitButton = document.querySelectorAll(".submit button")[0];

            if(validate()) {
                submitButton.setAttribute("disabled", "disabled");
                utilities.forEach(inputs, function parseData (field) {
                    var key = "",
                        value = "",
                        type = "";

                    key = field.getAttribute("name");
                    value = field.value;
                    type = field.type;
                    if(key == "payment-code-repeat" || key == "password-repeat") {

                        return;
                    }
                    if(type == "password") {
                        
                        return data[key] = md5(value);
                    }
                    if(type == "radio") {
                        if(field.getAttribute("checked") == "checked") {
                        
                            return data[key] = value;
                        }

                        return;
                    }

                    return data[key] = value;
                });

                utilities.bindEvent(ajaxRequest, "readystatechange", function () {
                    var responseCode = "",
                        msg = "";

                    if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                        responseCode = JSON.parse(ajaxRequest.responseText)["status"];
                        msg = JSON.parse(ajaxRequest.responseText)["msg"];

                        if(responseCode == "000") {
                            utilities.relocate("admin/home/index");
                        }
                        else if(responseCode == "003") {
                            showErrorMsg(nameField, msg);
                            utilities.scrollTo(nameField, 5);
                            submitButton.removeAttribute("disabled");
                        } else if(responseCode == "0012" || responseCode == "0013") {
                            showErrorMsg(accountField, msg);
                            utilities.scrollTo(accountField, 5);
                            submitButton.removeAttribute("disabled");
                        } else if(responseCode == "004" || responseCode == "005") {
                            showErrorMsg(passwordField, msg);
                            utilities.scrollTo(passwordField, 5);
                            submitButton.removeAttribute("disabled");
                        } else if(responseCode == "006") {
                            showErrorMsg(passwordRepeatField, msg);
                            utilities.scrollTo(passwordRepeatField, 5);
                            submitButton.removeAttribute("disabled");
                        } else if(responseCode == "007" || responseCode == "008") {
                            showErrorMsg(paymentPasswordField, msg);
                            utilities.scrollTo(paymentPasswordField, 5);
                            submitButton.removeAttribute("disabled");
                        } else if(responseCode == "009") {
                            showErrorMsg(paymentPasswordRepeatField, msg);
                            utilities.scrollTo(paymentPasswordRepeatField, 5);
                            submitButton.removeAttribute("disabled");
                        } else if(responseCode == "0010") {
                            showErrorMsg(idCodeField, msg);
                            utilities.scrollTo(idCodeField, 5);
                            submitButton.removeAttribute("disabled");
                        } else if(responseCode == "0011" || responseCode == "0014") {
                            showErrorMsg(refereeField, msg);
                            utilities.scrollTo(refereeField, 5);
                            submitButton.removeAttribute("disabled");
                        } else if(responseCode == "0012" || responseCode == "0015") {
                            showErrorMsg(developerField, msg);
                            utilities.scrollTo(developerField, 5);
                            submitButton.removeAttribute("disabled");
                        } else if(responseCode == "0016") {
                            showErrorMsg(developPointField, msg);
                            utilities.scrollTo(developPointField, 5);
                            submitButton.removeAttribute("disabled");
                        } else {
                            console.log(request.responseText);
                            submitButton.removeAttribute("disabled");
                        }
                    }
                });
                utilities.bindEvent(ajaxRequest, "error", showError);
                ajaxRequest.responseType = "text";
                ajaxRequest.open("POST", "/admin/public/index.php/admin/Buy/signup", true);
                ajaxRequest.setRequestHeader("Content-Type", "application/json");
                ajaxRequest.send(JSON.stringify(data));
            }

            function validate () {
                var requiredFields = [],
                    inputs = [],
                    validities = [],
                    isValid = false;

                requiredFields = document.querySelectorAll("li.required");
                inputs = utilities.map(requiredFields, getInput);
                validities = utilities.map(inputs, function check (input) {
                    var type = "";

                    type = input.getAttribute("id");
                    if(validater[type]) {

                        return validater[type].call(input);
                    }

                    return true;
                });
                for(var i = 0; i < validities.length; i++) {
                    if(validities[i] == false) {
                        utilities.scrollTo(inputs[i], 5);
                        isValid = false;
                        break;
                    }
                    isValid = true;
                }
                
                return isValid;
            }
        }
    }
})();