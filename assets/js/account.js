let accounts = JSON.parse(localStorage.getItem("accounts"))
    ? JSON.parse(localStorage.getItem("accounts"))
    : [
          {
              id: 1,
              Email: "dduc1171@gmail.com",
              Password: 123456,
              Name: "Nguyễn Văn A",
              Status: "Hoạt động",
          },
          {
              id: 2,
              Email: "meo1171@gmail.com",
              Password: 156456,
              Name: "Nguyễn Văn b",
              Status: "Hoạt động",
          },
          {
              id: 3,
              Email: "dduc3373@gmail.com",
              Password: 323456,
              Name: "Nguyễn Văn A",
              Status: "Không hoạt động",
          },
          {
              id: 4,
              Email: "dduc4474@gmail.com",
              Password: 423456,
              Name: "Nguyễn Văn A",
              Status: "Không hoạt động",
          },
          {
              id: 5,
              Email: "dduc5575@gmail.com",
              Password: 523456,
              Name: "Nguyễn Văn A",
              Status: "Hoạt động",
          },
      ];

// Hàm lưu trên local storage accounts
function saveAccounts(saveAccounts) {
    localStorage.setItem("accounts", JSON.stringify(saveAccounts));
}
saveAccounts(accounts);

// Sao chép mảng mặc định của accounts
let accountsDefault = JSON.parse(localStorage.getItem("accountsDefault"))
    ? JSON.parse(localStorage.getItem("accountsDefault"))
    : []; // Lưu trên localStorage

if (accountsDefault.length === 0) {
    accountsDefault = [...accounts];
    saveAccountsDefault(accountsDefault);
}
saveAccountsDefault(accountsDefault);

// Hàm lưu trên local storage accountsDefault
function saveAccountsDefault(saveAccountsDefault) {
    localStorage.setItem(
        "accountsDefault",
        JSON.stringify(saveAccountsDefault)
    );
}

const tkLink = document.getElementById("tk__link");
const tk = document.querySelector(".tk");
const navbarLink = document.querySelector(".navbar__link-tk");

export {
    tkLink,
    tk,
    isLoggedIn,
    loginOverlay,
    loginIcon,
    loginPasswordInput,
    loginEmailInput,
};

// Thêm active khi ấn vòa nav-group
document.addEventListener("DOMContentLoaded", function () {
    tkLink.addEventListener("click", function (e) {
        e.preventDefault();

        // Ẩn tất cả các phần
        document
            .querySelectorAll(
                ".course, .statistic, .class-section, .student-section, .tk"
            )
            .forEach((section) => {
                section.style.display = "none";
            });

        // Hiện phần TK
        tk.style.display = "block";
        tkLink.classList.add("active");

        // Xóa active của tất cả navbar__link
        document.querySelectorAll(".navbar__link").forEach((link) => {
            link.classList.remove("active");
        });
        // Thêm tk active cho liên kết hiện tại
        navbarLink.classList.add("active");

        // Xóa active của tất cả nav-group
        document.querySelectorAll(".nav-group").forEach((link) => {
            link.classList.remove("active");
        });
        // Thêm tk active cho liên kết hiện tại
        tkLink.classList.add("active");
    });
});

// Lấy id
let _id = 0;
if (accounts.length > 0) {
    for (const item of accounts) {
        if (item.id > _id) _id = item.id;
    }
}

// ++++++++++++++ Render Item Classes ++++++++++++++
// Vị trí cần hiện lên khi xóa, khóa, mở khóa
let indexShowDeleteAccount = null;
let indexShowBlockAccount = null;
let indexShowOpenBlockAccount = null;
// Trang hiện tại và số phần tử mỗi trang
let currentPage = 1;
const accountsPerPage = 5;
function renderAccounts(itemAccounts) {
    const startIndex = (currentPage - 1) * accountsPerPage;

    indexShowDeleteAccount = startIndex;
    indexShowBlockAccount = startIndex;
    indexShowOpenBlockAccount = startIndex;

    const endIdex = startIndex + accountsPerPage;
    const accountsToRender = itemAccounts.slice(startIndex, endIdex);

    let _tr = "";
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    const loggedInEmail = loginInfo ? loginInfo.email : "";
    const loggedInPassword = loginInfo ? loginInfo.password : "";

    accountsToRender.forEach((item, index) => {
        const isLoggedInAccount =
            item.Email === loggedInEmail && item.Password === loggedInPassword;
        console.log(isLoggedInAccount);
        _tr += `<tr class="list-tk-info">
                        <td>${startIndex + index + 1}</td>
                        <td class="list-info-td">
                            ${item.Email}
                        </td>
                        <td>
                            <span class="hide-password-account">
                                ${item.Password}
                            </span>
                        </td>
                        <td class="list-info-td">${item.Name}</td>
                        <td>${item.Status}</td>
                        <td>
                            <div class="list-tk-btn">
                                <button
                                    class="list-tk-btn-open-block"
                                    data-id=${item.id}
                                    data-index=${index + 1}
                                    style="display: ${
                                        item.Status === "Không hoạt động"
                                            ? "inline-block"
                                            : "none"
                                    }"
                                >
                                    Mở khóa
                                </button>
                                <button
                                    class="list-tk-btn-delete"
                                    data-id=${item.id}
                                    data-index=${index + 1}
                                    style="display: ${
                                        item.Status === "Không hoạt động"
                                            ? "inline-block"
                                            : "none"
                                    }"
                                >
                                    Xóa
                                </button>
                                <button
                                    class="list-tk-btn-block"
                                    data-id=${item.id}
                                    data-index=${index + 1}
                                    style="display: ${
                                        item.Status === "Hoạt động"
                                            ? "inline-block"
                                            : "none"
                                    };"
                                    ${isLoggedInAccount ? "disabled" : ""}
                                >
                                    ${
                                        isLoggedInAccount
                                            ? "Đang đăng nhập"
                                            : "Khóa"
                                    }
                                </button>
                            </div>
                        </td>
                    </tr>`;
    });
    let _tbody = document.getElementById("list-tk-content");
    _tbody.innerHTML = _tr;
    // Xóa account
    deleteEventListener();
    // Mở khóa account
    openBlockEventListener();
    // Khóa account
    blockEventListener();
    // Phân trang
    updatePagination(itemAccounts.length);
}
renderAccounts(accounts);

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

