# dev-danhenderson
A React+FastAPI web application powering danhenderson.dev.

## Development
```
├── backend
    ├── app
    ├── ...
└── frontend
    ├── src
    ├── ...
└── infrastructure
    ├── src
```

### `cd backend/`

API: http://127.0.0.1:8004
OpenAPI (re)docs: http://127.0.0.1:8004/docs | http://127.0.0.1:8004/redocs

#### Ref:
https://levelup.gitconnected.com/building-a-website-starter-with-fastapi-92d077092864#e696
https://testdriven.io/courses/tdd-fastapi/
https://fastapi-users.github.io/fastapi-users/10.4/
https://www.gormanalysis.com/blog/many-to-many-relationships-in-fastapi/

2×× Success codes HTTP status codes
200 OK
201 Created
202 Accepted
203 Non-authoritative Information
204 No Content
205 Reset Content
206 Partial Content
207 Multi-Status
208 Already Reported
226 IM Used

3×× Redirection HTTP status codes
300 Multiple Choices
301 Moved Permanently
302 Found
303 See Other
304 Not Modified
305 Use Proxy
307 Temporary Redirect
308 Permanent Redirect

4×× Client Error HTTP status codes
400 Bad Request
401 Unauthorized
402 Payment Required
403 Forbidden
404 Not Found
405 Method Not Allowed
406 Not Acceptable
407 Proxy Authentication Required
408 Request Timeout
409 Conflict
410 Gone
411 Length Required
412 Precondition Failed
413 Payload Too Large
414 Request-URI Too Long
415 Unsupported Media Type
416 Requested Range Not Satisfiable
417 Expectation Failed
418 I'm a teapot
421 Misdirected Request
422 Unprocessable Entity
423 Locked
424 Failed Dependency
426 Upgrade Required
428 Precondition Required
429 Too Many Requests
431 Request Header Fields Too Large
444 Connection Closed Without Response
451 Unavailable For Legal Reasons
499 Client Closed Request

5×× Server Error HTTP status codes
500 Internal Server Error
501 Not Implemented
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
505 HTTP Version Not Supported
506 Variant Also Negotiates
507 Insufficient Storage
508 Loop Detected
510 Not Extended
511 Network Authentication Required
599 Network Connect Timeout Error


### `cd frontend/`

UI: http://localhost:3000


#### Ref:
https://raaviblog.com/how-to-connect-your-google-domain-to-aws-s3-hosted-static-website/