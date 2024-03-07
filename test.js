const currentDate = new Date();
const futureDate = new Date(currentDate.getTime() + 60 * 60 * 1000);

console.log('Current time:', currentDate);
console.log('1 hour from now:', futureDate);

// Compare the two dates
if (futureDate > currentDate) {
  console.log('The future date is later than the current date.');
} else if (futureDate < currentDate) {
  console.log('The future date is earlier than the current date.');
} else {
  console.log('The current time and future time are the same.');
}