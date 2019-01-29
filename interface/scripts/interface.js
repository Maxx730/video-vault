window.onload = () => {
    const nav_items = document.getElementsByClassName("nav-item");
    const content = document.getElementsByClassName("content");
    const nav_close = document.getElementById("nav-close-navigation");
    const navigation = document.getElementsByClassName("vault-navigation")[0];
    const vault_content = document.getElementsByClassName("vault-content")[0];
    const vault_nav_open = document.getElementById("nav-open")

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
        })
    }

    //Listen for messages passed from the background script.
    chrome.runtime.onMessage.addListener((request,sender,response) => {
        switch(request.type){
            default:
                console.log(request)
            break;
        }
    })
}

