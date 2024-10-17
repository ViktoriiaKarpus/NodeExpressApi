import { v4 as uuid } from "uuid";
import log from '../logger/logger.js';

let users = [];

export const getUsers = (req, res) => {
    log.info("GET request to endpoint '/users' received.");

    res.send(users.length ? users : "There are no users.");
};

export const postUsers = (req, res) => {
    log.info("POST request to endpoint '/users' received.");

    // create user
    const user = req.body;
    const id = uuid();
    users.push({...user, id: id});

    res.send("User created successfully.");
};

export const getUserById = (req, res) =>{
    log.info("GET request to endpoint '/users/id' received.");

    const userId = req.params.id;
    const foundUser = users.find((user) => user.id === userId);

    res.send(foundUser ? foundUser : "User not found.")
};

export const deleteUsers = (req, res) => {
    users = [];

    res.send("DB cleaned successfully");
};

export const deleteUserById = (req, res) => {
    log.info("DELETE request to endpoint '/users/id' received.");

    const userId = req.params.id;

    users = users.filter((user) => user.id !== userId);

    res.send("User was deleted successfully.");
};

export const patchUserById = (req, res) => {
    log.info("PATCH request to endpoint '/users/id' received.");

    const userId = req.params.id;
    const newFirstName = req.body.firstName;
    const newLastName = req.body.lastName;
    const newAge = req.body.age;

    const foundUser = users.find((user) => user.id === userId);

    if(newFirstName) {
        foundUser.firstName = newFirstName;
    };
    if(newLastName) {
        foundUser.lastName = newLastName;
    };
    if(newAge) {
        foundUser.age = newAge;
    };

    res.send("User was updated successfully.")
};