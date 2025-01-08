

const token = localStorage.getItem('token');
const topicForm = document.getElementById('topicForm');
const topics = document.getElementById('topics');

if (token) {

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


