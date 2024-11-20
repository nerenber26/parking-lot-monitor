document.addEventListener('DOMContentLoaded', function () {
    console.log('JavaScript file is connected!');
  });



const dropdown = document.querySelector('.dropdown');
const dropbtn = document.querySelector('.dropbtn');
const dropdownContent = document.querySelector('.dropdown-content');



dropbtn.addEventListener('click', () => {
  dropdownContent.classList.toggle('show');
  console.log("button selected");
});