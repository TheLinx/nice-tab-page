var linkcolor;

function linkMouseEnter(eve)
{
  var anchor = eve.target;
  anchor.style.color = anchor.parentElement.style.borderBottomColor;
}
function linkMouseLeave(eve)
{
  eve.target.style.color = linkcolor;
}

loadSettings(function(items)
{
  document.body.style.backgroundColor = items.colorbg;
  
  var header = document.getElementsByTagName('header')[0];
  header.style.backgroundImage = 'url(' + items.header + ')';
  header.style.display = "block";
  header.style.height = items.headerheight + 'px';
  header.style.borderColor = items.colorhi;

  var container = document.getElementsByTagName('main')[0];
  [].forEach.call(items.links, function(link)
  {
    var div = document.createElement('div');
    div.style.borderBottomColor = link[2];
    div.style.backgroundColor = items.colorfg;
    container.appendChild(div);

    var anchor = document.createElement('a');
    anchor.href = link[1];
    anchor.innerText = link[0];
    anchor.style.color = items.colorhi;
    anchor.addEventListener('mouseenter', linkMouseEnter);
    anchor.addEventListener('mouseleave', linkMouseLeave);
    div.appendChild(anchor);
  });
  
  linkcolor = items.colorhi;
});
