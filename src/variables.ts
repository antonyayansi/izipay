import { generateOrderNumber } from "./helpers"

export interface initialConfig {
    merchant_code: string
    production?: boolean
    prod_password?: string
    test_password?: string
    prod_public_key?: string
    test_public_key?: string
    prod_sha256?: string
    test_sha256?: string
    proxy_url?: string
    endpoint?: string
    language?: string
}

interface Customer {
    email: string
}

export interface paymentConfig {
    currency: string
    amount: number
    orderId: string
    customer: Customer
    authBasic: string
}

export const initial: initialConfig = {
    merchant_code: '',
    production: false,
    prod_password: '',
    test_password: '',
    prod_public_key: '',
    test_public_key: '',
    prod_sha256: '',
    test_sha256: '',
    proxy_url: 'http://dankira.laravel.cloud/api/proxy_izipay',
    endpoint: 'https://api.micuentaweb.pe',
    language: 'es-PE'
}

export const payment: paymentConfig = {
    currency: 'PEN',
    amount: 0,
    orderId: generateOrderNumber(),
    customer: {
        email: ''
    },
    authBasic: ''
}