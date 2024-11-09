const appName = document.getElementById('appName');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const ageInput = document.getElementById('age');
const addButton = document.getElementById('addButton');
const usersList = document.getElementById('usersList');
const form = document.getElementById('form-user');

let rowNumber = 1;

//mock data
const usersFromData = [
    {
        "firstName": "John",
        "lastName": "Doe",
        "age": 35,
        "id": "7254r79r1r24761076rr"
    },
    {
        "firstName": "Jane",
        "lastName": "Doe",
        "age": 30,
        "id": "7254r79r1r24761076rr"
    },
    {
        "firstName": "Johnny",
        "lastName": "Doe",
        "age": 5,
        "id": "7254r79r1r24761076rr"
    }
]

const storedUsers = JSON.parse(JSON.stringify(usersFromData));

class User {
    constructor(firstName, lastName, age, id) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.id = id;
    }
}

class UI {
    static async displayAppName() {
        try {
            appName.innerText =  await AppService.getAppName();
        } catch(error) {
            console.error('Error while catching app name: ', error);
            throw error;
        }
    }

    static isFormValid() {
        const isFirstNameValid = firstNameInput.value.trim().length > 0;
        const isLastNameValid = lastNameInput.value.trim().length > 0;
        const isAgeValid = ageInput.value.trim().length > 0;

        return isFirstNameValid && isLastNameValid && isAgeValid;
    }

    static activateAddButton() {
        const isValid = UI.isFormValid();

        console.log("isValid Form = ", isValid);

        addButton.disabled = !isValid;
    }

    static async  displayUsers() {
        // const users = storedUsers //Mock data;
        const users = await UserService.getUsers() || []; //API call GET users;
        console.log(users);
        //console.log(users.size);

        if(users.size) {
            users.forEach((user) => {
                console.log('user = ', user);
                UI.addUserToList(user);
            })
        }
    }

    static async createUser() {
        if(UI.isFormValid()) {
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            const age = ageInput.value;

            //API call POST to endpoint '/users'
            await UserService.postUsers(firstName, lastName, age);

            //API call GET to endpoint '/users'
            const users = await UserService.getUsers();

            console.log("users from GET call", users);

            let userID = 0;
            let newUser = {};

            users.forEach((user) => {
                if(user.firstName === firstName
                    && user.lastName === lastName
                    && user.age === age
                ) {
                    userID = user.id;
                    console.log("userID from server = ", userID);

                    newUser = new User(user.firstName, user.lastName, user.age, userID);
                    console.log("Object of class User (OOP): ", newUser);
                }
            })

            return newUser;
        }
    }

    static addUserToList(user) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row">${rowNumber}</th>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.id}</td>
        `;

        usersList.appendChild(row);
        rowNumber ++;
    }

}

class AppService {
    static getAppName() {
        return fetch("http://localhost:5009/api/")
            .then(response => {
                if (response.status !== 200) {
                    console.error("[ERROR] Response status: ", response.status);
                    throw new Error('Failed to fetch app name. Unexpected response status.')
                }

                return response.text();
            })
            .catch(error => {
                console.error('[ERROR] Fetch error:', error);
                throw error;
            })
    }
}

class UserService {
    static getUsers() {
        return fetch("http://localhost:5009/api/users/")
            .then(response => {
                if (response.status !== 200) {
                    console.error("[ERROR] Response status:", response.status);
                    throw new Error("Failed to fetch users.");
                }
                //if response.code === 200,  we have 2 ways
                const contentType = response.headers.get('Content-Type');

                if(contentType.includes('text/html')) {
                    //1. "There are no users."
                    //      if Content-Type = 'text/html'
                    return response.text();
                } else if (contentType.includes('application/json')) {
                    //2. list of users in json format
                    //      if Content-Type = 'application/json'
                    return response.json();
                //catchError
                } else {
                    console.error("[ERROR] Unexpected Content-Type: ", contentType);
                    throw new Error("Unexpected Content-Type.");
                }
            })
            .catch(error => {
                console.error("Fetch error: ", error);
                throw error;
             })
    }

    static async postUsers(firstName, lastName, age) {
        if (!firstName || !lastName || age === undefined) {
            console.error("[ERROR] Invalid parameters.")
            throw new Error("Invalid parameters.");
        }

        try {
            const response = await fetch(
                "http://localhost:5009/api/users/",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            firstName: firstName,
                            lastName: lastName,
                            age: age,
                        }
                    )
                })

            if (response.status !== 200) {
                console.error("[ERROR] Response status:", response.status);
                throw new Error("Failed to post users.");
            }

            const contentType = response.headers.get('Content-Type');

            if (contentType.includes('text/html')) {

                return await response.text();
            } else {
                console.error("[ERROR] Unexpected Content-Type: ", contentType);
                throw new Error("Unexpected Content-Type.");
            }
        } catch (error) {
            console.error("Fetch error: ", error);
            throw error;
        }
    }
}

//event to show App Name
document.addEventListener('DOMContentLoaded', UI.displayAppName);

//event to activate Add button
document.addEventListener('input', UI.activateAddButton);

//event to display users
document.addEventListener('DOMContentLoaded', UI.displayUsers);

//event to add user to DB, get list of all users,
// find specific user, create user as an object,
// and display specific user in a table

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const user = await UI.createUser();
    UI.addUserToList(user);

    form.reset();
    addButton.disabled = true;


})



