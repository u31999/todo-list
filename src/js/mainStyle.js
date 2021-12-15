import { makeElement, toggleActive, runNav } from "./domMan.js";

//these set the home page main style 
const homePageStyle = () => {
    const content = document.querySelector('#content');
    const header = makeElement('div', '.header', content);
    const body = makeElement('div', '.body', content);
    const leftBody = makeElement('div', '.left', body);
    const rightBody = makeElement('div', '.right', body);
    const footer = makeElement('div', '.footer', content);
    
    //the header style 
    const headerStyle = () =>{
        header.style.display = 'grid';
        header.style.gridTemplateColumns = '40% auto'
        const logoDiv = makeElement('div', 'logo-div', header);
        const logoImg = makeElement('img', 'logo-img', logoDiv);
        const textLogo = makeElement('div', 'logo-text', logoDiv);
        const searchDiv = makeElement('div', 'search-div', header);
        const searchForm = makeElement('form', undefined, searchDiv)
        const search = makeElement('input', '#search', searchForm);
        const searchBtn = makeElement('button', '.search-btn', searchForm);
        const serchIcon = makeElement('i', undefined, searchBtn);

        textLogo.innerText = 'Todo List';
        textLogo.style.color = '#6280e0';
        textLogo.style.fontWeight = '900';
        textLogo.style.fontSize = '50px';
        textLogo.style.textShadow = 'white 1px 1px 1px';
        textLogo.style.fontFamily = 'system-ui';

        logoDiv.style.display = 'flex';
        logoDiv.style.alignItems = 'center';

        logoImg.src = './src/resources/logo.png';
        logoImg.style.width = '135px';
        logoImg.style.height = '120px';

        searchDiv.style.display = 'flex';
        searchDiv.style.alignItems = 'center';
        searchDiv.style.justifyContent = 'flex-end';
        searchDiv.style.paddingRight = '50px';

        searchForm.style.width ='300px';
        searchForm.style.height ='35px';
        searchForm.style.display = 'flex';
        searchForm.style.flexDirection = 'row-reverse';
        searchForm.style.alignItems = 'center';

        searchBtn.style.width = '20%';
        searchBtn.style.height = '100%';
        searchBtn.style.border = 'none';
        searchBtn.style.borderRadius = '20px 0px 0px 20px';
        searchBtn.onmouseover = (e) => e.target.style.cursor = 'pointer'; 
    
        search.setAttribute('placeholder', 'Search');
        search.style.height = '100%';
        search.style.width = '80%';
        search.style.borderRadius = '20px';
        search.style.color = 'white';
        search.style.fontWeight = '900';
        search.style.textIndent = '10px';
        search.style.borderTopLeftRadius= '0px';
        search.style.borderBottomLeftRadius= '0px';
        search.style.border = 'none';
        

        serchIcon.classList.add('fas');
        serchIcon.classList.add('fa-search');
        serchIcon.style.fontSize = '20px';
        serchIcon.style.color = 'rgb(14 54 185)';


        search.addEventListener('click', (e) => {
            e.target.style.backgroundColor ='white';
            e.target.style.color = 'black';
            e.target.style.fontSize = '15px';
        });
    };

    //the body style
    const bodyStyle = () => {
        const leftStyle = () => {

            leftBody.style.display = 'flex';
            leftBody.style.flexDirection = 'column';
            leftBody.style.padding = '10% 30% 0% 10%';
            leftBody.style.gap = '30px';

            const allList = makeElement('div', 'all-list', leftBody);
            const finshied = makeElement('div', 'finshed', leftBody);
            const notes = makeElement('div', 'notes', leftBody);
            const newList = makeElement('div', 'new-task', leftBody);

            newList.setAttribute('title', 'add new list');

            const leftStyleArray = [...document.querySelectorAll('.left div')];
            
            leftStyleArray.forEach(div => {

                //these variable rap the anchor and svg
                let aContainer;

                //all list
                if(div.classList.contains('all-list')){
                    aContainer = makeElement('div', 'container', div);
                    makeElement('i', 'fas', aContainer).classList.add('fa-home');
                    makeElement('a', 'text', aContainer).innerText = 'All Lists';                    
                };

                //finshed
                if(div.classList.contains('finshed')){
                    aContainer = makeElement('div', 'container', div);
                    makeElement('i', 'fas', aContainer).classList.add('fa-check-square');
                    makeElement('a', 'text', aContainer).innerText = 'Finshed';

                };

                //new task
                if(div.classList.contains('new-task')){
                    aContainer = makeElement('div', 'container', div);
                    makeElement('i', 'fas', aContainer).classList.add('fa-plus-square');
                    makeElement('a', 'text', aContainer).innerText = 'add Task';
                    aContainer.style.marginLeft = '5%';
                }

                //notes
                if(div.classList.contains('notes')){
                    aContainer = makeElement('div', 'container', div)
                    makeElement('i', 'fas', aContainer).classList.add('fa-clipboard');
                    makeElement('a', 'text', aContainer).innerText = 'Notes';
                };

                //icon and text style
                const menuMainStyle = () => {
                aContainer.firstChild.style.color = '#FF9800';
                aContainer.firstChild.style.filter = 'drop-shadow(5px 5px 5px black)';
                aContainer.lastChild.style.color = 'rgb(98 128 224)';
                aContainer.lastChild.style.textShadow = 'black 5px 5px 5px';
                if(div.classList.contains('new-task')) {
                    aContainer.style.opacity = '0.5';
                    aContainer.style.gap = '7px';
                    aContainer.style.marginLeft = '0px';
                }
                };

                const menuActiveStyle = () => {
                    aContainer.style.cursor = 'pointer';
                    aContainer.firstChild.style.color = 'rgb(98 128 224)';
                    aContainer.lastChild.style.color = '#FF9800';
                    if(div.classList.contains('new-task')) aContainer.style.opacity = '1';

                }

                //all list menu style
                aContainer.style.fontSize = '20px';
                aContainer.style.fontFamily = 'system-ui';
                aContainer.style.fontWeight = '900';
                aContainer.style.display = 'flex';
                aContainer.style.alignItems = 'center';
                aContainer.style.justifyContent = 'space-around';
                aContainer.style.padding = '5px';

                menuMainStyle();                
                //toggle active on all-list on load
                document.querySelector('.all-list .container').classList.toggle('active');

      
                aContainer.addEventListener('mouseover',() => menuActiveStyle());
                
                aContainer.addEventListener('mouseout', () => menuMainStyle());

                aContainer.addEventListener('click', (e) => {
                    let element = document.querySelectorAll('.container');
                    toggleActive(e, element);

                })

            });
        }

        //run all sections
        leftStyle();
        
    }

    
    headerStyle();
    bodyStyle();
    return;
    

    
}

export {homePageStyle};
