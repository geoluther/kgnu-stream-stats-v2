// client-side js
// run by the browser each time your view template is loaded

fetch("/stats")
  .then(response => response.json())
  .then(data => {
    console.log("inside");
    // console.log(data)
    // document.getElementById("kgnu-stats").innerHTML = data.kgnu;
  document.getElementById("kgnu-stats").innerHTML = "foo";
  });

fetch("/week")
  .then(res => res.json())
  .then(data => {
    // console.log(data)
    document.getElementById("data-json").innerHTML = data[0].total;
    $.each(data, function(key, value) {
      let total = value.total;
      let kgnu = value.kgnu;
      let afterfm = value.afterfm;
      let date = new Date(value.date);
      let result =
        "<li>Total: " + total + " KGNU: " + kgnu + " Date: " + date + "</li>";
      console.log(result);
      $("#myList").append(result);
    });
  })
  .catch(error => console.error(error));
