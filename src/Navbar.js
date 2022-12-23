import { TbMoonStars } from "react-icons/tb";

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <h1 className="flex flex-row tracking-wider items-center relative pt-4 pb-4">
      <div className="flex flex-row items-stretch mx-auto list-none text-2xl ">
        <div className="flex items-center py-2 bg-gray-200 dark:bg-gray-700 rounded-md px-5 ml-3 hover:bg-gray-300 dark:hover:bg-gray-600">
          <button
            className="flex flex-row items-center"
            onClick={() => window.location.reload()}
          >
            Full Stack Assignment
          </button>
        </div>
        <button
          title="Toggle Theme"
          aria-label="Toggle theme"
          className="flex items-center py-2 bg-gray-200 dark:bg-gray-700 rounded-md px-3 mx-3 hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => setDarkMode(darkMode ? false : true)}
        >
          <TbMoonStars className={"text-2xl"} />
        </button>
      </div>
    </h1>
  );
};
export default Navbar;
