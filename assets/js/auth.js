class CustomLocalStorage {
    static saveToLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    static create(key, value) {
        CustomLocalStorage.saveToLocalStorage(key, value);
    }

    static read(key) {
        return CustomLocalStorage.getFromLocalStorage(key);
    }

    static update(key, value) {
        CustomLocalStorage.saveToLocalStorage(key, value);
    }

    static delete(key) {
        localStorage.removeItem(key);
    }

    static clearLocalStorage(key) {
        localStorage.removeItem(key);
    }

    static clearAllData() {
        localStorage.clear();
    }
}

class Middleware {
    static authEndpoints = ['dashboard.html', 'profile.html'];

    static redirectIfNotAuthenticate() {
        const session = CustomLocalStorage.read('session');
        const currentURL = window.location.href;
        let endpoint = currentURL.split("/").pop();

        if (session.length === 0) {
            if (this.authEndpoints.includes(endpoint)) {
                window.location.href = 'signin.html';
            }
        }
        //  else {
        //     if (!this.authEndpoints.includes(endpoint)) {
        //         window.location.href = 'dashboard.html';
        //     }
        // }
    }
}

// redirect to signin if authorized routes are try to access
Middleware.redirectIfNotAuthenticate();

class Role {
    static removeItemsFromSidebarBasedOnRole(role) {
        var listItems = document.querySelectorAll('.sidebar-nav .nav-item');
        const existRoles = ['admin', 'projectmanager', 'staff'];
        const isAdmin = CustomLocalStorage.read('session').role === 'admin' ? true : false;

        if (!isAdmin) {
            listItems.forEach(function (item) {
                var dataRoles = item.getAttribute('data-roles');
                if (!dataRoles) {
                    item.remove();
                    return;
                }

                var allowedRoles = item.getAttribute('data-roles').split(',');
                if (!allowedRoles.includes(role)) {
                    item.remove();
                }
            });
        }
    }
}

const signUpForm = document.querySelector('#signUpForm')
if (signUpForm) {
    document.getElementById('signUpForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;
        var password = document.getElementById('password').value;
        var password = CryptoJS.AES.encrypt(password, 'secretKey').toString();

        // Check if the "users" key exists in localStorage
        let users = CustomLocalStorage.read('users') || [];
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            alert('User with this email already exists! Please use a different email.');
            return;
        }

        const newUser = { name, email, password, role };
        users.push(newUser);

        CustomLocalStorage.create('users', users);
        console.log('User registered successfully!');

        document.getElementById('signUpForm').reset();
        window.location.href = 'signin.html';
    });
}

const signInForm = document.querySelector('#signInForm')
if (signInForm) {
    document.getElementById('signInForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let users = CustomLocalStorage.read('users') || [];
        const user = users.find(user => user.email === email);
        const decryptedPassword = decryptPassword(user.password);

        if (!user) {
            alert('User not found! Please check your email.');
            return;
        }

        if (decryptedPassword !== password) {
            alert('Incorrect password! Please try again.');
            return;
        }

        delete user.password;
        CustomLocalStorage.create('session', user);

        window.location.href = 'dashboard.html';
    });
}

function decryptPassword(encryptedPassword) {
    const secretKey = 'secretKey'; // Use the same secret key used for encryption

    // Decrypt the password using CryptoJS
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedPassword;
}

const signOut = document.getElementById('signOut')
if (signOut) {
    signOut.addEventListener('click', (event) => {
        event.preventDefault();
        CustomLocalStorage.delete('session');
        window.location.href = 'index.html';
    })
}

// only shows role based sidebar nav items after login
const currentUser = CustomLocalStorage.read('session');
Role.removeItemsFromSidebarBasedOnRole(currentUser.role);

const taskForm = document.querySelector('#taskForm')
// console.log(document.getElementById('taskCreateBtn'));
if (taskForm) {
    document.getElementById('taskCreateBtn').addEventListener('click', function (event) {
        event.preventDefault();

        let tasks = CustomLocalStorage.read('tasks') || [];

        const taskCreatedBy = currentUser.email;
        const project = document.getElementById('project').value;
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const priority = document.getElementById('priority').value;
        const assign_to = document.getElementById('assign_to').value;
        const due_date = document.getElementById('due_date').value;

        const existingTask = tasks.find(task => task.title === title);

        if (existingTask) {
            alert('Task with same title already exists!');
            return;
        } else {
            const newTasks = { taskCreatedBy, project, title, description, priority, assign_to, due_date };
            tasks.push(newTasks);
            CustomLocalStorage.create('tasks', tasks);
            console.log('Tasks created successfully!');
        }

        document.getElementById('taskForm').reset();
        window.location.reload();
    });
}

window.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('aside')) {
        loadSidebar();
    }

    if (document.querySelector('header')) {
        loadHeader({
            'sessionUserName': currentUser.name,
            'sessionUserRole': currentUser.role,
            'sessionUserEmail': currentUser.email
        });
    }

    if (document.querySelector('footer')) {
        loadFooter({
            'developedBy': 'Admin Template'
        });
    }
});