import { getNameCourses } from "./course.js";
const nameCourses = getNameCourses();

import {
    updateClassCount,
    updateClassActiveCount,
    updateClassFinishCount,
    updateClassWaitCount,
} from "./statistic.js";

import {
    isLoggedIn,
    loginOverlay,
    loginIcon,
    loginPasswordInput,
    loginEmailInput,
} from "./account.js";
// Kiểm tra đã đăng nhập chưa
function checkLogin() {
    if (!isLoggedIn) {
        loginOverlay.classList.add("active");
        loginEmailInput.value = "";
        loginPasswordInput.value = "";
        return false;
    }
    return true;
}

let classes = JSON.parse(localStorage.getItem("classes"))
    ? JSON.parse(localStorage.getItem("classes"))
    : [
          {
              id: 1,
              MaLH: "C001",
              TenLH: "HN-JV230508",
              Teacher: "QuangND",
              Desc: "Java fullstack",
              Num: 24,
              Status: "Hoạt động",
              TenKH: "Khóa Học 1",
          },
          {
              id: 2,
              MaLH: "C002",
              TenLH: "HN-JV230508",
              Teacher: "QuangND",
              Desc: "Java fullstack",
              Num: 24,
              Status: "Kết thúc",
              TenKH: "Khóa Học 2",
          },
          {
              id: 3,
              MaLH: "C003",
              TenLH: "HN-JV230508",
              Teacher: "QuangND",
              Desc: "Java fullstack",
              Num: 24,
              Status: "Chờ lớp",
              TenKH: "Khóa Học 3",
          },
          {
              id: 4,
              MaLH: "C004",
              TenLH: "HN-JV240508",
              Teacher: "QuangND",
              Desc: "Java fullstack",
              Num: 24,
              Status: "Chờ lớp",
              TenKH: "Khóa Học 14",
          },
          {
              id: 5,
              MaLH: "C005",
              TenLH: "HN-JV230508",
              Teacher: "QuangND",
              Desc: "Java fullstack",
              Num: 24,
              Status: "Hoạt động",
              TenKH: "Khóa Học 5",
          },
      ];

// Hàm lưu trên local storage classes
function saveClasses(saveClasses) {
    localStorage.setItem("classes", JSON.stringify(saveClasses));
}
saveClasses(classes);

// Sao chép mảng mặc định của classes
let classesDefault = JSON.parse(localStorage.getItem("classesDefault"))
    ? JSON.parse(localStorage.getItem("classesDefault"))
    : []; // Lưu trên localStorage

if (classesDefault.length === 0) {
    classesDefault = [...classes];
    saveClassesDefault(classesDefault);
}
saveClassesDefault(classesDefault);

// Hàm lưu trên local storage classesDefault
function saveClassesDefault(saveClassesDefault) {
    localStorage.setItem("classesDefault", JSON.stringify(saveClassesDefault));
}

// sao chép tất cả tên lớp học vào nameClasses
let nameClasses = [];
function copyNameClasses(classesDefault) {
    const uniqueNames = new Set(
        classesDefault
            .filter(
                (_class) =>
                    _class.Status === "Hoạt động" || _class.Status === "Chờ lớp"
            )
            .map((_class) => _class.TenLH)
    );
    nameClasses = Array.from(uniqueNames);
}
copyNameClasses(classesDefault);

function getNameClasses() {
    return nameClasses;
}

const classLink = document.getElementById("class__link");
const _class = document.querySelector(".class-section");
const navbarLink = document.querySelector(".navbar__link-class");

export { classLink, _class, classes, nameClasses, getNameClasses };

// Thêm active khi ấn vào nav-group
document.addEventListener("DOMContentLoaded", function () {
    classLink.addEventListener("click", function (e) {
        e.preventDefault();

        // Ẩn tất cả các phần
        document
            .querySelectorAll(
                ".course, .statistic, .class-section, .student-section , .tk"
            )
            .forEach((section) => {
                section.style.display = "none";
            });

        // Hiện phần lớp học
        _class.style.display = "block";
        classLink.classList.add("active");

        // Xóa active của tất cả navbar__link
        document.querySelectorAll(".navbar__link").forEach((link) => {
            link.classList.remove("active");
        });
        // Thêm class active cho liên kết hiện tại
        navbarLink.classList.add("active");

        // Xóa active của tất cả nav-group
        document.querySelectorAll(".nav-group").forEach((link) => {
            link.classList.remove("active");
        });
        // Thêm class active cho liên kết hiện tại
        classLink.classList.add("active");
    });
});

