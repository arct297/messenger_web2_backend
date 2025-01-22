const addChatButton = document.getElementById('add-chat-button');
const modal = document.getElementById('modal');
const closeModalBtn = document.querySelector('.close-modal-button');

const createChatResultElement = document.getElementById("chat-creating-result");
const createChatButton = document.getElementById("create-chat-button");
const partnerUserNameElement = document.getElementById("partner-username");

addChatButton.addEventListener('click', () => {
    console.log('clicked');
    modal.style.display = 'flex';
});


closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

createChatButton.addEventListener('click', async () => {
    const partnerUsername = partnerUserNameElement.value;
    if (!partnerUsername) {
        createChatResultElement.className = "chat-creating-result-warning";
        createChatResultElement.textContent = "Please, input username of partner!";
        createChatResultElement.style.display = "block";
        return;
    }

    try {
        const response = await fetch('/chats/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                { 
                    withUserUsernames : [partnerUsername,], chatType : "private" }
                )
        });

        const responseJSON = await response.json();
        
        createChatResultElement.className = "";
        createChatResultElement.style.display = "block";
        if (response.status === 201) {
            createChatResultElement.textContent = "Chat successfully created!";
            createChatResultElement.className = "chat-creating-result-success";
        } else if (response.status === 404) {
            createChatResultElement.textContent = "User with such username is not found!";
            createChatResultElement.className = "chat-creating-result-warning";
        } else {
            createChatResultElement.textContent = "Error... Try again later!";
            createChatResultElement.className = "chat-creating-result-error";
        }
        
    } catch (error) {
        createChatResultElement.textContent = "Error... Try again later!";
        createChatResultElement.className = "chat-creating-result-error";
    }

});