import { lists, Tasks, allNotes } from "./lists.js";
import { noteModule } from "./notes.js";

/* function makeElement usage:
        - make element
        - append element
         - add class or attribute
         - default : (div, no Id or class, append to document, body)
            Note: if no (. Or # pass it consider as a class)
         */
const makeElement = (element, cOrId, elementToAppend) => {
            let el = (element === undefined) ? document.createElement('div'): document.createElement(element);
        
            //append the element
            if(elementToAppend === undefined) {
                document.body.append(el);
            }else{
                elementToAppend.append(el);
            }
        
            if(cOrId === undefined) return el;
            
            //set the id or the class
            if(cOrId[0] !== '#' && cOrId[0] !== '.') {
                el.classList.add(cOrId);
                return el
            };

            let attr = cOrId.slice(1);
            if(cOrId[0] === '.')    el.classList.add(attr);
            if(cOrId[0] === '#')    el.setAttribute('id', `${attr}`);
        
            return el;
    }

//add hover effect changing color
// {parms} = the Dom element
//{parms} = mainColor
//{parms} = hover color
// Note: elTwo will change a color of second element they will work across each other
const hoverColor = (el, mainColor, hoverColor) => {

    el.style.color =  hoverColor;
    el.addEventListener('mouseout', () => el.style.color = mainColor);
    el.style.cursor = 'pointer';

    }

//position the element in center
//{param backC = backgroundColor}
//{param wid = width}
//{param hei = height}
const ceterPositonAbsolute = (el, backC, wid, hei) =>
{
    el.style.position = 'absolute';
    el.style.top = '50%';
    el.style.left = '50%';
    el.style.transform = 'translate(-50%, -50%)';
        if(backC !== undefined) el.style.backgroundColor = backC;
        if(wid !== undefined) el.style.width = wid;
        if(hei !== undefined) el.style.height = hei;
    }


//these function add animation delay to the targets element
//{param = div} the target element
//{delay}{add} numbers 
//{parm c} the class you whant to trigger animation
//{parm frameName} the key frame which added to css style
const animationDelay = (divs, delay, add, c, styleRole) => {
    let targetEl;
    divs.forEach(d => {
        d.classList.toggle(c);
    });

    targetEl = document.querySelectorAll(`.${c}`);
    targetEl.forEach(el => {
        el.style.opacity = 0;
        el.style.animation= styleRole;
        el.style.animationDelay = `${delay}ms`;
        delay += add; 
    });

    }

//these function will toggle active and remove active
const listActive = (nodeList, c) => {
    nodeList.forEach(n => {
        if(n.classList.contains(c)) n.classList.toggle(c);
    });
    }

 /*will make a pop menu and return a body to add a content to it
    *@param {the container class "string"} containerC
    *@param {the div in class "string"} divC    
    *@param {wid of the entry box}
    *@param {hid of the entry box}*/

const popUpMenu = (containerC, divC, title, wid, hig) => {
    
    let container = makeElement('div', containerC, document.querySelector('#content'));
    let div = makeElement('div', divC, container);
    
    ceterPositonAbsolute(container, 'rgb(0 0 0 / 0.55)', '100%', '100%');
    ceterPositonAbsolute(div, 'rgb(19 19 19)', wid, hig);
    div.style.borderRadius = '5%';

    //add animation
    let ed = container.childNodes;
    animationDelay(ed, 50, 50, 'opacity-key', 'fadeopacity cubic-bezier(.17,.67,.83,.67) 500ms forwards');


    //make the edit div
    let topDiv = makeElement('div', 'top-div', div);
    let bodyDiv = makeElement('div', 'body-div', div);

    //if there is a title
    if(title !== undefined){
        let t = makeElement('div', 'top-div-title', topDiv);
        t.innerText = title;
        t.style.alignSelf = 'center';
        t.style.flex = '1';
        t.style.textAlign = 'center';
        t.style.fontSize = '30px';
        t.style.fontWeight = '900';
        t.style.fontFamily = 'monospace';
        t.style.color = 'red';
    }

    let closeBtn = makeElement('button', 'close-btn', topDiv);
    closeBtn.innerText = 'X';


    topDiv.style.display = 'flex';
    topDiv.style.justifyContent = 'flex-end';
    
    closeBtn.style.fontSize = '30px';
    closeBtn.style.fontWeight = '900';
    closeBtn.style.color = 'red';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.padding = '2.5px 5px';
    closeBtn.style.backgroundColor = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.fontFamily = 'cursive';
    closeBtn.style.marginRight = '10px';

    //close btn hover event
    closeBtn.addEventListener('mouseover', (e) =>{
        e.target.style.cursor = 'pointer';
        e.target.style.backgroundColor = 'rgb(255 255 255 / 0.1)';
            e.target.onmouseout = () =>{
                e.target.style.backgroundColor = 'transparent';
            }
    });

    //close on click without save any change
    closeBtn.addEventListener('click', (e) =>{
        container.remove();
    });
                             
    return bodyDiv;
    }

