export function createDomElement(type, isDisplay, id, innerHtml, doc) {
  const dom = document.createElement(type);
  if (!isDisplay) {
    dom.style.display = "none"
  }
  dom.id = id

  dom.innerHTML = innerHtml
  doc.appendChild(dom)
}


export function checkAccessRoute() {
  if (!sessionStorage.getItem("userId")) {
    window.location.href = 'https://gatheringmoss.art/artworks/plastic-sarira/';
  } else {
    createDomElement("div", false, "userId", sessionStorage.getItem("userId"), document.body)
    createDomElement("div", false, "userName", sessionStorage.getItem("userName"), document.body)
  }
}

export function reloadCss() {
  let links = document.getElementsByTagName("link");
  for (var cl in links) {
    var link = links[cl];
    if (link.rel === "stylesheet")
      link.href += "";
  }
}

export function moveToTopWindow() {
  let input = document.querySelector("input")
  input.addEventListener("input", (event) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }, true)
}

// https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
export function readTextFile(file, callback, thisObj) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        // .call 붙인 이유 - class에서 사용하는 this.를 콜백에선 다른 것으로 인식. 
        // 때문에 this가 나타내는 객체를 지정해줌.
        // class에서 사용하지 않을 경우 null
          callback.call(thisObj, rawFile.responseText);
      }
  }
  rawFile.send(null);
}