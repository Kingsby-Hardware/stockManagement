$(function () {
    $(document).on('click', '.productUpdate', function () {
      alert("running.... js");
      var thisElement = $(this);
    //   console.log(thisElement);
    //   var Name = thisElement.attr('data-name');
      var Identifier = thisElement.attr('data-identifier');
    //   alert(Name);
      alert(Identifier);
  
      $('#addProductModal').find('.modal-body #productId').val(Identifier);
      // $('#modal-delete').find('#deleteBtn').getAtrribut(Name);
    //   var btn = document.getElementById("deleteBtn");
      
    //   // Setting new attributes
    //   btn.setAttribute("data-identifier", Identifier);
  
  
    });
  
  });