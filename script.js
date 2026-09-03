/* =========================================
   STUDENT PHOTOGRAPHER SYSTEM
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

const STORAGE = {

    students: "student_photo_students",

    photographers: "student_photo_photographers",

    bookings: "student_photo_bookings",

    photos: "student_photo_photos"

};



/* =========================================
   BASIC FUNCTIONS
========================================= */

function getData(type) {

    return JSON.parse(
        localStorage.getItem(STORAGE[type]) || "[]"
    );

}


function saveData(type, data) {

    localStorage.setItem(
        STORAGE[type],
        JSON.stringify(data)
    );

}


function generateID() {

    return Date.now().toString(36) +
           Math.random().toString(36).substring(2);

}


function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(function () {

        toast.remove();

    }, 2500);

}


function confirmLogout() {

    return confirm(
        "Are you sure you want to logout?"
    );

}


function toggleSidebar() {

    const sidebar =
        document.querySelector(".sidebar");

    if (sidebar) {

        sidebar.classList.toggle("open");

    }

}



/* =========================================
   STUDENTS
========================================= */

function renderStudents(search = "") {

    const table =
        document.getElementById("studentTable");

    if (!table) return;


    const students = getData("students");


    const filtered =
        students.filter(function(student) {

            const text =
                `${student.name}
                 ${student.reg}
                 ${student.course}
                 ${student.phone}`.toLowerCase();

            return text.includes(
                search.toLowerCase()
            );

        });


    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8"
                    class="empty">

                    No student records found.

                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        filtered.map(function(student, index) {

            return `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <strong>
                            ${escapeHTML(student.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(student.reg)}
                    </td>

                    <td>
                        ${escapeHTML(student.gender)}
                    </td>

                    <td>
                        ${escapeHTML(student.course || "-")}
                    </td>

                    <td>
                        ${escapeHTML(student.year || "-")}
                    </td>

                    <td>
                        ${escapeHTML(student.phone || "-")}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteStudent('${student.id}')">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


function deleteStudent(id) {

    if (!confirm("Delete this student?")) {

        return;

    }


    const students =
        getData("students");


    const updated =
        students.filter(function(student) {

            return student.id !== id;

        });


    saveData("students", updated);


    renderStudents();

    populateSelects();

    renderDashboard();


    showToast(
        "Student deleted successfully"
    );

}



/* =========================================
   PHOTOGRAPHERS
========================================= */

function renderPhotographers(search = "") {

    const container =
        document.getElementById(
            "photographerCards"
        );

    if (!container) return;


    const photographers =
        getData("photographers");


    const filtered =
        photographers.filter(function(person) {

            const text =
                `${person.name}
                 ${person.phone}
                 ${person.specialty}`.toLowerCase();

            return text.includes(
                search.toLowerCase()
            );

        });


    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="empty">

                No photographer records found.

            </div>
        `;

        return;

    }


    container.innerHTML =
        filtered.map(function(person) {

            return `

                <div class="photographer-card">

                    <div class="photographer-avatar">
                        📷
                    </div>

                    <h3>
                        ${escapeHTML(person.name)}
                    </h3>

                    <p>
                        📱
                        ${escapeHTML(
                            person.phone || "-"
                        )}
                    </p>

                    <p>
                        ✉️
                        ${escapeHTML(
                            person.email || "-"
                        )}
                    </p>

                    <p>
                        ⭐
                        ${escapeHTML(
                            person.specialty
                        )}
                    </p>

                    <p>

                        <span class="status
                        ${person.status === "Busy"
                            ? "pending"
                            : ""}">

                            ${escapeHTML(
                                person.status
                            )}

                        </span>

                    </p>

                    <br>

                    <button
                        class="delete-btn"
                        onclick="deletePhotographer('${person.id}')">

                        Delete

                    </button>

                </div>

            `;

        }).join("");

}


function deletePhotographer(id) {

    if (!confirm(
        "Delete this photographer?"
    )) {

        return;

    }


    const photographers =
        getData("photographers");


    const updated =
        photographers.filter(function(person) {

            return person.id !== id;

        });


    saveData(
        "photographers",
        updated
    );


    renderPhotographers();

    populateSelects();

    renderDashboard();


    showToast(
        "Photographer deleted"
    );

}



/* =========================================
   SELECT DROPDOWNS
========================================= */

function populateSelects() {

    const students =
        getData("students");

    const photographers =
        getData("photographers");


    const bookingStudent =
        document.getElementById(
            "bookingStudent"
        );


    const photoStudent =
        document.getElementById(
            "photoStudent"
        );


    const bookingPhotographer =
        document.getElementById(
            "bookingPhotographer"
        );



    if (bookingStudent) {

        bookingStudent.innerHTML =
            `<option value="">
                Select Student
             </option>` +

            students.map(function(student) {

                return `

                    <option value="${student.id}">

                        ${escapeHTML(
                            student.name
                        )}

                        -
                        ${escapeHTML(
                            student.reg
                        )}

                    </option>

                `;

            }).join("");

    }



    if (photoStudent) {

        photoStudent.innerHTML =
            `<option value="">
                Select Student
             </option>` +

            students.map(function(student) {

                return `

                    <option value="${student.id}">

                        ${escapeHTML(
                            student.name
                        )}

                    </option>

                `;

            }).join("");

    }



    if (bookingPhotographer) {

        bookingPhotographer.innerHTML =
            `<option value="">
                Select Photographer
             </option>` +

            photographers.map(function(person) {

                return `

                    <option value="${person.id}">

                        ${escapeHTML(
                            person.name
                        )}

                    </option>

                `;

            }).join("");

    }

}



/* =========================================
   BOOKINGS
========================================= */

function renderBookings() {

    const table =
        document.getElementById(
            "bookingTable"
        );

    if (!table) return;


    const bookings =
        getData("bookings");


    const students =
        getData("students");


    const photographers =
        getData("photographers");


    if (bookings.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="7"
                    class="empty">

                    No booking records found.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        bookings.slice().reverse()
        .map(function(booking) {


            const student =
                students.find(function(item) {

                    return item.id ===
                           booking.student;

                });


            const photographer =
                photographers.find(function(item) {

                    return item.id ===
                           booking.photographer;

                });


            return `

                <tr>

                    <td>
                        ${escapeHTML(
                            student?.name ||
                            "Unknown"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            photographer?.name ||
                            "Unknown"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            booking.date
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            booking.time
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            booking.type
                        )}
                    </td>

                    <td>

                        <span class="status
                        ${booking.status === "Pending"
                            ? "pending"
                            : ""}">

                            ${escapeHTML(
                                booking.status
                            )}

                        </span>

                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteBooking('${booking.id}')">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


function deleteBooking(id) {

    if (!confirm(
        "Delete this booking?"
    )) {

        return;

    }


    const bookings =
        getData("bookings");


    saveData(
        "bookings",
        bookings.filter(function(booking) {

            return booking.id !== id;

        })
    );


    renderBookings();

    renderDashboard();


    showToast(
        "Booking deleted"
    );

}



/* =========================================
   GALLERY
========================================= */

function renderGallery() {

    const gallery =
        document.getElementById(
            "galleryGrid"
        );

    if (!gallery) return;


    const photos =
        getData("photos");


    const students =
        getData("students");


    if (photos.length === 0) {

        gallery.innerHTML = `

            <div class="empty">

                No photos uploaded yet.

            </div>

        `;

        return;

    }


    gallery.innerHTML =
        photos.slice().reverse()
        .map(function(photo) {


            const student =
                students.find(function(item) {

                    return item.id ===
                           photo.student;

                });


            return `

                <div class="photo-card">

                    <img
                        src="${photo.data}"
                        alt="${escapeHTML(
                            photo.title
                        )}">


                    <div class="photo-info">

                        <strong>
                            ${escapeHTML(
                                photo.title
                            )}
                        </strong>

                        <small>

                            ${escapeHTML(
                                student?.name ||
                                "Unknown Student"
                            )}

                        </small>

                        <br><br>

                        <button
                            class="delete-btn"
                            onclick="deletePhoto('${photo.id}')">

                            Delete

                        </button>

                    </div>

                </div>

            `;

        }).join("");

}


function deletePhoto(id) {

    if (!confirm(
        "Delete this photo?"
    )) {

        return;

    }


    const photos =
        getData("photos");


    saveData(
        "photos",

        photos.filter(function(photo) {

            return photo.id !== id;

        })
    );


    renderGallery();

    renderDashboard();


    showToast(
        "Photo deleted"
    );

}



/* =========================================
   DASHBOARD
========================================= */

function renderDashboard() {

    const studentCount =
        document.getElementById(
            "studentCount"
        );


    if (!studentCount) return;


    const students =
        getData("students");

    const photographers =
        getData("photographers");

    const bookings =
        getData("bookings");

    const photos =
        getData("photos");


    document.getElementById(
        "studentCount"
    ).textContent =
        students.length;


    document.getElementById(
        "photographerCount"
    ).textContent =
        photographers.length;


    document.getElementById(
        "bookingCount"
    ).textContent =
        bookings.length;


    document.getElementById(
        "photoCount"
    ).textContent =
        photos.length;



    const recent =
        document.getElementById(
            "recentBookings"
        );


    if (!recent) return;


    const recentBookings =
        bookings.slice(-5).reverse();


    if (recentBookings.length === 0) {

        recent.innerHTML = `

            <tr>

                <td colspan="4"
                    class="empty">

                    No recent bookings.

                </td>

            </tr>

        `;

        return;

    }


    recent.innerHTML =
        recentBookings.map(function(booking) {


            const student =
                students.find(function(item) {

                    return item.id ===
                           booking.student;

                });


            const photographer =
                photographers.find(function(item) {

                    return item.id ===
                           booking.photographer;

                });


            return `

                <tr>

                    <td>

                        ${escapeHTML(
                            student?.name ||
                            "Unknown"
                        )}

                    </td>

                    <td>

                        ${escapeHTML(
                            photographer?.name ||
                            "Unknown"
                        )}

                    </td>

                    <td>

                        ${escapeHTML(
                            booking.date
                        )}

                    </td>

                    <td>

                        <span class="status pending">

                            ${escapeHTML(
                                booking.status
                            )}

                        </span>

                    </td>

                </tr>

            `;

        }).join("");

}



/* =========================================
   PAGE INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {


    /* STUDENTS */

    renderStudents();


    const studentSearch =
        document.getElementById(
            "studentSearch"
        );


    if (studentSearch) {

        studentSearch.addEventListener(
            "input",
            function() {

                renderStudents(
                    this.value
                );

            }
        );

    }



    /* PHOTOGRAPHERS */

    renderPhotographers();


    const photographerSearch =
        document.getElementById(
            "photographerSearch"
        );


    if (photographerSearch) {

        photographerSearch.addEventListener(
            "input",
            function() {

                renderPhotographers(
                    this.value
                );

            }
        );

    }



    /* SELECTS */

    populateSelects();



    /* BOOKINGS */

    renderBookings();



    /* GALLERY */

    renderGallery();



    /* DASHBOARD */

    renderDashboard();



    /* =====================================
       STUDENT FORM
    ===================================== */

    const studentForm =
        document.getElementById(
            "studentForm"
        );


    if (studentForm) {

        studentForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const students =
                    getData("students");


                const student = {

                    id: generateID(),

                    name:
                        document.getElementById(
                            "studentName"
                        ).value.trim(),

                    reg:
                        document.getElementById(
                            "studentReg"
                        ).value.trim(),

                    gender:
                        document.getElementById(
                            "studentGender"
                        ).value,

                    course:
                        document.getElementById(
                            "studentCourse"
                        ).value.trim(),

                    year:
                        document.getElementById(
                            "studentYear"
                        ).value,

                    phone:
                        document.getElementById(
                            "studentPhone"
                        ).value.trim()

                };


                const duplicate =
                    students.some(function(item) {

                        return item.reg.toLowerCase() ===
                               student.reg.toLowerCase();

                    });


                if (duplicate) {

                    alert(
                        "Registration number already exists."
                    );

                    return;

                }


                students.push(student);


                saveData(
                    "students",
                    students
                );


                studentForm.reset();


                renderStudents();

                populateSelects();

                renderDashboard();


                showToast(
                    "Student registered successfully!"
                );

            }
        );

    }



    /* =====================================
       PHOTOGRAPHER FORM
    ===================================== */

    const photographerForm =
        document.getElementById(
            "photographerForm"
        );


    if (photographerForm) {

        photographerForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const photographers =
                    getData("photographers");


                const photographer = {

                    id: generateID(),

                    name:
                        document.getElementById(
                            "photographerName"
                        ).value.trim(),

                    phone:
                        document.getElementById(
                            "photographerPhone"
                        ).value.trim(),

                    email:
                        document.getElementById(
                            "photographerEmail"
                        ).value.trim(),

                    specialty:
                        document.getElementById(
                            "photographerSpecialty"
                        ).value,

                    status:
                        document.getElementById(
                            "photographerStatus"
                        ).value

                };


                photographers.push(
                    photographer
                );


                saveData(
                    "photographers",
                    photographers
                );


                photographerForm.reset();


                renderPhotographers();

                populateSelects();

                renderDashboard();


                showToast(
                    "Photographer added successfully!"
                );

            }
        );

    }



    /* =====================================
       BOOKING FORM
    ===================================== */

    const bookingForm =
        document.getElementById(
            "bookingForm"
        );


    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const bookings =
                    getData("bookings");


                const booking = {

                    id: generateID(),

                    student:
                        document.getElementById(
                            "bookingStudent"
                        ).value,

                    photographer:
                        document.getElementById(
                            "bookingPhotographer"
                        ).value,

                    date:
                        document.getElementById(
                            "bookingDate"
                        ).value,

                    time:
                        document.getElementById(
                            "bookingTime"
                        ).value,

                    type:
                        document.getElementById(
                            "bookingType"
                        ).value,

                    status:
                        "Pending"

                };


                bookings.push(
                    booking
                );


                saveData(
                    "bookings",
                    bookings
                );


                bookingForm.reset();


                renderBookings();

                renderDashboard();


                showToast(
                    "Booking created successfully!"
                );

            }
        );

    }



    /* =====================================
       PHOTO UPLOAD
    ===================================== */

    const photoForm =
        document.getElementById(
            "photoForm"
        );


    if (photoForm) {

        photoForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const file =
                    document.getElementById(
                        "photoFile"
                    ).files[0];


                if (!file) {

                    alert(
                        "Please choose a photo."
                    );

                    return;

                }


                if (!file.type.startsWith(
                    "image/"
                )) {

                    alert(
                        "Please select an image file."
                    );

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function() {


                    const photos =
                        getData("photos");


                    const photo = {

                        id: generateID(),

                        student:
                            document.getElementById(
                                "photoStudent"
                            ).value,

                        title:
                            document.getElementById(
                                "photoTitle"
                            ).value.trim(),

                        data:
                            reader.result

                    };


                    photos.push(photo);


                    saveData(
                        "photos",
                        photos
                    );


                    photoForm.reset();


                    renderGallery();

                    renderDashboard();


                    showToast(
                        "Photo uploaded successfully!"
                    );

                };


                reader.readAsDataURL(file);

            }
        );

    }

});/* =========================================
   STUDENT PHOTOGRAPHER SYSTEM
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

const STORAGE = {

    students: "student_photo_students",

    photographers: "student_photo_photographers",

    bookings: "student_photo_bookings",

    photos: "student_photo_photos"

};



/* =========================================
   BASIC FUNCTIONS
========================================= */

function getData(type) {

    return JSON.parse(
        localStorage.getItem(STORAGE[type]) || "[]"
    );

}


function saveData(type, data) {

    localStorage.setItem(
        STORAGE[type],
        JSON.stringify(data)
    );

}


function generateID() {

    return Date.now().toString(36) +
           Math.random().toString(36).substring(2);

}


function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(function () {

        toast.remove();

    }, 2500);

}


function confirmLogout() {

    return confirm(
        "Are you sure you want to logout?"
    );

}


function toggleSidebar() {

    const sidebar =
        document.querySelector(".sidebar");

    if (sidebar) {

        sidebar.classList.toggle("open");

    }

}



/* =========================================
   STUDENTS
========================================= */

function renderStudents(search = "") {

    const table =
        document.getElementById("studentTable");

    if (!table) return;


    const students = getData("students");


    const filtered =
        students.filter(function(student) {

            const text =
                `${student.name}
                 ${student.reg}
                 ${student.course}
                 ${student.phone}`.toLowerCase();

            return text.includes(
                search.toLowerCase()
            );

        });


    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8"
                    class="empty">

                    No student records found.

                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        filtered.map(function(student, index) {

            return `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <strong>
                            ${escapeHTML(student.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(student.reg)}
                    </td>

                    <td>
                        ${escapeHTML(student.gender)}
                    </td>

                    <td>
                        ${escapeHTML(student.course || "-")}
                    </td>

                    <td>
                        ${escapeHTML(student.year || "-")}
                    </td>

                    <td>
                        ${escapeHTML(student.phone || "-")}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteStudent('${student.id}')">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


function deleteStudent(id) {

    if (!confirm("Delete this student?")) {

        return;

    }


    const students =
        getData("students");


    const updated =
        students.filter(function(student) {

            return student.id !== id;

        });


    saveData("students", updated);


    renderStudents();

    populateSelects();

    renderDashboard();


    showToast(
        "Student deleted successfully"
    );

}



/* =========================================
   PHOTOGRAPHERS
========================================= */

function renderPhotographers(search = "") {

    const container =
        document.getElementById(
            "photographerCards"
        );

    if (!container) return;


    const photographers =
        getData("photographers");


    const filtered =
        photographers.filter(function(person) {

            const text =
                `${person.name}
                 ${person.phone}
                 ${person.specialty}`.toLowerCase();

            return text.includes(
                search.toLowerCase()
            );

        });


    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="empty">

                No photographer records found.

            </div>
        `;

        return;

    }


    container.innerHTML =
        filtered.map(function(person) {

            return `

                <div class="photographer-card">

                    <div class="photographer-avatar">
                        📷
                    </div>

                    <h3>
                        ${escapeHTML(person.name)}
                    </h3>

                    <p>
                        📱
                        ${escapeHTML(
                            person.phone || "-"
                        )}
                    </p>

                    <p>
                        ✉️
                        ${escapeHTML(
                            person.email || "-"
                        )}
                    </p>

                    <p>
                        ⭐
                        ${escapeHTML(
                            person.specialty
                        )}
                    </p>

                    <p>

                        <span class="status
                        ${person.status === "Busy"
                            ? "pending"
                            : ""}">

                            ${escapeHTML(
                                person.status
                            )}

                        </span>

                    </p>

                    <br>

                    <button
                        class="delete-btn"
                        onclick="deletePhotographer('${person.id}')">

                        Delete

                    </button>

                </div>

            `;

        }).join("");

}


function deletePhotographer(id) {

    if (!confirm(
        "Delete this photographer?"
    )) {

        return;

    }


    const photographers =
        getData("photographers");


    const updated =
        photographers.filter(function(person) {

            return person.id !== id;

        });


    saveData(
        "photographers",
        updated
    );


    renderPhotographers();

    populateSelects();

    renderDashboard();


    showToast(
        "Photographer deleted"
    );

}



/* =========================================
   SELECT DROPDOWNS
========================================= */

function populateSelects() {

    const students =
        getData("students");

    const photographers =
        getData("photographers");


    const bookingStudent =
        document.getElementById(
            "bookingStudent"
        );


    const photoStudent =
        document.getElementById(
            "photoStudent"
        );


    const bookingPhotographer =
        document.getElementById(
            "bookingPhotographer"
        );



    if (bookingStudent) {

        bookingStudent.innerHTML =
            `<option value="">
                Select Student
             </option>` +

            students.map(function(student) {

                return `

                    <option value="${student.id}">

                        ${escapeHTML(
                            student.name
                        )}

                        -
                        ${escapeHTML(
                            student.reg
                        )}

                    </option>

                `;

            }).join("");

    }



    if (photoStudent) {

        photoStudent.innerHTML =
            `<option value="">
                Select Student
             </option>` +

            students.map(function(student) {

                return `

                    <option value="${student.id}">

                        ${escapeHTML(
                            student.name
                        )}

                    </option>

                `;

            }).join("");

    }



    if (bookingPhotographer) {

        bookingPhotographer.innerHTML =
            `<option value="">
                Select Photographer
             </option>` +

            photographers.map(function(person) {

                return `

                    <option value="${person.id}">

                        ${escapeHTML(
                            person.name
                        )}

                    </option>

                `;

            }).join("");

    }

}



/* =========================================
   BOOKINGS
========================================= */

function renderBookings() {

    const table =
        document.getElementById(
            "bookingTable"
        );

    if (!table) return;


    const bookings =
        getData("bookings");


    const students =
        getData("students");


    const photographers =
        getData("photographers");


    if (bookings.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="7"
                    class="empty">

                    No booking records found.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        bookings.slice().reverse()
        .map(function(booking) {


            const student =
                students.find(function(item) {

                    return item.id ===
                           booking.student;

                });


            const photographer =
                photographers.find(function(item) {

                    return item.id ===
                           booking.photographer;

                });


            return `

                <tr>

                    <td>
                        ${escapeHTML(
                            student?.name ||
                            "Unknown"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            photographer?.name ||
                            "Unknown"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            booking.date
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            booking.time
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            booking.type
                        )}
                    </td>

                    <td>

                        <span class="status
                        ${booking.status === "Pending"
                            ? "pending"
                            : ""}">

                            ${escapeHTML(
                                booking.status
                            )}

                        </span>

                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteBooking('${booking.id}')">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


function deleteBooking(id) {

    if (!confirm(
        "Delete this booking?"
    )) {

        return;

    }


    const bookings =
        getData("bookings");


    saveData(
        "bookings",
        bookings.filter(function(booking) {

            return booking.id !== id;

        })
    );


    renderBookings();

    renderDashboard();


    showToast(
        "Booking deleted"
    );

}



/* =========================================
   GALLERY
========================================= */

function renderGallery() {

    const gallery =
        document.getElementById(
            "galleryGrid"
        );

    if (!gallery) return;


    const photos =
        getData("photos");


    const students =
        getData("students");


    if (photos.length === 0) {

        gallery.innerHTML = `

            <div class="empty">

                No photos uploaded yet.

            </div>

        `;

        return;

    }


    gallery.innerHTML =
        photos.slice().reverse()
        .map(function(photo) {


            const student =
                students.find(function(item) {

                    return item.id ===
                           photo.student;

                });


            return `

                <div class="photo-card">

                    <img
                        src="${photo.data}"
                        alt="${escapeHTML(
                            photo.title
                        )}">


                    <div class="photo-info">

                        <strong>
                            ${escapeHTML(
                                photo.title
                            )}
                        </strong>

                        <small>

                            ${escapeHTML(
                                student?.name ||
                                "Unknown Student"
                            )}

                        </small>

                        <br><br>

                        <button
                            class="delete-btn"
                            onclick="deletePhoto('${photo.id}')">

                            Delete

                        </button>

                    </div>

                </div>

            `;

        }).join("");

}


function deletePhoto(id) {

    if (!confirm(
        "Delete this photo?"
    )) {

        return;

    }


    const photos =
        getData("photos");


    saveData(
        "photos",

        photos.filter(function(photo) {

            return photo.id !== id;

        })
    );


    renderGallery();

    renderDashboard();


    showToast(
        "Photo deleted"
    );

}



/* =========================================
   DASHBOARD
========================================= */

function renderDashboard() {

    const studentCount =
        document.getElementById(
            "studentCount"
        );


    if (!studentCount) return;


    const students =
        getData("students");

    const photographers =
        getData("photographers");

    const bookings =
        getData("bookings");

    const photos =
        getData("photos");


    document.getElementById(
        "studentCount"
    ).textContent =
        students.length;


    document.getElementById(
        "photographerCount"
    ).textContent =
        photographers.length;


    document.getElementById(
        "bookingCount"
    ).textContent =
        bookings.length;


    document.getElementById(
        "photoCount"
    ).textContent =
        photos.length;



    const recent =
        document.getElementById(
            "recentBookings"
        );


    if (!recent) return;


    const recentBookings =
        bookings.slice(-5).reverse();


    if (recentBookings.length === 0) {

        recent.innerHTML = `

            <tr>

                <td colspan="4"
                    class="empty">

                    No recent bookings.

                </td>

            </tr>

        `;

        return;

    }


    recent.innerHTML =
        recentBookings.map(function(booking) {


            const student =
                students.find(function(item) {

                    return item.id ===
                           booking.student;

                });


            const photographer =
                photographers.find(function(item) {

                    return item.id ===
                           booking.photographer;

                });


            return `

                <tr>

                    <td>

                        ${escapeHTML(
                            student?.name ||
                            "Unknown"
                        )}

                    </td>

                    <td>

                        ${escapeHTML(
                            photographer?.name ||
                            "Unknown"
                        )}

                    </td>

                    <td>

                        ${escapeHTML(
                            booking.date
                        )}

                    </td>

                    <td>

                        <span class="status pending">

                            ${escapeHTML(
                                booking.status
                            )}

                        </span>

                    </td>

                </tr>

            `;

        }).join("");

}



/* =========================================
   PAGE INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {


    /* STUDENTS */

    renderStudents();


    const studentSearch =
        document.getElementById(
            "studentSearch"
        );


    if (studentSearch) {

        studentSearch.addEventListener(
            "input",
            function() {

                renderStudents(
                    this.value
                );

            }
        );

    }



    /* PHOTOGRAPHERS */

    renderPhotographers();


    const photographerSearch =
        document.getElementById(
            "photographerSearch"
        );


    if (photographerSearch) {

        photographerSearch.addEventListener(
            "input",
            function() {

                renderPhotographers(
                    this.value
                );

            }
        );

    }



    /* SELECTS */

    populateSelects();



    /* BOOKINGS */

    renderBookings();



    /* GALLERY */

    renderGallery();



    /* DASHBOARD */

    renderDashboard();



    /* =====================================
       STUDENT FORM
    ===================================== */

    const studentForm =
        document.getElementById(
            "studentForm"
        );


    if (studentForm) {

        studentForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const students =
                    getData("students");


                const student = {

                    id: generateID(),

                    name:
                        document.getElementById(
                            "studentName"
                        ).value.trim(),

                    reg:
                        document.getElementById(
                            "studentReg"
                        ).value.trim(),

                    gender:
                        document.getElementById(
                            "studentGender"
                        ).value,

                    course:
                        document.getElementById(
                            "studentCourse"
                        ).value.trim(),

                    year:
                        document.getElementById(
                            "studentYear"
                        ).value,

                    phone:
                        document.getElementById(
                            "studentPhone"
                        ).value.trim()

                };


                const duplicate =
                    students.some(function(item) {

                        return item.reg.toLowerCase() ===
                               student.reg.toLowerCase();

                    });


                if (duplicate) {

                    alert(
                        "Registration number already exists."
                    );

                    return;

                }


                students.push(student);


                saveData(
                    "students",
                    students
                );


                studentForm.reset();


                renderStudents();

                populateSelects();

                renderDashboard();


                showToast(
                    "Student registered successfully!"
                );

            }
        );

    }



    /* =====================================
       PHOTOGRAPHER FORM
    ===================================== */

    const photographerForm =
        document.getElementById(
            "photographerForm"
        );


    if (photographerForm) {

        photographerForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const photographers =
                    getData("photographers");


                const photographer = {

                    id: generateID(),

                    name:
                        document.getElementById(
                            "photographerName"
                        ).value.trim(),

                    phone:
                        document.getElementById(
                            "photographerPhone"
                        ).value.trim(),

                    email:
                        document.getElementById(
                            "photographerEmail"
                        ).value.trim(),

                    specialty:
                        document.getElementById(
                            "photographerSpecialty"
                        ).value,

                    status:
                        document.getElementById(
                            "photographerStatus"
                        ).value

                };


                photographers.push(
                    photographer
                );


                saveData(
                    "photographers",
                    photographers
                );


                photographerForm.reset();


                renderPhotographers();

                populateSelects();

                renderDashboard();


                showToast(
                    "Photographer added successfully!"
                );

            }
        );

    }



    /* =====================================
       BOOKING FORM
    ===================================== */

    const bookingForm =
        document.getElementById(
            "bookingForm"
        );


    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const bookings =
                    getData("bookings");


                const booking = {

                    id: generateID(),

                    student:
                        document.getElementById(
                            "bookingStudent"
                        ).value,

                    photographer:
                        document.getElementById(
                            "bookingPhotographer"
                        ).value,

                    date:
                        document.getElementById(
                            "bookingDate"
                        ).value,

                    time:
                        document.getElementById(
                            "bookingTime"
                        ).value,

                    type:
                        document.getElementById(
                            "bookingType"
                        ).value,

                    status:
                        "Pending"

                };


                bookings.push(
                    booking
                );


                saveData(
                    "bookings",
                    bookings
                );


                bookingForm.reset();


                renderBookings();

                renderDashboard();


                showToast(
                    "Booking created successfully!"
                );

            }
        );

    }



    /* =====================================
       PHOTO UPLOAD
    ===================================== */

    const photoForm =
        document.getElementById(
            "photoForm"
        );


    if (photoForm) {

        photoForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const file =
                    document.getElementById(
                        "photoFile"
                    ).files[0];


                if (!file) {

                    alert(
                        "Please choose a photo."
                    );

                    return;

                }


                if (!file.type.startsWith(
                    "image/"
                )) {

                    alert(
                        "Please select an image file."
                    );

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function() {


                    const photos =
                        getData("photos");


                    const photo = {

                        id: generateID(),

                        student:
                            document.getElementById(
                                "photoStudent"
                            ).value,

                        title:
                            document.getElementById(
                                "photoTitle"
                            ).value.trim(),

                        data:
                            reader.result

                    };


                    photos.push(photo);


                    saveData(
                        "photos",
                        photos
                    );


                    photoForm.reset();


                    renderGallery();

                    renderDashboard();


                    showToast(
                        "Photo uploaded successfully!"
                    );

                };


                reader.readAsDataURL(file);

            }
        );

    }

});/* =========================================
   STUDENT PHOTOGRAPHER SYSTEM
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

const STORAGE = {

    students: "student_photo_students",

    photographers: "student_photo_photographers",

    bookings: "student_photo_bookings",

    photos: "student_photo_photos"

};



/* =========================================
   BASIC FUNCTIONS
========================================= */

