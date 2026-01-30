import { createContext, useContext, useState, useEffect } from 'react';

const TenantContext = createContext();

const extractTenantFromDomain = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }
  
  const parts = hostname.split('.');
  
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    return parts[0];
  }
  
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
};

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const domainTenant = extractTenantFromDomain();
    if (domainTenant) {
      setTenant(domainTenant);
    }
    setLoading(false);
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => useContext(TenantContext);
