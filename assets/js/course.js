import { statisticLink, statistic, updateCourseCount } from "./statistic.js";
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

let courses = JSON.parse(localStorage.getItem("courses"))
    ? JSON.parse(localStorage.getItem("courses"))
    : [
          {
              id: 1,
              MaKH: "RA01",
              TenKH: "Khóa Học 1",
              time: 1000,
              status: true,
          },
          {
              id: 2,
              MaKH: "RA02",
              TenKH: "Khóa Học 2",
              time: 2000,
              status: false,
          },
          {
              id: 3,
              MaKH: "RA03",
              TenKH: "Khóa Học 3",
              time: 3000,
              status: false,
          },
          {
              id: 4,
              MaKH: "RA04",
              TenKH: "Khóa Học 4",
              time: 3000,
              status: false,
          },
          {
              id: 5,
              MaKH: "RA05",
              TenKH: "Khóa Học 5",
              time: 3000,
              status: false,
          },
      ];
// Hàm lưu trên local storage courses
function saveCourses(saveCourses) {
    localStorage.setItem("courses", JSON.stringify(saveCourses));
}
saveCourses(courses);

// Sao chép mảng mặc định của coursesDefault
let coursesDefault = JSON.parse(localStorage.getItem("coursesDefault"))
    ? JSON.parse(localStorage.getItem("coursesDefault"))
    : []; // Lưu trên localStrorage

if (coursesDefault.length === 0) {
    coursesDefault = [...courses];
    saveCoursesDefault(coursesDefault);
}
saveCoursesDefault(coursesDefault);

// Hàm lưu trên local storage coursesDefault
function saveCoursesDefault(saveCoursesDefault) {
    localStorage.setItem("coursesDefault", JSON.stringify(saveCoursesDefault));
}

// sao chép tất cả tên khóa học vào nameCourses
let nameCourses = [];

function copyNameCourses(coursesDefault) {
    const uniqueNames = new Set(
        coursesDefault
            .filter((course) => course.status) // Chỉ bao gồm các khóa học có status là true
            .map((course) => course.TenKH)
    );
    nameCourses = Array.from(uniqueNames);
}

// Khởi tạo nameCourses ban đầu
copyNameCourses(coursesDefault);

function getNameCourses() {
    return nameCourses;
}

export { courseLink, course, courses, nameCourses, getNameCourses };

const courseLink = document.getElementById("course__link");
const course = document.querySelector(".course");
const navbarLink = courseLink.querySelector(".navbar__link-course");

// Thêm active khi ấn vào nav-group
document.addEventListener("DOMContentLoaded", function () {
    copyNameCourses(coursesDefault);

    courseLink.addEventListener("click", function (e) {
        e.preventDefault();

        // Ẩn tất cả các phần
        document
            .querySelectorAll(
                ".course, .statistic, .class-section, .student-section, .tk"
            )
            .forEach((section) => {
                section.style.display = "none";
            });

        // Hiện phần khóa học
        course.style.display = "block";
        courseLink.classList.add("active");

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
        courseLink.classList.add("active");
    });
});

// Lấy id
let _id = 0;
if (courses.length > 0) {
    for (const item of courses) {
        if (item.id > _id) _id = item.id;
    }
}

