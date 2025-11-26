const Material = require('../models/Material');
const Course = require('../models/Course');
const Enrollment = require("../models/Enrollment");

// 📌 Crear material (solo profesor)
exports.createMaterial = async (req, res) => {
  try {
    const { titulo, descripcion, archivoUrl } = req.body;
    const courseId = req.body.courseId || req.params.courseId; // ✅ usar params si no viene en body
    const professorId = req.user.id; // viene del token

    // 1️⃣ Verificar que el curso pertenezca al profesor
    const course = await Course.findOne({
      where: { id: courseId, profesorId: professorId }
    });

    if (!course) {
      return res.status(403).json({
        message: "No puedes subir material a un curso que no te pertenece"
      });
    }

    // 2️⃣ Crear el material
    const material = await Material.create({
      titulo,
      descripcion,
      archivoUrl,
      courseId
    });

    res.status(201).json(material);
  } catch (error) {
    console.error("❌ Error en createMaterial:", error);
    res.status(500).json({ 
      message: "Error al crear material", 
      error: error.message || error.toString() 
    });
  }
};

// 📌 Listar TODOS los materiales (opcional)
exports.getMaterials = async (req, res) => {
  try {
    const materiales = await Material.findAll({
      include: [{ model: Course, as: "curso" }],
      order: [["createdAt", "DESC"]],
    });

    res.json(materiales);
  } catch (error) {
    console.error("❌ Error en getMaterials:", error);
    res.status(500).json({ 
      message: "Error al obtener materiales", 
      error: error.message || error.toString() 
    });
  }
};

// 📌 Obtener materiales por curso (profesor o estudiante)
exports.getMaterialsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.rol;

    // 🔹 Si es estudiante → verificar inscripción
    if (userRole === "estudiante") {
      const estaInscrito = await Enrollment.findOne({
        where: { estudianteId: userId, courseId }
      });

      if (!estaInscrito) {
        return res.status(403).json({ message: "No estás inscrito en este curso" });
      }
    }

    // 🔹 Si es profesor → validar que sea su curso
    if (userRole === "profesor") {
      const curso = await Course.findOne({
        where: { id: courseId, profesorId: userId }
      });

      if (!curso) {
        return res.status(403).json({ message: "No puedes ver materiales de un curso que no te pertenece" });
      }
    }

    // 🔹 Obtener materiales
    const materiales = await Material.findAll({
      where: { courseId },
      order: [["createdAt", "DESC"]]
    });

    res.json(materiales);
  } catch (error) {
    console.error("❌ Error en getMaterialsByCourse:", error);
    res.status(500).json({ 
      message: "Error al obtener materiales", 
      error: error.message || error.toString() 
    });
  }
};

// 📌 Eliminar material (solo profesor)
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const professorId = req.user.id;

    // Buscar material
    const material = await Material.findByPk(id);
    if (!material) {
      return res.status(404).json({ message: "Material no encontrado" });
    }

    // Verificar que el material pertenece a un curso del profesor
    const course = await Course.findOne({
      where: { id: material.courseId, profesorId }
    });

    if (!course) {
      return res.status(403).json({
        message: "No puedes eliminar material de un curso que no te pertenece",
      });
    }

    await Material.destroy({ where: { id } });
    res.json({ message: "Material eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteMaterial:", error);
    res.status(500).json({ 
      message: "Error al eliminar material", 
      error: error.message || error.toString() 
    });
  }
};
