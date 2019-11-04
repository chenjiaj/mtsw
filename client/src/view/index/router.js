/**
 * Created by chenjiajun on 2019/11/4.
 */
export default [{
  path:'/',
  component: (resolve) => {
    require.ensure(['./index.vue'], () => {
      resolve(require('./index.vue'))
    })
  }
}]
