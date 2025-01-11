const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const isAdmin = document.getElementById('isAdmin').checked;

    const formData = {
        email,
        username,
        password,
        isAdmin
    };

    try{
        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok){
            const result = await response.json();
            console.log(result);
            window.location = "index.html";
        }else{
            const error = await response.json();
            console.log(error); 
        }
    }catch(err){
        console.log(err);
    }



});