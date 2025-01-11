

let token = localStorage.getItem('token');
//let token = null
const topicForm = document.getElementById('topicForm');
const topics = document.getElementById('topics');
const loginForm = document.getElementById('loginForm');


const fetchTopics = async () => {
    try {
        const response = await fetch('/api/topics', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const topicsData = await response.json();
            topics.innerHTML = '';
            topicsData.forEach(topic => {
                const topicElement = document.createElement('div');
                topicElement.classList.add('topic');
                topicElement.innerHTML = `
                    <h3>${topic.title}</h3>
                    <p>${topic.content}</p>
                    <p><strong>Posted by:</strong> ${topic.username}</p>
                    <p><strong>Created at:</strong> ${new Date(topic.createdAt).toLocaleString()}</p>
                    <button id="deleteTopic" data-id="${topic._id}">Delete</button>
                    `;
                topics.appendChild(topicElement);


                const deleteButton = topicElement.querySelector('#deleteTopic');
                deleteButton.addEventListener('click', async () => {
                    try {
                        const deleteResponse = await fetch(`/api/topic/${topic._id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (deleteResponse.ok) {
                            alert('Topic deleted successfully');
                            fetchTopics();
                        } else {
                            const error = await deleteResponse.json();
                            alert(error.message);
                        }
                    } catch (err) {
                        console.log(err);
                    }
                });
            });
        } else {
            console.log('Failed to fetch topics');
        }
    } catch (err) {
        console.log(err);
    }





};

fetchTopics()




if (token) {
    console.log("noin")
    //loginForm.style.display = 'none';
    topicForm.style.display = 'block';


    const topicTitleInput = document.createElement('input');
    topicTitleInput.type = 'text';
    topicTitleInput.id = 'topicTitle';
    topicTitleInput.placeholder = 'Enter topic title';
    topicForm.appendChild(topicTitleInput);

    const topicTextArea = document.createElement('textarea');
    topicTextArea.id = 'topicText';
    topicTextArea.placeholder = 'Enter topic content';
    topicForm.appendChild(topicTextArea);

    const postTopicButton = document.createElement('button');
    postTopicButton.id = 'postTopic';
    postTopicButton.textContent = 'Post Topic';
    topicForm.appendChild(postTopicButton);

    postTopicButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const topicTitle = document.getElementById('topicTitle').value;
        const topicText = document.getElementById('topicText').value;

        const formData = {
            title: topicTitle,
            content: topicText
        };

        try {
            const response = await fetch('/api/topic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
            } else {
                const error = await response.json();
                console.log(error);
            }
        } catch (err) {
            console.log(err);
        }


    });

}





loginForm.addEventListener('submit', async (e) => {

    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
        email,
        password
    };

    try{
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok){
            const result = await response.json();
            localStorage.setItem('token', result.token);
            console.log(token, "tokeni :)")
            window.location.reload();
        }else{
            const error = await response.json();
            console.log(error);
        }
    }catch (err){
        console.log(err);


    }

    
});