function getData(type) {

    return JSON.parse(
        localStorage.getItem(STORAGE[type]) || "[]"
    );

}


function saveData(type, data) {

    localStorage.setItem(
        STORAGE[type],
        JSON.stringify(data)
    );

}


function generateID() {

    return Date.now().toString(36) +
           Math.random().toString(36).substring(2);

}


function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(function () {

        toast.remove();

    }, 2500);

}


function confirmLogout() {

    return confirm(
        "Are you sure you want to logout?"
    );

}


function toggleSidebar() {

    const sidebar =
        document.querySelector(".sidebar");

    if (sidebar) {

        sidebar.classList.toggle("open");

    }

}



/* =========================================
   STUDENTS
========================================= */

function renderStudents(search = "") {

    const table =
        document.getElementById("studentTable");

    if (!table) return;


    const students = getData("students");


    const filtered =
        students.filter(function(student) {

            const text =
                `${student.name}
                 ${student.reg}
                 ${student.course}
                 ${student.phone}`.toLowerCase();

            return text.includes(
                search.toLowerCase()
            );

        });


    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8"
                    class="empty">

                    No student records found.

                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        filtered.map(function(student, index) {

            return `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <strong>
                            ${escapeHTML(student.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(student.reg)}
                    </td>

                    <td>
                        ${escapeHTML(student.gender)}
                    </td>

                    <td>
                        ${escapeHTML(student.course || "-")}
                    </td>

                    <td>
                        ${escapeHTML(student.year || "-")}
                    </td>

                    <td>
                        ${escapeHTML(student.phone || "-")}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteStudent('${student.id}')">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


function deleteStudent(id) {

    if (!confirm("Delete this student?")) {

        return;

    }


    const students =
        getData("students");


    const updated =
        students.filter(function(student) {

            return student.id !== id;

        });


    saveData("students", updated);


    renderStudents();

    populateSelects();

    renderDashboard();


    showToast(
        "Student deleted successfully"
    );

}



/* =========================================
   PHOTOGRAPHERS
========================================= */

function renderPhotographers(search = "") {

    const container =
        document.getElementById(
            "photographerCards"
        );

    if (!container) return;


    const photographers =
        getData("photographers");


    const filtered =
        photographers.filter(function(person) {

            const text =
                `${person.name}
                 ${person.phone}
                 ${person.specialty}`.toLowerCase();

            return text.includes(
                search.toLowerCase()
            );

        });


    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="empty">

                No photographer records found.

            </div>
        `;

        return;

    }


    container.innerHTML =
        filtered.map(function(person) {

            return `

                <div class="photographer-card">

                    <div class="photographer-avatar">
                        📷
                    </div>

                    <h3>
                        ${escapeHTML(person.name)}
                    </h3>

                    <p>
                        📱
                        ${escapeHTML(
                            person.phone || "-"
                        )}
                    </p>

                    <p>
                        ✉️
                        ${escapeHTML(
                            person.email || "-"
                        )}
                    </p>

                    <p>
                        ⭐
                        ${escapeHTML(
                            person.specialty
                        )}
                    </p>

                    <p>

                        <span class="status
                        ${person.status === "Busy"
                            ? "pending"
                            : ""}">

                            ${escapeHTML(
                                person.status
                            )}

                        </span>

                    </p>

                    <br>

                    <button
                        class="delete-btn"
                        onclick="deletePhotographer('${person.id}')">

                        Delete

                    </button>

                </div>

            `;

        }).join("");

}


function deletePhotographer(id) {

    if (!confirm(
        "Delete this photographer?"
    )) {

        return;

    }


    const photographers =
        getData("photographers");


    const updated =
        photographers.filter(function(person) {

            return person.id !== id;

        });


    saveData(
        "photographers",
        updated
    );


    renderPhotographers();

    populateSelects();

    renderDashboard();


    showToast(
        "Photographer deleted"
    );

}



/* =========================================
   SELECT DROPDOWNS
========================================= */

function populateSelects() {

    const students =
        getData("students");

    const photographers =
        getData("photographers");


    const bookingStudent =
        document.getElementById(
            "bookingStudent"
        );


    const photoStudent =
        document.getElementById(
            "photoStudent"
        );


    const bookingPhotographer =
        document.getElementById(
            "bookingPhotographer"
        );



    if (bookingStudent) {

        bookingStudent.innerHTML =
            `<option value="">
                Select Student
             </option>` +

            students.map(function(student) {

                return `

                    <option value="${student.id}">

                        ${escapeHTML(
                            student.name
                        )}

                        -
                        ${escapeHTML(
                            student.reg
                        )}

                    </option>

                `;

            }).join("");

    }



    if (photoStudent) {

        photoStudent.innerHTML =
            `<option value="">
                Select Student
             </option>` +

            students.map(function(student) {

                return `

                    <option value="${student.id}">

                        ${escapeHTML(
                            student.name
                        )}

                    </option>

                `;

            }).join("");

    }



    if (bookingPhotographer) {

        bookingPhotographer.innerHTML =
            `<option value="">
                Select Photographer
             </option>` +

            photographers.map(function(person) {

                return `

                    <option value="${person.id}">

                        ${escapeHTML(
                            person.name
                        )}

                    </option>

                `;

            }).join("");

    }

}



/* =========================================
   BOOKINGS
========================================= */

function renderBookings() {

    const table =
        document.getElementById(
            "bookingTable"
        );

    if (!table) return;


    const bookings =
        getData("bookings");


    const students =
        getData("students");


    const photographers =
        getData("photographers");


    if (bookings.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="7"
                    class="empty">

                    No booking records found.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        bookings.slice().reverse()
        .map(function(booking) {


            const student =
                students.find(function(item) {

                    return item.id ===
                           booking.student;

                });


            const photographer =
                photographers.find(function(item) {

                    return item.id ===
                           booking.photographer;

                });


            return `

                <tr>

                    <td>
                        ${escapeHTML(
                            student?.name ||
                            "Unknown"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            photographer?.name ||
                            "Unknown"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            booking.date
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            booking.time
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            booking.type
                        )}
                    </td>

                    <td>

                        <span class="status
                        ${booking.status === "Pending"
                            ? "pending"
                            : ""}">

                            ${escapeHTML(
                                booking.status
                            )}

                        </span>

                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteBooking('${booking.id}')">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


function deleteBooking(id) {

    if (!confirm(
        "Delete this booking?"
    )) {

        return;

    }


    const bookings =
        getData("bookings");


    saveData(
        "bookings",
        bookings.filter(function(booking) {

            return booking.id !== id;

        })
    );


    renderBookings();

    renderDashboard();


    showToast(
        "Booking deleted"
    );

}



/* =========================================
   GALLERY
========================================= */

function renderGallery() {

    const gallery =
        document.getElementById(
            "galleryGrid"
        );

    if (!gallery) return;


    const photos =
        getData("photos");


    const students =
        getData("students");


    if (photos.length === 0) {

        gallery.innerHTML = `

            <div class="empty">

                No photos uploaded yet.

            </div>

        `;

        return;

    }


    gallery.innerHTML =
        photos.slice().reverse()
        .map(function(photo) {


            const student =
                students.find(function(item) {

                    return item.id ===
                           photo.student;

                });


            return `

                <div class="photo-card">

                    <img
                        src="${photo.data}"
                        alt="${escapeHTML(
                            photo.title
                        )}">


                    <div class="photo-info">

                        <strong>
                            ${escapeHTML(
                                photo.title
                            )}
                        </strong>

                        <small>

                            ${escapeHTML(
                                student?.name ||
                                "Unknown Student"
                            )}

                        </small>

                        <br><br>

                        <button
                            class="delete-btn"
                            onclick="deletePhoto('${photo.id}')">

                            Delete

                        </button>

                    </div>

                </div>

            `;

        }).join("");

}


function deletePhoto(id) {

    if (!confirm(
        "Delete this photo?"
    )) {

        return;

    }


    const photos =
        getData("photos");


    saveData(
        "photos",

        photos.filter(function(photo) {

            return photo.id !== id;

        })
    );


    renderGallery();

    renderDashboard();


    showToast(
        "Photo deleted"
    );

}



/* =========================================
   DASHBOARD
========================================= */

function renderDashboard() {

    const studentCount =
        document.getElementById(
            "studentCount"
        );


    if (!studentCount) return;


    const students =
        getData("students");

    const photographers =
        getData("photographers");

    const bookings =
        getData("bookings");

    const photos =
        getData("photos");


    document.getElementById(
        "studentCount"
    ).textContent =
        students.length;


    document.getElementById(
        "photographerCount"
    ).textContent =
        photographers.length;


    document.getElementById(
        "bookingCount"
    ).textContent =
        bookings.length;


    document.getElementById(
        "photoCount"
    ).textContent =
        photos.length;



    const recent =
        document.getElementById(
            "recentBookings"
        );


    if (!recent) return;


    const recentBookings =
        bookings.slice(-5).reverse();


    if (recentBookings.length === 0) {

        recent.innerHTML = `

            <tr>

                <td colspan="4"
                    class="empty">

                    No recent bookings.

                </td>

            </tr>

        `;

        return;

    }


    recent.innerHTML =
        recentBookings.map(function(booking) {


            const student =
                students.find(function(item) {

                    return item.id ===
                           booking.student;

                });


            const photographer =
                photographers.find(function(item) {

                    return item.id ===
                           booking.photographer;

                });


            return `

                <tr>

                    <td>

                        ${escapeHTML(
                            student?.name ||
                            "Unknown"
                        )}

                    </td>

                    <td>

                        ${escapeHTML(
                            photographer?.name ||
                            "Unknown"
                        )}

                    </td>

                    <td>

                        ${escapeHTML(
                            booking.date
                        )}

                    </td>

                    <td>

                        <span class="status pending">

                            ${escapeHTML(
                                booking.status
                            )}

                        </span>

                    </td>

                </tr>

            `;

        }).join("");

}



/* =========================================
   PAGE INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {


    /* STUDENTS */

    renderStudents();


    const studentSearch =
        document.getElementById(
            "studentSearch"
        );


    if (studentSearch) {

        studentSearch.addEventListener(
            "input",
            function() {

                renderStudents(
                    this.value
                );

            }
        );

    }



    /* PHOTOGRAPHERS */

    renderPhotographers();


    const photographerSearch =
        document.getElementById(
            "photographerSearch"
        );


    if (photographerSearch) {

        photographerSearch.addEventListener(
            "input",
            function() {

                renderPhotographers(
                    this.value
                );

            }
        );

    }



    /* SELECTS */

    populateSelects();



    /* BOOKINGS */

    renderBookings();



    /* GALLERY */

    renderGallery();



    /* DASHBOARD */

    renderDashboard();



    /* =====================================
       STUDENT FORM
    ===================================== */

    const studentForm =
        document.getElementById(
            "studentForm"
        );


    if (studentForm) {

        studentForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const students =
                    getData("students");


                const student = {

                    id: generateID(),

                    name:
                        document.getElementById(
                            "studentName"
                        ).value.trim(),

                    reg:
                        document.getElementById(
                            "studentReg"
                        ).value.trim(),

                    gender:
                        document.getElementById(
                            "studentGender"
                        ).value,

                    course:
                        document.getElementById(
                            "studentCourse"
                        ).value.trim(),

                    year:
                        document.getElementById(
                            "studentYear"
                        ).value,

                    phone:
                        document.getElementById(
                            "studentPhone"
                        ).value.trim()

                };


                const duplicate =
                    students.some(function(item) {

                        return item.reg.toLowerCase() ===
                               student.reg.toLowerCase();

                    });


                if (duplicate) {

                    alert(
                        "Registration number already exists."
                    );

                    return;

                }


                students.push(student);


                saveData(
                    "students",
                    students
                );


                studentForm.reset();


                renderStudents();

                populateSelects();

                renderDashboard();


                showToast(
                    "Student registered successfully!"
                );

            }
        );

    }



    /* =====================================
       PHOTOGRAPHER FORM
    ===================================== */

    const photographerForm =
        document.getElementById(
            "photographerForm"
        );


    if (photographerForm) {

        photographerForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const photographers =
                    getData("photographers");


                const photographer = {

                    id: generateID(),

                    name:
                        document.getElementById(
                            "photographerName"
                        ).value.trim(),

                    phone:
                        document.getElementById(
                            "photographerPhone"
                        ).value.trim(),

                    email:
                        document.getElementById(
                            "photographerEmail"
                        ).value.trim(),

                    specialty:
                        document.getElementById(
                            "photographerSpecialty"
                        ).value,

                    status:
                        document.getElementById(
                            "photographerStatus"
                        ).value

                };


                photographers.push(
                    photographer
                );


                saveData(
                    "photographers",
                    photographers
                );


                photographerForm.reset();


                renderPhotographers();

                populateSelects();

                renderDashboard();


                showToast(
                    "Photographer added successfully!"
                );

            }
        );

    }



    /* =====================================
       BOOKING FORM
    ===================================== */

    const bookingForm =
        document.getElementById(
            "bookingForm"
        );


    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const bookings =
                    getData("bookings");


                const booking = {

                    id: generateID(),

                    student:
                        document.getElementById(
                            "bookingStudent"
                        ).value,

                    photographer:
                        document.getElementById(
                            "bookingPhotographer"
                        ).value,

                    date:
                        document.getElementById(
                            "bookingDate"
                        ).value,

                    time:
                        document.getElementById(
                            "bookingTime"
                        ).value,

                    type:
                        document.getElementById(
                            "bookingType"
                        ).value,

                    status:
                        "Pending"

                };


                bookings.push(
                    booking
                );


                saveData(
                    "bookings",
                    bookings
                );


                bookingForm.reset();


                renderBookings();

                renderDashboard();


                showToast(
                    "Booking created successfully!"
                );

            }
        );

    }



    /* =====================================
       PHOTO UPLOAD
    ===================================== */

    const photoForm =
        document.getElementById(
            "photoForm"
        );


    if (photoForm) {

        photoForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const file =
                    document.getElementById(
                        "photoFile"
                    ).files[0];


                if (!file) {

                    alert(
                        "Please choose a photo."
                    );

                    return;

                }


                if (!file.type.startsWith(
                    "image/"
                )) {

                    alert(
                        "Please select an image file."
                    );

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function() {


                    const photos =
                        getData("photos");


                    const photo = {

                        id: generateID(),

                        student:
                            document.getElementById(
                                "photoStudent"
                            ).value,

                        title:
                            document.getElementById(
                                "photoTitle"
                            ).value.trim(),

                        data:
                            reader.result

                    };


                    photos.push(photo);


                    saveData(
                        "photos",
                        photos
                    );


                    photoForm.reset();


                    renderGallery();

                    renderDashboard();


                    showToast(
                        "Photo uploaded successfully!"
                    );

                };


                reader.readAsDataURL(file);

            }
        );

    }

});