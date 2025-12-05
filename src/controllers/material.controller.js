const Material = require('../models/Material');
const Course = require('../models/Course');
const Enrollment = require("../models/Enrollment");

// Crear material (solo profesor)
exports.createMaterial = async (req, res) => {
  try {
    const { titulo, descripcion, archivoUrl, semana } = req.body;
    const courseId = req.body.courseId || req.params.courseId;
    const profesorId = req.user.id;

    // Validar curso del profesor
    const course = await Course.findOne({
      where: { id: courseId, profesorId }
    });

    if (!course) {
      return res.status(403).json({
        message: "No puedes subir material a un curso que no te pertenece"
      });
    }

    // Crear material
    const material = await Material.create({
      titulo,
      descripcion,
      archivoUrl,
      courseId,
      semana: semana ? Number(semana) : null,
    });

    return res.status(201).json(material);
  } catch (error) {
    console.error("❌ Error en createMaterial:", error);
    return res.status(500).json({
      message: "Error al crear material",
      error: error.message
    });
  }
};

// Obtener materiales por curso (con filtro por semana)
exports.getMaterialsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { semana } = req.query;
    const userId = req.user.id;
    const userRole = req.user.rol;

    // Estudiante: validar inscripción
    if (userRole === "estudiante") {
      const estaInscrito = await Enrollment.findOne({
        where: { estudianteId: userId, courseId }
      });

      if (!estaInscrito) {
        return res.status(403).json({ message: "No estás inscrito en este curso" });
      }
    }

    // Profesor: validar curso propio
    if (userRole === "profesor") {
      const curso = await Course.findOne({
        where: { id: courseId, profesorId: userId }
      });

      if (!curso) {
        return res.status(403).json({ message: "No puedes ver materiales de un curso que no te pertenece" });
      }
    }

    // FILTRO por semana en BD
    const filters = { courseId };
    if (semana) filters.semana = Number(semana);

    const materiales = await Material.findAll({
      where: filters,
      order: [["semana", "ASC"], ["createdAt", "ASC"]],
    });

    return res.json(materiales);
  } catch (error) {
    console.error("❌ Error en getMaterialsByCourse:", error);
    return res.status(500).json({
      message: "Error al obtener materiales",
      error: error.message
    });
  }
};

// Eliminar material
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const profesorId = req.user.id;

    const material = await Material.findByPk(id);
    if (!material)
      return res.status(404).json({ message: "Material no encontrado" });

    const course = await Course.findOne({
      where: { id: material.courseId, profesorId }
    });

    if (!course)
      return res.status(403).json({
        message: "No puedes eliminar material de un curso que no te pertenece"
      });

    await Material.destroy({ where: { id } });

    return res.json({ message: "Material eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteMaterial:", error);
    return res.status(500).json({
      message: "Error al eliminar material",
      error: error.message
    });
  }
};
