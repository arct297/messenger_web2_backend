const addChatButton = document.getElementById('add-chat-button');
const modal = document.getElementById('modal');
const closeModalBtn = document.querySelector('.close-modal-button');


const createChatResultElement = document.getElementById("chat-creating-result");
const createChatButton = document.getElementById("create-chat-button");
const partnerUserNameElement = document.getElementById("partner-username");

const logOutButtonElement = document.getElementById("logout-button");
const settingsButtonElement = document.getElementById("settings-button");

const sendMessageButton = document.querySelector(".send-button");
const messageInputElement = document.querySelector(".input-block input");

var selfUserId = null;
var selectedChat = null;

let lastMessageTimestamp = null;

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        console.log(key);
        console.log(value);
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    selfUserId = getCookie("selfUserId");
});


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
                    participants : [partnerUsername,], chatType : "private", title : null, }
                )
        });

        const responseJSON = await response.json();
        console.log(response.status, responseJSON);
        
        createChatResultElement.className = "";
        createChatResultElement.style.display = "block";
        if (response.status === 201) {
            createChatResultElement.textContent = "Chat successfully created!";
            createChatResultElement.className = "chat-creating-result-success";
        
        } else if (response.status === 404) {
            createChatResultElement.textContent = "User with such username is not found!";
            createChatResultElement.className = "chat-creating-result-warning";
        
        } else if (response.status === 400 && responseJSON.status === "warning") {
            createChatResultElement.textContent = "Impossible to create chat: " + responseJSON.message;
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


logOutButtonElement.addEventListener('click', async () => {
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                { 
                    fullLogOut : false,
                }
            )
        });

        // const responseJSON = await response.json();
        
        if (response.status === 200) {
            window.location.href = "/auth/login"
        } else {
            console.log("error");
        }
        // } else if (response.status === 404) {
        //     createChatResultElement.textContent = "User with such username is not found!";
        //     createChatResultElement.className = "chat-creating-result-warning";
        // } else {
        //     createChatResultElement.textContent = "Error... Try again later!";
        //     createChatResultElement.className = "chat-creating-result-error";
        // }
        
    } catch (error) {
        console.log(error)
        // createChatResultElement.textContent = "Error... Try again later!";
        // createChatResultElement.className = "chat-creating-result-error";
    }
});


settingsButtonElement.addEventListener('click', async () => {
    try {

        window.location.href = "/settings"
        
    } catch (error) {
        console.log(error)
    }
});

function createChatElement(chat) {
    const chatElement = document.createElement("div");
    chatElement.classList.add("chats-list-chat");
    chatElement.dataset.chatId = chat._id;

    const previewBlock = document.createElement("div");
    previewBlock.classList.add("preview-image-block");
    const img = document.createElement("img");
    img.src = chat.avatar;
    previewBlock.appendChild(img);

    const infoBlock = document.createElement("div");
    infoBlock.classList.add("chat-info-block");

    const titleElement = document.createElement("div");
    titleElement.classList.add("chat-title");
    titleElement.textContent = chat.title;

    const lastMessageElement = document.createElement("div");
    lastMessageElement.classList.add("chat-last-message");
    lastMessageElement.textContent = chat.lastMessage;

    infoBlock.appendChild(titleElement);
    infoBlock.appendChild(lastMessageElement);

    const statusBlock = document.createElement("div");
    statusBlock.classList.add("chat-status");
    statusBlock.textContent = chat.status;

    chatElement.appendChild(previewBlock);
    chatElement.appendChild(infoBlock);
    chatElement.appendChild(statusBlock);

    return chatElement;
}

