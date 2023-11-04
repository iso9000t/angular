import { Pipe, PipeTransform } from "@angular/core";

import { SearchItem } from "../models/search-item.model";

@Pipe({
    name: "keywordFilter",
})
/* eslint-disable class-methods-use-this */
export class KeywordFilterPipe implements PipeTransform {
    transform(items: SearchItem[], keyword: string): SearchItem[] {
        if (!items) return [];
        if (!keyword) return items;

        const lowerCasedKeyword = keyword.toLowerCase();

        return items.filter((it) => it.snippet.title.toLowerCase().includes(lowerCasedKeyword));
    }
}
/* eslint-enable class-methods-use-this */
