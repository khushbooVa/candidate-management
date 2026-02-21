/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: NLP search for candidates
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Natural language search query
 *     responses:
 *       200:
 *         description: Search results
 */
