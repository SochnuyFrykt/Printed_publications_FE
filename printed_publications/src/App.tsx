import { BrowserRouter, Routes } from 'react-router-dom';
import { useRouter } from "./components/useRouter";
import { ConfigProvider } from "antd";
import { useState, useEffect } from 'react';
import './Styles/App.css'
import { IUser } from "./types/User";
import { MainContext } from './MainContext'

export default () => {
    const [user, setUser] = useState<IUser>({} as IUser)
    const router = useRouter({ user })
    const [cookieModal, setCookieModal] = useState(localStorage.getItem('accessCookie') !== 'true')
    const [userModal, setUserModal] = useState<boolean>(false)

    const logout = () => {
        const u = {} as IUser
        localStorage.setItem('user', JSON.stringify(u))
        setUser(u)
    }

    useEffect(() => {
        if (user.id)
            localStorage.setItem('user', JSON.stringify(user))
    }, [user])

    useEffect(() => {
        const user = (JSON.parse(localStorage.getItem('user') || '{}')) as IUser
        setUser(user)
    }, [])

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBorder: '#E6EAF8',
                    colorBgContainer: '#FFF',
                    borderRadius: 10,
                    colorPrimaryHover: '#D8C5F0',
                    colorPrimary: "#550DB2",
                    colorPrimaryBorder: "#FFF",
                    colorBorderSecondary: "#FFF",

                },
                components: {
                    Form: {
                        labelFontSize: 16,
                    },
                    Input: {
                        controlHeightLG: 52,
                    },
                    Button: {
                        controlHeightLG: 52
                    },
                    DatePicker: {
                        controlHeightLG: 52
                    },
                    Select: {
                        controlHeightLG: 52,
                        boxShadow: 'none'
                    },
                }
            }}
        >
            <MainContext.Provider
                value={{ user, setUser, logout }}
            >

                <BrowserRouter>
                    <Routes>
                        {router}
                    </Routes>
                </BrowserRouter>
            </MainContext.Provider>
        </ConfigProvider>
    )
}

