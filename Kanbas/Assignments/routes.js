import db from "../Database/index.js";
export default function AssignmentRoutes(app) {
  app.get("/api/courses/:cid/assignments", (req, res) => {
    const { cid } = req.params;
    const assignments = db.assignments.filter((a) => a.course === cid);
    res.json(assignments);
  });

  app.post("/api/courses/:cid/assignments", (req, res) => {
    const { cid } = req.params;
    const newAssignment = {
      ...req.body,
      course: cid,
      _id: new Date().getTime().toString(),
    };
    db.assignments.push(newAssignment);
    res.status(201).json(newAssignment);
  });
  app.put("/api/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    const assignmentIndex = db.assignments.findIndex(a => a._id === aid);
    if (assignmentIndex !== -1) {
      db.assignments[assignmentIndex] = {
        ...db.assignments[assignmentIndex],
        ...req.body
      };
      res.sendStatus(204);
    } else {
      res.status(404).send('Assignment not found');
    }
  });
  app.delete("/api/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    const initialLength = db.assignments.length;
    db.assignments = db.assignments.filter(a => a._id !== aid);
    if (db.assignments.length < initialLength) {
      res.sendStatus(204);
    } else {
      res.status(404).send('Assignment not found');
    }
  });
}