import axios, { AxiosError, AxiosResponse } from 'axios'
import { useContext, useState } from 'react'
import { MainContext } from './MainContext'
import { notification } from "antd";

interface ISendRequest {
    type: 'post' | 'get' | 'delete' | 'file' | 'filePost',
    req: string,
    postData?: any
}

const success = (res: AxiosResponse) => {
    if (res.status === 201 && res.data.message)
        notification.success( {
            key: res.data.message,
            message: res.data.message
        })
    return res.data
}

const successFile = (res: AxiosResponse) => {
    // @ts-ignore
    const header = res?.headers?.get('Content-Disposition') || 'error.txt';
    const parts = header!.split(';');
    const filename = parts[1].split('=')[1];
    const data = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = data;
    link.download = filename.replaceAll('"', '')

    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );

    setTimeout(() => {
        window.URL.revokeObjectURL(data);
        link.remove();
    }, 100);

    return ''
}

const error = (res: AxiosError, logout: Function, end: any) => {
    end()
    if (res.response?.status === 401) {
        notification.error({
            message: 'Сессия завершена',
            key: '401'
        })
        logout()
        return
    }
    const data: any = res.response?.data

    if (data.message) {
        if (res.response?.status === 403) {
            logout()
        }
        notification.error({
            message: data.message,
            key: data.message
        })
    }
    if (res.response?.status === 404) {
        notification.error({
            message: 'Ресурс не найден',
            key: '404'
        })
        throw new Error(res.response.toString())
    }

    if (res.response?.status.toString()[0] === '5') {
        notification.error({
            message: 'Ошибка сервера (попробуйте повторить действие позже)',
            key: res.response.status.toString()
        })
        throw new Error(res.response.toString())
    }

    return res.response?.data
}

export const useApi = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { logout, user } = useContext(MainContext)

    const http = axios.create({
        baseURL: '/api/',
        timeout: 10000,
        headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json; charset=utf-8'
        }
    })

    const end = async (e: any) => {
        setIsLoading(false)
        return e
    }

    const sendRequest = async ({ type, req, postData = {} }: ISendRequest) => {
        setIsLoading(true)
        if (type === 'post')
            return await http.post(req, postData)
                .then(end)
                .then(success)
                .catch(e => error(e, logout, end))
        else if (type === 'get')
            return await http.get(req)
                .then(end)
                .then(success)
                .catch(e => error(e, logout, end))
        else if (type === 'delete')
            return await http.delete(req)
                .then(end)
                .then(success)
                .catch(e => error(e, logout, end))
        else if (type === 'file')
            return await http.get(req, { responseType: 'blob' })
                .then(end)
                .then(successFile)
                .catch(e => error(e, logout, end))
        else if (type === 'filePost')
            return await http.post(req, postData, { responseType: 'blob' })
                .then(end)
                .then(successFile)
                .catch(e => error(e, logout, end))
    }

    const methods = {
        // Identity
        login: async (data: any) =>
            await sendRequest({ type: 'post', req: '/identity/auth', postData: data }),
        register: async (data: any) =>
            await sendRequest({ type: 'post', req: '/identity/register', postData: data }),
    }

    return {
        ...methods,
        isLoading,
        sendRequest
    }
}