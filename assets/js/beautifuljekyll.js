
const jobscatscontent = document.getElementById('job-cats-content');
const jobcatsbtn = document.getElementById('job-cats-button');
jobcatsbtn.addEventListener('click', (e) => {
  jobscatscontent.classList.toggle('hideme');
});

const buttons = document.querySelectorAll(".job-entry");
const jobsviewed = document.querySelectorAll('[id^="job-id-"]'); // 

const detailsviewed = document.querySelectorAll('[id^="job-details-"]'); // 


// loop through each button and add a click event listener
buttons.forEach(function(btn) {

  btn.addEventListener("click", function() {

    detailsviewed.forEach( detailviewed => {
      detailviewed.classList.add('hideme');
    });
    jobsviewed.forEach( jobviewed => {
      jobviewed.classList.remove('current-view');
    });

    document.getElementById( 'job-id-' + this.id ).classList.add('current-view');
    document.getElementById( 'job-details-' + this.id ).classList.toggle('hideme');

  });
});

