let currentQuestion = 0;
let userChoices = [];
let questionsData;
let canvas = document.getElementById('quiz-canvas');
let ctx = canvas.getContext('2d');
const aspectRatio = 9 / 16;
let screenshotButtonVisible = false;
let allAnswered = false;
let riveAnimation;
let isLoading = true;
let playerNameInput = false;
let playerName = null;
let riveAnimLoaded = false;
preloadImages.images = null;


// Create a separate canvas for Rive animation
const riveCanvas = document.createElement('canvas');
const riveCtx = riveCanvas.getContext('2d');

function setCanvasSize() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const screenWidth = window.innerWidth * devicePixelRatio;
    const screenHeight = window.innerHeight * devicePixelRatio;
    let canvasWidth, canvasHeight;



    // Calculate canvas size while maintaining aspect ratio
    if (screenWidth / screenHeight > aspectRatio) {
        canvasWidth = Math.floor(screenHeight * aspectRatio);
        canvasHeight = Math.floor(screenHeight);
    } else {
        canvasWidth = Math.floor(screenWidth);
        canvasHeight = Math.floor(screenWidth / aspectRatio);
    }

    canvas.width = canvasWidth;
    canvas.height = screenHeight; // Set canvas height to full screen height
    canvas.style.width = (canvasWidth / devicePixelRatio) + 'px'; // Set display width and height
    canvas.style.height = (screenHeight / devicePixelRatio) + 'px'; // Set display height to full screen height
    if (riveAnimLoaded) {
        loadingscreenRive.resizeDrawingSurfaceToCanvas();
    }
    riveCanvas.width = canvasWidth;
    riveCanvas.height = screenHeight; // Set canvas height to full screen height
    riveCanvas.style.width = (canvasWidth / devicePixelRatio) + 'px'; // Set display width and height
    riveCanvas.style.height = (screenHeight / devicePixelRatio) + 'px'; // Set display height to full screen height

    // Redraw content after resizing
    if (!playerNameInput && !isLoading) {
        showInputField();
    }
    else if (questionsData && !isLoading) {  // Check isLoading flag
        if (currentQuestion < questionsData.length) {
            displayQuestion(currentQuestion);
        } else {
            showResult(getResult());
        }
    }
}

// Call setCanvasSize initially and whenever the window is resized
setCanvasSize();
window.addEventListener('resize', setCanvasSize);




const loadingscreenRive = new rive.Rive({
    src: 'personalitytest.riv',
    canvas: canvas,
    autoplay: false,
    shouldDisableRiveListeners: true,

    artboard: 'Logo',
    stateMachines: 'Logo',
    onLoad: () => {
        console.log('Rive file loaded successfully.');
        riveAnimLoaded = true;
        loadingscreenRive.resizeDrawingSurfaceToCanvas();
    },
    onError: (error) => {
        console.error('Error loading the Rive file:', error);
    }
});


loadingscreenRive.on('riveevent', (event) => {
    if (event.data.name === "Loadscreendone") {
        console.log('Loading screen animation done.');
        isLoading = false;
    }
});


function handleLoadingComplete() {
    if (!isLoading) {
        clearInterval(loadingInterval);
        loadingscreenRive.cleanup();

        // Example: Displaying the input field when loading is complete
        if (!playerNameInput) {
            showInputField();
        } else {
            displayQuestion(currentQuestion);
        }
    }
}
const loadingInterval = setInterval(handleLoadingComplete, 100);

// Fetch questions from JSON file
function initialize() {
    // Fetch questions from JSON file
    
    // Play the Rive animation corresponding to the result
    if (isLoading) {
        loadingscreenRive.play("Logo");
    }

    // Preload images
    preloadImages()
        .then(images => {
            preloadImages.images = images; // Store preloaded images
        })
        .catch(error => console.error('Error preloading images:', error));

    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questionsData = data;
            // if (!isLoading) {  // Ensure loading screen has finished
            //     displayQuestion(currentQuestion);
            // }
            document.body.appendChild(riveCanvas);
            riveCanvas.className = 'rive-canvas';
            // // Position the riveCanvas behind the canvas
            // riveCanvas.style.position = 'absolute';
            // riveCanvas.style.top = '50%';
            // riveCanvas.style.left = '50%';
            // riveCanvas.style.transform = 'translate(-50%, -50%)';
            // riveCanvas.style.zIndex = '-1';
        })
        .catch(error => console.error('Error fetching questions:', error));
}
const inputContainer = document.querySelector('.input-container');
const inputField = document.getElementById('nameInput');
const submitButton = document.getElementById('submitButton');