// ++++++++++++++++++++++++++ Đăng nhập, đăng xuất TK ++++++++++++++++++++++++++++++++

// Định nghĩa biến isLoggedIn Lưu trên localStorage
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
// Kiểm tra đã đăng nhập chưa
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

const loginIcon = document.querySelector(".fa-user");
const logoutIcon = document.querySelector(".fa-right-to-bracket");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");

const loginOverlay = document.getElementById("log-in-overlay");
const loginClose = document.querySelector(".login__close");
const loginCancel = document.querySelector(".login__cancel");
const loginSubmit = document.querySelector(".login__account");

// Đăng Nhập
// Hiển thị overlay khi nhấp vào biểu tượng đăng nhập
loginIcon.addEventListener("click", function (e) {
    e.preventDefault();
    loginOverlay.classList.add("active");
    loginEmailInput.value = "";
    loginPasswordInput.value = "";
    // Nút ẩn hiện pass luôn none
    loginShowHideNone();
});

loginEmailInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-login-email");
});

loginPasswordInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-login-password");
});

// Hàm mặc đinh nút ẩn hiện pass luôn none
function loginShowHideNone() {
    const showPass = document.getElementById("login-password-eye");
    const hidePass = document.getElementById("login-password-hide-eye");
    showPass.style.display = "none";
    hidePass.style.display = "none";
}

// Hàm ẩn hiện Password có thể tái sử dụng
function setupPasswordToggle(passwordInputId, showPassId, hidePassId) {
    const loginPasswordInput = document.getElementById(passwordInputId);
    const showPass = document.getElementById(showPassId);
    const hidePass = document.getElementById(hidePassId);

    function togglePasswordVisibility() {
        if (loginPasswordInput.value.trim() && loginPasswordInput.value) {
            showPass.style.display = "inline-block";
            loginPasswordInput.setAttribute("type", "password");
            hidePass.style.display = "none";
        } else {
            showPass.style.display = "none";
            hidePass.style.display = "none";
            loginPasswordInput.setAttribute("type", "password");
        }
    }

    loginPasswordInput.addEventListener("input", togglePasswordVisibility);

    showPass.addEventListener("click", function (e) {
        e.preventDefault();
        loginPasswordInput.setAttribute("type", "text");
        showPass.style.display = "none";
        hidePass.style.display = "inline-block";
    });

    hidePass.addEventListener("click", function (e) {
        e.preventDefault();
        loginPasswordInput.setAttribute("type", "password");
        hidePass.style.display = "none";
        showPass.style.display = "inline-block";
    });

    // Gọi hàm khi trang được tải để đảm bảo biểu tượng được cập nhật đúng cách
    togglePasswordVisibility();
}

document.addEventListener("DOMContentLoaded", () => {
    setupPasswordToggle(
        "login-password",
        "login-password-eye",
        "login-password-hide-eye"
    );
});

function handleLogin() {
    // Ẩn, hiện Password
    // Nút ẩn hiện pass luôn none
    loginShowHideNone();

    const email = loginEmailInput.value.trim();
    const emailRegex =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    const password = loginPasswordInput.value.trim();
    const passwordRegex = /^\d+$/;

    let isValid = true;
    // Kiểm tra điều kiện của Email
    if (!emailRegex.test(email) || !email) {
        showError("error-login-email", "Chưa đúng email");
        isValid = false;
    } else {
        hideError("error-login-email");
    }

    // Kiểm tra điều kiện của Password
    if (!passwordRegex.test(password) || !password || password.length > 6) {
        showError("error-login-password", "Tối đa có 6 số");
        isValid = false;
    } else {
        hideError("error-login-password");
    }

    if (!isValid) {
        return;
    }

    // Tìm tài khoản với email và password khớp
    const account = accounts.find(
        (acc) =>
            acc.Status === "Hoạt động" &&
            acc.Email === email &&
            acc.Password === Number(password)
    );

    console.log(accounts);

    if (account) {
        loginIcon.style.visibility = "hidden";
        logoutIcon.style.visibility = "visible";
        loginOverlay.classList.remove("active");
        // Lưu trạng thái đăng nhập
        localStorage.setItem("isLoggedIn", "true");
        isLoggedIn = true; // Cập nhật trạng thái đăng nhập

        // Lưu thông tin đăng nhập vào localStorage dưới dạng JSON
        const loginInfo = {
            email: account.Email,
            password: account.Password,
        };
        localStorage.setItem("loginInfo", JSON.stringify(loginInfo));

        renderAccounts(accounts);
    } else {
        showError("error-login-email", "Nhập sai Password hoặc Email");
        showError("error-login-password", "Nhập sai Password hoặc Email");
    }
}

