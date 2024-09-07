
const Student = require('../models/student');
const Mentor = require('../models/mentor');


exports.createStudent = async (req, res) => {
    try {
        const student = new Student({ name: req.body.name });
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send('Error creating student: ' + error.message);
    }
};


exports.assignOrChangeMentor = async (req, res) => {
    const { studentId } = req.params;
    const { mentorId } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).send('Student not found');

        const mentor = await Mentor.findById(mentorId);
        if (!mentor) return res.status(404).send('Mentor not found');

        if (student.mentor) {
            const previousMentor = await Mentor.findById(student.mentor);
            previousMentor.students.pull(student._id);
            await previousMentor.save();
        }

        student.mentor = mentor._id;
        mentor.students.push(student._id);

        await Promise.all([student.save(), mentor.save()]);

        res.send(student);
    } catch (error) {
        res.status(400).send('Error changing mentor: ' + error.message);
    }
};


exports.getCurrentMentorForStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId).populate('mentor');
        if (!student) return res.status(404).send('Student not found');

        res.send(student.mentor);
    } catch (error) {
        res.status(400).send('Error fetching mentor: ' + error.message);
    }
};