// Lấy id
let _id = 0;
if (classes.length > 0) {
    for (const item of classes) {
        if (item.id > _id) _id = item.id;
    }
}

// ++++++++++++++ Render Item Classes ++++++++++++++
// Vị trí cần hiện lên khi xóa
let indexShowDeleteClass = null;
// Trang hiện tại và số phần tử mỗi trang
let currentPage = 1;
const classesPerPage = 5;
function renderClasses(itemClasses) {
    const startIndex = (currentPage - 1) * classesPerPage;
    indexShowDeleteClass = startIndex;
    const endIdex = startIndex + classesPerPage;
    const classesToRender = itemClasses.slice(startIndex, endIdex);

    let _tr = "";
    classesToRender.forEach((item, index) => {
        _tr += ` <tr class="list-class-info">
                    <td>${startIndex + index + 1}</td>
                    <td class="class-info-MaLH">${item.MaLH}</td>
                    <td class="class-info-TenLH list-info-td">${item.TenLH}</td>
                    <td class="class-info-GV list-info-td">${item.Teacher}</td>
                    <td class="class-info-DESC list-info-td">${item.Desc}</td>
                    <td class="class-info-Num">${item.Num}</td>
                    <td>${item.Status}</td>
                    <td>${item.TenKH}</td>
                    <td>
                        <div class="list-class-btn">
                            <button
                                class="list-class-btn-edit"
                                data-id=${item.id}
                                data-index=${index + 1}
                            >
                                Sửa
                            </button>
                            <button 
                                class="list-class-btn-delete"
                                data-id=${item.id}
                                data-index=${index + 1}
                                style="display: ${
                                    item.Num === 0 || item.Status === "Kết thúc"
                                        ? "inline-block"
                                        : "none"
                                }"
                            >
                                Xóa
                            </button>
                        </div>
                    </td>
                </tr>`;
    });
    let _tbody = document.getElementById("list-class-content");
    _tbody.innerHTML = _tr;
    // Xóa class
    deleteEventListeners();
    // Sửa course
    editEventListener();
    // Phân trang
    updatePagination(itemClasses.length);
}
renderClasses(classes);

// Hàm reset content khi tắt add-class overlay
function resetStringInput() {
    document.getElementById("class-code").value = "";
    document.getElementById("class-name").value = "";
    document.getElementById("class-teacher").value = "";
    document.getElementById("class-desc").value = "";
    document.getElementById("class-num").value = "";

    document.getElementById("class-kh").value = "default";

    const status = document.getElementsByName("class-status");
    status.forEach((item) => (item.checked = false));

    addOverLay.classList.remove("active");
}

// Hàm show thông báo sai
function showError(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

// Hàm hide thông báo sai
function hideError(id) {
    const errorElement = document.getElementById(id);
    errorElement.style.display = "none";
}

const classCodeInput = document.getElementById("class-code");
const classNameInput = document.getElementById("class-name");
const classTeacherInput = document.getElementById("class-teacher");
const classDescInput = document.getElementById("class-desc");
const classNumInput = document.getElementById("class-num");
const classKhSelect = document.getElementById("class-kh");
const classStatusInput = document.getElementsByName("class-status");

classCodeInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-class-code");
});

classNameInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-class-name");
});

classTeacherInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-class-teacher");
});

classDescInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-class-desc");
});

classNumInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-class-num");
});

if (classKhSelect.value !== "default") {
    hideError("error-class-kh");
}

classStatusInput.forEach((input) => {
    input.addEventListener("input", function (e) {
        e.preventDefault();
        if (input.checked) {
            hideError("error-class-status");
        }
    });
});

