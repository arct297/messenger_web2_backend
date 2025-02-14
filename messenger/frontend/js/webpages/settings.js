document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded and script is running!");

    const usernameElement = document.getElementById("username");
    const usernameInput = document.getElementById("usernameInput");
    const saveChanges = document.getElementById("saveChanges");
    const notificationsButton = document.getElementById("notifications");
    const themeButton = document.getElementById("theme");
    const privacyButton = document.getElementById("privacy");

    if (!usernameElement || !usernameInput || !saveChanges) {
        console.error("Missing elements: username, usernameInput, or saveChanges");
        return;
    }

    console.log("All elements found!");

    try {
        const response = await fetch("/settings/r");
        const data = await response.json();
        if (response.ok) {
            usernameElement.textContent = data.username;
            usernameInput.value = data.username;
        } else {
            console.error("Failed to fetch user settings:", data.message);
        }
    } catch (error) {
        console.error("Error fetching user settings:", error);
    }

    saveChanges.addEventListener("click", async () => {
        const newUsername = usernameInput.value.trim();
        if (newUsername === "") {
            alert(" Username cannot be empty!");
            return;
        }

        try {
            const response = await fetch("/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: newUsername }),
            });

            const data = await response.json();

            if (response.ok) {
                usernameElement.textContent = newUsername;
                // alert(" Username updated successfully!");
            } else {
                console.log("Failed to update username: " + data.message);
            }
        } catch (error) {
            console.error("Error updating username:", error);
        }
    });

    notificationsButton.addEventListener("click", () => {
        // alert("🔔 Notifications settings will be available soon!");
    });

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        // alert("🎨 Theme changed!");
    });

    privacyButton.addEventListener("click", () => {
        // alert("🔒 Privacy settings will be available soon!");
    });
});