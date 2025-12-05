const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");
const Material = require("../models/Material");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const config = require("../config/config");

// Solo estudiantes
router.use(requireAuth, requireRole([config.roles.STUDENT]));

/* ============================================
   LISTAR MATERIALES DEL CURSO (con ?semana=X)
   GET /api/student/courses/:courseId/materials
============================================ */
router.get("/courses/:courseId/materials", async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;
    const { semana } = req.query;

    // 1️⃣ Validar inscripción
    const enrolled = await Enrollment.findOne({
      where: { estudianteId: studentId, courseId }
    });

    if (!enrolled) {
      return res.status(403).json({ message: "No estás matriculado en este curso" });
    }

    // 2️⃣ Filtro por semana (si se pasa)
    const filters = { courseId };
    if (semana) filters.semana = Number(semana);

    // 3️⃣ Obtener materiales
    const materiales = await Material.findAll({
      where: filters,
      include: [{ model: Course, as: "curso" }],
      order: [["semana", "ASC"], ["createdAt", "ASC"]]
    });

    return res.json(materiales);

  } catch (error) {
    console.error("❌ Error material.student.routes:", error);
    return res.status(500).json({ message: "Error al obtener materiales" });
  }
});

module.exports = router;