loginSubmit.addEventListener("click", function (e) {
    e.preventDefault();
    handleLogin();
});

// Đăng Xuất
const logoutOverlay = document.getElementById("log-out-overlay");
const logoutClose = document.querySelector(".logout__close");
const logoutCancel = document.querySelector(".logout__cancel");
const logoutAccount = document.querySelector(".logout__account");

// Hiển thị overlay đăng xuất khi ấn vào icon đăng xuất
logoutIcon.addEventListener("click", function (e) {
    e.preventDefault();
    logoutOverlay.classList.add("active");
});

// Tắt logoutOverlay class khi ấn bên ngoài nội dung modal
logoutOverlay.addEventListener("click", function (e) {
    e.preventDefault();

    // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
    const logoutTargetOverLay = document.querySelector(".log-out-account");
    if (!logoutTargetOverLay.contains(e.target)) {
        logoutOverlay.classList.remove("active");
        hideError("error-login-email");
        hideError("error-login-password");
    }
});

// Ngăn chặn các nhấp chuột bên trong nội dung phương thức
const logoutTargetOverLay = document.querySelector(".log-out-account");
logoutTargetOverLay.addEventListener("click", function (e) {
    e.stopPropagation(); // làm logoutTargetOverLay nổi lên trên phần tử cha
});

// Đóng overlay đăng xuất khi ấn nút đóng
logoutClose.addEventListener("click", function (e) {
    e.preventDefault();
    logoutOverlay.classList.remove("active");
});

// Đóng overlay đăng xuất khi ấn nút hủy
logoutCancel.addEventListener("click", function (e) {
    e.preventDefault();
    logoutOverlay.classList.remove("active");
});

// Đăng xuất tài khoản khi ấn đăng xuất
logoutAccount.addEventListener("click", function (e) {
    e.preventDefault();
    // Hiện login và xóa hết nội dung
    loginOverlay.classList.add("active");
    loginShowHideNone();
    setupPasswordToggle(
        "login-password",
        "login-password-eye",
        "login-password-hide-eye"
    );

    // Tắt đăng xuất
    logoutOverlay.classList.remove("active");
    loginIcon.style.visibility = "visible";
    logoutIcon.style.visibility = "hidden";
    // Cập nhật isLoggedIn khi đăng xuất
    localStorage.setItem("isLoggedIn", "false");
    // Xóa loginInfo khỏi localStorage
    localStorage.removeItem("loginInfo");
    isLoggedIn = false; //Cập nhật trạng thái

    renderAccounts(accountsDefault);
});

// Đọc giá trị isLoggedIn từ localStorage
let storedIsLoggedIn = localStorage.getItem("isLoggedIn");
// Kiểm tra trạng thái đăng nhập khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    // Nếu không có giá trị hoặc giá trị không phải là "true", đặt mặc định là false
    if (storedIsLoggedIn === "true") {
        isLoggedIn = true;
    } else {
        isLoggedIn = false;
        loginOverlay.classList.add("active");
        loginShowHideNone();
        setupPasswordToggle(
            "login-password",
            "login-password-eye",
            "login-password-hide-eye"
        );
        loginEmailInput.value = "";
        loginPasswordInput.value = "";
    }
    if (isLoggedIn) {
        loginIcon.style.visibility = "hidden";
        logoutIcon.style.visibility = "visible";
        localStorage.setItem("isLoggedIn", true);
    } else {
        loginIcon.style.visibility = "visible";
        logoutIcon.style.visibility = "hidden";
        localStorage.setItem("isLoggedIn", false);
    }
});

// ++++++++++++++++++++++++++ Đăng kí TK ++++++++++++++++++++++++++
const register = document.querySelector(".register");
const registerOverlay = document.getElementById("register-overlay");
const registerClose = document.querySelector(".register__close");
const backLogin = document.querySelector(".login");
const registerCancel = document.querySelector(".register__cancel");
const registerAccount = document.querySelector(".register__account");

// Tắt registerOverlay class khi ấn bên ngoài nội dung modal
registerOverlay.addEventListener("click", function (e) {
    e.preventDefault();

    // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
    const registerTargetOverLay = document.querySelector(".register-account");
    if (!registerTargetOverLay.contains(e.target)) {
        registerOverlay.classList.remove("active");
        // Ẩn hiện pass
        registerShowHideNone();
        hideError("error-register-name");
        hideError("error-register-email");
        hideError("error-register-password");
        hideError("error-repeat-register-password");
        setupPasswordToggle(
            "register-password",
            "register-password-eye",
            "register-password-hide-eye"
        );
        setupPasswordToggle(
            "repeat-register-password",
            "register-repeat-password-eye",
            "register-repeat-password-hide-eye"
        );
        resetStringInput();
    }
});

