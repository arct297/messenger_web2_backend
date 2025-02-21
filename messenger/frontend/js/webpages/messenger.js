const addChatButton = document.getElementById('add-chat-button');
const modal = document.getElementById('modal');
const closeModalBtn = document.querySelector('.close-modal-button');

const createChatResultElement = document.getElementById("chat-creating-result");
const createChatButton = document.getElementById("create-chat-button");
const addUserToChatButton = document.getElementById("add-user-chat-button");
const partnerUserNameElement = document.getElementById("partner-username");

const logOutButtonElement = document.getElementById("logout-button");
const settingsButtonElement = document.getElementById("settings-button");

const sendMessageButton = document.querySelector(".send-button");
const messageInputElement = document.querySelector(".input-block input");

const participantsListElement = document.querySelector(".add-user-chat-list");

const messagesContainer = document.querySelector(".chat-block-content");
let currentPage = 1;
let isFetching = false;
let hasMoreMessages = true;
let isFirstLoad = false;
let lastRenderedDate = null;

var selfUserId = null;
var selectedChat = null;

let lastMessageTimestamp = null;
let lastChatTimestamp = null;

var participants = [];

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

addUserToChatButton.addEventListener('click', async () => {
    const partnerUsername = partnerUserNameElement.value;
    if (!partnerUsername) {
        createChatResultElement.className = "chat-creating-result-warning";
        createChatResultElement.textContent = "Please, input username of partner!";
        createChatResultElement.style.display = "block";
        return;
    }
    partnerUserNameElement.value = "";

    participants.push(partnerUsername);
    
    const chatParticipantElement = document.createElement("div");
    chatParticipantElement.classList.add("add-user-chat-user");
    chatParticipantElement.innerText = partnerUsername;

    participantsListElement.appendChild(chatParticipantElement);    
    
});

