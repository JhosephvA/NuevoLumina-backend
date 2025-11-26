const express = require("express");
const router = express.Router();
const materialController = require("../controllers/material.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");
const config = require("../config/config");

// SOLO PROFESORES
router.use(requireAuth, requireRole([config.roles.PROFESSOR]));

/* ======================================================
   LISTAR MATERIALES POR CURSO
   GET /api/professor/courses/:courseId/materials
====================================================== */
router.get("/courses/:courseId/materials", materialController.getMaterialsByCourse);

/* ======================================================
   CREAR MATERIAL EN UN CURSO
   POST /api/professor/courses/:courseId/materials
====================================================== */
router.post("/courses/:courseId/materials", materialController.createMaterial);

/* ======================================================
   ELIMINAR MATERIAL
   DELETE /api/professor/materials/:id
====================================================== */
router.delete("/materials/:id", materialController.deleteMaterial);

module.exports = router;