async function changeSelectedChat(newSelectedChat, chatData) {
    try {
        const noSelectedChatElement = document.querySelector(".unselected-chat-block");
        noSelectedChatElement.style.display = "none";

        const inputMessageElement = document.querySelector(".chat-block-input");
        inputMessageElement.style.display = "flex";

        renderChatHeader(chatData);

        chatData.messages = [];
        try {
            const response = await fetch(`/messages/?chatId=${chatData._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const responseJSON = await response.json();
            if (response.status === 200 && responseJSON.status === "success") {
                chatData.messages = responseJSON.messagesList;

                // Устанавливаем lastMessageTimestamp сразу после загрузки
                if (chatData.messages.length > 0) {
                    lastMessageTimestamp = chatData.messages[chatData.messages.length - 1].timestamp;
                }
            } else {
                console.log(response.status);
                window.location.href = "/messenger"
                return;
            }
        } catch (error) {
            console.log(error);
        }

        renderChatMessages(chatData.messages);
        
    } catch (error) {
        console.error("Error changing selected chat:", error);
    }

    try {
        selectedChat.classList.remove("selected-chat");
    } catch (error) {}

    newSelectedChat.classList.add("selected-chat");
    selectedChat = newSelectedChat;
}

function renderChatHeader(chatData) {
    console.log(`chat data ${chatData}`)
    const headerContainer = document.querySelector(".chat-block-header");
    try {
        headerContainer.innerHTML = ""; 
    } catch {}

    const header = document.createElement("div");
    header.classList.add("chat-block-header", "gradient2");

    const avatarBlock = document.createElement("div");
    avatarBlock.classList.add("chat-block-header-avatar");

    const avatarImg = document.createElement("img");
    avatarImg.src = chatData.avatar || "/src/default_avatar.png";
    avatarImg.classList.add("chat-avatar");

    avatarBlock.appendChild(avatarImg);

    const textInfoBlock = document.createElement("div");
    textInfoBlock.classList.add("chat-block-header-text-info");

    const titleElement = document.createElement("div");
    titleElement.classList.add("chat-block-header-title");
    titleElement.textContent = chatData.title;

    const statusElement = document.createElement("div");
    statusElement.classList.add("chat-block-header-online-status");
    statusElement.textContent = chatData.onlineStatus || "Last seen recently";

    textInfoBlock.appendChild(titleElement);
    textInfoBlock.appendChild(statusElement);

    const menuBlock = document.createElement("div");
    menuBlock.classList.add("chat-block-header-menu");
    menuBlock.textContent = "⋮";

    header.appendChild(avatarBlock);
    header.appendChild(textInfoBlock);
    header.appendChild(menuBlock);

    console.log(header);
    console.log(headerContainer);

    headerContainer.appendChild(header);
    headerContainer.style.display = "flex";
}


function renderChatMessages(messages, append = false) {
    console.log("Messages to render:", messages);
    
    const messagesContainer = document.querySelector(".chat-block-content");
    console.log("Messages container:", messagesContainer);

    if (!messagesContainer) {
        console.error("Error: Messages container not found!");
        return;
    }

    messagesContainer.style.visibility = "visible";

    if (!append) {
        messagesContainer.innerHTML = "";
    }

    const existingMessageIds = new Set(
        [...messagesContainer.children].map(msg => msg.dataset.messageId)
    );

    messages.forEach(message => {
        if (existingMessageIds.has(message._id)) {
            console.log("Skipping duplicate message:", message);
            return; // Пропускаем дубликат
        }

        console.log("Rendering message:", message);

        const messageElement = document.createElement("div");
        messageElement.dataset.messageId = message._id; // Устанавливаем ID для отслеживания

        const senderId = message.sender?._id || message.sender;
        console.log("Processed sender ID:", senderId);

        if (senderId === selfUserId) {
            messageElement.classList.add("message", "outcome-message");
        } else {
            messageElement.classList.add("message", "income-message");
        }

        const contentElement = document.createElement("div");
        contentElement.classList.add("message-content");
        contentElement.textContent = message.content;

        const infoElement = document.createElement("div");
        infoElement.classList.add("message-info");
        infoElement.textContent = new Date(message.timestamp).toLocaleTimeString();

        messageElement.appendChild(contentElement);
        messageElement.appendChild(infoElement);

        messagesContainer.appendChild(messageElement);
    });

    messagesContainer.style.display = "flex";
}






document.addEventListener('DOMContentLoaded', async () => {
    var chatsList = [];

    try {
        const response = await fetch('/chats/', {
            method: 'GET',
        });

        const responseJSON = await response.json();
        if (response.status === 200 && responseJSON.status === "success") {
            chatsList = responseJSON.chats;
        } else {
            console.log(`Chats loading error: <${response.status}> ${responseJSON}`);
            return;
        }
        
    } catch (error) {
        console.log(error)
    }

    console.log(chatsList);
    const chatContainer = document.querySelector(".chats-list");
    chatContainer.innerHTML = ""; 

    chatsList.forEach(chat => {
        const chatElement = createChatElement(chat);
        chatElement.addEventListener("click", () => changeSelectedChat(chatElement, chat))
        chatContainer.appendChild(chatElement);
    }); 

});


sendMessageButton.addEventListener("click", async () => {
    const messageText = messageInputElement.value;
    const chatId = selectedChat.dataset.chatId;

    try {
        const response = await fetch('/messages/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: messageText, chatId })
        });

        const responseJSON = await response.json();
        if (response.status === 201 && responseJSON.status === "success") {
            const newMessage = responseJSON.savedMessage;
            renderChatMessages([newMessage], true);
            lastMessageTimestamp = newMessage.timestamp;
            console.log(lastMessageTimestamp);
        } else {
            console.log(`Message sending error: <${response.status}>`, responseJSON);
        }
    } catch (error) {
        console.log(error);
    }

    messageInputElement.value = "";
});




async function pollMessages() {
    if (!selectedChat) return;
    const chatId = selectedChat.dataset.chatId;

    try {
        const url = `/messages/?chatId=${chatId}` + (lastMessageTimestamp ? `&lastMessageTimestamp=${lastMessageTimestamp}` : "");
        const response = await fetch(url, { method: 'GET' });
        const responseJSON = await response.json();

        if (response.status === 200 && responseJSON.status === "success") {
            if (responseJSON.messagesList.length > 0) {
                renderChatMessages(responseJSON.messagesList, true);

                // Обновляем timestamp корректно
                lastMessageTimestamp = new Date(responseJSON.messagesList[responseJSON.messagesList.length - 1].timestamp).toISOString();
            }
        } else {
            console.log(`Polling error: ${response.status}`, responseJSON);
        }
    } catch (error) {
        console.error("Error polling messages:", error);
    }
}

setInterval(pollMessages, 3000);

