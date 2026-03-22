async function renderFrames(){
    const container = document.getElementById('image-container');
    const totalFrames = 33;
    const fps = 8;
    const delay = 2500;

    // Creates a new image to be appended dynamically to the div render
    const img = document.createElement('img');
    // Places the image inside the div
    container.appendChild(img);

    // Loop infinetly
    while(true){ 
        for (let i = 1; i <= totalFrames; i++){
            const frameNumber = String(i);          //Converts the current number in the loop to a string
            img.src = `frames/frame-${frameNumber}.png`;    //gets the image from the folder

            //Wait for each frame to render and not only show immediately
            await new Promise(resolve => setTimeout(resolve, 1000 / fps));
        }

        //Wait 3 seconds after finishing all frames
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

function textDecoration(){
    // Wrap every letter in a span
    var textWrapper = document.querySelector('.ml7 .letters');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({loop: true})
    .add({
    targets: '.ml7 .letter',
    translateY: ["1.1em", 0],
    translateX: ["0.55em", 0],
    translateZ: 0,
    rotateZ: [180, 0],
    duration: 1100,
    easing: "easeOutExpo",
    delay: (el, i) => 50 * i
    }).add({
    targets: '.ml7',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 5000
    });
}

renderFrames();
textDecoration();  

