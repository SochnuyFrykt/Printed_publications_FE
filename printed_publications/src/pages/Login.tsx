import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/login.scss';
import { notification } from 'antd';
import { useApi } from "../useApi";
import { MainContext } from "../MainContext";

//Выбор вход или регистрация
const Authorization = () => {
    const [page, setPage] = useState('login');

    return (
        <>
            <div className='frame'>
                <div className='div'>
                    <div className='div2'>
                        <div className='div3'>
                            <div
                                className={page === 'login' ? 'divwrapper' : 'divwrapper2'}
                                onClick={() => setPage('login')}>
                                <div className={page === 'login' ? 'textwrapper' : 'textwrapper2'}>
                                    Вход
                                </div>
                            </div>
                            <div
                                className={page === 'register' ? 'divwrapper' : 'divwrapper2'}
                                onClick={() => setPage('register')}>
                                <div
                                    className={page === 'register' ? 'textwrapper' : 'textwrapper2'}>
                                    Регистрация
                                </div>
                            </div>
                        </div>
                        <div className='div4'/>
                    </div>
                    {page === 'login' && <LoginPage/>}
                    {page === 'register' && <RegPage/>}
                    <div className='policy'>
                        <div className='policy3'>
                            Нажимая&nbsp;«Продолжить», вы принимаете&nbsp;
                            <div className='policy2' style={{ width: '245px' }}>пользовательское соглашение</div>
                            &nbsp;и
                        </div>
                        <div className='policy3'>
                            <div className='policy2'>политику конфиденциальности</div>
                            .
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

//Страница входа
const LoginPage = () => {
    const { login, isLoading } = useApi()
    const { setUser } = useContext(MainContext)

    const onFinish = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const res = await login({ email, password })
        console.log(res)
        if (res.error) {
            notification.error({ message: "Неправильный логин или пароль", key: "errorPassword" });
            return
        }

        setUser(res.data)
    };

    return (
        <form onSubmit={onFinish}>
            <label className='text'>
                Электронная почта
                <input
                    name='email'
                    type='email'
                    placeholder='Введите адрес почты'
                    className='inputF'
                />
            </label>
            <label className='text'>
                Пароль
                <input
                    name='password'
                    type='password'
                    placeholder='Введите пароль'
                    className='inputF'
                />
            </label>
            <div style={{ color: '#A609CB', textAlign: 'left', marginTop: '4px' }}>Забыли пароль?</div>
            <button className='next'>Продолжить</button>
        </form>
    );
};

//Страница регистрации
const RegPage = () => {
    const { register } = useApi()
    const { setUser } = useContext(MainContext)

    const onFinish = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const repeatPassword = formData.get('repeatPassword');
        if (password !== repeatPassword) {
            notification.error({ message: "Пароли не совпадают", key: "passwordNotSame" });
            return;
        }

        const res = await register({ email, password })
        if (res.error)
            return

        setUser(res.data)
    };

    return (
        <form onSubmit={onFinish}>
            <label className='text'>
                Электронная почта
                <input
                    name='email'
                    type='email'
                    placeholder='Введите адрес почты'
                    className='inputF'
                />
            </label>
            <label className='text'>
                Пароль
                <input
                    name='password'
                    type='password'
                    placeholder='Введите пароль'
                    className='inputF'
                />
            </label>
            <label className='text'>
                Подтвердите пароль
                <input
                    name='repeatPassword'
                    type='password'
                    placeholder='Введите пароль'
                    className='inputF'
                />
            </label>
            <button className='next'>
                Продолжить
            </button>
        </form>
    );
};

export default Authorization;