// Signup form functionality
// Note: This requires backend endpoints for full functionality

const form = document.querySelector(".signup form"),
continueBtn = form?.querySelector(".button input"),
errorText = form?.querySelector(".error-text");

if (form && continueBtn) {
    form.onsubmit = (e) => {
        e.preventDefault();
    }

    continueBtn.onclick = () => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "signup.php", true);
        xhr.onload = () => {
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status === 200){
                    let data = xhr.response;
                    if(data === "success"){
                        location.href = "users.php";
                    } else {
                        if (errorText) {
                            errorText.style.display = "block";
                            errorText.textContent = data;
                        }
                    }
                }
            }
        }
        let formData = new FormData(form);
        xhr.send(formData);
    }
}