// auth.js
const API_URL = 'http://localhost:3000/api/auth';


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('magicToken', data.token); // Store the session
            window.location.href = '../index.html'; // Redirect to main site
        } else {
            alert(data.message);
        }
    });

});


toggleAuth = () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm.style.display === 'none') {
        registerForm.style.display = 'flex';
        loginForm.style.display = 'none';
    } else {
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const wizardname = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wizardname, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please log in.');
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'flex';
        } else {
            alert(data.message);
        }
    });
});

function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        const x = Math.random() * 100;
        const y = Math.random() * 100;

        const size = Math.random() * 2 + 1;

        const duration = Math.random() * 5 + 4;

        star.style.top = `${y}%`;
        star.style.left = `${x}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${duration}s`;

        starsContainer.appendChild(star);

        setTimeout(() => {
            star.remove();
        }, duration * 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
        createStars();

    setInterval(createStars, 800);
});
