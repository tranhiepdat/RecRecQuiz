



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

    riveCanvas.width = canvasWidth;
    riveCanvas.height = screenHeight; // Set canvas height to full screen height
    riveCanvas.style.width = (canvasWidth / devicePixelRatio) + 'px'; // Set display width and height
    riveCanvas.style.height = (screenHeight / devicePixelRatio) + 'px'; // Set display height to full screen height

    // Redraw content after resizing
    if (!playerNameInput && !isLoading){
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
    autoplay: true,
    shouldDisableRiveListeners: true,
    
    artboard: 'Logo',
    stateMachines: 'Logo',
    onLoad: () => {
        console.log('Rive file loaded successfully.');
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
        
        
        //loadingscreenRive.reset({
           /// stateMachines: "Logo",
           // autoplay: false,
           // shouldDisableRiveListeners: false,
       //   });
        
        //loadingscreenRive.off();
        
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
        
        loadingscreenRive.resizeDrawingSurfaceToCanvas();
        loadingscreenRive.play("Logo");
    }
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questionsData = data;
            // if (!isLoading) {  // Ensure loading screen has finished
            //     displayQuestion(currentQuestion);
            // }
            document.body.appendChild(riveCanvas);
            // Position the riveCanvas behind the canvas
            riveCanvas.style.position = 'absolute';
            riveCanvas.style.top = '50%';
            riveCanvas.style.left = '50%';
            riveCanvas.style.transform = 'translate(-50%, -50%)';
            riveCanvas.style.zIndex = '-1';
        })
        .catch(error => console.error('Error fetching questions:', error));
}

// Function to show the input field and submit button
function showInputField() {
    // Create input field
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Enter your name';
    inputField.style.position = 'absolute';
    inputField.style.top = '50%';
    inputField.style.left = '50%';
    inputField.style.transform = 'translate(-50%, -50%)';
    inputField.style.zIndex = '1000'; // Ensure it's above other elements
    document.body.appendChild(inputField);

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.style.position = 'absolute';
    submitButton.style.top = '60%'; // Adjust as needed
    submitButton.style.left = '50%';
    submitButton.style.transform = 'translate(-50%, -50%)';
    submitButton.style.zIndex = '1000'; // Ensure it's above other elements
    // Add click event listener to handle submission
    submitButton.addEventListener('click', () => {
        playerName = inputField.value.trim();
        if (playerName !== '') {
            // Process player name (e.g., save to database)
            console.log('Player Name:', playerName);
            // Hide input field and submit button
            document.body.removeChild(inputField);
            document.body.removeChild(submitButton);
            UpdateDisplayName();
            displayQuestion(currentQuestion);
            // Enable canvas for quiz interaction
            playerNameInput = true;
            canvas.disabled = false;
        } else {
            alert('Please enter your name.');
        }
    });
    document.body.appendChild(submitButton);

    // Disable canvas to prevent interaction
    canvas.disabled = true;
}

// Function to display a question
function displayQuestion(questionIndex) {
    const question = questionsData[questionIndex];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Display the quiz question at the bottom of the canvas
    const questionFontSize = canvas.width * 0.03; // Adjust font size based on canvas width
    ctx.font = `${questionFontSize}px Arial`;
    ctx.textAlign = 'center';
    const questionHeight = canvas.height * 0.2; // Height of the question text
    ctx.fillText(question.quiz, canvas.width / 2, canvas.height - canvas.height * 0.1 - questionHeight);

    // Calculate button positions and draw buttons
    drawButtons(question);
}

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
        ctx.font = `${buttonFontSize}px Arial`;
        const words = answer.answerText.split(' ');
        let lines = [];
        let line = '';
        words.forEach(word => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > buttonWidth - padding * 2) {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        });
        lines.push(line);
        buttonHeight += (lines.length - 1) * (canvas.height * 0.02); // Increase button height for each additional line

        // Draw button background
        ctx.fillStyle = answer.hover ? '#bbb' : '#ddd';
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Draw button text
        ctx.fillStyle = '#000';
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const question = questionsData[currentQuestion];
    displayQuestion(currentQuestion);
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
            result = 'Mala + Gochujang';
            break;
        case 4:
            result = 'Mala + Tomyum';
            break;
        case 5:
            result = 'Gochujang + Tomyum';
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
    const resultTextX = canvas.width * 0.25;
    const resultTextY = canvas.height - canvas.height * 0.09;
    const nameTextX = canvas.width * 0.25;
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
    link.download = filename;

    // Trigger the download
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
        const isHover = (
            mouseX >= buttonX &&
            mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY &&
            mouseY <= buttonY + buttonHeight
        );
        ctx.fillStyle = isHover ? '#ccc' : '#ddd'; // Change color on hover
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

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
            drawScreenshotButton(posX, posY)
            // Check if the click/touch is within the screenshot button
            if (
                posX >= screenshotButtonPos.x &&
                posX <= screenshotButtonPos.x + screenshotButtonPos.width &&
                posY >= screenshotButtonPos.y &&
                posY <= screenshotButtonPos.y + screenshotButtonPos.height
            ) {
                drawScreenshotButton(posX, posY);
            }
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