// +++++++++++++++ Thêm class +++++++++++++++
// Mở addCLass và thêm class
const openAddClass = document.querySelector(".class-add__inner");
const addOverLay = document.getElementById("add-class-overlay");
const closeModal = document.querySelector(".add-class__close");
const cancelBtn = document.querySelector(".add-class__cancel");
document.addEventListener("DOMContentLoaded", function () {
    // Mở add overLay class
    openAddClass.addEventListener("click", function (e) {
        console;
        e.preventDefault();
        if (checkLogin()) {
            addOverLay.classList.add("active");
        }
    });
    // Tắt add overLay class khi ấn nút đóng
    closeModal.addEventListener("click", function (e) {
        e.preventDefault();
        addOverLay.classList.remove("active");
        hideError("error-class-code");
        hideError("error-class-name");
        hideError("error-class-teacher");
        hideError("error-class-desc");
        hideError("error-class-num");
        hideError("error-class-kh");
        hideError("error-class-status");
        resetStringInput();
    });
    // Tắt add overLay class khi ấn nút hủy
    cancelBtn.addEventListener("click", function (e) {
        e.preventDefault();
        addOverLay.classList.remove("active");
        hideError("error-class-code");
        hideError("error-class-name");
        hideError("error-class-teacher");
        hideError("error-class-desc");
        hideError("error-class-num");
        hideError("error-class-kh");
        hideError("error-class-status");
        resetStringInput();
    });

    // Tắt addOverLay class khi ấn bên ngoài nội dung modal
    addOverLay.addEventListener("click", function (e) {
        e.preventDefault();

        // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
        const addTargetOverLay = document.querySelector(".add-class");
        if (!addTargetOverLay.contains(e.target)) {
            addOverLay.classList.remove("active");
            hideError("error-class-code");
            hideError("error-class-name");
            hideError("error-class-teacher");
            hideError("error-class-desc");
            hideError("error-class-num");
            hideError("error-class-kh");
            hideError("error-class-status");
            resetStringInput();
        }
    });

    // Ngăn chặn các nhấp chuột bên trong nội dung phương thức
    const addTargetOverLay = document.querySelector(".add-class");
    addTargetOverLay.addEventListener("click", function (e) {
        e.stopPropagation(); // làm addTargetOverLay nổi lên trên phần tử cha
    });

    populateSelect(nameCourses, "class-kh");
});

// Hàm thêm các thẻ option vào select element cho Tên khóa học
function populateSelect(myNameCourse, id) {
    const selectElement = document.getElementById(id);

    myNameCourse.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        selectElement.appendChild(option);
    });
}

