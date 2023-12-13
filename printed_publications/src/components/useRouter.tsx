import React, { ReactNode } from "react";
import Layout from "../ui/layout/layout.tsx";
import { Navigate, Route } from "react-router-dom";
import Ocr from "../pages/Ocr.tsx";
import Login from "../pages/Login.tsx";
import Home from "../pages/Home.tsx";
import Settings from "../pages/Settings.tsx";
import Help from "../pages/Help.tsx";
import { IUser } from "../../types/User.ts";

interface Page {
    element: ReactNode;
    path: string;
    needAuth: boolean;
}

export const useRouter: React.FC<{ user: IUser }> = ({ user }) => {
    const pages: Page[] = [
        { element: <Ocr/>, path: '/ocr', needAuth: true },
        { element: <Login/>, path: '/login', needAuth: false },
        { element: <Home/>, path: '/', needAuth: true },
        { element: <Settings/>, path: '/settings', needAuth: true },
        { element: <Help/>, path: '/help', needAuth: true },
        { element: <Navigate to='/login'/>, path: '*', needAuth: false },
        { element: <Navigate to='/'/>, path: '*', needAuth: true },
    ]

    return (
        <>
            {pages.map(page =>
                page.needAuth == !!user.username ?
                <Route
                    key={page.path}
                    {...page}
                    element={
                        <div className="App">
                            <div className="custom-container">
                                <Layout>
                                    {page.element}
                                </Layout>
                            </div>
                        </div>
                    }
                />: ''
            )}
        </>
    )
}