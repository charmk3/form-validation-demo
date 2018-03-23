"use strict";

var utilities = (function () {
    var module = {};

    module = {
        forEach: forEach,
        filter: filter,
        map: map,
        reduce: reduce,
        bindEvent: bindEvent,
        getSession: getSession,
        relocate: relocate,
        getUrlParams: getUrlParams,
        setUrlParams: setUrlParams,
        getLanguage: getLanguage,
        setLanguage: setLanguage,
        trimInput: trimInput,
        getOffsetTop: getOffsetTop,
        scrollTo: scrollTo,
        classMod: {
            add: addClass,
            remove: removeClass,
            toggle: toggleClass,
            has: hasClass
        }
    };

    function forEach (list, callback) {
        if(list.forEach) {
            list.forEach(callback);
        } else {
            if(list.length){
                for(var i = 0; i < list.length; i++) {
                    callback(list[i]);
                }
            } else {
                console.error("not an array-like object");
                console.log(list);
            }
        }
    }

    function map (list, callback) {
        var newArr = [];

        if(list.map) {

            return list.map(callback);
        } else {
            if(list.length) {
                for(var i = 0; i < list.length; i++) {
                    newArr[i] = callback(list[i]);
                }

                return newArr;
            } else {
                console.error("not an array-like object");
                console.log(list);
            }
        }
    }

    function filter (list, callback) {
        var newList = [];

        if(list.filter) {
            newList = list.filter(callback);
        } else {
            if(list.length){
                for(var i = 0; i < list.length; i++) {
                    if(callback(list[i])) {
                        newList.push(list[i]);
                    } 
                }
            } else {
                console.error("not an array-like object");
                console.log(list);
            }
        }

        return newList;
    }

    function reduce (list, callback, acc) {
        var val;

        if(list.reduce) {
            val = list.reduce(callback);
        } else {
            if(list.length) {
                if(acc) {
                    val = acc;
                    for(var i = 0; i < list.length; i++) {
                        val = callback(val, list[i]);
                    }
                } else {
                    for(var i = 0; i < list.length - 1; i++) {
                        val = callback(list[i], list[i + 1]);
                    }
                }

            } else {
                console.error("not an array-like object");
                console.log(list);
            }
        }

        return val;
    }

    function bindEvent (element, event, callback) {
        if(typeof callback != "function") {
            console.error("callback type error");
        } else {
            if(element.addEventListener) {
                element.addEventListener(event, callback);
            } else {
                element.attachEvent("on" + event, callback);
            }
        }
    }

    function getSession () {
        var cookies = [],
            session = {};

        cookies = document.cookie.split("; ");
        utilities.forEach(cookies, function (cookie) {
            var key = cookie.split("=")[0],
                value = cookie.split("=")[1];

            if(key == "PHPSESSID") {
                session[key] = value;
            }
        });

        return session;
    }

    function addClass (element, name) {
        var className = "",
            classList = "";

        if(element.className == undefined) {
            console.error("element does not have class name attribute");
            console.log(element);
        } else {
            className = element.className;
            classList = className.split(" ");
            if(element.classList) {
                element.classList.add(name);
            } else {
                if(classList.indexOf(name) == -1) {
                    classList.push(name);
                    element.className = classList.join(" ");   
                }
            }
        }
    }

    function removeClass (element, name) {
        var className = "",
            classList = "";

        if(element.className == undefined) {
            console.error("element does not have class name attribute");
            console.log(element);
        } else {
            className = element.className;
            classList = className.split(" ");
            if(element.classList) {
                element.classList.remove(name);
            } else {
                classList = filter(classList, function (item) {
                    if(item == name) {

                        return false;
                    }

                    return true;
                });
                element.className = classList.join(" ");
            }
        }
    }

    function toggleClass (element, name) {
        var className = "",
            classList = "";

        if(element.className == undefined) {
            console.error("element does not have class name attribute");
            console.log(element);
        } else {
            className = element.className;
            classList = className.split(" ");
            if(element.classList) {
                element.classList.toggle(name);
            } else {
                if(classList.indexOf(name) != -1) {
                    removeClass(element, name);
                } else {
                    addClass(element, name);
                }
            }
        }
    }

    function hasClass (element, name) {
        var className = "",
            classList = "";

        if(element.className == undefined) {
            console.error("element does not have class name attribute");
            console.log(element);
        } else {
            className = element.className;
            classList = className.split(" ");
            if(element.classList) {
                return element.classList.contains(name);
            } else {
                for(var i = 0; i < classList.length; i++) {
                    if(classList[i] == name) {

                        return true;
                    }
                }

                return false;
            }
        }
    }

    function relocate (dir) {
        var currentUrl = "",
            baseUrl = "",
            targetUrl = "",
            entryPoint = "";

        currentUrl = window.location.href;
        entryPoint = "index.php";
        baseUrl = getBaseUrl(currentUrl);
        targetUrl = baseUrl + "/" + dir;
        window.location = targetUrl;

        function getBaseUrl(url) {
            var pathArr = [],
                newArr = [];

            pathArr = url.split("/");
            for(var i = 0; i < pathArr.length; i++) {
                newArr.push(pathArr[i]);
                if(pathArr[i] == entryPoint) {
                    break;
                }
            }

            return newArr.join("/");
        }

    }

    //remove white space from input field
    function trimInput () {
        var origin = "",
            result = "";

        origin = this.value;
        if(origin.search(/\s/) != -1) {
            result = origin.replace(/\s/, "");
            this.value = result;
        }
    }

    function getUrlParams () {
        var paramString = "",
            params = [];

        paramString = window.location.search.replace("?", "");
        if(paramString) {
            if(paramString.indexOf("&") != -1) {
                params = paramString.split("&");
            } else if(paramString.indexOf(";") != -1) {
                params = paramString.split(";");
            } else {
                params.push(paramString);
            }

            return params;
        }

        return undefined;
    }

    function setUrlParams (string) {
        window.location.href = window.location.href.split("?")[0] + "?" + string;
    }

    function getLanguage (div) {
        var language = "";

        if(div) {
            language = div.getAttribute("data-lang");
        } else {
            language = "zh-cn";
        }

        return language;
    }

    function setLanguage (language) {
        var params = getUrlParams(),
            paramPairs = [],
            urlParams = [],
            paramString = "";

        if(params) {
            paramPairs = map(params, function (param) {
                return param.split("=");
            });

            forEach(paramPairs, function (paramPair) {
                if(paramPair[0] == "lang") {
                    paramPair[1] = language;
                }
            });
            urlParams = map(paramPairs, function (paramPair) {
                return paramPair.join("=");
            });
        } else {
            urlParams = ["lang=" + language];
        }
        paramString = urlParams.join("&");

        setUrlParams(paramString);
    }

    function getOffsetTop (element) {
        var offsetTop = 0;
        
        do {
            if(!isNaN(element.offsetTop)) {
                offsetTop += element.offsetTop;
            }
        } while (element = element.offsetParent);

        return offsetTop;
    }

    function scrollTo (element, divider) {
        var offsetTop = getOffsetTop(element),
            windowSize = window.innerHeight;

        window.scrollTo(0, offsetTop - windowSize / divider);
    }

    return module;
})();
var languagePack = {
    "zh-cn" : {
        "language" : "中文",
        "emptyAccount" : "请填写用户名",
        "accountTooShort" : "用户名不能小于6位",
        "accountInvalid" : "用户名只能包含字母或数字",
        "emptyPassword" : "请填写密码",
        "passwordTooShort" : "密码不能小于6位",
        "differentPassword" : "两次填写的密码不一致",
        "emptyPaymentPassword" : "请填写支付密码",
        "paymentPasswordTooShort" : "支付密码不能少于6位",
        "differentPaymentPassword" : "两次填写的支付密码不一致",
        "idCodeTooShort" : "身份证号必须为18位",
        "idCodeInvalid" : "身份证号码格式错误",
        "emptyCaptcha" : "请填写验证码",
        "captchaTooShort" : "验证码必须为4位",
        "emptyName" : "请填写姓名",
        "unknownError" : "未知错误"
    },
    "en-us" : {
        "language" : "English",
        "emptyAccount" : "Pleas type in account",
        "accountTooShort" : "Account must be longer than 6",
        "accountInvalid" : "Account can only have letters and numbers",
        "emptyPassword" : "Please type in password",
        "passwordTooShort" : "Password must be longer than 6",
        "differentPassword" : "Repeated password is different from original",
        "emptyPaymentPassword" : "Please type in trader password",
        "paymentPasswordTooShort" : "Trader password must be longer than 6",
        "differentPaymentPassword" : "Repeated trader password is different from original",
        "idCodeTooShort" : "Id number must be 18 digits",
        "idCodeInvalid" : "Invalid id number",
        "emptyCaptcha" : "Pleast type in captcha",
        "captchaTooShort" : "Captcha must be 4 digits",
        "emptyName" : "Pleast type in name",
        "unknownError" : "Unknown error"
    }
}