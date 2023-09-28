const taskDOM = document.querySelector(".tasks");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-Input");
const formAlertDOM = document.querySelector(".form-alert");

// /api/v1/tasksからタスクを読み込む
const showTasks = async () => {
    try {
        //自作のAPIを叩く
        const { data: tasks } = await axios.get("/api/v1/tasks");

        //タスクが一つもない時
        if (tasks.length < 1) {
            taskDOM.innerHTML = `<h5 class="empty-list">タスクがありません</h5>`
            return;
        };

        //タスクを出力
        const allTasks = tasks.map((task) => {
            const { completed, _id, name } = task;
            return `<div class="single-task ${completed && "task-completed"}">
            <h5>
                <span> <i class="far fa-check-circle"></i></span>
                ${name}
            </h5>
            <div class="task-links">
                <a href="edit.html?id=${_id}" class="edit-link">
                    <i class="fas fa-edit"></i>
                </a>
                <button type="button" class="delete-btn" data-id="${_id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>`;
        }).join("");
        taskDOM.innerHTML = allTasks;
    } catch (err) {
        console.log(err);
    }
};

showTasks();

//タスクを新規作成する
formDOM.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = taskInputDOM.value;
    try {
        await axios.post("/api/v1/tasks", { name: name });
        showTasks();
        taskInputDOM.value = "";
        formAlertDOM.textContent = "タスクを追加しました";
        formAlertDOM.classList.add("text-success");
        formAlertDOM.style.display = "block";
    } catch (error) {
        console.log(error);
        formAlertDOM.innerHTML = "無効です。もう一度やり直してください。"
        formAlertDOM.style.display = "block";
    }
    setTimeout(() => {
        formAlertDOM.style.display = "none"
        formAlertDOM.classList.remove("text-success");
    }, 3000);
});

//タスクを削除する
taskDOM.addEventListener("click", async (e) => {
    const element = e.target;
    if (element.parentElement.classList.contains("delete-btn")) {
        const id = element.parentElement.dataset.id;
        try {
            await axios.delete(`/api/v1/tasks/${id}`);
            showTasks();
            formAlertDOM.classList.add("text-delete");
            formAlertDOM.innerHTML = "タスクを削除しました";
            formAlertDOM.style.display = "block";
            setTimeout(() => {
                formAlertDOM.style.display = "none"
                formAlertDOM.classList.remove("text-delete");
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    }
});