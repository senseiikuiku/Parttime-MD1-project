import { courseLink, course, courses } from "./course.js";
import { classes } from "./class.js";
import { student, students } from "./student.js";

const statisticLink = document.getElementById("statistic__link");
const statistic = document.querySelector(".statistic");
const navbarLink = statisticLink.querySelector(".navbar__link-statistic");

export {
    statisticLink,
    statistic,
    updateCourseCount,
    updateClassCount,
    updateClassActiveCount,
    updateClassFinishCount,
    updateClassWaitCount,
    updateStudentCount,
    updateStudentWaitCount,
    updateStudentActiveCount,
    updateStudentLeaveCount,
    updateStudentGraduateCount,
};

document.addEventListener("DOMContentLoaded", function () {
    statistic.style.display = "block";
    statisticLink.classList.add("active");
    navbarLink.classList.add("active");
    statisticLink.addEventListener("click", function (e) {
        e.preventDefault();

        // Ẩn tất cả các phần
        document
            .querySelectorAll(
                ".course, .statistic, .class-section, .student-section, .tk"
            )
            .forEach((section) => {
                section.style.display = "none";
            });

        // Hiện phần thống kê
        statistic.style.display = "block";

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
        //  Thêm class active cho liên kết hiện tại
        statisticLink.classList.add("active");
    });

    // Tổng số khóa học
    updateCourseCount();

    // Tổng số lớp học
    updateClassCount();

    // Tổng số lớp đang hoạt động
    updateClassActiveCount();

    // Tổng số lớp đã kết thúc
    updateClassFinishCount();

    // Tổng số lớp đang chờ
    updateClassWaitCount();

    // Tổng số SV
    updateStudentCount();

    // Tổng số SV chờ
    updateStudentWaitCount();

    // Tổng số SV đang hoạt động
    updateStudentActiveCount();

    // Tổng số SV bảo lưu/đình chỉ
    updateStudentLeaveCount();

    // Tổng số SV tốt nghiệp
    updateStudentGraduateCount();
});

// Hàm cập nhật số khóa học
function updateCourseCount() {
    const numCourse = document.querySelector(".num-course");
    numCourse.textContent = courses.length;
}

// Hàm cập nhật số lớp học
function updateClassCount() {
    const numClass = document.querySelector(".num-class");
    numClass.textContent = classes.length;
}

// Hàm cập nhật số lớp đang hoạt động
function updateClassActiveCount() {
    const numClassActive = document.querySelector(".num-class-active");
    const activeClasses = classes.filter(
        (_class) => _class.Status === "Hoạt động"
    );
    numClassActive.textContent = activeClasses.length;
}

// Hàm cập nhật số lớp đã kết thúc
function updateClassFinishCount() {
    const numClassFinish = document.querySelector(".num-class-finish");
    const finishClasses = classes.filter(
        (_class) => _class.Status === "Kết thúc"
    );
    numClassFinish.textContent = finishClasses.length;
}

// Hàm cập nhật số lớp đang chờ
function updateClassWaitCount() {
    const numClassWait = document.querySelector(".num-class-wait");
    const waitClasses = classes.filter((_class) => _class.Status === "Chờ lớp");
    numClassWait.textContent = waitClasses.length;
}

// Hàm cập nhật số SV
function updateStudentCount() {
    const numStudent = document.querySelector(".num-student");
    numStudent.textContent = students.length;
}

// Hàm cập nhật số SV chờ
function updateStudentWaitCount() {
    const numStudentWait = document.querySelector(".num-student-wait");
    const waitStudents = students.filter(
        (student) => student.Status === "Chờ lớp"
    );
    numStudentWait.textContent = waitStudents.length;
}

// Hàm cập nhật số SV đang hoạt động
function updateStudentActiveCount() {
    const numStudentActive = document.querySelector(".num-student-active");
    const activeStudents = students.filter(
        (student) => student.Status === "Đang học"
    );
    numStudentActive.textContent = activeStudents.length;
}

// Hàm cập nhật số SV bảo lưu/đình chỉ
function updateStudentLeaveCount() {
    const numStudentLeave = document.querySelector(".num-student-leave");
    const leaveStudent = students.filter(
        (student) =>
            student.Status === "Đình chỉ" || student.Status === "Bảo lưu"
    );
    numStudentLeave.textContent = leaveStudent.length;
}

// Hàm cập nhật số SV tốt nghiệp
function updateStudentGraduateCount() {
    const numStudentGraduate = document.querySelector(".num-student-graduate");
    const graduateStudents = students.filter(
        (student) => student.Status === "Tốt nghiệp"
    );
    numStudentGraduate.textContent = graduateStudents.length;
}
