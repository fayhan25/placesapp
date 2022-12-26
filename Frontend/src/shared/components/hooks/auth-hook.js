import {useCallback, useEffect, useState} from 'react';


let logoutTimer;

export const useAuth = () => {
    const [token,setToken] = useState(false);
    const [tokenExpire, setTokenExpire] = useState();
    const [userId, setUserId] = useState(false);
    const login = useCallback( (uid,token,expiredDate) => {
        setToken(token);
        setUserId(uid);
        const tokenExpirationDate = expiredDate || new Date(new Date().getTime() + 1000 * 60 * 60)
        setTokenExpire(tokenExpirationDate);
        localStorage.setItem('userData', JSON.stringify({userId:uid, token:token, expiraton: tokenExpirationDate.toISOString() }));
    },[])
    const logout = useCallback( () => {
    setToken(null);
    setUserId(null);
    setTokenExpire(null);
    localStorage.removeItem('userData');
    },[])


    useEffect(() =>  {
    if (token && tokenExpire){
        const remainingTime = tokenExpire.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout,remainingTime);
    } else{
        clearTimeout(logoutTimer);
    }
    },[token,logout,tokenExpire])

    useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && new Date(storedData.expiraton) > new Date()){
        login(storedData.userId, storedData.token, new Date(storedData.expiraton));
    }
    }, [login])

    return {token, login,logout,userId}
}