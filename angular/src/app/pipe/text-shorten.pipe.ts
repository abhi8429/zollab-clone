import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'shorten' })

export class TextShortenPipe implements PipeTransform {

  transform(text: string, limit: number): string {
    return (typeof limit === 'number'
      && typeof text === 'string'
      && limit > 0
      && text.length > limit) ?
      (text.substring(0, limit) + '...') : text;
  }
}
