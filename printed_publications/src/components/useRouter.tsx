import React, { ReactNode } from "react";
import Layout from "../ui/layout/layout";
import { Navigate, Route } from "react-router-dom";
import Ocr from "../pages/Ocr";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Help from "../pages/Help";
import { IUser } from "../types/User";

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
                page.needAuth == !!user.email ?
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