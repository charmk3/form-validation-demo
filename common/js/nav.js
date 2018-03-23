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