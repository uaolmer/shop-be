export const getProduct = (mockData: object, productId: string): object => {
    return Object.entries(mockData).find((item) => item[1].id === productId);
}