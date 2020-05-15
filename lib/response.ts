
const response = (statusCode: number, body: any, headers: any) => ({
    statusCode,
    headers,
    body: JSON.stringify(body, null, 2),
});

export const Ok = (body: any = {}, headers: any = {}) => response(200, body, headers);
export const BadRequest = (body: any = {}, headers: any = {}) => response(400, body, headers);
export const NotFound = (body: any = {}, headers: any = {}) => response(404, body, headers);
