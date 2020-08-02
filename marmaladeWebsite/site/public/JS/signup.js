"use strict";

const myForm = document.getElementById('myForm');

                myForm.addEventListener('submit', function(event) {
                    event.preventDefault();

                    const formData = new FormData(this);
                    const searchParams = new URLSearchParams();
                    const password = formData.get('password');

                    for (const pair of formData){
                        searchParams.append(pair[0],pair[1]);
                    }
                    var check = passwordcheck(password);

                    if(check.length == 1){
                        fetch('/signup',{
                            method: 'post',
                            body:searchParams
                        }).then(response => response.json()
                        ).then( data => {
                            console.log(data);
                            if(data.nameerror === "Username Ok" && data.emailerror ==="Email Ok" && data.passerror ==="Password OK"){
                                document.getElementById('nameresponse').innerHTML = " ";
                                document.getElementById('emailresponse').innerHTML = " ";
                                document.getElementById('passwordresponse').innerHTML = "Successfully Signed Up!";
                            }
                            else{
                                document.getElementById('nameresponse').innerHTML = data.nameerror;
                                document.getElementById('emailresponse').innerHTML = data.emailerror;
                                document.getElementById('passwordresponse').innerHTML = " ";
                            }
                        })
                    }
                    else {
                        document.getElementById('nameresponse').innerHTML = " ";
                        document.getElementById('emailresponse').innerHTML = " ";
                        document.getElementById('passwordresponse').innerHTML = check[0];
                    }

                })

                function passwordcheck(password){
                    var errors = ["Password Ok"];
                    let errormap = new Map();
                    errormap.set('number',{val : 0});
                    errormap.set('letter',{val : 0});
                    errormap.set('upper',{val : 0});
                    errormap.set('special',{val : 0});
                    if(password.length < 10){
                        errors.unshift("Password not long enough");
                    }
                    for(var i = 0; i < password.length; i++){
                        var char = password.charAt(i);
                        if(char == " "){
                            errors.unshift("Password must not contain spaces");
                        }
                        if(/^[0-9]/.test(char)){
                            errormap.get('number').val++;
                            console.log("contains number");
                        }
                        else if(/^[a-z]/.test(char)){
                            errormap.get('letter').val++;
                            console.log("contains letter");
                        }
                        else if(/^[A-Z]/.test(char)){
                            errormap.get('upper').val++;
                            console.log("contains Upper");
                        }
                        else if(!(/^[a-zA-Z0-9]/.test(char)) && char != " "){
                            errormap.get('special').val++;
                            console.log("contains special");
                        }
                    }
                    for(var [key, value] of errormap){
                            if(value.val == 0){
                                errors.unshift(`Password must contain at least one ${key} character`)
                            }
                        }
                    return errors;
                }
