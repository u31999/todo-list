// a class to constract lists and add new list with methods
const Tasks = class {
    constructor(list ,title, description, duedate, priorty){
        this.list = list;
        this.title = title;
        this.description = description;
        this.duedate = new Date(duedate);
        this.priorty = priorty;
    }
    appendToLists() {
        lists[`${this.list}`].tasks[`${this.title}`] ={
            'title' : this.title,
            'description' : this.description,
            'duedate' : this.duedate,
            'priorty' : this.priorty,
            'finshed' : false,
        } 
    }
}

const MakeList = class {
    constructor(name){
        this.name = name;
        this.tasks = {};
    }
}

let lists = {
    'default': {
        'name': 'default',
        'tasks':{
                'test' : {
                    'title' : 'test title',
                    'description' : 'these a test',
                    'duedate' : new Date('10-3-2022'),
                    'priorty' : 'green',
                    'finished': false,
                        },
                'test2' : {
                    'title' : 'test title 2',
                    'description' : 'these a test 2',
                    'duedate' : new Date('12-10-2023'),
                    'priorty' : 'red',
                    'finished' : true,
                        },
                },
            },
    'work': {
        'name': 'work',
        'tasks': {
            'test-work': {
                'title': 'test work',
                'description' : 'these a test for work task',
                'duedate' : new Date('11-1-1090'),
                'priorty' : 'yellow',
                'finished' : false,
            }
        },
    },
    'personal': {
        'name': 'personal',
        'tasks': {},
    },
    'shoping': {
        'name': 'shoping',
        'tasks': {},
    },
    'wishlist': {
        'name': 'wishlist',
        'tasks': {},
    }
}

const PushFormToAllNote = class{
    constructor(form){
        this.title = form.title;
        this.description = form.description;
        this.priorty = form.priorty;
        this.creationDate = form.creationDate;
    }
    appendToallNote(){
        allNotes[`${this.title}`] = {
            'title' : this.title,
            'description' : this.description,
            'priorty' : this.priorty,
            'creationDate' : new Date(this.creationDate)
        }
    }
}



const allNotes = {
    'test note': {
        'title': 'test note',
        'description' : 'test note description',
        'priorty' : 'green',
        'creationDate' : new Date('12-1-2020'),
    },
    'test note 2': {
        'title': 'test note 2',
        'description' : 'test note 2',
        'priorty' : 'red',
        'creationDate' : new Date('1-1-2010')
    }
}

export {lists, Tasks, PushFormToAllNote, allNotes};