//toggle ative from elemnt and remove the active from other element
  const toggleActive = (e, element) =>{
      let node = (() => {
          let n = e.target.parentNode;
          if(n.classList.contains('svg-inline--fa')) return n.parentNode;
          if(n.classList.contains('left')) return e.target;

          return n;
      })();


      element.forEach(e => {
          if(e.classList.contains('active'))  e.classList.toggle('active')
        });

       node.classList.toggle('active');
      
      //check to make nav in the active element
      const check = (() => {
          if(node.classList.contains('active') && node.parentNode.classList.contains('finshed')) return runAllData('finshed');
          if(node.classList.contains('active') && node.parentNode.classList.contains('notes')) return notes();
          if(node.classList.contains('active') && node.parentNode.classList.contains('new-task')) return addNewTask();
          

            //make the nav for all list
    if(node.classList.contains('active') && node.parentNode.classList.contains('all-list')) {

            runNav(element);
            runAllData('all-list');
    }
      })();
      
    }
//show all the data in all list
const runAllData = (status) => {
    let div = Object.keys(lists);
    
    if(status === 'all-list') return runData (div, 'all-list');

    runData(div, 'finshed');

    let allCheckBox = document.querySelectorAll('.right .container input');
    checkboxFilter(allCheckBox);

    //filter all checkbox 
    function checkboxFilter(elements) {
        elements.forEach(element => {
            if(!element.checked) element.parentNode.remove();
        })

        
    }



    }

//save process
const saveProcess = (form, type, lastValues, taskName) => {
    const getValues = () => {
        let name, description, duedate, priorty, finshed, list;
        form.forEach(f => {
                if(f.classList.contains('name-div')) name = f.lastChild.value;
                if(f.classList.contains('descrption-div')) description = f.lastChild.value;
                if(f.classList.contains('duedate-div')) duedate = f.lastChild.value;
                if(f.classList.contains('priorty-div')) {
                    f.lastChild.childNodes.forEach(c =>{
                        if(c.classList.contains('active')){
                            if(c.classList.contains('high')) priorty = 'red';
                            if(c.classList.contains('medium')) priorty = 'green';
                            if(c.classList.contains('low')) priorty = 'yellow';
                        };
                    });
                }
                if(f.classList.contains('finshed-div')) finshed = f.lastChild.checked;
                if(f.classList.contains('list-div')) list = f.lastChild.value;
        });
        return{
            name,
            description,
            duedate,
            priorty,
            finshed,
            list
        }
    }
    
    const editProcess = () =>{
        let values, editTask;
        values = getValues();
        editTask = new Tasks(values.name, values.description, values.duedate, values.priorty, values.finshed);
        delete lists[`${lastValues.listValue}`].tasks[`${taskName}`];
        lists[`${values.list}`].tasks[`${values.name}`] = editTask;
        document.querySelector('.edit-container').remove();

        runAllData('all-list');

        let menus = [...document.querySelectorAll('.left > div')];
        menus.forEach(m => {
            if(m.classList.contains('all-list') && m.classList.contains('active')) return runAllData('all-list');
            if(m.classList.contains('finshed') && m.classList.contains('active')) return runAllData('finshed');    
        });
    }

    if(type === 'edit')  editProcess();
    }
