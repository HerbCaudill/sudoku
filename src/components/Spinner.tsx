import cx from 'classnames'

export function Spinner({ size = 14 }: Props = {}) {
  return (
    <span
      className={cx(`inline-block px-1 animate-spin rounded-full`, `border-solid border-black border-r-gray-200`)}
      style={{
        height: size,
        width: size,
        borderWidth: size * 0.15,
      }}
    ></span>
  )
}

type Props = {
  size?: number
}
