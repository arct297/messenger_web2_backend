document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded and script is running!");

    // Getting all necessary elements
    const elements = {
        avatar: document.getElementById("avatar"),
        avatarUpload: document.getElementById("avatarUpload"),
        usernameInput: document.getElementById("usernameInput"),
        saveChanges: document.getElementById("saveChanges"),
        updateProfile: document.getElementById("updateProfile"),
        updateModal: document.getElementById("updateModal"),
        confirmUpdate: document.getElementById("confirmUpdate"),
        cancelUpdate: document.getElementById("cancelUpdate"),
    };

    // Debugging: Log missing elements
    let missingElements = Object.keys(elements).filter(key => !elements[key]);
    if (missingElements.length > 0) {
        console.error(`❌ Error: Missing elements: ${missingElements.join(", ")}`);
        console.log("📌 Check your HTML: Are these IDs correct?");
        console.log("🔎 Open DevTools (F12) → Console and check with document.getElementById('missing_id')");
        return;
    }

    console.log("✅ All elements found!");

    // ✅ Avatar Upload Handling
    elements.avatar.addEventListener("click", () => elements.avatarUpload.click());

    elements.avatarUpload.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("avatar", file);

            try {
                const response = await fetch("/settings", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (response.ok) {
                    elements.avatar.src = data.avatarUrl;
                    alert("✅ Avatar uploaded successfully!");
                } else {
                    alert("❌ Failed to upload avatar: " + data.message);
                }
            } catch (error) {
                console.error("❌ Error uploading avatar:", error);
            }
        }
    });

    // ✅ Open update confirmation modal
    elements.updateProfile.addEventListener("click", () => {
        elements.updateModal.style.display = "block";
    });

    // ✅ Confirm profile update
    elements.confirmUpdate.addEventListener("click", async () => {
        const newUsername = elements.usernameInput.value.trim();
        if (newUsername === "") {
            alert("❌ Username cannot be empty!");
            return;
        }

        try {
            const response = await fetch("/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: newUsername }),
            });

            if (response.ok) {
                document.getElementById("username").textContent = newUsername;
                alert("✅ Profile updated successfully!");
                elements.updateModal.style.display = "none";
            } else {
                alert("❌ Failed to update profile.");
            }
        } catch (error) {
            console.error("❌ Error updating profile:", error);
        }
    });

    // ✅ Close update modal
    elements.cancelUpdate.addEventListener("click", () => {
        elements.updateModal.style.display = "none";
    });
});