// ++++++++++++++ Render Item Courses ++++++++++++++
// Vị trí cần hiện lên khi xóa
let indexShowDeleteCourse = null;
// Trang hiện tại và số phần tử mỗi trang
let currentPage = 1;
const coursesPerPage = 5;
function renderCourses(itemCourses) {
    const startIndex = (currentPage - 1) * coursesPerPage;
    indexShowDeleteCourse = startIndex;
    const endIndex = startIndex + coursesPerPage;
    const coursesToRender = itemCourses.slice(startIndex, endIndex);

    let _tr = "";
    coursesToRender.forEach((item, index) => {
        _tr += `<tr class="list-course-info">
                    <td>${startIndex + index + 1}</td>
                    <td class="course-info-MaKH">${item.MaKH}</td>
                    <td class="course-info-TenKH list-info-td">${
                        item.TenKH
                    }</td>
                    <td class="course-info-Time">${item.time}</td>
                    <td>${item.status ? "Hoạt động" : "Không hoạt động"}</td>
                    <td>
                        <div class="list-course-btn">
                            <button
                                class="list-course-btn-edit"
                                data-id=${item.id}
                                data-index=${index + 1}
                            >
                                Sửa
                            </button>
                            <button
                                class="list-course-btn-delete"
                                data-id=${item.id}
                                data-index=${index + 1}
                                style="display: ${
                                    !item.status ? "inline-block" : "none"
                                }"
                            >
                                Xóa
                            </button>
                        </div>
                    </td>
                </tr>`;
    });
    let _tbody = document.getElementById("list-course-content");
    _tbody.innerHTML = _tr;
    // Xóa course
    deleteEventListeners();
    // Sửa course
    editEventListener();
    // Phân trang
    updatePagination(itemCourses.length);
}

renderCourses(courses);

// Hàm reset content khi tắt add-course overlay
function resetStringInput() {
    const status = document.getElementsByName("course-status");
    document.getElementById("course-code").value = "";
    document.getElementById("course-name").value = "";
    document.getElementById("course-time").value = "";

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

const courseCodeInput = document.getElementById("course-code");
const courseNameInput = document.getElementById("course-name");
const courseTimeInput = document.getElementById("course-time");
const courseStatusInput = document.querySelectorAll(".course-status");

courseCodeInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-course-code");
});

courseNameInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-course-name");
});

courseTimeInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-course-time");
});

courseStatusInput.forEach((input) => {
    input.addEventListener("input", function (e) {
        e.preventDefault();
        if (input.checked) {
            hideError("error-course-status");
        }
    });
});

// +++++++++++++++ Thêm course +++++++++++++++
// Mở addCourse và thêm course
const openAddCourse = document.querySelector(".course-add__inner");
const addOverLay = document.getElementById("add-overlay");
const closeModal = document.querySelector(".add-course__close");
const cancelBtn = document.querySelector(".add-course__cancel");
document.addEventListener("DOMContentLoaded", function () {
    // Mở add overLay course
    openAddCourse.addEventListener("click", function (e) {
        e.preventDefault();
        if (checkLogin()) {
            addOverLay.classList.add("active");
        }
    });
    // Tắt add overLay course khi ấn nút đóng
    closeModal.addEventListener("click", function (e) {
        e.preventDefault();
        addOverLay.classList.remove("active");
        hideError("error-course-code");
        hideError("error-course-name");
        hideError("error-course-time");
        hideError("error-course-status");
        resetStringInput();
    });
    // Tắt add overLay course khi ấn nút hủy
    cancelBtn.addEventListener("click", function (e) {
        e.preventDefault();
        addOverLay.classList.remove("active");
        hideError("error-course-code");
        hideError("error-course-name");
        hideError("error-course-time");
        hideError("error-course-status");
        resetStringInput();
    });
    // Tắt addOverLay class khi ấn bên ngoài nội dung modal
    addOverLay.addEventListener("click", function (e) {
        e.preventDefault();

        // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
        const addTargetOverLay = document.querySelector(".add-course");
        if (!addTargetOverLay.contains(e.target)) {
            addOverLay.classList.remove("active");
            hideError("error-course-code");
            hideError("error-course-name");
            hideError("error-course-time");
            hideError("error-course-status");
            resetStringInput();
        }
    });

    // Ngăn chặn các nhấp chuột bên trong nội dung phương thức
    const addTargetOverLay = document.querySelector(".add-course");
    addTargetOverLay.addEventListener("click", function (e) {
        e.stopPropagation(); // làm addTargetOverLay nổi lên trên phần tử cha
    });
});

