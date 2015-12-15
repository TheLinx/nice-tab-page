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

document.getElementById("save").addEventListener("click", function()
{
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
    if (link.children[0].value.length == 0)
      return;
    if (link.children[1].value.length == 0)
      return;
    links.push([link.children[0].value, link.children[1].value, link.children[2].value]);
  });

  chrome.storage.local.set({
    header: header,
    headerheight: headerheight,
    links: links,
    colorbg,
    colorfg,
    colorhi
  }, function() {
    var status = document.getElementById('status');
    status.textContent = chrome.i18n.getMessage('saved');
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
});

var dragSource = null;
function handleDragStart(eve) {
  dragSource = this;
  this.classList.add('drag');
  eve.dataTransfer.effectAllowed = 'move';
}
function handleDragOver(eve) {
  eve.preventDefault();
  eve.dataTransfer.dropEffect = 'move';
  return false;
}
function handleDragEnter(eve) {
  this.classList.add('over');
}
function handleDragLeave(eve) {
  this.classList.remove('over');
}
function handleDrop(eve) {
  eve.stopPropagation();
  if (dragSource != this) {
    document.getElementById("links").insertBefore(dragSource, this.nextSibling);
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
  div.draggable = true;
  div.addEventListener("dragstart", handleDragStart);
  div.addEventListener("dragover",  handleDragOver);
  div.addEventListener("dragenter", handleDragEnter);
  div.addEventListener("dragleave", handleDragLeave);
  div.addEventListener("dragend",   handleDragEnd);
  div.addEventListener("drop",      handleDrop);
  document.getElementById("links").appendChild(div);

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

loadSettings(function(items) {
  document.getElementById("image-preview").src = items.header;
  document.getElementById("header-height").value = items.headerheight;
  
  document.getElementById("colorbg").value = items.colorbg;
  document.getElementById("colorfg").value = items.colorfg;
  document.getElementById("colorhi").value = items.colorhi;
  
  var container = document.getElementById("links");
  [].forEach.call(items.links, function(link)
  {
    addlink(link[0], link[1], link[2]);
  });
});
