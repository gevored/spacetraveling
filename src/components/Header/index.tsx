import style from './header.module.scss'

import Link from 'next/link'

export default function Header() {
  // TODO
  return (
    <div className={style.container}>
      <Link href="/">
        <a>
          <img src="/images/logo.svg" alt="logo" />
        </a>
      </Link>
    </div>
  )
}
