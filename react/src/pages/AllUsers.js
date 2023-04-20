import React, { useState, useEffect } from "react";
import '../style.css';
import axios from "axios";
import plus from '../plus.svg';
import editicon from '../editicon.svg';
import deleteicon from '../delete.svg';
import cancelicon from '../cancel.svg';
import saveicon from '../save.svg';

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
});

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    api.get("/users/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditUsername(user.username);
    setEditEmail(user.email);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    const user = { username: editUsername, email: editEmail };
    api.put(`/users/${editingUser}/`, user)
      .then((response) => {
        console.log(response.data);
        setEditingUser(null);
        setEditUsername("");
        setEditEmail("");
        api.get("/users/")
          .then((response) => {
            setUsers(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (userId) => {
    api.delete(`/users/${userId}/`)
      .then((response) => {
        console.log(response.data);
        api.get("/users/")
          .then((response) => {
            setUsers(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container">
          <table className="namelist">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{editingUser === user.id ? (
              <input className="createuser__input" type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
            ) : (
              user.username
            )}</td>
            <td>{editingUser === user.id ? (
              <input className="createuser__input" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            ) : (
              user.email
            )}</td>
            <td className="action-btns">
              {editingUser === user.id ? (
                <div className="action-btns">
                  <button className="rounded-btn" onClick={handleUpdate}> <img src={saveicon} alt="saveicon"></img> </button>
                  <button  className="rounded-btn" onClick={() => setEditingUser(null)}> <img src={cancelicon}></img> </button>
                </div>
              ) : (
                <>
                  <button className="rounded-btn" onClick={() => handleEdit(user)}> <img src={editicon} alt="editicon"></img> </button>
                  <button className="rounded-btn" onClick={() => handleDelete(user.id)}> <img src={deleteicon} alt="delete"></img> </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

function UserCreate() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [islogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [key, setKey] = useState(0); // key state'i

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = { username, email, islogged, password };
    api.post("/users/", user)
      .then((response) => {
        console.log(response.data);
        setUsername("");
        setEmail("");
        setIsLogged(false);
        setPassword("");
        setKey(key + 1); 
        api.get("/users/")
          .then((response) => {
            setUsers(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container">
      <form className="createuser" key={key} onSubmit={handleSubmit}> {}
      <label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="createuser__input"
        />
      </label>
      <label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="createuser__input"
        />
      </label>
      <label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="createuser__input"
        />
      </label>
      <button className="rounded-btn" type="submit"> <img src={plus} alt="plus"></img> </button>
    </form>
    </div>
  );
}

function App() {
return (
<div>
<h1>Dashboard</h1>
<UserList />
<UserCreate />
</div>
);
}

export default App;