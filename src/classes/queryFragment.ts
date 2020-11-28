import { ODataOption } from '../enums/oDataOption'

export class QueryFragment {
    constructor(public type: ODataOption, public value: string) {}
  }