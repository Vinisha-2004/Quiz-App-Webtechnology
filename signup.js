let form=document.querySelector("form")

form.addEventListener("submit",(e)=>{


    e.preventDefault()

    let email=document.querySelector("#email").value
    let name=document.querySelector("#name").value
    let pass=document.querySelector("#pass").value


    localStorage.setItem("sname",name)
    localStorage.setItem("semail",email)
    localStorage.setItem("spass",pass)
    
    console.log({name,email,pass});
    alert("done sighup")

    open("./login.html")


})