//show the data of the list
const runData = (div, status) => {
        const rightSection = document.querySelector('.right');
        clearData(rightSection);
        let target = (status) => {
            let t;
            if(status === undefined) t = div.dataset.list;
            if(status !== undefined) t = [...div];

            return t;
        };

        const container = makeElement('div', 'data-container', rightSection);
        const title = makeElement('div', undefined, container)
        const dataName = () => {
            let n;
            if(status === undefined) return n = lists[target(status)].name;
            if(status === 'finshed') return n = 'finshied';
            if(status === 'all-list') return n = 'all-list';
        };
        dataName();
        const dataTasks = () => {
            let d, allList;
            if(status === undefined) return d = lists[target(status)].tasks;
        
            
            if(status === 'finshed' || status === 'all-list') {
                allList = [...Object.values(lists)];
                d = [];
            allList.forEach(l => {
               Object.assign(d, l.tasks)
            });

            return Object.assign({}, d);
        }
            
        };
        title.innerText = dataName(status)[0].toUpperCase() + dataName(status).slice(1) + ':';

        


        //get all tasks
        const getTasks = (dataTasks) =>{
            //make the task div 

            const taskDiv = (task, container, dataTasks) => {
                //note: dataTasks[`${task}`] is the opject of thise.task
                let box, title, dueDate, priorty, finshed, dateSlice, finshedStatus, description;
                let boxContaier = makeElement('div', 'box-container', container)
                 box = makeElement('div', 'task-box', boxContaier);
                 box.setAttribute('data-task', `${task}`);

                 finshed = makeElement('input', 'finshed', box);
                 title = makeElement('div', 'task-title', box);
                 dueDate = makeElement('div', 'task-duedate', box);

                title.innerText = dataTasks(status)[`${task}`]['title'];
                dateSlice = [dataTasks()[`${task}`].duedate].toLocaleString();
                dueDate.innerText = dateSlice.slice(0, dateSlice.indexOf(','));

                //the description
                description = dataTasks()[`${task}`][`description`];


                priorty = dataTasks()[`${task}`].priorty;
                finshed.setAttribute('type', 'checkbox');


                //check finshed status
                finshedStatus = dataTasks()[`${task}`].finished;

                switch(finshedStatus){
                    case true:
                        finshed.checked = true;
                        break;
                    case 'false':
                        finshed.checked = false;
                        break;
                    default:
                        finshed.checked = false;
                        break;
                }

                //add event listener to the checkbox change the value on the list
                // change the finished status
                finshed.addEventListener('change', (e) => {
                    let taskTochange = e.target.parentNode.dataset.task;
                    let listsKey = [...Object.keys(lists)];

                    if(e.target.checked)   finshedStatus = true;
                    if(!e.target.checked)  finshedStatus = false;


                    for(let i = 0; i <=listsKey.length-1 ; i++){
                        if(lists[`${listsKey[i]}`].tasks.hasOwnProperty(taskTochange)){
                            return lists[`${listsKey[i]}`].tasks[`${taskTochange}`]['finished'] = finshedStatus;
                        }
                    }    

                });
                
                //detremined the priorty
                switch(priorty){
                    case 'red':
                        box.setAttribute('title', 'Top priorty');
                        box.style.border = 'outset 5px red';
                        break;
                    case 'green':
                        box.setAttribute('title', 'Medium priorty');
                        box.style.border = 'outset 5px green';
                        break;
                    case 'yellow':
                        box.setAttribute('title', 'Low priorty');
                        box.style.border = 'outset 5px yellow';
                        break;
                    default:
                        box.setAttribute('title', 'No priorty');
                        box.style.border = 'outset 5px white';
                        break;
                } 

                //add hover effect to the box
                box.addEventListener('mouseover', (e) => e.target.style.cursor = 'pointer');

                //on click event in each box
                let descriptionDiv, descriptionText, descriptionBtnDiv, descriptionBtnEdit, descriptionBtnDelet;

                box.addEventListener('click', (e) => {
                    //check if description is alredy there
                    if(e.target.type) return;
                    if(box.parentNode.lastChild.classList.contains('description-div')) return descriptionDiv.remove();

                    descriptionDiv = makeElement('div', 'description-div', boxContaier);
                    descriptionText = makeElement('div', 'description-text', descriptionDiv);
                    descriptionBtnDiv = makeElement('div', 'description-text', descriptionDiv);
                    descriptionBtnEdit = makeElement('button', 'description-btn-edit', descriptionBtnDiv);
                    descriptionBtnDelet = makeElement('button', 'description-btn-delet', descriptionBtnDiv);

                    const descriptioStyle = (() => {
                            descriptionBtnEdit.innerText = 'Edit';
                            descriptionBtnDelet.innerText = 'Delet';
                            descriptionText.innerText = description;

                            descriptionDiv.style.width = '90%';
                            descriptionDiv.style.marginTop = '20px';
                            descriptionDiv.style.marginBottom = '20px';
                            descriptionDiv.style.display = 'flex';
                            descriptionDiv.style.flexDirection = 'column';
                            descriptionDiv.style.gap = '20px';

                            descriptionText.style.display = 'flex';
                            descriptionText.style. alignItems = 'center';
                            descriptionText.style. justifyContent = 'center';
                            descriptionText.style. fontSize = '25px';
                            descriptionText.style. fontWeight = '900';
                            descriptionText.style. fontFamily = 'system-ui';

                            descriptionBtnDiv.style.display = 'flex';
                            descriptionBtnDiv.style.alignItems = 'center';
                            descriptionBtnDiv.style.justifyContent = 'center';
                            descriptionBtnDiv.style.gap = '10px';

                            descriptionBtnDiv.childNodes.forEach(c => {
                                c.style.padding = '3px 10px';
                                c.style.borderRadius = '10px';
                                c.style.border = 'none';
                                c.style.fontWeight = '900';
                                c.style.fontFamily = 'system-ui';
                                c.style.fontSize = '25px';

                                switch(c.innerText){
                                    case 'Edit':
                                        c.style.color = '#fdaa31';
                                        c.style.backgroundColor = 'rgb(14 54 185)';
                                        c.addEventListener('mouseover', (e) => {
                                            c.style.cursor = 'pointer'
                                            e.target.style.color = 'rgb(14 54 185)';
                                            e.target.style.backgroundColor = 'rgb(252 169 49)';
                                        });
                                        c.addEventListener('mouseout', (e) => {
                                            e.target.style.color = 'rgb(252, 169, 49)';
                                            e.target.style.backgroundColor = 'rgb(14 54 185)';
                                        });
                                        break;
                                    case 'Delet':
                                        c.style.color = 'red';
                                        c.style.backgroundColor = 'black';
                                        c.addEventListener('mouseover', (e) => {
                                            c.style.cursor = 'pointer'
                                            e.target.style.color = 'black';
                                            e.target.style.backgroundColor = 'red';
                                        });
                                        c.addEventListener('mouseout', (e) => {
                                            e.target.style.color = 'red';
                                            e.target.style.backgroundColor = 'black';
                                        });
                                        break;
                                    default:
                                        break;
                                }

                            })
                    })();

                    //add event listener in  each btn
                    const btnEventClick = (() => {
                        let listsKeys = [...Object.keys(lists)];
                            descriptionBtnDiv.childNodes.forEach(btn => btn.addEventListener('click', (e) => {
                                if(e.target.innerText === 'Edit' ) editBehavier();
                                if(e.target.innerText === 'Delet' ) deletBehavier();
                            }));

                        //the edit behavier
                        function editBehavier() {

                            
                            const editMain = (() => {

                                const body = () => {
                            const editBody = popUpMenu('edit-container', 'edit-div', 'Edit Task', '50%', '80%');
                            editBody.style.height = '90%';
                            editBody.style.display = 'flex';
                            editBody.style.flexDirection = 'column';
                            editBody.style.justifyContent = 'space-around';
                                        return editBody;
                                    };
                                const bodyElemntCreationn = () => {
                                    const nameDiv = makeElement('div', 'name-div', editBody);
                                    makeElement('div', 'task-name', nameDiv).innerText = 'Name: ';
                                    makeElement('input', 'name-input', nameDiv).setAttribute('type', 'text');
        
                                    const descriptionDiv = makeElement('div', 'descrption-div', editBody);
                                    makeElement('div', 'task-description', descriptionDiv).innerText = 'Description: ';
                                    makeElement('input', 'description-input', descriptionDiv).setAttribute('type', 'text');
        
                                    const duedateDiv = makeElement('div', 'duedate-div', editBody);
                                    makeElement('div', 'task-duedate', duedateDiv).innerText = 'Duedate: ';
                                    makeElement('input', 'duedate-input', duedateDiv).setAttribute('type', 'date');
        
                                    const priortyeDiv = makeElement('div', 'priorty-div', editBody);
                                    makeElement('div', 'task-priorty', priortyeDiv).innerText = 'Priorty: ';
                                    let priortyBtn =  makeElement('div', 'priorty-input', priortyeDiv);
                                    let p;
                                    let el;
                                    for(let i = 2; i >= 0; i--){
                                        if(i === 2) p = 'high';
                                        if(i === 1) p = 'medium';
                                        if(i === 0) p = 'low';
                                        el = makeElement('button', `${p}`, priortyBtn);
                                        el.setAttribute('title', `${p}`);
                                        el.style.width = '35px';
                                        el.style.height = '35px';
                                        el.style.borderRadius = '50%';
                                        if(el.classList.contains('high')) el.style.backgroundColor = '#FF0000';
                                        if(el.classList.contains('medium')) el.style.backgroundColor = '#008000';
                                        if(el.classList.contains('low')) el.style.backgroundColor = '#FFFF00';
                                    }
                                    
        
                                    const finshedDiv = makeElement('div', 'finshed-div', editBody);
                                    makeElement('div', 'finshed-div', finshedDiv).innerText = 'Finshed: ';
                                    makeElement('input', 'finshed-input', finshedDiv).setAttribute('type', 'checkbox');
        
                                    const listDiv = makeElement('div', 'list-div', editBody);
                                    makeElement('div', 'list-div', listDiv).innerText = 'List: ';
                                    let selectDiv =  makeElement('select', '#list-input', listDiv);
                                    
                                    listsKeys.forEach(key => {
                                        let k;
                                        k = makeElement('option', `${key}`, selectDiv);
                                        k.value = `${key}`;
                                        k.innerText = `${key}`;
                                    });


                                    const btnDiv = makeElement('div', 'btn-div', editBody);
                                    makeElement('button', 'edit-go-on', btnDiv).innerText = 'Save';

                                    };

                                const editBodyStyle = () => {
                                    editBody.childNodes.forEach(c => {
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
                                        if(c.classList.contains('priorty-div')){
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
                                        if(c.lastChild.type === 'text' || c.lastChild.type === 'date' || c.classList.contains('list-div')){
                                                c.lastChild.style.backgroundColor = 'rgba(98, 128, 224, 0.2)';
                                                c.lastChild.style.color = 'white';
                                                    c.lastChild.addEventListener('mousedown', (e) => {
                                                            e.target.style.backgroundColor = 'white';
                                                            e.target.style.color = 'black';
                                                            e.target.style.transition = 'all 500ms ease-in-out 0ms';
                    
                                                        });

                                                    }
                                            //style the btn
                                        if(c.classList.contains('btn-div')){
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
                               
                                                });
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
                                            n.style.border = 'solid 3px black';
                                        }
                                        if(!n.classList.contains('active')) {
                                            n.style.border = 'none';
                                            n.style.outline = 'none';
                                        }
                                    });
                                }

                                const getEditValues = () => {
                                    let nameValue, descriptionValue, dueDateValue, priortyValue, finshedValue, listValue;
                                        listsKeys.forEach(key => {
                                                if(lists[`${key}`].tasks[`${box.dataset.task}`]) {
                                                        nameValue =  lists[`${key}`].tasks[`${box.dataset.task}`].title;
                                                        descriptionValue = lists[`${key}`].tasks[`${box.dataset.task}`].description;
                                                        dueDateValue = lists[`${key}`].tasks[`${box.dataset.task}`].duedate;
                                                        priortyValue = lists[`${key}`].tasks[`${box.dataset.task}`].priorty;
                                                        finshedValue = lists[`${key}`].tasks[`${box.dataset.task}`].finished;
                                                        listValue = lists[`${key}`].name;
                                                    };
                                                });
                                                        return{
                                                            nameValue,
                                                            descriptionValue,
                                                            dueDateValue,
                                                            priortyValue,
                                                            finshedValue,
                                                            listValue,
                                                        }
                                            };

                                /*@param {editBody = nodeList for the body} */
                                const editValueDom = (editBody) => {
                                    let values = getEditValues();
                                    editBody.childNodes.forEach(el => {
                                        if(el.classList.contains('name-div')) el.lastChild.value = values.nameValue;
                                        if(el.classList.contains('descrption-div')) el.lastChild.value = values.descriptionValue;
                                        if(el.classList.contains('duedate-div')) {
                                            let v = values.dueDateValue.toISOString().slice(0, 10);
                                            el.lastChild.value = v;                                            
                                        };
                                        if(el.classList.contains('priorty-div')){
                                            el.lastChild.childNodes.forEach(child => {
                                                if(values.priortyValue === 'green' && child.classList.contains('medium')){
                                                   return setActive(el.lastChild.childNodes, child);
                                                } 
                                                if(values.priortyValue === 'red' && child.classList.contains('high')){
                                                    return setActive(el.lastChild.childNodes, child);
                                                }
                                                if(values.priortyValue === 'yellow' && child.classList.contains('low')){
                                                    return setActive(el.lastChild.childNodes, child);
                                                }
                                            });
                                        };
                                        if(el.classList.contains('finshed-div')) el.lastChild.checked = values.finshedValue;
                                        if(el.classList.contains('list-div')) {
                                            el.lastChild.childNodes.forEach(option => {
                                                if(option.innerText === values.listValue) option.setAttribute('selected', 'selected');
                                            });
                                        };
                                        if(el.classList.contains('btn-div')) el.lastChild.addEventListener('click', () => saveProcess(editBody.childNodes, 'edit', getEditValues(), box.dataset.task));
                                    });
                                    
                                };

                                return {
                                    body,
                                    bodyElemntCreationn,
                                    editBodyStyle,
                                    editValueDom
                                };

                        })();

                        //run the edit module
                        let editBody = editMain.body();
                                        editMain.bodyElemntCreationn();
                                        editMain.editBodyStyle();
                                       editMain.editValueDom(editBody);


                        }
                        //the delete behavier
                        function deletBehavier() {
                            let elToDelet = box.dataset.task;
                            
                            //delete from the dom
                            box.parentNode.remove(); 

                            //loop to find where is the element 
                            for(let i = 0; i<=listsKeys.length-1;i++){
                                if (lists[`${listsKeys[i]}`].tasks.hasOwnProperty(elToDelet)) {
                                    delete lists[`${listsKeys[i]}`].tasks[elToDelet];
                                };

                            
                            }
                        }
                    })();

                    //add animnation
                    animationDelay(descriptionDiv.childNodes, 50, 50, 'open-description', 'fadedown ease-out 500ms forwards');

                });

            }
            let allTasks;
                if(status === undefined) allTasks = [...Object.keys(dataTasks(status))];
                if(status !== undefined)  allTasks = [...Object.keys(dataTasks())];
                
            let taskContainer = makeElement('div', 'container', container)
            allTasks.forEach(task => {
                taskDiv(task, taskContainer, dataTasks);
            });

        }

        //container daya style
        const dataContainerStyle = () => {
            rightSection.style.display = 'flex';
            rightSection.style.alignItems = 'flex-end';
            rightSection.style.justifyContent = 'flex-end';

            container.style.width = '95%';
            container.style.height = '95%';
            container.style.marginBottom = '15px';

            const titleStyle = (() => {
                title.style.color = 'white';           
                title.style.fontFamily = 'system-ui';
                title.style.fontSize = '50px';
                title.style.fontWeight = '900';
                title.style.textShadow = 'black 5px 4px 0px';

            })();
            const taskBoxStyle = (() => {
                const container = rightSection.querySelector('.container');
                const allBox = container.querySelectorAll('.task-box');
                const boxContaier = rightSection.querySelectorAll('.box-container');
                container.style.height = '100%';
                container.style.marginTop = '20px';
                container.style.overflow = 'auto';

                allBox.forEach(box => {
                    box.style.display = 'flex';
                    box.style.color = 'white';
                    box.style.fontSize = '30px';
                    box.style.gap = '20px';
                    box.style.marginTop = '5px';
                    box.style.padding = '5px';
                    box.style.backgroundColor = '#000000cc';
                    box.style.width = '90%';
                    box.style.margin = 'auto';
                    box.style.marginBottom = '5px';
                    box.style.alignItems = 'center';
                    box.style.justifyContent = 'space-around';

                    box.firstChild.style.width = '25px'
                    box.firstChild.style.height = '25px'

                    box.style.color = '#ff9800';
                    //loop for ordering box by flex property
                    for (let i = 0; i <= box.childNodes.length -1; i++){
                        box.childNodes[i].style.flex = `${i+1}`;
                        box.childNodes[i].style.textAlign = 'center';
                    }
                });

                boxContaier.forEach(boxC => {
                    boxC.style.display = 'flex';
                    boxC.style.flexDirection = 'column';
                    boxC.style.alignItems = 'center';

                });

                // add a transition
                animationDelay(allBox, 50, 50, 'open-list', `fadedown ease-out 800ms forwards`);


            })();
            
            }

            
             
        
            getTasks(dataTasks);
            dataContainerStyle();

    }

