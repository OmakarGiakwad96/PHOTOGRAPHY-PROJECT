import { classNames } from '../../utils/helpers'

export default function Card({ children, className = '', padded = true }) {
  return <div className={classNames('card', padded && 'p-5', className)}>{children}</div>
}
