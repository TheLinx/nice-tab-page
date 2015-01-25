function linkMouseEnter(eve)
{
  var anchor = eve.target;
  anchor.style.color = anchor.parentElement.style.borderBottomColor;
}
function linkMouseLeave(eve)
{
  eve.target.style.color = '';
}

loadSettings(function(items)
{
  var header = document.getElementsByTagName('header')[0];
  header.style.backgroundImage = 'url(' + items.header + ')';
  header.style.display = "block";
  header.style.height = items.headerheight + 'px';

  var container = document.getElementsByTagName('main')[0];
  for (var i = 0; i < items.links.length; i++)
  {
    var link = items.links[i];

    var div = document.createElement('div');
    div.style.borderBottomColor = link[2];
    container.appendChild(div);

    var anchor = document.createElement('a');
    anchor.href = link[1];
    anchor.innerText = link[0];
    anchor.addEventListener('mouseenter', linkMouseEnter);
    anchor.addEventListener('mouseleave', linkMouseLeave);
    div.appendChild(anchor);
  }
});
