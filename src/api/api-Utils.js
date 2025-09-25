function Response(code, message, data) {
    return { code, message, data };
  }
  
  function ErrorResponse(message, status) {
    return Response('1', message, { error: message, status });
  }
  
  function RequestConfig(url, params = {}, data = {}, method = 'GET') {
    return { url, params, data, method };
  }
  
  export { Response, ErrorResponse, RequestConfig };