// Ngăn chặn các nhấp chuột bên trong nội dung phương thức
const registerTargetOverLay = document.querySelector(".register-account");
registerTargetOverLay.addEventListener("click", function (e) {
    e.stopPropagation(); // làm registerTargetOverLay nổi lên trên phần tử cha
});

// Hiển thị overlay đăng ký khi nhấp vào chỗ đăng kí
register.addEventListener("click", function (e) {
    e.preventDefault();
    // Ẩn hiện pass
    registerShowHideNone();
    registerOverlay.classList.add("active");
    loginOverlay.classList.remove("active");
});

// Đóng overlay đăng kí khi ấn nút đóng
registerClose.addEventListener("click", function (e) {
    e.preventDefault();
    loginOverlay.classList.add("active");
    registerOverlay.classList.remove("active");
    // Ẩn hiện pass
    registerShowHideNone();
    hideError("error-register-name");
    hideError("error-register-email");
    hideError("error-register-password");
    hideError("error-repeat-register-password");
    setupPasswordToggle(
        "register-password",
        "register-password-eye",
        "register-password-hide-eye"
    );
    setupPasswordToggle(
        "repeat-register-password",
        "register-repeat-password-eye",
        "register-repeat-password-hide-eye"
    );
    resetStringInput();
});

// Quay lại login
backLogin.addEventListener("click", function (e) {
    e.preventDefault();
    // Quay lại login
    loginOverlay.classList.add("active");

    // Tắt registerOverlay
    registerOverlay.classList.remove("active");
    // Ẩn hiện pass
    registerShowHideNone();
    hideError("error-register-name");
    hideError("error-register-email");
    hideError("error-register-password");
    hideError("error-repeat-register-password");
    setupPasswordToggle(
        "register-password",
        "register-password-eye",
        "register-password-hide-eye"
    );
    setupPasswordToggle(
        "repeat-register-password",
        "register-repeat-password-eye",
        "register-repeat-password-hide-eye"
    );
    resetStringInput();
});

// Đóng overlay đăng kí khi ấn nút hủy
registerCancel.addEventListener("click", function (e) {
    e.preventDefault();
    loginOverlay.classList.add("active");
    registerOverlay.classList.remove("active");
    // Ẩn hiện pass
    registerShowHideNone();
    hideError("error-register-name");
    hideError("error-register-email");
    hideError("error-register-password");
    hideError("error-repeat-register-password");
    setupPasswordToggle(
        "register-password",
        "register-password-eye",
        "register-password-hide-eye"
    );
    setupPasswordToggle(
        "repeat-register-password",
        "register-repeat-password-eye",
        "register-repeat-password-hide-eye"
    );
    resetStringInput();
});

const registerNameInput = document.getElementById("register-name");
const registerEmailInput = document.getElementById("register-email");
const registerPasswordInput = document.getElementById("register-password");
const registerRepeatInput = document.getElementById("repeat-register-password");

function resetStringInput() {
    registerNameInput.value = "";
    registerEmailInput.value = "";
    registerPasswordInput.value = "";
    registerRepeatInput.value = "";

    // Mở login lên và xóa nội dung login
    loginOverlay.classList.add("active");
    loginShowHideNone();
    setupPasswordToggle(
        "register-password",
        "register-password-eye",
        "register-password-hide-eye"
    );
    setupPasswordToggle(
        "repeat-register-password",
        "register-repeat-password-eye",
        "register-repeat-password-hide-eye"
    );
    loginEmailInput.value = "";
    loginPasswordInput.value = "";

    // bỏ active register
    registerOverlay.classList.remove("active");
}

registerNameInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-register-name");
});
registerEmailInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-register-email");
});
registerPasswordInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-register-password");
});
registerRepeatInput.addEventListener("input", function (e) {
    e.preventDefault();
    hideError("error-repeat-register-password");
});

// Ẩn hiện register pass và repeat pass
const showPassRegister = document.getElementById("register-password-eye");
const hidePassRegister = document.getElementById("register-password-hide-eye");
const showRepeatPassRegister = document.getElementById(
    "register-repeat-password-eye"
);
const hideRepeatPassRegister = document.getElementById(
    "register-repeat-password-hide-eye"
);

// Hàm mặc định nút ẩn hiện pass luôn none
function registerShowHideNone() {
    showPassRegister.style.display = "none";
    hidePassRegister.style.display = "none";
    showRepeatPassRegister.style.display = "none";
    hideRepeatPassRegister.style.display = "none";
}

// Hiển thị nút ẩn hiện pass
document.addEventListener("DOMContentLoaded", function () {
    // Hàm ẩn hiện pass
    setupPasswordToggle(
        "register-password",
        "register-password-eye",
        "register-password-hide-eye"
    );

    setupPasswordToggle(
        "repeat-register-password",
        "register-repeat-password-eye",
        "register-repeat-password-hide-eye"
    );
});

