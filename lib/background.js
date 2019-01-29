chrome.browserAction.onClicked.addListener((tab) => {
    chrome.windows.create({
        url:"interface/popup.html",
        type:"popup",
        width:400,
        height:600
    },(tab) => {
        chrome.storage.sync.get(['video-vault-data'],(result) => {
            console.log("VAULT DATA ::: " + JSON.stringify(result))

            //If the data has not been initialized yet, save the default values.
            if(result.preferences == null || typeof result.preferences == "undefined"){
                chrome.storage.sync.set({
                    "video-vault-data":{
                        preferences:{

                        },
                        data:[]
                    }
                })
            }

            chrome.runtime.sendMessage({
                type:"data"
            },(response) => {
                console.log("GOT A RESPONSE FROM THE POPUP")
            })
        })
    })
})