/* eslint-disable */
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import { Fragment, useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ListBoxGroups(props) {
  const { s_groups, selected_group, handleSelect } = props;
  const [selected, setSelected] = useState(
    s_groups.filter((group) => group.id === selected_group)[0]
  );
  const handleOnChange = (e) => {
    setSelected(e);
    handleSelect(e.id);
  };
  return (
    <Listbox value={selected} onChange={handleOnChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="hidden w-auto  font-medium text-gray-700">
            Change Models Group
          </Listbox.Label>
          <div className="relative float-right mt-1">
            <Listbox.Button
              className="relative right-0 cursor-default cursor-pointer rounded-md bg-gradient-to-r from-blue-900 to-blue-800 px-2
            py-2 pl-2 text-left text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
              <span className="mr-4 block truncate text-xs">
                Models Group <b className="gold_text">{selected.name}</b>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="absolute z-10 mt-1 max-h-60 w-full   overflow-auto rounded-md bg-yellow-100 py-1 text-base shadow-lg
                ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {s_groups.map((group) => (
                  <Listbox.Option
                    key={group.name}
                    className={({ active }) =>
                      classNames(
                        active ? " gold_text bg-blue-900" : "text-blue-900",
                        "relative cursor-default select-none py-1 pl-3 pr-9 text-xs uppercase"
                      )
                    }
                    value={group}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {group.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "gold_text" : "text-blue-900",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
