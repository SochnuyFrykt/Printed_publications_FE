import { useContext, useState } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { MainContext } from "../MainContext.ts"
import '../Styles/login.scss';

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
  const {setUser} = useContext(MainContext)

  const onFinish = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    // if (email === '1@g' && password === '1') {
    //   navigate('/');
    // } else {
    //   alert('Неправильный логин или пароль');
    // }
      // Отправка запроса на сервер для входа
      const handleLogin = async () => {
        try {
          const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: email,
              password: password,
            }),
          });
          const loggedUser = {username: `${email}`, password: `${password}`};
          setUser(loggedUser)
          // const data = await response.json();
          // console.log(data);
          // const { token } = data;
          // localStorage.setItem('token', token);
          // console.log(localStorage.getItem('token'));
        } catch (error) {
          console.error('Ошибка:', error);
        }
      };
    handleLogin();
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
      <div style={{ color: '#A609CB', textAlign: 'left',marginTop: '4px'}}>Забыли пароль?</div>
      <button className='next'>Продолжить</button>
    </form>
  );
};

//Страница регистрации
const RegPage = () => {
  const onFinish = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const repeatPassword = formData.get('repeatPassword');
    const handleRegister = async () => {
      const response = await fetch('http://localhost:5000/register/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: email,
          password: password,
         }),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        //Обработка ответа от сервера
      })
      .catch(error => console.error('Ошибка:', error));
    };
    handleRegister();
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