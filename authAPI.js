
export function fetchUser(userData) {
  return new Promise( async (resolve) =>{
    const response=await fetch('/auth/signup',{
      method:'POST',
      body:JSON.stringify(userData),
      headers:{'content-type':'application/json'}
    });
    const data=response.json();
    resolve({data});
  }
  );
}


export function checkUser(loginData) {
  return new Promise( async (resolve,reject) =>{
    // console.log(loginData)
     try{

       const response=await fetch('/auth/login',{
         method:'POST',
         body:JSON.stringify(loginData),
         headers:{'content-type':'application/json'}
       });
       const data= await response.json();
        resolve({data})
     }catch(err){
      return {err:"ee"}
     }
    }
  );
}

export function checkAuth() {
  return new Promise( async (resolve,reject) =>{
    // console.log(loginData)
     try{
       const response=await fetch('/auth/check')
       if(response.ok){
        const data=await response.json();
        resolve({data});
      }else{
        reject()
      }
    }catch(err){
      reject(err)
    }
  }
  );
}
 
export function updateUser(update) {
  return new Promise(async (resolve) => {
    try{
    const response = await fetch('/users/'+update.id, {
      method: 'PATCH',
      body: JSON.stringify(update),
      headers: { 'content-type': 'application/json' },
    });
    if(response.ok){
      const data=await response.json();
      resolve({data});
    }else{
      // reject()
    }
    
    // TODO: on server it will only return some info of user (not password)
    // resolve({ data });
  }catch(err){
    // reject({err});
  }
  });
}

export function signOut( ) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('/auth/logout');
      if (response.ok) {
        resolve({ data:'success' });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      console.log(error)
      reject( error );
    }
  });
}


export function ResetPasswordRequest(email) {
  return new Promise( async (resolve,reject) =>{
    // console.log(loginData)
     try{
       const response=await fetch('http://localhost:8080/auth/reset-password-request',{
        method: 'POST',
        body: JSON.stringify(email),
        headers: { 'content-type': 'application/json' },
      });
       if(response.ok){
        const data=await response.json();
        resolve({data});
      }else{
        reject()
      }
    }catch(err){
      reject(err)
    }
  }
  );
}



export function ResetPassword(data) {
  return new Promise( async (resolve,reject) =>{
    // console.log(loginData)
     try{
       const response=await fetch('http://localhost:8080/auth/reset-password',{
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' },
      });
       if(response.ok){
        const data=await response.json();
        resolve({data});
      }else{
        reject()
      }
    }catch(err){
      reject(err)
    }
  }
  );
}