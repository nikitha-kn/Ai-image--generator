// import fetch from 'node-fetch';
const genForm = document.querySelector(".gen-form");
const imgGallery = document.querySelector(".img-gal");
const genBtn = genForm.querySelector(".gen-btn");

const token= "API_KEY";
let isImageGenerating = false;

const updateImgCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imgGallery.querySelectorAll(".img-c")[index];
        const imgElement = imgCard.querySelector("img");
        const dlBtn = imgCard.querySelector(".dl-btn");

        const aiGenImg = `data:image/jpeg;base64, ${imgObject.b64_json}`;
        imgElement.src = aiGenImg;

        imgElement.onload = () =>{
            imgCard.classList.remove("loading");
            dlBtn.setAttribute("href", aiGenImg);
            dlBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}
const generateAiImages = async(userPrompt, userImgQty ) =>{
    try{
        const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image" ,{
            method:"POST",
            mode:"no-cors",
            headers: {
                Authorization: 'Bearer ${token}'      
            },
            body: JSON.stringify({
                prompt: userPrompt,
                inputs: parseInt(userImgQty),
                size:"512x512"
            })
        });
        
       
        if(!response.ok) throw new Error("Failed to generate images! Please try again!!");

        const {data} = await response.json();
        updateImgCard([...data]);
    }catch(error){
        alert(error.message);
    }finally{
        genBtn.removeAttribute("disabled");
        genBtn.innerText = "Generate";
        isImageGenerating = false;
    }
}
const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;

    const userPrompt = e.srcElement[0].value;
    const userImgQty = parseInt(e.srcElement[1].value);

    genBtn.setAttribute("disables", true);
    genBtn.innerText = "Generating...";
    isImageGenerating = true;

    const imgCardMark = Array.from({length: userImgQty}, () =>
        ` <div class="img-c loading">
    <img src="/AI_IMAGE_GENERATOR/images/loading.svg" alt="AI generated image">
    <a href="#" class="dl-btn">
      <img src="/AI_IMAGE_GENERATOR/images/download.svg" alt="download icon">
    </a>
  </div>`
    ).join("");
    
    imgGallery.innerHTML = imgCardMark;
    generateAiImages(userPrompt, userImgQty);
}
genForm.addEventListener("submit" , handleFormSubmission);
