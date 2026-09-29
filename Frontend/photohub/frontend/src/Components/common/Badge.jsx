import { statusTone, classNames } from '../../utils/helpers'

export default function Badge({ status, children }) {
  return (
    <span className={classNames('badge capitalize', statusTone(status))}>
      {children || status?.replace('_', ' ')}
    </span>
  )
}
