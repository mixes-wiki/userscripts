function waitForKeyElements(e,t,n,a){var r,o;r="undefined"==typeof a?$(e):$(a).contents().find(e),r&&r.length>0?(o=!0,r.each(function(){var e=$(this),n=e.data("alreadyFound")||!1;if(!n){var a=t(e);a?o=!1:e.data("alreadyFound",!0)}})):o=!1;var l=waitForKeyElements.controlObj||{},i=e.replace(/[^\w]/g,"_"),d=l[i];o&&n&&d?(clearInterval(d),delete l[i]):d||(d=setInterval(function(){waitForKeyElements(e,t,n,a)},300),l[i]=d),waitForKeyElements.controlObj=l}