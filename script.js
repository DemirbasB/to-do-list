// NOTE Burada bir array olusturuluyor. Array, belli ya da belirsiz bir sayida deger tutmak icin kullaniliyor, Daha sonra bu degerleri dongu icerisinde kullanmak mumkun. Array genel olarak onemli bir konu, array fonksiyonlarini ogrenmek oldukca faydali olur
// TODO Genel bir aliskanlik olarak degisken isimlerini ve fonksiyon isimlerini ingilizce olarak tanimlamaya dikkat etmenizi tavsiye ederim, simdiden bu aliskanlik edinilirse ileride sorun yasamazsiniz.
let gorevListesi = [];

// TODO Yine genel bir aliskanlik olarak, tekrar eden bilgileri mutlaka bir degiskende tutmaya calisin, boylece bir degisiklik gerektiginde tek yerden yaparsiniz
const localStorageKey = "gorevListesi";

// NOTE LocalStorage apisi oldukca kullanisli bir api, kullanicinin bilgisayarinda ufak tefek degerleri tutmak icin oldukca kullanisli
if (localStorage.getItem(localStorageKey) !== null) {
    gorevListesi = JSON.parse(localStorage.getItem(localStorageKey));
}

// NOTE Degiskenler bu sekilde tek seferde de tanimlanabilir, ama pratikte digerinden bir farki yok, iki turlu de olur
let editId, isEditTask = false;

const taskInputSelectorQuery = "#txtTaskName";
const btnClearSelectorQuery = "#btnClear";
const filtersSelectorQuery = ".filters span";
const spanActiveSelectorQuery = "span.active";

const taskInput = document.querySelector(taskInputSelectorQuery);
const btnClear = document.querySelector(btnClearSelectorQuery);
const filters = document.querySelectorAll(filtersSelectorQuery);
const spanActive = document.querySelector(spanActiveSelectorQuery);

// TODO Yukarida filters diye bir tanim var, ama bu fonksiyonun scope'si icersinde de filters diye bir degisken kullanilmis. Bu durum shadow-variables sikintisini olusturacaktir. O sebeple bir scope icerisinde ust scopeden bir degisken ismi kullanmamaya dikkat etmenizi oneririm
function displayTasks(filterName) {
  let ul = document.getElementById("task-list");

  // TODO Bu proje icin sorun degil ama `innerHTML` uzerinde degisiklik yapmak genelde cok guvenli bir islem degildir. Ama su an icin bu hali kalabilir, React gibi teknolojilere gectiginizde bu sekilde islemler yapmaniz kesinlikle yasak olacak, react direkt calismiyor bu sekilde
  ul.innerHTML = "";

  // TODO Karsilastirma islemleri icin `==` kullanimindan kacinmanizi oneririm, artik guvenli sayilmiyor, onun yerine `===` kullanmaniz daha iyi olacaktir, aralarindaki farklari arastirmanizi oneririm, is gorusmelerinde soruyor herkes
  // NOTE gorevListesi degiskeni bir array oldugu icin kendi array fonksiyonlarina sahip. `length` bunlardan birisi, arraydaki eleman sayisini verir

  if (gorevListesi.length === 0) {
    // Eger listede eleman yoksa bu gerceklesiyor
    ul.innerHTML = "<p class='p-3 m-0'><b>Task list is empty</b></p>";
  } else {
    // Listede elemanlar varsa bu kisim gerceklesiyor
    // NOTE Asagidaki tanimlama, gorev listesindeki elemanlari siradan tek tek gez, her seferinde siradaki degeri `gorev` isimli degiskene aktar diyor.
    for (const gorev of gorevListesi) {
      // TODO Uzerinde bir degisiklik yapmayacaginiz degiskenleri `const` ile tanimlamak daha iyi olacaktir, asagidaki `completed` degiskeni tanimlandiktan sonra bir daha degismiyor
      const completed = gorev.durum === "completed" ? "checked" : "";

      if (filterName === gorev.durum || filterName === "all") {
        let li = `
                <li class="task list-group-item">
                    <div class="form-check">
                        <input
                            type="checkbox"
                            onclick="status(this)"
                            id="${gorev.id}"
                            class="form-check-input"
                            ${completed}
                        />
                        <label for="${gorev.id}" class="form-check-label ${completed}">
                            ${gorev.gorevAdi}
                        </label>
                    </div>
                    <div class="dropdown">
                        <button
                            class="btn btn-link dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                        <i class="fa-solid fa-ellipsis"></i>
                        </button>
                        <ul
                            class="dropdown-menu"
                            aria-labelledby="dropdownMenuButton1"
                        >
                            <li>
                                <a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#">
                                    <i class="fa-solid fa-trash-can"></i> Delete
                                </a>
                            </li>
                            <li>
                                <a onclick='editTask(${gorev.id}, "${gorev.gorevAdi}")' class="dropdown-item" href="#">
                                    <i class="fa-solid fa-pen-to-square"></i> Edit
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
            `;

        ul.insertAdjacentHTML("beforeend", li);
      }
    }
  }
}