const addItemCourse = document.querySelector(".add-course__new");
addItemCourse.addEventListener("click", function (e) {
    e.preventDefault();
    const makh = document.getElementById("course-code").value.trim();
    const tenkh = document.getElementById("course-name").value.trim();
    const time = document.getElementById("course-time").value.trim();
    const status = document.getElementsByName("course-status");
    let valueStatus;
    for (const item of status) {
        if (item.checked) {
            valueStatus = parseInt(item.value);
            break;
        }
    }

    let isValid = true;
    // Kiểm tra điều kiện của mã khóa học bằng regex
    const makhRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,6}$/;
    if (!makhRegex.test(makh) || makh.length > 6 || !makh) {
        showError("error-course-code", "Tối đa 6 kí tự (có 1 chữ hoa, 1 số)");
        isValid = false;
    } else {
        hideError("error-course-code");
    }

    // Kiểm tra điều kiện của tên khóa học

    const tenkhRegex =
        /^([A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)(\s[A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)*(\s*\d*)$/;
    if (!tenkhRegex.test(tenkh) || !tenkh) {
        showError(
            "error-course-name",
            "Viết hoa chữ cái đầu mỗi từ, có thể ghi số"
        );
        isValid = false;
    } else {
        hideError("error-course-name");
    }

    // Kiểm tra điều kiện của thời gian khóa học
    const timeRegex = /^\d+$/;
    if (!timeRegex.test(time) || time.length > 6 || !time) {
        showError("error-course-time", "Tối đa 6 kí tự chỉ được phép chứa số");
        isValid = false;
    } else {
        hideError("error-course-time");
    }

    // Kiểm tra điều kiện của trạng thái khóa học
    if (valueStatus === undefined) {
        showError("error-course-status", "Vui lòng chọn trạng thái khóa học!");
        isValid = false;
    } else {
        hideError("error-course-status");
    }

    if (!isValid) {
        return;
    }
    // Thêm vào mảng Courses
    courses.push({
        id: ++_id,
        MaKH: makh,
        TenKH: tenkh,
        time: time,
        status: valueStatus,
    });
    // Thêm vào mảng sao chép CoursesDefault
    coursesDefault.push({
        id: _id,
        MaKH: makh,
        TenKH: tenkh,
        time: time,
        status: valueStatus,
    });

    // Cập nhật phân trang và hiện trang cuối cùng
    currentPage = Math.ceil(courses.length / coursesPerPage); // coursesPerPage là số khóa học trên mỗi trang
    updatePagination(courses.length);
    highlightActivePage(currentPage);

    saveCoursesDefault(coursesDefault);
    // Copy tên khóa học
    copyNameCourses(coursesDefault);
    saveCourses(courses);
    renderCourses(courses);
    // Tổng số khóa học
    updateCourseCount();
    resetStringInput();
});

// +++++++++++++++ Sửa Courses +++++++++++++++
let courseIdEdit = null;
const editOverlay = document.getElementById("update-overlay");

// Tắt editOverlay class khi ấn bên ngoài nội dung modal
editOverlay.addEventListener("click", function (e) {
    e.preventDefault();

    // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
    const updateTargetOverLay = document.querySelector(".update-course");
    if (!updateTargetOverLay.contains(e.target)) {
        editOverlay.classList.remove("active");
        hideError("update-error-course-code");
        hideError("update-error-course-name");
        hideError("update-error-course-time");
        hideError("update-error-course-status");
    }
});

// Ngăn chặn các nhấp chuột bên trong nội dung phương thức
const updateTargetOverLay = document.querySelector(".update-course");
updateTargetOverLay.addEventListener("click", function (e) {
    e.stopPropagation(); // làm updateTargetOverLay nổi lên trên phần tử cha
});

const updateCodeInput = document.getElementById("update-course-code");
const updateNameInput = document.getElementById("update-course-name");
const updateTimeInput = document.getElementById("update-course-time");
const updateStatusInput = document.querySelectorAll(".update-course-status");

// // Tắt edit overLay course khi ấn bên ngoài nội dung modal
// editOverlay.addEventListener("click", function (e) {
//     e.preventDefault();
//     if (e.target === editOverlay) {
//         editOverlay.classList.remove("active");
//     }
// });

updateCodeInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("update-error-course-code");
});

updateNameInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("update-error-course-name");
});

updateTimeInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("update-error-course-time");
});

updateStatusInput.forEach((input) => {
    input.addEventListener("input", function (e) {
        e.preventDefault();
        if (input.checked) {
            hideError("update-error-course-status");
        }
    });
});

function editEventListener() {
    const editButtons = document.querySelectorAll(".list-course-btn-edit");
    editButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            courseIdEdit = parseInt(button.getAttribute("data-id"));

            let makh = document.getElementById("update-course-code");
            let tenkh = document.getElementById("update-course-name");
            let time = document.getElementById("update-course-time");
            let statusActive = document.getElementById("update-course__active");
            let statusInactive = document.getElementById(
                "update-course__inactive"
            );
            // Lấy dữ liệu từ id đã chọn sửa
            const id = courses.find((item) => item.id === courseIdEdit);
            if (id) {
                makh.value = id.MaKH;
                tenkh.value = id.TenKH;
                time.value = Number(id.time);
                if (id.status) {
                    statusActive.checked = true;
                } else {
                    statusInactive.checked = true;
                }
            }

            const editItemCourse = document.querySelector(
                ".update-course__new"
            );

            editItemCourse.addEventListener("click", function (e) {
                e.preventDefault();

                let isValid = true;
                // Lấy giá trị và kiểm tra điều kiện của mã khóa học
                const makhValue = makh.value.trim();
                console.log("MaKH Value:", makhValue); // Debug value
                const makhRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,6}$/;
                if (
                    !makhRegex.test(makhValue) ||
                    makhValue.length > 6 ||
                    !makhValue
                ) {
                    showError(
                        "update-error-course-code",
                        "Tối đa 6 kí tự (có 1 chữ hoa, 1 số)"
                    );
                    isValid = false;
                } else {
                    hideError("update-error-course-code");
                }

                // Lấy giá trị và kiểm tra điều kiện của tên khóa học
                const tenkhValue = tenkh.value.trim();
                console.log("TenKH Value:", tenkhValue); // Debug value
                const tenkhRegex =
                    /^([A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)(\s[A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)*(\s*\d*)$/;
                if (!tenkhRegex.test(tenkhValue) || !tenkhValue) {
                    showError(
                        "update-error-course-name",
                        "Viết hoa chữ cái đầu mỗi từ"
                    );
                    isValid = false;
                } else {
                    hideError("update-error-course-name");
                }

                // Lấy giá trị và kiểm tra điều kiện của thời gian khóa học
                const timeValue = time.value.trim();
                console.log("Time Value:", timeValue); // Debug value
                const timeRegex = /^\d+$/;
                if (!timeRegex.test(timeValue) || timeValue.length > 6) {
                    showError(
                        "update-error-course-time",
                        "Tối đa 6 kí tự chỉ được phép chứa số"
                    );
                    isValid = false;
                } else {
                    hideError("update-error-course-time");
                }

                // Kiểm tra trạng thái khóa học
                if (!statusActive.checked && !statusInactive.checked) {
                    showError(
                        "update-error-course-status",
                        "Vui lòng chọn trạng thái khóa học!"
                    );
                    isValid = false;
                } else {
                    hideError("update-error-course-status");
                }

                if (!isValid) {
                    return;
                }

                const courseIndex = courses.findIndex(
                    (item) => item.id === courseIdEdit
                );
                if (courseIndex !== -1) {
                    // Update cho courses
                    courses[courseIndex].MaKH = makhValue;
                    courses[courseIndex].TenKH = tenkhValue;
                    courses[courseIndex].time = parseInt(timeValue);
                    courses[courseIndex].status = statusActive.checked;

                    saveCourses(courses);
                    renderCourses(courses);
                    // Update cho coursesDefault
                    coursesDefault[courseIndex].MaKH = makhValue;
                    coursesDefault[courseIndex].TenKH = tenkhValue;
                    coursesDefault[courseIndex].time = parseInt(timeValue);
                    coursesDefault[courseIndex].status = statusActive.checked;
                    saveCoursesDefault(coursesDefault);
                    copyNameCourses(coursesDefault);

                    editOverlay.classList.remove("active");
                }
            });
            if (checkLogin()) {
                editOverlay.classList.add("active");
            }
        });
    });
}

