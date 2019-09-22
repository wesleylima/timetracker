// Entry Model
// import { Model, fields }  from 'gun-orm';
// import { DateTimeField, TextField } from ;
// import Model from 'gun-orm';
const { fields: { DateTimeField, TextField } } = require('gun-orm');
console.log('DateTimeField');
console.log(fields);
export class Entry extends Model
{

  static name = 'time_entry';

  static fields = {
    in: DateTimeField,
    out: DateTimeField, //{index: false}
    description: TextField,
    ticket_id: TextField,
  }

  static indexes = [
    'ticket_id',
  ]
}
