document.addEventListener("DOMContentLoaded", () => {
    const avatar = document.getElementById("avatar");
    const avatarUpload = document.getElementById("avatarUpload");
    const usernameInput = document.getElementById("usernameInput");
    const saveChanges = document.getElementById("saveChanges");

    // Загрузка аватара
    avatar.addEventListener("click", () => avatarUpload.click());

    avatarUpload.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("avatar", file);

            try {
                const response = await fetch("/api/settings/avatar", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (response.ok) {
                    avatar.src = data.avatarUrl;
                } else {
                    alert("Failed to upload avatar");
                }
            } catch (error) {
                console.error("Error uploading avatar:", error);
            }
        }
    });

    // Сохранение имени
    saveChanges.addEventListener("click", async () => {
        const newUsername = usernameInput.value;

        if (newUsername.trim() === "") return alert("Username cannot be empty!");

        try {
            const response = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: newUsername }),
            });

            if (response.ok) {
                alert("Settings updated successfully!");
            } else {
                alert("Failed to update settings.");
            }
        } catch (error) {
            console.error("Error updating settings:", error);
        }
    });
});