//clear all right section
const clearData = (rightSection) => rightSection.childNodes.forEach(n => n.remove());

//the body of the right body if all list active
const allListRight = (nav) =>{
    
      const allNav = nav.querySelectorAll('div');
      
      
      allNav.forEach(div => {
          div.addEventListener('click', () => {
               //to toggle the activation
                listActive(allNav, 'list-active');
                div.classList.toggle('list-active');
                if(div.classList.contains('list-active')) runData(div);                        
          });
      });
    }
const runNav = (element) => {
      const makeNav = (el) =>{
          let nav;
          let list = [...Object.values(lists)];

          //the lists name property
          let listName = [];
          list.forEach(l => listName.push(l.name));
          
        //make the list appear
        let listDiv;
          if(el.parentNode.classList.contains('all-list')){
              nav = makeElement('nav', 'nav', el.parentNode);
              listName.forEach(l => {
                  listDiv = makeElement('div', undefined, nav);
                  listDiv.setAttribute('data-list', `${l}` );
                  makeElement('svg', 'fas', listDiv).classList.add('fa-list-ul');
                  makeElement('a', l, listDiv).innerText = l;

                  //the style of the width container
                  listDiv.style.display = 'flex';
                  listDiv.style.alignItems = 'center';
                  listDiv.style.justifyContent = 'flex-end';
                  listDiv.style.width = '70%';
                  listDiv.style.gap = '10px';
                  listDiv.style.flex = '1';
                  listDiv.addEventListener('mouseout', (e) => e.target.style.cursor = 'pointer');
                  
              });
              //nav style
              navStyle(nav);
              //these will show body of the target menu all-list
              allListRight(nav);
          };

           

           function navStyle (nav) {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'column';
            nav.style.alignItems = 'flex-end';
            nav.style.gap = '5px';
            nav.style.margin = '5px';
            nav.querySelectorAll('a').forEach(el => {
                el.style.fontSize = '20px';
                el.style.color = 'rgb(255, 152, 0)';
                el.style.fontWeight = '900';
                el.style.width = '50%';
                el.style.flex = '1';
                el.style.textShadow = 'black 5px 5px 5px';
                el.style.fontFamily = 'system-ui';
                el.addEventListener('mouseover', () => hoverColor(el, 'rgb(255 172 50)', 'rgb(129 153 230)'));

               });

            nav.querySelectorAll('svg').forEach(s => {
                s.style.color = '#ff9800';
                s.style.fontSize = '20px';
                s.style.fontFamily = 'system-ui';
                s.style.filter = 'drop-shadow(black 5px 5px 5px)';
            });

            const div = document.querySelectorAll('.nav div');

            //delay the animation of the nav
            
            animationDelay(div, 50, 50, 'open-menu', `fadein ease-out 600ms forwards`);
          }
                    

      };
      


      //run nav making
      element.forEach(el => {
          if(el.classList.contains('active')){
            const div = document.querySelectorAll('.nav div');  


            
         
            //remove the nav if it found
           if(el.parentNode.querySelector('.nav')) {
                    return el.parentNode.querySelector('.nav').remove();
                
            }


            //make the nav
            makeNav(el);
          }
      });


    }

