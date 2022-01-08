import { environment } from 'src/environments/environment';
export let baseurl = environment.baseurl;
export const url = {
  gettag: baseurl + 'changeconst/gettag',
  savetag: baseurl + 'changeconst/savetag',
  savediv: baseurl + 'page/savediv',
  getdiv: baseurl + 'page/getdiv',
  upfile: baseurl + 'page/upfile',
  delpage: baseurl + 'page/delpage',
  delfile: baseurl + 'page/delfile',
  resourcefile: baseurl + 'resource/upfile',
  getlst: baseurl + 'resource/getlst',
  dellst: baseurl + 'resource/dellst',
  changetitle: baseurl + 'resource/changetitle',
  downfile: baseurl + 'resource/downfile',
  gettoken: baseurl + 'resource/gettoken',
  resourcechangetag: baseurl + 'resource/changetag',
  pagechangetag: baseurl + 'page/changetag',
};
