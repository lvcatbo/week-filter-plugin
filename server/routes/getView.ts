import { client } from "../util";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    let res = await client.base.appTableView.get({
        path: {
            table_id: query.tableId as string,
            view_id: query.viewId as string,
        },
    });
    return res;
})