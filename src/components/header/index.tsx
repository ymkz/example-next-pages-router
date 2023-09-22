import { User } from '~/repositories/users/type'
import style from './style.module.css'

type Props = {
  user: User
}

export const Header = ({ user }: Props) => {
  return (
    <header className={style.header}>
      <div>header</div>
      <div>{user.username}</div>
    </header>
  )
}
