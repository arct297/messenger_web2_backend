document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const staySignedIn = document.getElementById('stay-signed-in').checked;

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
            alert('Signup successful!');
            window.location.href = '/auth/login';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});