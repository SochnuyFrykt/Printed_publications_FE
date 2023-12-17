import { useContext, useState } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { MainContext } from "../MainContext.ts"
import '../ui/login/login.scss'

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
            <div className='div4' />
          </div>
          {page === 'login' && <LoginPage />}
          {page === 'register' && <RegPage />}
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
  const { setUser } = useContext(MainContext)

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onFinish = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const email = formData.get('email');
    const password = formData.get('password');

    handleLogin(email, password);
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const userData = await response.json();
      if (userData.message === 'Вход успешен') {
        const loggedUser = {
          id: userData.userId,
          email: userData.email
        };
        localStorage.setItem('token', userData.token);
        setUser(loggedUser);
      } else {
        notification.error({
          message: 'Пользователь',
          description: userData.message,
          duration: 1,
        });
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
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
          type={passwordVisible ? 'text' : 'password'}
          placeholder='Введите пароль'
          className='inputF'
        />
        <img src={!passwordVisible ? "closedEye.svg" : "Eye.svg"} alt="Пароль скрыт"
          className={!passwordVisible ? 'closedEye' : 'Eye'} onClick={togglePasswordVisibility} />
      </label>
      <div style={{ color: '#A609CB', textAlign: 'left', marginTop: '4px' }}>Забыли пароль?</div>
      <button className='next'>Продолжить</button>
    </form>
  );
};

//Страница регистрации
const RegPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const onFinish = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const repeatPassword = formData.get('repeatPassword');

    if (password === repeatPassword) {
      handleRegister(email, password);
    }
    else {
      notification.error({
        message: 'Ошибка',
        description: 'Пароли на совпадают.',
        duration: 1,
      });
    }
  };

  const handleRegister = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/register/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const message = await response.json();
      if (message.message !== 'Пользователь успешно зарегистрирован') {
        notification.error({
          message: 'Пользователь',
          description: message.message,
          duration: 1,
        });
      }
    }
    catch (error) {
      console.error('Ошибка:', error);
    }
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
          type={passwordVisible ? 'text' : 'password'}
          placeholder='Введите пароль'
          className='inputF'
        />
        <img src={!passwordVisible ? "closedEye.svg" : "Eye.svg"} alt="Пароль скрыт"
          className={!passwordVisible ? 'closedEye' : 'Eye'} onClick={togglePasswordVisibility} />
      </label>
      <label className='text'>
        Подтвердите пароль
        <input
          name='repeatPassword'
          type={passwordVisible ? 'text' : 'password'}
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