function handleRegister() {
    // Ẩn hiện pass
    registerShowHideNone();

    const name = registerNameInput.value.trim();
    const nameRegex =
        /^([A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)([\s-][A-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ][a-zA-ZÀÁÃẢẠÂÃẦẤẪẬẨĂẮẰẴẶẲÈÉẼẸẺÊỆỄỂỀẾÌÍỈĨỊÒÓỌÕỎÔỐỒỖỔỘÕÙÚỤŨỦĂĐĨŨƠƯỨỪỰỮỬỚỠỜỞỢỌYÝỲỸỶỴàáãạảâấầậẫẩăặắằẵẳãầấẫậẩêếềệểễeẹẻẽèéêịĩỉiìíọỏõòóôõụũủùúăđĩũờỡởợơửữướợọắằẳẵặếềểễệỉịủụừứựỳỵỷỹ]*)*(\s*\d*)$/;

    const email = registerEmailInput.value.trim();
    const emailRegex =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    const password = registerPasswordInput.value.trim();
    const passwordRegex = /^\d+$/;
    const repeat = registerRepeatInput.value.trim();

    let isValid = true;
    // Kiểm tra điều kiện của name
    if (!nameRegex.test(name) || !name) {
        showError(
            "error-register-name",
            "Viết hoa chữ cái đầu mỗi từ, có thể ghi số"
        );
        isValid = false;
    } else {
        hideError("error-register-name");
    }

    // Kiểm tra điều kiện của email
    if (!emailRegex.test(email) || !email) {
        showError("error-register-email", "Chưa đúng cú pháp email");
        isValid = false;
    } else {
        hideError("error-register-email");
    }

    // Kiểm tra điều kiện password
    if (!passwordRegex.test(password) || !password || password.length > 6) {
        showError(
            "error-register-password",
            "Tối đa 6 kí tự chỉ được phép chứa số"
        );
        isValid = false;
    } else {
        hideError("error-register-password");
    }

    // Kiểm tra điều kiện repeat password
    if (!repeat || repeat !== password) {
        showError("error-repeat-register-password", "Mật khẩu không đúng");
        isValid = false;
    } else {
        hideError("error-repeat-register-password");
    }

    if (!isValid) {
        return;
    }

    accounts.push({
        id: ++_id,
        Email: email,
        Password: Number(password),
        Name: name,
        Status: "Hoạt động",
    });

    accountsDefault.push({
        id: _id,
        Email: email,
        Password: Number(password),
        Name: name,
        Status: "Hoạt động",
    });

    // Cập nhật phân trang và hiện trang cuối cùng
    currentPage = Math.ceil(accounts.length / accountsPerPage); // coursesPerPage là số khóa học trên mỗi trang
    updatePagination(accounts.length);
    highlightActivePage(currentPage);

    saveAccountsDefault(accountsDefault);
    saveAccounts(accounts);
    renderAccounts(accounts);

    resetStringInput();
}

registerAccount.addEventListener("click", (e) => {
    e.preventDefault();
    handleRegister();
});

// +++++++++++++++ Khóa account +++++++++++++++
let indexBlockAccount = null;
let accountIdBlock = null;
const blockOverLay = document.getElementById("block-overlay");

// Tắt blockOverLay class khi ấn bên ngoài nội dung modal
blockOverLay.addEventListener("click", function (e) {
    e.preventDefault();

    // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
    const blockTargetOverLay = document.querySelector(".block-account");
    if (!blockTargetOverLay.contains(e.target)) {
        blockOverLay.classList.remove("active");
    }
});

// Ngăn chặn các nhấp chuột bên trong nội dung phương thức
const blockTargetOverLay = document.querySelector(".block-account");
blockTargetOverLay.addEventListener("click", function (e) {
    e.stopPropagation(); // làm blockTargetOverLay nổi lên trên phần tử cha
});

function blockEventListener() {
    const blockButtons = document.querySelectorAll(".list-tk-btn-block");
    blockButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            indexBlockAccount = parseInt(button.getAttribute("data-index"));
            accountIdBlock = parseInt(button.getAttribute("data-id"));
            showBlockAccount(accountIdBlock);

            if (checkLogin()) {
                blockOverLay.classList.add("active");
            }
        });
    });
}

// Hiển thị thông tin TK muốn block
function showBlockAccount(accountId) {
    const account = accounts.find((c) => c.id === accountId);
    let _tr = "";
    if (account) {
        _tr = ` <td>${indexShowBlockAccount + indexBlockAccount}</td>
                <td>${account.Email}</td>
                <td>${account.Password}</td>
                <td>${account.Name}</td>
                <td>"${account.Status}"</td>`;
    }
    let _tbody = document.querySelector(".block-table-tbody-tk-block");
    _tbody.innerHTML = _tr;
}

