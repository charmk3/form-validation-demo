"use strict";

utilities.bindEvent(window, "load", initHeader);

function initHeader () {
    var languageDiv = {},
        currentLanguage = "",
        dropDownButton = {},
        dropDownPanel = {},
        dropDownList = [];

    languageDiv = document.querySelector("#lang");
    currentLanguage = utilities.getLanguage(languageDiv);
    dropDownButton = document.querySelectorAll(".dropdown-button")[0];
    dropDownPanel = document.querySelectorAll(".dropdown-panel")[0];
    dropDownList = document.querySelectorAll(".language-selector li");
    showLanguage(currentLanguage);
    hideDropDownPanel();
    utilities.forEach(dropDownList, function bindClickEvent (item) {
        utilities.bindEvent(item, "click", function setNewLanguage() {
            var language = "";

            language = this.getAttribute("data-lang");
            utilities.setLanguage(language);
        });
    });
    utilities.bindEvent(dropDownButton, "mouseenter", showDropDownPanel);
    utilities.bindEvent(dropDownPanel, "mouseout", hideDropDownPanel);

    function showLanguage (language) {
        utilities.forEach(dropDownList, function (item) {
            if(item.getAttribute("data-lang") == language) {
                utilities.classMod.add(item, "hide");
            } else {
                utilities.classMod.remove(item, "hide");
            }
        });
    }

    function showDropDownPanel () {
        utilities.classMod.remove(dropDownPanel, "hide");
    }

    function hideDropDownPanel () {
        utilities.classMod.add(dropDownPanel, "hide");
    }
}
utilities.bindEvent(window, "load", initNav);

function initNav () {
    var pageUrl = "",
        urlArray = [],
        activeSubNav = "",
        activeNav = "",
        activeSubNav = "",
        navs = [],
        subNavs = [];

    pageUrl = window.location.pathname;
    urlArray = pageUrl.split("/");
    activeSubNav = urlArray[urlArray.length - 1];
    activeNav = urlArray[urlArray.length - 2];
    activeSubNav = activeSubNav.split(".")[0];
    navs = document.querySelectorAll(".main-nav li");
    subNavs = document.querySelectorAll(".sub-nav ul");
    utilities.forEach(navs, function (element) {
        if(utilities.classMod.has(element, activeNav)) {

            return utilities.classMod.add(element, "selected");
        }

        return utilities.classMod.remove(element, "selected");
    });
    utilities.forEach(subNavs, function (element) {
        var subNavElements = element.querySelectorAll("li");

        utilities.forEach(subNavElements, function(element) {
            if(utilities.classMod.has(element, activeSubNav)) {
                return utilities.classMod.add(element, "selected");
            }

            return utilities.classMod.remove(element, "selected");
        });

        if(utilities.classMod.has(element, activeNav)) {
            return utilities.classMod.remove(element, "hide");
        }

        return utilities.classMod.add(element, "hide");
    });
}