const addItemClass = document.querySelector(".add-class__new");
addItemClass.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("name", nameClasses);
    const malh = document.getElementById("class-code").value.trim();
    const tenlh = document.getElementById("class-name").value.trim();
    const gv = document.getElementById("class-teacher").value.trim();
    const desc = document.getElementById("class-desc").value.trim();
    const num = document.getElementById("class-num").value.trim();
    const tenkh = document.getElementById("class-kh");
    const valueTenKh = tenkh.value;

    const statusElements = document.getElementsByName("class-status");
    let status = "";
    for (const item of statusElements) {
        if (item.checked) {
            console.log(item.value);
            status = item.value;
            break;
        }
    }

    let isValid = true;
    // Kiểm tra điều kiện của mã lớp học bằng regex
    const malhRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,6}$/;
    if (!malhRegex.test(malh) || malh.length > 6 || !malh) {
        showError("error-class-code", "Tối đa 6 kí tự (có 1 chữ hoa, 1 số)");
        isValid = false;
    } else {
        hideError("error-class-code");
    }

    // Kiểm tra điều kiện của tên lớp học
    const tenlhRegex =
        /^([A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)([\s-][A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)*(\s*\d*)$/;
    if (!tenlhRegex.test(tenlh) || !tenlh) {
        showError(
            "error-class-name",
            "Viết hoa chữ cái đầu mỗi từ, có thể ghi số"
        );
        isValid = false;
    } else {
        hideError("error-class-name");
    }

    // Kiểm tra điều kiện của tên giảng viên
    const gvRegex =
        /^([A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)(\s[A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)*$/;
    if (!gvRegex.test(gv) || !gv) {
        showError("error-class-teacher", "Viết hoa chữ cái đầu");
        isValid = false;
    } else {
        hideError("error-class-teacher");
    }

    // Kiểm tra điều kiện của mô tả
    if (!desc || desc.length > 20) {
        showError("error-class-desc", "Không được để trống và quá 20 kí tự");
        isValid = false;
    } else {
        hideError("error-class-desc");
    }

    // Kiểm tra điều kiện của sĩ số
    const numRegex = /^\d+$/;
    if (!numRegex.test(num) || !num || num.length > 6) {
        showError("error-class-num", "Tối đa 6 kí tự chỉ được phép chứa số");
        isValid = false;
    } else {
        hideError("error-class-num");
    }

    // Kiểm tra điều kiện của tên khóa học
    if (tenkh.value === "default") {
        showError("error-class-kh", "Hãy chọn khóa học");
        isValid = false;
    }
    tenkh.addEventListener("change", function (e) {
        if (tenkh.value === "default") {
            showError("error-class-kh", "Hãy chọn khóa học");
            isValid = false;
        } else {
            hideError("error-class-kh");
        }
    });

    // Kiểm tra điều kiện của trạng thái lớp học
    if (status === "") {
        showError("error-class-status", "Vui lòng chọn trạng thái lớp học");
        isValid = false;
    } else {
        hideError("error-class-status");
    }

    if (!isValid) {
        return;
    }

    classes.push({
        id: ++_id,
        MaLH: malh,
        TenLH: tenlh,
        Teacher: gv,
        Desc: desc,
        Num: num,
        Status: status,
        TenKH: valueTenKh,
    });

    classesDefault.push({
        id: _id,
        MaLH: malh,
        TenLH: tenlh,
        Teacher: gv,
        Desc: desc,
        Num: num,
        Status: status,
        TenKH: valueTenKh,
    });

    // Cập nhật phân trang và hiện trang cuối cùng
    currentPage = Math.ceil(classes.length / classesPerPage); // classesPerPage là số khóa học trên mỗi trang
    updatePagination(classes.length);
    highlightActivePage(currentPage);

    saveClassesDefault(classesDefault);
    saveClasses(classes);
    renderClasses(classes);
    // Copy tên lớp học
    copyNameClasses(classesDefault);
    // Tổng số lớp đang hoạt động
    updateClassActiveCount();
    // Tổng số lớp đã kết thúc
    updateClassFinishCount();
    // Tổng số lớp đang chờ
    updateClassWaitCount();
    // Tổng số lớp
    updateClassCount();
    resetStringInput();
});

// +++++++++++++++ Sửa Courses +++++++++++++++
let classIdEdit = null;
const editOverlay = document.getElementById("update-class-overlay");

// Tắt editOverlay class khi ấn bên ngoài nội dung modal
editOverlay.addEventListener("click", function (e) {
    e.preventDefault();

    // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
    const updateTargetOverLay = document.querySelector(".update-class");
    if (!updateTargetOverLay.contains(e.target)) {
        editOverlay.classList.remove("active");
        hideError("update-error-class-code");
        hideError("update-error-class-name");
        hideError("update-error-class-teacher");
        hideError("update-error-class-desc");
        hideError("update-error-class-desc");
        hideError("update-error-class-num");
    }
});

// Ngăn chặn các nhấp chuột bên trong nội dung phương thức
const updateTargetOverLay = document.querySelector(".update-class");
updateTargetOverLay.addEventListener("click", function (e) {
    e.stopPropagation(); // làm updateTargetOverLay nổi lên trên phần tử cha
});

const updateCodeInput = document.getElementById("update-class-code");
const updateNameInput = document.getElementById("update-class-name");
const updateTeacherInput = document.getElementById("update-class-teacher");
const updateDescInput = document.getElementById("update-class-desc");
const updateNumInput = document.getElementById("update-class-num");

updateCodeInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("update-error-class-code");
});

updateNameInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("update-error-class-name");
});

updateTeacherInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("update-error-class-teacher");
});

updateDescInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("update-error-class-desc");
});

updateNumInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("update-error-class-num");
});

// Hàm thêm các thẻ option vào select element cho Tên khóa học
populateSelect(nameCourses, "update-class-kh");