// Cancel sửa khóa học
const cancelEditCourse = document.querySelector(".update-course__cancel");
cancelEditCourse.addEventListener("click", function (e) {
    e.preventDefault();
    hideError("update-error-course-code");
    hideError("update-error-course-name");
    hideError("update-error-course-time");
    hideError("update-error-course-status");
    editOverlay.classList.remove("active");
});

// +++++++++++++++ Xóa course +++++++++++++++
let indexDeleteCourse = null;
let courseIdDeleted = null;
const deleteOverlay = document.getElementById("delete-overlay");

// Tắt deleteOverlay class khi ấn bên ngoài nội dung modal
deleteOverlay.addEventListener("click", function (e) {
    e.preventDefault();

    // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
    const deleteTargetOverLay = document.querySelector(".delete-course");
    if (!deleteTargetOverLay.contains(e.target)) {
        deleteOverlay.classList.remove("active");
    }
});

// Ngăn chặn các nhấp chuột bên trong nội dung phương thức
const deleteTargetOverLay = document.querySelector(".delete-course");
deleteTargetOverLay.addEventListener("click", function (e) {
    e.stopPropagation(); // làm deleteTargetOverLay nổi lên trên phần tử cha
});

// // Tắt xóa overLay course khi ấn bên ngoài nội dung modal
// deleteOverlay.addEventListener("click", function (e) {
//     e.preventDefault();
//     if (e.target === deleteOverlay) {
//         deleteOverlay.classList.remove("active");
//     }
// });

function deleteEventListeners() {
    const deleteButtons = document.querySelectorAll(".list-course-btn-delete");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            indexDeleteCourse = parseInt(button.getAttribute("data-index"));
            courseIdDeleted = parseInt(button.getAttribute("data-id"));
            showDeleteCourse(courseIdDeleted);

            if (checkLogin()) {
                deleteOverlay.classList.add("active");
            }
        });
    });
}

// Hiển thị thông tin khóa học muốn xóa
function showDeleteCourse(courseId) {
    const course = courses.find((c) => c.id === courseId);
    let _tr = "";
    if (course) {
        _tr = `<td>${indexShowDeleteCourse + indexDeleteCourse}</td>
                <td>${course.MaKH}</td>
                <td>${course.TenKH}</td>
                <td>${course.time}</td>
                <td>${course.status ? "Hoạt động" : "Không hoạt động"}</td>`;
    }
    let _tbody = document.querySelector(".delete-table-tbody");
    _tbody.innerHTML = _tr;
}

// Xác nhận xóa khóa học
const confirmDeleteCourse = document.querySelector(".delete-course-yes");
confirmDeleteCourse.addEventListener("click", function (e) {
    e.preventDefault();
    const id = courses.findIndex((course) => {
        if (Number(course.id) === Number(courseIdDeleted) && !course.status)
            return Number(course.id);
    });
    const idDefault = coursesDefault.findIndex((course) => {
        if (Number(course.id) === Number(courseIdDeleted) && !course.status)
            return Number(course.id);
    });
    console.log(id);
    if (id !== -1) {
        // Xóa Item ở mảng Courses và CoursesDefault
        courses.splice(id, 1);
        coursesDefault.splice(idDefault, 1);
    }

    // coursesDefault = coursesDefault.filter((item) => courses.includes(item));
    currentPage = 1;
    highlightActivePage(currentPage);
    updatePagination(courses.length);

    saveCoursesDefault(coursesDefault);
    copyNameCourses(coursesDefault);
    renderCourses(courses);
    saveCourses(courses);
    // Tổng số khóa học
    updateCourseCount();

    console.log(courses);
    deleteOverlay.classList.remove("active");
});

