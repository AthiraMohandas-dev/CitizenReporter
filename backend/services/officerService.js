const officers = require("../data/officers.json");

function getOfficer(category, district) {

    const department = officers[category];

    if (!department) {
        return null;
    }

    const districtData = department.districts[district];

    if (!districtData) {
        return {
            department: department.department,
            email: null,
            emergencyNumber: department.emergencyNumber
        };
    }

    return {
        department: department.department,
        email: districtData.email,
        emergencyNumber: department.emergencyNumber
    };

}

module.exports = {
    getOfficer
};