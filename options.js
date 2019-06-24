document.getElementById("browse-image").addEventListener("click", function()
{
  document.getElementById("image").click();
});

document.getElementById("image").addEventListener("change", function(eve)
{
  var file = eve.target.files[0];
  var reader = new FileReader();

  reader.onload = (function(file) {
    return function(e) {
      document.getElementById("image-preview").src = e.target.result;
    }
  })(file);
  reader.readAsDataURL(file);
});

function getSettingsFromDOM() {
  var header = document.getElementById("image-preview").src;
  var headerheight = document.getElementById("header-height").value;
  
  var colorbg = document.getElementById("colorbg").value;
  var colorfg = document.getElementById("colorfg").value;
  var colorhi = document.getElementById("colorhi").value;

  var links = [];
  [].forEach.call(document.getElementById("links").children, function(link)
  {
    if (link.tagName == "H2")
      return;
    if (link.children[1].value.length == 0)
      return;
    if (link.children[2].value.length == 0)
      return;
    links.push([link.children[1].value, link.children[2].value, link.children[3].value]);
  });

  return {
    header,
    headerheight,
    links,
    colorbg,
    colorfg,
    colorhi
  };
}

function setSettingsInDOM(items) {
  document.getElementById("image-preview").src = items.header;
  document.getElementById("header-height").value = items.headerheight;
  
  document.getElementById("colorbg").value = items.colorbg;
  document.getElementById("colorfg").value = items.colorfg;
  document.getElementById("colorhi").value = items.colorhi;
  
  var container = document.getElementById("links");
  while (container.lastChild.tagName !== "H2") {
    container.removeChild(container.lastChild);
  }
  [].forEach.call(items.links, function(link)
  {
    addlink(link[0], link[1], link[2]);
  });
}

function displayStatus(message, timeout) {
  var status = document.getElementById('status');
  status.textContent = message;
  setTimeout(function() {
    status.textContent = '';
  }, timeout || 750);
}

document.getElementById("save").addEventListener("click", function()
{
  chrome.storage.local.set(getSettingsFromDOM(), function() {
    displayStatus(chrome.i18n.getMessage('saved'));
  });
});

var dragSource = null;
function handleDragStart(eve) {
  dragSource = this.parentElement;
  dragSource.classList.add('drag');
  eve.dataTransfer.effectAllowed = 'move';
}
function handleDragOver(eve) {
  eve.preventDefault();
  eve.dataTransfer.dropEffect = 'move';
  return false;
}
function handleDragEnter(eve) {
  this.parentElement.classList.add('over');
}
function handleDragLeave(eve) {
  this.parentElement.classList.remove('over');
}
function handleDrop(eve) {
  eve.stopPropagation();
  if (dragSource != this.parentElement) {
    document.getElementById("links").insertBefore(dragSource, this.parentElement.nextSibling);
  }

  return false;
}
function handleDragEnd(eve) {
  [].forEach.call(document.querySelectorAll(".link"), function (link) {
    link.classList.remove('over');
    link.classList.remove('drag');
  });
}

function addlink(name, href, color)
{
  var div = document.createElement('div');
  div.className = "merged link";
  document.getElementById("links").appendChild(div);

  var dragbox = document.createElement('div');
  dragbox.draggable = true;
  dragbox.addEventListener("dragstart", handleDragStart);
  dragbox.addEventListener("dragover",  handleDragOver);
  dragbox.addEventListener("dragenter", handleDragEnter);
  dragbox.addEventListener("dragleave", handleDragLeave);
  dragbox.addEventListener("dragend",   handleDragEnd);
  dragbox.addEventListener("drop",      handleDrop);
  div.appendChild(dragbox);

  var nameinput = document.createElement('input');
  nameinput.type = 'text';
  nameinput.value = name;
  div.appendChild(nameinput);

  var hrefinput = document.createElement('input');
  hrefinput.type = 'url';
  hrefinput.value = href;
  hrefinput.className = "merged-main";
  div.appendChild(hrefinput);

  var colorinput = document.createElement('input');
  colorinput.type = 'color';
  colorinput.value = color;
  div.appendChild(colorinput);
}

document.getElementById("addlink").addEventListener("click", function()
{
  addlink("", "")
});

document.getElementById("import").addEventListener("change", function(e)
{
  if (e.target.files !== null && e.target.files[0] !== null) {
    var reader = new FileReader();
    reader.onload = function (reEvt) {
      try {
        var imported = JSON.parse(reEvt.target.result);
        var desiredKeys = ["header", "headerheight", "colorbg", "colorfg", "colorhi", "links"];
        desiredKeys.forEach(function (key) {
          if (imported[key] === undefined) {
            throw new Error("Missing key " + key);
          }
        });
        setSettingsInDOM(imported);
        document.getElementById("save").click();
      } catch (er) {
        displayStatus(er.message, 2000);
      }
    }
    reader.readAsText(e.target.files[0])
    e.target.value = ""; // reset the file input
  }
});

document.getElementById("export").addEventListener("click", function()
{
  var toExport = getSettingsFromDOM();
  var data = JSON.stringify(toExport);
  var blob = new Blob([data], {type: 'text/json'});
  var a = document.createElement("a");
  a.download = "nice tab page settings.json";
  a.href = URL.createObjectURL(blob);
  setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4);
  setTimeout(function () { a.click() }, 0);
});

loadSettings(setSettingsInDOM);
