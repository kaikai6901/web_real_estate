export function formatPrice(price) {
    if (price < 1e9) {
        const roundedPrice = Math.round(price / 1e4) / 100;
        return `${roundedPrice} triệu`
    } else {
        const roundedPrice = Math.round(price / 1e7) / 100;
        return `${roundedPrice} tỷ`
    }
}
