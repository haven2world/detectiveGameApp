'use strict';


/**
 * 剧本model
 */
import * as services from '@/utils/services';

export default {
  namespace:'documents',
  state:{
    list:[],
    loading:false,
  },
  reducers:{
    updateDocuments(state, {payload:{documents}}){
      return {...state, list:documents||state.list}
    },
    setLoading(state, {payload:{loading}}){
      return {...state, loading}
    }
  },
  effects:{
    *fetch({payload},{call, put}){
      yield put({type:'setLoading', payload:{loading:true}});
      const result = yield call(services.fetchGameDocuments);
      yield put({type:'setLoading', payload:{loading:false}});

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
        if (pathname === '/documents' || pathname === '/documents/') {
          dispatch({ type: 'fetch'});
        }
      });
    }
  }
}