//notes 
const notes = () => {
    const element = document.querySelector('.notes');
    const rightBody = document.querySelector('.right');
    clearData(rightBody);
    noteModule.noteNav(element);
    if([...Object.keys(allNotes)].length === 0) return noteModule.noNoteFound(rightBody);

    //if there is a notes
    return noteModule.runNotes(rightBody);

}
//will add a new task
const addNewTask = () => {
    const newTaskBody = popUpMenu('newtask-container', 'newtask-div', 'Add New Task', '50%', '80%');
    const setForm = (() =>{
        const nameDiv = makeElement('div', 'title-div', newTaskBody);
        makeElement('div', 'title-txt', nameDiv). innerText = 'Task Name :';
        makeElement('input', 'title-input', nameDiv).type = 'text';

        const descriptionDiv = makeElement('div', 'description-div', newTaskBody);
        makeElement('div', 'description-txt', descriptionDiv).innerText = 'Description :';
        makeElement('input', 'description-input', descriptionDiv).type = 'text';

        const dueDateDiv = makeElement('div', 'dueDate-div', newTaskBody);
        makeElement('div', 'dueDate-txt', dueDateDiv).innerText = 'Due-Date :';
        makeElement('input', 'dueDate-input', dueDateDiv).type = 'date';

        const priortyDiv = makeElement('div', 'note-priorty', newTaskBody);
        makeElement('div', 'priorty-txt', priortyDiv).innerText = 'Priorty :';
        let p = makeElement('div', 'priorty-options', priortyDiv);
        let pOptions = ['high', 'medium', 'low'];
        let el;
        for(let i = 0; i <= pOptions.length-1; i++){
            el = makeElement('button', `${pOptions[i]}`, p);
            el.setAttribute('title', `${pOptions[i]}`);
            el.style.width = '35px';
            el.style.height = '35px';
            el.style.borderRadius = '50%';
            if(pOptions[i] === 'high')  el.style.backgroundColor = 'red';
            if(pOptions[i] === 'medium')    el.style.backgroundColor = 'green';
            if(pOptions[i] === 'low')   el.style.backgroundColor = 'yellow';
            let priortyButton = p.lastChild.childNodes;
            el.addEventListener('click', (e) => noteModule.setActive(priortyButton, e.target));
        }

        const listDiv = makeElement('div', 'lists-div', newTaskBody);
        makeElement('div', 'list-txt', listDiv).innerText = 'List :';
        let allList = [...Object.keys(lists)];
        const selectList = makeElement('select','select-option', listDiv);
        let option;
        for(let i = 0; i <= allList.length-1; i++){
            option = makeElement('option', 'list-option', selectList);
            option.setAttribute('data-opton', `${allList[i]}`);
            option.innerText = `${allList[i]}`;
            if(allList[i] === 'default') option.setAttribute('selected', 'selected');
        }
        const btnDiv = makeElement('div', 'note-btn-div', newTaskBody);
        let saveBtn = makeElement('button', 'save-btn', btnDiv);
        saveBtn.innerText = 'Save';
        saveBtn.addEventListener('click', () => {
            getTaskDetails(newTaskBody);
            newTaskBody.parentNode.parentNode.remove();
            runAllData('all-list');
        });

        noteModule.editStyle(newTaskBody);

    })();
        const getTaskDetails = (form) => {
            let title, description, dueDate, priorty, list;
            form.childNodes.forEach(element => {
                if(element.lastChild.type === 'text'){
                    if(element.lastChild.classList.contains('title-input')) title = element.lastChild.value
                    if(element.lastChild.classList.contains('description-input')) description = element.lastChild.value;
                }
                if(element.lastChild.type === 'date'){
                    dueDate = element.lastChild.value;
                }
                if(element.lastChild.classList.contains('priorty-option')){
                    element.lastChild.childNodes.forEach(c => {
                        if(c.classList.contains('active')) {
                            if(c.dataset.priorty === 'high') return priorty = 'red';
                            if(c.dataset.priorty === 'medium') return priorty = 'green';
                            if(c.dataset.priorty === 'low') return priorty = 'yellow';
                        }
                    } );
                }
                if(element.lastChild.classList.contains('select-option')){
                    list = element.lastChild.value;
                }
            });

            const check = (() =>{
                if (title === '') title = 'No Title';
                if (description === '') description = 'No Description';
                if (priorty === undefined) priorty = 'Yellow';
                if(dueDate === '') dueDate = new Date();
            })();

            return new Tasks(list, title, description, dueDate, priorty).appendToLists();
        };


    }

        export { makeElement, toggleActive, runNav, popUpMenu, animationDelay, clearData };
