import { Transition } from '@headlessui/react'
import { Fragment } from 'react'

export const Slide = ({ children }: { children: React.ReactNode }) => {
  return (
    <Transition.Child
      as={Fragment}
      enter="transition ease-in-out duration-200 transform"
      enterFrom="translate-y-full"
      enterTo="translate-y-0"
      leave="transition ease-in-out duration-200 transform"
      leaveFrom="translate-y-0"
      leaveTo="translate-y-full"
    >
      {children}
    </Transition.Child>
  )
}
