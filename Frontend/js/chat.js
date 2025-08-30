// Chat functionality for BiniOrbit Messenger
// Note: This requires backend endpoints for full functionality

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector(".typing-area"),
    inputField = form?.querySelector(".input-field"),
    sendBtn = form?.querySelector("button"),
    chatBox = document.querySelector(".chat-box");

    if (!form || !inputField || !sendBtn || !chatBox) {
        console.log("Chat elements not found - chat functionality disabled");
        return;
    }

    // Debug logging
    console.log("CHAT DEBUG: Chat elements found and initialized");

    // Function to get the current incoming_id value
    function getIncomingId() {
        const incomingIdInput = form.querySelector(".incoming_id");
        if (!incomingIdInput) {
            console.error("CHAT ERROR: incoming_id input not found!");
            return null;
        }
        const value = incomingIdInput.value;
        if (!value) {
            console.error("CHAT ERROR: incoming_id is missing!");
            return null;
        }
        return value;
    }

    form.onsubmit = (e) => {
        e.preventDefault();
    }

    inputField.focus();
    
    inputField.onkeyup = () => {
        if(inputField.value != ""){
            sendBtn.classList.add("active");
        } else {
            sendBtn.classList.remove("active");
        }
    }

    sendBtn.onclick = () => {
        const incomingId = getIncomingId();
        if (!incomingId) {
            alert("Chat error: No chat partner ID found. Please refresh the page.");
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "insert-chat.php", true);
        xhr.onload = () => {
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status === 200){
                    inputField.value = "";
                    scrollToBottom();
                } else {
                    console.error("Failed to send message:", xhr.status);
                }
            }
        }
        let formData = new FormData(form);
        xhr.send(formData);
    }

    chatBox.onmouseenter = () => {
        chatBox.classList.add("active");
    }

    chatBox.onmouseleave = () => {
        chatBox.classList.remove("active");
    }

    // Poll for new messages
    setInterval(() => {
        const incomingId = getIncomingId();
        if (!incomingId) return;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "get-chat.php", true);
        xhr.onload = () => {
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status === 200){
                    let data = xhr.response;
                    chatBox.innerHTML = data;
                    if(!chatBox.classList.contains("active")){
                        scrollToBottom();
                    }
                }
            }
        }
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("incoming_id=" + incomingId);
    }, 500);

    function scrollToBottom(){
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});