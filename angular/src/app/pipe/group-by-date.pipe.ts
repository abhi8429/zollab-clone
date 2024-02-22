import {Pipe, PipeTransform} from '@angular/core';
import {GroupMessage} from "../model/group-message";

@Pipe({
    name: 'groupByDate'
})
export class GroupByDatePipe implements PipeTransform {
    transform(objects: GroupMessage[] | undefined): any[] {
        const groupedByDate = {};
        if(!!objects)
        for (const obj of objects) {
            let d = new Date(obj.createdAt);
            const date = d.toDateString();
            // @ts-ignore
            if (!groupedByDate[date]) {
                // @ts-ignore
                groupedByDate[date] = [];
            }
            // @ts-ignore
            groupedByDate[date].push(obj);
        }
        return Object.values(groupedByDate);
    }
}
