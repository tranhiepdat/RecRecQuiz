import * as rive from "../node_modules/@rive-app/canvas";
import { UpdateDisplayName, SendUserPersonality, CalcPersonaRate, GetUserStatistics, playerNameInput, nameFromDatabase } from "./playfabManager";
let currentQuestion = 0;
let userChoices = [];
let questionsData;
let explanationData;
let canvas = document.getElementById('quiz-canvas');
let ctx = canvas.getContext('2d');
const aspectRatio = 9 / 16;
let screenshotButtonVisible = false;
let allAnswered = false;
let isLoading = true;
export let playerName = null;
let riveAnimLoaded = false;
// Declare variables for preloaded images
const preloadImages = { images: [] };  // For question images
const preloadResultImages = { images: [] };  // For result images

// Create a separate canvas for Rive animation
// const riveCanvas = document.createElement('canvas');
// const riveCtx = riveCanvas.getContext('2d');

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
    // riveCanvas.width = canvasWidth;
    // riveCanvas.height = screenHeight; // Set canvas height to full screen height
    // riveCanvas.style.width = (canvasWidth / devicePixelRatio) + 'px'; // Set display width and height
    // riveCanvas.style.height = (screenHeight / devicePixelRatio) + 'px'; // Set display height to full screen height

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

function initialize() {
    // Play the Rive animation corresponding to the result
    // Preload all images and store them into separate variables
    preloadAllImages()
        .then(images => {
            // Store preloaded question and result images
            preloadImages.images = images.questionImages;
            preloadResultImages.images = images.resultImages;
            console.log("Images preloaded successfully");

        })
        .catch(error => console.error('Error preloading images:', error));
        

    // If a loading screen or animation is active, handle it
    if (isLoading) {
        loadingscreenRive.play("Logo");
    }
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questionsData = data;
            // document.body.appendChild(riveCanvas);
            // riveCanvas.className = 'rive-canvas';
        })
        .catch(error => console.error('Error fetching questions:', error));
    fetch('result-explanation.json')
        .then(response => response.json())
        .then(data => {
            explanationData = data;
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


    // Disable canvas to prevent interaction
    canvas.disabled = true;
}
let isShowed = false;
function handleSubmitName() {
    playerName = inputField.value.trim();
    if (playerName !== '') {
        // Process player name (e.g., save to database)
        console.log('Player Name:', playerName);
        UpdateDisplayName();
        if (!isShowed) {
            alert("Let" + "'" + "s begin, " + playerName);
            isShowed = true;
        }
        // setTimeout(function () {
        //     console.log("One second has passed!");
        //     // Place your code here that you want to execute after one second
        //     console.log(playerName);
        //     // Hide input field and submit button
        //     if (playerNameInput) {
        //         alert("Let" + "'" + "s begin, " + playerName);
        //     }
        // }, 1500); // 1000 milliseconds = 1 second
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
        GetUserStatistics();
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

// // Function to preload all images
// async function preloadImages() {
//     const imagePromises = [];
//     for (let i = 1; i <= 10; i++) { // Assuming there are 10 images numbered from 1.png to 10.png
//         const imageUrl = `images/questions/${i}.png`;
//         imagePromises.push(preloadImage(imageUrl));
//     }
//     return Promise.all(imagePromises);
// }

// Function to preload all images for both questions and results
async function preloadAllImages() {
    const questionImagePromises = [];
    const resultImagePromises = [];
    
    for (let i = 1; i <= 10; i++) {
        const questionImageUrl = `images/questions/${i}.jpeg`;
        questionImagePromises.push(preloadImage(questionImageUrl));
        
        const resultImageUrl = `images/results/${i - 1}.jpeg`; // Adjusting result image index
        resultImagePromises.push(preloadImage(resultImageUrl));
    }
    
    // Preload all question and result images
    const [questionImages, resultImages] = await Promise.all([
        Promise.all(questionImagePromises),
        Promise.all(resultImagePromises)
    ]);

    return {
        questionImages,
        resultImages
    };
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

let buttonStartY;

async function displayQuestion(questionIndex) {
    const question = questionsData[questionIndex];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let padding = canvas.height * 0.05; // Define top padding (5% of canvas height)

    // Get the background image
    const backgroundImage = preloadImages.images[questionIndex];

    // Calculate the aspect ratio of the image
    const imageAspectRatio = backgroundImage.width / backgroundImage.height;

    // Calculate new dimensions to fit the image inside the canvas
    let imageWidth = canvas.width;
    let imageHeight = canvas.width / imageAspectRatio;

    // Check if the image height exceeds the canvas height minus padding
    if (imageHeight > canvas.height - padding) {
        imageHeight = canvas.height - padding;
        imageWidth = imageHeight * imageAspectRatio;
    }

    // Calculate the position (centered horizontally, aligned to the top with padding)
    const imageX = (canvas.width - imageWidth) / 2;
    const imageY = padding; // Align to the top with padding

    // Draw the image on the canvas
    ctx.drawImage(backgroundImage, imageX, imageY, imageWidth, imageHeight);
    padding = canvas.height * 0.02;

    // Calculate space below the image for the question and buttons
    const availableHeight = canvas.height - imageHeight - padding - (canvas.height * 0.01); // Space below image and padding

    // Display the quiz question at the bottom of the available space
    const questionFontSize = Math.min(canvas.width * 0.05, availableHeight * 0.1); // Adjust font size based on canvas width and available height
    ctx.font = `bold ${questionFontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f5e74';
    // Wrap the question text
    const questionLines = wrapText(ctx, question.quiz, canvas.width * 0.8);

    // Calculate vertical position for the wrapped text
    const lineHeight = questionFontSize * 1.2; // Line height including padding
    const questionTextY = imageY + imageHeight + padding + questionFontSize; // Positioning question text

    // Draw each line of the wrapped text
    questionLines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, questionTextY + index * lineHeight);
    });

    buttonStartY = questionTextY + questionLines.length * lineHeight + (canvas.height * 0.01)
    // Draw buttons below the question
    drawButtons(question, buttonStartY);
}

function drawButtons(question, startY) {
    const buttonSpacing = canvas.height * 0.01; // Define spacing between buttons

    // Calculate total height of all buttons including spacing
    let totalHeight = 0;
    question.answers.forEach(answer => {
        const buttonFontSize = Math.min(canvas.width * 0.03, canvas.height * 0.03); // Adjust font size based on canvas width and height
        ctx.font = `bold ${buttonFontSize}px Arial`;
        const lines = wrapText(ctx, answer.answerText, canvas.width * 0.8 - canvas.width * 0.02 * 2);
        let buttonHeight = canvas.height * 0.05 + (lines.length - 1) * (canvas.height * 0.02);
        totalHeight += buttonHeight + buttonSpacing;
    });

    // Adjust starting Y position to place buttons below the question text
    let startYAdjusted = startY;

    question.answers.forEach((answer, index) => {
        // Calculate button position
        const buttonWidth = canvas.width * 0.8;
        let buttonHeight = canvas.height * 0.05; // Initial height
        const buttonX = (canvas.width - buttonWidth) / 2;
        const padding = canvas.width * 0.02; // Padding between button and text
        const buttonFontSize = Math.min(canvas.width * 0.03, canvas.height * 0.03); // Adjust font size based on canvas width and height
        ctx.font = `bold ${buttonFontSize}px Arial`;
        const lines = wrapText(ctx, answer.answerText, buttonWidth - padding * 2);
        buttonHeight += (lines.length - 1) * (canvas.height * 0.02); // Increase button height for each additional line

        const buttonY = startYAdjusted; // Use updated startY for this button's Y position

        // Draw button background with rounded corners
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

        // Update startY for the next button
        startYAdjusted += buttonHeight + buttonSpacing;
    });
}

// Function to redraw buttons with hover effect
function redrawButtons() {
    const question = questionsData[currentQuestion];
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

    drawButtons(question, buttonStartY);
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

function showResult(personalityType) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    SendUserPersonality(personalityType);

    // Draw the background image
    const padding = canvas.height * 0.03; // Define top padding (3% of canvas height for smaller canvas)
    const backgroundImage = preloadResultImages.images[personalityType];
    const imageAspectRatio = backgroundImage.width / backgroundImage.height;
    let imageWidth = canvas.width;
    let imageHeight = canvas.width / imageAspectRatio;
    
    if (imageHeight > canvas.height - padding) {
        imageHeight = canvas.height - padding;
        imageWidth = imageHeight * imageAspectRatio;
    }
    
    const imageX = (canvas.width - imageWidth) / 2;
    const imageY = padding;
    ctx.drawImage(backgroundImage, imageX, imageY, imageWidth, imageHeight);

    // Calculate the space below the image for text
    const textPadding = canvas.height * 0.01; // Padding between image and text (1.5% of canvas height)
    const textAreaWidth = canvas.width * 0.45; // Width of the text area for heading and explanation (45% of canvas width)

    // Draw the result text (name, result, stat) on the left
    const resultFontSize = Math.min(canvas.width * 0.03, canvas.height * 0.03); // Adjust font size based on canvas width (2% of canvas width)
    const textX = 20; // X position for the text on the left side
    let textY = imageY + imageHeight + textPadding + 30; // Y position for the text below the image

    ctx.font = `bold ${resultFontSize * 1.4}px Arial`; // Bold and larger text
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left'; // Align text to the left

    // Draw the name, result, and stat text
    ctx.fillText('Hello, ' + nameFromDatabase, textX, textY);
    textY += resultFontSize * 1.4 + textPadding;

    ctx.font = `bold ${resultFontSize}px Arial`; // Regular font size for result text
    ctx.fillText('Your Personality Type: ', textX, textY);
    textY += resultFontSize + textPadding;
    ctx.fillText(getPersonalityTypeLabel(personalityType), textX, textY);
    textY += resultFontSize + textPadding;
    ctx.font = `normal ${resultFontSize}px Arial`; // Normal font style for stat text
    ctx.fillText(CalcPersonaRate(personalityType) + '% people also this type', textX, textY);
    textY = imageY + imageHeight + textPadding + 30;

    // Draw the explanation text on the right bottom half
    const explanation = explanationData.find(item => item.Type === personalityType);
    if (explanation) {
        const headingFontSize = resultFontSize * 1.2;
        const explanationFontSize = resultFontSize;

        // Draw the heading
        ctx.font = `bold ${headingFontSize}px Arial`;
        ctx.fillStyle = '#000';
        ctx.textAlign = 'left';
        const headingX = canvas.width * 0.5; // Align to the right half
        let headingY = textY; // Start from where the previous text ended
        const headingLines = wrapText(ctx, explanation.Heading, textAreaWidth);
        headingLines.forEach((line, index) => {
            ctx.fillText(line, headingX, headingY);
            headingY += headingFontSize * 1.2; // Add line height spacing
        });
        headingY += textPadding; // Add padding after heading

        // Draw the explanation
        ctx.font = `normal ${explanationFontSize}px Arial`;
        const explanationLines = wrapText(ctx, explanation.Explanation, textAreaWidth);
        explanationLines.forEach((line, index) => {
            ctx.fillText(line, headingX, headingY);
            headingY += explanationFontSize * 1.2; // Add line height spacing
        });
    }

    // Draw the screenshot button
    screenshotButtonVisible = true;
    drawScreenshotButton();
}

function getPersonalityTypeLabel(type) {
    switch (type) {
        case 0: return 'Impressionism';
        case 1: return 'De Stijl';
        case 2: return 'Surrealism';
        case 3: return 'Post-modern';
        case 4: return 'Art Nouveau';
        case 5: return 'Cubism';
        case 6: return 'Bauhaus';
        case 7: return 'Expressionism';
        case 8: return 'Dadaism';
        case 9: return 'Constructivism';
        default: return 'Unknown';
    }
}

// Function to determine the final result
function getResult() {
    let mostCommonChoices = findMostCommonChoice(userChoices);
    let result = mostCommonChoices[0];
    // if (mostCommonChoices.length > 1) {
    //     switch (mostCommonChoices[0]) {
    //         case 0:
    //             if (mostCommonChoices[1] == 1) {
    //                 result = 3;
    //             } else if (mostCommonChoices[1] == 2) {
    //                 result = 4;
    //             }
    //             break;
    //         case 1:
    //             if (mostCommonChoices[1] == 0) {
    //                 result = 3;
    //             } else if (mostCommonChoices[1] == 2) {
    //                 result = 5;
    //             }
    //             break;
    //         case 2:
    //             if (mostCommonChoices[1] == 0) {
    //                 result = 4;
    //             } else if (mostCommonChoices[1] == 1) {
    //                 result = 5;
    //             }
    //             break;
    //     }
    // }
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
    ctx.clearRect(screenshotButtonPos.x, screenshotButtonPos.y, screenshotButtonPos.width+10, screenshotButtonPos.height+20);
    // Create a temporary canvas to draw both canvases
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Set the temporary canvas size to match the main canvas size
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // // Draw the riveCanvas onto the temporary canvas
    // tempCtx.drawImage(riveCanvas, 0, 0);

    tempCtx.fillStyle = '#ecfbff'; // Set to your desired background color
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
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