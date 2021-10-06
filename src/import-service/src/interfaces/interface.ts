export interface IParams {
    Bucket: string,
    Key: string,
    Expires: number,
    ContentType: string,
}

export interface IMock {
    queryStringParameters: object,
}

