function Login() {
    var uuid = new DeviceUUID().get();
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
            playerName = result.data.InfoResultPayload.PlayerProfile.DisplayName;
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
        playerName = result.DisplayName;
    } else if (error !== null) {
        console.log(PlayFab.GenerateErrorReport(error));
    }
}
Login();