// Function to show the input field and submit button
function showInputField() {
    inputContainer.classList.remove('hidden');
    // Click event for submit button
    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        submitButton.disabled = true;
        handleSubmitName();
    });
    // submitButton.addEventListener('touchend', (event) => {
    //     event.preventDefault(); // Prevent default touch behavior
    //     handleSubmitName();
    // });


    // Disable canvas to prevent interaction
    canvas.disabled = true;
}

function handleSubmitName() {
    playerName = inputField.value.trim();
    if (playerName !== '') {
        // Process player name (e.g., save to database)
        console.log('Player Name:', playerName);
        UpdateDisplayName();
        setTimeout(function () {
            console.log("One second has passed!");
            // Place your code here that you want to execute after one second
            console.log(playerName);
            // Hide input field and submit button
            if (!playerNameInput) {
                alert('Name is not available');
                submitButton.disabled = false;
            }
        }, 2000); // 1000 milliseconds = 1 second
    } else {
        alert('Please enter your name.');
        submitButton.disabled = false;
    }
}

// Function to hide the input field and submit button
function hideInputField() {
    inputContainer.classList.add('hidden');
}

function RemoveNameForm() {
    if (playerNameInput && inputField && submitButton) {
        hideInputField();
        displayQuestion(currentQuestion);
        canvas.disabled = false;
        clearInterval(removeNameFormInterval); // Clear the interval
    }
}
const removeNameFormInterval = setInterval(RemoveNameForm, 100);

function wrapText(context, text, maxWidth) {
    const words = text.split(' ');
    let lines = [];
    let line = '';

    words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth) {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    });

    lines.push(line);
    return lines;
}

// Function to preload all images
async function preloadImages() {
    const imagePromises = [];
    for (let i = 1; i <= 10; i++) { // Assuming there are 10 images numbered from 1.png to 10.png
        const imageUrl = `images/${i}.png`;
        imagePromises.push(preloadImage(imageUrl));
    }
    return Promise.all(imagePromises);
}

