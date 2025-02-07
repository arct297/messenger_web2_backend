// Frontend: settings.js

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("settings-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Fetch user data
    async function loadUserData() {
        const response = await fetch("/settings/user");
        const data = await response.json();
        nameInput.value = data.name;
        emailInput.value = data.email;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const updatedData = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
        };

        const response = await fetch("/settings/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            alert("Settings updated successfully!");
        } else {
            alert("Error updating settings");
        }
    });

    loadUserData();
});
