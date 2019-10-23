// import createApi from '../../api/demo/index';
// import '../../api/demo/index';
const test = {
  state: {
    countLoadingArr:
      (sessionStorage.getItem('store') && JSON.parse(sessionStorage.getItem('store')).demo.countLoadingArr) || [],
    test: '',
    num: 1,
    type: 2
  },
  reducers: {
    setTest(state, data) {
      // 从第二个变量开始为调用increment时传递进来的参数，后面依次类推，例如：dispatch.count.increment(10, 20)时， num1 = 10 , num2 = 20.
      return {
        ...state,
        test: data
      }
    },
    setCountLoading(state, data) {
      return {
        ...state,
        countLoadingArr: data
      }
    }
  },
  effects: dispatch => ({
    async getTest() {
      // 第二个变量为当前model的state的值，num1为调用incrementAsync时传递进来的第一个参数，num2为调用时传递的第二个参数，后面依次类推。例如：dispatch.count.incrementAsync(10, 20)时，num1 = 10, num2 = 20
      // await new Promise(resolve => {
      //   setTimeout(() => {
      //     // this.setTest(0);
      //     dispatch.demo.setTest(0);
      //     resolve();
      //   }, 2000);
      // });
      // const res = await createApi.test();
      // if (res && res.success) {
      //   console.log(res);
      //   console.log(dispatch);
      //   dispatch.demo.setTest(res.data[1][0].title);
      // }
    }
  })
}

export default test
