import { Route } from "./routes";

const serverHandler = (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    const route = Route(req, res);
    if (route) {
        res.end(
            JSON.stringify(route)
        )
        return;
    }
}

export { serverHandler };