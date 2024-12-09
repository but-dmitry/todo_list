

let tasks_container = document.getElementsByClassName("task-rows");
let add_new_task_btn = document.getElementsByClassName("add-new-task-section__add_button").item(0);
let add_new_task_menu_agree = document.getElementsByClassName("add-new-task-menu-section__add_button").item(0);
let add_new_task_menu_disagree = document.getElementsByClassName("add-new-task-menu-section__cancel_button").item(0);



task_done = function(e){
    console.log();
    e.target.parentElement.remove()
}

addition_start = function(){
    let add_new_task_section = document.getElementsByClassName("add-new-task-section").item(0);
    let add_new_task_menu_section = document.getElementsByClassName("add-new-task-menu-section").item(0);

    add_new_task_section.style.display = "none";
    add_new_task_menu_section.style.display = "block";
}

addition_cancel = function(){
    let add_new_task_section = document.getElementsByClassName("add-new-task-section").item(0);
    let add_new_task_menu_section = document.getElementsByClassName("add-new-task-menu-section").item(0);

    add_new_task_section.style.display = "block";
    add_new_task_menu_section.style.display = "none";
}

add_new_task = async function(){
    
    let text = document.getElementsByClassName("add-new-task-menu__text").item(0);
    let task_page = await fetch('/task/task.html')
    .then(response => response.text());
    const parser = new DOMParser(),
    dom = parser.parseFromString(task_page, "text/html");
    let task_row = dom.getElementsByClassName("task-row").item(0);
    task_row.children.item(0).children.item(1).text = text.value;
    task_row.children.item(0).children.item(0).addEventListener('click',(event)=> task_done(event));

    
    tasks_container.item(0).appendChild(task_row);
    addition_cancel();
    text.value = "";
}

load_all_tasks = function(){
    var request = new XMLHttpRequest();
    request.open("GET", "localhost:8080/get_all_tasks");

}

//Register listeners
add_new_task_btn.addEventListener('click', addition_start);
add_new_task_menu_agree.addEventListener('click', add_new_task);
add_new_task_menu_disagree.addEventListener('click', addition_cancel);

add_new_task_btn.addEventListener('mouseover', function(){console.log("hhh")});
load_all_tasks();
