import { QueryData } from "~/types/types";
import createClient from "../util";

export default defineEventHandler(async (event) => {
    const query: QueryData = getQuery(event);
    const client = createClient(query.appToken, query.personalToken);
    let res = await client.base.appTableView.get({
        path: {
            table_id: query.tableId,
            view_id: query?.viewId,
        },
    });
    return res;
})