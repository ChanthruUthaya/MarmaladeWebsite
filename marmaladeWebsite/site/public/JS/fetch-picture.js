var frame = document.getElementById("picture");
var username = document.getElementById("usertext");
var grid = document.querySelector('.grid');

fetch('/getdata/profileimage',{
    method: 'get',
}).then(res=> res.json()
).then((data)=>{
    username.innerHTML = "Welcome, ".concat(data.username).concat(".");
    for(const image of data.images){
        var div = document.createElement("div");
        div.classList.add('grid-item');
        var image_name = image.Path.split(new RegExp("\\\\|/"))[2];
        var img = document.createElement("img");
        img.src = image_name;
        console.log(image_name);
        var button = document.createElement("button");
        button.classList.add('delete-button');
        button.textContent = 'delete';
        button.id = image.PhotoID.toString();
        const params = new URLSearchParams({
          id: image.PhotoID,
          src: image_name
        });
        button.onclick = function(){
          fetch('/delete', {
            method: 'DELETE',
            body: params
          }).then(location.reload())
        }
        div.appendChild(img);
        div.appendChild(button);
        frame.appendChild(div);
    }
    imagesLoaded(grid, function() {
      console.log('all images are loaded');
      var msnry = new Masonry(grid, {
        // itemSelector: '.grid-item',
        percentPosition: true,
        // horizontalOrder: true,
        gutterWidth: 5
      });
    });
});



// imagesLoaded(grid).on( 'always', function() {
//   // layout Masonry after each image loads
//   msnry.reloadItems();
//   msnry.layout();
// });
