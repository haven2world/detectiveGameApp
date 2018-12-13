'use strict';


/**
 * 剧本model
 */
import * as services from '../../utils/services';

export default {
  namespace:'documents',
  state:{
    list:[]
  },
  reducers:{
    updateDocuments(state, {payload:{documents}}){
      return {...state, list:documents||state.list}
    }
  },
  effects:{
    *fetch({payload},{call, put}){
      const result = yield call(services.fetchGameDocuments);
      if(result && result.code === 0){
        let documents = result.data.documents.sort((a, b)=>{
          return a.publishFlag && !b.publishFlag
        });
        yield put ({type:'updateDocuments', payload:{documents}});
      }
    }
  },
  subscriptions:{
    setup({dispatch, history}){
      return history.listen(({ pathname }) => {
        if (pathname === '/documents') {
          dispatch({ type: 'fetch'});
        }
      });
    }
  }
}