function editEventListener() {
    const editButtons = document.querySelectorAll(".list-class-btn-edit");
    editButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            classIdEdit = parseInt(button.getAttribute("data-id"));
            console.log(classIdEdit);
            let malh = document.getElementById("update-class-code");
            let tenlh = document.getElementById("update-class-name");
            let gv = document.getElementById("update-class-teacher");
            let desc = document.getElementById("update-class-desc");
            let num = document.getElementById("update-class-num");
            let tenkh = document.getElementById("update-class-kh");
            let statusElements = document.getElementsByName("class-status");

            // Lấy dữ liệu từ id đã chọn
            const id = classes.find((item) => item.id === classIdEdit);
            if (id) {
                malh.value = id.MaLH;
                tenlh.value = id.TenLH;
                gv.value = id.Teacher;
                desc.value = id.Desc;
                num.value = id.Num;
                // Gán giá trị Tên khóa học vào select
                for (const option of tenkh.options) {
                    if (option.value === id.TenKH) {
                        option.selected = true;
                    }
                }
                // Gán giá trị Trạng thái vào radio
                statusElements.forEach((radio) => {
                    if (radio.value === id.Status) {
                        radio.checked = true;
                    }
                });
            }

            const editItemClass = document.querySelector(".update-class__new");
            editItemClass.addEventListener("click", function (e) {
                e.preventDefault();

                let isValid = true;
                // Lấy giá trị và kiểm tra điều kiện của mã lớp học
                const malhValue = malh.value.trim();
                const malhRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,6}$/;
                if (
                    !malhRegex.test(malhValue) ||
                    malhValue.length > 6 ||
                    !malhValue
                ) {
                    showError(
                        "update-error-class-code",
                        "Tối đa 6 kí tự (có 1 chữ hoa, 1 số)"
                    );
                    isValid = false;
                } else {
                    hideError("update-error-class-code");
                }

                // Lấy giá trị và kiểm tra điều kiện của tên lớp học
                const tenlhValue = tenlh.value.trim();
                const tenlhRegex =
                    /^([A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)([\s-][A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)*(\s*\d*)$/;
                if (!tenlhRegex.test(tenlhValue) || !tenlhValue) {
                    showError(
                        "update-error-class-name",
                        "Viết hoa chữ cái đầu mỗi từ"
                    );
                    isValid = false;
                } else {
                    hideError("update-error-class-name");
                }

                // Lấy giá trí và kiếm trả điều kiện của tên giảng viên
                const gvValue = gv.value.trim();
                const gvRegex =
                    /^([A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)(\s[A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)*$/;
                if (!gvRegex.test(gvValue) || !gvValue) {
                    showError(
                        "update-error-class-teacher",
                        "Viết hoa chữ cái đầu"
                    );
                    isValid = false;
                } else {
                    hideError("update-error-class-teacher");
                }

                // Lấy giá trị và kiểm tra điều kiện của mô tả
                const descValue = desc.value.trim();
                if (!descValue || descValue.length > 20) {
                    showError(
                        "update-error-class-desc",
                        "Không được để trống và quá 20 kí tự"
                    );
                    isValid = false;
                } else {
                    hideError("update-error-class-desc");
                }

                // Lấy giá trị và kiểm tra điều kiện của sĩ số
                const numValue = num.value.trim();
                const numRegex = /^\d+$/;
                if (
                    !numRegex.test(numValue) ||
                    !numValue ||
                    numValue.length > 6
                ) {
                    showError(
                        "update-error-class-num",
                        "Tối đa 6 kí tự chỉ được phép chứa số"
                    );
                    isValid = false;
                } else {
                    hideError("update-error-class-num");
                }

                // Lấy giá trị và kiểm tra điều kiện của tên khóa học
                const tenkhValue =
                    document.getElementById("update-class-kh").value;

                // Lấy giá trị và kiểm tra điều kiện của trạng thái lớp học
                const statusElementsValue =
                    document.getElementsByName("class-status");

                if (!isValid) {
                    return;
                }

                const classIndex = classes.findIndex(
                    (item) => item.id === classIdEdit
                );
                console.log(classIndex);
                if (classIndex !== -1) {
                    // Update cho classes
                    classes[classIndex].MaLH = malhValue;
                    classes[classIndex].TenLH = tenlhValue;
                    classes[classIndex].Teacher = gvValue;
                    classes[classIndex].Desc = descValue;
                    classes[classIndex].Num = parseInt(numValue);
                    classes[classIndex].TenKH = tenkhValue;
                    for (const item of statusElementsValue) {
                        if (item.checked) {
                            console.log("Updating status to:", item.value);
                            classes[classIndex].Status = item.value;
                            break;
                        }
                    }

                    saveClasses(classes);
                    renderClasses(classes);

                    // Update cho classesDefault
                    classesDefault[classIndex].MaLH = malhValue;
                    classesDefault[classIndex].TenLH = tenlhValue;
                    classesDefault[classIndex].Teacher = gvValue;
                    classesDefault[classIndex].Desc = descValue;
                    classesDefault[classIndex].Num = parseInt(numValue);
                    classesDefault[classIndex].TenKH = tenkhValue;
                    for (const item of statusElementsValue) {
                        if (item.checked) {
                            classesDefault[classIndex].Status = item.value;
                            console.log(item.value);
                            break;
                        }
                    }
                    saveClassesDefault(classesDefault);
                    // Copy tên lớp học
                    copyNameClasses(classesDefault);
                    // Tổng số lớp đang hoạt động
                    updateClassActiveCount();
                    // Tổng số lớp đã kết thúc
                    updateClassFinishCount();
                    // Tổng số lớp đang chờ
                    updateClassWaitCount();

                    editOverlay.classList.remove("active");
                }
            });

            if (checkLogin()) {
                editOverlay.classList.add("active");
            }
        });
    });
}

