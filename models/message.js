/**
 * Created by MForever78 on 15/5/9.
 */

module.exports = {
  /*
    200 OK
    General status code. Most common code used to indicate success
   */
  ok: 200,
  /*
   Successful creation occurred (via either POST or PUT). Set the
   Location header to contain a link to the newly-created
   resource (on POST). Response body content may or may not be present.
   */
  created: 201,
  /*
   204 NO CONTENT
   Indicates success but nothing is in the response body, often
   used for DELETE and PUT operations.
   */
  noContent: 204,
  /*
   400 BAD REQUEST
   General error when fulfilling the request would cause an
   invalid state. Domain validation errors, missing data,
   etc. are some examples.
   */
  badRequest: 400,
  /*
   401 UNAUTHORIZED
   Error code response for missing or invalid authentication token.
   */
  unauthorized: 401,
  /*
   403 FORBIDDEN
   Error code for user not authorized to perform the operation
   or the resource is unavailable for some reason (e.g. time
   constraints, etc.).
   */
  forbidden: 403,
  /*
   404 NOT FOUND
   Used when the requested resource is not found, whether it
   doesn't exist or if there was a 401 or 403 that, for
   security reasons, the service wants to mask.
   */
  notFound: 404,
  /*
   405 METHOD NOT ALLOWED
   Used to indicate that the requested URL exists, but the
   requested HTTP method is not applicable. For example,
   POST /users/12345 where the API doesn't support creation
   of resources this way (with a provided ID). The Allow HTTP
   header must be set when returning a 405 to indicate the HTTP
   methods that are supported. In the previous case, the
   header would look like "Allow: GET, PUT, DELETE"
   */
  methodNotAllowed: 405,
  /*
   409 CONFLICT
   Whenever a resource conflict would be caused by fulfilling
   the request. Duplicate entries, such as trying to create
   two customers with the same information, and deleting root
   objects when cascade-delete is not supported are a couple of examples.
   */
  conflict: 409,
  /*
   500 INTERNAL SERVER ERROR
   Never return this intentionally. The general catch-all
   error when the server-side throws an exception. Use this
   only for errors that the consumer cannot address from their end.
   */
  internalServerError: 500
};