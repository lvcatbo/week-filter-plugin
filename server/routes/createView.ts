import { QueryData } from "~/types/types";
import createClient from "../util";

export default defineEventHandler(async (event) => {
    const body: BodyData = await readBody(event);
    const query: QueryData = getQuery(event);
    const client = createClient(query.appToken, query.personalToken);
    let res = await client.base.appTableView.create({
        data: body,
        path: {
            table_id: query.tableId as string
        },
    });
    return res;
})

interface BodyData {
    view_name: string,
    view_type: 'grid',
}