// Xác nhận block TK
const confirmBlockAccount = document.querySelector(".block__account");
confirmBlockAccount.addEventListener("click", function (e) {
    e.preventDefault();
    // Cập nhật trạng thái của tài khoản trong danh sách accounts
    const idBlockAccount = accounts.findIndex((account) => {
        if (Number(account.id) === Number(accountIdBlock)) {
            return Number(account.id);
        }
    });
    if (idBlockAccount !== -1) {
        accounts[idBlockAccount].Status = "Không hoạt động";
    }
    // Cập nhật trạng thái của tài khoản trong danh sách accountsDefault
    const idBlockAccountDefault = accountsDefault.findIndex((account) => {
        if (Number(account.id) === Number(accountIdBlock)) {
            return Number(account.id);
        }
    });
    if (idBlockAccountDefault !== -1) {
        accountsDefault[idBlockAccountDefault].Status = "Không hoạt động";
    }

    // Lưu lại danh sách accounts và accountsDefault sau khi cập nhật
    saveAccounts(accounts);
    saveAccountsDefault(accountsDefault);
    renderAccounts(accounts);

    // Ẩn nút "Khóa" và hiện các nút "Mở khóa", "Xóa"
    document.querySelector(
        `.list-tk-btn-block[data-id="${accountIdBlock}"]`
    ).style.display = "none";
    document.querySelector(
        `.list-tk-btn-open-block[data-id="${accountIdBlock}"]`
    ).style.display = "inline-block";
    document.querySelector(
        `.list-tk-btn-delete[data-id="${accountIdBlock}"]`
    ).style.display = "inline-block";

    blockOverLay.classList.remove("active");
});

// Xác nhận hủy block TK
const cancelBlockAccount = document.querySelector(".block__cancel");
cancelBlockAccount.addEventListener("click", function (e) {
    e.preventDefault();
    blockOverLay.classList.remove("active");
});

// +++++++++++++++ Mở khóa account +++++++++++++++
let indexOpenBlockAccount = null;
let accountIdOpenBlock = null;
const openBlockOverlay = document.getElementById("open-block-overlay");

// Tắt openBlockOverlay class khi ấn bên ngoài nội dung modal
openBlockOverlay.addEventListener("click", function (e) {
    e.preventDefault();

    // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
    const openBlockTargetOverLay = document.querySelector(
        ".open-block-account"
    );
    if (!openBlockTargetOverLay.contains(e.target)) {
        openBlockOverlay.classList.remove("active");
    }
});

// Ngăn chặn các nhấp chuột bên trong nội dung phương thức
const openBlockTargetOverLay = document.querySelector(".open-block-account");
openBlockTargetOverLay.addEventListener("click", function (e) {
    e.stopPropagation(); // làm openBlockTargetOverLay nổi lên trên phần tử cha
});

function openBlockEventListener() {
    const openBlockButtons = document.querySelectorAll(
        ".list-tk-btn-open-block"
    );
    openBlockButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            indexOpenBlockAccount = parseInt(button.getAttribute("data-index"));
            accountIdOpenBlock = parseInt(button.getAttribute("data-id"));
            ShowOpenBlockAccount(accountIdOpenBlock);

            if (checkLogin()) {
                openBlockOverlay.classList.add("active");
            }
        });
    });
}

function ShowOpenBlockAccount(accountId) {
    const account = accounts.find((c) => c.id === accountId);
    let _tr = "";
    if (account) {
        _tr = `<td>${indexShowOpenBlockAccount + indexOpenBlockAccount}</td>
                <td>${account.Email}</td>
                <td>${account.Password}</td>
                <td>${account.Name}</td>
                <td>"${account.Status}"</td>`;
    }
    let _tbody = document.querySelector(".block-table-tbody-tk-open-block");
    _tbody.innerHTML = _tr;
}

// Xác nhận mở khóa TK
const confirmOpenBlockAccount = document.querySelector(".open-block__account");
confirmOpenBlockAccount.addEventListener("click", function (e) {
    e.preventDefault();
    // Cập nhật trạng thái của tài khoản trong danh sách accounts
    const idOpenBlockAccount = accounts.findIndex((account) => {
        if (Number(account.id) === Number(accountIdOpenBlock)) {
            return Number(account.id);
        }
    });
    console.log(idOpenBlockAccount);
    if (idOpenBlockAccount !== -1) {
        accounts[idOpenBlockAccount].Status = "Hoạt động";
    }
    // Cập nhật trạng thái của tài khoản trong danh sách accountsDefault
    const idOpenBlockAccountDefault = accountsDefault.findIndex((account) => {
        if (Number(account.id) === Number(accountIdOpenBlock)) {
            return Number(account.id);
        }
    });
    if (idOpenBlockAccountDefault !== -1) {
        accountsDefault[idOpenBlockAccountDefault].Status = "Hoạt động";
    }

    // Lưu lại danh sách accounts và accountsDefault sau khi cập nhật
    saveAccounts(accounts);
    saveAccountsDefault(accountsDefault);
    renderAccounts(accounts);

    // Ẩn nút "Mở khóa" và nút "Xóa" hiện các nút "khóa"
    document.querySelector(
        `.list-tk-btn-block[data-id="${accountIdOpenBlock}"]`
    ).style.display = "inline-block";
    document.querySelector(
        `.list-tk-btn-open-block[data-id="${accountIdOpenBlock}"]`
    ).style.display = "none";
    document.querySelector(
        `.list-tk-btn-delete[data-id="${accountIdOpenBlock}"]`
    ).style.display = "none";

    openBlockOverlay.classList.remove("active");
});

