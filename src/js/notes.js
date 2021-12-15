import { makeElement, popUpMenu, animationDelay, clearData } from "./domMan.js";
import { allNotes, PushFormToAllNote } from "./lists.js";

const noteModule = (() => {
    //add new note
    const addNewNote = () => {
        const formInputs = (() => {
                    const form = popUpMenu('new-note', 'new-note-form', 'Add New Note', '50%', '80%');
                    const noteTitle = makeElement('div', 'note-title', form);
                    makeElement('div', 'title-txt', noteTitle).innerText = 'Note Title :';
                    makeElement('input', 'title-input', noteTitle).type = 'text';

                    const noteDescription = makeElement('div', 'note-description', form);
                    makeElement('div', 'description-txt', noteDescription).innerText = 'Note Description :';
                    makeElement('input', 'description-input', noteDescription).type = 'text';

                    const notePriorty = makeElement('div', 'note-priorty', form);
                    makeElement('div', 'priorty-txt', notePriorty).innerText = 'Note Priorty :';
                    let p = makeElement('div', 'priorty-option', notePriorty);
                    let pC = ['high', 'medium', 'low'];
                    let el;
                    for(let i = 0; i <= pC.length-1; i++){
                        el = makeElement('button', `priorty-${pC[i]}`, p);
                        el.setAttribute('title', `${pC[i]}`);
                        el.setAttribute('data-priorty', `${pC[i]}`);
                        el.style.width = '35px';
                        el.style.height = '35px';
                        el.style.borderRadius = '50%';
                        if(pC[i] === 'high') el.style.backgroundColor = 'red';
                        if(pC[i] === 'medium') el.style.backgroundColor = 'green';
                        if(pC[i] === 'low') el.style.backgroundColor = 'yellow';
                    }

                    const saveBtnC = makeElement('div', 'note-btn-div', form);
                    const saveBtnNewNote = makeElement('button', 'note-btn', saveBtnC);
                    saveBtnNewNote.innerText = 'Save';
                    
                    saveBtnNewNote.addEventListener('click', () => saveNoteProcess(undefined, undefined, form, 'new-note'));


                editStyle(form);
        })();
    }
    //open the nav in note
    const noteNav =(element)=>{
        if(element.lastChild.classList.contains('new-note-div')) return element.lastChild.remove();
        const newNote = makeElement('div', 'new-note-div', element);
        makeElement('i', 'fas', newNote).classList.add = 'fa-notes-medical';
        makeElement('div', 'new-note-text', newNote).innerText = 'Add new';
        const navStyle = (() => {
            element.style.display = 'flex';
            element.style.flexDirection = 'column';
            newNote.style.alignSelf = 'end';
            newNote.style.display = 'flex';
            newNote.style.justifyContent = 'flex-end';
            newNote.style.gap = '10px';
            newNote.style.color = '#fe9700';
            newNote.style.alignItems = 'center';
            newNote.style.width = '70%';
            newNote.lastChild.style.fontSize = '20px';
            newNote.lastChild.style.fontWeight = '900';
            newNote.lastChild.style.fontFamily = 'system-ui';
            newNote.lastChild.style.textShadow = 'black 5px 5px 5px'

            newNote.lastChild.addEventListener('mouseover', (e) => {
                e.target.style.cursor = 'pointer';
                e.target.style.color = '#5772c8';
            });
            newNote.lastChild.addEventListener('mouseout', (e) => e.target.style.color = '#fe9700');
            newNote.lastChild.addEventListener('click', () => addNewNote());

            animationDelay(newNote.childNodes, 50, 50, 'open-list', 'fadein 600ms ease-out forwards');

        })();
    }

    //if there is no note in the note opject
    const noNoteFound = (rightBody) =>{
        if(rightBody.querySelector('.no-note-alert')) rightBody.querySelector('.no-note-alert').remove();
        const alert = makeElement('div', 'no-note-alert', rightBody);
        const alertTxt = makeElement('div', 'alert-txt', alert);
        const alertBtn = makeElement('button', 'alert-btn', alert);

        alertTxt.innerText = 'There Is No Notes Found!!';
        alertBtn.innerText = 'Add New Note';

        const alertStyle = (() => {
            rightBody.style.display = 'block';
            alert.style.height = '50%';
            alert.style.display = 'flex';
            alert.style.flexDirection = 'column';
            alert.style.alignItems = 'center';
            alert.style.justifyContent = 'center';
            alert.style.gap = '50px';

            alertTxt.style.fontSize = '30px';
            alertTxt.style.fontWeight = '900';
            alertTxt.style.color = 'red';
            alertTxt.style.textShadow = 'black 2px 2px 2px';
            alertTxt.style.fontFamily = 'system-ui';

            alertBtn.style.fontSize = '20px';
            alertBtn.style.fontWeight = '900';
            alertBtn.style.fontFamily = 'system-ui';
            alertBtn.style.textShadow = 'black 2px 2px 2px';
            alertBtn.style.color = '#fd9600';
            alertBtn.style.backgroundColor = '#0e36b9';
            alertBtn.style.padding = '10px 20px';
            alertBtn.style.border = 'solid #0e36b9 1px';
            alertBtn.style.borderRadius = '50px';

            alertBtn.addEventListener('mouseover', (e) => {
                e.target.style.cursor = 'pointer';
                e.target.style.backgroundColor = '#fd9600';
                e.target.style.color = '#0e36b9';
            });
            alertBtn.addEventListener('mouseout', (e) => {
                e.target.style.color = '#fd9600';
                e.target.style.backgroundColor = '#0e36b9';
            });

            animationDelay(alert.childNodes, 50, 50, 'open-list', 'fadedown 800ms ease-out forwards');
        })();

    }

    //the save note process
    const saveNoteProcess = (note, node, form,type) => {
        const editProcess = () => {
            const newNote = (() => {
                let newTitle, newDescription, newPriorty;
                form.childNodes.forEach(child => {
                    if(child.classList.contains('note-title')) newTitle = child.lastChild.value;
                    if(child.classList.contains('note-description')) newDescription = child.lastChild.value;
                    if(child.classList.contains('note-priorty')) {
                        let p = [...child.lastChild.childNodes];
                        for(let i = 0; i <= p.length - 1; i++){
                            if(p[i].dataset.priorty === 'high') return newPriorty = 'red';
                            if(p[i].dataset.priorty === 'medium') return newPriorty = 'green';
                            if(p[i].dataset.priorty === 'low') return newPriorty = 'yellow';
                        }
                    }
                });
                return {
                    newTitle,
                    newDescription,
                    newPriorty,
                }
                })();
                allNotes[`${note}`].title = newNote.newTitle;
                allNotes[`${note}`].description = newNote.newDescription;
                allNotes[`${note}`].priorty = newNote.newPriorty;
                node.firstChild.innerText = newNote.newTitle;
                node.parentNode.lastChild.firstChild.innerText = newNote.newDescription;
                form.parentNode.parentNode.remove();
            }

        const newSaveProcess = () =>{
            const checkIfEmpty = (form) =>{
                form.childNodes.forEach(child => {
                    if(child.classList.contains('note-title')){
                        if(child.lastChild.value === '') child.lastChild.value = 'No Title';
                    }
                    if(child.classList.contains('note-description')){
                        if(child.lastChild.value === '') child.lastChild.value = 'No Description';
                    }
                    if(child.classList.contains('note-priorty')){
                        let p = [...child.lastChild.childNodes];
                        let isActive = false;
                        for(let i = 0; i <= p.length-1; i++){
                            if(p[i].classList.contains('active')) return isActive = true;
                        }         
                        if(!isActive) p.forEach(el => { if(el.classList.contains('priorty-low')) setActive(p, el) });
                    }

                });
                
            }
            const getFormData = (() =>{
                checkIfEmpty(form);
                let title, description, priorty, creationDate;
                form.childNodes.forEach(child =>{
                        if(child.classList.contains('note-title')) title = child.lastChild.value;
                        if(child.classList.contains('note-description')) description = child.lastChild.value; 
                        if(child.classList.contains('note-priorty')) {
                            let p = [...child.lastChild.childNodes];
                            for(let i = 0; i <= p.length - 1; i++){
                                if(p[i].classList.contains('active')){
                                    if(p[i].dataset.priorty === 'high') return priorty = 'red';
                                    if(p[i].dataset.priorty === 'medium') return priorty = 'green';
                                    if(p[i].dataset.priorty === 'low') return priorty = 'yellow';
                                }
                            }
                        } 

                });
                creationDate = new Date().toISOString().slice(0, 10);
                return{
                    title,
                    description,
                    priorty,
                    creationDate
                }
            })();
            const saveProcess = (() => {
                new PushFormToAllNote(getFormData).appendToallNote();

                form.parentNode.parentNode.remove();

                const rightBody = document.querySelector('.right');
                clearData(rightBody);
                runNotes(rightBody);

                
            })();

        }
        //check the type of edit
        if(type === 'edit') editProcess();
        if(type === 'new-note') newSaveProcess();
    }

    //if there is a notes
    const runNotes = (rightBody) =>{
        const container = makeElement('div', 'notes-container', rightBody)
        const header = makeElement('div', 'notes-header', container);
        const body = makeElement('div', 'notes-body', container);
        header.innerText = 'All Notes';

        //check the note priorty
        const checkPriorty = (note) => {
            let priorty = allNotes[`${note.dataset.note}`].priorty;

            if(priorty === 'red') return note.style.border = '5px outset red';
            if(priorty === 'green') return note.style.border = '5px outset green';
            if(priorty === 'yellow') return note.style.border = '5px outset yellow';

        }

        //delete the note 
        const noteDelete = (note, node) => {
            delete allNotes[`${note}`];
            node.parentNode.remove();
        }

        //edit note
        const noteEdit = (note, node) => {
            const oldValues = (() => {
                let title, description, priorty, creationDate;
                title = allNotes[`${note}`].title;
                description = allNotes[`${note}`].description;
                priorty = allNotes[`${note}`].priorty;
                creationDate = allNotes[`${note}`].creationDate;
                return{
                    title,
                    description,
                    priorty,
                    creationDate,
                }
            })();
            const noteBody = popUpMenu('note-edit-body', 'note-edit-container', 'Edit Note', '50%', '80%');
            const noteTitle = makeElement('div', 'note-title', noteBody);
            makeElement('div', 'title-txt', noteTitle).innerText = 'Title :';
            let iTitle = makeElement('input', 'title-input', noteTitle);
            iTitle.type = 'text';
            iTitle.value = oldValues.title;

            const noteDescription = makeElement('div', 'note-description', noteBody);
            makeElement('div', 'description-txt', noteDescription).innerText = 'Description :';
            let iDescription = makeElement('input', 'description-input', noteDescription);
            iDescription.value = 'text';
            iDescription.value = oldValues.description;

            //the date can not change 'it's the creation date'
            const noteDate = makeElement('div', 'note-creationDate', noteBody);
            makeElement('div', 'creationDate-txt', noteDate).innerText = 'Creation Date :';
            makeElement('div', 'creationDate', noteDate).innerText = oldValues.creationDate.toISOString().slice(0, 10);

            const priorty = makeElement('div', 'note-priorty', noteBody);
            makeElement('div', 'priorty-txt', priorty).innerText = 'Priorty :';
            let priortyOption = makeElement('div', 'priorty-option', priorty);
            let p = ['high', 'medium', 'low'];
            let btn;
            for(let i = 0; i <= p.length -1 ; i++){
                btn = makeElement('button', `priorty-${p[i]}`, priortyOption);
                btn.setAttribute('title', `${p[i]}`);
                btn.setAttribute('data-priorty', `${p[i]}`);
                btn.style.width = '35px';
                btn.style.height = '35px';
                btn.style.borderRadius = '50%';

                if(p[i] === 'high') btn.style.backgroundColor = 'red';
                if(p[i] === 'medium')  btn.style.backgroundColor = 'green';
                if(p[i] === 'low')  btn.style.backgroundColor = 'yellow';
            };
            priortyOption.childNodes.forEach(child => {
                if(oldValues.priorty === 'red' && child.dataset.priorty == 'high') return setActive(priortyOption.childNodes, child);
                if(oldValues.priorty === 'green' && child.dataset.priorty === 'medium') return setActive(priortyOption.childNodes, child);
                if(oldValues.priorty === 'yellow' && child.dataset.priorty === 'low') return setActive(priortyOption.childNodes, child);
            });

            

            const btnDiv = makeElement('div', 'note-btn-div', noteBody);
            const btnSave = makeElement('button', 'note-btn', btnDiv);
            btnSave.innerText = 'Save';
            btnSave.addEventListener('click', () => saveNoteProcess(note, node, noteBody, 'edit'));
            editStyle(noteBody);

    
        }
        
        const notes = (() => {
            let theNotes = [...Object.keys(allNotes)];
            let noteArr = [];
            theNotes.forEach(note => {
            let noteNode;
            let noteNodeContainer = makeElement('div', 'one-note-container' , body);
                noteNode = makeElement('div', 'note', noteNodeContainer);
                noteNode.setAttribute('data-note', note);
                makeElement('div', 'note-txt', noteNode).innerText = allNotes[`${note}`].title;
                makeElement('div', 'note-date', noteNode).innerText = allNotes[`${note}`].creationDate.toLocaleString().slice(0, 9);
                checkPriorty(noteNode);

                noteNode.addEventListener('click', (e) =>{
                    if(noteNode.parentNode.lastChild.classList.contains('description-container')) {
                        return noteNode.parentNode.lastChild.remove();
                    };
                    let dsC = makeElement('div', 'description-container', noteNodeContainer);
                    makeElement('div', 'note-description', dsC).innerText = allNotes[`${note}`].description;
                    let btnC = makeElement('div', 'btn-container', dsC);
                    makeElement('button', 'note-edit', btnC).innerText = 'Edit';
                    makeElement('button', 'note-delete', btnC).innerText = 'Delete';

                    //the new div style
                    animationDelay(dsC.childNodes, 50, 50, 'open-description', 'fadedown 500ms ease-out forwards');
                    dsC.style.width = '90%';
                    dsC.style.marginTop = '20px';
                    dsC.style.marginBottom = '20px';
                    dsC.style.display = 'flex';
                    dsC.style.flexDirection = 'column';
                    dsC.style.gap = '20px';
                    dsC.firstChild.style.fontSize = '25px';
                    dsC.firstChild.style.fontWeight = '900';
                    dsC.firstChild.style.fontFamily = 'system-ui',

                    btnC.style.display = 'flex',
                    btnC.style.alignItems = 'center';
                    btnC.style.justifyContent = 'center';
                    btnC.style.gap = '10px';
                    btnC.childNodes.forEach(btn =>{
                        btn.style.padding = '3px 10px';
                        btn.style.borderRadius = '10px';
                        btn.style.border = 'none';
                        btn.style.fontFamily = 'system-ui';
                        btn.style.fontWeight = '900';
                        btn.style.fontSize = '25px';
                        switch(btn.innerText){
                            case 'Edit':
                                btn.style.color = 'rgb(252, 169, 49)';
                                btn.style.backgroundColor = 'rgb(14, 54, 185)';
                                btn.addEventListener('mouseover', (e) => {
                                    e.target.style.cursor = 'pointer';
                                    e.target.style.color = 'rgb(14, 54, 185)';
                                    e.target.style.backgroundColor = 'rgb(252, 169, 49)';
                                });
                                btn.addEventListener('mouseout', (e) =>{
                                    e.target.style.color = 'rgb(252, 169, 49)';
                                    e.target.style.backgroundColor = 'rgb(14, 54, 185)';
                                });
                                btn.addEventListener('click', () => noteEdit(note, noteNode));
                                
                                break;

                            case 'Delete':
                                btn.style.color = 'red'
                                btn.style.backgroundColor = 'black';
                                btn.addEventListener('mouseover', (e) => {
                                    e.target.style.cursor = 'pointer';
                                    e.target.style.color = 'black';
                                    e.target.style.backgroundColor = 'red';
                                });
                                btn.addEventListener('mouseout', (e) => {
                                    e.target.style.color = 'red';
                                    e.target.style.backgroundColor = 'black';
                                });
                                btn.addEventListener('click', () => noteDelete(note, noteNode));
                                break;
                        }
                    })
                });
            
                noteArr.push(noteNode);
            });
            return noteArr;
    })();


    
        const notesStyle = (() => {
            rightBody.style.display = 'block';
            container.style.width = '95%';
            container.style.margin = 'auto';
            container.style.height = '95%';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '25px';

            header.style.color = 'white';
            header.style.fontSize = '50px';
            header.style.fontWeight = '900';
            header.style.fontFamily = 'system-ui';
            header.style.textShadow = 'black 5px 4px 0px';

            //style the notes
            notes.forEach(note => {
                note.style.backgroundColor = 'black';
                note.style.display = 'flex';
                note.style.margin = 'auto auto 5px';
                note.style.width = '90%';
                note.style.padding = '5px';
                note.firstChild.style.flex = '1';
                note.firstChild.style.textAlign = 'center';
                note.lastChild.style.flex = '2';
                note.childNodes.forEach(c => {
                    c.style.fontSize = '30px';
                    c.style.fontFamily = 'Times New Roman';
                    c.style.color = 'rgb(255 152 0)';
                });

                //note parent style
                note.parentNode.style.display = 'flex';
                note.parentNode.style.flexDirection = 'column';
                note.parentNode.style.textAlign = 'center';

                //add event lstener
                note.addEventListener('mouseover', (e) => e.target.style.cursor = 'pointer');
            });


        })();
    };
    const setActive = (nodeList, target) =>{
        nodeList.forEach(n => {
            if(n.classList.contains('active')) n.classList.toggle('active');
        });
        target.classList.toggle('active');
        //active style
        nodeList.forEach(n =>{
            if(n.classList.contains('active')){
                n.style.outline = 'solid 1px #ffac32';
                n.style.border = 'solid 3px black !important';
            }
            if(!n.classList.contains('active')) {
                n.style.border = 'none';
                n.style.outline = 'none';
            }
        });
    }

    //the edit style
    const editStyle = (noteBody) => {
        noteBody.style.height = '90%';
        noteBody.style.display = 'flex';
        noteBody.style.flexDirection = 'column';
        noteBody.style.justifyContent = 'space-around';
        noteBody.childNodes.forEach(c => {
            c.style.display = 'flex';
            c.style.fontSize = '25px';
            c.style.fontWeight = '900';
            c.style.fontFamily = 'cursive';
            c.style.color = 'rgb(255 172 50)';
            c.style.justifyContent = 'center';
            c.style.alignItems = 'center';
            c.style.marginLeft = '8%';
            c.style.marginRight = '8%';
                c.childNodes.forEach(child => child.style.flex = '1');

                    c.firstChild.style.textAlign = 'center';
                    c.lastChild.style.height = '35px';
                    c.lastChild.style.fontSize = '20px';
                    c.lastChild.style.borderRadius = '10px';
                    c.lastChild.style.textAlign = 'center';
                    c.lastChild.style.fontWeight = '900';

            //priorty btn style
            if(c.classList.contains('note-priorty')){
                    c.lastChild.style.display = 'flex';
                    c.lastChild.style.alignItems = 'center';
                    c.lastChild.style.justifyContent = 'space-evenly';
                    c.lastChild.childNodes.forEach(child => child.style.border = 'none');
                    c.lastChild.childNodes.forEach(child => {
                        child.addEventListener('mouseover', (e) => {
                            e.target.style.cursor ='pointer';
                            e.target.style.transform = 'scale(1.1)';
                        });
                        child.addEventListener('mouseout', (e) => e.target.style.transform = 'scale(1)');
                        child.addEventListener('click', (e) => setActive(c.lastChild.childNodes, e.target))
                    })
                    };
            //text field style
            if(c.lastChild.type === 'text'){
                    c.lastChild.style.backgroundColor = 'rgba(98, 128, 224, 0.2)';
                    c.lastChild.style.color = 'white';
                        c.lastChild.addEventListener('mousedown', (e) => {
                                e.target.style.backgroundColor = 'white';
                                e.target.style.color = 'black';
                                e.target.style.transition = 'all 500ms ease-in-out 0ms';

                            });
                        }

            if(c.classList.contains('note-creationDate')){
                c.lastChild.style.display = 'flex';
                c.lastChild.style.justifyContent = 'center';
                c.lastChild.style.alignItems = 'center';
            }
                //style the btn
            if(c.classList.contains('note-btn-div')){
                    c.firstChild.style.flex = '0';
                    c.firstChild.style.padding = '10px 20px';
                    c.firstChild.style.display = 'flex';
                    c.firstChild.style.alignItems = 'center';
                    c.firstChild.style.color = 'red';
                    c.firstChild.style.backgroundColor = 'transparent';
                    c.firstChild.style.border = 'none';
                    c.firstChild.style.fontSize = '30px';
                    c.firstChild.style.fontFamily = 'monospace';
                            c.firstChild.addEventListener('mouseover', (e) => {
                                e.target.style.cursor = 'pointer';
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                c.firstChild.addEventListener('mouseout', () => {
                                    e.target.style.backgroundColor = 'transparent';
                                });
                            });
                            
                        };
   
                    })
    };

    return{
        noteNav,
        noNoteFound,
        runNotes,
        editStyle,
        setActive
    }

})();
export {noteModule};