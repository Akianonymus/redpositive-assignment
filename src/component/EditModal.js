import { useState } from "react";
import { BiErrorCircle } from "react-icons/bi";

const labelClass =
  " block mr-2 px-2 py-2 mt-2 font-semibold dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md text-center w-full max-w-[135px]";
const inputClass =
  " block w-full px-3 py-2 mt-2 dark:bg-gray-900 dark:text-gray-100 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 ";
const errClass = "text-red-500 pl-1 text-sm  flex flex-row items-center pt-1";

const Error = ({ err }) => {
  if (!err || err === "") return <></>;

  return (
    <p className={errClass}>
      <BiErrorCircle className="mr-1" />
      {err}
    </p>
  );
};
const regEmail = new RegExp(/\S+@\S+\.\S+/);
const isValidEmail = (email) => {
  return regEmail.test(email);
};

const regPhone = new RegExp(
  "[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}"
);
const isValidPhone = (phone) => {
  return regPhone.test(phone);
};

const EditModal = ({ data, submit, showForm, formdata }) => {
  const [errName, setErrName] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errHobbies, setErrHobbies] = useState("");

  const handle = {};
  handle.username = (value) => {
    let ret = true;
    let msg = "";
    if (value === "") {
      msg = "Empty Username";
    } else {
      msg = "";
      ret = false;
    }
    data?.setName(value);
    setErrName(msg);
    return ret;
  };

  handle.phone = (value) => {
    let ret = true;
    let msg = "";
    if (value === "") {
      msg = "Empty Phone number";
    } else if (!isValidPhone(value)) {
      msg = "Invalid Phone Number";
    } else {
      msg = "";
      ret = false;
    }
    data?.setPhone(value);
    setErrPhone(msg);
    return ret;
  };

  handle.email = (value) => {
    let ret = true;
    let msg = "";
    if (value === "") {
      msg = "Empty Email";
    } else if (!isValidEmail(value)) {
      msg = "Invalid Email";
    } else {
      msg = "";
      ret = false;
    }
    data?.setEmail(value);
    setErrEmail(msg);
    return ret;
  };

  handle.hobbies = (value) => {
    let ret = true;
    let msg = "";
    if (value === "") {
      msg = "Empty Hobbies";
    } else {
      msg = "";
      ret = false;
    }
    data?.setHobbies(value);
    setErrHobbies(msg);
    return ret;
  };

  const handleSubmit = (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();

    let ret = "";
    ret += handle.username(data?.username);
    ret += handle.phone(data?.phone);
    ret += handle.email(data?.email);
    ret += handle.hobbies(data?.hobbies);
    if (ret.includes(true)) return;

    submit(data);

    showForm(false);
  };
  return (
    <>
      <div
        className="justify-center items-center flex backdrop-blur-[2px] fixed inset-0 z-50 outline-none focus:outline-none overflow-auto"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        onClick={() => showForm(false)}
      >
        <div
          className="bg-gray-200 dark:bg-gray-900 my-6 mx-auto sm:w-[70%] lg:w-[60%] w-[80%] modalOpen rounded-lg shadow-md border border-gray-500 dark:border-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col outline-none focus:outline-none ">
            {/*header*/}
            <div className="flex justify-center p-5 border-b border-solid  dark:border-gray-600 border-gray-500 rounded-t">
              <h3 className="text-3xl font-semibold">{formdata.title}</h3>
            </div>
            {/*body*/}
            <div className="relative p-6  flex-auto">
              <div className="p-2 rounded-md ">
                <form className="mt-6 ">
                  <div className="mb-2">
                    <div className="flex flex-row items-center">
                      <label type="text" className={labelClass}>
                        Name
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        variant="name"
                        onChange={(e) => handle.username(e.target.value)}
                        value={data?.username}
                        placeholder="Enter Username"
                      />
                    </div>
                    <Error err={errName} />
                  </div>

                  <div className="mb-2">
                    <div className="flex flex-row items-center">
                      <label type="text" className={labelClass}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className={inputClass}
                        variant="phone"
                        value={data?.phone}
                        onChange={(e) => handle.phone(e.target.value)}
                        placeholder="Enter Phone number"
                      />
                    </div>

                    <Error err={errPhone} />
                  </div>
                  <div className="mb-2">
                    <div className="flex flex-row items-center">
                      <label type="text" className={labelClass}>
                        Email
                      </label>
                      <input
                        type="email"
                        className={inputClass}
                        variant="email"
                        value={data?.email}
                        onChange={(e) => handle.email(e.target.value)}
                        placeholder="Enter Email"
                      />
                    </div>
                    <Error err={errEmail} />
                  </div>
                  <div className="mb-2">
                    <div className="flex flex-row items-center">
                      <label type="text" className={labelClass}>
                        Hobbies
                      </label>
                      <textarea
                        type="text"
                        className={
                          inputClass + " resize-y min-h-[50px] max-h-[33vh]"
                        }
                        variant="hobbies"
                        value={data?.hobbies}
                        onChange={(e) => handle.hobbies(e.target.value)}
                        placeholder="Enter hobbies"
                        rows={1}
                      />
                    </div>
                    <Error err={errHobbies} />
                  </div>
                  <button
                    className="hidden"
                    type="submit"
                    onClick={(e) => handleSubmit(e)}
                  />
                </form>
              </div>
            </div>
            {/*footer*/}
            <div className="text-white flex flex-row flex-wrap justify-between p-6 border-t border-solid dark:border-gray-600 border-gray-500 rounded-b">
              <button
                className="bg-red-500  hover:bg-red-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mx-4 mb-1 flex-1"
                type="button"
                onClick={() => showForm(false)}
              >
                Close
              </button>
              <button
                className="bg-blue-500 hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mx-4 mb-1 flex-1"
                type="button"
                onClick={(e) => handleSubmit(e)}
              >
                {formdata?.submit}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditModal;
