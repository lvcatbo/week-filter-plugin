import { client } from "../util";

export default defineEventHandler(async (event) => {
    const body: QueryData = await readBody(event);
    const query = getQuery(event);
    let res = await client.base.appTableView.create({
        data: body,
        path: {
            table_id: query.tableId as string
        },
    });
    return res;
})

interface QueryData {
    view_name: string,
    view_type: 'grid',
}