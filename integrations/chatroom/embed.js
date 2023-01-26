(function() {
  document.addEventListener("DOMContentLoaded", function(event) {
    if (typeof (document.getElementsByTagName("minnit-chat")) !== 'undefined' && document.getElementsByTagName("minnit-chat") !== null && typeof (document.getElementsByTagName("minnit-chat")[0]) !== 'undefined' && document.getElementsByTagName("minnit-chat")[0] !== null) {
      document.querySelectorAll('minnit-chat').forEach((MinnitChatTag) => {
        var thisTagChatName = MinnitChatTag.getAttribute('data-chatname'); var thisStyleTag = MinnitChatTag.getAttribute('data-style'); if (thisTagChatName.indexOf('/') == -1) { thisTagChatName = 'https://minnit.chat/' + thisTagChatName }
        thisTagChatName = thisTagChatName.split(' ').join('').split('<').join('').split('"').join('').split("'").join('')
        var urlparams = ''
        if (thisTagChatName.indexOf('?') > -1) {
          urlparams = thisTagChatName.split('?')[1]
          thisTagChatName = thisTagChatName.split('?')[0]
        }
        if (thisStyleTag == null) { thisStyleTag = 'width:90%;height:500' }
        var newEmbedKey = Math.floor(Math.random() * 10000000) + 1; MinnitChatTag.innerHTML = '<iframe src="' + thisTagChatName + '?embed&' + urlparams + '&nec=' + newEmbedKey + '" data-nec="' + newEmbedKey + '" style="border:none;' + thisStyleTag + '" class="minnit-chat-iframe" allowTransparency="true"></iframe>';
      });
    }
  }); function createMinnitCookie(name, value, hours) { var expires; if (hours) { var date = new Date(); date.setTime(date.getTime() + (hours * 60 * 60 * 1000)); expires = "; expires=" + date.toGMTString(); } else expires = ""; document.cookie = name + "=" + value + expires + "; path=/; SameSite=None; Secure"; }
  function getMinnitCookie(cname) {
    var name = cname + "="; var decodedCookie = decodeURIComponent(document.cookie); var ca = decodedCookie.split(';'); for (var i = 0; i < ca.length; i++) {
      var c = ca[i]; while (c.charAt(0) == ' ') { c = c.substring(1); }
      if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
    }
    return "";
  }
  function localStorageSupported() {
    try { if (typeof (localStorage) == 'object') { localStorage.getItem("test"); return true; } } catch (e) { return false; }
    return false;
  }
  function createMinnitLocalStorage(name, value, orgid) { name = "minnit" + orgid + "_" + name; if (localStorageSupported()) { localStorage.setItem(name, value); } else { createMinnitCookie(name, value); } }
  function deleteMinnitLocalStorage(name, orgid) { name = "minnit" + orgid + "_" + name; if (localStorageSupported()) { localStorage.removeItem(name); } else { createMinnitCookie(name, "", -1); } }
  function getMinnitLocalStorage(name, orgid) { name = "minnit" + orgid + "_" + name; if (localStorageSupported()) { return localStorage.getItem(name); } else { return getMinnitCookie(name); } }
  window.addEventListener("message", function(event) {
    if (typeof (event) !== 'undefined' && event !== null && typeof (event.data) !== 'undefined' && event.data !== null && event.data.indexOf('"minnitnec"') > -1) {
      try {
        var eventObj = JSON.parse(event.data); if (!(eventObj.hasOwnProperty('orgid') && eventObj.orgid)) { return }
        document.querySelectorAll('iframe').forEach((thisEmbed) => {
          if (typeof (thisEmbed.dataset) !== 'undefined' && thisEmbed.dataset.hasOwnProperty('nec') && thisEmbed.dataset.nec == eventObj.minnitnec) {
            if (getMinnitLocalStorage("rauthv", "") != null || getMinnitLocalStorage("gauthv", "") != null) { createMinnitLocalStorage("rauthv", getMinnitLocalStorage("rauthv", ""), eventObj.orgid); deleteMinnitLocalStorage("rauthv", ""); createMinnitLocalStorage("gauthv", getMinnitLocalStorage("gauthv", ""), eventObj.orgid); deleteMinnitLocalStorage("gauthv", ""); createMinnitLocalStorage("gsto", getMinnitLocalStorage("gsto", ""), eventObj.orgid); deleteMinnitLocalStorage("gsto", ""); createMinnitLocalStorage("sto", getMinnitLocalStorage("sto", ""), eventObj.orgid); deleteMinnitLocalStorage("sto", ""); createMinnitLocalStorage("nickname", getMinnitLocalStorage("nickname", ""), eventObj.orgid); deleteMinnitLocalStorage("nickname", ""); createMinnitLocalStorage("guestid", getMinnitLocalStorage("guestid", ""), eventObj.orgid); deleteMinnitLocalStorage("guestid", ""); }
            switch (eventObj.request) {
              case "getsigninvars": var postMessageData = { 'minnitnec': eventObj.minnitnec, 'signinvars': true }
                if (getMinnitLocalStorage("rauthv", eventObj.orgid) != null && getMinnitLocalStorage("rauthv", eventObj.orgid).length > 6) { postMessageData.rauthv = getMinnitLocalStorage('rauthv', eventObj.orgid); postMessageData.sto = getMinnitLocalStorage('sto', eventObj.orgid); } else { postMessageData.gauthv = getMinnitLocalStorage('gauthv', eventObj.orgid); postMessageData.gsto = getMinnitLocalStorage('gsto', eventObj.orgid); if (getMinnitLocalStorage('nickname', eventObj.orgid) !== null) { postMessageData.nickname = getMinnitLocalStorage('nickname', eventObj.orgid); } }
                postMessageData.guestid = getMinnitLocalStorage('guestid', eventObj.orgid); thisEmbed.contentWindow.postMessage(JSON.stringify(postMessageData), '*'); break; case "setcookie": createMinnitLocalStorage(eventObj.cookiename, eventObj.cookievalue, eventObj.orgid); break; case "getcookie": thisEmbed.contentWindow.postMessage('{"minnitnec": ' + eventObj.minnitnec + ', "cookiename": "' + eventObj.cookiename + '", "cookievalue": "' + getMinnitLocalStorage(eventObj.cookiename) + '"}', '*'); break; case "setguest": createMinnitLocalStorage("gsto", eventObj.gsto, eventObj.orgid); createMinnitLocalStorage("gauthv", eventObj.gauthv, eventObj.orgid); if (eventObj.hasOwnProperty('guestid')) { createMinnitLocalStorage("guestid", eventObj.guestid, eventObj.orgid); }
                break; case "logout": deleteMinnitLocalStorage("gsto", eventObj.orgid); deleteMinnitLocalStorage("sto", eventObj.orgid); deleteMinnitLocalStorage("gauthv", eventObj.orgid); deleteMinnitLocalStorage("rauthv", eventObj.orgid); deleteMinnitLocalStorage("guestid", eventObj.orgid); deleteMinnitLocalStorage("nickname", eventObj.orgid); break;
            }
          }
        });
      } catch (err) { }
    }
  });
}())