// Xác nhận hủy mở khóa TK
const cancelOpenBlock = document.querySelector(".open-block__cancel");
cancelOpenBlock.addEventListener("click", function (e) {
    e.preventDefault();
    openBlockOverlay.classList.remove("active");
});

// ++++++++++++++++++++++++++++++ Xóa accounts ++++++++++++++++++++++++++++++
let indexDeleteAccount = null;
let accountIdDelete = null;
const deleteOverlay = document.getElementById("delete-tk-overlay");

// Tắt deleteOverlay class khi ấn bên ngoài nội dung modal
deleteOverlay.addEventListener("click", function (e) {
    e.preventDefault();

    // Kiểm tra xem mục tiêu nhấp chuột có nằm trong nội dung phương thức không
    const deleteTargetOverLay = document.querySelector(".delete-account");
    if (!deleteTargetOverLay.contains(e.target)) {
        deleteOverlay.classList.remove("active");
    }
});

// Ngăn chặn các nhấp chuột bên trong nội dung phương thức
const deleteTargetOverLay = document.querySelector(".delete-account");
deleteTargetOverLay.addEventListener("click", function (e) {
    e.stopPropagation(); // làm deleteTargetOverLay nổi lên trên phần tử cha
});

function deleteEventListener() {
    const deleteButtons = document.querySelectorAll(".list-tk-btn-delete");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            indexDeleteAccount = parseInt(button.getAttribute("data-index"));
            accountIdDelete = parseInt(button.getAttribute("data-id"));
            ShowDeleteAccount(accountIdDelete);

            if (checkLogin()) {
                deleteOverlay.classList.add("active");
            }
        });
    });
}

function ShowDeleteAccount(accountId) {
    const account = accounts.find((c) => c.id === accountId);
    let _tr = "";
    if (account) {
        _tr = `<td>${indexShowDeleteAccount + indexDeleteAccount}</td>
                <td>${account.Email}</td>
                <td>${account.Password}</td>
                <td>${account.Name}</td>
                <td>"${account.Status}"</td>`;
    }
    let _tbody = document.querySelector(".block-table-tbody-tk-delete");
    _tbody.innerHTML = _tr;
}

// Xác nhận mở khóa TK
const confirmDeleteAccount = document.querySelector(".delete__account");
confirmDeleteAccount.addEventListener("click", function (e) {
    e.preventDefault();
    // Cập nhật trạng thái của tài khoản trong danh sách accounts
    const idDeleteAccount = accounts.findIndex((account) => {
        if (Number(account.id) === Number(accountIdDelete)) {
            return Number(account.id);
        }
    });
    if (idDeleteAccount !== -1) {
        accounts.splice(idDeleteAccount, 1);
    }
    // Cập nhật trạng thái của tài khoản trong danh sách accountsDefault
    const idDeleteAccountDefault = accountsDefault.findIndex((account) => {
        if (Number(account.id) === Number(accountIdDelete)) {
            return Number(account.id);
        }
    });
    if (idDeleteAccountDefault !== -1) {
        accountsDefault.splice(idDeleteAccountDefault, 1);
    }

    currentPage = 1;
    highlightActivePage(currentPage);
    updatePagination(accounts.length);

    // Lưu lại danh sách accounts và accountsDefault sau khi cập nhật
    saveAccounts(accounts);
    saveAccountsDefault(accountsDefault);
    renderAccounts(accounts);

    deleteOverlay.classList.remove("active");
});

// Xác nhận hủy mở khóa TK
const cancelDelete = document.querySelector(".delete__cancel");
cancelDelete.addEventListener("click", function (e) {
    e.preventDefault();
    deleteOverlay.classList.remove("active");
});

// +++++++++++++++ Sắp xếp accounts +++++++++++++++
const sortAccount = document.querySelector(".sort-search-tk");
sortAccount.value = "default";

let sortOrder;

function extractAlphaNumericParts(accountName) {
    const parts = accountName.split(" "); // Tách tên theo khoảng trắng và lưu vào mảng parts
    const alpha = parts.join(" "); // Nối tất cả các phần lại thành một chuỗi để so sánh theo thứ tự chữ cái
    const num = parseInt(parts[parts.length - 1], 10); // Cố gắng chuyển đổi phần cuối cùng thành số nguyên
    return {
        alpha: alpha,
        num: isNaN(num) ? null : num, // Kiểm tra nếu số chuyển đổi là Nan, nếu không thì trả về số đó
    };
}

