/**
 * @swagger
 * /api/candidates/stats/summary:
 *   get:
 *     summary: Get dashboard statistics summary
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */

/**
 * @swagger
 * /api/candidates/{id}:
 *   put:
 *     summary: Update candidate profile
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               skills:
 *                 type: string
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Candidate updated
 */

/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Get all candidates
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of candidates
 */

/**
 * @swagger
 * /api/candidates:
 *   post:
 *     summary: Create a new candidate
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - skills
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               skills:
 *                 type: string
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Candidate created
 */

/**
 * @swagger
 * /api/candidates/{id}:
 *   get:
 *     summary: Get candidate by ID
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate details
 */

/**
 * @swagger
 * /api/candidates/{id}/stage:
 *   patch:
 *     summary: Update candidate stage and feedback
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stage:
 *                 type: string
 *               status:
 *                 type: string
 *               feedbackText:
 *                 type: string
 *               assignedInterviewer:
 *                 type: string
 *               scheduledTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Candidate stage updated
 */
