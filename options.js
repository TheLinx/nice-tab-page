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
  var linksContainer = document.getElementById("links");
  for (var i = 1/*skipping the the h2*/; i < linksContainer.children.length; i++)
  {
    if (linksContainer.children[i].children[0].value.length == 0)
      continue;
    if (linksContainer.children[i].children[1].value.length == 0)
      continue;
    links.push([linksContainer.children[i].children[0].value, linksContainer.children[i].children[1].value, linksContainer.children[i].children[2].value]);
  }

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
  for (var i = 0; i < items.links.length; i++)
  {
    var link = items.links[i];

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
  }
});
