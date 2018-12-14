import { useState } from 'react';
import Redirect from 'umi/redirect';
import * as services from '@/utils/services';


export default function(){
  services.verifyToken();

  return (
    <Redirect to={'/main/start'}/>
  )

}


