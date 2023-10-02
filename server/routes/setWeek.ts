import {client} from "../util";

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const body: QueryData = await readBody(event);
	let res = await client.base.appTableView.patch({
		path: {
			table_id: query.tableId as string,
			view_id: body.view_id,
		},
		data: {
			property: {
				filter_info: {
					conjunction: 'and',
					conditions: [
						{
							field_id: body.field_id,
							operator: 'isGreater',
							value: `[\"ExactDate\",${body.monday}]`,
						},
						{
							field_id: body.field_id,
							operator: 'isLess',
							value: `[\"ExactDate\",${body.sunday}]`,
						},
					],
				},
			},
		},
	});
	return res;
})

interface QueryData {
	view_id: string,
	field_id: string,
	monday: string,
	sunday: string,
}