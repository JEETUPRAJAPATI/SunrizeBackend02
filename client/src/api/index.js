async function throwIfResNotOk(res) {
  if (!res.ok) {
    let errorData;
    
    try {
      errorData = await res.json();
    } catch (parseError) {
      // If response is not JSON, create generic error
      const error = new Error(`${res.status}: ${res.statusText}`);
      error.status = res.status;
      throw error;
    }
    
    // If it's a validation error with field-specific errors
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const error = new Error(errorData.message || 'Validation failed');
      error.status = res.status;
      error.validationErrors = {};
      
      // Convert array of errors to object for easier access
      errorData.errors.forEach(err => {
        if (err.field) {
          error.validationErrors[err.field] = err.message;
        }
      });
      
      throw error;
    }
    
    // For other types of errors
    const error = new Error(errorData.message || res.statusText);
    error.status = res.status;
    error.serverResponse = errorData;
    throw error;
  }
}

export async function apiRequest(url, options = {}) {
  const headers = { 
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...options.headers
  };

  const res = await fetch(`/api${url}`, {
    ...options,
    headers
  });

  await throwIfResNotOk(res);
  return res.json();
}