// Cancel sửa lớp học
const cancelEditClass = document.querySelector(".update-class__cancel");
cancelEditClass.addEventListener("click", function (e) {
    e.preventDefault();
    hideError("update-error-class-code");
    hideError("update-error-class-name");
    hideError("update-error-class-teacher");
    hideError("update-error-class-desc");
    hideError("update-error-class-num");
    editOverlay.classList.remove("active");
});

// +++++++++++++++ Xóa class +++++++++++++++
let indexDeleteClass = null;
let classIdDeleted = null;
const deleteOverlay = document.getElementById("delete-class-overlay");

// Tắt deleteOverlay class khi ấn bên ngoài nội dung modal
deleteOverlay.addEventListener("click", function (e) {
    e.preventDefault();

    // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
    const deleteTargetOverLay = document.querySelector(".delete-class");
    if (!deleteTargetOverLay.contains(e.target)) {
        deleteOverlay.classList.remove("active");
    }
});

// Ngăn chặn các nhấp chuột bên trong nội dung phương thức
const deleteTargetOverLay = document.querySelector(".delete-class");
deleteTargetOverLay.addEventListener("click", function (e) {
    e.stopPropagation(); // làm deleteTargetOverLay nổi lên trên phần tử cha
});

function deleteEventListeners() {
    const deleteButtons = document.querySelectorAll(".list-class-btn-delete");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            indexDeleteClass = parseInt(button.getAttribute("data-index"));
            classIdDeleted = parseInt(button.getAttribute("data-id"));
            showDeleteClass(classIdDeleted);

            if (checkLogin()) {
                deleteOverlay.classList.add("active");
            }
        });
    });
}

// Hiển thị thông tin lớp học muốn xóa
function showDeleteClass(classId) {
    const _class = classes.find((c) => c.id === classId);
    let _tr = "";
    if (_class) {
        _tr = ` <td>${indexShowDeleteClass + indexDeleteClass}</td>
                <td>${_class.MaLH}</td>
                <td>${_class.TenLH}</td>
                <td>${_class.Teacher}</td>
                <td>${_class.Desc}</td>
                <td>${_class.Num}</td>
                <td>${_class.Status}</td>
                <td>${_class.TenKH}</td>
            `;
    }
    let _tbody = document.querySelector(".delete-table-tbody-class");
    _tbody.innerHTML = _tr;
}

// Xác nhận xóa lớp học
const confirmDeleteClass = document.querySelector(".delete-class-yes");
confirmDeleteClass.addEventListener("click", function (e) {
    e.preventDefault();
    const id = classes.findIndex((_class) => {
        if (
            Number(_class.id) === Number(classIdDeleted) &&
            (_class.Num === 0 || _class.Status === "Kết thúc")
        ) {
            return Number(_class.id);
        }
    });
    const idDefault = classesDefault.findIndex((_class) => {
        if (
            Number(_class.id) === Number(classIdDeleted) &&
            (_class.Num === 0 || _class.Status === "Kết thúc")
        ) {
            return Number(_class.id);
        }
    });
    if (id !== -1) {
        // Xóa Item ở mảng classes và classesDefault
        classes.splice(id, 1);
        classesDefault.splice(idDefault, 1);
    }

    currentPage = 1;
    highlightActivePage(currentPage);
    updatePagination(classes.length);

    saveClassesDefault(classesDefault);
    renderClasses(classes);
    saveClasses(classes);
    // Copy tên lớp học
    copyNameClasses(classesDefault);
    // Tổng số lớp đang hoạt động
    updateClassActiveCount();
    // Tổng số lớp đã kết thúc
    updateClassFinishCount();
    // Tổng số lớp đang chờ
    updateClassWaitCount();
    // Tổng số lớp
    updateClassCount();

    deleteOverlay.classList.remove("active");
});

// Xác nhận hủy xóa lớp học
const cancelDeleteClass = document.querySelector(".delete-class-no");
cancelDeleteClass.addEventListener("click", function (e) {
    e.preventDefault();
    deleteOverlay.classList.remove("active");
});

