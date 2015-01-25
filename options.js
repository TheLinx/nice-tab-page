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
    links: links
  }, function() {
    var status = document.getElementById('status');
    status.textContent = chrome.i18n.getMessage('saved');
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
});

document.getElementById("addlink").addEventListener("click", function()
{
  var div = document.createElement('div');
  div.className = "merged link";
  document.getElementById("links").appendChild(div);

  var name = document.createElement('input');
  name.type = 'text';
  div.appendChild(name);

  var href = document.createElement('input');
  href.type = 'url';
  href.className = "merged-main";
  div.appendChild(href);

  var color = document.createElement('input');
  color.type = 'color';
  div.appendChild(color);
});

loadSettings(function(items) {
  document.getElementById("image-preview").src = items.header;
  document.getElementById("header-height").value = items.headerheight;

  var container = document.getElementById("links");
  [].forEach.call(items.links, function(link)
  {
    var div = document.createElement('div');
    div.className = "merged link";
    container.appendChild(div);

    var name = document.createElement('input');
    name.type = 'text';
    name.value = link[0];
    div.appendChild(name);

    var href = document.createElement('input');
    href.type = 'url';
    href.value = link[1];
    href.className = "merged-main";
    div.appendChild(href);

    var color = document.createElement('input');
    color.type = 'color';
    color.value = link[2];
    div.appendChild(color);
  });
});
