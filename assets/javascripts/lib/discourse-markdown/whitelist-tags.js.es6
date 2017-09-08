export function setup(helper) {
  helper.whiteList([ 
                  'a.btn',
                  'a.btn btn-primary',
                  'a.btn btn-danger',
                  'button',
                  'button.btn',
                  'button.btn btn-primary',
                  'button.btn btn-danger',
                  'ul.nav',
                  'ul.nav-pills',
                  'ul.nav nav-pills'
                  ]);
}