// +++++++++++++++ Sắp xếp classes +++++++++++++++
const sortClass = document.querySelector(".sort-search-class");
sortClass.value = "default";

let sortOrder;

function extractAlphaNumericParts(className) {
    const alphaPart = className.match(/[a-zA-Z]+/);
    const numPart = className.match(/\d+/);
    return {
        alpha: alphaPart ? alphaPart[0] : "",
        num: numPart ? parseInt(numPart[0], 10) : null,
    };
}

sortClass.addEventListener("change", function (e) {
    sortOrder = sortClass.value;
    e.preventDefault();
    if (sortOrder === "asc") {
        classes.sort((a, b) => {
            const aParts = extractAlphaNumericParts(a.TenLH);
            const bParts = extractAlphaNumericParts(b.TenLH);

            // So sánh phần chữ cái trước
            if (aParts.alpha < bParts.alpha) return -1;
            if (aParts.alpha > bParts.alpha) return 1;

            // Nếu phần chữ cái giống nhau, so sánh phần số
            if (aParts.num === null && bParts.num === null) return 0;
            if (aParts.num === null) return -1;
            if (bParts.num === null) return 1;

            return aParts.num - bParts.num;
        });
    } else if (sortOrder === "desc") {
        classes.sort((a, b) => {
            const aParts = extractAlphaNumericParts(a.TenLH);
            const bParts = extractAlphaNumericParts(b.TenLH);

            // So sánh phần chữ cái trước
            if (aParts.alpha < bParts.alpha) return 1;
            if (aParts.alpha > bParts.alpha) return -1;

            // Nếu phần chữ cái giống nhau, so sánh phần số
            if (aParts.num === null && bParts.num === null) return 0;
            if (aParts.num === null) return 1;
            if (bParts.num === null) return -1;

            return bParts.num - aParts.num;
        });
    } else {
        renderClasses(classesDefault);
        saveClassesDefault(classesDefault);
        searchClasses();
        return;
    }
    saveClasses(classes);
    searchClasses();
    renderClasses(classes);
});

// +++++++++++++++ Tìm tiếm Courses +++++++++++++++
const searchInput = document.querySelector(".search__form-input-class");
const searchSelect = document.querySelector(".select-search-class");

// Thêm event listener cho input và select
let filteredClasses = [];

