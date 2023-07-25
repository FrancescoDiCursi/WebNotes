if(document.readyState!=="loading"){
    console.log("asdasd")
    console.log(document.URL)
    let curr_url=document.URL

    //check if there are notes for this url
    chrome.storage.local.get((storage)=>{
        let note_list= storage.notes
        let urls= note_list.map((d)=>d.url).filter(function(f){return f!==""})
        console.log(urls)
        
        //check all url (notes on the precise url)
        if (urls.includes(curr_url)){
            console.log("precise URL in storage: ", curr_url, urls.filter(d=>d===curr_url).length)

        }
        //check only base (notes on the service)
        let curr_base= curr_url.match(/(http.+\.\w+)\//)[0]
        let urls_bases= urls.map(d=>d.match(/(http.+\.\w+)\//)[0])
        if(urls_bases.includes(curr_base)){
            console.log("base URL in storage", curr_base, urls_bases.filter(d=>d===curr_base).length)
            //add icon for base equality

        }

        let n_urls= urls.filter(d=>d===curr_url).length
        let n_bases= urls_bases.filter(d=>d===curr_base).length
        
        let icon_path= 'post-it.png'

        let icon_bases= document.createElement('img')
        icon_bases.id="icon_bases"
        icon_bases.src= chrome.runtime.getURL(icon_path)
        icon_bases.style.width="80%"
        if (n_bases>0){
            //icon_bases.style.boxShadow="1px 1px 1px rgba('255,0,0,1')"
        }

        let icon_urls= document.createElement('img')
        icon_urls.id="icon_bases"
        icon_urls.src= chrome.runtime.getURL(icon_path)
        icon_urls.style.width="80%"

        let title_popup_toggle=document.createElement("button")
        title_popup_toggle.innerHTML="- Chrome notes -"
        title_popup_toggle.id="toggle_popup"
        title_popup_toggle.className="toggle_popup_active"
        title_popup_toggle.style.fontSize="12px"
        title_popup_toggle.style.textAlign="center"
        title_popup_toggle.style.width="100%"
        title_popup_toggle.style.backgroundColor="rgba(255,0,0,1)"
        title_popup_toggle.style.color="white"
        title_popup_toggle.addEventListener("click", function(){
            let meta_cont= document.getElementById("note_meta_cont")
            let cont=document.getElementById("note_sub_cont")
            if (cont.className.includes("_active")){
                //disable
                cont.className= cont.className.replace("_active","")
                cont.style.display="none"
                meta_cont.style.backgroundColor="rgba(255,255,255,0)"
                meta_cont.style.height="0%"

                toggle_popup.innerHTML="+ Chrome notes +"

            }else{
                //enabale
                cont.className= cont.className+"_active"
                cont.style.display="block"
                meta_cont.style.backgroundColor="rgba(255,255,255,0.8)"

                toggle_popup.innerHTML="- Chrome notes -"
                meta_cont.style.height="12%"

            }

        })

        //add btns to page
        let meta_cont= document.createElement("div")
        meta_cont.id="note_meta_cont"

        meta_cont.style.position="fixed"
        meta_cont.style.zIndex="999999999999"
        meta_cont.style.width="200px"
        meta_cont.style.height="125px"
        meta_cont.style.backgroundColor="rgba(255,255,255,0.8)"
        meta_cont.style.color="black"
        //meta_cont.style.padding="1%"
        dragElement(meta_cont)

        let sub_cont= document.createElement("div")
        sub_cont.id="note_sub_cont"
        sub_cont.className="note_sub_cont_active"
        sub_cont.style.display="flex"
        sub_cont.style.flexDirection="column"
        sub_cont.style.height="80px"


        let labels_cont= document.createElement("div")
        labels_cont.id="notes_label_cont"
        labels_cont.style.display="flex"
        labels_cont.style.flexDirection="row"
        labels_cont.textAlign="center"
        labels_cont.style.width="80%"
        labels_cont.style.marginLeft="10%"
        labels_cont.style.marginTop="3%"

        

        let label_urls = document.createElement("label")
        label_urls.id="url_label"
        label_urls.innerHTML="URL"
        label_urls.style.width="70%"
        label_urls.style.textAlign="center"
        label_urls.style.fontSize="15px"


        let label_bases = document.createElement("label")
        label_bases.id="base_label"
        label_bases.innerHTML="DOMAIN"
        label_bases.style.width="70%"
        label_bases.style.textAlign="center"
        label_bases.style.fontSize="15px"

        let buttons_cont= document.createElement("div")
        buttons_cont.id="notes_btn_cont"
        buttons_cont.style.display="flex"
        buttons_cont.style.flexDirection="row"
        buttons_cont.style.width="80%"
        buttons_cont.style.marginLeft="10%"


        let button_urls=document.createElement("button")
        button_urls.id=`notes_btn_url`
        button_urls.style.width="100%"
        button_urls.style.backgroundColor="transparent"
        button_urls.style.border="transparent"
        button_urls.addEventListener("click",function(){
            chrome.runtime.sendMessage({"action":"open_popup_urls"},function(response){

              if (!window.chrome.runtime.lastError) {
                // message processing code goes here
                console.log("response", response)
             } else {
               //alert("You need to open the Chrome notes' popup first by clicking on its icon.\nThen click here again when it's open.")
             }
            })
        })

        

        let button_urls_counter=document.createElement("div")
        button_urls_counter.innerHTML=`${n_urls}`
        button_urls_counter.style.marginTop="-60%"
        button_urls_counter.style.marginLeft="17%"
        button_urls_counter.style.color="black"
        button_urls_counter.style.fontSize="25px"
        button_urls_counter.style.rotate="-9deg"

        let button_bases_counter=document.createElement("div")
        button_bases_counter.innerHTML=`${n_bases}`
        button_bases_counter.style.marginTop="-60%"
        button_bases_counter.style.marginLeft="17%"
        button_bases_counter.style.rotate="-9deg"


        button_bases_counter.style.color="black"
        button_bases_counter.style.fontSize="25px"

        let button_bases=document.createElement("button")
        button_bases.id="notes_btn_bases"
        button_bases.style.width="100%"
        button_bases.style.backgroundColor="transparent"
        button_bases.style.border="transparent"

        //append image and counter to btn
        button_bases.appendChild(icon_bases)
        button_bases.appendChild(button_bases_counter)
        //append image and counter to btn
        button_urls.appendChild(icon_urls)
        button_urls.appendChild(button_urls_counter)

        //append
        meta_cont.appendChild(title_popup_toggle)
        labels_cont.appendChild(label_bases)
        labels_cont.appendChild(label_urls)
        sub_cont.appendChild(labels_cont)
        buttons_cont.appendChild(button_bases)
        buttons_cont.appendChild(button_urls)
        sub_cont.appendChild(buttons_cont)

        meta_cont.appendChild(sub_cont)
        document.body.insertBefore( meta_cont,document.body.firstChild)
        
    })
    
}

function get_current_url(){
    chrome.tabs.query(
        {active:true},
        tabs=>{
                   const tab=tabs[0];
                   console.log("URL:", tab.url)
                   return tab.url
                   }
                    )
}


function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
