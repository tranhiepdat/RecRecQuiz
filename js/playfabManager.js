import { playerName } from './script';
export let playerNameInput = false;
export let nameFromDatabase = null;
function generateDeviceUUID() {
    // Check if UUID is already stored in local storage
    let deviceId = localStorage.getItem('deviceId');
    
    // If UUID is not stored, generate a new one
    if (!deviceId) {
        deviceId = createUUID();
        // Store the generated UUID in local storage
        localStorage.setItem('deviceId', deviceId);
    }
    
    return deviceId;
}

// Function to create a UUID
function createUUID() {
    // Generate a random UUID using the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function Login() {
    var uuid = generateDeviceUUID();
    PlayFab.settings.deviceId = uuid
    PlayFab.settings.titleId = "B2C32"
    var request = {
        CustomId: PlayFab.settings.deviceId,
        CreateAccount: true,
        InfoRequestParameters: {
            GetPlayerProfile: true
        },
        TitleId: PlayFab.settings.titleIditleId // Make sure to replace "YOUR_TITLE_ID" with your actual PlayFab title ID
    };
    
    PlayFabClientSDK.LoginWithCustomID(request, LoginCallback);
}

var LoginCallback = function (result, error) {
    if (result !== null) {
        console.log("login success");
        if (result.data.InfoResultPayload.PlayerProfile.DisplayName !== undefined) {
            console.log(result.data.InfoResultPayload.PlayerProfile.DisplayName);
            nameFromDatabase = result.data.InfoResultPayload.PlayerProfile.DisplayName;
            playerNameInput = true;
        }
    } else if (error !== null) {
        console.log(PlayFab.GenerateErrorReport(error));
    }
}

function UpdateDisplayName(){
    var request = {
        DisplayName: playerName
    };
    
    PlayFabClientSDK.UpdateUserTitleDisplayName(request, UpdateDisplayNameCallback);
}

var UpdateDisplayNameCallback = function (result, error){
    if (result !== null) {
        console.log("name update success");
        console.log(result.data.DisplayName);
        nameFromDatabase = result.data.DisplayName;
        playerNameInput = true;
    } else if (error !== null) {
        console.log(PlayFab.GenerateErrorReport(error));
    }
}
Login();
exports.UpdateDisplayName = UpdateDisplayName;