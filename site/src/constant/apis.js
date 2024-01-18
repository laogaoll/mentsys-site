var mode = process.env.NODE_ENV
let API_SERVER = 'http://localhost'



if (mode === 'development') {
  // API_SERVER = 'https://mqcai.top'
  API_SERVER = 'http://localhost'
  //  API_SERVER = 'http://172.31.192.160'
}

if (mode === 'production') {
  // API_SERVER = 'https://mqcai.top'
  // API_SERVER = 'http://localhost'
  API_SERVER = 'http://172.31.192.160'
}

export { API_SERVER }
