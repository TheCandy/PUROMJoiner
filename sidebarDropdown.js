//* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - This allows the user to have multiple dropdowns without any conflict */
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value;
}

jQuery(".sidenav > div").hide();


var menuRoll = jQuery("#mySidenav").children().toArray()
var fromTop = 20
menuRoll.forEach(element => {

  jQuery("#" + element.id).css("top", fromTop + "px");
  jQuery("#" + element.id).css("--width", "100px");

  element.addEventListener("click", function () {
    jQuery(".sidenav > div").hide();
    jQuery("#mySidenav > div").removeClass("colouredSelection");
    jQuery("#" + element.id).addClass("colouredSelection");
    jQuery("#" + element.id + "Container").show();
  });

  fromTop = fromTop + 60
});

var menuRoll = jQuery("#mySidenav2").children().toArray()
var fromTop = 20
menuRoll.forEach(element => {

  jQuery("#" + element.id).css("top", fromTop + "px");
  jQuery("#" + element.id).css("--width", "180px");

  element.addEventListener("click", function () {
    jQuery(".sidenav > div").hide();
    jQuery("#mySidenav2 > div").removeClass("colouredSelection");
    jQuery("#" + element.id).addClass("colouredSelection");
    jQuery("#" + element.id + "Container").show();
  });

  fromTop = fromTop + 60
});
