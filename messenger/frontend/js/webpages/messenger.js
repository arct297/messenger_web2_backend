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
const searchInput = document.getElementById("search-messages");

const participantsListElement = document.querySelector(".add-user-chat-list");

const messagesContainer = document.querySelector(".chat-block-content");
let currentPage = 1;
let isFetching = false;
let hasMoreMessages = true;
let lastRenderedDate = null;
let isFirstLoad  = true;


var selfUserId = null;
var selectedChat = null;

let lastMessageTimestamp = null;
let lastChatTimestamp = null;

var participants = [];

searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();

    if (!query) {
        console.log("Поле поиска очищено, загружаем все сообщения...");
        
        if (selectedChat) {
            await loadMessages(true); // Перезагружаем все сообщения в текущем чате
        }
        return;
    }

    console.log("Поиск сообщений:", query);
    await searchMessages(query);
});


async function searchMessages(query) {
    if (!selectedChat) return;
    
    const chatId = selectedChat.dataset.chatId;
    if (!chatId) return;

    try {
        const response = await fetch(`/messages/search?query=${query}&chatId=${chatId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const textResponse = await response.text();
        console.log("Сырой ответ от сервера:", textResponse); // Проверяем, что вернул сервер

        const responseJSON = JSON.parse(textResponse);
        console.log("Ответ сервера (JSON):", responseJSON);

        if (response.status === 200 && responseJSON.status === "success") {
            renderChatMessages(responseJSON.messages);
        } else {
            console.log(`Ошибка поиска: ${response.status}`, responseJSON);
        }
    } catch (error) {
        console.error("Ошибка поиска:", error);
    }
}


function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
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

    headerContainer.appendChild(header);
    headerContainer.style.display = "flex";
}


function renderChatMessages(messages, append = false, prepend = false) {
    if (!messagesContainer) {
        return;
    }

    messagesContainer.style.visibility = "visible";

    if (!append) {
        messagesContainer.innerHTML = "";
        lastRenderedDate = null; 
    }

    let lastDate = null;
    
    const previousScrollHeight = messagesContainer.scrollHeight;
    
    messages.forEach(message => {
        if (document.querySelector(`[data-message-id="${message._id}"]`)) {
            return;
        }

        const messageDate = new Date(message.createdAt);
        const formattedDate = messageDate.toLocaleDateString();

        // if (lastDate !== formattedDate) {
        //     // const systemMessageElement = document.createElement("div");
        //     // systemMessageElement.classList.add("message", "system-message");
        //     // systemMessageElement.textContent = formattedDate;

        //     prepend ? messagesContainer.prepend(systemMessageElement) : messagesContainer.appendChild(systemMessageElement);
        //     lastDate = formattedDate;
        // }

        const messageElement = document.createElement("div");
        messageElement.dataset.messageId = message._id;
        messageElement.dataset.createdAt = message.createdAt;

        const senderId = message.sender?._id || message.sender;

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

        if (prepend) {
            messagesContainer.prepend(messageElement);
        } else {
            messagesContainer.appendChild(messageElement);
        }
    });

    if (prepend) {
        requestAnimationFrame(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight - previousScrollHeight;
        });
    }
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

        const response = await fetch(url, { method: 'GET' });
        const responseJSON = await response.json();

        if (response.status === 200 && responseJSON.status === "success") {
            if (responseJSON.messagesList.length > 0) {
                updateChatMessages(responseJSON.messagesList);

                const lastMessage = responseJSON.messagesList[responseJSON.messagesList.length - 1];

                const createdAt = lastMessage.updatedAt || lastMessage.createdAt; 
                if (createdAt) {
                    const parsedDate = new Date(createdAt);
                    if (!isNaN(parsedDate.getTime())) {
                        if (!lastMessageTimestamp || new Date(lastMessageTimestamp) < parsedDate) {
                            lastMessageTimestamp = parsedDate.toISOString();
                        }
                    } else {
                        console.error(createdAt);
                    }
                } else {
                    console.error(lastMessage);
                }
            } else {

            }
        } else {
            console.log(`Polling error: ${response.status}`, responseJSON);
        }
    } catch (error) {
        console.error("Polling error:", error);
    }
}

setInterval(pollMessages, 3000);



async function pollChats() {
    try {
        const url = `/chats/` + (lastChatTimestamp ? `?lastChatTimestamp=${lastChatTimestamp}` : "");

        const response = await fetch(url, { method: 'GET' });
        const responseJSON = await response.json();

        if (response.status === 200 && responseJSON.status === "success") {
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
    const chatContainer = document.querySelector(".chats-list");
    if (!append) {
        chatContainer.innerHTML = "";
    }

    const existingChatIds = new Set(
        [...chatContainer.children].map(chat => chat.dataset.chatId)
    );

    chats.forEach(chat => {
        if (existingChatIds.has(chat._id)) {
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

async function loadMessages(initialLoad = false) {
    if (isFetching) return;  // Проверка, чтобы избежать дублирующихся запросов
    isFetching = true;

    const chatId = selectedChat?.dataset?.chatId;
    if (!chatId) {
        isFetching = false;
        return;
    }

    // Если перезагружаем все сообщения (например, при очистке поиска)
    if (initialLoad) {
        currentPage = 1;  // Сбрасываем пагинацию
        hasMoreMessages = true;
        messagesContainer.innerHTML = ""; // Очищаем сообщения перед полной загрузкой
    }

    try {
        console.log(`Загружаем сообщения для чата ${chatId}, страница ${currentPage}...`);
        
        const response = await fetch(`/messages/?chatId=${chatId}&page=${currentPage}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const responseJSON = await response.json();

        if (response.status === 200 && responseJSON.status === "success") {
            const messages = responseJSON.messagesList;
            hasMoreMessages = responseJSON.hasMore;

            if (messages.length > 0) {
                console.log(`Получено ${messages.length} сообщений`);
                renderChatMessages(messages.reverse(), !initialLoad, true); 
                currentPage++; // Увеличиваем номер страницы только при постраничной загрузке
            } else {
                console.log("Нет новых сообщений");
            }
        } else {
            console.log("Ошибка загрузки сообщений:", responseJSON);
        }
    } catch (error) {
        console.error("Ошибка загрузки сообщений:", error);
    }

    isFetching = false;
}


messagesContainer?.addEventListener('scroll', async () => {
    if (messagesContainer.scrollTop <= 10 && hasMoreMessages && !isFetching) {
        await loadMessages();
    }
});


document.addEventListener('DOMContentLoaded', async () => {
    if (!messagesContainer) {
        return;
    }
    await loadMessages(true);
});