// Xác nhận hủy xóa khóa học
const cancelDeleteCourse = document.querySelector(".delete-course-no");
cancelDeleteCourse.addEventListener("click", function (e) {
    e.preventDefault();
    deleteOverlay.classList.remove("active");
});

// +++++++++++++++ Sắp xếp courses +++++++++++++++
const sortCourse = document.querySelector(".sort-search-course");
sortCourse.value = "default";

let sortOrder;

function extractAlphaNumericParts(courseName) {
    const alphaPart = courseName.match(/[a-zA-Z]+/);
    const numPart = courseName.match(/\d+/);
    return {
        alpha: alphaPart ? alphaPart[0] : "",
        num: numPart ? parseInt(numPart[0], 10) : null,
    };
}

sortCourse.addEventListener("change", function (e) {
    sortOrder = sortCourse.value;
    e.preventDefault();
    if (sortOrder === "asc") {
        courses.sort((a, b) => {
            const aParts = extractAlphaNumericParts(a.TenKH);
            const bParts = extractAlphaNumericParts(b.TenKH);

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
        courses.sort((a, b) => {
            const aParts = extractAlphaNumericParts(a.TenKH);
            const bParts = extractAlphaNumericParts(b.TenKH);

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
        renderCourses(coursesDefault);
        saveCoursesDefault(coursesDefault);
        searchCourses();
        console.log("Default");
        return;
    }
    saveCourses(courses);
    searchCourses();
    renderCourses(courses);
});

// +++++++++++++++ Tìm tiếm Courses +++++++++++++++
const searchInput = document.querySelector(".search__form-input");
const searchSelect = document.querySelector(".select-search-course");

// Thêm event listener cho input và select
let filteredCourses = [];

function searchCourses() {
    const searchItem = searchInput.value.trim().toLowerCase();
    const searchCategory = searchSelect.value;

    // Nếu input trống, render tất cả khóa học
    if (searchItem === "") {
        // Nếu không có tìm kiếm, render tất cả khóa học
        if (sortOrder === "asc") {
            filteredCourses = []; // reset lại mảng tìm kiếm
            courses.sort((a, b) => a.TenKH.localeCompare(b.TenKH));
            renderCourses(courses);
            updatePagination(courses.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        } else if (sortOrder === "desc") {
            filteredCourses = []; // reset lại mảng tìm kiếm
            courses.sort((a, b) => b.TenKH.localeCompare(a.TenKH));
            renderCourses(courses);
            updatePagination(courses.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        } else if (sortOrder === "default") {
            filteredCourses = []; // reset lại mảng tìm kiếm
            renderCourses(coursesDefault);
            console.log(coursesDefault);
            currentPage = 1; // Đặt lại về trang đầu
            updatePagination(coursesDefault.length);
            highlightActivePage(currentPage);
        } else if (searchItem === "") {
            filteredCourses = []; // reset lại mảng tìm kiếm
            renderCourses(coursesDefault);
            console.log(coursesDefault);
            currentPage = 1; // Đặt lại về trang đầu
            updatePagination(coursesDefault.length);
            highlightActivePage(currentPage);
        }
        return;
    }

    filteredCourses = coursesDefault.filter((course) => {
        if (!course) return false; // Kiểm tra nếu course là undefined

        switch (searchCategory) {
            case "MaKH":
                return (
                    course.MaKH &&
                    course.MaKH.toString().toLowerCase().includes(searchItem)
                );
            case "TenKH":
                return (
                    course.TenKH &&
                    course.TenKH.toLowerCase().includes(searchItem)
                );
            case "time":
                return (
                    course.time && course.time.toString().includes(searchItem)
                );
            case "status":
                return (
                    ("true".includes(searchItem) && course.status) ||
                    ("false".includes(searchItem) && !course.status)
                );
            default: // Tất cả
                return (
                    course.MaKH.toLowerCase().includes(searchItem) ||
                    course.TenKH.toLowerCase().includes(searchItem) ||
                    course.time.toString().includes(searchItem) ||
                    (searchItem === "hoạt động" && course.status) ||
                    (searchItem === "không hoạt động" && !course.status)
                );
        }
    });

    renderCourses(filteredCourses); // Render danh sách đã lọc
    console.log(filteredCourses);
    currentPage = 1; // Đặt lại trang về 1
    updatePagination(filteredCourses.length); // Cập nhật phân trang
    highlightActivePage(currentPage); // Highlight trang đầu tiên
}

searchInput.addEventListener("input", searchCourses);
searchSelect.addEventListener("change", function (e) {
    e.preventDefault();
    searchInput.value = "";
    if (searchSelect.value === "status")
        searchInput.placeholder = "Nhập true hoặc false";
    else searchInput.placeholder = "Tìm kiếm";
    searchCourses();
});

// Khi ấn nút reset input thì sẽ render ra toàn bộ courses
const resetInput = document.querySelector(".search__form-close");
resetInput.addEventListener("click", function (e) {
    e.preventDefault();
    searchInput.value = "";
    filteredCourses = [];

    if (sortOrder === "asc") {
        courses.sort((a, b) => a.TenKH.localeCompare(b.TenKH));
        renderCourses(courses);
    } else if (sortOrder === "desc") {
        courses.sort((a, b) => b.TenKH.localeCompare(a.TenKH));
        renderCourses(courses);
    } else if (sortOrder === "default") {
        renderCourses(coursesDefault);
    } else {
        renderCourses(coursesDefault);
    }

    console.log(courses);
});

// +++++++++++++++ Phân Trang +++++++++++++++
function updatePagination(totalCourses) {
    const searchPage = document.getElementById("page-course-search-num");
    const totalPage = Math.ceil(totalCourses / coursesPerPage);

    const paginationContainer = document.querySelector(".page-course-btn");

    paginationContainer.innerHTML = "";

    // Không hiển thị phân trang nếu tổng số trang nhỏ hơn 2
    if (totalPage < 2) {
        searchPage.style.display = "none";
        return;
    } else {
        searchPage.style.display = "block";
        document;

        searchPage.addEventListener("input", function (e) {
            e.preventDefault();
            const page = parseInt(this.value);
            console.log(page);
            console.log("total", totalPage);
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
    const searchPage = document.getElementById("page-course-search-num");
    const button = document.createElement("button");
    button.className = "page-course-num";
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
    const totalCourses =
        filteredCourses.length > 0 ? filteredCourses.length : courses.length;
    console.log(Math.ceil(totalCourses / coursesPerPage));
    if (page < 1 || page > Math.ceil(totalCourses / coursesPerPage)) return; // Không cho phép sang trang không hợp lệ

    currentPage = page;
    const coursesToRender =
        filteredCourses.length > 0 ? filteredCourses : courses;
    updatePagination(coursesToRender.length);
    highlightActivePage(currentPage);
    renderCourses(coursesToRender);
}

// active cho từng Page
function highlightActivePage(activePage) {
    const paginationButtons = document.querySelectorAll(".page-course-num");
    paginationButtons.forEach((button) => {
        button.classList.remove("active"); // Xóa class active khỏi tất cả các nút
        if (parseInt(button.dataset.page) === activePage) {
            button.classList.add("active"); // Thêm class active cho nút hiện tại
        }
    });
}
