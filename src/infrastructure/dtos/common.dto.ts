/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 500
 *         message:
 *           type: string
 *           example: "Internal Server Error"
 * 
 *     SuccessMessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *
 *   responses:
 *     Unauthorized:
 *       description: Authentication required. The JWT is missing, invalid, or expired.
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ErrorResponse'
 *               - type: object
 *                 properties:
 *                   statusCode:
 *                     example: 401
 *                   message:
 *                     example: "Authentication required: No token provided or token format is invalid."
 *
 *     Forbidden:
 *       description: Forbidden. The authenticated user does not have sufficient permissions.
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ErrorResponse'
 *               - type: object
 *                 properties:
 *                   statusCode:
 *                     example: 403
 *                   message:
 *                     example: "Access denied: Insufficient permissions."
 *
 *     NotFound:
 *       description: Not Found. The requested resource could not be found.
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ErrorResponse'
 *               - type: object
 *                 properties:
 *                   statusCode:
 *                     example: 404
 *                   message:
 *                     example: "The requested resource could not be found."
 *
 *     BadRequest:
 *       description: Bad Request. The request was malformed or invalid.
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ErrorResponse'
 *               - type: object
 *                 properties:
 *                   statusCode:
 *                     example: 400
 *                   message:
 *                     example: "Bad Request: Invalid input data."
 *
 *     InternalServerError:
 *       description: Internal Server Error. An unexpected error occurred on the server.
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ErrorResponse'
 *               - type: object
 *                 properties:
 *                   statusCode:
 *                     example: 500
 *                   message:
 *                     example: "Internal Server Error."
 */