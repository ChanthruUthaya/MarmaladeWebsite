var frame = document.getElementById("picture");
var username = document.getElementById("usertext");

fetch('/getdata',{
    method: 'get',
}).then(res=> res.json()
).then((data)=>{
    username.innerHTML = data.username;
    for(const image of data.images){
        var div = document.createElement("div");
        var image_name = image.Path.split("\\")[2];
        var img = document.createElement("img");
        img.src = image_name;
        console.log(image_name);
        var button = document.createElement("button");
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
}
);
