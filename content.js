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

        let highlight_popup_toggle = document.createElement("button")
        highlight_popup_toggle.innerHTML="+ Highlighter +"
        highlight_popup_toggle.id="toggle_popup"
        highlight_popup_toggle.className="toggle_popup_active"
        highlight_popup_toggle.style.fontSize="12px"
        highlight_popup_toggle.style.textAlign="center"
        highlight_popup_toggle.style.width="100%"
        highlight_popup_toggle.style.backgroundColor="rgba(255,0,0,1)"
        highlight_popup_toggle.style.color="white"
        highlight_popup_toggle.addEventListener("click", function(){
          let meta_cont= document.getElementById("note_meta_cont_highlight")
          let cont=document.getElementById("note_sub_cont_highlight")
          if (cont.className.includes("_active")){
              //disable
              cont.className= cont.className.replace("_active","")
              cont.style.display="none"
              meta_cont.style.backgroundColor="rgba(255,255,255,0)"
              meta_cont.style.height="0%"

              highlight_popup_toggle.innerHTML="+ Highlighter +"

          }else{
              //enabale
              cont.className= cont.className+"_active"
              cont.style.display="flex"
              cont.style.flexDirection="column"
              meta_cont.style.backgroundColor="rgba(255,255,255,0.8)"

              highlight_popup_toggle.innerHTML="- Highlighter -"
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

        //create main and sub also for highleter
        let meta_cont_highlight= document.createElement("div")
        meta_cont_highlight.id="note_meta_cont_highlight"

        meta_cont_highlight.style.position="fixed"
        meta_cont_highlight.style.zIndex="999999999999"
        meta_cont_highlight.style.width="200px"
        meta_cont_highlight.style.height="125px"
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

        //create element for sub_cont_highlighter
        let color_picker_label= document.createElement("label")
        color_picker_label.innerHTML="Highlight color: "
        color_picker_label.style.fontSize="18px"
        color_picker_label.style.marginTop="1%"
        color_picker_label.style.width="70%"

        let color_picker= document.createElement("input")
        color_picker.type="color"
        color_picker.id="color_picker"
        color_picker.style.width="20%"


        let color_picker_cont= document.createElement("div")
        color_picker_cont.id="color_picker_cont"
        color_picker_cont.style.display="flex"
        color_picker_cont.style.flexDirection="row"
        color_picker_cont.style.marginTop="3%"
        color_picker_cont.style.marginLeft="5%"

        let create_notes_for_colors_cont= document.createElement("div")
        create_notes_for_colors_cont.id="create_notes_for_colors_cont"
        create_notes_for_colors_cont.style.marginLeft="5%"
        create_notes_for_colors_cont.style.marginTop="3%"

        let create_notes_for_colors= document.createElement("button")
        create_notes_for_colors.innerHTML="Create notes from highlights"
        create_notes_for_colors.style.border="1px black solid"
        create_notes_for_colors.style.width="90%"
        create_notes_for_colors.style.fontSize="12px"
        create_notes_for_colors.style.textAlign="left"

        let my_colors_cont= document.createElement("div")
        my_colors_cont.id="my_colors_cont"
        my_colors_cont.style.display="flex"
        my_colors_cont.style.flexDirection="row"
        my_colors_cont.style.flexWrap= "wrap"
        my_colors_cont.style.minWidth="100%"
        my_colors_cont.style.height="100%"
        my_colors_cont.style.border="1px solid black"

        let my_colors_add_btn_cont= document.createElement("div")
        my_colors_add_btn_cont.id="my_colors_add_btn_cont"

        let my_colors_add_btn= document.createElement("button")
        my_colors_add_btn.id= "my_colors_add_btn"
        my_colors_add_btn.innerHTML="Add to default colors"
        my_colors_add_btn.addEventListener("click",function(){
          let new_color_cont= document.createElement("div")
          //classname converts automatically hex to rgb, ASSIGN THE HEX TO THE CLASSNAME
          new_color_cont.id="new_color_cont_"+color_picker.value
          new_color_cont.style.display="flex"
          new_color_cont.style.flexDirection="row"
          new_color_cont.style.width="30%"
          let new_color_rem= document.createElement("button")
          new_color_rem.innerHTML="X"
          new_color_rem.style.backgroundColor=color_picker.value
          new_color_rem.style.borderRadius="50%"
          new_color_rem.style.height="40%"

          new_color_rem.style.border="transparent"
          new_color_rem.style.color="grey"
          new_color_rem.style.fontSize="12px"
          new_color_rem.style.marginLeft="-1%"
          new_color_rem.style.marginRight="1%"
          new_color_rem.style.width="25%"
          new_color_rem.addEventListener("click",function(e){
            document.getElementById(e.target.parentElement.id).remove()
          })

          let new_color= document.createElement("input")
          new_color.id="new_color_"+color_picker.value
          new_color.type="color"
          new_color.value= color_picker.value
          new_color.style.width="80%"
          new_color.addEventListener("click", function(e){
            e.preventDefault()
            color_picker.value= e.target.value
          })
          console.log(my_colors_cont.getElementsByTagName("*"))
                  
            for(let i=0;i<my_colors_cont.getElementsByTagName("*").length;i++){
              if (my_colors_cont.getElementsByTagName("*").item(i).value === new_color.value){
                return //do not add already existing color
              }
            }

            new_color_cont.appendChild(new_color)
            new_color_cont.appendChild(new_color_rem)
            
            my_colors_cont.appendChild(new_color_cont)
          
        })

      


        //handles seleciton and highlighting
        document.addEventListener("mouseup",function(e){
          if(e.target.tagName !== "input")
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
            let new_highlight= document.createElement("span")
            new_highlight.id= `highlight_${color_picker.value}`
            new_highlight.className= "highlight_ext"
            new_highlight.style.backgroundColor=color_picker.value
            new_highlight.innerHTML=selection_text
            
            selection_start.deleteContents()
            selection_start.insertNode(new_highlight)
          }else{
            console.log("ERROR", selection.anchorNode, selection.extentNode, selection.focusNode, selection.containsNode)
            return
          }
          console.log("POST", selection.anchorNode.getElementsByTagName("*").forEach(d=>d.textContent))


          //USE SLICE ON LIST OF NODE OF THE SELECTION
          //insert span (no with innerHTML) at selection
          //selection_parent.innerHTML = innerHTML_to_text.replace(selection_text, `<span id='highlight_${color_picker.value}' class='highlight_ext' style='background-color:${color_picker.value}'>${selection_text}</span>`)

  

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
        
    })
    
}

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
