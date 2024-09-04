import { getNameClasses } from "./class.js";
const nameClasses = getNameClasses();
import {
    updateStudentCount,
    updateStudentWaitCount,
    updateStudentActiveCount,
    updateStudentLeaveCount,
    updateStudentGraduateCount,
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

let students = JSON.parse(localStorage.getItem("students"))
    ? JSON.parse(localStorage.getItem("students"))
    : [
          {
              id: 1,
              MaSV: "SV001",
              TenSV: "Nguyễn Văn A",
              Year: 2000,
              Address: "Hà Nội",
              Gender: "Nam",
              Status: "Chờ lớp",
              TenLH: "ĐN-JS230407",
          },
          {
              id: 2,
              MaSV: "SV002",
              TenSV: "Nguyễn Văn B",
              Year: 2000,
              Address: "Hà Nội",
              Gender: "Nữ",
              Status: "Đang học",
              TenLH: "ĐN-JS230407",
          },
          {
              id: 3,
              MaSV: "SV003",
              TenSV: "Nguyễn Văn C",
              Year: 2000,
              Address: "Hà Nội",
              Gender: "Nam",
              Status: "Bảo lưu",
              TenLH: "ĐN-JS330407",
          },
          {
              id: 4,
              MaSV: "SV004",
              TenSV: "Nguyễn Văn A",
              Year: 2000,
              Address: "Hà Nội",
              Gender: "Nam",
              Status: "Đình chỉ",
              TenLH: "ĐN-JS230407",
          },
          {
              id: 5,
              MaSV: "SV005",
              TenSV: "Nguyễn Văn A",
              Year: 2000,
              Address: "Hà Nội",
              Gender: "Nữ",
              Status: "Tốt nghiệp",
              TenLH: "ĐN-JS230407",
          },
      ];

// Hàm lưu trên local storage students
function saveStudents(saveStudents) {
    localStorage.setItem("students", JSON.stringify(saveStudents));
}
saveStudents(students);

// Sao chép mảng mặc định của students
let studentsDefault = JSON.parse(localStorage.getItem("studentsDefault"))
    ? JSON.parse(localStorage.getItem("studentsDefault"))
    : [];
if (studentsDefault.length === 0) {
    studentsDefault = [...students];
    saveStudentsDefault(studentsDefault);
}
saveStudentsDefault(studentsDefault);

// Hàm lưu trên local storage studentsDefault
function saveStudentsDefault(saveStudentsDefault) {
    localStorage.setItem(
        "studentsDefault",
        JSON.stringify(saveStudentsDefault)
    );
}

const studentLink = document.getElementById("student__link");
const student = document.querySelector(".student-section");
const navbarLink = document.querySelector(".navbar__link-student");

export { studentLink, student, students };

// Thêm active khi ấn vào nav-group
document.addEventListener("DOMContentLoaded", function () {
    studentLink.addEventListener("click", function (e) {
        e.preventDefault();

        // Ẩn tất cả các phần
        document
            .querySelectorAll(
                ".course, .statistic, .class-section, .student-section, .tk"
            )
            .forEach((section) => {
                section.style.display = "none";
            });
        // Hiện phần sinh viên
        student.style.display = "block";
        studentLink.classList.add("active");

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
        studentLink.classList.add("active");
    });
});

// Lấy id
let _id = 0;
if (students.length > 0) {
    for (const item of students) {
        if (item.id > _id) _id = item.id;
    }
}

// ++++++++++++++ Render Item Students ++++++++++++++
// Vị trí cần hiện lên khi xóa
let indexShowDeleteStudent = null;
// Trang hiện tại và số phần tử mỗi trang
let currentPage = 1;
const studentsPerPage = 5;
function renderStudents(itemStudents) {
    const startIndex = (currentPage - 1) * studentsPerPage;
    indexShowDeleteStudent = startIndex;
    const endIdex = startIndex + studentsPerPage;
    const studentsToRender = itemStudents.slice(startIndex, endIdex);

    let _tr = "";
    studentsToRender.forEach((item, index) => {
        _tr += `<tr class="list-student-info">
                    <td>${startIndex + index + 1}</td>
                    <td class="student-info-MaSV">${item.MaSV}</td>
                    <td class="student-info-TenSV list-info-td">${
                        item.TenSV
                    }</td>
                    <td class="student-info-Year">${item.Year}</td>
                    <td class="student-info-Address list-info-td">${
                        item.Address
                    }</td>
                    <td class="student-info-Gender">${item.Gender}</td>
                    <td>${item.Status}</td>
                    <td class="list-info-td">${item.TenLH}</td>
                    <td>
                        <div class="list-student-btn">
                            <button
                                class="list-student-btn-edit"
                                data-id=${item.id}
                                data-index=${index + 1}
                            >
                                Sửa
                            </button>
                            <button
                                class="list-student-btn-delete"
                                data-id=${item.id}
                                data-index=${index + 1}
                                style="display: ${
                                    item.Status === "Đình chỉ"
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
    let _tbody = document.getElementById("list-student-content");
    _tbody.innerHTML = _tr;
    // Xóa student
    deleteEventListeners();
    // Sửa student
    editEventListener();
    // Phân trang
    updatePagination(itemStudents.length);
}
renderStudents(students);

// Hàm reset content khi tắt add-student overlay
function resetStringInput() {
    document.getElementById("student-code").value = "";
    document.getElementById("student-name").value = "";
    document.getElementById("student-year").value = "";
    document.getElementById("student-address").value = "";

    const gender = document.getElementsByName("student-gender");
    gender.forEach((item) => (item.checked = false));

    document.getElementById("student-lh").value = "default";

    const status = document.getElementsByName("student-status");
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

const studentCodeInput = document.getElementById("student-code");
const studentNameInput = document.getElementById("student-name");
const studentYearInput = document.getElementById("student-year");
const studentAddressInput = document.getElementById("student-address");
const studentGenderInput = document.getElementsByName("student-gender");
const studentLhSelect = document.getElementById("student-lh");
const studentStatusInput = document.getElementsByName("student-status");

studentCodeInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-student-code");
});

studentNameInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-student-name");
});

studentYearInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-student-year");
});

studentAddressInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-student-address");
});

studentGenderInput.forEach((input) => {
    input.addEventListener("input", function (e) {
        e.preventDefault();
        if (input.checked) {
            hideError("error-student-gender");
        }
    });
});

if (studentLhSelect.value !== "default") {
    hideError("error-student-lh");
}

studentStatusInput.forEach((input) => {
    input.addEventListener("input", function (e) {
        e.preventDefault();
        if (input.checked) {
            hideError("error-student-status");
        }
    });
});

// +++++++++++++++ Thêm class +++++++++++++++
// Mở addStudent và thêm student
const openAddStudent = document.querySelector(".student-add__inner");
const addOverLay = document.getElementById("add-student-overlay");
const closeModal = document.querySelector(".add-student__close");
const cancelBtn = document.querySelector(".add-student__cancel");
document.addEventListener("DOMContentLoaded", function () {
    // Mở add overlay student
    openAddStudent.addEventListener("click", function (e) {
        e.preventDefault();
        // Kiểm tra đã đăng nhập chưa
        if (checkLogin()) {
            addOverLay.classList.add("active");
        }
    });
    // Tắt add overlay student khi ấn nút đóng
    closeModal.addEventListener("click", function (e) {
        e.preventDefault();
        addOverLay.classList.remove("active");
        hideError("error-student-code");
        hideError("error-student-name");
        hideError("error-student-year");
        hideError("error-student-address");
        hideError("error-student-gender");
        hideError("error-student-lh");
        hideError("error-student-status");
        resetStringInput();
    });
    // Tắt add overlay student khi ấn nút hủy
    cancelBtn.addEventListener("click", function (e) {
        e.preventDefault();
        addOverLay.classList.remove("active");
        hideError("error-student-code");
        hideError("error-student-name");
        hideError("error-student-year");
        hideError("error-student-address");
        hideError("error-student-gender");
        hideError("error-student-lh");
        hideError("error-student-status");
        resetStringInput();
    });
    // Tắt addOverLay class khi ấn bên ngoài nội dung modal
    addOverLay.addEventListener("click", function (e) {
        e.preventDefault();

        // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
        const addTargetOverLay = document.querySelector(".add-student");
        if (!addTargetOverLay.contains(e.target)) {
            addOverLay.classList.remove("active");
            hideError("error-student-code");
            hideError("error-student-name");
            hideError("error-student-year");
            hideError("error-student-address");
            hideError("error-student-gender");
            hideError("error-student-lh");
            hideError("error-student-status");
            resetStringInput();
        }
    });

    // Ngăn chặn các nhấp chuột bên trong nội dung phương thức
    const addTargetOverLay = document.querySelector(".add-student");
    addTargetOverLay.addEventListener("click", function (e) {
        e.stopPropagation(); // làm addTargetOverLay nổi lên trên phần tử cha
    });

    populateSelect(nameClasses, "student-lh");
});

// Hàm thêm các thẻ option vào select element cho tên lớp học
function populateSelect(nameClasses, id) {
    const selectElement = document.getElementById(id);

    nameClasses.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        selectElement.appendChild(option);
    });
}

const addItemStudent = document.querySelector(".add-student__new");
addItemStudent.addEventListener("click", function (e) {
    e.preventDefault();
    const masv = document.getElementById("student-code").value.trim();
    const tensv = document.getElementById("student-name").value.trim();
    const year = document.getElementById("student-year").value.trim();
    const address = document.getElementById("student-address").value.trim();
    const genderElements = document.getElementsByName("student-gender");
    let gender = "";
    for (const item of genderElements) {
        if (item.checked) {
            if (item.value === "male") {
                gender = "Nam";
            } else if (item.value === "female") {
                gender = "Nữ";
            }
            break;
        }
    }
    console.log(gender);

    const tenlh = document.getElementById("student-lh");
    const valueTenlh = tenlh.value;

    const statusElements = document.getElementsByName("student-status");
    let status = "";
    for (const item of statusElements) {
        if (item.checked) {
            status = item.value;
            break;
        }
    }

    let isValid = true;
    // Kiểm tra điều kiện của mã SV bằng regex
    const masvRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,6}$/;
    if (!masvRegex.test(masv) || masv.length > 6 || !masv) {
        showError("error-student-code", "Tối đa 6 kí tự (có 1 chữ hoa, 1 số)");
        isValid = false;
    } else {
        hideError("error-student-code");
    }

    // Kiểm tra điều kiện của tên SV
    const tensvRegex =
        /^([A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)(\s[A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)*$/;
    if (!tensvRegex.test(tensv) || !tensv) {
        showError("error-student-name", "Viết hoa chữ cái đầu");
        isValid = false;
    } else {
        hideError("error-student-name");
    }

    // Kiểm tra điều kiện của năm sinh
    const yearRegex = /^\d+$/;
    if (!yearRegex.test(year) || !year || year.length > 4 || year.length < 4) {
        showError("error-student-year", "Tối đa 4 kí tự chỉ được phép chứa số");
        isValid = false;
    } else {
        hideError("error-student-year");
    }

    // Kiểm tra điều kiện của địa chỉ
    if (!address) {
        showError("error-student-address", "Không để trống");
        isValid = false;
    } else {
        hideError("error-student-address");
    }

    // Kiểm tra điều kiện của giới tính
    if (gender === "") {
        showError("error-student-gender", "Vui lòng chọn giới tính SV");
        isValid = false;
    } else {
        hideError("error-student-gender");
    }

    // Kiểm tra điều kiện của tên lớp học
    if (tenlh.value === "default") {
        showError("error-student-lh", "Hãy chọn lớp học");
        isValid = false;
    }
    tenlh.addEventListener("change", function (e) {
        if (tenlh.value === "default") {
            showError("error-student-lh", "Hãy chọn lớp học");
            isValid = false;
        } else {
            hideError("error-student-lh");
        }
    });

    // Kiểm tra điều kiện của trạng thái SV
    if (status === "") {
        showError("error-student-status", "Vui lòng chọn trạng thái SV");
        isValid = false;
    } else {
        hideError("error-student-status");
    }

    if (!isValid) {
        return;
    }

    students.push({
        id: ++_id,
        MaSV: masv,
        TenSV: tensv,
        Year: year,
        Address: address,
        Gender: gender,
        TenLH: valueTenlh,
        Status: status,
    });

    studentsDefault.push({
        id: _id,
        MaSV: masv,
        TenSV: tensv,
        Year: year,
        Address: address,
        Gender: gender,
        TenLH: valueTenlh,
        Status: status,
    });

    // Cập nhật phân trang và hiện trang cuối cùng
    currentPage = Math.ceil(students.length / studentsPerPage); //studentsPerPage là số SV trên mỗi trang
    updatePagination(students.length);
    highlightActivePage(currentPage);

    saveStudentsDefault(studentsDefault);
    saveStudents(students);
    renderStudents(students);
    // Tổng số SV tốt nghiệp
    updateStudentGraduateCount();
    // Tổng số SV bảo lưu/đình chỉ
    updateStudentLeaveCount();
    // Tổng số SV đang hoạt động
    updateStudentActiveCount();
    // Tổng số SV chờ
    updateStudentWaitCount();
    // Tổng số SV
    updateStudentCount();
    resetStringInput();
});

// +++++++++++++++ Sửa Student +++++++++++++++
let studentIdEdit = null;
const editOverlay = document.getElementById("update-student-overlay");

// Tắt editOverlay class khi ấn bên ngoài nội dung modal
editOverlay.addEventListener("click", function (e) {
    e.preventDefault();

    // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
    const updateTargetOverLay = document.querySelector(".update-student");
    if (!updateTargetOverLay.contains(e.target)) {
        editOverlay.classList.remove("active");
        hideError("update-error-student-code");
        hideError("update-error-student-name");
        hideError("update-error-student-year");
        hideError("update-error-student-address");
        populateSelect(nameClasses, "update-student-lh");
    }
});

// Ngăn chặn các nhấp chuột bên trong nội dung phương thức
const updateTargetOverLay = document.querySelector(".update-student");
updateTargetOverLay.addEventListener("click", function (e) {
    e.stopPropagation(); // làm updateTargetOverLay nổi lên trên phần tử cha
});

const updateCodeInput = document.getElementById("update-student-code");
const updateNameInput = document.getElementById("update-student-name");
const updateYearInput = document.getElementById("update-student-year");
const updateAddressInput = document.getElementById("update-student-address");

updateCodeInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("update-error-student-code");
});

updateNameInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("update-error-student-name");
});

updateYearInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("update-error-student-year");
});

updateAddressInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("update-error-student-address");
});

// Hàm thêm các thẻ option vào select element cho Tên lớp học
populateSelect(nameClasses, "update-student-lh");

function editEventListener() {
    const editButtons = document.querySelectorAll(".list-student-btn-edit");
    editButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            studentIdEdit = parseInt(button.getAttribute("data-id"));

            let masv = document.getElementById("update-student-code");
            let tensv = document.getElementById("update-student-name");
            let year = document.getElementById("update-student-year");
            let address = document.getElementById("update-student-address");
            let genderElements = document.getElementsByName(
                "update-student-gender"
            );
            let tenlh = document.getElementById("update-student-lh");
            let statusElements = document.getElementsByName(
                "update-student-status"
            );

            // Lấy dữ liệu từ id đã chọn
            const id = students.find((item) => item.id === studentIdEdit);
            if (id) {
                masv.value = id.MaSV;
                tensv.value = id.TenSV;
                year.value = id.Year;
                address.value = id.Address;
                // Gán giá trị giới tính vào gender
                genderElements.forEach((radio) => {
                    if (id.Gender === "Nam" && radio.value === "male") {
                        radio.checked = true;
                    } else if (id.Gender === "Nữ" && radio.value === "female") {
                        radio.checked = true;
                    }
                });
                // Gán giá trị Tên lớp học vào select
                for (const option of tenlh.options) {
                    if (option.value === id.TenLH) {
                        option.selected = true;
                    }
                }
                // Gán giá trị Trạng thái vào radio
                statusElements.forEach((radio) => {
                    if (radio.value === id.Status) {
                        radio.checked = true;
                    }
                });

                const editItemStudent = document.querySelector(
                    ".update-student__new"
                );
                editItemStudent.addEventListener("click", function (e) {
                    e.preventDefault();

                    let isValid = true;
                    // Lấy giá trị và kiểm tra điều kiện của mã SV
                    const masvValue = masv.value.trim();
                    const masvRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,6}$/;
                    if (
                        !masvRegex.test(masvValue) ||
                        !masvValue ||
                        masvValue.length > 6
                    ) {
                        showError(
                            "update-error-student-code",
                            "Tối đa 6 kí tự (có 1 chữ hoa, 1 số)"
                        );
                        isValid = false;
                    } else {
                        hideError("update-error-student-code");
                    }

                    // Lấy giá trị và kiểm tra điều kiện của tên SV
                    const tensvValue = tensv.value.trim();
                    const tensvRegex =
                        /^([A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)(\s[A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)*$/;
                    if (!tensvRegex.test(tensvValue) || !tensvValue) {
                        showError(
                            "update-error-student-name",
                            "Viết hoa chữ cái đầu"
                        );
                        isValid = false;
                    } else {
                        hideError("update-error-student-name");
                    }

                    // Lấy giá trị và kiểm tra điều kiện của year SV
                    const yearValue = year.value.trim();
                    const yearRegex = /^\d+$/;
                    if (
                        !yearRegex.test(yearValue) ||
                        !yearValue ||
                        year.length > 4 ||
                        year.length < 4
                    ) {
                        showError(
                            "update-error-student-year",
                            "Tối đa 4 kí tự chỉ được phép chứa số"
                        );
                        isValid = false;
                    } else {
                        hideError("update-error-student-year");
                    }

                    // Lấy giá trị và kiểm tra điều kiện của address SV
                    const addressValue = address.value.trim();
                    if (!addressValue) {
                        showError(
                            "update-error-student-address",
                            "Không để trống"
                        );
                        isValid = false;
                    } else {
                        hideError("update-error-student-address");
                    }

                    // Lấy giá trị và kiểm tra điều kiện của gender SV
                    const genderElementsValue = document.getElementsByName(
                        "update-student-gender"
                    );

                    // Lấy giá trị và kiểm tra điều kiện của tên lớp học
                    const tenlhValue =
                        document.getElementById("update-student-lh").value;

                    // Lấy giá trị và kiểm tra điều kiện của trạng thái SV
                    const statusElementsValue = document.getElementsByName(
                        "update-student-status"
                    );

                    if (!isValid) {
                        return;
                    }

                    const studentIndex = students.findIndex(
                        (item) => item.id === studentIdEdit
                    );
                    if (studentIndex !== -1) {
                        // Update cho students
                        students[studentIndex].MaSV = masvValue;
                        students[studentIndex].TenSV = tensvValue;
                        students[studentIndex].Year = yearValue;
                        students[studentIndex].Address = addressValue;
                        for (const item of genderElementsValue) {
                            if (item.checked) {
                                if (item.value === "male") {
                                    students[studentIndex].Gender = "Nam";
                                } else if (item.value === "female") {
                                    students[studentIndex].Gender = "Nữ";
                                }
                                break;
                            }
                        }
                        students[studentIndex].TenLH = tenlhValue;
                        for (const item of statusElementsValue) {
                            if (item.checked) {
                                students[studentIndex].Status = item.value;
                                break;
                            }
                        }

                        saveStudents(students);
                        renderStudents(students);

                        // Update cho studentsDefault
                        studentsDefault[studentIndex].MaSV = masvValue;
                        studentsDefault[studentIndex].TenSV = tensvValue;
                        studentsDefault[studentIndex].Year = yearValue;
                        studentsDefault[studentIndex].Address = addressValue;
                        for (const item of genderElementsValue) {
                            if (item.checked) {
                                if (item.value === "male") {
                                    studentsDefault[studentIndex].Gender =
                                        "Nam";
                                } else if (item.value === "female") {
                                    studentsDefault[studentIndex].Gender = "Nữ";
                                }
                                break;
                            }
                        }
                        studentsDefault[studentIndex].TenLH = tenlhValue;
                        for (const item of statusElementsValue) {
                            if (item.checked) {
                                studentsDefault[studentIndex].Status =
                                    item.value;
                                break;
                            }
                        }

                        saveStudentsDefault(studentsDefault);
                        // Tổng số SV tốt nghiệp
                        updateStudentGraduateCount();
                        // Tổng số SV bảo lưu/đình chỉ
                        updateStudentLeaveCount();
                        // Tổng số SV đang hoạt động
                        updateStudentActiveCount();
                        // Tổng số SV chờ
                        updateStudentWaitCount();

                        editOverlay.classList.remove("active");
                    }
                });

                if (checkLogin()) {
                    editOverlay.classList.add("active");
                }
            }
        });
    });
}

// Cancel sủa SV
const cancelEditStudent = document.querySelector(".update-student__cancel");
cancelEditStudent.addEventListener("click", function (e) {
    e.preventDefault();
    hideError("update-error-student-code");
    hideError("update-error-student-name");
    hideError("update-error-student-year");
    hideError("update-error-student-address");

    editOverlay.classList.remove("active");
});

// +++++++++++++++ Xóa student +++++++++++++++
let indexDeleteStudent = null;
let studentIdDeleted = null;
const deleteOverlay = document.getElementById("delete-student-overlay");

// Tắt deleteOverlay class khi ấn bên ngoài nội dung modal
deleteOverlay.addEventListener("click", function (e) {
    e.preventDefault();

    // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
    const deleteTargetOverLay = document.querySelector(".delete-student");
    if (!deleteTargetOverLay.contains(e.target)) {
        deleteOverlay.classList.remove("active");
    }
});

// Ngăn chặn các nhấp chuột bên trong nội dung phương thức
const deleteTargetOverLay = document.querySelector(".delete-student");
deleteTargetOverLay.addEventListener("click", function (e) {
    e.stopPropagation(); // làm deleteTargetOverLay nổi lên trên phần tử cha
});

function deleteEventListeners() {
    const deleteButtons = document.querySelectorAll(".list-student-btn-delete");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            indexDeleteStudent = parseInt(button.getAttribute("data-index"));
            studentIdDeleted = parseInt(button.getAttribute("data-id"));
            showDeleteStudent(studentIdDeleted);

            if (checkLogin()) {
                deleteOverlay.classList.add("active");
            }
        });
    });
}

// Hiển thị thông tin SV muốn xóa
function showDeleteStudent(studentId) {
    const student = students.find((c) => c.id === studentId);
    let _tr = "";
    if (student) {
        _tr = `<td>${indexShowDeleteStudent + indexDeleteStudent}</td>
                <td>${student.MaSV}</td>
                <td>${student.TenSV}</td>
                <td>${student.Year}</td>
                <td>${student.Address}</td>
                <td>${student.Gender}</td>
                <td>${student.Status}</td>
                <td>${student.TenLH}</td>`;
    }
    let _tbody = document.querySelector(".delete-table-tbody-student");
    _tbody.innerHTML = _tr;
}

// Xác nhận xóa SV
const confirmDeleteStudent = document.querySelector(".delete-student-yes");
confirmDeleteStudent.addEventListener("click", function (e) {
    e.preventDefault();
    const id = students.findIndex((student) => {
        if (
            Number(student.id) === Number(studentIdDeleted) &&
            student.Status === "Đình chỉ"
        ) {
            return Number(student.id);
        }
    });
    const idDefault = studentsDefault.findIndex((student) => {
        if (
            Number(student.id) === Number(studentIdDeleted) &&
            student.Status === "Đình chỉ"
        ) {
            return Number(student.id);
        }
    });
    if (id !== -1) {
        // Xóa Item ở mảng students và studentsDefault
        students.splice(id, 1);
        studentsDefault.splice(idDefault, 1);
    }

    currentPage = 1;
    highlightActivePage(currentPage);
    updatePagination(students.length);

    saveStudentsDefault(studentsDefault);
    renderStudents(students);
    saveStudents(students);
    // Tổng số SV tốt nghiệp
    updateStudentGraduateCount();
    // Tổng số SV bảo lưu/đình chỉ
    updateStudentLeaveCount();
    // Tổng số SV đang hoạt động
    updateStudentActiveCount();
    // Tổng số SV chờ
    updateStudentWaitCount();
    // Tổng số SV
    updateStudentCount();

    deleteOverlay.classList.remove("active");
});

const cancelDeleteStudent = document.querySelector(".delete-student-no");
cancelDeleteStudent.addEventListener("click", function (e) {
    e.preventDefault();
    deleteOverlay.classList.remove("active");
});

// +++++++++++++++ Sắp xếp students +++++++++++++++
const sortStudent = document.querySelector(".sort-search-student");
sortStudent.value = "default";

let sortOrder;

function extractAlphaNumericParts(studentName) {
    const parts = studentName.split(" "); // Tách tên theo khoảng trắng và lưu vào mảng parts
    const alpha = parts.join(" "); // Nối tất cả các phần lại thành một chuỗi để so sánh theo thứ tự chữ cái
    const num = parseInt(parts[parts.length - 1], 10); // Cố gắng chuyển đổi phần cuối cùng thành số nguyên
    return {
        alpha: alpha, // Trả về phần chữ cái
        num: isNaN(num) ? null : num, // Kiểm tra nếu số chuyển đổi là NaN, nếu không thì trả về số đó
    };
}

sortStudent.addEventListener("change", function (e) {
    sortOrder = sortStudent.value;
    e.preventDefault();
    if (sortOrder === "asc") {
        console.log("Sorting ascending");
        students.sort((a, b) => {
            const aParts = extractAlphaNumericParts(a.TenSV);
            const bParts = extractAlphaNumericParts(b.TenSV);

            console.log(`Comparing ${a.TenSV} and ${b.TenSV}`);
            console.log(`Parts A:`, aParts);
            console.log(`Parts B:`, bParts);

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
        console.log("Sorting descending");
        students.sort((a, b) => {
            const aParts = extractAlphaNumericParts(a.TenSV);
            const bParts = extractAlphaNumericParts(b.TenSV);

            console.log(`Comparing ${a.TenSV} and ${b.TenSV}`);
            console.log(`Parts A:`, aParts);
            console.log(`Parts B:`, bParts);

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
        renderStudents(studentsDefault);
        saveStudentsDefault(studentsDefault);
        searchStudents();
        return;
    }
    saveStudents(students);
    searchStudents();
    renderStudents(students);
});

// +++++++++++++++ Tìm tiếm Courses +++++++++++++++
const searchInput = document.querySelector(".search__form-input-student");
const searchSelect = document.querySelector(".select-search-student");

// Thêm event listener cho input và select
let filteredStudents = [];

function searchStudents() {
    const searchItem = searchInput.value.trim().toLowerCase();
    const searchCategory = searchSelect.value;

    // Nếu input trống, render tất cả SV
    if (searchItem === "") {
        // Nếu không có tìm kiếm, render tất cả SV
        if (sortOrder === "asc") {
            filteredStudents = []; // reset lại mảng tìm kiếm
            students.sort((a, b) => a.TenSV.localeCompare(b.TenSV));
            renderStudents(students);
            updatePagination(students.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        } else if (sortOrder === "desc") {
            filteredStudents = []; // reset lại mảng tìm kiếm
            students.sort((a, b) => b.TenSV.localeCompare(a.TenSV));
            renderStudents(students);
            updatePagination(students.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        } else if (sortOrder === "default") {
            filteredStudents = []; // reset lại mảng tìm kiếm
            updatePagination(studentsDefault.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
            renderStudents(studentsDefault);
        } else if (searchItem === "") {
            filteredStudents = []; // reset lại mảng tìm kiếm
            renderStudents(studentsDefault);
            updatePagination(students.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        }
        return;
    }

    filteredStudents = studentsDefault.filter((student) => {
        if (!student) return false; // Kiểm tra nếu student là undefined

        switch (searchCategory) {
            case "MaSV":
                return (
                    student.MaSV &&
                    student.MaSV.toString().toLowerCase().includes(searchItem)
                );
            case "TenSV":
                return (
                    student.TenSV &&
                    student.TenSV.toString().toLowerCase().includes(searchItem)
                );
            case "Year":
                return (
                    student.Year &&
                    student.Year.toString().toLowerCase().includes(searchItem)
                );
            case "Address":
                return (
                    student.Address &&
                    student.Address.toString()
                        .toLowerCase()
                        .includes(searchItem)
                );
            case "Gender":
                return (
                    student.Gender &&
                    student.Gender.toString().toLowerCase().includes(searchItem)
                );
            case "Status":
                return (
                    student.Status &&
                    student.Status.toString().toLowerCase().includes(searchItem)
                );
            case "TenLH":
                return (
                    student.TenLH &&
                    student.TenLH.toString().toLowerCase().includes(searchItem)
                );
            default: //Tất cả
                return (
                    student.MaSV.toString()
                        .toLowerCase()
                        .includes(searchItem) ||
                    student.TenSV.toString()
                        .toLowerCase()
                        .includes(searchItem) ||
                    student.Year.toString()
                        .toLowerCase()
                        .includes(searchItem) ||
                    student.Address.toString()
                        .toLowerCase()
                        .includes(searchItem) ||
                    student.Gender.toString()
                        .toLowerCase()
                        .includes(searchItem) ||
                    student.Status.toString()
                        .toLowerCase()
                        .includes(searchItem) ||
                    student.TenLH.toString().toLowerCase().includes(searchItem)
                );
        }
    });
    renderStudents(filteredStudents); // Render danh sách đã lọc
    currentPage = 1; // Đặt lại về trang đầu
    updatePagination(filteredStudents.length);
    highlightActivePage(currentPage);
}

searchInput.addEventListener("input", searchStudents);
searchSelect.addEventListener("change", function (e) {
    e.preventDefault();
    searchInput.value = "";
    searchStudents();
});

// Khi ấn nút reset input thì render ra toàn bộ SV
const resetInput = document.querySelector(".search__form-close-student");
resetInput.addEventListener("click", function (e) {
    e.preventDefault();
    searchInput.value = "";
    filteredStudents = [];

    if (sortOrder === "asc") {
        students.sort((a, b) => a.TenSV.localeCompare(b.TenSV));
        renderStudents(students);
    } else if (sortOrder === "desc") {
        students.sort((a, b) => b.TenLH.localeCompare(a.TenSV));
        renderStudents(students);
    } else if (sortOrder === "default") {
        renderStudents(studentsDefault);
    } else {
        renderStudents(studentsDefault);
    }
});

// +++++++++++++++ Phân Trang +++++++++++++++
function updatePagination(totalStudents) {
    const searchPage = document.getElementById("page-student-search-num");
    const totalPage = Math.ceil(totalStudents / studentsPerPage);

    const paginationContainer = document.querySelector(".page-student-btn");
    paginationContainer.innerHTML = ""; // Clear mọi phần tử trong paginationContainer

    // Không hiển thị phân trang nếu tổng số trang nhỏ hơn 2
    if (totalPage < 2) {
        searchPage.style.display = "none";
    } else {
        searchPage.style.display = "block";

        searchPage.addEventListener("input", function (e) {
            e.preventDefault();
            const page = parseInt(this.value);
            if (page && page > 0 && page <= totalPage) {
                changePage(page);
            }
        });
        // Hiển thi tất cả các trang nếu tổng số trang >=2
        for (let i = 1; i <= totalPage; i++) {
            const button = createPageButton(i);
            paginationContainer.appendChild(button);
        }
        highlightActivePage(currentPage);
    }
}

// Chức năng trợ giúp để tạo các nút trang
function createPageButton(pageNumber) {
    const searchPage = document.getElementById("page-student-search-num");
    const button = document.createElement("button");
    button.className = "page-student-num";
    button.textContent = pageNumber;
    button.dataset.page = pageNumber;
    button.addEventListener("click", () => {
        changePage(pageNumber);
        searchPage.value = "";
    });
    return button;
}

// Hàm chuyển các nút trang dựa trên trang hiện tại
// Chuyển trang
function changePage(page) {
    const totalStudents =
        filteredStudents.length > 0 ? filteredStudents.length : students.length;
    if (page < 1 || page > Math.ceil(totalStudents / studentsPerPage)) return;

    currentPage = page;
    const studentsToRender =
        filteredStudents.length > 0 ? filteredStudents.length : students;
    updatePagination(studentsToRender.length);
    highlightActivePage(currentPage);
    renderStudents(studentsToRender);
}

// active cho từng Page
function highlightActivePage(activePage) {
    const paginationButtons = document.querySelectorAll(".page-student-num");
    paginationButtons.forEach((button) => {
        button.classList.remove("active"); // Xóa student active khỏi tất cả các nút
        if (parseInt(button.dataset.page) === activePage) {
            button.classList.add("active"); // Thêm student active cho nút hiện tại
        }
    });
}
