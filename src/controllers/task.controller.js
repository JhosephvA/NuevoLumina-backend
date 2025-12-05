const { Task, Course } = require('../models/associations');

/** Verifica si el usuario es el profesor del curso */
const isProfessorOfCourse = async (profesorId, courseId) => {
  const course = await Course.findByPk(courseId);

  if (!course || course.profesorId !== profesorId) {
    const error = new Error("Acceso denegado. No es el profesor de este curso.");
    error.status = 403;
    throw error;
  }

  return course;
};

/** Crear tarea */
const createTask = async (req, res) => {
  try {
    const profesorId = req.user.id;
    const { courseId, semana } = req.body;

    await isProfessorOfCourse(profesorId, courseId);

    const task = await Task.create({
      ...req.body,
      semana: semana ? Number(semana) : null,
    });

    return res.json(task);
  } catch (err) {
    console.error("❌ Error createTask:", err);
    return res.status(500).json({ message: "Error al crear tarea" });
  }
};

/** Tareas del profesor */
const getTasksByProfessor = async (req, res) => {
  try {
    const profesorId = req.user.id;

    const courses = await Course.findAll({
      where: { profesorId },
      attributes: ["id"],
    });

    const courseIds = courses.map(c => c.id);

    if (courseIds.length === 0) return res.json([]);

    const tasks = await Task.findAll({
      where: { courseId: courseIds },
      order: [["createdAt", "DESC"]],
    });

    return res.json(tasks);
  } catch (err) {
    console.error("❌ Error getTasksByProfessor:", err);
    return res.status(500).json({ message: "Error al obtener tareas" });
  }
};

/** 📌 Obtener tareas por curso (con filtro por semana) */
const getTasksByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { semana } = req.query;

    const filters = { courseId };
    if (semana) filters.semana = Number(semana);

    const tasks = await Task.findAll({
      where: filters,
      order: [["semana", "ASC"], ["createdAt", "ASC"]],
    });

    return res.json(tasks);
  } catch (err) {
    console.error("❌ getTasksByCourse:", err);
    return res.status(500).json({ message: "Error al obtener tareas del curso" });
  }
};

/** Actualizar tarea */
const updateTask = async (req, res) => {
  try {
    const profesorId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    await isProfessorOfCourse(profesorId, task.courseId);

    await task.update({
      ...req.body,
      semana: req.body.semana ? Number(req.body.semana) : task.semana,
    });

    return res.json(task);
  } catch (err) {
    console.error("❌ updateTask:", err);
    return res.status(500).json({ message: "Error al actualizar tarea" });
  }
};

/** Eliminar tarea */
const deleteTask = async (req, res) => {
  try {
    const profesorId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    await isProfessorOfCourse(profesorId, task.courseId);

    await Task.destroy({ where: { id: taskId } });

    return res.json({ success: true });
  } catch (err) {
    console.error("❌ deleteTask:", err);
    return res.status(500).json({ message: "Error al eliminar tarea" });
  }
};

module.exports = {
  createTask,
  getTasksByProfessor,
  getTasksByCourse,
  updateTask,
  deleteTask,
};