sortAccount.addEventListener("change", function (e) {
    sortOrder = sortAccount.value;
    e.preventDefault();
    if (sortOrder === "asc") {
        accounts.sort((a, b) => {
            const aParts = extractAlphaNumericParts(a.Name);
            const bParts = extractAlphaNumericParts(b.Name);

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
        accounts.sort((a, b) => {
            const aParts = extractAlphaNumericParts(a.Name);
            const bParts = extractAlphaNumericParts(b.Name);

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
        renderAccounts(accountsDefault);
        saveAccountsDefault(accountsDefault);
        searchAccounts();
        return;
    }
    saveAccounts(accounts);
    searchAccounts();
    renderAccounts(accounts);
});

// +++++++++++++++ Tìm tiếm Accounts +++++++++++++++
const searchInput = document.querySelector(".search__form-input-tk");
const searchSelect = document.querySelector(".select-search-tk");

// Thêm event listener cho input và select
let filteredAccounts = [];

function searchAccounts() {
    const searchItem = searchInput.value.trim().toLowerCase();
    const searchCategory = searchSelect.value;

    // Nếu input trống, render tất cả lớp học
    if (searchItem === "") {
        // Nếu không có tìm kiếm, render tất cả lớp học
        if (sortOrder === "asc") {
            filteredAccounts = []; // reset lại mảng tìm kiếm
            accounts.sort((a, b) => a.Name.localeCompare(b.Name));
            renderAccounts(accounts);
            updatePagination(accounts.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        } else if (sortOrder === "desc") {
            filteredAccounts = []; // reset lại mảng tìm kiếm
            accounts.sort((a, b) => b.Name.localeCompare(a.Name));
            renderAccounts(accounts);
            updatePagination(accounts.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        } else if (sortOrder === "default") {
            filteredAccounts = []; //reset mảng tìm kiếm
            renderAccounts(accountsDefault);
            updatePagination(accountsDefault.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        } else if (searchItem === "") {
            filteredAccounts = []; // reset mảng tìm kiếm
            renderAccounts(accountsDefault);
            updatePagination(accountsDefault.length);
            currentPage = 1; // Đặt lại về trang đầu
            highlightActivePage(currentPage);
        }
        return;
    }

    filteredAccounts = accountsDefault.filter((account) => {
        if (!account) return false; // Kiểm tra nếu account là undefined

        switch (searchCategory) {
            case "Email":
                return (
                    account.Email &&
                    account.Email.toString().toLowerCase().includes(searchItem)
                );
            case "Password":
                return (
                    account.Password &&
                    account.Password.toString()
                        .toLowerCase()
                        .includes(searchItem)
                );
            case "Name":
                return (
                    account.Name &&
                    account.Name.toString().toLowerCase().includes(searchItem)
                );
            case "Status":
                // So khớp chính xác trạng thái
                const statusLower = account.Status.toString().toLowerCase();
                return statusLower === searchItem;
            default: // Tất cả
                return (
                    account.Email.toString()
                        .toLowerCase()
                        .includes(searchItem) ||
                    account.Password.toString()
                        .toLowerCase()
                        .includes(searchItem) ||
                    account.Name.toString()
                        .toLowerCase()
                        .includes(searchItem) ||
                    account.Status.toString().toLowerCase() === searchItem // So khớp chính xác trạng thái
                );
        }
    });
    renderAccounts(filteredAccounts); //Render danh sách đã lọc
    currentPage = 1; // Đặt lại về trang đầu
    updatePagination(filteredAccounts.length);
    highlightActivePage(currentPage);
}

searchInput.addEventListener("input", searchAccounts);
searchSelect.addEventListener("change", function (e) {
    e.preventDefault();
    searchInput.value = "";
    searchAccounts();
});

// Khi ấn nút reset input thì sẽ render ra toàn bộ TK
const resetInput = document.querySelector(".search__form-close-tk");
resetInput.addEventListener("click", function (e) {
    e.preventDefault();
    searchInput.value = "";
    filteredAccounts = [];

    if (sortOrder === "asc") {
        accounts.sort((a, b) => a.Name.localeCompare(b.Name));
        renderAccounts(accounts);
    } else if (sortOrder === "desc") {
        accounts.sort((a, b) => b.Name.localeCompare(a.Name));
        renderAccounts(accounts);
    } else if (sortOrder === "default") {
        renderAccounts(accountsDefault);
    } else {
        renderAccounts(accountsDefault);
    }
});

// +++++++++++++++ Phân Trang +++++++++++++++
function updatePagination(totalAccounts) {
    const searchPage = document.getElementById("page-tk-search-num");
    const totalPage = Math.ceil(totalAccounts / accountsPerPage);

    const paginationContainer = document.querySelector(".page-tk-btn");

    paginationContainer.innerHTML = ""; // Clear các phần tử trong paginationContainer

    // Hiển thị tất cả các trang nếu tổng số trang >= 2
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
    const searchPage = document.getElementById("page-tk-search-num");
    const button = document.createElement("button");
    button.className = "page-tk-num";
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
    const totalAccounts =
        filteredAccounts.length > 0 ? filteredAccounts.length : accounts.length;

    if (page < 1 || page > Math.ceil(totalAccounts / accountsPerPage)) return;

    currentPage = page;
    const accountsToRender =
        filteredAccounts.length > 0 ? filteredAccounts : accounts;
    updatePagination(accountsToRender.length);
    highlightActivePage(currentPage);
    renderAccounts(accountsToRender);
}

// active cho từng Page
function highlightActivePage(activePage) {
    const paginationButtons = document.querySelectorAll(".page-tk-num");
    paginationButtons.forEach((button) => {
        button.classList.remove("active"); // Xóa class active khỏi tất cả các nút
        if (parseInt(button.dataset.page) === activePage) {
            button.classList.add("active"); // Thêm class active cho nút hiện tại
        }
    });
}
