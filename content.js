window.addEventListener('load', function(){
    console.log("asdasd")
    console.log(document.URL)
    let curr_url=document.URL

    //check if there are notes for this url
    chrome.storage.local.get(async (storage)=>{
        let note_list
        let urls

        try{
          note_list= storage.notes
        }catch{
          note_list=[]
        }

                 
        try{
          urls= note_list.map((d)=>d.url).filter(function(f){return f!==""}) //need to fix counters, not

        }catch{
          urls=[]
        }
        console.log(urls)
        //get my_colors (create if "my_colors" not in storage keys)
        if(!Object.keys(storage).includes("my_colors")){
          let new_storage= storage
            new_storage.my_colors=[]
            await chrome.storage.local.set(new_storage)
        }
        console.log("STORAGE",storage)

        //get highlights (create if "higlights" not in storage keys)
        if(!Object.keys(storage).includes("highlights")){
          let new_storage= storage
            new_storage.highlights=[]
            await chrome.storage.local.set(new_storage)
        }

        if(!Object.keys(storage).includes("notes")){
          let new_storage= storage
            new_storage.notes=[]
            await chrome.storage.local.set(new_storage)
        }

        if(!Object.keys(storage).includes("toggles")){
          let new_storage= storage
          new_storage.toggles={}
          await chrome.storage.local.set(new_storage)
        }
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
        title_popup_toggle.id="toggle_popup"
       
        title_popup_toggle.style.fontSize="12px"
        title_popup_toggle.style.textAlign="center"
        title_popup_toggle.style.width="100%"
        title_popup_toggle.style.backgroundColor="rgba(255,0,0,1)"
        title_popup_toggle.style.color="white"
        title_popup_toggle.style.cursor="move"


        title_popup_toggle.addEventListener("click", function(){
            let meta_cont= document.getElementById("note_meta_cont")
            let cont=document.getElementById("note_sub_cont")
            if (cont.className.includes("_active")){
                //disable
                cont.className= cont.className.replace("_active","")
                cont.style.display="none"
                meta_cont.style.backgroundColor="rgba(255,255,255,0)"
                meta_cont.style.height="0%"

                title_popup_toggle.innerHTML="+ Notes +"

            }else{
                //enabale
                cont.className= cont.className+"_active"
                cont.style.display="block"
                meta_cont.style.backgroundColor="rgba(255,255,255,0.8)"

                title_popup_toggle.innerHTML="- Notes -"
                meta_cont.style.height="12%"

            }

        })

        let highlight_popup_toggle = document.createElement("button")
        highlight_popup_toggle.innerHTML="+ Highlighter +"
        highlight_popup_toggle.id="toggle_popup"
        highlight_popup_toggle.className="toggle_popup_active"
        highlight_popup_toggle.style.fontSize="12px"
        highlight_popup_toggle.style.textAlign="center"
        highlight_popup_toggle.style.width="250px"
        highlight_popup_toggle.style.backgroundColor="rgba(255,0,0,1)"
        highlight_popup_toggle.style.color="white"
        highlight_popup_toggle.style.cursor="move"
        
        highlight_popup_toggle.addEventListener("click", function(){
          let meta_cont= document.getElementById("note_meta_cont_highlight")
          let cont=document.getElementById("note_sub_cont_highlight")
          if (cont.className.includes("_active")){
              //disable
              cont.className= cont.className.replace("_active","")
              cont.style.display="none"
              cont.style.visibility="hidden"
              meta_cont.style.backgroundColor="rgba(255,255,255,0)"
              meta_cont.style.height="0%"

              highlight_popup_toggle.innerHTML="+ Highlighter +"

          }else{
              //enabale
              cont.className= cont.className+"_active"
              cont.style.display="flex"
              cont.style.visibility="visible"
              cont.style.flexDirection="column"
              meta_cont.style.backgroundColor="rgba(255,255,255,0.8)"
              meta_cont.style.width="250px"
              meta_cont.style.height="290px"

              highlight_popup_toggle.innerHTML="- Highlighter -"

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

        //create main and sub also for highleter
        let meta_cont_highlight= document.createElement("div")
        meta_cont_highlight.id="note_meta_cont_highlight"
        meta_cont_highlight.style.top="0px"
        meta_cont_highlight.style.left="210px"
        meta_cont_highlight.style.position="fixed"
        meta_cont_highlight.style.zIndex="999999999999"
        meta_cont_highlight.style.width="200px"
        meta_cont_highlight.style.height="20%"
        meta_cont_highlight.style.backgroundColor="rgba(255,255,255,0)"
        meta_cont_highlight.style.color="black"
        //meta_cont.style.padding="1%"
        dragElement(meta_cont_highlight)

        let sub_cont_highlight= document.createElement("div")
        sub_cont_highlight.id="note_sub_cont_highlight"
        sub_cont_highlight.className="note_sub_cont_highlight"
        sub_cont_highlight.style.height="80px"
        sub_cont_highlight.style.display="none"

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
        button_urls.style.cursor="default"
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
        button_urls_counter.id="urls_counter"

        let button_bases_counter=document.createElement("div")
        button_bases_counter.innerHTML=`${n_bases}`
        button_bases_counter.style.marginTop="-60%"
        button_bases_counter.style.marginLeft="17%"
        button_bases_counter.style.rotate="-9deg"
        button_bases_counter.id="domains_counter"



        button_bases_counter.style.color="black"
        button_bases_counter.style.fontSize="25px"

        let button_bases=document.createElement("button")
        button_bases.id="notes_btn_bases"
        button_bases.style.width="100%"
        button_bases.style.backgroundColor="transparent"
        button_bases.style.border="transparent"
        button_bases.style.cursor="default"

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
        this.setTimeout(()=>{
          highlight_popup_toggle.click()
          highlight_popup_toggle.click()
        },1000)

        //create element for sub_cont_highlighter
        let color_picker_label= document.createElement("label")
        color_picker_label.innerHTML="Active color: "
        color_picker_label.style.fontSize="13px"
        color_picker_label.style.marginTop="8px"
        
        color_picker_label.style.width="70%"

        let color_picker= document.createElement("input")
        color_picker.type="color"
        color_picker.id="color_picker"
        color_picker.style.width="25px"
        color_picker.value="#cccc00"
        color_picker.style.backgroundColor="transparent"
        color_picker.style.border="0px solid transparent"
        color_picker.style.marginLeft="-15%"
        color_picker.style.cursor="pointer"
        color_picker.style.marginTop="4px"


        let color_picker_cont= document.createElement("div")
        color_picker_cont.id="color_picker_cont"
        color_picker_cont.style.display="flex"
        color_picker_cont.style.flexDirection="row"
        color_picker_cont.style.marginTop="3%"
        color_picker_cont.style.marginLeft="15%"

        let create_notes_for_colors_cont= document.createElement("div")
        create_notes_for_colors_cont.id="create_notes_for_colors_cont"
        create_notes_for_colors_cont.style.marginLeft="5%"
        create_notes_for_colors_cont.style.marginTop="3%"

        let create_notes_for_colors= document.createElement("button")
        create_notes_for_colors.innerHTML="Create notes from highlights"
        create_notes_for_colors.style.border="1px black solid"
        create_notes_for_colors.style.width="95%"
        create_notes_for_colors.style.fontSize="12px"
        create_notes_for_colors.style.textAlign="center"
        create_notes_for_colors.style.marginTop="5%"
        create_notes_for_colors.style.cursor="pointer"

        create_notes_for_colors.addEventListener('click', async function(e){
          //get all ordered highlights by colors
          let all_highlights=document.getElementsByClassName("highlight_ext")
          let used_colors=[]
          for(let i=0;i<all_highlights.length;i++){
            let color= all_highlights.item(i).id.split("_")[1]
            console.log("COLOR", color)
            if(!used_colors.includes(color)){
              used_colors.push(color)
            }
          }
          console.log("colors",used_colors)

          if (used_colors.length>0){
            let new_notes_=[]
            for(let i=0;i<used_colors.length;i++){
              //let color= all_highlights.item(i).id.split("_")[1]
              let color=used_colors[i]
              console.log("COLOR", color)
              if(true){
                //used_colors.push(color)
  
                ////for each color create a note with that color as name
                //get text of elements of these colors
                let filtered_highlight= document.querySelectorAll("#highlight_"+color)
                console.log("FILT HIGH", filtered_highlight)
                let filtered_texts=[]
                for(let j=0; j<filtered_highlight.length;j++){
                  if (filtered_highlight.item(j).textContent.trim().length>0){
                    filtered_texts.push(filtered_highlight.item(j).textContent)
                  }
                }
                let filtered_text=filtered_texts.join(" ~~~ ")
                console.log("FILT TEXT", filtered_text)
                let new_id
                try{
                  new_id= storage.notes.length+1
  
                }catch{
                  new_id=0
                }
                let date_= new Date().toString().split("GMT")[0].trim()
  
                let new_note= {context: 'absolute', date: date_ , id: new_id, name:`#${color}`, row_id:`abs_${new_id}`, tags:"", text: filtered_text, url: window.location.href}
                console.log("NEW NOTE", new_note)
                new_notes_.push(new_note)           
  
              }
            }

            alert(`Note(s) created!`)
            chrome.storage.local.get().then(async (storage_)=>{
              let new_storage= storage_
              //make sure the same element more than once
              //if
              try{
                new_storage.notes= [... storage_.notes, ...new_notes_]

              }catch{
                console.log("NOTE ERRORS")
                new_storage.notes= [...new_notes_]
              }
              await chrome.storage.local.set(new_storage)
              //update counters
              let domain_counter= document.getElementById("domains_counter")
              let url_counter= document.getElementById("urls_counter")

              //check only base (notes on the service)
              let curr_url=document.URL
              let urls = new_storage.notes.map(d=>d.url)
              let curr_base= curr_url.match(/(http.+\.\w+)\//)[0]
              let urls_bases= urls.map(d=>d.match(/(http.+\.\w+)\//)[0])
              if(urls_bases.includes(curr_base)){
                  console.log("base URL in storage", curr_base, urls_bases.filter(d=>d===curr_base).length)
                  //add icon for base equality

              }

              let n_urls= urls.filter(d=>d===curr_url).length
              let n_bases= urls_bases.filter(d=>d===curr_base).length

              domain_counter.innerHTML=n_bases
              url_counter.innerHTML=n_urls
    

              
            })
          } else if (used_colors.length===0){
            alert("There is no highlighting on the page!")
          }
          
          console.log("COLORS HIGH, ", used_colors)


        })

        let my_colors_cont= document.createElement("div")
        my_colors_cont.id="my_colors_cont"
        my_colors_cont.style.display="flex"
        my_colors_cont.style.flexDirection="row"
        my_colors_cont.style.flexWrap= "wrap"
        my_colors_cont.style.minWidth="75%"
        my_colors_cont.style.width="40px"
        my_colors_cont.style.height="100%"
        my_colors_cont.style.border="1px solid black"
        my_colors_cont.style.minHeight="100%"
        my_colors_cont.style.overflowY="scroll"
        my_colors_cont.style.marginLeft="13%"

        //add already existing colors from storage to cont
        let already_existing_colors= storage.my_colors
        already_existing_colors.map(d=>{
          console.log("C: ", d)
          create_color(storage, color_picker, my_colors_cont, d.color)
        })
        

        let my_colors_add_btn_cont= document.createElement("div")
        my_colors_add_btn_cont.id="my_colors_add_btn_cont"

        let my_colors_add_btn= document.createElement("button")
        my_colors_add_btn.id= "my_colors_add_btn"
        my_colors_add_btn.innerHTML="Add to default colors"
        my_colors_add_btn.style.marginBottom="5%"
        my_colors_add_btn.style.border="1px black solid"
        my_colors_add_btn.style.width="90%"
        my_colors_add_btn.style.fontSize="12px"
        my_colors_add_btn.style.textAlign="center"
        my_colors_add_btn.style.marginLeft="4%"
        my_colors_add_btn.style.marginTop="3%"
        my_colors_add_btn.style.cursor="pointer"

        my_colors_add_btn.addEventListener("click",async function(){
          create_color(storage, color_picker, my_colors_cont, color_picker.value)
        })      

    

          //append also for highlighter

          meta_cont_highlight.appendChild(highlight_popup_toggle)

          color_picker_cont.appendChild(color_picker_label)
          color_picker_cont.appendChild(color_picker)
          sub_cont_highlight.appendChild(color_picker_cont)
          
          my_colors_add_btn_cont.appendChild(my_colors_add_btn)
          sub_cont_highlight.appendChild(my_colors_add_btn)
          sub_cont_highlight.appendChild(my_colors_cont)
          
          create_notes_for_colors_cont.appendChild(create_notes_for_colors)
          sub_cont_highlight.appendChild(create_notes_for_colors_cont)
          
          meta_cont_highlight.appendChild(sub_cont_highlight)
          document.body.insertBefore( meta_cont_highlight, document.body.firstChild)

          //add handler to highlighter
          let highlight_state_cont= document.createElement("div")
          highlight_state_cont.id="highlight_state_cont"
          highlight_state_cont.style.display="flex"
          highlight_state_cont.style.flexDirection="row"
          highlight_state_cont.style.marginLeft="15%"
          highlight_state_cont.style.marginBottom="-5%"
          let highlighter_check_label= document.createElement("label")
          highlighter_check_label.id="highlighter_check_label"
          highlighter_check_label.innerHTML="Enable highlighter"
          highlighter_check_label.style.fontSize="13px"
          let highlighter_check_input= document.createElement("input")
          highlighter_check_input.type="checkbox"
          highlighter_check_input.id="highlighter_check_input"
          highlighter_check_input.checked=false
          highlighter_check_input.style.marginLeft="8%"

          let highlight_info_del=document.createElement("span")
          highlight_info_del.style.fontSize="11px"
          highlight_info_del.style.marginLeft="8%"
          highlight_info_del.style.textDecoration="underline"
          highlight_info_del.style.fontWeight="bolder"
          highlight_info_del.innerHTML="Right click on highlights to delete them."

          
          
          highlight_state_cont.appendChild(highlighter_check_label)
          highlight_state_cont.appendChild(highlighter_check_input)

          sub_cont_highlight.insertBefore(highlight_state_cont, sub_cont_highlight.firstChild)
          sub_cont_highlight.insertBefore(highlight_info_del, sub_cont_highlight.firstChild)
        //check toggle state and coords
        if(Object.keys(storage.toggles).includes("notes")){
          let toggle_infos= storage.toggles.notes
          let meta_cont= document.getElementById("note_meta_cont")
          console.log("NOTES: ",meta_cont) 
          meta_cont.style.left= `${toggle_infos.left}px` 
          meta_cont.style.top= `${toggle_infos.top}px`
          console.log("NOTES MODIFIED: ",meta_cont) 

        }
        if(Object.keys(storage.toggles).includes("highlighter")){
          let toggle_infos= storage.toggles.highlighter
          let meta_cont= document.getElementById("note_meta_cont_highlight")
          meta_cont.style.left= `${toggle_infos.left}px` 
          meta_cont.style.top= `${toggle_infos.top}px`
        }

        //handle subconts
        //notes
        if(Object.keys(storage.toggles).includes("notes")){
          let meta_cont= document.getElementById("note_meta_cont")
          let cont= document.getElementById("note_sub_cont")
          if(storage.toggles.notes.state==="opened"){
            cont.className= cont.className+"_active"
            cont.style.display="block"
            meta_cont.style.backgroundColor="rgba(255,255,255,0.8)"

            title_popup_toggle.innerHTML="- Notes -"
            meta_cont.style.height="12%"

          }else if(storage.toggles.notes.state==="closed"){
            cont.className= cont.className.replace("_active","")
            cont.style.display="none"
            meta_cont.style.backgroundColor="rgba(255,255,255,0)"
            meta_cont.style.height="0%"

            title_popup_toggle.innerHTML="+ Notes +"

          }
        } else{ //note open by default
          title_popup_toggle.innerHTML="- Notes -"
          title_popup_toggle.className="toggle_popup_active"
        }

        //highlight
        if(Object.keys(storage.toggles).includes("highlighter")){
          let meta_cont= document.getElementById("note_meta_cont_highlight")
          let cont=document.getElementById("note_sub_cont_highlight")
          if(storage.toggles.highlighter.state==="opened"){
            //enabale
            cont.className= cont.className+"_active"
            cont.style.display="flex"
            cont.style.flexDirection="column"
            meta_cont.style.backgroundColor="rgba(255,255,255,0.8)"
            meta_cont.style.width="250px"
            meta_cont.style.height="290px"

            highlight_popup_toggle.innerHTML="- Highlighter -"

          }else if(storage.toggles.highlighter.state==="closed"){
            //disable
            cont.className= cont.className.replace("_active","")
            cont.style.display="none"
            meta_cont.style.backgroundColor="rgba(255,255,255,0)"
            meta_cont.style.height="0%"

            highlight_popup_toggle.innerHTML="+ Highlighter +"

          }
        } else{ //note open by default
          highlight_popup_toggle.innerHTML="+ Highlighter +"
          highlight_popup_toggle.className="toggle_popup_active"
        }

        //handle highlighter
        //it seems impossible to filter out inputs for this.
        //the only way to write with highlighter enabled is to press the mouse button while writing
        async function mouse_up_highlight(e){
          await create_highlight(e, storage, color_picker)
        }
        
        let highlighter_state=document.getElementById("highlighter_check_input")        
        highlighter_state.addEventListener("click",function(){
            console.log("HIGHLIGHTER STATE:", highlighter_state, highlighter_state.checked)
          if(highlighter_state.checked===true){
            alert("While the highlighter is active you will not be able to write in inputs.\nDisable the highlighter to be able to write again.")
            document.querySelectorAll("*").forEach(el=>{
              el.addEventListener("mouseup", mouse_up_highlight,true)
            })
          }else{
            document.querySelectorAll("*").forEach(el=>{
              el.removeEventListener("mouseup",mouse_up_highlight,true)
            })
          }
        })

        
       

        

      })
    
}
)

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(s) {
  console.log("RGB TO HEX", s.split(","))
  r= s.split(",")[0].replace("rgb(","").trim()
  g= s.split(",")[1].trim()
  b= s.split(",")[2].replace(")","").trim()
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function logSelection(event) {
  const selection = event.target.value.substring(
    event.target.selectionStart,
    event.target.selectionEnd,
  );
  console.log(`You selected: ${selection}`)
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

  async function create_color(storage, color_picker, my_colors_cont, color_hex){
    let new_color_cont= document.createElement("div")
    //classname converts automatically hex to rgb, ASSIGN THE HEX TO THE CLASSNAME
    new_color_cont.id="new_color_cont_"+color_hex
    new_color_cont.style.display="flex"
    new_color_cont.style.flexDirection="row"
    new_color_cont.style.width="40px"
    new_color_cont.style.textAlign="center"
    


    let new_color_rem= document.createElement("button")
    new_color_rem.innerHTML="X"
    new_color_rem.style.backgroundColor="transparent"//color_hex
    new_color_rem.style.borderRadius="50%"
    new_color_rem.style.height="1vh"

    new_color_rem.style.border="transparent"
    new_color_rem.style.color="grey"
    new_color_rem.style.fontSize="8px"
    new_color_rem.style.marginLeft="0%"
    new_color_rem.style.marginRight="1%"
    new_color_rem.style.width="5px"
    new_color_rem.style.padding=0
    new_color_rem.style.cursor="pointer"

    
    //add color to storage
    console.log("STORAGE CHECK", storage, storage.my_colors.filter(d=>d.color===color_hex).length>0 )
    if (storage.my_colors.filter(d=>d.color===color_hex).length===0){ //add only not existing colors to storage
      let new_storage= storage
      let color_entry={color: color_hex, name: color_hex} //name equal to color by default, the user will change it later through an apposite input on the color entry
      new_storage.my_colors =[... new_storage.my_colors, color_entry]
      await chrome.storage.local.set(new_storage) 
      console.log("NEW COLORS STORAGE", storage)
    }
    //handle color removal
    new_color_rem.addEventListener("click",async function(e){
      let new_storage= storage
      new_storage.my_colors=  new_storage.my_colors.filter(f=>f.color !== e.target.parentElement.id.toString().split("_").slice(-1)[0])
      await chrome.storage.local.set(new_storage)
      console.log(storage)

      document.getElementById(e.target.parentElement.id).remove()

      //remove also the name input
      document.getElementsByClassName("color_name_inp")[0].remove()

    })

    let new_color= document.createElement("input")
    new_color.id="new_color_"+color_hex
    new_color.type="color"
    new_color.value= color_hex
    new_color.style.width="25px"
    new_color.style.backgroundColor="transparent"
    new_color.style.border="transparent 0px solid"
    new_color.style.cursor="pointer"
    new_color.addEventListener("click", function(e){
      e.preventDefault()
      //set color picker
      color_picker.value= e.target.value
      //show name
      try{
        document.getElementsByClassName("color_name_inp")[0].remove()
      }catch{

      }
      let my_colors_name_inp_cont=document.createElement("div")
      my_colors_name_inp_cont.className="color_name_inp"
      my_colors_name_inp_cont.id="color_name_inp_"+color_hex
      let my_colors_name_inp= document.createElement("input")
      my_colors_name_inp.className="color_name_inp"
      my_colors_name_inp.id="color_name_inp_"+color_hex
      my_colors_name_inp.value= color_hex
      my_colors_name_inp.style.fontSize= "12px"
      my_colors_name_inp.style.height ="15px"
      my_colors_name_inp_cont.style.marginLeft="13%"
      my_colors_name_inp_cont.appendChild(my_colors_name_inp)
      document.getElementById("note_sub_cont_highlight").insertBefore(my_colors_name_inp_cont, my_colors_cont)
    })
    console.log(my_colors_cont.getElementsByTagName("*"))
      
     //do not add already existing color
      for(let i=0;i<my_colors_cont.getElementsByTagName("*").length;i++){
        if (my_colors_cont.getElementsByTagName("*").item(i).value === new_color.value){
          return
        }
      }

      new_color_cont.appendChild(new_color)
      new_color_cont.appendChild(new_color_rem)
      
      my_colors_cont.appendChild(new_color_cont)
    
  }

  async function create_highlight(e, storage, color_picker){ //change color_picker with an apposite color val arg in hex
    if(e.target.tagName !== "input"){
      //THIS FUNCTION IS WRONG, THINK ABOUT AN EASY WAY TO UNDERLINE TEXT AT CORRECT INDEXES
      e.preventDefault()
      console.log(window.getSelection())
      let selection= window.getSelection()
      let selection_parent = window.getSelection().anchorNode.parentElement
      let selection_start= window.getSelection().getRangeAt(0)
      let all_text= selection_parent.textContent
      let selection_text=""
      console.log("SEL START", selection_start, window.getSelection())
      let all_els_sel= selection_start.commonAncestorContainer.nodeValue
      console.log("ALL_ELS", all_els_sel)
      if( selection.anchorNode === selection_start.startContainer && selection.anchorNode === selection_start.endContainer){
        if (selection.anchorOffset < selection.focusOffset) { //NORMAL SELECTION: top down
          selection_text=window.getSelection().anchorNode.textContent.slice(selection.anchorOffset, selection.focusOffset)
        }else if (selection.focusOffset < selection.anchorOffset){ // REVERSE SELECTION: bottom up (invert anchor and focus otherwise it deletes the text without inserting the right selection range)
          selection_text=window.getSelection().anchorNode.textContent.slice(selection.focusOffset, selection.anchorOffset)
          //console.log("inverse selection not valid")    
        }
        if(selection_text.trim().replace("~~~","").length>0){
          let new_highlight= document.createElement("span")
          new_highlight.id= `highlight_${color_picker.value.slice(1,)}` //without #
          new_highlight.className= "highlight_ext"
          new_highlight.style.backgroundColor=color_picker.value
          new_highlight.innerHTML=selection_text
          new_highlight.style.cursor="pointer"
          new_highlight.style.border="solid 1px black"
  
          new_highlight.addEventListener("contextmenu",(el)=>{el.preventDefault();delete_highlight(el.target)})
          
          selection_start.deleteContents()
          selection_start.insertNode(new_highlight)
        }

      }else{
        console.log("ERROR", selection.anchorNode, selection.extentNode, selection.focusNode, selection.containsNode)
        return
      }


      /*  IT MAY BE TOO TEDIOUS: THE DOM STRUCTURE MAY BE COMPLICATED, MANY ELEMENTS ALONG WITH PARENTS MAY NOT HAVE REFERENCES
      ONE WAY WOULD BE TO SERIALIZE HTML TO JSON AND PASS IT AS A VALUE IN A KEY OF THE DICT (only str in local storage)
      BUT RETRIEVING NODES FROM SELECTION SEEMS NOT EASY (in selection, they are references)

      /*  DEVELOPE THIS FEATURE IN FUTURE!
      //update highlights in storage
      let already_existing_highlights = storage.highlights
      //CHANGE THIS to the needed data w.r.t. the retrieval
      let new_highlight_dict= {url:window.location.href, anchor_text:selection.anchorNode.textContent, focus_node_text:selection.focusNode.textContent, parent_node_text: selection.anchorNode.parentElement.textContent,
                          anchor_parent_id: selection.anchorNode.parentElement.id, anchor_id:selection.anchorNode.id,
                           anchor_offset: selection.anchorOffset, focus_offset: selection.focusOffset,
                            color:color_picker.value
                          }
      //try to save selector data instead

      let new_highlights=[... already_existing_highlights, new_highlight_dict]

      console.log(selection.anchorNode.parentElement.outerHTML)
      
      let new_storage= storage
      new_storage.highlights= new_highlights
      await chrome.storage.local.set(new_storage)
      console.log("NEW STORAGE HIGHLIGHT", storage)
      */


    }
  }


  
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log("MESSAGE:", message)
    if(message.action==="get_toggle_states"){
        console.log("MESSAGE RECEIVED IN BG")

        //get toggles and positions
        let toggle_notes= document.querySelectorAll("#toggle_popup")[1]
        let toggle_highlighter=document.querySelectorAll("#toggle_popup")[0] 
        console.log("TOGGLES:", toggle_notes, toggle_highlighter)
        let notes_rect= toggle_notes.getBoundingClientRect()
        let highlighter_rect= toggle_highlighter.getBoundingClientRect()
        //add toggle state

        console.log("NOTE RECT", notes_rect)


        //save them to firebase
        chrome.storage.local.get().then(async (storage)=>{
          console.log("STORAGE", storage)
          let notes_rect_to_json=JSON.parse(JSON.stringify( notes_rect))
          let highlighter_rect_to_json=JSON.parse(JSON.stringify( highlighter_rect))
          let new_storage= storage
          console.log("TO JSON", notes_rect_to_json, highlighter_rect_to_json)
          notes_rect_to_json.state =  toggle_notes.innerHTML.includes("+") ?"closed" :"opened"
          highlighter_rect_to_json.state = toggle_highlighter.innerHTML.includes("+") ?"closed" :"opened"
          new_storage.toggles.notes= notes_rect_to_json
          new_storage.toggles.highlighter= highlighter_rect_to_json

          await chrome.storage.local.set(new_storage)
          console.log("MODIFIED STORAGE", storage)
        })

        sendResponse({
            response:"Message received"
        })

    }
})

function delete_highlight(el){
 
  el.outerHTML=el.innerHTML
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
  if(message.message==="update_counters"){
        //update counters
        let domain_counter= document.getElementById("domains_counter")
        let url_counter= document.getElementById("urls_counter")

        //check only base (notes on the service)
        let curr_url=document.URL
        chrome.storage.local.get().then((new_storage)=>{
          let urls = new_storage.notes.map(d=>d.url)
          let curr_base= curr_url.match(/(http.+\.\w+)\//)[0]
          let urls_bases= urls.map(d=>d.match(/(http.+\.\w+)\//)[0])
          if(urls_bases.includes(curr_base)){
              console.log("base URL in storage", curr_base, urls_bases.filter(d=>d===curr_base).length)
              //add icon for base equality
  
          }
  
          let n_urls= urls.filter(d=>d===curr_url).length
          let n_bases= urls_bases.filter(d=>d===curr_base).length
  
          domain_counter.innerHTML=n_bases
          url_counter.innerHTML=n_urls
        })
        
  } else if(message.message==="reset_counters"){
    let domain_counter= document.getElementById("domains_counter")
    let url_counter= document.getElementById("urls_counter")

    domain_counter.innerHTML="0"
    url_counter.innerHTML="0"
  }
})