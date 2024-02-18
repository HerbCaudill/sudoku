import { Transition } from '@headlessui/react'

export const Fade = ({ children }: { children: React.ReactNode }) => {
  return (
    <Transition.Child
      as="div"
      enter="transition-opacity ease-linear duration-250"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-linear duration-250"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {children}
    </Transition.Child>
  )
}
