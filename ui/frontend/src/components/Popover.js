import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Fragment } from 'react'
import React from 'react';


export default function PopoverDiv(props) {
  const {model_info} = props;
  return (
    <span className="inline-block self-center">
      <Popover className="">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                focus:outline-none`}
            >
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-4 w-4 text-gray-700 hover:text-red-700 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute bg-white z-1  px-4 mt-2 border bg-gray-200 shadow-xl border-gray-300 rounded transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative gap-8 bg-white p-7 ">
                    <div className="p-4 bg-orange-100 flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          <div className="font-bold">{model_info.title}</div>
                          <div className="mt-1 mb-1 text-xs text-justify"><b>Abstract: </b><span>{model_info.abstract}</span></div>
                          <div className="mt-1 mb-1 text-xs text-justify"><b>Human Evaluation: </b><span>{model_info['human evaluation']}</span></div>
                          <div>
                              <a href={model_info.url} target="_blank" className="inline-block text-xs hover:underline">
                            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            {model_info.url}</a></div>
                        </div>

                  </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </span>
  )
}