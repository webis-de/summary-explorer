/* eslint-disable */
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const QUESTIONS = [
  { id: 1, question: "What parts of a document are captured by a summary?" },
  {
    id: 3,
    question: "Which entities from a document are captured by a summary?",
  },
  {
    id: 4,
    question: "Which relations from a document are captured by a summary?",
  },
  { id: 2, question: "What are the hallucinations in a summary?" },
  {
    id: 5,
    question: "Which parts of a single document do all summaries come from?",
  },
];

export default function ListBoxQuestions(props) {
  const { selected_question, handleSelect } = props;
  const [selected, setSelected] = useState(
    QUESTIONS.filter((q) => q.id === selected_question)[0]
  );

  const handleOnChange = (e) => {
    setSelected(e);
    handleSelect(e.id, e.question);
  };
  return (
    <Listbox value={selected} onChange={handleOnChange}>
      {({ open }) => (
        <>
          <div>
            <Listbox.Button className="relative right-0 cursor-pointer py-2 text-left text-blue-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="header_font mr-4  block truncate pr-3 font-semibold">
                <b className="text-blue-800">{selected.question}</b>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-3 h-4 w-4 text-blue-800"
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
                className="absolute z-10 mt-1  max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg
                ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {QUESTIONS.map((group) => (
                  <Listbox.Option
                    key={group.question}
                    className={({ active }) =>
                      classNames(
                        active
                          ? " font-semibold text-red-600"
                          : "text-blue-900",
                        "  header_font relative cursor-default select-none py-1 pl-3 pr-9 font-semibold"
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
                          {group.question}
                        </span>
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
