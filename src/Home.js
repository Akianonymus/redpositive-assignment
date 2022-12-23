import axios from "axios";
import { useMemo, useRef, useState } from "react";
import EditModal from "./component/EditModal";
import UsersTable from "./component/Table";
import Message from "./component/Message";
import API_URL from "./utils";
import emailjs from "@emailjs/browser";

const User = async (data, success, error, cleanup, method = "post") => {
  const url = `${API_URL}/`;

  const config = {
    method: method,
    url: url,
  };

  switch (data.name) {
    case "new":
      config.url += "new/";
      config.data = data?.body;
      break;
    case "update":
      config.url += "update/" + data?.body?.id;
      config.data = data?.body;
      break;
    case "delete":
      config.url += "delete/" + data?.body?.id;
      break;
    case "batchdelete":
      config.url += "batchdelete";
      config.data = data?.body;
      break;
    case "deleteall":
      config.url += "deleteall";
      break;
    default:
      break;
  }

  await axios(config)
    .then((result) => {
      success(result);
    })
    .catch((err) => {
      error(err);
    });
  cleanup();
};

const Home = function () {
  const [msg, setMsg] = useState("");
  const [spinner, setSpinner] = useState(false);

  const [updateForm, showUpdateForm] = useState(false);
  const [newForm, showNewForm] = useState(false);

  const [username, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hobbies, setHobbies] = useState("");

  const [editId, setEditId] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editHobbies, setEditHobbies] = useState("");

  const [users, setUsers] = useState(new Map());
  const [newusers, setNewUsers] = useState(new Map());

  const selectedIDs = useRef(new Map());
  const [deleteButton, setDeleteButton] = useState(false);

  const user = [];
  user.Add = (data) => {
    const { username, phone, email, hobbies } = data;
    const body = { username, phone, email, hobbies };
    User(
      { name: "new", body },
      (result) => {
        const id = result?.data?.result?._id;
        const dat = new Map([...newusers]).set(id, {
          username,
          phone,
          email,
          hobbies,
          id,
        });

        setNewUsers(dat);

        // reset variables
        setUserName("");
        setPhone("");
        setEmail("");
        setHobbies("");
      },
      (error) => {
        const res = error.response;
        switch (res.status) {
          case 409:
            setMsg(`Given username already exists [ ${username} ].`);
            console.log(error?.message);
            break;
          default:
            setMsg("Bad request");
            console.log(error.response);
            break;
        }
      },
      () => {}
    );
  };

  user.Update = (data) => {
    const { username, phone, email, hobbies } = data;
    const id = editId;
    const body = { username, phone, email, hobbies, id };
    User(
      { name: "update", body },
      (_) => {
        if (users.has(id)) {
          const dat = new Map([...users]).set(id, body);
          setUsers(dat);
        }

        if (newusers.has(id)) {
          const dat = new Map([...newusers]).set(id, body);
          setNewUsers(dat);
        }
      },
      (error) => {
        const res = error.response;
        switch (res.status) {
          case 409:
            setMsg(`Given username already exists [ ${username} ].`);
            console.log(error?.message);
            break;
          default:
            setMsg("Bad request");
            console.log(error.response);
            break;
        }
      },
      () => {},
      "put"
    );
  };

  user.Delete = (id) => {
    const body = { id };
    User(
      { name: "delete", body },
      (_) => {
        if (users.has(id)) {
          const dat = new Map(users);
          dat.delete(id);
          setUsers(dat);
        }

        if (newusers.has(id)) {
          const dat = new Map(newusers);
          dat.delete(id);
          setNewUsers(dat);
        }
      },
      (error) => {
        console.log("Bad request");
        console.log(error.response);
      },
      () => {},
      "delete"
    );
  };

  user.DeleteSelected = () => {
    const body = { ids: [] };
    selectedIDs.current.forEach((_, id) => {
      if (newusers.has(id)) {
        body.ids.push(id);
      }
      if (users.has(id)) {
        body.ids.push(id);
      }
    });

    User(
      { name: "batchdelete", body },
      (_) => {
        const tmpusers = users;
        const tmpnewusers = newusers;
        selectedIDs.current.forEach((_, id) => {
          if (newusers.has(id)) {
            tmpnewusers.delete(id);
          }
          if (users.has(id)) {
            tmpusers.delete(id);
          }
        });
        setUsers(tmpusers);
        setNewUsers(tmpnewusers);
        selectedIDs.current.clear();
        setDeleteButton(false);
      },
      (error) => {
        console.log("Bad request");
        console.log(error.response);
      },
      () => {},
      "delete"
    );
  };

  user.sendSelected = async () => {
    if (selectedIDs.current.size === 0) {
      setMsg("Select user to send data.");
      return;
    }

    let formData = "";
    selectedIDs.current.forEach((_, id) => {
      if (newusers.has(id)) {
        const value = newusers.get(id);
        formData += `
    Name: ${value?.username}
    Phone Number: ${value?.phone}
    Email: ${value?.email}
    Hobbies: ${value?.hobbies}
`;
      }
      if (users.has(id)) {
        const value = users.get(id);
        formData += `
    Name: ${value?.username}
    Phone Number: ${value?.phone}
    Email: ${value?.email}
    Hobbies: ${value?.hobbies}
`;
      }
    });

    setSpinner(true);
    setMsg("Sending data to email...");
    await emailjs
      .send(
        process.env?.REACT_APP_EMAILJS_SERVICE_ID,
        process.env?.REACT_APP_EMAILJS_TEMPLATE_ID,
        { message: formData, from_name: "Akianonymus", to_name: "RedPositive" },
        process.env?.REACT_APP_EMAILJS_USER_ID
      )
      .then(
        (_) => {
          setMsg("Data sent to email.");
        },
        (error) => {
          setMsg("Failed to send data. " + error.text);
          console.log(error);
        }
      );
    setSpinner(false);
  };

  const setEditData = (data) => {
    setEditUserName(data?.username);
    setEditPhone(data?.phone);
    setEditEmail(data?.email);
    setEditHobbies(data?.hobbies);
    setEditId(data?.id);
  };

  useMemo(() => {
    async function fetchUsers() {
      const configuration = {
        method: "get",
        url: `${API_URL}/users`,
      };

      setMsg("Fetching users from server");
      setSpinner(true);

      let done = false;
      let tmpmsg = "";
      await axios(configuration)
        .then((result) => {
          done = true;
          let dat = new Map();
          // modify the result array to a Map for easy insertion, deletion
          // reverse so new items are shown first
          result.data?.users?.forEach((user) => {
            const { username, phone, email, hobbies } = user;
            const id = user?._id;
            dat.set(id, {
              username,
              phone,
              email,
              hobbies,
              id,
            });
          });

          setUsers(dat);
        })
        .catch((error) => {
          console.log("Error: Cannot fetch users " + error.message);
          tmpmsg = error.toJSON().message;
          return;
        });

      done ? setMsg("") : setMsg("Couldn't fetch users. " + tmpmsg);
      setSpinner(false);
    }

    fetchUsers();
  }, []);

  return (
    <>
      <div className="flex flex-col mt-2 justify-center">
        <div className="bg-gray-300 dark:bg-slate-800 w-[90%] lg:w-[70%] self-center rounded-md shadow-md p-2 text-center text-2xl m-2">
          {users.size + newusers.size === 0 ? "No Users" : "Users"}
        </div>

        <Message msg={msg} setMsg={setMsg} spinner={spinner}></Message>

        {users.size + newusers.size === 0 ? null : (
          <UsersTable
            data={{
              users,
              setUsers,
              newusers,
              setNewUsers,
              showUpdateForm,
              selectedIDs,
              setDeleteButton,
              setEditData,
              deleteUser: user.Delete,
            }}
          />
        )}

        <div className="flex flex-col w-full self-center rounded-md text-center text-2xl sticky bottom-0 mt-2">
          <div className="flex flex-row backdrop-blur-lg w-[90%] lg:w-[70%] self-center rounded-md shadow-md text-center text-2xl mt-2">
            <button
              type="button"
              className="bg-blue-700 hover:bg-blue-600 text-white rounded py-1 px-4 w-full my-2 mr-4"
              onClick={() => showNewForm(true)}
            >
              Add User
            </button>

            <button
              type="button"
              className="bg-green-600 hover:bg-green-500 text-white rounded py-1 px-4 w-full my-2 ml-4"
              onClick={user.sendSelected}
            >
              Send Data
            </button>
          </div>
          {deleteButton && (
            <div className="backdrop-blur-lg self-center w-[90%] lg:w-[70%] rounded-md shadow-md text-center text-2xl">
              <button
                type="button"
                className="bg-red-600 hover:bg-red-500 text-white rounded py-1 px-4 w-full my-2 mr-4"
                onClick={user.DeleteSelected}
              >
                Delete Selected Items
              </button>
            </div>
          )}
        </div>
      </div>
      {updateForm && (
        <EditModal
          data={{
            username: editUserName,
            phone: editPhone,
            email: editEmail,
            hobbies: editHobbies,
            setName: setEditUserName,
            setEmail: setEditEmail,
            setPhone: setEditPhone,
            setHobbies: setEditHobbies,
          }}
          showForm={showUpdateForm}
          submit={user.Update}
          formdata={{
            title: "Edit User",
            submit: "Save Changes",
          }}
        />
      )}
      {newForm && (
        <EditModal
          data={{
            username,
            phone,
            email,
            hobbies,
            setName: setUserName,
            setEmail,
            setHobbies,
            setPhone,
          }}
          showForm={showNewForm}
          submit={user.Add}
          formdata={{
            title: "New User",
            submit: "Add",
          }}
        />
      )}
    </>
  );
};

export default Home;
