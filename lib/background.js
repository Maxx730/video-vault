//Create the HTML5 web db if the table does not exist yet.
let database = openDatabase('video_vault_base', '1.0', 'video_vault', 2 * 1024 * 1024);
let video_data;

database.transaction((trans) => {
    trans.executeSql('CREATE TABLE IF NOT EXISTS videos(id,url,title,tags)');
    trans.executeSql('SELECT * FROM videos',[],(trans,result) => {
        video_data = result.rows
    });
})

chrome.browserAction.onClicked.addListener((tab) => {
    chrome.windows.create({
        url:"interface/popup.html",
        type:"popup",
        width:400,
        height:600
    },(tab) => {
        chrome.runtime.onMessage.addListener((request,sender,response) => {
            switch(request.type){
                case "PURGE_DATA":
                    database.transaction((trans) => {
                        trans.executeSql("DELETE FROM videos")
                    })
                break;
                case "REQUEST_DATA":
                    chrome.runtime.sendMessage({
                        type:"VAULT_DATA",
                        payload:video_data
                    },null)
                break;
                case "SAVE_VIDEO":
                    database.transaction((trans) => {
                        trans.executeSql('INSERT INTO videos(id,url,title,tags) VALUES('+parseInt(video_data.length + 1)+',"'+request.payload.url+'","'+request.payload.title+'",null)');
                        trans.executeSql('SELECT * FROM videos',[],(trans,result) => {
                            video_data = result.rows;
                            
                            //Now that we have saved this data to the database we want to send a message back to the UI with the updated data.
                            chrome.runtime.sendMessage({
                                type:"VAULT_DATA",
                                payload:video_data
                            },null)
                        })
                    })
                break;
            }
        })
    })
})