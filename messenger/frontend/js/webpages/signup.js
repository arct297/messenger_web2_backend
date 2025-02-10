document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const staySignedIn = document.getElementById('stay-signed-in').checked;

    const signupResultElement = document.getElementById('signup-result');
    const errorMessageElement = document.getElementById('error-message'); // Element for displaying error messages

    function displaySignupMessage(message, type = 'error') {
        errorMessageElement.textContent = message;
        errorMessageElement.style.display = 'block';
        errorMessageElement.style.color = type === 'success' ? 'green' : 'red';
    }

    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password, email, username, staySignedIn })
        });

        const result = await response.json();

        if (response.ok) {
            displaySignupMessage('Signup successful!', 'success');
            setTimeout(() => {
                window.location.href = '/auth/login';
            }, 1000);
        } else {
            displaySignupMessage(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        displaySignupMessage('An error occurred. Please try again.');
    }
});
