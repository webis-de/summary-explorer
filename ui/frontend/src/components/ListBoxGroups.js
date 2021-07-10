import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import React from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ListBoxGroups(props) {
  const {s_groups, selected_group, handleSelect} = props;
  const [selected, setSelected] = useState(s_groups.filter(group => group.id===selected_group)[0])
  const handleOnChange = (e)=>{
    setSelected(e);
    handleSelect(e.id);
  }
  return (
    <Listbox value={selected} onChange={handleOnChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="hidden w-auto  font-medium text-gray-700">Change Models Group</Listbox.Label>
          <div className="mt-1 relative float-right">
            <Listbox.Button className="bg-gradient-to-r from-blue-900 to-blue-800 text-white relative rounded-md shadow-sm pl-2 right-0
            px-2 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer">
              <span className="block truncate mr-4 text-xs">Models Group <b className="gold_text">{selected.name}</b></span>
              <span className="absolute inset-y-0 right-0 flex items-center px-1 pointer-events-none text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="absolute z-10 mt-1 w-full bg-yellow-100   shadow-lg max-h-60 rounded-md py-1 text-base ring-1
                ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {s_groups.map((group) => (
                  <Listbox.Option
                    key={group.name}
                    className={({ active }) =>
                      classNames(
                        active ? ' bg-blue-900 gold_text' : 'text-blue-900',
                        'uppercase text-xs cursor-default select-none relative py-1 pl-3 pr-9'
                      )
                    }
                    value={group}>
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {group.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'gold_text' : 'text-blue-900',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
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
  )
}