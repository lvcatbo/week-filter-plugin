import {IView} from '@/types/types'
import createClient from '../util'
export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const body: QueryData = await readBody(event);
	const client = createClient(query.appToken, query.personalToken);
	let props = body.viewInfo.property || {};
	if (!props?.filter_info) {
		props.filter_info = {
			conjunction: 'and',
			conditions: [],
		}
	}
	props.filter_info.conditions = props.filter_info.conditions.filter(item => item.field_id != body.field_id) || [];
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