function status(selectedTask) {
  let label = selectedTask.parentElement.lastElementChild;
  let durum;

  if (selectedTask.checked) {
    label.classList.add("checked");
    durum = "completed";
  } else {
    label.classList.remove("checked");
    durum = "pending";
  }

  for (const gorev of gorevListesi) {
    if (gorev.id === selectedTask.id) {
      gorev.durum = durum;
    }
  }

  displayTasks(document.querySelector("span.active").id);

  localStorage.setItem(localStorageKey, JSON.stringify(gorevListesi));
}

function newTask(event) {
  event.preventDefault();

  let taskInput = document.querySelector(taskInputSelectorQuery);

  if (taskInput.value === "") {
    alert("Görev Girmelisiniz!");
  } else {
    if (!isEditTask) {
      // ekleme
      gorevListesi.push({
        id: gorevListesi.length + 1,
        gorevAdi: taskInput.value,
        durum: "pending",
      });
    } else {
      // güncelleme
      for (let gorev of gorevListesi) {
        if (gorev.id === editId) {
          gorev.gorevAdi = taskInput.value;
          taskInput.value = "";
        }
        isEditTask = false;
      }
    }

    taskInput.value = "";
    displayTasks(spanActive.id);

    localStorage.setItem(localStorageKey, JSON.stringify(gorevListesi));
  }
}

function deleteTask(id) {
  let deletedId;
  for (const index in gorevListesi) {
    if (gorevListesi[index].id === id) {
      deletedId = index;
    }
  }

  gorevListesi.splice(deletedId, 1);
  displayTasks(spanActive.id);

  localStorage.setItem(localStorageKey, JSON.stringify(gorevListesi));
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add("active");
}

// TODO Genel aliskanlik olarak ust satirlarda tanimlanmamis bir deger ya da fonksiyonu kullanmamaya calisin, kafa karisikligina sebep olmasin. JS hoisting diye bir konu var, o sebeple bu sekilde calisiyor, ama cogu dilde bu sekilde kullanimlarda hata alirsiniz, ondan genel olarak bu aliskanlik oldukca faydali olur
displayTasks(spanActive.id);

const btnAddNewTaskSelectorQuery = "#btnAddNewTask";

document.querySelector(btnAddNewTaskSelectorQuery).addEventListener("click", newTask);
document.querySelector(btnAddNewTaskSelectorQuery).addEventListener("keypress", function (event) {
    if (event.code === "enter") {
        document.getElementById(btnAddNewTaskSelectorQuery).click();
    }
});

for (let span of filters) {
    span.addEventListener("click", function () {
        document.querySelector(spanActiveSelectorQuery).classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
    });
}

btnClear.addEventListener("click", function () {
    gorevListesi.splice(0, gorevListesi.length);
    localStorage.setItem(localStorageKey, JSON.stringify(gorevListesi));

    displayTasks("all");
});
