import * as Headless from '@headlessui/react'
import { type ReactNode, useState, Fragment } from 'react'
import cx from 'classnames'

export function RadioGroup<T extends string | number | boolean>({
  label,
  value,
  onChange = () => {},
  size = 'md',
  className,
  optionClassName,
  options,
}: Props<T>) {
  return (
    <Headless.RadioGroup
      value={value}
      onChange={(v: T) => {
        onChange(v)
      }}
      className={cx('flex flex-row items-center space-x-2')}
    >
      {/* label */}

      {label ? <Headless.RadioGroup.Label className="pr-2" children={label} /> : null}

      {/* options */}
      <div
        className={cx(
          className, //
          'flex',
          {
            'text-xs': size === 'xs',
            'text-xs sm:text-sm': size === 'sm',
            'text-sm sm:text-base': size === 'md',
            'text-base sm:text-lg': size === 'lg',
            'text-lg sm:text-xl': size === 'xl',
          }
        )}
      >
        {options.map((o, i) => {
          const option = typeof o === 'object' ? o : { value: o }
          const { value, label = value.toString(), title = value.toString() } = option
          return (
            <Headless.RadioGroup.Option key={i} value={value} as={Fragment}>
              {({ checked }) => (
                <span
                  title={title}
                  className={cx([
                    'cursor-pointer relative inline-flex items-center justify-center',
                    'border border-gray-500',
                    'focus:z-10 focus:border-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-700',
                    {
                      'px-2 py-1 rounded-md': size === 'xs',
                      'px-3 py-1 rounded-md': size === 'sm',
                      'px-4 py-1 rounded-md': size === 'md',
                      'px-5 py-2 rounded-lg': size === 'lg',
                      'px-6 py-3 rounded-lg': size === 'xl',
                      // first item
                      'rounded-r-none': i === 0,
                      // middle items
                      '-ml-px rounded-none': i > 0 && i < options.length - 1,
                      // last item
                      '-ml-px rounded-l-none': i === options.length - 1,
                      // selected
                      'bg-primary-200 font-semibold': checked,
                      // unselected
                      'bg-white hover:bg-gray-50 hover:text-black ': !checked,
                    },
                    optionClassName,
                  ])}
                >
                  {label}
                </span>
              )}
            </Headless.RadioGroup.Option>
          )
        })}
      </div>
    </Headless.RadioGroup>
  )
}

type Props<T extends string | number | boolean> = {
  label?: ReactNode
  value: T
  onChange?: (value: T) => void
  className?: string
  optionClassName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  options: Options<T>
}

type Options<T extends string | number | boolean> =
  | Array<{
      value: T
      label?: ReactNode
      title?: string
    }>
  | T[]
