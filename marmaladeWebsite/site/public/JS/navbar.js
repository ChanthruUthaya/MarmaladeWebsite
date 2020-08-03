"use strict";

var options = {
    set0 : ['<a href="index.html" class="text">Home</a>','<a href="explore.html" class="text">Explore</a>','<a href="login.html" class="text">Login</a>'],
    set1 : ['<a href="index.html" class="text">Home</a>','<a href="explore.html" class="text">Explore</a>','<a href="/profile" class="text">Profile</a>','<a href="/logout" class="text">Logout</a>']
};


function makeUL(array) {
 // Create the list element:
var list = document.getElementById("navbar");

for (var i = 0; i < array.length; i++) {
// Create the list item:
    var item = document.createElement('li');

// Set its contents:
    item.innerHTML = array[i];
// Add it to the list:
    list.appendChild(item);
}

// Finally, return the constructed list:
//return list;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

var cookie = getCookie("connect.sid");


if(cookie != ""){
    fetch('/authenticate',{
      method: 'get',
    }).then(response => response.json()
    ).then((data) =>{
      if(data.msg == "authenticated"){
        makeUL(options.set1);
      }
      else{
        makeUL(options.set0);
      }
    })
}
else{
  makeUL(options.set0);
}