createChatButton.addEventListener('click', async () => {
    try {
        var chatType = participants.length > 1 ? "group" : "private";
        console.log(chatType, participants.length);
        const response = await fetch('/chats/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                { 
                    participants : participants, chatType : chatType, title : null, }
                )
        });


        participants = [];
        participantsListElement.innerHTML = "";

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
        
        if (response.status === 200) {
            window.location.href = "/auth/login"
        } else {
            console.log("error");
        }
        
    } catch (error) {
        console.log(error)
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

                if (chatData.messages.length > 0) {
                    lastMessageTimestamp = chatData.messages[chatData.messages.length - 1].createdAt;
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

    if (!messagesContainer) {
        console.error("Error: Messages container not found!");
        return;
    }

    messagesContainer.style.visibility = "visible";

    if (!append) {
        messagesContainer.innerHTML = "";
        lastRenderedDate = null; // Сброс даты при полной загрузке чата
    }

    const existingMessageIds = new Set(
        [...messagesContainer.children].map(msg => msg.dataset.messageId)
    );

    messages.forEach(message => {
        if (existingMessageIds.has(message._id)) {
            console.log("Skipping duplicate message:", message);
            return;
        }

        console.log("Rendering message:", message);

        const messageDate = new Date(message.createdAt);
        const formattedDate = messageDate.toLocaleDateString();

        // ✅ Добавляем системное сообщение с датой **только если день изменился**
        if (lastRenderedDate !== formattedDate) {
            const systemMessageElement = document.createElement("div");
            systemMessageElement.classList.add("message", "system-message");
            systemMessageElement.textContent = formattedDate;

            messagesContainer.appendChild(systemMessageElement);
            lastRenderedDate = formattedDate; // Обновляем последнюю рендеренную дату
        }

        const messageElement = document.createElement("div");
        messageElement.dataset.messageId = message._id;

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
        infoElement.textContent = messageDate.toLocaleTimeString();

        messageElement.appendChild(contentElement);
        messageElement.appendChild(infoElement);

        if (senderId === selfUserId && !message.deleted) {
            const actionButtons = document.createElement("div");
            actionButtons.classList.add("message-actions");

            const editButton = document.createElement("button");
            editButton.classList.add("edit-message-btn");
            editButton.textContent = "✏️";
            editButton.addEventListener("click", () => editMessage(message._id, contentElement));

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-message-btn");
            deleteButton.textContent = "🗑️";
            deleteButton.addEventListener("click", () => deleteMessage(message._id, messageElement));

            actionButtons.appendChild(editButton);
            actionButtons.appendChild(deleteButton);
            messageElement.appendChild(actionButtons);
        }

        messagesContainer.appendChild(messageElement);
    });

    scrollToBottom();
}




async function editMessage(messageId, contentElement) {
    const newContent = prompt("Edit your message:", contentElement.textContent);
    if (!newContent || newContent.trim() === "") return;

    try {
        const response = await fetch(`/messages/${messageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newContent })
        });

        const responseJSON = await response.json();
        if (response.status === 200 && responseJSON.status === "success") {
            contentElement.textContent = newContent;
            contentElement.classList.add("edited-message");
        } else {
            console.log(`Message editing error: <${response.status}>`, responseJSON);
        }
    } catch (error) {
        console.error("Error editing message:", error);
    }
}


async function deleteMessage(messageId, messageElement) {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
        const response = await fetch(`/messages/${messageId}`, {
            method: 'DELETE',
        });

        const responseJSON = await response.json();
        if (response.status === 200 && responseJSON.status === "success") {
            messageElement.querySelector(".message-content").textContent = "This message has been deleted";
            messageElement.querySelector("message-actions").innerHTML = "";
        } else {
            console.log(`Message deletion error: <${response.status}>`, responseJSON);
        }
    } catch (error) {
        console.error("Error deleting message:", error);
    }
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
            lastMessageTimestamp = newMessage.createdAt;
            console.log(lastMessageTimestamp);

            scrollToBottom();
        } else {
            console.log(`Message sending error: <${response.status}>`, responseJSON);
        }
    } catch (error) {
        console.log(error);
    }

    messageInputElement.value = "";
});


async function pollMessages() {
    if (isFirstLoad || !selectedChat) return;

    const chatId = selectedChat.dataset.chatId;
    if (!chatId) return;

    try {
        const url = `/messages/?chatId=${chatId}&lastMessageTimestamp=${lastMessageTimestamp}`;
        console.log("📡 Polling messages from:", url);

        const response = await fetch(url, { method: 'GET' });
        const responseJSON = await response.json();

        if (response.status === 200 && responseJSON.status === "success") {
            if (responseJSON.messagesList.length > 0) {
                console.log("📩 Поллинг: пришли новые сообщения!", responseJSON.messagesList);

                updateChatMessages(responseJSON.messagesList);

                // 🔥 Берём **самую последнюю дату**, а не просто `lastMessageTimestamp`
                const lastMessage = responseJSON.messagesList[responseJSON.messagesList.length - 1];

                const createdAt = lastMessage.updatedAt || lastMessage.createdAt; 
                if (createdAt) {
                    const parsedDate = new Date(createdAt);
                    if (!isNaN(parsedDate.getTime())) {
                        // ✅ Обновляем lastMessageTimestamp **только если он новее**
                        if (!lastMessageTimestamp || new Date(lastMessageTimestamp) < parsedDate) {
                            lastMessageTimestamp = parsedDate.toISOString();
                            console.log("✅ lastMessageTimestamp обновлён:", lastMessageTimestamp);
                        }
                    } else {
                        console.error("❌ Некорректный формат времени:", createdAt);
                    }
                } else {
                    console.error("⚠️ ВНИМАНИЕ: `updatedAt` и `createdAt` отсутствуют!", lastMessage);
                }
            } else {
                console.log("🛑 Поллинг: новых сообщений нет.");
            }
        } else {
            console.log(`Polling error: ${response.status}`, responseJSON);
        }
    } catch (error) {
        console.error("❌ Ошибка при поллинге сообщений:", error);
    }
}

setInterval(pollMessages, 3000);



async function pollChats() {
    try {
        const url = `/chats/` + (lastChatTimestamp ? `?lastChatTimestamp=${lastChatTimestamp}` : "");
        console.log("Polling new chats from:", url);

        const response = await fetch(url, { method: 'GET' });
        const responseJSON = await response.json();

        if (response.status === 200 && responseJSON.status === "success") {
            console.log("Polled chats:", responseJSON.chats);

            if (responseJSON.chats.length > 0) {
                renderChats(responseJSON.chats, true);

                lastChatTimestamp = new Date(responseJSON.chats[responseJSON.chats.length - 1].createdAt).toISOString();
            }
        } else {
            console.log(`Polling error: ${response.status}`, responseJSON);
        }
    } catch (error) {
        console.error("Error polling chats:", error);
    }
}


function renderChats(chats, append = false) {
    console.log("Chats to render:", chats);

    const chatContainer = document.querySelector(".chats-list");
    if (!append) {
        chatContainer.innerHTML = "";
    }

    const existingChatIds = new Set(
        [...chatContainer.children].map(chat => chat.dataset.chatId)
    );

    chats.forEach(chat => {
        if (existingChatIds.has(chat._id)) {
            console.log("Skipping duplicate chat:", chat);
            return;
        }

        const chatElement = createChatElement(chat);
        chatElement.addEventListener("click", () => changeSelectedChat(chatElement, chat));
        chatContainer.appendChild(chatElement);
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/chats/', { method: 'GET' });
        const responseJSON = await response.json();

        if (response.status === 200 && responseJSON.status === "success") {
            console.log("Initial chats:", responseJSON.chats);
            renderChats(responseJSON.chats);

            if (responseJSON.chats.length > 0) {
                lastChatTimestamp = new Date(responseJSON.chats[responseJSON.chats.length - 1].createdAt).toISOString();
            }
        } else {
            console.log(`Chats loading error: <${response.status}>`, responseJSON);
        }
    } catch (error) {
        console.log(error);
    }
});


setInterval(pollChats, 3000);


function updateChatMessages(newMessages) {
    const messagesContainer = document.querySelector(".chat-block-content");
    const existingMessages = new Map();

    messagesContainer.querySelectorAll(".message").forEach(messageElement => {
        existingMessages.set(messageElement.dataset.messageId, messageElement);
    });

    newMessages.forEach(newMessage => {
        const existingMessageElement = existingMessages.get(newMessage._id);

        if (newMessage.deleted) {
            if (existingMessageElement) {
                existingMessageElement.remove();
            }
        } else if (existingMessageElement) {
            const contentElement = existingMessageElement.querySelector(".message-content");
            if (contentElement.textContent !== newMessage.content) {
                contentElement.textContent = newMessage.content;
                existingMessageElement.classList.add("edited-message");
            }
        } else {
            renderChatMessages([newMessage], true);
        }
    });
}

function scrollToBottom() {
    const messagesContainer = document.querySelector(".chat-block-content");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

messagesContainer?.addEventListener('scroll', async () => {
    if (messagesContainer.scrollTop <= 10 && hasMoreMessages && !isFetching) {
        console.log("this is top");
        isFetching = true;

    }
});
