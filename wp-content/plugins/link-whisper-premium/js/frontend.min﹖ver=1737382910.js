"use strict";function wpil_link_clicked(e){var i=this,n="",t=!1,a="",r=["img","svg"];if(!(1!=e.which&&0!=e.button&&2!=e.which&&4!=e.button||i.length<1||"1"===wpilFrontend.disableClicks||void 0===this.href||"#"===i.getAttribute("href")||(function e(i){if(i.children.length>0)for(var o in i.children){var d=i.children[o];if(void 0!==d.children&&d.children.length>0&&""===n&&e(d),1===d.nodeType&&-1!==r.indexOf(d.nodeName.toLowerCase())&&""===a){t=!0;var l=void 0!==d.title?d.title:"";void 0!==l&&(a=l.trim())}n=n.trim(),a=void 0!==a?a.trim():""}void 0!==i.outerText&&(n=i.outerText)}(i),""===n&&t?n=""!==a?wpilFrontend.clicksI18n.imageText+a:wpilFrontend.clicksI18n.imageNoText:""!==n||t||(n=wpilFrontend.clicksI18n.noText),"0"===wpilFrontend.trackAllElementClicks&&hasParentElements(i,"header, footer, nav, [id~=header], [id~=menu], [id~=footer], [id~=widget], [id~=comment], [class~=header], [class~=menu], [class~=footer], [class~=widget], [class~=comment], #wpadminbar")))){var o=getLinkLocation(i);makeAjaxCall({action:"wpil_link_clicked",post_id:wpilFrontend.postId,post_type:wpilFrontend.postType,link_url:i.getAttribute("href"),link_anchor:n,link_location:o,monitor_id:i.getAttribute("data-wpil-monitor-id")})}}[].forEach.call(document.querySelectorAll("a"),(function(e){e.addEventListener("click",wpil_link_clicked),e.addEventListener("auxclick",wpil_link_clicked)})),window.addEventListener("load",(function(){setTimeout(openLinksInNewTab,150)}));var newTabTries=0;function openLinksInNewTab(){if(newTabTries++,"undefined"==typeof wpilFrontend)return newTabTries>10?void 0:void setTimeout(openLinksInNewTab,1e3);"undefined"==typeof wpilFrontend||0==wpilFrontend.openLinksWithJS||0==wpilFrontend.openExternalInNewTab&&0==wpilFrontend.openInternalInNewTab||[].forEach.call(document.querySelectorAll("a"),(function(e){if(!hasParentElements(e,"header, footer, nav, [id~=header], [id~=menu], [id~=footer], [id~=widget], [id~=comment], [class~=header], [class~=menu], [class~=footer], [class~=widget], [class~=comment], #wpadminbar")&&e.href&&!e.target&&-1===e.href.indexOf(window.location.href)){var i=new URL(e.href),n=window.location.hostname===i.hostname;(n&&parseInt(wpilFrontend.openInternalInNewTab)||!n&&parseInt(wpilFrontend.openExternalInNewTab))&&e.setAttribute("target","_blank")}}))}function hasParentElements(e,i=""){var n=!!e&&e.tagName.toLowerCase();if(!e||"body"===n||"main"===n||"article"===n)return!1;"string"==typeof i&&(i=i.split(","));var t=!1;for(var a in i){var r=i[a];if(-1!==r.indexOf("id~=")){var o=r.replace(/\[id~=|\]/g,"").trim();if(void 0!==e.id&&""!==e.id&&-1!==e.id.indexOf(o)){t=!0;break}}else if(-1!==r.indexOf("class~=")){o=r.replace(/\[class~=|\]/g,"").trim();if(void 0!==e.classList&&""!==e.className&&-1!==e.className.indexOf(o)){t=!0;break}}else if(-1!==r.indexOf("#")){o=r.replace(/#/g,"").trim();if(void 0!==e.id&&""!==e.id&&o===e.id){t=!0;break}}else if(!r.match(/[^a-zA-Z]/)){o=r.trim();if(e.tagName.toLowerCase()===o){t=!0;break}}}return!!t||""!==e.parentNode&&hasParentElements(e.parentNode,i)}function makeAjaxCall(e={}){window.jQuery?callWithJquery(e):callWithVanilla(e)}function callWithJquery(e={}){jQuery.ajax({type:"POST",url:wpilFrontend.ajaxUrl,data:e,success:function(e){}})}function callWithVanilla(e={}){!async function(e,i){var n=wpilFrontend.ajaxUrl,t=new XMLHttpRequest,a=[];for(var r in e)a.push(encodeURIComponent(r)+"="+encodeURIComponent(e[r]));a=a.join("&"),t.open("POST",n),t.setRequestHeader("Content-type","application/x-www-form-urlencoded"),t.send(a)}(e)}function getLinkLocation(e){var i="Body Content",n={Search:["search","[id~=search]","[class~=search]"],Header:["header","[id~=header]","[class~=header]"],"Comment Section":["[id~=comment]","[class~=comment]"],Footer:["footer","[id~=footer]","[class~=footer]"],Menu:["[id~=menu]","[class~=menu]"],Navigation:["nav"],Sidebar:["sidebar","[id~=sidebar]","[class~=sidebar]","[id~=widget]","[class~=widget]"],"Body Content":["main","article","[class~=main]"]};if(!e||"body"===e.tagName.toLowerCase())return i;var t=!1;e:for(var a in n){var r=n[a];for(var o in r){var d=r[o];if(-1!==d.indexOf("id~=")){var l=d.replace(/\[id~=|\]/g,"").trim();if(void 0!==e.id&&""!==e.id&&-1!==e.id.indexOf(l)){t=!0,i=a;break e}}else if(-1!==d.indexOf("class~=")){l=d.replace(/\[class~=|\]/g,"").trim();if(void 0!==e.classList&&""!==e.className&&-1!==e.className.indexOf(l)){t=!0,i=a;break e}}else if(-1!==d.indexOf("#")){l=d.replace(/#/g,"").trim();if(void 0!==e.id&&""!==e.id&&l===e.id){t=!0,i=a;break e}}else if(!d.match(/[^a-zA-Z]/)){l=d.trim();if(e.tagName.toLowerCase()===l){t=!0,i=a;break e}}}}return t?i:""!==e.parentNode&&getLinkLocation(e.parentNode)}