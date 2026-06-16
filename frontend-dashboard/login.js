document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.querySelector('.login-btn');

    errorMessage.textContent = '';
    submitBtn.textContent = 'VERIFICANDO...';
    submitBtn.style.opacity = '0.7';

    try {
        const response = await fetch('http://localhost:8085/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput
            })
        });

        if (response.ok) {
            const data = await response.json();
            // Guardar el token JWT
            localStorage.setItem('jwt_token', data.token);
            // Redirigir al dashboard
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Acceso denegado. Credenciales inválidas.';
        }
    } catch (error) {
        console.error('Error durante el login:', error);
        errorMessage.textContent = 'Fallo de conexión con el núcleo principal.';
    } finally {
        submitBtn.textContent = 'AUTENTICAR SISTEMA';
        submitBtn.style.opacity = '1';
    }
});
