'use strict';

function detectBrowser() {
  var body = document.getElementsByTagName('body')[0];

  if (!Array.prototype.indexOf) {
    body.innerHTML = '<p class="warning">Please use IE9+ Browser!</p>';
    throw new Error("Browser requirment didn't met!");
  }
}

var utilities = (function() {
  var module = {};

  module = {
    forEach: forEach,
    filter: filter,
    map: map,
    reduce: reduce,
    bindEvent: bindEvent,
    unbindEvent: unbindEvent,
    getSession: getSession,
    relocate: relocate,
    getUrlParams: getUrlParams,
    setUrlParams: setUrlParams,
    getLanguage: getLanguage,
    setLanguage: setLanguage,
    trimInput: trimInput,
    getOffsetTop: getOffsetTop,
    generateScrollBar: generateScrollBar,
    scrollTo: scrollTo,
    classMod: {
      add: addClass,
      remove: removeClass,
      toggle: toggleClass,
      has: hasClass
    },
    detectBrowser: detectBrowser
  };

  function forEach(list, callback) {
    if (list.forEach) {
      list.forEach(callback);
    } else {
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i]);
        }
      } else {
        console.error('not an array-like object');
        console.log(list);
      }
    }
  }

  function map(list, callback) {
    var newArr = [];

    if (list.map) {
      return list.map(callback);
    } else {
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          newArr[i] = callback(list[i]);
        }

        return newArr;
      } else {
        console.error('not an array-like object');
        console.log(list);
      }
    }
  }

  function filter(list, callback) {
    var newList = [];

    if (list.filter) {
      newList = list.filter(callback);
    } else {
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          if (callback(list[i])) {
            newList.push(list[i]);
          }
        }
      } else {
        console.error('not an array-like object');
        console.log(list);
      }
    }

    return newList;
  }

  function reduce(list, callback, acc) {
    var val;

    if (list.reduce) {
      val = list.reduce(callback);
    } else {
      if (list.length) {
        if (acc) {
          val = acc;
          for (var i = 0; i < list.length; i++) {
            val = callback(val, list[i]);
          }
        } else {
          for (var i = 0; i < list.length - 1; i++) {
            val = callback(list[i], list[i + 1]);
          }
        }
      } else {
        console.error('not an array-like object');
        console.log(list);
      }
    }

    return val;
  }

  function bindEvent(element, event, callback) {
    if (typeof callback != 'function') {
      console.error('callback type error');
    } else {
      if (element.addEventListener) {
        element.addEventListener(event, callback);
      } else {
        element.attachEvent('on' + event, callback);
      }
    }
  }

  function unbindEvent(element, event, callback) {
    if (typeof callback != 'function') {
      console.error('callback type error');
    } else {
      if (element.removeEventListener) {
        element.removeEventListener(event, callback);
      } else {
        element.detachEvent('on' + event, callback);
      }
    }
  }

  function getSession() {
    var cookies = [],
      session = {};

    cookies = document.cookie.split('; ');
    utilities.forEach(cookies, function(cookie) {
      var key = cookie.split('=')[0],
        value = cookie.split('=')[1];

      if (key == 'PHPSESSID') {
        session[key] = value;
      }
    });

    return session;
  }

  function addClass(element, name) {
    var className = '',
      classList = '';

    if (element.className == undefined) {
      console.error('element does not have class name attribute');
      console.log(element);
    } else {
      className = element.className;
      classList = className.split(' ');
      if (element.classList) {
        element.classList.add(name);
      } else {
        if (classList.indexOf(name) == -1) {
          classList.push(name);
          element.className = classList.join(' ');
        }
      }
    }
  }

  function removeClass(element, name) {
    var className = '',
      classList = '';

    if (element.className == undefined) {
      console.error('element does not have class name attribute');
      console.log(element);
    } else {
      className = element.className;
      classList = className.split(' ');
      if (element.classList) {
        element.classList.remove(name);
      } else {
        classList = filter(classList, function(item) {
          if (item == name) {
            return false;
          }

          return true;
        });
        element.className = classList.join(' ');
      }
    }
  }

  function toggleClass(element, name) {
    var className = '',
      classList = '';

    if (element.className == undefined) {
      console.error('element does not have class name attribute');
      console.log(element);
    } else {
      className = element.className;
      classList = className.split(' ');
      if (element.classList) {
        element.classList.toggle(name);
      } else {
        if (classList.indexOf(name) != -1) {
          removeClass(element, name);
        } else {
          addClass(element, name);
        }
      }
    }
  }

  function hasClass(element, name) {
    var className = '',
      classList = '';

    if (element.className == undefined) {
      console.error('element does not have class name attribute');
      console.log(element);
    } else {
      className = element.className;
      classList = className.split(' ');
      if (element.classList) {
        return element.classList.contains(name);
      } else {
        for (var i = 0; i < classList.length; i++) {
          if (classList[i] == name) {
            return true;
          }
        }

        return false;
      }
    }
  }

  function relocate(dir) {
    var currentUrl = '',
      baseUrl = '',
      targetUrl = '',
      entryPoint = '';

    currentUrl = window.location.href;
    entryPoint = 'index.php';
    baseUrl = getBaseUrl(currentUrl);
    targetUrl = baseUrl + '/' + dir;
    window.location = targetUrl;

    function getBaseUrl(url) {
      var pathArr = [],
        newArr = [];

      pathArr = url.split('/');
      for (var i = 0; i < pathArr.length; i++) {
        newArr.push(pathArr[i]);
        if (pathArr[i] == entryPoint) {
          break;
        }
      }

      return newArr.join('/');
    }
  }

  //remove white space from input field
  function trimInput() {
    var origin = '',
      result = '';

    origin = this.value;
    if (origin.search(/\s/) != -1) {
      result = origin.replace(/\s/, '');
      this.value = result;
    }
  }

  function getUrlParams() {
    var paramString = '',
      params = [];

    paramString = window.location.search.replace('?', '');
    if (paramString) {
      if (paramString.indexOf('&') != -1) {
        params = paramString.split('&');
      } else if (paramString.indexOf(';') != -1) {
        params = paramString.split(';');
      } else {
        params.push(paramString);
      }

      return params;
    }

    return undefined;
  }

  function setUrlParams(string) {
    window.location.href = window.location.href.split('?')[0] + '?' + string;
  }

  function getLanguage(div) {
    var language = '';

    if (div) {
      language = div.getAttribute('data-lang');
    } else {
      language = 'zh-cn';
    }

    return language;
  }

  function setLanguage(language) {
    var params = getUrlParams(),
      paramPairs = [],
      urlParams = [],
      paramString = '';

    if (params) {
      paramPairs = map(params, function(param) {
        return param.split('=');
      });

      forEach(paramPairs, function(paramPair) {
        if (paramPair[0] == 'lang') {
          paramPair[1] = language;
        }
      });
      urlParams = map(paramPairs, function(paramPair) {
        return paramPair.join('=');
      });
    } else {
      urlParams = ['lang=' + language];
    }
    paramString = urlParams.join('&');

    setUrlParams(paramString);
  }

  function getOffsetTop(element) {
    var offsetTop = 0;

    do {
      if (!isNaN(element.offsetTop)) {
        offsetTop += element.offsetTop;
      }
    } while ((element = element.offsetParent));

    return offsetTop;
  }

  function scrollTo(element, divider) {
    var offsetTop = getOffsetTop(element),
      windowSize = window.innerHeight;

    window.scrollTo(0, offsetTop - windowSize / divider);
  }

  function generateScrollBar(element) {
    var scrollBar = {},
      scrollBarTrack = {},
      thumb = {},
      elementHeight = 0,
      offsetTop = 0,
      contentHeight = 0,
      scrollBarHeight = 0,
      scrollBarStyleHeight = '',
      scrollBarTop = 0,
      scrollBarStyleTop = '',
      scrollTop = 0,
      thumbHeight = 0,
      thumbStyleHeight = '',
      thumbStyleTop = '';

    offsetTop = utilities.getOffsetTop(element);
    scrollBar = document.createElement('div');
    addClass(scrollBar, 'scroll-bar');
    scrollBarTrack = document.createElement('div');
    addClass(scrollBarTrack, 'scroll-bar-track');
    thumb = document.createElement('div');
    addClass(thumb, 'scroll-bar-thumb');
    scrollBarTrack.appendChild(thumb);
    scrollBar.appendChild(scrollBarTrack);
    element.parentElement.appendChild(scrollBar);

    // init scroll bar
    scrollBarHeight = elementHeight = element.clientHeight;
    scrollBarStyleHeight = 'height: ' + scrollBarHeight + 'px;';
    scrollBarTop = element.offsetTop;
    scrollBarStyleTop = 'top: ' + scrollBarTop + 'px;';
    scrollBar.setAttribute('style', scrollBarStyleTop + scrollBarStyleHeight);

    // init thumbnail
    contentHeight = element.scrollHeight;
    thumbHeight = elementHeight * scrollBarHeight / contentHeight;
    thumbStyleHeight = 'height: ' + thumbHeight + 'px;';
    thumb.setAttribute('style', thumbStyleHeight);

    utilities.bindEvent(element, 'scroll', function moveThumb() {
      scrollTop = element.scrollTop * scrollBarHeight / contentHeight;
      thumbStyleTop = 'top: ' + scrollTop + 'px;';
      if (scrollTop + thumbHeight >= scrollBarHeight) {
        scrollTop = scrollBarHeight - thumbHeight;
      }
      thumb.setAttribute('style', thumbStyleHeight + thumbStyleTop);
    });
    utilities.bindEvent(element, 'wheel', function wheelRoll(event) {
      var speed = 0;

      speed = event.deltaY / 5;
      scrollTop = element.scrollTop * scrollBarHeight / contentHeight;
      scrollTop += speed;
      if (scrollTop + thumbHeight >= scrollBarHeight) {
        scrollTop = scrollBarHeight - thumbHeight;
      } else if (scrollTop < 0) {
        scrollTop = 0;
      }
      thumbStyleTop = thumbStyleTop = 'top: ' + scrollTop + 'px;';
      thumb.setAttribute('style', thumbStyleHeight + thumbStyleTop);
      element.scrollTop = scrollTop * contentHeight / scrollBarHeight;
      event.preventDefault();
    });
    utilities.bindEvent(thumb, 'mousedown', function drag(event) {
      utilities.bindEvent(window, 'mousemove', dragScrollThumb);
    });
    utilities.bindEvent(window, 'mouseup', function drag(event) {
      utilities.unbindEvent(window, 'mousemove', dragScrollThumb);
    });

    function dragScrollThumb(event) {
      var scrollTop = 0;

      scrollTop =
        event.clientY - thumbHeight / 2 - (offsetTop - window.scrollY);
      if (scrollTop < 0) {
        scrollTop = 0;
      } else if (scrollTop > scrollBarHeight - thumbHeight) {
        scrollTop = scrollBarHeight - thumbHeight;
      }
      thumbStyleTop = 'top: ' + scrollTop + 'px;';
      thumb.setAttribute('style', thumbStyleHeight + thumbStyleTop);
      element.scrollTop = scrollTop * contentHeight / scrollBarHeight;
    }
  }

  return module;
})();
