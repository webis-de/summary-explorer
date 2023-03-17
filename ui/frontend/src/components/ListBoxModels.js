/* eslint-disable */
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ListBoxModels(props) {
  const { s_models, selected_model, handleSelect } = props;
  const [selected, setSelected] = useState(
    s_models.filter((model) => model.name === selected_model)[0]
  );
  const handleOnChange = (e) => {
    setSelected(e);
    handleSelect(e.name);
  };
  return (
    <Listbox value={selected} onChange={handleOnChange}>
      {({ open }) => (
        <>
          <Listbox.Label className=" hidden text-xs font-medium text-gray-700">
            Change Summarization Model
          </Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button
              className="relative w-full cursor-default rounded-md border border-red-600 bg-white py-1
            pl-2 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
              <span className="block truncate">{selected.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
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
                className="absolute z-10 mt-1 h-64 max-h-60 w-full overflow-auto rounded-md bg-orange-100 py-1 text-base shadow-lg
                ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {s_models.map((model) => (
                  <Listbox.Option
                    key={model.name}
                    className={({ active }) =>
                      classNames(
                        active ? " bg-red-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-1 pl-3 pr-9 text-xs uppercase"
                      )
                    }
                    value={model}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                          title={model.title}
                        >
                          {model.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-red-600",
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
