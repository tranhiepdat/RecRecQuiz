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
        playerNameInput = false;
    }
}

function SendUserPersonality(personalityType) {
    const request = {
        Statistics: [
            {
                StatisticName: "Personalities",
                Value: personalityType
            }
        ]
    };

    PlayFabClientSDK.UpdatePlayerStatistics(request, SendUserPersonaltyCallback);
}

var SendUserPersonaltyCallback = function (result, error){
    if (result !== null) {
        console.log("user personality sent");
        console.log(result);
    } else if (error !== null) {
        console.log(PlayFab.GenerateErrorReport(error));
    }
}

let leaderboard;

function GetUserStatistics(){
    const request = {
        StatisticName: "Personalities",
        StartPosition: 0,
        MaxResultsCount: 100
    };

    PlayFabClientSDK.GetLeaderboard(request, GetUserStatisticsCallback);
}

var GetUserStatisticsCallback = function (result, error){
    if (result !== null){
        console.log("get statistic success");
        console.log(result.data.Leaderboard);
        leaderboard = result.data.Leaderboard;
    } else if (error !== null){
        console.log(PlayFab.GenerateErrorReport(error));
    }
}

function CalcPersonaRate(userPersonalityType){
    var count = 0;
    if (leaderboard !== null){
        console.log(leaderboard);
        leaderboard.forEach(item => {
            if (item.StatValue == userPersonalityType){
                count++;
            }
        });
    }
    return Math.round(count*100/leaderboard.length);
}

Login();

exports.GetUserStatistics = GetUserStatistics;
exports.CalcPersonaRate = CalcPersonaRate;
exports.UpdateDisplayName = UpdateDisplayName;
exports.SendUserPersonality = SendUserPersonality;