function searchClasses() {
    const searchItem = searchInput.value.trim().toLowerCase();
    const searchCategory = searchSelect.value;

    // Nếu input trống, render tất cả lớp học
    if (searchItem === "") {
        // Nếu không có tìm kiếm, render tất cả lớp học
        if (sortOrder === "asc") {
            filteredClasses = []; // reset lại mảng tìm kiếm
            classes.sort((a, b) => a.TenLH.localeCompare(b.TenLH));
            renderClasses(classes);
            updatePagination(classes.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        } else if (sortOrder === "desc") {
            filteredClasses = []; // reset lại mảng tìm kiếm
            classes.sort((a, b) => b.TenLH.localeCompare(a.TenLH));
            renderClasses(classes);
            updatePagination(classes.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        } else if (sortOrder === "default") {
            filteredClasses = []; // reset lại mảng tìm kiếm
            renderClasses(classesDefault);
            updatePagination(classes.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        } else if (searchItem === "") {
            filteredClasses = []; // reset lại mảng tìm kiếm
            renderClasses(classesDefault);
            updatePagination(classes.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        }
        return;
    }

    filteredClasses = classesDefault.filter((_class) => {
        if (!_class) return false; // Kiểm tra nếu class là undefined

        switch (searchCategory) {
            case "MaLH":
                return (
                    _class.MaLH &&
                    _class.MaLH.toString().toLowerCase().includes(searchItem)
                );
            case "TenLH":
                return (
                    _class.TenLH &&
                    _class.TenLH.toString().toLowerCase().includes(searchItem)
                );
            case "GV":
                return (
                    _class.Teacher &&
                    _class.Teacher.toString().toLowerCase().includes(searchItem)
                );
            case "DESC":
                return (
                    _class.Desc &&
                    _class.Desc.toString().toLowerCase().includes(searchItem)
                );
            case "Num":
                return (
                    _class.Num &&
                    _class.Num.toString().toLowerCase().includes(searchItem)
                );
            case "Status":
                return (
                    _class.Status &&
                    _class.Status.toString().toLowerCase().includes(searchItem)
                );
            case "TenKH":
                return (
                    _class.TenKH &&
                    _class.TenKH.toString().toLowerCase().includes(searchItem)
                );
            default: // Tất cả
                return (
                    _class.MaLH.toString().toLowerCase().includes(searchItem) ||
                    _class.TenLH.toString()
                        .toLowerCase()
                        .includes(searchItem) ||
                    _class.Teacher.toString()
                        .toLowerCase()
                        .includes(searchItem) ||
                    _class.Desc.toString().toLowerCase().includes(searchItem) ||
                    _class.Num.toString().toLowerCase().includes(searchItem) ||
                    _class.Status.toString()
                        .toLowerCase()
                        .includes(searchItem) ||
                    _class.TenKH.toString().toLowerCase().includes(searchItem)
                );
        }
    });
    renderClasses(filteredClasses); // Render danh sách đã lọc
    currentPage = 1; // Đặt lại trang về 1
    updatePagination(filteredClasses.length); // Cập nhật phân trang
    highlightActivePage(currentPage); // Highlight trang đầu tiên
}

searchInput.addEventListener("input", searchClasses);
searchSelect.addEventListener("change", function (e) {
    e.preventDefault();
    searchInput.value = "";
    searchClasses();
});

// Khi ấn nút reset input thì sẽ render ra toàn bộ classes
const resetInput = document.querySelector(".search__form-close-class");
resetInput.addEventListener("click", function (e) {
    e.preventDefault();
    searchInput.value = "";
    filteredClasses = [];

    if (sortOrder === "asc") {
        classes.sort((a, b) => a.TenLH.localeCompare(b.TenLH));
        renderClasses(classes);
    } else if (sortOrder === "desc") {
        classes.sort((a, b) => b.TenLH.localeCompare(a.TenLH));
        renderClasses(classes);
    } else if (sortOrder === "default") {
        renderClasses(classesDefault);
    } else {
        renderClasses(classesDefault);
    }
});

// +++++++++++++++ Phân Trang +++++++++++++++
function updatePagination(totalClasses) {
    const searchPage = document.getElementById("page-class-search-num");
    const totalPage = Math.ceil(totalClasses / classesPerPage);

    const paginationContainer = document.querySelector(".page-class-btn");

    paginationContainer.innerHTML = ""; // Clear mọi phần tử trong paginationContainer

    // Không hiển thị phân trang nếu tổng số trang nhỏ hơn 2
    if (totalPage < 2) {
        searchPage.style.display = "none";
        return;
    } else {
        searchPage.style.display = "block";

        searchPage.addEventListener("input", function (e) {
            e.preventDefault();
            const page = parseInt(this.value);
            if (page && page > 0 && page <= totalPage) {
                changePage(page);
            }
        });
        // Hiển thị tất cả các trang nếu tổng số trang >=2
        for (let i = 1; i <= totalPage; i++) {
            const button = createPageButton(i);
            paginationContainer.appendChild(button);
        }
        highlightActivePage(currentPage);
    }
}

// Chức năng trợ giúp để tạo các nút trang
function createPageButton(pageNumber) {
    const searchPage = document.getElementById("page-class-search-num");
    const button = document.createElement("button");
    button.className = "page-class-num";
    button.textContent = pageNumber;
    button.dataset.page = pageNumber;
    button.addEventListener("click", () => {
        changePage(pageNumber);
        searchPage.value = "";
    });
    return button;
}

// Hàm di chuyển các nút trang dựa trên trang hiện tại
// Chuyển trang
function changePage(page) {
    const totalClasses =
        filteredClasses.length > 0 ? filteredClasses.length : classes.length;
    if (page < 1 || page > Math.ceil(totalClasses / classesPerPage)) return;

    currentPage = page;
    const classesToRender =
        filteredClasses.length > 0 ? filteredClasses : classes;
    updatePagination(classesToRender.length);
    highlightActivePage(currentPage);
    renderClasses(classesToRender);
}

// active cho từng Page
function highlightActivePage(activePage) {
    const paginationButtons = document.querySelectorAll(".page-class-num");
    paginationButtons.forEach((button) => {
        button.classList.remove("active"); // Xóa class active khỏi tất cả các nút
        if (parseInt(button.dataset.page) === activePage) {
            button.classList.add("active"); // Thêm class active cho nút hiện tại
        }
    });
}
