const Route = (req: any, res: any) => {
    const method = req.method;
    const url = req.url;
    const path = url.split('?')[0];
    if (method === 'GET' && path === '/test') {
        return {
            message: '测试信息'
        }
    }
}

export { Route }