import React, { ReactNode, useContext } from 'react'
import { Link } from 'react-router-dom'
import style from './layout.module.scss'
import { MainContext } from '../../MainContext.ts'

const Layout: React.FC<{ children: ReactNode}> = ({ children }) => {
	const { user, logout} = useContext(MainContext)

	return (
		<>
			<div className={style.customContainer}>
				<div className={style.logo}>
					<Link to={'/'}>
						<img src='Logo.svg' alt='Логотип' />
					</Link>
				</div>
				{user.username &&
				<div className={style.buttons}>
					<Link to={'/ocr'}>
						<button className={style.buttonAdd}>Добавить</button>
					</Link>
					<Link to={'/settings'}>
						<button className={style.buttonSettings}>Настройки</button>
					</Link>
					<Link to={'/help'}>
						<button className={style.buttonHelp}>Помощь</button>
					</Link>
					<Link to={'/login'}>
						<button className={style.buttonExit}>Выйти</button>
					</Link>
				</div>
			}
			</div>
			<main>{children}</main>
		</>
	)
}

export default Layout
