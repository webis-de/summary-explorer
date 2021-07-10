import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import React from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ListBoxQuestions(props) {
  const questions = [{id: 1, question: "What parts of a document are captured by a summary?"},
                    {id: 3, question: "Which entities from a document are captured by a summary?"},
                    {id: 4, question: "Which relations from a document are captured by a summary?"},
                    {id: 2, question: "What are the hallucinations in a summary?"},
                    {id: 5, question: "Which parts of a single document do all summaries come from?"}]
  const {selected_question, handleSelect} = props;
  const [selected, setSelected] = useState(questions.filter(q => q.id===selected_question)[0])

  const handleOnChange = (e)=>{
    setSelected(e);
   handleSelect(e.id, e.question);
  }
  return (
    <Listbox value={selected} onChange={handleOnChange}>
      {({ open }) => (
        <>
          <div>
            <Listbox.Button className="text-blue-800  relative  right-0
            py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer">
              <span className="block header_font  font-semibold truncate mr-4 pr-3"><b className="text-blue-800">{selected.question}</b></span>
              <span className="absolute inset-y-0 right-0 flex items-center px-1 pointer-events-none text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-4 w-4 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
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
                className="absolute z-10 mt-1  bg-white  shadow-lg max-h-60 rounded-md py-1 text-base ring-1
                ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {questions.map((group) => (
                  <Listbox.Option
                    key={group.question}
                    className={({ active }) =>
                      classNames(
                        active ? ' text-red-600 font-semibold' : 'text-blue-900',
                        '  font-semibold header_font cursor-default select-none relative py-1  pr-5  pl-3 pr-9'
                      )
                    }
                    value={group}>
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
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
  )
}