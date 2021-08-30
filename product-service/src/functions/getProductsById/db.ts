export const getProduct = async (mockData: object, productId: string): Promise<object> => {
    return Object.entries(mockData).find((item) => item[1].id === productId);
}