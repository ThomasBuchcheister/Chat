const socket = io();

let username = null;

if(!username){
    Swal.fire({
        title: 'Welcome to ChatOnline',
        text:'Insert your username',
        input: 'text',
        imputValidator: (value) =>{
            if(!value) return 'Your username is require'
        }
      })
      .then((input)=>{
        username = input.value;
        socket.emit('newUser', username);
    })
}


const message = document.getElementById('message') 
const btn = document.getElementById('send')
const output = document.getElementById('output')
const actions = document.getElementById('actions')

btn.addEventListener('click', ()=>{
    socket.emit('chat:message', {
        username: username,
        message: message.value 
    })
    message.value = "";
})

socket.on('messages', (arrayMsgs)=>{
    actions.innerHTML = '';
    
    const chatRender = arrayMsgs.map((msg)=>{
        return `<p><strong>${msg.username}</strong>: ${msg.message}</p>`
    }).join('   ')
    output.innerHTML = chatRender
})

socket.on('newUser', (user)=>{
    Toastify({
        text: `🟢${user} is logged in`,
        duration: 3000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style:{
            backgroud: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast()
})

message.addEventListener('keypress', ()=>{
    socket.emit('chat:typing',username)
})

socket.on('chat:typing', (user)=>{
    actions.innerHTML = `<p>${user} is writting a message...</p>`
})