// Password show/hide toggle functionality

const pswrdField = document.querySelector(".form input[type='password']"),
toggleIcon = document.querySelector(".form .field i");

if (pswrdField && toggleIcon) {
    toggleIcon.onclick = () => {
        if(pswrdField.type === "password"){
            pswrdField.type = "text";
            toggleIcon.classList.add("active");
        } else {
            pswrdField.type = "password";
            toggleIcon.classList.remove("active");
        }
    }
}