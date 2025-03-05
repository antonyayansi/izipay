
export function generateOrderNumber() {
    const length = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
    const prefix = "R" + new Date().getFullYear();
    const randomPart = Math.random().toString(36).substring(2, length - prefix.length + 2).toUpperCase();

    let orderNumber = prefix + randomPart;
    return orderNumber.slice(0, length);
}
