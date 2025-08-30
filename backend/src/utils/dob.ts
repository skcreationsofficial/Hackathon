// utils/calculateAge.ts

// Function to calculate age based on date of birth (dob)
function calculateAge(dob: Date): number {
    const diffInMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffInMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Calculate years from dob
}

export default calculateAge;