/**
 * @openapi
 * components:
 *   schemas:
 *     UserRoleResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "ADMIN"
 *
 *     UserResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 123
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         firstname:
 *           type: string
 *           example: "John"
 *         lastname:
 *           type: string
 *           example: "Doe"
 *         surname:
 *           type: string
 *           example: "Smith"
 *         birthDate:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         isBanned:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         roles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserRoleResponse'
 *
 *     UserListResponseDto:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/UserResponseDto'
 */
