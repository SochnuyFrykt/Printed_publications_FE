import React, { ReactNode } from "react"
import style from '../ui/help/help.module.scss'

const Help = (): JSX.Element => {
    return (
        <div className={style.container}>
            <div className={style.screen}>
                <div className={style.div}>
                    <div className={style.frame}>
                        <div className={style.frame_3}>
                        </div>
                        <div className={style.div_wrapper}>
                            <div className={style.text_wrapper}>Помощь по использованию BookScan</div>
                        </div>
                        <div className={style.text_wrapper_3}>Введение</div>
                        <div className={style.overlap_group_wrapper}>
                            <div className={style.overlap_2}>
                                <div className={style.overlap_3}>
                                    <img className={style.line} alt="Line" src="line-1.svg" />
                                    <p className={style.text_wrapper_4}>
                                        Добро пожаловать на страницу помощи по каталогизации печатных изданий! Здесь вы найдете ресурсы и
                                        рекомендации, которые помогут вам эффективно использовать наш сайт для организации и поиска печатных
                                        материалов.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={style.text_wrapper_3}>Инструкции и рекомендации</div>
                        <div className={style.overlap_wrapper}>
                            <div className={style.overlap}>
                                <div className={style.overlap_group}>
                                    <p className={style.text_wrapper_2}>
                                        <ul>
                                            <li>
                                                Войдите в свой аккаунт.
                                            </li>
                                            <li>
                                                Выберите опцию “Добавить” на верхней панели.
                                            </li>
                                            <li>
                                                Загрузите фото первых страниц книги, для сканирования данных с них.
                                            </li>
                                            <li>
                                                При несоответствии сканированного текста с оригиналом, можно изменить поля вручную.
                                            </li>
                                            <li>
                                                Нажмите “Сохранить”.
                                            </li>
                                        </ul>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={style.frame_4}>
                            <div className={style.overlap_4}>
                                <div className={style.overlap_5}>
                                    <div className={style.text_wrapper_3}>Контактная информация</div>
                                    <img className={style.line} alt="Line" src="line-3.svg" />
                                    <p className={style.text_wrapper_4}>
                                        Если у вас возникнут трудности или у вас есть дополнительные вопросы, не стесняйтесь связаться с
                                        нашей командой поддержки по адресу{" "}
                                        <span className={style.text_wrapper_5}>bookscan_s@mail.ru</span>
                                        <span className={style.span}>
                                            .<br />
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={style.frame_5}>
                            <div className={style.overlap_4}>
                                <div className={style.overlap_5}>
                                    <div className={style.text_wrapper_3}>Обратная связь</div>
                                    <img className={style.line} alt="Line" src="line-3.svg" />
                                    <p className={style.text_wrapper_4}>
                                        Мы ценим ваше мнение! Если у вас есть предложения или замечания по улучшению процесса каталогизации,
                                        пожалуйста, поделитесь ими через нашу{" "}
                                        <span className={style.text_wrapper_5}>форму обратной связи</span>
                                        <span className={style.span}>
                                            .<br />
                                        </span>
                                    </p>
                                    <div className={style.frame_2}>
                                        <p className={style.p}>
                                            Благодарим вас за использование нашего сервиса для каталогизации печатных изданий. Мы надеемся, что эта
                                            страница помощи сделала процесс каталогизации более простым и удобным. Если у вас есть какие-либо вопросы
                                            или предложения, не стесняйтесь связаться с нами. Удачи в вашей работе!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help