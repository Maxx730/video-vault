window.onload = () => {
    const nav_items = document.getElementsByClassName("nav-item");
    const content = document.getElementsByClassName("content");
    const nav_close = document.getElementById("nav-close-navigation");
    const navigation = document.getElementsByClassName("vault-navigation")[0];
    const vault_content = document.getElementsByClassName("vault-content")[0];
    const vault_nav_open = document.getElementById("nav-open");
    const submit_button = document.getElementById("submit-new-video-button");
    const URL_field = document.getElementById("new-video-url");
    const title_field = document.getElementById("new-video-title");
    const loading_bar = document.getElementById("loading-progress-bar");
    const data_field = document.getElementById("data");
    const video_list = document.getElementById("video-list");
    const purge = document.getElementById("purge-data");

    let load_value = 0;
    let loading;
    let video_data = {};

    let load = () => {
        load_value += 10;

        loading_bar.style = "width:"+load_value+"%";

        if(load_value >= 100){
            //Loading animation complete now we want to save the data to the backend.
            URL_field.value = "";
            title_field.value = "";
        
            setTimeout(() => {
                loading_bar.style = "width:0%;";

            },1000)

            clearInterval(loading)
        }
    }

    purge.addEventListener("click",(event) => {
        chrome.runtime.sendMessage({
            type:"PURGE_DATA"
        },() => {

        })
    })

    submit_button.addEventListener("click",(event) => {
        event.preventDefault();
        URL_field.classList.remove("input-error");
        title_field.classList.remove("input-error");

        //Make sure the URL and Title fields are filled out at least.
        if(URL_field.value != "" && title_field.value != ""){
            //Send a message to the background script to save this video to the json data file.
            chrome.runtime.sendMessage({
                type:"SAVE_VIDEO",
                payload:{
                    url:URL_field.value,
                    title:title_field.value,
                    tags:[]
                }
            },null)

            //Now that the values have been confirmed we want to save them and animate the loading bar.
            loading = setInterval(load,100);
        }else{
            if(URL_field.value == ""){
                URL_field.classList.add("input-error");
            }
            
            if(title_field.value == ""){
                title_field.classList.add("input-error");
            }
        }
    })

    nav_close.addEventListener("click",() => {
        navigation.classList.remove('open');
        vault_content.classList.add('full-width');
        vault_nav_open.classList.remove('hide');
    })

    vault_nav_open.addEventListener("click",() => {
        navigation.classList.add('open');
        vault_content.classList.remove('full-width');
        vault_nav_open.classList.add('hide');
    })

    for(let i = 0;i < nav_items.length;i++){
        nav_items[i].addEventListener('click',() => {
            for(let k = 0;k < nav_items.length;k++){
                nav_items[k].classList.remove('active')
            }

            for(let k = 0;k < content.length;k++){
                content[k].classList.remove('active')
            }

            nav_items[i].classList.add("active")
            document.getElementById(nav_items[i].getAttribute("context")).classList.add('active');
            nav_close.click();
        })
    }

    //Listen for messages passed from the background script.
    chrome.runtime.onMessage.addListener((request,sender,response) => {
        switch(request.type){
            case "VAULT_DATA":
                display_videos(video_list,request.payload)
            break;
        }
    })

    //Request from the background script the data for the application.
    chrome.runtime.sendMessage({
        type:"REQUEST_DATA"
    },null)
}

const display_videos = (list,data) => {
    let i = 0;
    list.innerHTML = "";

    for(let vid in data){
        list.innerHTML += '<li class="list-group-item d-flex justify-content-between align-items-center video-item"><center>'+vid.title+'</center><span class="badge badge-danger delete-video" item_id="'+vid.id+'"><i class="material-icons">clear</i></span></li>'   
        i++;
    }

    init_video_listeners();
}

const init_video_listeners = () => {
    let deletes = document.getElementsByClassName("delete-video");

    for(let i = 0;i < deletes.length;i++){
        deletes[i].addEventListener("click",(event) => {
            console.log("deleting item: " + deletes[i].getAttribute("item_id"))
        })
    }
}

