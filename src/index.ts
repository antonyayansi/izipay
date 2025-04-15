//@ts-ignore
import hmacSHA256 from 'crypto-js/hmac-sha256'
//@ts-ignore
import Hex from 'crypto-js/enc-hex'
//@ts-ignore
import base64 from 'base-64'
import KRGlue from '@lyracom/embedded-form-glue';
import { initial, payment, initialConfig, paymentConfig } from './variables';

const addCSS = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic-reset.css';
    document.head.appendChild(link);
};

const addJS = () => {
    const script = document.createElement('script');
    script.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js';
    document.body.appendChild(script);
}

export const setInitialConfig = (config: initialConfig) => {
    addCSS();
    addJS();
    Object.assign(initial, config);
};

export const setPaymentConfig = (config: paymentConfig) => {
    Object.assign(payment, config);
};

export const setup = async (callback?: (response: any) => void) => {
    const data = await fetch(`${initial.proxy_url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...payment,
            amount: payment.amount * 100,
            authBasic: base64.encode(`${initial.merchant_code}:${initial.production
                ? initial.prod_password
                : initial.test_password
                }`)
        }),
    });

    const response = await data.json();

    KRGlue.loadLibrary(`${initial.endpoint}`, initial.production ? `${initial.prod_public_key}` : `${initial.test_public_key}`)
        .then(({ KR }) => KR.setFormConfig({
            formToken: response.answer.formToken,
            'kr-language': initial.language,
        }))
        .then(({ KR }) => KR.onSubmit(resp => {
            const clientAnswer = resp.clientAnswer
            const hash = resp.hash

            const answerHash = Hex.stringify(
                hmacSHA256(JSON.stringify(clientAnswer), initial.production ? initial.prod_sha256 : initial.test_sha256)
            )

            const isValid = hash === answerHash;

            if (isValid) {
                console.log('%cPago completado! 🦄', 'color: white; background-color: green; font-size: 12px; font-weight: bold; padding: 10px; border-radius: 5px;');
            } else {
                console.log('%cNo válido 🚫', 'color: white; background-color: red; font-size: 12px; font-weight: bold; padding: 10px; border-radius: 5px;');
            }            

            if (callback) {
                callback({res: resp});
            }
        }))
        .then(({ KR }) => KR.addForm('#izipay-form'))  // Agregar el formulario
        .then(({ KR, result }) => {
            KR.showForm(result.formId)
        });
};
