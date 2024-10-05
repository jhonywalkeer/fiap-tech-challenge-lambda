export const makeResponse = (statusCode: number, body: any): Output => {
    return {
        statusCode,
        body: JSON.stringify(body)
    }
}

export type Output = {
    statusCode: number,
    body: string
}