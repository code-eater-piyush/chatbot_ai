let prompt=document.querySelector("#prompt");
let chatContainer=document.querySelector(".chat-container");
let imagebtn=document.querySelector("#image");
let imageinput=document.querySelector("#image input");
let image=document.querySelector("#image img");


const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyB0vyBBFWJprw1914BWZCjNS_g0ix_xxNI"



let user={
    message:null,
    file:{
        mime_type:null,
        data:null
    }
}

async function generateResponse(aichatBox) {


let text = aichatBox.querySelector(".ai-chat-area");




    let RequestOptions= {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({
            "contents": [
      {
        "parts": [
          {
            "text": user.message
          },(user.file.data?[{"inline_data":user.file}]:[])
        ]
      }
    ]
        })
            
    }
    
    try{
         let response = await fetch (Api_Url,RequestOptions)
         let data = await response.json()
         let apiResponse = data.candidates[0].content.parts[0].text.replace(/<[^>]*>/g, '').trim()
         text.innerHTML=apiResponse
         console.log(apiResponse)
    }
    catch(error){
        console.error(error);
       
    }

    finally{
        chatContainer.scrollTo({top: chatContainer.scrollHeight, behavior: "smooth"});
         image.src=`img.svg`
        image.classList.add("choose")
        user.file={}
    }


   
}

function createChatBox(html,classes) {
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}


function handleChatResponse(userMessage) {
    user.message=userMessage
    let html= `<img src="user.png" alt="" id="userav" width="50">
        <div class="user-chat-area">
            ${user.message}
            ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}"  class="chooseimg" />`:''}
          </div>`
          prompt.value=""
    let userChatBox=createChatBox(html,"user-chat-box")
    chatContainer.appendChild(userChatBox)


chatContainer.scrollTo({top: chatContainer.scrollHeight, behavior: "smooth"});



    setTimeout(() => {
        let html= ` <img src="bot.png" alt="Bot Avatar" id="botav" width="50">
        <div class="ai-chat-area">
        <img src="load.gif" alt="" class="load" width="20px">
        </div>`
        let aichatBox=createChatBox(html,"ai-chat-box")
        chatContainer.appendChild(aichatBox)
        generateResponse(aichatBox)

    

},600)
}


prompt.addEventListener("keydown", (e) => {
    if(e.key=="Enter"){
        handleChatResponse(prompt.value)
    }
  
})

imageinput.addEventListener("change", (e) => {
    const file = imageinput.files[0]
    if(!file) return
    let reader = new FileReader()
    reader.onload=(e)=> {
        let base64string= e.target.result.split(",")[1]
        user.file={
            mime_type : file.type,
            data: base64string
        }
         image.src=`data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")


    }
    

    reader.readAsDataURL(file)
    
    })



imagebtn.addEventListener("click", () => {
    imagebtn.querySelector("input").click()
 })