// Function to preload an image
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
    });
}
async function displayQuestion(questionIndex) {
    const question = questionsData[questionIndex];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // const backgroundImage = await preloadImage(`images/${questionIndex + 1}.png`);
    // // Preload all images
    // if (!preloadImages.images) {
    //     preloadImages.images = await preloadImages();
    // }

    const backgroundImage = preloadImages.images[questionIndex];
    const imageX = (canvas.width - canvas.width * 1.366) / 2;
    const imageY = (canvas.height - canvas.height * 1.024) / 2;
    ctx.drawImage(backgroundImage, imageX, imageY, canvas.width * 1.366, canvas.height * 1.024);

    // Display the quiz question at the bottom of the canvas
    const questionFontSize = canvas.width * 0.08; // Adjust font size based on canvas width
    ctx.font = `bold ${questionFontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f5e74';
    // Wrap the question text
    const questionLines = wrapText(ctx, question.quiz, canvas.width * 0.8);

    // Calculate vertical position for the wrapped text
    const lineHeight = questionFontSize * 1.2; // Line height including padding
    const textY = canvas.height - canvas.height * 0.85 - (lineHeight * (questionLines.length - 1)) / 2;

    // Draw each line of the wrapped text
    questionLines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, textY + index * lineHeight);
    });

    // Calculate button positions and draw buttons
    drawButtons(question);
}
// Function to display a question
// function displayQuestion(questionIndex) {
//     const question = questionsData[questionIndex];
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     const backgroundImage = new Image();
//     backgroundImage.src = `images/${questionIndex+1}.png`; // Assuming your images are named from 1.png to 10.png
//     backgroundImage.onload = () => {
        

//         const imageX = (canvas.width - canvas.width * 1.366) / 2;
//         const imageY = (canvas.height - canvas.height * 1.024) / 2;
//         ctx.drawImage(backgroundImage, imageX, imageY, canvas.width * 1.366, canvas.height * 1.024);

//         // Display the quiz question at the bottom of the canvas
//         const questionFontSize = canvas.width * 0.08; // Adjust font size based on canvas width
//         ctx.font = `bold ${questionFontSize}px Arial`;
//         ctx.textAlign = 'center';
//         ctx.fillStyle = '#0f5e74';
//         // Wrap the question text
//         const questionLines = wrapText(ctx, question.quiz, canvas.width * 0.8);

//         // Calculate vertical position for the wrapped text
//         const lineHeight = questionFontSize * 1.2; // Line height including padding
//         const textY = canvas.height - canvas.height * 0.85 - (lineHeight * (questionLines.length - 1)) / 2;

//         // Draw each line of the wrapped text
//         questionLines.forEach((line, index) => {
//             ctx.fillText(line, canvas.width / 2, textY + index * lineHeight);
//         });

//         // Calculate button positions and draw buttons
//         drawButtons(question);
//     };
// }

// Function to calculate button positions and draw buttons
function drawButtons(question) {
    const buttonSpacing = canvas.height * -0.15; // Define spacing between buttons
    let startY = canvas.height - canvas.height * 0.35; // Starting Y position for buttons
    question.answers.forEach((answer, index) => {
        // Calculate button position
        const buttonWidth = canvas.width * 0.8;
        let buttonHeight = canvas.height * 0.05; // Initial height
        const buttonX = (canvas.width - buttonWidth) / 2;
        const buttonY = startY - (index + 1) * (buttonHeight + buttonSpacing);

        // Calculate text dimensions
        const padding = canvas.width * 0.02; // Padding between button and text
        const buttonFontSize = canvas.width * 0.03; // Adjust font size based on canvas width
        ctx.font = `bold ${buttonFontSize}px Arial`;
        const lines = wrapText(ctx, answer.answerText, buttonWidth - padding * 2)
        buttonHeight += (lines.length - 1) * (canvas.height * 0.02); // Increase button height for each additional line

        // // Draw button background
        // ctx.fillStyle = answer.hover ? '#bbb' : '#ddd';
        // ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        const cornerRadius = 20; // Adjust corner radius as needed
        ctx.beginPath();
        ctx.moveTo(buttonX + cornerRadius, buttonY);
        ctx.lineTo(buttonX + buttonWidth - cornerRadius, buttonY);
        ctx.arcTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + cornerRadius, cornerRadius);
        ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - cornerRadius);
        ctx.arcTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - cornerRadius, buttonY + buttonHeight, cornerRadius);
        ctx.lineTo(buttonX + cornerRadius, buttonY + buttonHeight);
        ctx.arcTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - cornerRadius, cornerRadius);
        ctx.lineTo(buttonX, buttonY + cornerRadius);
        ctx.arcTo(buttonX, buttonY, buttonX + cornerRadius, buttonY, cornerRadius);
        ctx.closePath();
        ctx.fillStyle = answer.hover ? '#bbb' : 'black';
        ctx.fill();

        // Draw button text
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center'; // Align text to the center
        const textY = buttonY + buttonHeight / 2; // Center vertically
        lines.forEach((line, index) => {
            ctx.fillText(line, buttonX + buttonWidth / 2, textY + (index - (lines.length - 1) / 2) * (canvas.height * 0.02));
        });

        // Save button details for click detection
        answer.button = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        };
    });
}

// Function to redraw buttons with hover effect
function redrawButtons() {
    // Clear only the region occupied by the buttons
    const question = questionsData[currentQuestion];
    // question.answers.forEach((answer) => {
    //     ctx.clearRect(answer.button.x, answer.button.y, answer.button.width, answer.button.height);
    // });
    question.answers.forEach((answer) => {
        // Set up clipping path to clear only within the rounded rectangle shape
        const cornerRadius = 20; // Adjust corner radius as needed
        ctx.save(); // Save the current drawing state
        ctx.beginPath();
        ctx.moveTo(answer.button.x + cornerRadius, answer.button.y);
        ctx.lineTo(answer.button.x + answer.button.width - cornerRadius, answer.button.y);
        ctx.arcTo(answer.button.x + answer.button.width, answer.button.y, answer.button.x + answer.button.width, answer.button.y + cornerRadius, cornerRadius);
        ctx.lineTo(answer.button.x + answer.button.width, answer.button.y + answer.button.height - cornerRadius);
        ctx.arcTo(answer.button.x + answer.button.width, answer.button.y + answer.button.height, answer.button.x + answer.button.width - cornerRadius, answer.button.y + answer.button.height, cornerRadius);
        ctx.lineTo(answer.button.x + cornerRadius, answer.button.y + answer.button.height);
        ctx.arcTo(answer.button.x, answer.button.y + answer.button.height, answer.button.x, answer.button.y + answer.button.height - cornerRadius, cornerRadius);
        ctx.lineTo(answer.button.x, answer.button.y + cornerRadius);
        ctx.arcTo(answer.button.x, answer.button.y, answer.button.x + cornerRadius, answer.button.y, cornerRadius);
        ctx.closePath();
        ctx.clip();

        // Clear the button area
        ctx.clearRect(answer.button.x, answer.button.y, answer.button.width, answer.button.height);

        // Reset clipping path
        ctx.restore();
    });

    drawButtons(question);
}

// Function to handle answer selection
function selectAnswer(answerIndex) {
    userChoices.push(questionsData[currentQuestion].answers[answerIndex].answerType);
    currentQuestion++;
    if (currentQuestion < questionsData.length) {
        displayQuestion(currentQuestion);
    } else {
        allAnswered = true;
        showResult(getResult());
    }
}

// Load Rive animation
const riveInstance = new rive.Rive({
    src: 'personalitytest.riv',
    canvas: riveCanvas,
    autoplay: false,
    shouldDisableRiveListeners: true,

    stateMachines: 'ResultStateMachine', // Ensure this matches the name in your Rive file
    onLoad: () => {
        console.log('Rive file loaded and state machine ready');
        // Get the inputs for the state machine
        inputs = riveInstance.stateMachineInputs('ResultStateMachine');
        riveInstance.resizeDrawingSurfaceToCanvas();
    },
    onError: (error) => {
        console.error('Error loading the Rive file:', error);
    }
});

// Function to show the result
function showResult(personalityType) {
    // Clear the canvas
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    

    // Draw the personality result text
    const resultFontSize = canvas.width * 0.025; // Adjust font size based on canvas width
    ctx.font = `${resultFontSize}px Arial`;
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    let result = '';

    // Determine the result based on personality type
    switch (personalityType) {
        case 0:
            result = 'Mala';
            break;
        case 1:
            result = 'Gochujang';
            break;
        case 2:
            result = 'Tomyum';
            break;
        case 3:
            result = 'Gochujang';
            break;
        case 4:
            result = 'Gochujang';
            break;
        case 5:
            result = 'Gochujang';
            break;
        default:
            result = 'Unknown';
            break;
    }

    

    riveInstance.resizeDrawingSurfaceToCanvas();
    // Play the Rive animation corresponding to the result
    riveInstance.play("ResultStateMachine");
    if (inputs) {
        const inputName = result;
        const triggerInput = inputs.find(i => i.name === inputName);
        if (triggerInput) {
            triggerInput.fire(); // Trigger the input to play the animation
            console.log('Trigger input successful:', inputName);
        } else {
            console.log('Trigger input not found:', inputName);
        }
    } else {
        console.log('State machine inputs not loaded or state machine not found');
    }

    // Draw the result text on the canvas
    const resultTextX = canvas.width * 0.75;
    const resultTextY = canvas.height - canvas.height * 0.09;
    const nameTextX = canvas.width * 0.75;
    const nameTextY = canvas.height - canvas.height * 0.11;
    const originalFont = ctx.font;

    // Set the font style for the bold and larger text
    ctx.font = `bold ${resultFontSize * 1.5}px Arial`; // Adjust font size as needed

    // Draw the bold and larger text for 'Hello, ' + playerName
    ctx.fillText('Hello, ' + playerName, nameTextX, nameTextY);

    // Revert back to the original font style
    ctx.font = originalFont;

    // Draw the regular text for 'Your Personality Type: ' + result
    ctx.fillText('Your Personality Type: ' + result, resultTextX, resultTextY);

    // Draw the screenshot button
    screenshotButtonVisible = true;
    drawScreenshotButton();
}

// Function to determine the final result
function getResult() {
    let mostCommonChoices = findMostCommonChoice(userChoices);
    let result = mostCommonChoices[0];
    if (mostCommonChoices.length > 1) {
        switch (mostCommonChoices[0]) {
            case 0:
                if (mostCommonChoices[1] == 1) {
                    result = 3;
                } else if (mostCommonChoices[1] == 2) {
                    result = 4;
                }
                break;
            case 1:
                if (mostCommonChoices[1] == 0) {
                    result = 3;
                } else if (mostCommonChoices[1] == 2) {
                    result = 5;
                }
                break;
            case 2:
                if (mostCommonChoices[1] == 0) {
                    result = 4;
                } else if (mostCommonChoices[1] == 1) {
                    result = 5;
                }
                break;
        }
    }
    return result;
}

// Function to find the most common choice
function findMostCommonChoice(choices) {
    const frequencyMap = {};
    let maxFrequency = 0;
    let mostCommonChoices = [];

    // Count frequencies of each choice
    choices.forEach(choice => {
        frequencyMap[choice] = (frequencyMap[choice] || 0) + 1;
        if (frequencyMap[choice] > maxFrequency) {
            maxFrequency = frequencyMap[choice];
        }
    });

    // Find choices with the highest frequency
    for (const choice in frequencyMap) {
        if (frequencyMap.hasOwnProperty(choice) && frequencyMap[choice] === maxFrequency) {
            mostCommonChoices.push(parseInt(choice));
        }
    }

    return mostCommonChoices;
}

// Function to take a screenshot
function takeScreenshot() {
    // Create a temporary canvas to draw the result without the screenshot button
    // Hide the screenshot button
    screenshotButtonVisible = false;
    ctx.clearRect(screenshotButtonPos.x, screenshotButtonPos.y, screenshotButtonPos.width, screenshotButtonPos.height);
    // const tempCanvas = document.createElement('canvas');
    // const tempCtx = tempCanvas.getContext('2d');
    // tempCanvas.width = canvas.width;
    // tempCanvas.height = canvas.height;
    // tempCtx.drawImage(riveCanvas, 0, 0);

    // // Draw the result on the main canvas
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(tempCanvas, 0, 0);

    // Convert the result to a data URL
    // const dataUrl = riveCanvas.toDataURL('image/png');
    // Create a temporary canvas to draw both canvases
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Set the temporary canvas size to match the main canvas size
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Draw the riveCanvas onto the temporary canvas
    tempCtx.drawImage(riveCanvas, 0, 0);

    // Draw the main canvas onto the temporary canvas
    tempCtx.drawImage(canvas, 0, 0);

    // Convert the result to a data URL
    const dataUrl = tempCanvas.toDataURL('image/png');
    // Generate the filename with the current time and date
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const formattedDate = `${day}/${month}/${year}-${hours}:${minutes}:${seconds}`;
    const filename = `YourPersonalityResult-${formattedDate}`;

    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.setAttribute('download', filename);

    // Trigger the download
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show the screenshot button again
    screenshotButtonVisible = true;
    drawScreenshotButton();
}
let screenshotButtonPos;
// Function to draw the screenshot button
function drawScreenshotButton(mouseX, mouseY) {
    if (screenshotButtonVisible) {
        // Draw the screenshot button background with appropriate color
        const buttonWidth = canvas.width * 0.3;
        const buttonHeight = canvas.height * 0.04;
        const buttonX = canvas.width * 0.1;
        const buttonY = canvas.height - canvas.height * 0.075;
        screenshotButtonPos = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        };
        const cornerRadius = 20; // Adjust corner radius as needed

        // Begin drawing the button
        ctx.beginPath();
        ctx.moveTo(buttonX + cornerRadius, buttonY); // Move to top-left corner
        ctx.lineTo(buttonX + buttonWidth - cornerRadius, buttonY); // Draw top edge
        ctx.arcTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + cornerRadius, cornerRadius); // Draw top-right corner
        ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - cornerRadius); // Draw right edge
        ctx.arcTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - cornerRadius, buttonY + buttonHeight, cornerRadius); // Draw bottom-right corner
        ctx.lineTo(buttonX + cornerRadius, buttonY + buttonHeight); // Draw bottom edge
        ctx.arcTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - cornerRadius, cornerRadius); // Draw bottom-left corner
        ctx.lineTo(buttonX, buttonY + cornerRadius); // Draw left edge
        ctx.arcTo(buttonX, buttonY, buttonX + cornerRadius, buttonY, cornerRadius); // Draw top-left corner
        ctx.closePath();

        const isHover = (
            mouseX >= buttonX &&
            mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY &&
            mouseY <= buttonY + buttonHeight
        );
        ctx.fillStyle = isHover ? '#ccc' : '#ddd'; // Change color on hover
        ctx.fill();

        // Draw button text with appropriate color
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        const buttonTextFontSize = canvas.width * 0.03; // Adjust font size based on canvas width
        ctx.font = `${buttonTextFontSize}px Arial`;
        ctx.fillText('Take a Screenshot', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 8);

        // Change cursor style on hover
        canvas.style.cursor = isHover ? 'pointer' : 'default';
    }
}
// Function to clear the canvas excluding the screenshot button area
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (screenshotButtonVisible && screenshotButtonPos) {
        drawScreenshotButton();
    }
}

// Function to handle mouse movement over buttons
canvas.addEventListener('mousemove', function (e) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const posX = (e.clientX - canvas.getBoundingClientRect().left) * devicePixelRatio;
    const posY = (e.clientY - canvas.getBoundingClientRect().top) * devicePixelRatio;
    handleMousemove(posX, posY);
});

// Function to handle input (mouse click or touch)
canvas.addEventListener('click', function (e) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const posX = (e.clientX - canvas.getBoundingClientRect().left) * devicePixelRatio;
    const posY = (e.clientY - canvas.getBoundingClientRect().top) * devicePixelRatio;
    handleInput(posX, posY);
});

// Function to handle touch start on buttons
canvas.addEventListener('touchstart', function (e) {
    e.preventDefault(); // Prevent default touch behavior
    const touch = e.changedTouches[0];
    const devicePixelRatio = window.devicePixelRatio || 1;
    const posX = (touch.clientX - canvas.getBoundingClientRect().left) * devicePixelRatio;
    const posY = (touch.clientY - canvas.getBoundingClientRect().top) * devicePixelRatio;
    handleMousemove(posX, posY);
}, false);

// Function to handle touch end
canvas.addEventListener('touchend', function (e) {
    e.preventDefault(); // Prevent default touch behavior
    const touch = e.changedTouches[0];
    const devicePixelRatio = window.devicePixelRatio || 1;
    const posX = (touch.clientX - canvas.getBoundingClientRect().left) * devicePixelRatio;
    const posY = (touch.clientY - canvas.getBoundingClientRect().top) * devicePixelRatio;
    handleInput(posX, posY);
}, false);

// Function to handle mouse movement over buttons
function handleMousemove(posX, posY) {
    if (!isLoading && playerNameInput) {
        if (!allAnswered && questionsData != null) {
            questionsData[currentQuestion].answers.forEach(answer => {
                if (
                    posX >= answer.button.x &&
                    posX <= answer.button.x + answer.button.width &&
                    posY >= answer.button.y &&
                    posY <= answer.button.y + answer.button.height
                ) {
                    answer.hover = true;
                } else {
                    answer.hover = false;
                }
            });
            redrawButtons();
        }
        else if (screenshotButtonVisible) {
            // drawScreenshotButton(posX, posY)
            // // Check if the click/touch is within the screenshot button
            // if (
            //     posX >= screenshotButtonPos.x &&
            //     posX <= screenshotButtonPos.x + screenshotButtonPos.width &&
            //     posY >= screenshotButtonPos.y &&
            //     posY <= screenshotButtonPos.y + screenshotButtonPos.height
            // ) {
                drawScreenshotButton(posX, posY);
            // }
        }
    }
}

// Function to handle input (mouse click or touch)
function handleInput(posX, posY) {
    if (!isLoading && playerNameInput) {
        if (screenshotButtonVisible) {
            if (
                posX >= screenshotButtonPos.x &&
                posX <= screenshotButtonPos.x + screenshotButtonPos.width &&
                posY >= screenshotButtonPos.y &&
                posY <= screenshotButtonPos.y + screenshotButtonPos.height
            ) {
                takeScreenshot();
            }
        } else if (!allAnswered && questionsData != null) {
            questionsData[currentQuestion].answers.forEach((answer, index) => {
                if (
                    posX >= answer.button.x &&
                    posX <= answer.button.x + answer.button.width &&
                    posY >= answer.button.y &&
                    posY <= answer.button.y + answer.button.height
                ) {
                    selectAnswer(index);
                }
            });
        }
    }
}
// Initialize the quiz when the DOM content is loaded
document.addEventListener('DOMContentLoaded', initialize);




