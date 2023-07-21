document.addEventListener("DOMContentLoaded",function (){
    console.log("working")
    //chrome.storage.local.clear()
    let absolute_btn= document.getElementById("absolute_btn")
    let relative_btn= document.getElementById("relative_btn")

    let absolute_section=document.getElementById("absolute")
    let relative_section=document.getElementById("relative")

    let absolute_sub= document.getElementById("absolute_sub")
    let relative_sub= document.getElementById("relative_sub")

    let absolute_notes_cont= document.getElementById("absolute_notes_cont")
    let relative_notes_cont= document.getElementById("relative_notes_cont")

    let create_note_abs_btn= document.getElementById("create_note_absolute")
    create_note_abs_btn.className="create_note"
    let create_note_rel_btn= document.getElementById("create_note_relative")

    let note_metadata = document.getElementById("note_metadata")

    let close_note_editor_btn= document.getElementById("close_note_editor")
    close_note_editor_btn.addEventListener("click",()=>{
        close_text_editor()
    })

    let first_click=false

    //load local notes
    try{
        load_local_notes(absolute_notes_cont, create_note_abs_btn, note_metadata )

    }catch{
        console.log("error loading from local")
    }

    //add collapsing section on btn click
    absolute_btn.addEventListener("click",()=> handle_section(absolute_sub, absolute_btn))
    relative_btn.addEventListener("click",()=> handle_section(relative_sub, relative_btn))

    //add note to lists
    create_note_abs_btn.addEventListener("click",()=> create_note(absolute_notes_cont, create_note_abs_btn, note_metadata, "absolute"))

})

function handle_section(div, btn){
    if (btn.className.endsWith("_active")){
        //collapse
        console.log("collapse")
        btn.className= btn.className.replace("_active","")
        div.className= div.className.replace("_active","")
    } else{
        //open
        console.log("open")
        btn.className= btn.className + "_active"
        div.className= div.className + "_active"
    }
}

function del_note(row, note_metadata, note_name, note_date, note_context, note_id){
    note_metadata.innerHTML=""
    note_metadata.id= note_metadata.id.replace("_active","")
    row.remove()
    del_from_local(note_name, note_date, note_context, note_id) 
    
}

function create_note(cont, btn, note_metadata, context, note_id="", storage_date="", storage_name="",note_text=""){
    let id
    if (note_id!==""){
        id= note_id
    }
    else{
        id= cont.childNodes.length
    }
    //create
    btn.className = btn.className + "_active"

    let row= document.createElement("div")
    row.className="note_row"
    row.id="abs_"+id
    
    let bullet_=document.createElement("span")
    bullet_.innerHTML=" ►"
    bullet_.className="bullet_"

    let name= document.createElement("p")
    if(storage_name===""){
    name.innerHTML="Note name"
    }else{
    name.innerHTML=storage_name
    }
    name.className="note_name"
    let date
    if(storage_date===""){
        date= new Date()
    }else{
        date = storage_date
    }
    //node metadata on hover
    name.addEventListener("mouseenter",(event)=>{
        show_note_metadata(note_metadata, name, date, context)
    })

    name.addEventListener("mouseout",(event)=>{
        hide_note_metadata(note_metadata)
    })


    let edit_btn= document.createElement("button")
    edit_btn.innerHTML="&#9998"
    edit_btn.className="edit_note_btn"
    edit_btn.addEventListener("click",()=>{
        open_text_editor(row,edit_btn,name.innerHTML)
    })
    let del_btn= document.createElement("button")
    del_btn.innerHTML="&#128465"
    del_btn.className="del_note_btn"
    del_btn.addEventListener("click",()=> del_note(row, note_metadata, name, date, context, +row.id.split("_")[1]))

    //append
    row.appendChild(bullet_)
    row.appendChild(name)
    row.appendChild(edit_btn)
    row.appendChild(del_btn)
    cont.appendChild(row)

    //save to local except if loaded at the beginning
    if (storage_name===""){
        save_to_local(name, date,context, "abs_"+id.toString()) 
    }


    //finish creation
    setTimeout(()=> btn.className = btn.className.replace("_active",""), 1000)

    
    
    //btn.className = btn.className.replace("_active","")
}

function show_note_metadata(note_metadata, note_name_, note_date, note_context){
    let note_name= note_name_.innerHTML
    //activate div
    note_metadata.id = note_metadata.id + "_active"
    
    let title= document.createElement("p")
    title.innerHTML="Metadata"
    note_metadata.appendChild(title)

    let metadata_cont= document.createElement("div")
    metadata_cont.id="metadata_cont"

    let name_= document.createElement("div")
    name_.innerHTML= "NAME: "+ note_name
    let date_= document.createElement("div")
    date_.innerHTML= "DATE: "+ note_date.toString().split(" GMT")[0]

    let context_=document.createElement("div")
    context_.innerHTML = "CONTEXT: " + note_context

    //append els
    metadata_cont.appendChild(name_)
    metadata_cont.appendChild(date_)
    metadata_cont.appendChild(context_)
    //append to DOM
    note_metadata.appendChild(metadata_cont)






}

function hide_note_metadata(note_metadata){
    console.log("out")
    note_metadata.id= note_metadata.id.replace("_active","")
    note_metadata.innerHTML="" //remove children
}

