import { client } from "../util";
import {IView} from '@/types/types'
export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const body: QueryData = await readBody(event);
	let props = body.viewInfo.property;
	props.filter_info.conditions.push(
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
	)

	let res = await client.base.appTableView.patch({
		path: {
			table_id: query.tableId as string,
			view_id: body.viewInfo.view_id,
		},
		data: {
			property: props,
		},
	});
	return res;
})

interface QueryData {
	field_id: string,
	viewInfo: IView,
	monday: string,
	sunday: string,
}