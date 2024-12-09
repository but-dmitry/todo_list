let no_task_message = document.getElementsByClassName("task-rows__no-tasks").item(0);

let tasks_container = document.getElementsByClassName("task-rows");
let add_new_task_btn = document.getElementsByClassName("add-new-task-section__add_button").item(0);
let add_new_task_menu_agree = document.getElementsByClassName("add-new-task-menu-section__add_button").item(0);
let add_new_task_menu_disagree = document.getElementsByClassName("add-new-task-menu-section__cancel_button").item(0);

let task_page = NaN;


let is_task_exist = false;


task_done = function(e){
    console.log();
    if(delete_task_id(e.target.parentElement.parentElement.id)){
        e.target.parentElement.parentElement.remove();
        is_task_exist = document.getElementsByClassName("task-row").length > 0;
        if(is_task_exist == false){
            no_task_message.style.display = "block";
        }        
    }else{
        alert("Вы удаляете задачи слишком часто");
    }

    
}

delete_task_id = async function(task_id){
    const formData = new URLSearchParams();
    formData.append('delete_id', task_id.split("_")[1]);
    can_del = false;
    fetch('/delete_task_by_id', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: formData
        })
        .then(response => response.text())
        .then(data => can_del = true)
        .catch(error => console.error('Ошибка обработки:', error));
    return can_del;
}

addition_start = function(){
    let add_new_task_section = document.getElementsByClassName("add-new-task-section").item(0);
    let add_new_task_menu_section = document.getElementsByClassName("add-new-task-menu-section").item(0);

    add_new_task_section.style.display = "none";
    add_new_task_menu_section.style.display = "block";
    add_new_task_menu_section.children[0].focus();
}

addition_cancel = function(){
    let add_new_task_section = document.getElementsByClassName("add-new-task-section").item(0);
    let add_new_task_menu_section = document.getElementsByClassName("add-new-task-menu-section").item(0);

    add_new_task_section.style.display = "block";
    add_new_task_menu_section.style.display = "none";
    document.getElementsByClassName("add-new-task-menu__text").item(0).value = "";
}

create_task_section = async function(task_id, text){
    const parser = new DOMParser(),
    dom = parser.parseFromString(task_page, "text/html");
    task_row = dom.getElementsByClassName("task-row").item(0);

    task_row.id = "task-id_"+task_id
    task_row.children.item(0).children.item(1).text = text;
    task_row.children.item(0).children.item(0).addEventListener('click',(event)=> task_done(event));

    tasks_container.item(0).appendChild(task_row);
    is_task_exist = true;
    no_task_message.style.display = "none";
}

add_new_task = async function(){
    
    let text = document.getElementsByClassName("add-new-task-menu__text").item(0);
    const formData = new URLSearchParams();
    formData.append('task_text', text.value);

    new_id = "0"
    fetch('/add_new_task', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: formData
    })
    .then(response => response.text())
    .then(data => new_id = data)
    .catch(error => console.error('Ошибка обработки:', error));
    create_task_section(new_id, text.value);
    
    addition_cancel();
    text.value = "";

  
}

load_all_tasks = async function(){
    // var request = new XMLHttpRequest();
    // request.open("GET", "/get_all_tasks");
    // request.responseType = "text"; 
    // request.onload = function () {
    //     console.log(request.response)
    // };
    // request.send()
    let all_prev_tasks = await fetch("/get_all_tasks").then(response => response.text())
    .catch(error => console.log("Ошибка добавления", error))
    .then(text => JSON.parse(text));
    // all_prev_tasks.forEach((element) => console.log(element))

    for(i in all_prev_tasks){
        console.log(i);
        create_task_section(i, all_prev_tasks[i].task_text);
    }   

    if(is_task_exist){
        console.log(is_task_exist);
    }

}


load_task_page = async function(){
    task_page = await fetch('/task/task.html')
    .then(response => response.text());

    load_all_tasks();   

}

//Register listeners
add_new_task_btn.addEventListener('click', addition_start);
add_new_task_menu_agree.addEventListener('click', add_new_task);
add_new_task_menu_disagree.addEventListener('click', addition_cancel);
document.getElementsByClassName("add-new-task-menu__text").item(0).addEventListener('keydown', function(event) {
    if (event.code == 'Enter') {
      add_new_task();
    }

});

add_new_task_btn.addEventListener('mouseover', function(){console.log("hhh")});
Window.onload = load_task_page();