function save_to_local(note_name_, note_date, context, row_id){
    let note_name= note_name_.innerHTML
    chrome.storage.local.get().then(async (storage)=>{
        console.log("STORAGE", storage, Object.keys(storage).length===0)
        if(Object.keys(storage).length===0){ // if local storage is empty
            storage.notes=[]
        }
        let entry= {"id":storage.notes.length,"name":note_name, "date": note_date.toString().split(" GMT")[0], "context":context, "row_id":row_id}
        storage.notes = [... storage.notes, entry]
        console.log(storage)
    
        await chrome.storage.local.set(storage)
    })
}

function del_from_local(note_name_, note_date_, context, note_id){
    let note_name = note_name_.innerHTML
    let note_date= note_date_.toString().split(" GMT")[0]
    chrome.storage.local.get().then((storage)=>{
        let new_notes = storage.notes.filter(function(d){
            console.log(d.id, note_id)
            if (d.id!==note_id){
                return d
            }
        })
        console.log("new notes", new_notes)
        chrome.storage.local.set({"notes":new_notes})
    })
}


function load_local_notes(cont, btn, note_metadata){
    chrome.storage.local.get().then((storage)=>{
        let notes= storage.notes
        console.log("LOAD", storage, notes)

        notes.forEach(note => {
            create_note(cont, btn, note_metadata,  note.context,  note.id, note.date, note.name)
        });
        
    })
}

function update_note_name(old_name, row, context){
    if (context==="absolute"){
        let list= document.getElementById("absolute_notes_cont")
        console.log("CHANGE")

    }
}

function open_text_editor(row, edit_btn, name){
    console.log("ID", row.id)
    //reset edit_colors
    let all_edit_btns=document.getElementsByClassName("edit_note_btn_active")
    for(let i=0; i<all_edit_btns.length;i++){
        all_edit_btns.item(i).className = all_edit_btns.item(i).className.replace("_active","")
    }
    //empty the note editor
    //open editor
    if (!edit_btn.className.includes("_active")){
        edit_btn.className= edit_btn.className+"_active"
    }
    try{
        try{
            let note_editor_cont= document.getElementById("note_editor_cont")
            note_editor_cont.id= note_editor_cont.id+"_active"
        }catch (e){
            let note_editor_cont= document.getElementById("note_editor_cont_active")

        }


        let note_inp= document.getElementById("editor_note_name_inp")
        note_inp.value= name

        //change name in the note list
        let reload_note_inp= document.getElementById("reload_note_name_inp")

        reload_note_inp.addEventListener("click",function(){
            console.log("CHANGE ", row.id)
            let active_note= document.getElementsByClassName("edit_note_btn_active").item(0).parentElement
            console.log("ACTIVE NOTE", active_note)
            let target_row= document.getElementById(row.id)
            console.log("TARGET ROW", target_row )
            active_note.getElementsByClassName("note_name").item(0).innerHTML = note_inp.value

            //update also storage
            chrome.storage.local.get().then((storage)=>{
                console.log(storage)
                let new_notes=storage.notes.map(function (f,k){
                    console.log(f, note_inp.value, row)
                    if (f.row_id===active_note.id){
                        console.log(f.row_id, active_note.id)
                        f.name= note_inp.value
                        return f
                    } else{
                        return f
                    }

                })
                console.log("INSIDE")
                //set
                chrome.storage.local.set({"notes":new_notes})
                console.log(storage)
                
            })


            /*
            let note_list= document.getElementById("absolute_notes_cont").getElementsByClassName("note_row")
            for(let i=0;i<note_list.length;i++){
                if (note_list.item(i).id === row.id){
                    console.log(note_inp.value, note_list.item(i))
                    let list_entries=note_list.item(i).childNodes
                    console.log("LIST", list_entries)
                    for (let j=0;j<list_entries.length;j++){
                        if (list_entries.item(j).className==="note_name" && note_list.item(i).id=== row.id){
                            console.log("j", list_entries[j],note_list.item(i).id, row.id)
                            //change name in note list
                            list_entries.item(j).innerHTML= note_inp.value

                            //update also storage
                            chrome.storage.local.get().then((storage)=>{
                                console.log(storage)
                                let new_notes=storage.notes.map(function (f,k){
                                    console.log(f, note_inp.value, row)
                                    if (f.name === name && f.row_id===row.id){
                                      f.name= note_inp.value
                                      return f
                                    } else{
                                      return f
                                    }

                                })
                                console.log("INSIDE")
                                //set
                                chrome.storage.local.set({"notes":new_notes})
                                console.log(storage)
                                

                            })
                            
                            


                        }
                    }


                    
                }
            } */
        })


    }catch (e){
        console.log("upload text editor error",e)
    }

}

function close_text_editor(){
    //reset edit colors
    let all_edit_btns=document.getElementsByClassName("edit_note_btn_active")
    console.log(all_edit_btns)
    for(let i=0; i<all_edit_btns.length;i++){
        all_edit_btns.item(i).className = all_edit_btns.item(i).className.replace("_active","")

    }
    //close editor
    let note_editor_cont= document.getElementById("note_editor_cont_active")
    note_editor_cont.id= note_editor_cont.id.replace("_active","")

}