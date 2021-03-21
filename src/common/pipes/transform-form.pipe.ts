import * as _ from 'lodash';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformFormPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value !== null && typeof value === 'object') {
      const objectWithKeysNested = {};
      for (const key of Object.keys(value)) {
        _.set(objectWithKeysNested, key, value[key]);
      }
      return objectWithKeysNested;
    } else {
      return value;
    }
  }
}
