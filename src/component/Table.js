import { useState } from "react";

const TableRow = ({
  allusers,
  deleteUser,
  setEditData,
  setUpdateForm,
  setCheckStatus,
}) => {
  let a = [];
  allusers?.forEach((data, key) => {
    data.checked = data.checked || false;
    a.push(
      <tr
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        key={key}
      >
        <td className="px-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={data?.checked}
              onChange={(e) => {
                setCheckStatus(e, key);
              }}
            />
            <label className="sr-only">checkbox</label>
          </div>
        </td>
        <th
          scope="row"
          className="py-4 px-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {data?.username}
        </th>
        <td className="py-4 px-3">{data?.phone}</td>
        <td className="py-4 px-3">{data?.email}</td>
        <td className="py-4 px-3">{data?.hobbies}</td>
        <td className="flex items-center flex-row py-3 px-3 space-x-3 justify-center">
          <button
            type="button"
            className="bg-blue-600 rounded px-2 py-1 text-white flex flex-row"
            onClick={() => {
              setUpdateForm(true);
              setEditData(data);
            }}
          >
            Update
          </button>
          <button
            type="button"
            className="bg-red-600 rounded px-2 py-1 text-white flex flex-row"
            onClick={() => {
              deleteUser(data?.id);
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });
  return a;
};

const UsersTable = ({ data }) => {
  const [checkAll, setCheckAll] = useState(false);

  const setCheckStatus = (e, id) => {
    const s = e.target.checked;
    if (id === "parent") {
      const tmpfn = (var_name, var_fn) => {
        const users = new Map();
        data?.[var_name].forEach((value, key) => {
          users.set(key, {
            ...value,
            checked: s,
          });
          if (s) {
            data?.selectedIDs.current.set(key);
          } else {
            data?.selectedIDs.current.delete(key);
          }
        });
        data?.[var_fn](users);
      };
      tmpfn("users", "setUsers");
      tmpfn("newusers", "setNewUsers");
      setCheckAll(s);
    } else {
      const tmpfn = (var_name, var_fn) => {
        if (data?.[var_name]?.has(id)) {
          const users = new Map(data?.[var_name]);
          users.set(id, {
            ...data?.[var_name]?.get(id),
            checked: s,
          });
          data?.[var_fn](users);
        }
      };
      tmpfn("users", "setUsers");
      tmpfn("newusers", "setNewUsers");

      if (s) {
        data?.selectedIDs.current.set(id);
      } else {
        data?.selectedIDs.current.delete(id);
      }

      setCheckAll(
        data?.selectedIDs?.current?.size ===
          data?.users?.size + data?.newusers?.size
      );
    }

    data?.setDeleteButton(data?.selectedIDs?.current?.size !== 0);
  };

  return (
    <div className="w-[90%] lg:w-[70%] self-center rounded-sm shadow-md text-center text-xl overflow-x-auto">
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={checkAll}
                    onChange={(e) => {
                      setCheckStatus(e, "parent");
                    }}
                  />
                  <label className="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" className="py-3 px-3">
                Name
              </th>
              <th scope="col" className="py-3 px-3">
                Phone number
              </th>
              <th scope="col" className="py-3 px-3">
                Email
              </th>
              <th scope="col" className="py-3 px-3">
                Hobbies
              </th>
              <th scope="col" className="py-3 px-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <TableRow
              allusers={data?.newusers}
              setUpdateForm={data?.showUpdateForm}
              setEditData={data?.setEditData}
              deleteUser={data?.deleteUser}
              setCheckStatus={setCheckStatus}
            />
            <TableRow
              allusers={data?.users}
              setUpdateForm={data?.showUpdateForm}
              setEditData={data?.setEditData}
              deleteUser={data?.deleteUser}
              setCheckStatus={setCheckStatus}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default UsersTable;
