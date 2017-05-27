import { ajax } from 'discourse/lib/ajax';

export default {
  findById(opts) {
    return ajax(`/page/${opts.id}`);
  }
};