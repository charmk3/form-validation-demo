'use strict';

utilities.bindEvent(window, 'load', initHeader);
utilities.bindEvent(window, 'load', utilities.detectBrowser);

function initHeader() {
  var languageDiv = {},
    currentLanguage = '',
    dropDownButton = {},
    dropDownPanel = {},
    dropDownList = [];

  languageDiv = document.querySelector('#lang');
  currentLanguage = utilities.getLanguage(languageDiv);
  dropDownButton = document.querySelectorAll('.dropdown-button')[0];
  dropDownPanel = document.querySelectorAll('.dropdown-panel')[0];
  dropDownList = document.querySelectorAll('.language-selector li');
  showLanguage(currentLanguage);
  hideDropDownPanel();
  utilities.forEach(dropDownList, function bindClickEvent(item) {
    utilities.bindEvent(item, 'click', function setNewLanguage() {
      var language = '';

      language = this.getAttribute('data-lang');
      utilities.setLanguage(language);
    });
  });
  utilities.bindEvent(dropDownButton, 'mouseenter', showDropDownPanel);
  utilities.bindEvent(dropDownPanel, 'mouseout', hideDropDownPanel);

  function showLanguage(language) {
    utilities.forEach(dropDownList, function(item) {
      if (item.getAttribute('data-lang') == language) {
        utilities.classMod.add(item, 'hide');
      } else {
        utilities.classMod.remove(item, 'hide');
      }
    });
  }

  function showDropDownPanel() {
    utilities.classMod.remove(dropDownPanel, 'hide');
  }

  function hideDropDownPanel() {
    utilities.classMod.add(dropDownPanel, 'hide');
  }
}
