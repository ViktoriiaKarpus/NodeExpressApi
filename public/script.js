const appName = document.getElementById('appName');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const ageInput = document.getElementById('age');
const addButton = document.getElementById('addButton');
const usersList = document.getElementById('usersList');

let rowNumber = 1;

//mock data
const usersFromData = [
    {
        "firstName": "John",
        "lastName": "Doe",
        "age": 35,
        "id": "46456131246545121"
    },
    {
        "firstName": "Jane",
        "lastName": "Doe",
        "age": 30,
        "id": "46456131246545121"
    },
    {
        "firstName": "Johnny",
        "lastName": "Doe",
        "age": 5,
        "id": "46456131246545121"
    }
]

const storedUsers = JSON.parse(JSON.stringify(usersFromData));

class UI {
    static async displayAppName() {
        try {
            appName.innerText = await UserService.getAppName();
        } catch (error) {
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

    static displayUsers() {
        const users = storedUsers;

        if (users.length) {
            users.forEach((user) => {
                console.log('user = ', user);
                UI.addUserToList(user);
            })
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

class UserService {
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

//event to show App Name
document.addEventListener('DOMContentLoaded', UI.displayAppName);

// event to activate addButton
document.addEventListener('input', UI.activateAddButton);

// event to display Users
document.addEventListener('DOMContentLoaded', UI.displayUsers);