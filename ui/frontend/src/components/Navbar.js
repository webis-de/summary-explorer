import { useReducer } from "react";
import { Link } from "react-router-dom";

function DatasetsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mr-1 h-4 w-4 text-yellow-600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
    </svg>
  );
}

function ModelsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mr-1 inline-block h-4 w-4 text-yellow-600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mr-1 inline-block h-4 w-4 text-yellow-600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ShowIcon() {
  return (
    <svg
      className="block h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function HideIcon() {
  return (
    <svg
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function Navbar({ datasets }) {
  const [isHidden, toggleHidden] = useReducer((v) => !v, true);
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <div className="-ml-2 mr-2 flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleHidden}
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isHidden ? <ShowIcon /> : <HideIcon />}
              </button>
            </div>
            <Link to="/">
              <div
                className="flex-shrink-0"
                style={{ fontFamily: "var(--headers_font), sans-serif" }}
              >
                <span className="font-semibold text-white">Summary</span>{" "}
                <span className="font-extrabold text-yellow-600">Explorer</span>
              </div>
            </Link>
            <div
              className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4"
              style={{ fontFamily: "Open Sans" }}
            >
              <div className="h- flex space-x-2">
                <div className="dropdown relative inline-block">
                  <div className="block rounded-md px-2 py-2 text-sm font-medium text-white hover:text-yellow-600 hover:underline">
                    <div className="relative inline-flex items-center px-0 py-2">
                      <DatasetsIcon />
                      <span> Datasets </span>
                    </div>
                  </div>
                  <ul className="dropdown-menu absolute z-50 -mt-1 hidden bg-blue-900 pt-1 text-white opacity-100 shadow">
                    {datasets.map(({ id, name }) => (
                      <li key={id} className="">
                        <Link
                          className="whitespace-nowrap block bg-blue-900 py-2 px-4 text-xs outline-1 hover:bg-white hover:text-yellow-800 hover:outline hover:outline-blue-800"
                          to={`/main?dataset=${id}`}
                        >
                          {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative inline-block">
                  <Link
                    to="/models"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-white hover:text-yellow-600 hover:underline"
                  >
                    <div className="relative inline-flex items-center px-0 py-2">
                      <ModelsIcon />
                      <span>Models</span>
                    </div>
                  </Link>
                </div>

                <div className="relative inline-block">
                  <Link
                    to="/about"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-white hover:text-yellow-600 hover:underline"
                  >
                    <div className="relative inline-flex items-center px-0 py-2">
                      <AboutIcon />
                      <span>About</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isHidden ? "hidden" : ""}`} id="mobile-menu">
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          <div className="block rounded-md px-3 py-1 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-yellow-600">
            <div className="relative inline-flex items-center px-0 py-1">
              <DatasetsIcon />
              <span>Datasets</span>
            </div>
          </div>

          {datasets.map(({ id, name }) => (
            <Link
              key={id}
              to={`/main?dataset=${id}`}
              className="block rounded-md px-3 py-1 text-base font-medium text-gray-300 hover:text-yellow-600 hover:underline"
            >
              <div className="relative inline-flex items-center py-1 pl-8">
                <span>{name}</span>
              </div>
            </Link>
          ))}

          <Link
            to="/models"
            className="block rounded-md px-3 py-1 text-base font-medium text-gray-300 hover:text-yellow-600 hover:underline"
          >
            <div className="relative inline-flex items-center px-0 py-1">
              <ModelsIcon />
              <span>Models</span>
            </div>
          </Link>

          <Link
            to="/about"
            className="block rounded-md px-3 py-1 text-base font-medium text-gray-300 hover:text-yellow-600 hover:underline"
          >
            <div className="relative inline-flex items-center px-0 py-1">
              <AboutIcon />
              <span>About</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
