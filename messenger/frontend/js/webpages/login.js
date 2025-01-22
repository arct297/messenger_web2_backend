const resultElement = document.getElementById('result');

const loginElement = document.getElementById('login');
const passwordElement = document.getElementById('password');
const staySignedInElement = document.getElementById('stay-signed-in');

function displayUnsuccessfullLogin(text) {
    resultElement.textContent = text;
    resultElement.style.display = 'block';
    loginElement.value = '';
    passwordElement.value = '';
    staySignedInElement.checked = false;
}


document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const login = loginElement.value;
    const password = passwordElement.value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });

        const responseJSON = await response.json();
        
        if (response.status == 200 && responseJSON.status == "success") {
            window.location.href = "/messenger/"
       
        } else if (response.status == 400 && responseJSON.status == "error") {
            return displayUnsuccessfullLogin('All fields (login, password) are required!');

        } else if (response.status == 401 && responseJSON.status == "warning") {
            return displayUnsuccessfullLogin('Wrong login or password. Try again!');

        } else {
            return displayUnsuccessfullLogin('Some error on server. Please, try later!');
        }
        
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});

