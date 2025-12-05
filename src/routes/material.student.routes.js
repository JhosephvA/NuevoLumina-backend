const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");
const Material = require("../models/Material");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const config = require("../config/config");

// 🔐 Solo estudiantes
router.use(requireAuth, requireRole([config.roles.STUDENT]));

/* ======================================================
   LISTAR MATERIALES DEL CURSO
   GET /api/student/courses/:courseId/materials
====================================================== */
router.get("/courses/:courseId/materials", async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    // 1️⃣ Validar que está matriculado
    const enrolled = await Enrollment.findOne({
      where: { estudianteId: studentId, courseId }
    });

    if (!enrolled) {
      return res.status(403).json({ message: "No estás matriculado en este curso" });
    }

    // 2️⃣ Traer materiales del curso
    const materiales = await Material.findAll({
      where: { courseId },
      include: [{ model: Course, as: "curso" }],
      order: [["createdAt", "DESC"]]
    });

    res.json(materiales);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener materiales" });
  }
});

module.exports = router;
