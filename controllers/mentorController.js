
const Mentor = require('../models/mentor');
const Student = require('../models/student');


exports.createMentor = async (req, res) => {
    try {
        const mentor = new Mentor({ name: req.body.name });
        await mentor.save();
        res.status(201).send(mentor);
    } catch (error) {
        res.status(400).send('Error creating mentor: ' + error.message);
    }
};


exports.assignStudentsToMentor = async (req, res) => {
    const { mentorId } = req.params;
    const { studentIds } = req.body;

    try {
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) return res.status(404).send('Mentor not found');

        const students = await Student.find({ _id: { $in: studentIds }, mentor: null });
        if (students.length !== studentIds.length) return res.status(400).send('Some students already have a mentor');

        students.forEach(student => {
            student.mentor = mentor._id;
            mentor.students.push(student._id);
        });

        await Promise.all([mentor.save(), ...students.map(student => student.save())]);

        res.send(mentor);
    } catch (error) {
        res.status(400).send('Error assigning students: ' + error.message);
    }
};


exports.getStudentsForMentor = async (req, res) => {
    const { mentorId } = req.params;

    try {
        const mentor = await Mentor.findById(mentorId).populate('students');
        if (!mentor) return res.status(404).send('Mentor not found');

        res.send(mentor.students);
    } catch (error) {
        res.status(400).send('Error fetching students: ' + error.message);
    }
};
