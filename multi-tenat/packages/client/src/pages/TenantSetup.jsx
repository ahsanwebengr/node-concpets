function TenantSetup() {
  const hostname = window.location.hostname;
  
  return (
    <div className='auth-container'>
      <div className='card auth-card'>
        <h2 className='text-center' style={{ marginBottom: 16, color: '#dc3545' }}>
          No Tenant Found
        </h2>
        
        <div style={{ padding: '20px 0', textAlign: 'center', color: '#666' }}>
          <p style={{ marginBottom: 16 }}>
            This application requires a tenant subdomain to function.
          </p>
          <p style={{ marginBottom: 16 }}>
            Current hostname: <strong>{hostname}</strong>
          </p>
          <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginTop: 24 }}>
            <p style={{ fontWeight: 500, marginBottom: 12 }}>For Local Development:</p>
            <p style={{ fontSize: 13, color: '#495057', marginBottom: 8 }}>
              Access via: <code style={{ background: '#e9ecef', padding: '2px 8px', borderRadius: 4 }}>
                http://&lt;tenant&gt;.localhost:3000
              </code>
            </p>
            <p style={{ fontSize: 13, color: '#495057' }}>
              Example: <code style={{ background: '#e9ecef', padding: '2px 8px', borderRadius: 4 }}>
                http://acme.localhost:3000
              </code>
            </p>
          </div>
          <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginTop: 16 }}>
            <p style={{ fontWeight: 500, marginBottom: 12 }}>For Production:</p>
            <p style={{ fontSize: 13, color: '#495057' }}>
              Access via: <code style={{ background: '#e9ecef', padding: '2px 8px', borderRadius: 4 }}>
                http://&lt;tenant&gt;.yourdomain.com
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenantSetup;
