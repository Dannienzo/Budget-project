// src/Context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApi } from '../../Endpoint/Api';
import { getTokenExp } from '../Utility/TokenUtility';
import { toast } from 'react-toastify'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refresh_token'));
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const refreshTimeoutRef = useRef(null);

  const isAuthenticated = useMemo(() => {
    return !!(accessToken && refreshToken)
  }, [accessToken, refreshToken])

  const setTokens = useCallback(({ access, refresh }) => {
    if (access) {
      localStorage.setItem('access_token', access);
      setAccessToken(access);
      scheduleRefresh(access);
    }
    if (refresh) {
      localStorage.setItem('refresh_token', refresh);
      setRefreshToken(refresh);
    }
  }, []);

  const clearTokens = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setRefreshToken(null);
    setUserProfile(null); // ✅ clear profile on logout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  const logout = useCallback(
    (redirect = '/login') => {
      clearTokens();
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      navigate(redirect);
    },
    [clearTokens, navigate]
  );

  const tryRefresh = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token') || refreshToken;
    if (!refresh) return false;
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.access) {
        const newRefresh = data.refresh || refresh;
        setTokens({ access: data.access, refresh: newRefresh });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Token refresh failed:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshToken, setTokens]);

  function scheduleRefresh(token = accessToken) {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    if (!token) return;
    const exp = getTokenExp(token);
    if (!exp) return;
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = exp - now;
    if (secondsLeft <= 0) { tryRefresh(); return; }
    const refreshBeforeSec = Math.max(30, Math.floor(secondsLeft * 0.2));
    const msUntilRefresh = (secondsLeft - refreshBeforeSec) * 1000;
    if (msUntilRefresh <= 0) { tryRefresh(); return; }
    refreshTimeoutRef.current = setTimeout(async () => {
      const ok = await tryRefresh();
      if (!ok) { clearTokens(); navigate('/login'); }
    }, msUntilRefresh);
  }

  useEffect(() => {
    if (accessToken) scheduleRefresh(accessToken);
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [accessToken]);

  // ✅ api defined BEFORE profile functions
  const api = useMemo(() => {
    return createApi({
      getAccessToken: () => accessToken,
      getRefreshToken: () => refreshToken,
      setTokens: ({ access, refresh }) => setTokens({ access, refresh }),
      logout,
    });
  }, [accessToken, refreshToken, setTokens, logout]);

  // ✅ Now api is available here
  const fetchUserProfile = useCallback(async () => {
    if (!api || !accessToken) return;
    try {
      const res = await api.get('profile/me/')
      if (res?.data) {
        setUserProfile({
          username: res.data.username || '',
          email: res.data.email || '',
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
          phone: res.data.phone_number || '',
          avatar: res.data.avatar || null,
        })
      }
    } catch (err) {
      console.warn('fetchUserProfile failed', err)
    }
  }, [api, accessToken])

  const updateUserProfile = useCallback(async (updates) => {
    if (!api || !accessToken) return { ok: false, error: 'No API' }
    const snapshot = userProfile
    try {
      if (updates.current_password && updates.new_password) {
        const passwordResp = await api.post('profile/change-password/', {
          old_password: updates.current_password,
          new_password: updates.new_password,
          confirm_password: updates.new_password,
        })
        return { ok: true, data: passwordResp.data }
      }

      const formData = new FormData()
      if (updates.first_name !== undefined) formData.append('first_name', updates.first_name)
      if (updates.last_name !== undefined) formData.append('last_name', updates.last_name)
      if (updates.phone !== undefined) formData.append('phone_number', updates.phone)
      if (updates.bio !== undefined) formData.append('bio', updates.bio)
      if (updates.avatar instanceof File) formData.append('avatar_upload', updates.avatar)

      const resp = await api.patch('profile/me/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (resp?.data) {
        setUserProfile({
          username: resp.data.username || '',
          email: resp.data.email || '',
          first_name: resp.data.first_name || '',
          last_name: resp.data.last_name || '',
          phone: resp.data.phone_number || '',
          avatar: resp.data.avatar || null,
        })
        return { ok: true, data: resp.data }
      }
    } catch (err) {
      console.error('updateUserProfile failed', err)
      setUserProfile(snapshot)
      const serverMsg = err?.response?.data
      if (serverMsg && typeof serverMsg === 'object') {
        const parts = Object.entries(serverMsg).map(([k, v]) =>
          `${k}: ${Array.isArray(v) ? v.join(', ') : v}`
        )
        toast.error(`Failed: ${parts.join(' — ')}`)
      } else {
        toast.error('Failed to update profile')
      }
      return { ok: false, error: err }
    }
  }, [api, accessToken, userProfile])

  // ✅ Fetch profile when accessToken is ready
  useEffect(() => {
    if (accessToken) {
      fetchUserProfile()
    } else {
      setUserProfile(null)
    }
  }, [accessToken, fetchUserProfile])

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        setTokens,
        clearTokens,
        logout,
        tryRefresh,
        loading,
        api,
        isAuthenticated,
        userProfile,
        setUserProfile,
        fetchUserProfile,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;