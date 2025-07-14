const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    width: '100%',
    maxWidth: '350px',
    margin: '2rem auto',
    padding: '2rem',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
  },
  input: {
    padding: '0.7rem',
    border: '1px solid #bbb',
    borderRadius: '4px',
    fontSize: '1rem',
    marginBottom: '1rem'
  },
  button: {
    padding: '0.7rem',
    background: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold' as const,
    fontSize: '1rem',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginTop: '0.5rem',
    fontSize: '0.95rem'
  },
  fieldset: {
    border: '1px solid #eee',
    borderRadius: '6px',
    padding: '1rem',
    marginBottom: '1rem'
  },
  legend: {
    fontWeight: 'bold' as const,
    color: '#1976d2',
    marginBottom: '1rem'
  }
};

export default styles;
